import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/update-scaling-factor/eris_update_scaling_factor_execute";

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

// ts-node chain/osmosis_update_scaling_factor.ts --network osmosis --key key-mainnet --contract osmo16r0c97w2w9u894mcgee2c0wysjkve6cvwhr6kesrtzf3vy80v3gszdcesp

(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);
  const address = admin.key.accAddress(getPrefix());

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(address, argv.contract, <ExecuteMsg>{
        update_config: {
          // pool_id: 1067,
          // scale_first: false,
          decimals: 4,
        },
      }),
    ]
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
