import { MsgExecuteContract } from "@terra-money/terra.js";
import yargs from "yargs/yargs";
import { createLCDClient, createWallet, sendTxWithConfirm } from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/amp_gauges/eris_gov_amp_gauges_execute";

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
// empgauge ts-node amp-governance/7_update_validators_limit.ts --network testnet --key testnet --contract terra14s88p4t7uxqdf96vgsnqavx68lzgpcp3dy505hlywjm2tm9p97ms0ks83a
// ampgauge ts-node amp-governance/7_update_validators_limit.ts --network testnet --key testnet --contract terra1yvnfpwf9r7h0s7u5sws6yysh0am7nahjrrw95ph2xw6rzgcw8u4sf7esam

const templates: Record<string, ExecuteMsg> = {
  testnet: <ExecuteMsg>{
    update_config: {
      validators_limit: 100,
    },
  },
  mainnet: <ExecuteMsg>{},
};

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const msg = templates[argv["network"]];
  console.log("msg", msg);

  const { txhash } = await sendTxWithConfirm(deployer, [
    new MsgExecuteContract(deployer.key.accAddress, argv.contract, msg),
  ]);
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
