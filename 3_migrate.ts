import { MsgMigrateContract } from "@terra-money/terra.js";
import * as path from "path";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  sendTxWithConfirm,
  storeCodeWithConfirm,
  waitForConfirm,
} from "./helpers";
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
    "key-migrate": {
      type: "string",
      demandOption: true,
    },
    "key-dir": {
      type: "string",
      demandOption: false,
      default: keystore.DEFAULT_KEY_DIR,
    },
    "contract-address": {
      type: "string",
      demandOption: true,
    },
    msg: {
      type: "string",
      demandOption: false,
      default: "{}",
    },
    "code-id": {
      type: "number",
      demandOption: false,
    },
    binary: {
      type: "string",
      demandOption: false,
      default: "../liquid-staking-contracts/artifacts/eris_staking_hub.wasm",
    },
  })
  .parseSync();

// testnet
// ts-node 3_migrate.ts --network testnet --key testnet --contract-address terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88
// ts-node 3_migrate.ts --network testnet --key ledger --contract-address terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88
// ts-node 3_migrate.ts --network mainnet --key mainnet --contract-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk

// ts-node 3_migrate.ts --network classic --key invest --key-migrate ledger --contract-address terra1zmf49p3wl7ck2cwer7kghzumfpwhfqk6x893ah --binary "../contracts-terra-classic/artifacts/eris_staking_hub_classic.wasm"

(async function () {
  const terra = createLCDClient(argv["network"]);
  const upload = await createWallet(terra, argv["key"], argv["key-dir"]);
  const admin = await createWallet(
    terra,
    argv["key-migrate"] || argv.key,
    argv["key-dir"]
  );

  let codeId = argv["code-id"];
  if (!codeId) {
    codeId = await storeCodeWithConfirm(upload, path.resolve(argv["binary"]));
    console.log(`Code uploaded! codeId: ${codeId}`);
    await waitForConfirm("Proceed to migrate contract?");
  }

  const { txhash } = await sendTxWithConfirm(admin, [
    new MsgMigrateContract(
      admin.key.accAddress,
      argv["contract-address"],
      codeId,
      JSON.parse(argv["msg"])
    ),
  ]);
  console.log(`Contract migrated! Txhash: ${txhash}`);
})();
