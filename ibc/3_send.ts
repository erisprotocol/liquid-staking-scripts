import { MsgExecuteContract } from "@terra-money/terra.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  encodeBase64,
  sendTxWithConfirm,
} from "./../helpers";
import * as keystore from "./../keystore";

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
    "hub-address": {
      type: "string",
      demandOption: true,
    },
    "transfer-address": {
      type: "string",
      demandOption: true,
    },
    amount: {
      type: "string",
      demandOption: true,
    },
    to: {
      type: "string",
      demandOption: true,
    },
    channel: {
      type: "string",
      demandOption: true,
    },
  })
  .parseSync();

// ts-node 3_send.ts --network mainnet --key invest --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --channel channel-26 --amount 1 --to osmo1gmrq3dku3us0k2njh2rxrzheex0darqsse8nkh --transfer-address terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au

// ts-node 3_send.ts --network mainnet --key invest --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --channel channel-28 --amount 1 --to kujira1gmrq3dku3us0k2njh2rxrzheex0darqsf2kmd0 --transfer-address terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au

(async function () {
  const terra = createLCDClient(argv["network"]);
  const worker = await createWallet(terra, argv["key"], argv["key-dir"]);

  const config: { stake_token: string } = await terra.wasm.contractQuery(
    argv["hub-address"],
    {
      config: {},
    }
  );

  const { txhash } = await sendTxWithConfirm(worker, [
    new MsgExecuteContract(worker.key.accAddress, config["stake_token"], {
      send: {
        contract: argv["transfer-address"],
        amount: argv["amount"],
        msg: encodeBase64({
          channel: argv["channel"],
          remote_address: argv["to"],
          timeout: 120,
        }),
      },
    }),
  ]);
  console.log(`Success! Txhash: ${txhash}`);
})();
