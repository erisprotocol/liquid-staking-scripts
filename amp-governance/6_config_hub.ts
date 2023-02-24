import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
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

const templates: Record<string, ExecuteMsg> = {
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
          min_delegation_bps: 200,
          validator_count: 30,
        },
      },
      vote_operator:
        "terra1z0cxlq62a9dsjhz7g7hhgpuplcl32c0qeckhm9jyggln0rxq6z8syesq8j",
    },
  },
  // mainnet: <ExecuteMsg>{},
};

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const msg = templates[argv["network"]];
  console.log("msg", msg);

  const { txhash } = await sendTxWithConfirm(deployer, [
    new MsgExecuteContract(
      deployer.key.accAddress(getPrefix()),
      argv.contract,
      msg
    ),
  ]);
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
