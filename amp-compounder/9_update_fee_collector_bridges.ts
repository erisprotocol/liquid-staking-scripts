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

// ts-node 9_update_fee_collector_bridges.ts --network mainnet --key mainnet --contract terra1v3h5lejqer5qnjnj6gds94u55x0qsxq7cpxs2kf7kqu6drwgmz4qd9qav9

(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(admin.key.accAddress, argv.contract, <ExecuteMsg>{
        update_bridges: {
          add: [
            [
              {
                token: {
                  contract_addr:
                    "terra1gy73st560m2j0esw5c5rjmr899hvtv4rhh4seeajt3clfhr4aupszjss4j",
                },
              },
              {
                native_token: {
                  denom:
                    "ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4",
                },
              },
            ],
          ],
        },
      }),
    ]
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
