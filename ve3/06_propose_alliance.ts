import {
  Coin,
  Coins,
  MsgCreateAllianceProposal,
  MsgSubmitProposal,
} from "@terra-money/feather.js";
import Long from "long";
import yargs from "yargs/yargs";
import {
  Chains,
  createLCDClient,
  createWallet,
  getInfo,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { config, Ve3InfoKeys } from "./config";

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

  const msgs = networkConfig.gauges.map(
    (a, index) =>
      new MsgSubmitProposal(
        [
          new MsgCreateAllianceProposal(
            `Alliance ${a}`,
            "",

            getInfo("ve3", network, Ve3InfoKeys.alliance_connector_vt(a)),
            networkConfig.weights[index],
            "0",
            "1",
            {
              nanos: 0,
              seconds: new Long(0),
            },
            {
              min: networkConfig.weights[index],
              max: networkConfig.weights[index],
            }
          ),
        ],
        new Coins([new Coin("uluna", 512 * 1e6)]),
        address,
        "",
        `Alliance ${a}`,
        "Alliance"
      )
  );

  console.log(JSON.stringify(msgs, null, 2));

  const { txhash } = await sendTxWithConfirm(admin, msgs);
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
