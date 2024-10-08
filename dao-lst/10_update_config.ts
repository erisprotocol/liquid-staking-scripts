import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/dao-lst/hub/execute";

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

// ampROAR: ts-node dao-lst/10_update_config.ts --network mainnet --key mainnet --contract terra1vklefn7n6cchn0u962w3gaszr4vf52wjvd4y95t2sydwpmpdtszsqvk9wy
(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const account = admin.key.accAddress(getPrefix());
  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(account, argv.contract, <ExecuteMsg>{
        update_config: {
          dao_interface: {
            dao_dao: {
              staking:
                "kujira10pay2c5nsslm3f8gat8fnqq8zdgcjjya9wwlqqcftwm5sz5u7p3s5h0r77",
              gov: "kujira1cy0232rssjmkqz0505cm79l3lpgrc308sxku3v4ezr9p6ppa5jgsmzl62y",
              cw_rewards:
                "kujira1zxlshq5rzt8dw0gpnlcdcsymfhy0t9nmq49a76hlfa4x00g27xnsqfdds2",
            },
          },
        },

        // claim: {
        //   claims: [
        //     {
        //       // genie: {
        //       //   contract:
        //       //     "terra1k89zgnksjaz869s3e4dvu304mwq26t2g53ymr8jpsyjuxxxqc28sc0kfmr",
        //       //   payload:
        //       //     "eyJjbGFpbV9hbW91bnRzIjpbIjUwNjAzNTE2MzUiXSwic2lnbmF0dXJlIjoiMy9ialZiS3RwL05ocXJnd00vT20zc2VSSnlFR0lLZkF4djBnK1h1ajRrc1ZkeVFvcXQzaWZwaHlkMVhYVWlDQk94ZkUrODRMOXBvZjZzYTgwRDhDWVE9PSJ9",
        //       // },
        //       transfer: {
        //         recipient: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
        //         token: {
        //           native_token: {
        //             denom:
        //               "ibc/F709DF4969CD26174C1A53AA95F3D98BE643C1A52C9981487766F96A1811F6A4",
        //           },
        //         },
        //       },
        //     },
        //   ],
        // },
      }),
    ]
  );
  console.log(`Contract updated! Txhash: ${txhash}`);
})();
