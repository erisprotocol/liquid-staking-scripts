import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/ampz/eris_ampz_execute";

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

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(admin.key.accAddress(getPrefix()), argv.contract, <
        ExecuteMsg
      >{
        update_config: {
          // astroport: {
          //   generator:
          //     "terra1gc4d4v82vjgkz0ag28lrmlxx3tf6sq69tmaujjpe7jwmnqakkx0qm28j2l",
          //   coins: [
          //     {
          //       token: {
          //         contract_addr:
          //           "terra167dsqkh2alurx997wmycw9ydkyu54gyswe3ygmrs4lwume3vmwks8ruqnv",
          //       },
          //     },
          //     {
          //       native_token: {
          //         denom: "uluna",
          //       },
          //     },
          //   ],
          // },
          zapper:
            "terra1pk3hj8k0nasnru5p0pfrsrhkfpqdway8ef8rqzn204r0ykvz8srqvyf4x0",
          // fee: {
          //   fee_bps: 100,
          //   operator_bps: 100,
          //   receiver: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
          // },
        },
      }),
    ]
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
