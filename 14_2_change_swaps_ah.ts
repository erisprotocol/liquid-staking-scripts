import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import { tokens_migaloo } from "./amp-compounder/tokens";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "./helpers";
import * as keystore from "./keystore";
import {
  Decimal,
  ExecuteMsg,
  Uint128,
} from "./types/alliance-hub-lst/eris_alliance_hub_lst_terra_execute";
import {
  AssetInfoBaseFor_Addr,
  ExecuteMsg as ExecuteMsgWW,
  StageType,
} from "./types/alliance-hub-lst/eris_alliance_hub_lst_whitewhale_execute";

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
// ampWhalet
// ts-node 14_2_change_swaps_ah.ts --network mainnet --key mainnet --hub-address terra1j35ta0llaxcf55auv2cjqau5a7aee6g8fz7md7my7005cvh23jfsaw83dy
// boneWhalet
// ts-node 14_2_change_swaps_ah.ts --network mainnet --key mainnet --hub-address terra10j3zrymfrkta2pxe0gklc79gu06tqyuy8c3kh6tqdsrrprsjqkrqzfl4df

// Migaloo
// ampUSDC ts-node 14_2_change_swaps_ah.ts --network migaloo --key key-mainnet --hub-address migaloo1cwk3hg5g0rz32u6us8my045ge7es0jnmtfpwt50rv6nagk5aalasa733pt
// ampASH ts-node 14_2_change_swaps_ah.ts --network migaloo --key key-mainnet --hub-address migaloo1cmcnld5q4z9nltml664nuxthcrz5r9vpfv0efgadxj4pwl3ry8yq26nk76
// ampGASH ts-node 14_2_change_swaps_ah.ts --network migaloo --key key-mainnet --hub-address migaloo1nsskhvvh0msm7d5ke2kfg24a8d4jecsnxd28s27h0uz5kf9ap60shlqmcl
//
(async function () {
  const terra = createLCDClient(argv["network"]);
  const worker = await createWallet(terra, argv["key"], argv["key-dir"]);

  const { txhash } = await sendTxWithConfirm(worker, [
    new MsgExecuteContract(
      worker.key.accAddress(getPrefix()),
      argv["hub-address"],
      <ExecuteMsg | ExecuteMsgWW>{
        update_config: {
          // protocol_reward_fee: "0.1",
          // protocol_fee_contract:
          //   "terra1v3h5lejqer5qnjnj6gds94u55x0qsxq7cpxs2kf7kqu6drwgmz4qd9qav9",
          // stages_preset: [
          //   // [
          //   //   [
          //   //     {
          //   //       dex: {
          //   //         addr: "terra13cw46g72kwtgln0540j9cqa79ham5k86jlx34e2pqukww6v0v3yseakged",
          //   //       },
          //   //     },
          //   //     tokens.luna,
          //   //     null,
          //   //     null,
          //   //   ],
          //   // ],

          // [
          //   [
          //     {
          //       dex: {
          //         addr: "terra1zushwxgqdkg22mtv9p946yp53r6den6lv427esjaadua3ftzyjpsqgtl5z",
          //       },
          //     },
          //     tokens.luna,
          //     null,
          //     null,
          //     true,
          //   ],
          // ],
          //   [
          //     [
          //       {
          //         dex: {
          //           // whale -> ampwhale
          //           // addr: "terra1ntx595elf3ukxcd0wy76h24rzztcv2p6n3wmfd358ks95prv42fs9mn63n",
          //           // whale -> bwhale
          //           addr: "terra1j9jmsplecj9ay2py27953p84nfmv7f6ce75ms5fleyhd0aecpc7q0hgmsa",
          //         },
          //       },
          //       tokens.whale,
          //       null,
          //       null,
          //       null,
          //     ],
          //   ],
          // ],

          // whale -> usdc -> musdc
          // stages_preset: [
          //   [
          //     [
          //       {
          //         dex: {
          //           addr: "migaloo1xv4ql6t6r8zawlqn2tyxqsrvjpmjfm6kvdfvytaueqe3qvcwyr7shtx0hj",
          //         },
          //       },
          //       { native: tokens_migaloo.whale.native_token.denom },
          //       null,
          //       null,
          //     ],
          //   ],
          //   [
          //     [
          //       {
          //         dex: {
          //           addr: "migaloo1y307cryg02zacv43sgxly5gnugj4nva5hfqkcc37yh0gr5q42cmqlrpyw3",
          //         },
          //       },
          //       { native: tokens_migaloo.usdc.native_token.denom },
          //       null,
          //       null,
          //     ],
          //   ],
          // ],

          // stages_preset: [
          //   [
          //     [
          //       {
          //         dex: {
          //           addr: "migaloo1u4npx7xvprwanpru7utv8haq99rtfmdzzw6p3hpfc38n7zmzm42q8ydga3",
          //         },
          //       },
          //       { native: tokens_migaloo.whale.native_token.denom },
          //       null,
          //       null,
          //     ],
          //   ],
          // ],

          // ampGASH
          // whale -> ash: migaloo1u4npx7xvprwanpru7utv8haq99rtfmdzzw6p3hpfc38n7zmzm42q8ydga3
          // ash -> guppy: migaloo16yra8pf3ntm6ljjnja2w046zka3wm68fvd3x08htfdpn2mumqwkst7mllv
          // guppy -> gash: burn migaloo1r9x8fz4alekzr78k42rpmr9unpa7egsldpqeynmwl2nfvzexue9sn8l5rg
          stages_preset: [
            [
              [
                {
                  dex: {
                    addr: "migaloo1u4npx7xvprwanpru7utv8haq99rtfmdzzw6p3hpfc38n7zmzm42q8ydga3",
                  },
                },
                {
                  native: tokens_migaloo.whale.native_token.denom,
                } as AssetInfoBaseFor_Addr,
                null,
                null,
                true,
              ],
            ],
            [
              [
                {
                  dex: {
                    addr: "migaloo16yra8pf3ntm6ljjnja2w046zka3wm68fvd3x08htfdpn2mumqwkst7mllv",
                  },
                },
                { native: tokens_migaloo.ash.native_token.denom },
                null,
                null,
                null,
              ],
            ],
            [
              [
                {
                  burn: {
                    addr: "migaloo1r9x8fz4alekzr78k42rpmr9unpa7egsldpqeynmwl2nfvzexue9sn8l5rg",
                  },
                },
                { native: tokens_migaloo.guppy.native_token.denom },
                null,
                null,
                null,
              ],
            ],
          ] as [
            StageType,
            AssetInfoBaseFor_Addr,
            Decimal | null,
            Uint128 | null,
            boolean | null
          ][][],
        },
      }
    ),
  ]);
  console.log(`Success! Txhash: ${txhash}`);
})();
