import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import { Chains, createLCDClient, createWallet, getInfo, getPrefix, sendTxWithConfirm } from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/ve3/voting-escrow/execute";
import { SuperInfoKeys } from "./config";

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
  })
  .parseSync();

(async function () {
  const network = argv["network"] as Chains;
  const terra = createLCDClient(network);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const address = admin.key.accAddress(getPrefix());
  const contract = getInfo("super", network, SuperInfoKeys.voting_escrow_addr);
  const push_update = getInfo("super", network, SuperInfoKeys.asset_gauge_addr);

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(address, contract, <ExecuteMsg>{
        update_config: {
          push_update_contracts: [push_update],
        },
      }),
    ]
  );
  console.log(`Txhash: ${txhash}`);
})();
