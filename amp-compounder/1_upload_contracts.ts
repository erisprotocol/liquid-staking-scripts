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
// ts-node amp-compounder/1_upload_contracts.ts --network testnet --key testnet --contracts eris_generator_proxy
// ts-node amp-compounder/1_upload_contracts.ts --network testnet --key testnet --contracts eris_compound_proxy
// ts-node amp-compounder/1_upload_contracts.ts --network testnet --key testnet --contracts eris_astroport_farm

// migrate
// generator
// ts-node amp-compounder/5_migrate.ts --network testnet --key testnet --code-id 6506 --contracts terra19cs7ml4ktecpp26x3udx6cvmhmp09rg3y0h8c0qles05hned0xxsgp46nr
// compounder
// ts-node amp-compounder/5_migrate.ts --network testnet --key testnet --code-id 6507 --contracts terra1pk3hj8k0nasnru5p0pfrsrhkfpqdway8ef8rqzn204r0ykvz8srqvyf4x0
// farms
// ts-node amp-compounder/5_migrate.ts --network testnet --key testnet --code-id 6524 --contracts terra1l2cnn902x6rc2zw28ug9c592f2arxsq29n7mu5w97g8rcq4ekq0qr9szr0 terra1uaz8gyr0lelvcuz8q0ynzpwsj578ads6esgjrtguf2svp2yaf4pqhuexxu terra1l70vrerf6mywfujuq8ldygtpy7gtrzh82uw3gxg5ehnz60w7p8eq40j6zd terra1wuuqc832jazjm0ffe798tzs8gqywnalz4ua4ssn2vv7flncrptvs0l8tw3 terra16j2hg99dkln8y0yjhp2zqvvn2xcj5jlmgqdhx3a3sfjjhvnpf4kqp42w62

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
