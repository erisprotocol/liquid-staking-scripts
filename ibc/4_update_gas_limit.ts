import { MsgMigrateContract } from "@terra-money/terra.js";
import yargs from "yargs/yargs";
import { createLCDClient, createWallet, sendTxWithConfirm } from "./../helpers";
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
    contract: {
      type: "string",
      demandOption: true,
    },
    "gas-limit": {
      type: "number",
      demandOption: true,
    },
    "code-id": {
      type: "number",
      demandOption: true,
    },
  })
  .parseSync();

// ts-node 4_update_gas_limit.ts --network mainnet --key ledger --contract terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au --gas-limit 510000 --code-id 441

(async function () {
  const terra = createLCDClient(argv["network"]);
  const worker = await createWallet(terra, argv["key"], argv["key-dir"]);

  const { txhash } = await sendTxWithConfirm(worker, [
    new MsgMigrateContract(worker.key.accAddress, argv.contract, argv.codeId, {
      default_gas_limit: argv["gas-limit"],
    }),
  ]);
  console.log(`Success! Txhash: ${txhash}`);
})();
