import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/amp-compounder/fees_collector/execute_msg";
import { tokens_migaloo } from "./tokens";

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

// ts-node amp-compounder/8_update_fee_collector.ts --network mainnet --key mainnet --contract terra1v3h5lejqer5qnjnj6gds94u55x0qsxq7cpxs2kf7kqu6drwgmz4qd9qav9

// migaloo (default eris): ts-node amp-compounder/8_update_fee_collector.ts --network migaloo --key mainnet-migaloo --contract migaloo17w97atfwdnjpe6wywwsjjw09050aq9s78jjjsmrmhhqtg7nevpmq0u8t9v
// migaloo -> terra: ts-node amp-compounder/8_update_fee_collector.ts --network migaloo --key mainnet-migaloo --contract migaloo1u0h8ls4rkzj3mkzgmywyqf4ahaljzaf2zszcj23kq389lk9hdc2sjzz9sq

// fee collector 2 migaloo (ginkou):
// ts-node amp-compounder/8_update_fee_collector.ts --network migaloo --key mainnet-migaloo --contract migaloo13uf6cv8htse7dkcuykajr6e25czxcxct8pu2mnhq8zyr2hr0vxkqjwgvhm

// Migaloo Eris: migaloo17w97atfwdnjpe6wywwsjjw09050aq9s78jjjsmrmhhqtg7nevpmq0u8t9v
(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);
  const address = admin.key.accAddress(getPrefix());

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(address, argv.contract, <ExecuteMsg>{
        update_config: {
          // Migaloo ERIS
          // migaloo1u0h8ls4rkzj3mkzgmywyqf4ahaljzaf2zszcj23kq389lk9hdc2sjzz9sq sends to Terra
          // migaloo17w97atfwdnjpe6wywwsjjw09050aq9s78jjjsmrmhhqtg7nevpmq0u8t9v compounds to whale + burn
          // https://migaloo-lcd.erisprotocol.com/cosmwasm/wasm/v1/contract/migaloo17w97atfwdnjpe6wywwsjjw09050aq9s78jjjsmrmhhqtg7nevpmq0u8t9v/smart/eyAiY29uZmlnIjoge319
          // target_list: [
          //   {
          //     addr: "migaloo1u0h8ls4rkzj3mkzgmywyqf4ahaljzaf2zszcj23kq389lk9hdc2sjzz9sq",
          //     weight: 7,
          //     msg: null,
          //     target_type: "weight",
          //   },
          //   // {
          //   //   addr: "migaloo1erul6xyq0gk6ws98ncj7lnq9l4jn4gnnu9we73gdz78yyl2lr7qqrvcgup",
          //   //   weight: 3,
          //   //   msg: "eyJidXJuIjp7fX0=",
          //   //   target_type: "weight",
          //   // },
          //   {
          //     addr: "migaloo1c023jxq099et7a44ledfwuu3sdkfq8caya90nk",
          //     weight: 0,
          //     msg: null,
          //     target_type: {
          //       fill_up_first: {
          //         filled_to: "200000000",
          //         min_fill: "100000000",
          //       },
          //     },
          //   },
          //   {
          //     addr: "migaloo1l4x3hd7rwj26nqw2dhhdm4t9vtv0lqx3v54hzg",
          //     weight: 0,
          //     msg: null,
          //     target_type: {
          //       fill_up_first: {
          //         filled_to: "200000000",
          //         min_fill: "100000000",
          //       },
          //     },
          //   },
          //   {
          //     addr: "migaloo1eetvnrgndvc9atgqxykmhl9xp34l66hsy2u27u",
          //     weight: 0,
          //     target_type: {
          //       fill_up_first: {
          //         filled_to: "200000000",
          //         min_fill: "100000000",
          //       },
          //     },
          //   },

          //   {
          //     addr: "migaloo187llpg2lgvvnltqg50vfqaap54xnqejvhnslte",
          //     weight: 0,
          //     target_type: {
          //       fill_up_first: {
          //         filled_to: "200000000",
          //         min_fill: "100000000",
          //       },
          //     },
          //   },
          //   {
          //     addr: "migaloo1v6cfsslgx04arl8qx5nmx4qggfxlg6t2wkrfc7",
          //     weight: 0,
          //     target_type: {
          //       fill_up_first: {
          //         filled_to: "100000000",
          //         min_fill: "50000000",
          //       },
          //     },
          //   },
          // ],

          // [
          //   // migaloo1eetvnrgndvc9atgqxykmhl9xp34l66hsy2u27u

          //   {
          //     addr: "migaloo1z3txc4x7scxsypx9tgynyfhu48nw60a5gpmd3y",
          //     weight: 7,
          //   },
          //   {
          //     addr: "migaloo1erul6xyq0gk6ws98ncj7lnq9l4jn4gnnu9we73gdz78yyl2lr7qqrvcgup",
          //     weight: 3,
          //     msg: Buffer.from(JSON.stringify({ burn: {} })).toString("base64"),
          //   },
          //   {
          //     addr: "migaloo1c023jxq099et7a44ledfwuu3sdkfq8caya90nk",
          //     weight: 0,
          //     target_type: {
          //       fill_up_first: {
          //         filled_to: "10000000",
          //         min_fill: "5000000",
          //       },
          //     },
          //   },
          //   {
          //     addr: "migaloo1eetvnrgndvc9atgqxykmhl9xp34l66hsy2u27u",
          //     weight: 0,
          //     target_type: {
          //       fill_up_first: {
          //         filled_to: "1000000000",
          //         min_fill: "500000000",
          //       },
          //     },
          //   },
          //   {
          //     addr: "migaloo1l4x3hd7rwj26nqw2dhhdm4t9vtv0lqx3v54hzg",
          //     weight: 0,
          //     msg: null,
          //     target_type: {
          //       fill_up_first: { filled_to: "100000000", min_fill: "50000000" },
          //     },
          //   },

          //   {
          //     addr: "terra1v3h5lejqer5qnjnj6gds94u55x0qsxq7cpxs2kf7kqu6drwgmz4qd9qav9",
          //     weight: 1,
          //     target_type: {
          //       ibc: {
          //         channel_id: "channel-0",
          //       },
          //     },
          //   },
          // ]

          // target_list: [
          //   {
          //     addr: "migaloo1u0h8ls4rkzj3mkzgmywyqf4ahaljzaf2zszcj23kq389lk9hdc2sjzz9sq",
          //     weight: 7,
          //     msg: null,
          //     target_type: "weight",
          //   },
          //   {
          //     addr: "migaloo1erul6xyq0gk6ws98ncj7lnq9l4jn4gnnu9we73gdz78yyl2lr7qqrvcgup",
          //     weight: 3,
          //     msg: "eyJidXJuIjp7fX0=",
          //     target_type: "weight",
          //   },
          //   {
          //     addr: "migaloo1c023jxq099et7a44ledfwuu3sdkfq8caya90nk",
          //     weight: 0,
          //     msg: null,
          //     target_type: {
          //       fill_up_first: { filled_to: "100000000", min_fill: "50000000" },
          //     },
          //   },
          //   {
          //     addr: "migaloo1l4x3hd7rwj26nqw2dhhdm4t9vtv0lqx3v54hzg",
          //     weight: 0,
          //     msg: null,
          //     target_type: {
          //       fill_up_first: { filled_to: "100000000", min_fill: "50000000" },
          //     },
          //   },
          // ],

          // Migaloo GINKOU
          // fee collector 2
          target_list: [
            {
              addr: "migaloo1tevq6j3dlv86h95v60xafatvvy7sa53tr53mrl",
              asset_override: tokens_migaloo.whale,
              weight: 1,
              target_type: "weight",
            },
            {
              addr: "migaloo1tevq6j3dlv86h95v60xafatvvy7sa53tr53mrl",
              asset_override: tokens_migaloo.ampwhalet,
              weight: 1,
              target_type: "weight",
            },
            {
              addr: "migaloo1tevq6j3dlv86h95v60xafatvvy7sa53tr53mrl",
              asset_override: tokens_migaloo.guppy,
              weight: 1,
              target_type: "weight",
            },
            // {
            //   addr: "terra1tqnwsvl6pd7xqem7e7yfgs3dkgew8wy3j8h8ejmhgajupygeg8zqg2zkgj",
            //   asset_override: tokens_migaloo.ampwhalet,
            //   weight: 1,
            //   target_type: {
            //     ibc: {
            //       channel_id: "channel-0",
            //     },
            //   },
            // },
            // {
            //   addr: "terra1tqnwsvl6pd7xqem7e7yfgs3dkgew8wy3j8h8ejmhgajupygeg8zqg2zkgj",
            //   asset_override: tokens_migaloo.bonewhalet,
            //   weight: 1,
            //   target_type: {
            //     ibc: {
            //       channel_id: "channel-0",
            //     },
            //   },
            // },
            // {
            //   addr: "terra1tqnwsvl6pd7xqem7e7yfgs3dkgew8wy3j8h8ejmhgajupygeg8zqg2zkgj",
            //   asset_override: tokens_migaloo.amproar,
            //   weight: 1,
            //   target_type: {
            //     ibc: {
            //       channel_id: "channel-0",
            //     },
            //   },
            // },
            // {
            //   addr: "terra1tqnwsvl6pd7xqem7e7yfgs3dkgew8wy3j8h8ejmhgajupygeg8zqg2zkgj",
            //   asset_override: tokens_migaloo.ampluna,
            //   weight: 1,
            //   target_type: {
            //     ibc: {
            //       channel_id: "channel-2",
            //     },
            //   },
            // },
            // {
            //   addr: "terra1tqnwsvl6pd7xqem7e7yfgs3dkgew8wy3j8h8ejmhgajupygeg8zqg2zkgj",
            //   asset_override: tokens_migaloo.boneluna,
            //   weight: 1,
            //   target_type: {
            //     ibc: {
            //       channel_id: "channel-2",
            //     },
            //   },
            // },
          ],

          // max_spread: "0.5",
          // compound_proxy: 'terra1cs0tkknd2t94jd7hgdkmfyvenwr05ztra4rj6uackr597j9jfkxsghtywg'

          // Migaloo ERIS
          // target_list: [
          //   {
          //     addr: "migaloo1u0h8ls4rkzj3mkzgmywyqf4ahaljzaf2zszcj23kq389lk9hdc2sjzz9sq",
          //     weight: 7,
          //   },
          //   {
          //     addr: "migaloo1erul6xyq0gk6ws98ncj7lnq9l4jn4gnnu9we73gdz78yyl2lr7qqrvcgup",
          //     weight: 3,
          //     msg: Buffer.from(JSON.stringify({ burn: {} })).toString("base64"),
          //   },
          //   {
          //     addr: "migaloo1c023jxq099et7a44ledfwuu3sdkfq8caya90nk",
          //     weight: 0,
          //     target_type: {
          //       fill_up_first: {
          //         filled_to: "100000000",
          //         min_fill: "50000000",
          //       },
          //     },
          //   },
          //   {
          //     addr: "migaloo1l4x3hd7rwj26nqw2dhhdm4t9vtv0lqx3v54hzg",
          //     weight: 0,
          //     target_type: {
          //       fill_up_first: {
          //         filled_to: "100000000",
          //         min_fill: "50000000",
          //       },
          //     },
          //   },
          // ],

          // {
          //   addr: "terra1rgggsspquaxjp4lmegx7a3q4l9lg44hnu7rjxa",
          //   weight: 1,
          //   target_type: {
          //     ibc: {
          //       channel_id: "channel-0",
          //     },
          //   },
          // },
          // {
          //   addr: "terra1v3h5lejqer5qnjnj6gds94u55x0qsxq7cpxs2kf7kqu6drwgmz4qd9qav9",
          //   weight: 1,
          //   target_type: {
          //     ibc: {
          //       channel_id: "channel-0",
          //     },
          //   },
          // },
          // ],

          // // TERRA ERIS
          // // terra1v3h5lejqer5qnjnj6gds94u55x0qsxq7cpxs2kf7kqu6drwgmz4qd9qav9
          // target_list: [
          //   // {
          //   //   addr: "terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk",
          //   //   weight: 1,
          //   //   msg: Buffer.from(JSON.stringify({ donate: {} })).toString(
          //   //     "base64"
          //   //   ),
          //   //   target_type: "weight",
          //   // },
          //   {
          //     addr: "terra1rgggsspquaxjp4lmegx7a3q4l9lg44hnu7rjxa",
          //     weight: 1,
          //     target_type: "weight",
          //   },
          //   {
          //     addr: "terra1rgggsspquaxjp4lmegx7a3q4l9lg44hnu7rjxa",
          //     weight: 1,
          //     target_type: "weight",
          //     asset_override: tokens.roar,
          //   },
          //   // {
          //   //   addr: "terra1nyu6sk9rvtvsltm7tjjrp6rlavnm3e4sq03kltde6kesam260f8szar8ze",
          //   //   weight: 1,
          //   //   target_type: "weight",
          //   //   asset_override: tokens.astro,
          //   //   msg: Buffer.from(JSON.stringify({ enter: {} })).toString(
          //   //         "base64"
          //   //       ),
          //   // },
          //   // {
          //   //   addr: "terra1rgggsspquaxjp4lmegx7a3q4l9lg44hnu7rjxa",
          //   //   weight: 1,
          //   //   target_type: "weight",
          //   //   asset_override: tokens.xastro,
          //   // },
          //   {
          //     addr: "terra1rgggsspquaxjp4lmegx7a3q4l9lg44hnu7rjxa",
          //     weight: 1,
          //     target_type: "weight",
          //     asset_override: tokens.usdc,
          //   },
          //   {
          //     addr: "terra1rgggsspquaxjp4lmegx7a3q4l9lg44hnu7rjxa",
          //     weight: 1,
          //     target_type: "weight",
          //     asset_override: tokens.wbtc,
          //   },
          //   {
          //     addr: "terra1gtuvt6eh4m67tvd2dnfqhgks9ec6ff08c5vlup",
          //     weight: 0,
          //     target_type: {
          //       fill_up_first: {
          //         filled_to: "20000000",
          //         min_fill: "15000000",
          //       },
          //     },
          //   },
          //   {
          //     addr: "terra18vuumkf5kfwcuyejwnrmjp3xwd56d38a5szaqtqswgxahkqn5t3s07hgs8",
          //     weight: 0,
          //     target_type: {
          //       fill_up_first: {
          //         filled_to: "5000000",
          //         min_fill: "3000000",
          //       },
          //     },
          //   },
          //   {
          //     addr: "terra1qry8zdwge8ufchefvuhtz4yh70rc9dxlcuvp34",
          //     weight: 0,
          //     target_type: {
          //       fill_up_first: {
          //         filled_to: "5000000",
          //         min_fill: "3000000",
          //       },
          //     },
          //   },
          //   {
          //     addr: "terra187r4dlnw8negcvupryhtgc88vcy0w7j3e7n69e",
          //     weight: 0,
          //     target_type: {
          //       fill_up_first: {
          //         filled_to: "20000000",
          //         min_fill: "10000000",
          //       },
          //     },
          //   },
          //   {
          //     addr: "terra1m8hqwvajj5ehnm3qt5yam6ufrg8se5fdvj5gyu",
          //     weight: 0,
          //     target_type: {
          //       fill_up_first: {
          //         filled_to: "20000000",
          //         min_fill: "10000000",
          //       },
          //     },
          //   },
          //   {
          //     addr: "terra1zu6wprm7dzasrrj692cynvgsf3skentxldplr3",
          //     weight: 0,
          //     target_type: {
          //       fill_up_first: {
          //         filled_to: "20000000",
          //         min_fill: "10000000",
          //       },
          //     },
          //   },
          //   {
          //     addr: "terra1ypg6ky6akzu57940sk203jhz2lt3udc9cvzryp",
          //     weight: 0,
          //     target_type: {
          //       fill_up_first: {
          //         filled_to: "20000000",
          //         min_fill: "10000000",
          //       },
          //     },
          //   },
          // ],
        },
      }),
    ]
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
