import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import { tokens, tokens_migaloo } from "../amp-compounder/tokens";
import {
  Chains,
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg as AllianceExecuteMsg } from "../types/alliance-hub-lst/execute";
import { ExecuteMsg } from "../types/hub/execute_msg";
import { ExecuteMsg as AllianceLstExecuteMsg } from "../types/tokenfactory/alliance-lst/eris_alliance_lst_terra_execute";

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
    contract: {
      type: "string",
      demandOption: true,
    },
  })
  .parseSync();

// Testnet
// ts-node amp-governance/6_config_hub.ts --network testnet --key testnet --contract terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88

// Mainnet
// ts-node amp-governance/6_config_hub.ts --network mainnet --key mainnet --contract terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk
// CAPA ts-node amp-governance/6_config_hub.ts --network mainnet --key mainnet --contract terra186rpfczl7l2kugdsqqedegl4es4hp624phfc7ddy8my02a4e8lgq5rlx7y
// ampROAR ts-node amp-governance/6_config_hub.ts --network mainnet --key mainnet --contract terra1vklefn7n6cchn0u962w3gaszr4vf52wjvd4y95t2sydwpmpdtszsqvk9wy
// MOAR ts-node amp-governance/6_config_hub.ts --network mainnet --key mainnet --contract terra1dndhtdr2v7ca8rrn67chlqw3cl3xhm3m2uxls62vghcg3fsh5tpss5xmcu

// MIGALOO
// ts-node amp-governance/6_config_hub.ts --network migaloo --key mainnet-migaloo --contract migaloo1436kxs0w2es6xlqpp9rd35e3d0cjnw4sv8j3a7483sgks29jqwgshqdky4
// ampBTC: ts-node amp-governance/6_config_hub.ts --network migaloo --key mainnet-migaloo --contract migaloo1pll95yfcnxd5pkkrcsad63l929m4ehk4c46fpqqp3c2d488ca0csc220d0

// KUJIRA
// ts-node amp-governance/6_config_hub.ts --network kujira --key mainnet-kujira --contract kujira1n3fr5f56r2ce0s37wdvwrk98yhhq3unnxgcqus8nzsfxvllk0yxquurqty

// ts-node amp-governance/6_config_hub.ts --network archwaytest --key mainnet-archway --contract archway102t7f76edspqrpvqq7xe93uk5q7uhknqccrxa73va0knjyupd2ksexhhky
// ts-node amp-governance/6_config_hub.ts --network archway --key mainnet-archway --contract archway1yg4eq68xyll74tdrrcxkr4qpam4j9grknunmp74zzc6km988dadqy0utmj
// ts-node amp-governance/6_config_hub.ts --network osmosis --key mainnet-osmosis --contract osmo1dv8wz09tckslr2wy5z86r46dxvegylhpt97r9yd6qc3kyc6tv42qa89dr9
// ts-node amp-governance/6_config_hub.ts --network juno --key key-mainnet --contract juno17cya4sw72h4886zsm2lk3udxaw5m8ssgpsl6nd6xl6a4ukepdgkqeuv99x

// ts-node amp-governance/6_config_hub.ts --network kujira --key key-mainnet --contract kujira1n3fr5f56r2ce0s37wdvwrk98yhhq3unnxgcqus8nzsfxvllk0yxquurqty
// ts-node amp-governance/6_config_hub.ts --network kujira --key key-mainnet --contract kujira175yatpvkpgw07w0chhzuks3zrrae9z9g2y6r7u5pzqesyau4x9eqqyv0rr

const templates: Partial<
  Record<Chains, ExecuteMsg | AllianceExecuteMsg | AllianceLstExecuteMsg>
