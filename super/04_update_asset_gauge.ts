import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import { Chains, createLCDClient, createWallet, getInfo, getPrefix, sendTxWithConfirm } from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/ve3/asset-gauge/execute";
import { SuperInfoKeys } from "./config";

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
  })
  .parseSync();

(async function () {
  const network = argv["network"] as Chains;
  const terra = createLCDClient(network);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const address = admin.key.accAddress(getPrefix());
  const contract = getInfo("super", network, SuperInfoKeys.asset_gauge_addr);

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(address, contract, <ExecuteMsg>{
        update_config: {
          update_gauge: {
            min_gauge_percentage: "0.01",
            name: "single",
          },
        },
      }),
    ]
  );
  console.log(`Txhash: ${txhash}`);
})();
