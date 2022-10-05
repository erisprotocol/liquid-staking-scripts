import { MsgMigrateContract } from "@terra-money/terra.js";
import yargs from "yargs/yargs";
import { createLCDClient, createWallet, sendTxWithConfirm } from "../helpers";
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

// testnet
// ts-node 5_migrate.ts --network testnet --key testnet --code-id 4621 --contracts terra1l2cnn902x6rc2zw28ug9c592f2arxsq29n7mu5w97g8rcq4ekq0qr9szr0 terra1uaz8gyr0lelvcuz8q0ynzpwsj578ads6esgjrtguf2svp2yaf4pqhuexxu terra1l70vrerf6mywfujuq8ldygtpy7gtrzh82uw3gxg5ehnz60w7p8eq40j6zd terra1wuuqc832jazjm0ffe798tzs8gqywnalz4ua4ssn2vv7flncrptvs0l8tw3

(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const codeId = argv["code-id"];

  const contracts_flat = argv.contracts.map((a) => a.toString());
  console.log(
    "🚀 ~ file: 5_migrate.ts ~ line 47 ~ contracts_flat",
    contracts_flat
  );

  const { txhash } = await sendTxWithConfirm(
    admin,

    contracts_flat.map(
      (a) =>
        new MsgMigrateContract(
          admin.key.accAddress,
          a,
          codeId!,
          JSON.parse(argv["msg"])
        )
    )
  );
  console.log(`Contract migrated! Txhash: ${txhash}`);
})();