> = {
  // testnet: <ExecuteMsg>{
  //   update_config: {
  //     // delegation_strategy: "uniform",
  //     delegation_strategy: {
  //       gauges: {
  //         amp_factor_bps: 5000,
  //         amp_gauges:
  //           "terra1a507lxc7sztyfu8az5np54t6w86nhv2a0n2q5y858jf9ms5t5rsqh648jt",
  //         // emp_gauges:
  //         //   "terra14s88p4t7uxqdf96vgsnqavx68lzgpcp3dy505hlywjm2tm9p97ms0ks83a",
  //         max_delegation_bps: 4000,
  //         min_delegation_bps: 200,
  //         validator_count: 30,
  //       },
  //     },
  //   },
  // },
  testnet: <ExecuteMsg>{
    update_config: {
      // delegation_strategy: "uniform",
      delegation_strategy: {
        gauges: {
          amp_factor_bps: 5000,
          amp_gauges:
            "terra1rpa66hlslyy9jl6hxkufv83eyje2lx6022569k497ytjf7nvm7hqu3wndk",
          // emp_gauges:
          //   "terra14s88p4t7uxqdf96vgsnqavx68lzgpcp3dy505hlywjm2tm9p97ms0ks83a",
          max_delegation_bps: 4000,
          min_delegation_bps: 200,
          validator_count: 30,
        },
      },
      vote_operator:
        "terra1ut233rtsdjkdf775xq866tdvjkuazmgsyrh5n9l8ac9qpuj6sd3sr8a0q7",
    },
  },
  // mainnet: <ExecuteMsg>{
  //   update_config: {
  //     // delegation_strategy: "uniform",
  //     delegation_strategy: {
  //       gauges: {
  //         amp_factor_bps: 10000,
  //         amp_gauges:
  //           "terra1aumv9uyv2ltf8upsf88338ctf922q439a0v2tpss5s2j9g0j8zzsrtq9t2",
  //         // emp_gauges:
  //         //   "terra14s88p4t7uxqdf96vgsnqavx68lzgpcp3dy505hlywjm2tm9p97ms0ks83a",
  //         max_delegation_bps: 2500,
  //         min_delegation_bps: 50,
  //         validator_count: 30,
  //       },
  //     },
  //     // vote_operator:
  //     //   "terra1z0cxlq62a9dsjhz7g7hhgpuplcl32c0qeckhm9jyggln0rxq6z8syesq8j",
  //     // protocol_reward_fee: "0",
  //   },
  // },

  // mainnet: <ExecuteMsg>{
  //   update_config: {
  //     vote_operator:
  //       "terra1uvv5rs7jl9ugf65k3qvsc9fyt5djcuh2fnwgk37xjea0975ud07qmygr5d",
  //   },
  // },

  mainnet: <AllianceLstExecuteMsg | ExecuteMsg>{
    update_config: {
      // stages_preset: [
      //   [
      //     [
      //       {
      //         dex: {
      //           addr: "terra1g6z93vtttdrwfdtj06ha2nwc6qdxsfy8appge5l5g7wenfzg5mjq8s3r9n",
      //         },
      //       },
      //       tokens.solid,
      //       null,
      //       null,
      //     ],
      //   ],
      // ],
      // vote_operator: "terra1gtuvt6eh4m67tvd2dnfqhgks9ec6ff08c5vlup",

      // ampROAR
      // stages_preset: [
      //   [
      //     [
      //       {
      //         dex: {
      //           addr: "terra189v2ewgfx5wdhje6geefdtxefeemujplk8qw2wx3x5hdswn95l8qf4n2r0",
      //         },
      //       },
      //       tokens.luna,
      //       null,
      //       null,
      //     ],
      //   ],
      // ],

      // MOAR
      stages_preset: [
        [
          [
            {
              dex: {
                addr: "terra189v2ewgfx5wdhje6geefdtxefeemujplk8qw2wx3x5hdswn95l8qf4n2r0",
              },
            },
            tokens.luna,
            null,
            null,
            true,
          ],
        ],
        // [
        //   [
        //     {
        //       eris: {
        //         addr: "terra1vklefn7n6cchn0u962w3gaszr4vf52wjvd4y95t2sydwpmpdtszsqvk9wy",
        //       },
        //     },
        //     tokens.roar,
        //     null,
        //     null,
        //   ],
        // ],
        [
          [
            {
              dex: {
                addr: "terra1j0ackj0wru4ndj74e3mhhq6rffe63y8xd0e56spqcjygv2r0cfsqxr36k6",
              },
            },
            tokens.roar,
            null,
            null,
            null,
          ],
        ],
      ],
      // protocol_reward_fee: "0.1",

      // protocol_fee_contract:
      //   "terra1v3h5lejqer5qnjnj6gds94u55x0qsxq7cpxs2kf7kqu6drwgmz4qd9qav9",
    },
  },

  migaloo: <ExecuteMsg>{
    update_config: {
      // delegation_strategy: "uniform",
      // delegation_strategy: {
      //   gauges: {
      //     amp_factor_bps: 10000,
      //     amp_gauges:
      //       "migaloo14haqsatfqxh3jgzn6u7ggnece4vhv0nt8a8ml4rg29mln9hdjfdqpz474l",
      //     // emp_gauges:
      //     //   "terra14s88p4t7uxqdf96vgsnqavx68lzgpcp3dy505hlywjm2tm9p97ms0ks83a",
      //     max_delegation_bps: 2500,
      //     min_delegation_bps: 50,
      //     validator_count: 30,
      //   },
      // },
      // vote_operator:
      //   "migaloo1j2x4vsm2a5qefkvgr7gl30gf2puvsa504plzwgdhwl3wvm5lxayquvvsfq",
      // protocol_reward_fee: "0",

      // ampBTC
      stages_preset: [
        [
          [
            {
              dex: {
                addr: "migaloo1axtz4y7jyvdkkrflknv9dcut94xr5k8m6wete4rdrw4fuptk896su44x2z",
              },
            },
            { native: tokens_migaloo.whale.native_token.denom },
            null,
            null,
            true
          ],
        ],
      ],
    },
  },
  kujira: <ExecuteMsg>{
    update_config: {
      // // delegation_strategy: "uniform",
      // delegation_strategy: {
      //   gauges: {
      //     amp_factor_bps: 10000,
      //     amp_gauges:
      //       "kujira13kqc9jye2kcak4q9nl4p8zuhf9he2f32vvr8ds9lkd46aa0e936spmx7v4",
      //     // emp_gauges:
      //     //   "terra14s88p4t7uxqdf96vgsnqavx68lzgpcp3dy505hlywjm2tm9p97ms0ks83a",
      //     max_delegation_bps: 2500,
      //     min_delegation_bps: 50,
      //     validator_count: 30,
      //   },
      // },
      // vote_operator:
      //   "kujira130umtav4d6dpfjat92d92wauq25ll6gzvfqx9hqcp8m86myy2q9qlr00u9",
      // protocol_reward_fee: "0.05",
      vote_operator: "kujira1c023jxq099et7a44ledfwuu3sdkfq8cacpwdtj",
    },
  },
  // injective: <ExecuteMsg>{
  //   update_config: {
  //     delegation_strategy: {
  //       gauges: {
  //         amp_factor_bps: 10000,
  //         amp_gauges: "inj17w7hjaqf6qc3zp3r68q3sq3jezsg4tr3g7e0n2",
  //         max_delegation_bps: 2500,
  //         min_delegation_bps: 50,
  //         validator_count: 30,
  //       },
  //     },
  //     vote_operator: "inj1qjewg2xd0vc7q9wzrt35vy54uxlz0t6w0xn3hz",
  //   },
  // },
  archwaytest: <ExecuteMsg>{
    update_config: {
      // delegation_strategy: "uniform",
      delegation_strategy: {
        gauges: {
          amp_factor_bps: 10000,
          amp_gauges:
            "archway1ntne4eyrydxd2a80qnnggv6cj5aag60azfc2d52reytj6f8js4ns4rcwea",
          // emp_gauges:
          //   "terra14s88p4t7uxqdf96vgsnqavx68lzgpcp3dy505hlywjm2tm9p97ms0ks83a",
          max_delegation_bps: 2500,
          min_delegation_bps: 50,
          validator_count: 30,
        },
      },
      vote_operator:
        "archway16rnpysnujmp58qtd4xquxpqs3ht3h0290za7hjtztn0p7llseups8dug8q",
      // protocol_reward_fee: "0",
    },
  },
  archway: <ExecuteMsg>{
    update_config: {
      delegation_strategy: {
        gauges: {
          amp_factor_bps: 10000,
          amp_gauges:
            "archway1225r4qnj0tz3rpm0a4ukuqwe4tdyt70ut0kg308dxcpwl2s58p0qayn6n3",
          max_delegation_bps: 2500,
          min_delegation_bps: 50,
          validator_count: 30,
        },
      },
      vote_operator:
        "archway1jzkz28dmgwprmx4rnz54ny5vv8xqexcazgl2xg89x2t952fryg0qfg08at",
    },
  },
  // osmosis: <ExecuteMsg>{
  //   update_config: {
  //     delegation_strategy: {
  //       gauges: {
  //         amp_factor_bps: 10000,
  //         amp_gauges:
  //           "osmo1sx8wrjfh5dvv4s9njhcrau2c6x80t85wnlhh0lm24uu3ppgpunqs74cqk6",
  //         max_delegation_bps: 2500,
  //         min_delegation_bps: 50,
  //         validator_count: 30,
  //       },
  //     },
  //     vote_operator:
  //       "osmo1mr8dr22sc0r3yxu6rhu9kc8nq7096kw3rlh5kzc7eggk32lyc8hqdwatz3",
  //   },
  // },
  osmosis: <ExecuteMsg>{
    update_config: {
      epoch_period: 2 * 24 * 60 * 60,
      unbond_period: 14 * 24 * 60 * 60,
    },
  },
  juno: <ExecuteMsg>{
    update_config: {
      delegation_strategy: {
        gauges: {
          amp_factor_bps: 10000,
          amp_gauges:
            "juno1c4npgrxu9d9rrxrkd2xtgl8jhz3zsetq0y2mwvxhfvyggrmmvk8qkvw09e",
          max_delegation_bps: 2500,
          min_delegation_bps: 50,
          validator_count: 30,
        },
      },
      vote_operator:
        "juno1l548zam9r7j89agyptrhnn9q9f92w0a7ja5c76vkmx9sreqfz69qq688rl",
    },
  },
  sei: <ExecuteMsg>{
    update_config: {
      delegation_strategy: {
        gauges: {
          amp_factor_bps: 10000,
          amp_gauges:
            "sei1fg7f9p2jcjm339yx49evpnylpxlc2g0ahym6az3kmyqx3yg3tjwsd3wq35",
          max_delegation_bps: 2500,
          min_delegation_bps: 50,
          validator_count: 30,
        },
      },
      vote_operator:
        "sei1qwzdnwzdka4yc5z2v5rlathef44flmvh66uahsmraatcyvfyxc6sze0ec8",
    },
  },
  "testnet-kujira": <ExecuteMsg>{
    update_config: {
      vote_operator:
        "kujira1xgfxe88an654rrlm9f2rvz20hgex0aufhuzcdu3j6rx7a4tf75dsut22qk",
    },
  },
};

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const msg = templates[argv["network"] as Chains];
  console.log("msg", msg);

  const { txhash } = await sendTxWithConfirm(deployer, [
    new MsgExecuteContract(
      deployer.key.accAddress(getPrefix()),
      argv.contract,
      msg!
    ),
  ]);
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
