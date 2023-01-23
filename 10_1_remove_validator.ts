import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "./helpers";
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
// ts-node 10_1_remove_validator.ts --network testnet --key testnet --hub-address terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88 --validator-address terravaloper1cevf3xwxm8zjhj7yrnjc0qy6y6ng98lxgxp79x

// terravaloper1cevf3xwxm8zjhj7yrnjc0qy6y6ng98lxgxp79x

// ts-node 10_1_remove_validator.ts --network mainnet --key mainnet --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --validator-address terravaloper13fkxypqa0e3lvzu2fay7mslc2xsghv26a3a7jl
// ts-node 10_1_remove_validator.ts --network mainnet --key mainnet --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --validator-address terravaloper199fjq4rnfvz24cktl8cervx8h8e90rukmgdv5x
// ts-node 10_1_remove_validator.ts --network classic --key mainnet --hub-address terra1zmf49p3wl7ck2cwer7kghzumfpwhfqk6x893ah --validator-address terravaloper1k5hw6rl060zpnnjhgnvky9cs8evrts2g2l28tt

// ts-node 10_1_remove_validator.ts --network classic --key mainnet --hub-address terra1zmf49p3wl7ck2cwer7kghzumfpwhfqk6x893ah --validator-address terravaloper1z7we2y02fy2kvw0tdq8k26j4t370n58wxvl4ge

// JUNO
// ts-node 10_1_remove_validator.ts --network juno --key mainnet-juno --hub-address juno17cya4sw72h4886zsm2lk3udxaw5m8ssgpsl6nd6xl6a4ukepdgkqeuv99x --validator-address junovaloper1ncu32g0lzhk0epzdar7smd3qv9da2n8w8mwn4k

(async function () {
  const terra = createLCDClient(argv["network"]);
  const worker = await createWallet(terra, argv["key"], argv["key-dir"]);

  const { txhash } = await sendTxWithConfirm(worker, [
    new MsgExecuteContract(
      worker.key.accAddress(getPrefix()),
      argv["hub-address"],
      <ExecuteMsg>{
        remove_validator: {
          validator: argv["validator-address"],
        },
      }
    ),
  ]);
  console.log(`Success! Txhash: ${txhash}`);
})();
