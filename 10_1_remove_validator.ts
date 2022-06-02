import yargs from "yargs/yargs";
import { MsgExecuteContract } from "@terra-money/terra.js";
import * as keystore from "./keystore";
import { createLCDClient, createWallet, sendTxWithConfirm } from "./helpers";
import { ExecuteMsg } from "./types/hub/execute_msg";

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
    "hub-address": {
      type: "string",
      demandOption: true,
    },
    "validator-address": {
      type: "string",
      demandOption: true,
    },
  })
  .parseSync();

// ts-node 10_1_remove_validator.ts --network testnet --key testnet --hub-address terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88 --validator-address terravaloper1uxx32m0u5svtvrujnpcs6pxuv7yvn4pjhl0fux

// ts-node 10_1_remove_validator.ts --network mainnet --key mainnet --hub-address terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88 --validator-address terravaloper1uxx32m0u5svtvrujnpcs6pxuv7yvn4pjhl0fux
//
(async function () {
  const terra = createLCDClient(argv["network"]);
  const worker = await createWallet(terra, argv["key"], argv["key-dir"]);

  const { txhash } = await sendTxWithConfirm(worker, [
    new MsgExecuteContract(worker.key.accAddress, argv["hub-address"], <
      ExecuteMsg
    >{
      remove_validator: {
        validator: argv["validator-address"],
      },
    }),
  ]);
  console.log(`Success! Txhash: ${txhash}`);
})();
