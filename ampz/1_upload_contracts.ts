import { Wallet } from "@terra-money/feather.js";
import * as path from "path";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  storeCodeWithConfirm,
  waitForConfirm,
} from "../helpers";
import * as keystore from "../keystore";

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
    contracts: {
      type: "array",
      demandOption: true,
    },
    folder: {
      type: "string",
      default: "liquid-staking-contracts",
    },
  })
  .parseSync();

// TESTNET
// ts-node ampz/1_upload_contracts.ts --network testnet --key testnet --contracts eris_ampz
// eris_ampz: 6505 terra1f7lzek24y0mje9fk5ale29mqt82nt6hfl3t48834kfcpg0h99phqfz7w84

// Migrate
// ts-node ampz/5_migrate.ts --network testnet --key testnet --code-id 6630 --contracts terra1f7lzek24y0mje9fk5ale29mqt82nt6hfl3t48834kfcpg0h99phqfz7w84

// Config
// ts-node ampz/10_update_config.ts --network testnet --key testnet --contract terra1f7lzek24y0mje9fk5ale29mqt82nt6hfl3t48834kfcpg0h99phqfz7w84

// mainnet

async function uploadCode(deployer: Wallet, path: string) {
  await waitForConfirm(`Upload code ${path}?`);
  const codeId = await storeCodeWithConfirm(deployer, path, false);
  console.log(`Code uploaded! ID: ${codeId}`);
  return codeId;
}

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  let ids = "";

  for (const contract of argv.contracts) {
    const fullPath = `../${argv.folder}/artifacts/${contract}.wasm`;
    const codeId = await uploadCode(deployer, path.resolve(fullPath));
    ids += `${contract}: ${codeId}`;
    console.log(ids);
  }
})();
