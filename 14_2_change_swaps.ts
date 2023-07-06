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

// Classic Testnet
// ts-node 14_2_change_swaps.ts --network classic-testnet --key mainnet --hub-address terra1lpj9g73lpe8h5jmlg67r57j23grkzkuelzt2ts
// Classic
// ts-node 14_2_change_swaps.ts --network classic --key mainnet --hub-address terra1zmf49p3wl7ck2cwer7kghzumfpwhfqk6x893ah

(async function () {
  const terra = createLCDClient(argv["network"]);
  const worker = await createWallet(terra, argv["key"], argv["key-dir"]);

  const { txhash } = await sendTxWithConfirm(worker, [
    new MsgExecuteContract(
      worker.key.accAddress(getPrefix()),
      argv["hub-address"],
      <ExecuteMsg>{
        update_config: {
          swap_config: [
            // {
            //   denom: "uusd",
            //   contract: "terra1m6ywlgn6wrjuagcmmezzz2a029gtldhey5k552",
            // },
          ],
        },
      }
    ),
  ]);
  console.log(`Success! Txhash: ${txhash}`);
})();
