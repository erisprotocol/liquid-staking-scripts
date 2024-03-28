import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "../../helpers";
import * as keystore from "../../keystore";

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

(async function () {
  const terra = createLCDClient(argv["network"]);
  const worker = await createWallet(terra, argv["key"], argv["key-dir"]);

  console.log("Account", worker.key.accAddress(getPrefix()));

  const { txhash } = await sendTxWithConfirm(worker, [
    new MsgExecuteContract(
      worker.key.accAddress(getPrefix()),
      argv["contract"],
      {
        whitelist_assets: {
          "migaloo-1": [
            { native: "uwhale" },
            {
              native:
                "factory/migaloo1436kxs0w2es6xlqpp9rd35e3d0cjnw4sv8j3a7483sgks29jqwgshqdky4/ampWHALE",
            },
            {
              native:
                "factory/migaloo1ey4sn2mkmhew4pdrzk90l9acluvas25qlhuvsfgssw42ugz8yjlqx92j9l/arbWHALE",
            },
            {
              cw20: "migaloo1ey4sn2mkmhew4pdrzk90l9acluvas25qlhuvsfgssw42ugz8yjlqx92j9l",
            },
          ],
        },
      }
    ),
  ]);
  console.log(`Success! Txhash: ${txhash}`);
})();
