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

// ts-node 14_3_change_vote_operator.ts --network testnet --key testnet --hub-address terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88

// ts-node 14_3_change_vote_operator.ts --network mainnet --key mainnet --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk

(async function () {
  const terra = createLCDClient(argv["network"]);
  const worker = await createWallet(terra, argv["key"], argv["key-dir"]);

  const { txhash } = await sendTxWithConfirm(worker, [
    new MsgExecuteContract(
      worker.key.accAddress(getPrefix()),
      argv["hub-address"],
      <ExecuteMsg>{
        update_config: {
          // vote_operator:
          //   "terra1xvef2n7kky4ffzg6yl0rrej9j9d6prdgn79na7yxzcy006znkqwsrztmg5",
          epoch_period: Math.ceil((5 * 24 * 60 * 60) / 7),
          unbond_period: 5 * 24 * 60 * 60,
        },
      }
    ),
  ]);
  console.log(`Success! Txhash: ${txhash}`);
})();
