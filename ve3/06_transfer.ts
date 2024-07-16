import { Coin, Coins, MsgSend } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  Chains,
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirmUnsigned,
} from "../helpers";
import * as keystore from "../keystore";
import { config } from "./config";

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

  const networkConfig = config[network];
  if (!networkConfig) {
    throw new Error(`no data available for network ${network}`);
  }

  const { txhash } = await sendTxWithConfirmUnsigned(
    admin,
    [
      new MsgSend(
        "terra18vnrzlzm2c4xfsx382pj2xndqtt00rvhu24sqe",
        address,
        new Coins([new Coin("uluna", 100000 * 1e6)])
      ),
    ],
    "",
    "200000"
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
