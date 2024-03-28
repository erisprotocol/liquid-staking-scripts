import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "../../helpers";
import * as keystore from "../../keystore";
import { ExecuteMsg } from "../../types/restake_gauges/execute";

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

(async function () {
  const terra = createLCDClient(argv["network"]);
  const worker = await createWallet(terra, argv["key"], argv["key-dir"]);

  const { txhash } = await sendTxWithConfirm(worker, [
    new MsgExecuteContract(
      worker.key.accAddress(getPrefix()),
      argv["contract"],
      <ExecuteMsg>{
        update_config: {
          restake_hub_addr:
            "migaloo1fl005yh4ztvfv4qgr4vc96uz5h658ztgu0n5gu5lpma96g8ya32s6sus5v",
        },
      }
    ),
  ]);
  console.log(`Success! Txhash: ${txhash}`);
})();
