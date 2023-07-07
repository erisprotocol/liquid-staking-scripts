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

(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);
  const address = admin.key.accAddress(getPrefix());

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(address, argv.contract, <ExecuteMsg>{
        update_config: {
          target_list: [
            // {
            //   addr: "terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk",
            //   weight: 1,
            //   msg: Buffer.from(JSON.stringify({ donate: {} })).toString(
            //     "base64"
            //   ),
            //   target_type: "weight",
            // },
            {
              addr: "terra1rgggsspquaxjp4lmegx7a3q4l9lg44hnu7rjxa",
              weight: 1,
              target_type: "weight",
            },
            {
              addr: "terra1gtuvt6eh4m67tvd2dnfqhgks9ec6ff08c5vlup",
              weight: 0,
              target_type: {
                fill_up_first: {
                  filled_to: "20000000",
                  min_fill: "15000000",
                },
              },
            },
            {
              addr: "terra18vuumkf5kfwcuyejwnrmjp3xwd56d38a5szaqtqswgxahkqn5t3s07hgs8",
              weight: 0,
              target_type: {
                fill_up_first: {
                  filled_to: "5000000",
                  min_fill: "3000000",
                },
              },
            },
            {
              addr: "terra1qry8zdwge8ufchefvuhtz4yh70rc9dxlcuvp34",
              weight: 0,
              target_type: {
                fill_up_first: {
                  filled_to: "5000000",
                  min_fill: "3000000",
                },
              },
            },
            {
              addr: "terra187r4dlnw8negcvupryhtgc88vcy0w7j3e7n69e",
              weight: 0,
              target_type: {
                fill_up_first: {
                  filled_to: "20000000",
                  min_fill: "10000000",
                },
              },
            },
            {
              addr: "terra1m8hqwvajj5ehnm3qt5yam6ufrg8se5fdvj5gyu",
              weight: 0,
              target_type: {
                fill_up_first: {
                  filled_to: "20000000",
                  min_fill: "10000000",
                },
              },
            },
            {
              addr: "terra1zu6wprm7dzasrrj692cynvgsf3skentxldplr3",
              weight: 0,
              target_type: {
                fill_up_first: {
                  filled_to: "20000000",
                  min_fill: "10000000",
                },
              },
            },
            {
              addr: "terra1ypg6ky6akzu57940sk203jhz2lt3udc9cvzryp",
              weight: 0,
              target_type: {
                fill_up_first: {
                  filled_to: "20000000",
                  min_fill: "10000000",
                },
              },
            },
          ],
        },
      }),
    ]
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
