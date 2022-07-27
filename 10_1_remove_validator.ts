import { MsgExecuteContract } from "@terra-money/terra.js";
import yargs from "yargs/yargs";
import { createLCDClient, createWallet, sendTxWithConfirm } from "./helpers";
import * as keystore from "./keystore";
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

// ts-node 10_1_remove_validator.ts --network testnet --key testnet --hub-address terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88 --validator-address terravaloper15lsftv92eyssjwkh2393s0nhjc07kryqen2fqf

// ts-node 10_1_remove_validator.ts --network mainnet --key mainnet --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --validator-address terravaloper13fkxypqa0e3lvzu2fay7mslc2xsghv26a3a7jl
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
