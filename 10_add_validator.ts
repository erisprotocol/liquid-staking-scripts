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

// ts-node 10_add_validator.ts --network testnet --key testnet --hub-address terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88 --validator-address terravaloper15lsftv92eyssjwkh2393s0nhjc07kryqen2fqf

// ts-node 10_add_validator.ts --network mainnet --key mainnet --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --validator-address terravaloper1tz203ptlsfs8c63f2j0d0872pt5frjrvtfg0vd
// ts-node 10_add_validator.ts --network mainnet --key mainnet --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --validator-address terravaloper10c04ysz9uznx2mkenuk3j3esjczyqh0j783nzt
// ts-node 10_add_validator.ts --network mainnet --key mainnet --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --validator-address terravaloper1vrkzjujfds9p8t5g0xety3e3ft4dep02etv9le
// ts-node 10_add_validator.ts --network mainnet --key mainnet --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --validator-address terravaloper1f6wuq93320s6w7vvnkc0576g9mtqfmz9a8wqxk

// ts-node 10_add_validator.ts --network mainnet --key mainnet --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --validator-address terravaloper1lelhxdzwn9ddecv6sv0kcxj5tguurxnzcfs5wf
// ts-node 10_add_validator.ts --network mainnet --key mainnet --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --validator-address terravaloper1rr2g4z2ch4cqwl8s70yj94a5l2vakg0v36nmjh
// ts-node 10_add_validator.ts --network mainnet --key mainnet --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --validator-address terravaloper1cqc26lnatzxvu0z5nd4yx8m4ecllkm7jlakwrw

(async function () {
  const terra = createLCDClient(argv["network"]);
  const worker = await createWallet(terra, argv["key"], argv["key-dir"]);

  const { txhash } = await sendTxWithConfirm(worker, [
    new MsgExecuteContract(worker.key.accAddress, argv["hub-address"], <
      ExecuteMsg
    >{
      add_validator: {
        validator: argv["validator-address"],
      },
    }),
  ]);
  console.log(`Success! Txhash: ${txhash}`);
})();
