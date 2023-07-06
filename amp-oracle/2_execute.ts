import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg as OracleExecuteMsg } from "../types/oracle/execute";

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
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const account = admin.key.accAddress(getPrefix());
  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(account, argv.contract, <OracleExecuteMsg>{
        // register_note: {
        //   note: {
        //     chain: "migaloo",
        //     prefix: "migaloo",
        //     contract:
        //       "terra1euhckzh8rs2sk5gc7z0t472fz7cmxt6wnwgl784t5npggwsmxemqq43uf7",
        //   },
        // },

        // register_oracle: {
        //   oracle: {
        //     contract:
        //       "migaloo1436kxs0w2es6xlqpp9rd35e3d0cjnw4sv8j3a7483sgks29jqwgshqdky4",
        //     name: "amplifier-migaloo",
        //     schedule_interval_s: 60,
        //     query: {
        //       wasm: {
        //         smart: {
        //           contract_addr:
        //             "migaloo1436kxs0w2es6xlqpp9rd35e3d0cjnw4sv8j3a7483sgks29jqwgshqdky4",
        //           msg: toBase64({ state: {} }),
        //         },
        //       },
        //     },
        //     variables: [
        //       {
        //         name: "state",
        //         selector: "$",
        //         variable_type: "base64",
        //       },
        //       {
        //         name: "state_str",
        //         selector: "$",
        //         variable_type: "string",
        //       },
        //       {
        //         name: "exchange_rate",
        //         selector: "$.exchange_rate",
        //         variable_type: "string",
        //       },
        //       {
        //         name: "tvl_utoken",
        //         selector: "$.tvl_utoken",
        //         variable_type: "uint128",
        //       },
        //     ],
        //   },
        // },

        // remove_oracle: {
        //   name: "amplifier-migaloo",
        // },

        execute_oracle: {
          names: ["amplifier-migaloo"],
        },
      }),
    ]
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
