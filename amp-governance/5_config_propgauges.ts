import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/prop_gauges/eris_gov_prop_gauges_execute";

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
// ts-node amp-governance/5_config_propgauges.ts --network testnet --key testnet --contract terra1xvef2n7kky4ffzg6yl0rrej9j9d6prdgn79na7yxzcy006znkqwsrztmg5
//

const templates: Record<string, ExecuteMsg> = {
  testnet: <ExecuteMsg>{
    update_config: {
      use_weighted_vote: true,
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
    new MsgExecuteContract(
      deployer.key.accAddress(getPrefix()),
      argv.contract,
      msg
    ),
  ]);
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
