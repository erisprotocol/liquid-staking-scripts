import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "./helpers";
import * as keystore from "./keystore";
import { ExecuteMsg } from "./types/alliance-hub-lst/execute";

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

// Terra
// ampWhale
// ts-node 14_2_change_swaps_ah.ts --network mainnet --key mainnet --hub-address terra1j35ta0llaxcf55auv2cjqau5a7aee6g8fz7md7my7005cvh23jfsaw83dy
// boneWhale
// ts-node 14_2_change_swaps_ah.ts --network mainnet --key mainnet --hub-address terra10j3zrymfrkta2pxe0gklc79gu06tqyuy8c3kh6tqdsrrprsjqkrqzfl4df

(async function () {
  const terra = createLCDClient(argv["network"]);
  const worker = await createWallet(terra, argv["key"], argv["key-dir"]);

  const { txhash } = await sendTxWithConfirm(worker, [
    new MsgExecuteContract(
      worker.key.accAddress(getPrefix()),
      argv["hub-address"],
      <ExecuteMsg>{
        update_config: {
          // protocol_reward_fee: "0.069",
          protocol_fee_contract:
            "terra1v3h5lejqer5qnjnj6gds94u55x0qsxq7cpxs2kf7kqu6drwgmz4qd9qav9",
          //   stages_preset: [
          //     // [
          //     //   [
          //     //     {
          //     //       dex: {
          //     //         addr: "terra13cw46g72kwtgln0540j9cqa79ham5k86jlx34e2pqukww6v0v3yseakged",
          //     //       },
          //     //     },
          //     //     tokens.luna,
          //     //     null,
          //     //     null,
          //     //   ],
          //     // ],
          //     [
          //       [
          //         {
          //           dex: {
          //             addr: "terra1zushwxgqdkg22mtv9p946yp53r6den6lv427esjaadua3ftzyjpsqgtl5z",
          //           },
          //         },
          //         tokens.luna,
          //         null,
          //         null,
          //       ],
          //     ],
          //     [
          //       [
          //         {
          //           dex: {
          //             // addr: "terra1ntx595elf3ukxcd0wy76h24rzztcv2p6n3wmfd358ks95prv42fs9mn63n",
          //             addr: "terra1j9jmsplecj9ay2py27953p84nfmv7f6ce75ms5fleyhd0aecpc7q0hgmsa",
          //           },
          //         },
          //         tokens.whale,
          //         null,
          //         null,
          //       ],
          //     ],
          //   ],
        },
      }
    ),
  ]);
  console.log(`Success! Txhash: ${txhash}`);
})();
