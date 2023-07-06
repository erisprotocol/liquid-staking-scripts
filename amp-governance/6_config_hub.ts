import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  Chains,
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/hub/execute_msg";

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

// MIGALOO
// ts-node amp-governance/6_config_hub.ts --network migaloo --key mainnet-migaloo --contract migaloo1436kxs0w2es6xlqpp9rd35e3d0cjnw4sv8j3a7483sgks29jqwgshqdky4

// KUJIRA
// ts-node amp-governance/6_config_hub.ts --network kujira --key mainnet-kujira --contract kujira1n3fr5f56r2ce0s37wdvwrk98yhhq3unnxgcqus8nzsfxvllk0yxquurqty

// ts-node amp-governance/6_config_hub.ts --network archwaytest --key mainnet-archway --contract archway102t7f76edspqrpvqq7xe93uk5q7uhknqccrxa73va0knjyupd2ksexhhky
// ts-node amp-governance/6_config_hub.ts --network archway --key mainnet-archway --contract archway1yg4eq68xyll74tdrrcxkr4qpam4j9grknunmp74zzc6km988dadqy0utmj

const templates: Partial<Record<Chains, ExecuteMsg>> = {
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
  mainnet: <ExecuteMsg>{
    update_config: {
      // delegation_strategy: "uniform",
      delegation_strategy: {
        gauges: {
          amp_factor_bps: 10000,
          amp_gauges:
            "terra1aumv9uyv2ltf8upsf88338ctf922q439a0v2tpss5s2j9g0j8zzsrtq9t2",
          // emp_gauges:
          //   "terra14s88p4t7uxqdf96vgsnqavx68lzgpcp3dy505hlywjm2tm9p97ms0ks83a",
          max_delegation_bps: 2500,
          min_delegation_bps: 50,
          validator_count: 30,
        },
      },
      // vote_operator:
      //   "terra1z0cxlq62a9dsjhz7g7hhgpuplcl32c0qeckhm9jyggln0rxq6z8syesq8j",
      // protocol_reward_fee: "0",
    },
  },

  migaloo: <ExecuteMsg>{
    update_config: {
      // delegation_strategy: "uniform",
      delegation_strategy: {
        gauges: {
          amp_factor_bps: 10000,
          amp_gauges:
            "migaloo14haqsatfqxh3jgzn6u7ggnece4vhv0nt8a8ml4rg29mln9hdjfdqpz474l",
          // emp_gauges:
          //   "terra14s88p4t7uxqdf96vgsnqavx68lzgpcp3dy505hlywjm2tm9p97ms0ks83a",
          max_delegation_bps: 2500,
          min_delegation_bps: 50,
          validator_count: 30,
        },
      },
      vote_operator:
        "migaloo1j2x4vsm2a5qefkvgr7gl30gf2puvsa504plzwgdhwl3wvm5lxayquvvsfq",
      // protocol_reward_fee: "0",
    },
  },
  kujira: <ExecuteMsg>{
    update_config: {
      // delegation_strategy: "uniform",
      delegation_strategy: {
        gauges: {
          amp_factor_bps: 10000,
          amp_gauges:
            "kujira13kqc9jye2kcak4q9nl4p8zuhf9he2f32vvr8ds9lkd46aa0e936spmx7v4",
          // emp_gauges:
          //   "terra14s88p4t7uxqdf96vgsnqavx68lzgpcp3dy505hlywjm2tm9p97ms0ks83a",
          max_delegation_bps: 2500,
          min_delegation_bps: 50,
          validator_count: 30,
        },
      },
      vote_operator:
        "kujira130umtav4d6dpfjat92d92wauq25ll6gzvfqx9hqcp8m86myy2q9qlr00u9",
      // protocol_reward_fee: "0",
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
