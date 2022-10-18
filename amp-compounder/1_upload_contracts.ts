import { Wallet } from "@terra-money/terra.js";
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
  })
  .parseSync();

// TESTNET
// ts-node 1_upload_contracts.ts --network testnet --key testnet --contracts eris_astroport_farm eris_compound_proxy eris_fees_collector eris_generator_proxy
// ts-node 1_upload_contracts.ts --network testnet --key testnet --contracts eris_astroport_farm eris_generator_proxy
// eris_astroport_farm: 4813 -> terra1l2cnn902x6rc2zw28ug9c592f2arxsq29n7mu5w97g8rcq4ekq0qr9szr0,terra1uaz8gyr0lelvcuz8q0ynzpwsj578ads6esgjrtguf2svp2yaf4pqhuexxu,terra1l70vrerf6mywfujuq8ldygtpy7gtrzh82uw3gxg5ehnz60w7p8eq40j6zd,terra1wuuqc832jazjm0ffe798tzs8gqywnalz4ua4ssn2vv7flncrptvs0l8tw3
// eris_compound_proxy: 4625 -> terra1pk3hj8k0nasnru5p0pfrsrhkfpqdway8ef8rqzn204r0ykvz8srqvyf4x0
// eris_fees_collector: 4549 -> terra1250jufq9xdxkkgakx27elqzch53curh94tyy0gugd2k35kmjnszs9zawyf
// eris_generator_proxy: 4814 -> terra19cs7ml4ktecpp26x3udx6cvmhmp09rg3y0h8c0qles05hned0xxsgp46nr

// ts-node 1_upload_contracts.ts --network testnet --key testnet --contracts eris_astroport_farm eris_compound_proxy

// mainnet
// ts-node 1_upload_contracts.ts --network mainnet --key invest --contracts eris_astroport_farm eris_compound_proxy eris_fees_collector eris_generator_proxy
// ts-node 1_upload_contracts.ts --network mainnet --key invest --contracts eris_astroport_farm eris_compound_proxy eris_generator_proxy
// eris_astroport_farm: 527 -> terra1lv2cscvakmtaahj8a6kw43zaefzemydwaswrf38sn2s2depv0wls6ut57q,terra1r0ykpvttzxdx573hypmmdzq4g8e2k5cf5ur0rrjhp6mxrux9rmaq9xw9ff,terra1c6vzxwfcfur2fg08n3nhtdlaxpmjd5wk9nztv8fjgfsjgagtghzsfftutt,terra1xskgvsew6u6nmfwv2mc58m4hscr77xw884x65fuxup8ewvvvuyysr5k3lj,terra1q3q88nyhn7a206djjk40xespszrwg26s8j5fswfgsv6cyu8qlsmsncmppe,terra1qv5pklpnqmugqfehsytakk7tj2fsw4kt69xn2gvaq0edsynm9c7qnjecq2,terra1c98f5dg90cyx5uklezsvac46e4c3msq3ghktkmeksyahytsvuh0q438m6c
// eris_compound_proxy: 528 -> terra1cs0tkknd2t94jd7hgdkmfyvenwr05ztra4rj6uackr597j9jfkxsghtywg
// eris_fees_collector: 514 -> terra1v3h5lejqer5qnjnj6gds94u55x0qsxq7cpxs2kf7kqu6drwgmz4qd9qav9
// eris_generator_proxy: 529 -> terra1m42utlz6uvnlzn82f58pfkkuxw8j9vf24hf00t54qfn4k23fhj3q70vqd0
async function uploadCode(deployer: Wallet, path: string) {
  await waitForConfirm(`Upload code ${path}?`);
  const codeId = await storeCodeWithConfirm(deployer, path);
  console.log(`Code uploaded! ID: ${codeId}`);
  return codeId;
}

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  let ids = "";

  for (const contract of argv.contracts) {
    const fullPath = `../../liquid-staking-contracts/artifacts/${contract}.wasm`;
    const codeId = await uploadCode(deployer, path.resolve(fullPath));
    ids += `${contract}: ${codeId}`;
    console.log(ids);
  }
})();
