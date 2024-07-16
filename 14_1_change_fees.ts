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

// ts-node 14_1_change_fees.ts --network mainnet --key mainnet --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk

// ts-node 14_1_change_fees.ts --network migaloo --key mainnet-migaloo --hub-address migaloo1436kxs0w2es6xlqpp9rd35e3d0cjnw4sv8j3a7483sgks29jqwgshqdky4
// migaloo17w97atfwdnjpe6wywwsjjw09050aq9s78jjjsmrmhhqtg7nevpmq0u8t9v

// ts-node 14_1_change_fees.ts --network osmosis --key key-mainnet --hub-address osmo1dv8wz09tckslr2wy5z86r46dxvegylhpt97r9yd6qc3kyc6tv42qa89dr9

(async function () {
  const terra = createLCDClient(argv["network"]);
  const worker = await createWallet(terra, argv["key"], argv["key-dir"]);

  const { txhash } = await sendTxWithConfirm(worker, [
    new MsgExecuteContract(
      worker.key.accAddress(getPrefix()),
      argv["hub-address"],
      <ExecuteMsg>{
        update_config: {
          protocol_reward_fee: "0.1",
          // protocol_fee_contract: "osmo1z3txc4x7scxsypx9tgynyfhu48nw60a5dwp8jc",
        },
      }
    ),
  ]);
  console.log(`Success! Txhash: ${txhash}`);
})();
