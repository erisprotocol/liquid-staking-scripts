import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  Chains,
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/ica/hub/execute";

const argv = yargs(process.argv)
  .options({
    network: {
      type: "string",
      demandOption: true,
    },
    key: {
      type: "string",
      demandOption: true,
    },
    "key-dir": {
      type: "string",
      demandOption: false,
      default: keystore.DEFAULT_KEY_DIR,
    },
    contract: {
      type: "string",
      demandOption: true,
    },
  })
  .parseSync();

const templates: Partial<Record<Chains, ExecuteMsg>> = {
  "testnet-kujira": {
    admin: {
      create_accounts: {
        connection_id: "connection-47",
        controller_channel: "channel-51",
        host_channel: "channel-4004",
        host_prefix: "cosmos",
        version:
          '{"version":"ics27-1","controller_connection_id":"connection-47","host_connection_id":"connection-3519","address":"","encoding":"proto3","tx_type":"sdk_multi_msg"}',
      },
    },
  },
};

// ts-node arb-vault/10_update_config.ts --network mainnet --key mainnet --contract terra1r9gls56glvuc4jedsvc3uwh6vj95mqm9efc7hnweqxa2nlme5cyqxygy5m
(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const account = admin.key.accAddress(getPrefix());
  const msg = templates[argv["network"] as any as Chains];
  const { txhash } = await sendTxWithConfirm(admin, [
    new MsgExecuteContract(account, argv.contract, msg!),
  ]);
  console.log(`Txhash: ${txhash}`);
})();
