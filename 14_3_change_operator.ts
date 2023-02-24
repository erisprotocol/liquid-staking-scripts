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
  })
  .parseSync();

// ts-node 14_3_change_operator.ts --network testnet-migaloo --key testnet-migaloo --hub-address migaloo1r0krq4hfttfuyd4tvcqnjk887xqeq0xae3u4qtya35qsfqy2trlqxavmra

(async function () {
  const terra = createLCDClient(argv["network"]);
  const worker = await createWallet(terra, argv["key"], argv["key-dir"]);

  const { txhash } = await sendTxWithConfirm(worker, [
    new MsgExecuteContract(
      worker.key.accAddress(getPrefix()),
      argv["hub-address"],
      <ExecuteMsg>{
        update_config: {
          operator: "migaloo1ugmmclpunq08v4uwj2q2knr9e3uveakwrxu0zu",
        },
      }
    ),
  ]);
  console.log(`Success! Txhash: ${txhash}`);
})();
