import { MsgSend } from "@terra-money/terra.js";
import * as fs from "fs";
import yargs from "yargs/yargs";
import { createLCDClient, createWallet, sendTxWithConfirm } from "./helpers";
import * as keystore from "./keystore";

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
    "csv-file": {
      type: "string",
      demandOption: true,
    },
    "sender-address": {
      type: "string",
      demandOption: true,
      default: "terra1alxk3fmhcl0ga80gl9yj9zp3ezjm4sdh8a9l9c",
    },
  })
  .parseSync();

(async function () {
  const terra = createLCDClient(argv["network"]);

  const csv = fs
    .readFileSync(argv["csv-file"], "ascii")
    .split(/\n|\r/)
    .map((a) => {
      const parts = a.split(";");
      return {
        address: parts[0],
        amount: +parts[1],
      };
    })
    .filter((a) => a.amount > 0);

  const worker = await createWallet(terra, argv["key"], argv["key-dir"]);

  const { txhash } = await sendTxWithConfirm(
    worker,
    csv.map(
      (a) => new MsgSend(argv.senderAddress, a.address, { uluna: a.amount })
    )
  );
  console.log(`Success! Txhash: ${txhash}`);
})();
