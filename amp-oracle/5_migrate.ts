import { MsgMigrateContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
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
    msg: {
      type: "string",
      demandOption: false,
      default: "{}",
    },
    "code-id": {
      type: "number",
      demandOption: true,
    },
    contracts: {
      type: "array",
      demandOption: true,
    },
  })
  .parseSync();

(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const codeId = argv["code-id"];

  const contracts_flat = argv.contracts.map((a) => a.toString());
  console.log("CONTRACTS", contracts_flat);

  const { txhash } = await sendTxWithConfirm(
    admin,

    contracts_flat.map(
      (a) =>
        new MsgMigrateContract(
          admin.key.accAddress(getPrefix()),
          a,
          codeId!,
          JSON.parse(argv["msg"])
        )
    )
  );
  console.log(`Contract migrated! Txhash: ${txhash}`);
})();
