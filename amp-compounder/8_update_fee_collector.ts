import { MsgExecuteContract } from "@terra-money/terra.js";
import yargs from "yargs/yargs";
import { createLCDClient, createWallet, sendTxWithConfirm } from "../helpers";
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

// ts-node 8_update_fee_collector.ts --network mainnet --key mainnet --contract terra1v3h5lejqer5qnjnj6gds94u55x0qsxq7cpxs2kf7kqu6drwgmz4qd9qav9

(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(admin.key.accAddress, argv.contract, <ExecuteMsg>{
        update_config: {
          target_list: [
            {
              addr: "terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk",
              weight: 4,
              msg: Buffer.from(JSON.stringify({ donate: {} })).toString(
                "base64"
              ),
            },
            {
              addr: "terra1gtuvt6eh4m67tvd2dnfqhgks9ec6ff08c5vlup",
              weight: 2,
            },
            {
              addr: "terra1rgggsspquaxjp4lmegx7a3q4l9lg44hnu7rjxa",
              weight: 2,
            },
          ],
        },
      }),
    ]
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
