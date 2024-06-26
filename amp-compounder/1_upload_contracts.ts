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
      default: "contracts-terra",
    },
  })
  .parseSync();

// TESTNET
// ts-node amp-compounder/1_upload_contracts.ts --network testnet --key testnet --contracts eris_generator_proxy
// ts-node amp-compounder/1_upload_contracts.ts --network testnet --key testnet --contracts eris_compound_proxy
// ts-node amp-compounder/1_upload_contracts.ts --network testnet --key testnet --contracts eris_astroport_farm
// ts-node amp-compounder/1_upload_contracts.ts --network testnet --key testnet --contracts eris_astroport_farm eris_compound_proxy eris_generator_proxy

// ts-node amp-governance/1_upload_contracts.ts --network testnet --key testnet --contracts eris_compound_proxy --migrates terra1pk3hj8k0nasnru5p0pfrsrhkfpqdway8ef8rqzn204r0ykvz8srqvyf4x0

// migrate
// generator
// ts-node amp-compounder/5_migrate.ts --network testnet --key testnet --code-id 7876 --contracts terra19cs7ml4ktecpp26x3udx6cvmhmp09rg3y0h8c0qles05hned0xxsgp46nr
// compounder / zapper
// ts-node amp-compounder/5_migrate.ts --network testnet --key testnet --code-id 6507 --contracts terra1pk3hj8k0nasnru5p0pfrsrhkfpqdway8ef8rqzn204r0ykvz8srqvyf4x0
// ts-node amp-compounder/5_migrate.ts --network testnet --key testnet --code-id 7875 --contracts terra1pk3hj8k0nasnru5p0pfrsrhkfpqdway8ef8rqzn204r0ykvz8srqvyf4x0
// for ampz: ts-node amp-compounder/5_migrate.ts --network testnet --key testnet --code-id 7894 --contracts terra1pk3hj8k0nasnru5p0pfrsrhkfpqdway8ef8rqzn204r0ykvz8srqvyf4x0
// farms 6524 prev
// ts-node amp-compounder/5_migrate.ts --network testnet --key testnet --code-id 7874 --contracts terra1l2cnn902x6rc2zw28ug9c592f2arxsq29n7mu5w97g8rcq4ekq0qr9szr0 terra1uaz8gyr0lelvcuz8q0ynzpwsj578ads6esgjrtguf2svp2yaf4pqhuexxu terra1l70vrerf6mywfujuq8ldygtpy7gtrzh82uw3gxg5ehnz60w7p8eq40j6zd terra1wuuqc832jazjm0ffe798tzs8gqywnalz4ua4ssn2vv7flncrptvs0l8tw3 terra16j2hg99dkln8y0yjhp2zqvvn2xcj5jlmgqdhx3a3sfjjhvnpf4kqp42w62

// MAINNET
// ts-node amp-compounder/1_upload_contracts.ts --network mainnet --key mainnet --contracts eris_astroport_farm eris_compound_proxy eris_generator_proxy
// ts-node amp-compounder/1_upload_contracts.ts --network mainnet --key mainnet --contracts eris_compound_proxy

// OLD
// farms ts-node amp-compounder/5_migrate.ts --network mainnet --key ledger --code-id 527 --contracts terra1lv2cscvakmtaahj8a6kw43zaefzemydwaswrf38sn2s2depv0wls6ut57q terra1r0ykpvttzxdx573hypmmdzq4g8e2k5cf5ur0rrjhp6mxrux9rmaq9xw9ff terra1c6vzxwfcfur2fg08n3nhtdlaxpmjd5wk9nztv8fjgfsjgagtghzsfftutt terra1xskgvsew6u6nmfwv2mc58m4hscr77xw884x65fuxup8ewvvvuyysr5k3lj terra1q3q88nyhn7a206djjk40xespszrwg26s8j5fswfgsv6cyu8qlsmsncmppe terra1qv5pklpnqmugqfehsytakk7tj2fsw4kt69xn2gvaq0edsynm9c7qnjecq2 terra1c98f5dg90cyx5uklezsvac46e4c3msq3ghktkmeksyahytsvuh0q438m6c terra129jsdzd9nm7ywuyr0hlxs3zqm7jle00vtl4akf4wuke4yr5zs82qafcm4n terra1v4gh6nrps2yjdzqct5m7mwqkfusxgghjvd7sy5dsndsyy86pfyasum2qh5 terra1g0g5ehu2lvdrta9m62yggaa6x375lz5t5zas3xnzmna7kx74szlsw20es6
// zapper ts-node amp-compounder/5_migrate.ts --network mainnet --key ledger --code-id 528 --contracts terra1cs0tkknd2t94jd7hgdkmfyvenwr05ztra4rj6uackr597j9jfkxsghtywg
// generator ts-node amp-compounder/5_migrate.ts --network mainnet --key ledger --code-id 1088 --contracts terra1m42utlz6uvnlzn82f58pfkkuxw8j9vf24hf00t54qfn4k23fhj3q70vqd0

// NEW
// farms ts-node amp-compounder/5_migrate.ts --network mainnet --key ledger --code-id 1170 --contracts terra1lv2cscvakmtaahj8a6kw43zaefzemydwaswrf38sn2s2depv0wls6ut57q terra1r0ykpvttzxdx573hypmmdzq4g8e2k5cf5ur0rrjhp6mxrux9rmaq9xw9ff terra1c6vzxwfcfur2fg08n3nhtdlaxpmjd5wk9nztv8fjgfsjgagtghzsfftutt terra1xskgvsew6u6nmfwv2mc58m4hscr77xw884x65fuxup8ewvvvuyysr5k3lj terra1q3q88nyhn7a206djjk40xespszrwg26s8j5fswfgsv6cyu8qlsmsncmppe terra1qv5pklpnqmugqfehsytakk7tj2fsw4kt69xn2gvaq0edsynm9c7qnjecq2 terra1c98f5dg90cyx5uklezsvac46e4c3msq3ghktkmeksyahytsvuh0q438m6c terra129jsdzd9nm7ywuyr0hlxs3zqm7jle00vtl4akf4wuke4yr5zs82qafcm4n terra1v4gh6nrps2yjdzqct5m7mwqkfusxgghjvd7sy5dsndsyy86pfyasum2qh5 terra1g0g5ehu2lvdrta9m62yggaa6x375lz5t5zas3xnzmna7kx74szlsw20es6
// zapper ts-node amp-compounder/5_migrate.ts --network mainnet --key ledger --code-id 1284 --contracts terra1cs0tkknd2t94jd7hgdkmfyvenwr05ztra4rj6uackr597j9jfkxsghtywg
// zapper ts-node amp-compounder/5_migrate.ts --network mainnet --key ledger --code-id 1298 --contracts terra1cs0tkknd2t94jd7hgdkmfyvenwr05ztra4rj6uackr597j9jfkxsghtywg
// zapper ts-node amp-compounder/5_migrate.ts --network mainnet --key ledger --code-id 1744 --contracts terra1cs0tkknd2t94jd7hgdkmfyvenwr05ztra4rj6uackr597j9jfkxsghtywg
// zapper 1944 ts-node amp-governance/1_upload_contracts.ts --network mainnet --key mainnet --key-migrate ledger --contracts eris_compound_proxy --migrates terra1cs0tkknd2t94jd7hgdkmfyvenwr05ztra4rj6uackr597j9jfkxsghtywg
// generator ts-node amp-compounder/5_migrate.ts --network mainnet --key ledger --code-id 1172 --contracts terra1m42utlz6uvnlzn82f58pfkkuxw8j9vf24hf00t54qfn4k23fhj3q70vqd0

// 1284;
// eris_astroport_farm:  1170
// eris_compound_proxy:  1171 -> 1944 -> 2039
// eris_generator_proxy: 1172

// TEST
//ts-node amp-compounder/5_migrate.ts --network mainnet --key mainnet --code-id 1631 --contracts terra1898s9slxrqs7cem5w0nehjmn4pvfsxv9ekaaxz7r5gu8w7x8yrrqjv46gy

// TERRA
// 4: ts-node amp-compounder/4_instantiate_farms.ts --network mainnet --key ledger --contract-code-id 1170
// add lps:  ts-node amp-compounder/7_add_lp.ts --network mainnet --key mainnet --contract terra1cs0tkknd2t94jd7hgdkmfyvenwr05ztra4rj6uackr597j9jfkxsghtywg
// opt data: ts-node amp-compounder/6_get_data.ts --network mainnet --farm terra10wsuv79k03gplmcx22j4lxauca4t2a0p4q83fyuv54w88e7ccm0qxkme4l
// fee collector 1741->1945-> 2658
// ts-node amp-governance/1_upload_contracts.ts --network mainnet --key mainnet --key-migrate ledger --code-id 2658 --contracts eris_fees_collector --migrates terra1v3h5lejqer5qnjnj6gds94u55x0qsxq7cpxs2kf7kqu6drwgmz4qd9qav9

// NEUTRON
// ts-node amp-compounder/1_upload_contracts.ts --network neutron --key key-mainnet --contracts eris_astroport_farm_neutron eris_compound_proxy eris_generator_proxy eris_fees_collector --folder contracts-tokenfactory
// ts-node amp-compounder/1_upload_contracts.ts --network neutron --key key-mainnet --contracts eris_astroport_farm_neutron --folder contracts-tokenfactory
// ts-node amp-compounder/1_upload_contracts.ts --network neutron --key key-mainnet --contracts eris_staking_token --folder contracts-tokenfactory
// ts-node amp-compounder/1_upload_contracts.ts --network neutron --key key-mainnet --contracts eris_generator_proxy --folder contracts-tokenfactory
// ts-node amp-governance/1_upload_contracts.ts --network neutron --key key-mainnet --contracts eris_generator_proxy --folder contracts-tokenfactory --migrates neutron1xm0pgsu436sht7t39gu44z8q4emtsy8nujxz2yg2jmkdv930up9q26mkd2
// ts-node amp-governance/1_upload_contracts.ts --network neutron --key key-mainnet --contracts eris_compound_proxy --folder contracts-tokenfactory --migrates neutron14eyjgeutlqlp6g9ka027waj04j68hpcsxqw09jrl5rncgdsst6qqlh2qvf
// owner: neutron1dpaaxgw4859qhew094s87l0he8tfea3lq44q9d
// operator: neutron1c023jxq099et7a44ledfwuu3sdkfq8cadk9hul
// eris_staking_token           97
// eris_astroport_farm_neutron: 98 -> neutron1h4ehzx3j92jv4tkgjy3k2qphh5863l68cyep7vaf83fj6k89l4lqjfyh77,neutron1sfmpf84xacu2la88zzsgende2jjlczswdmhzn7jh6tuhn43jl86q6d0vhj,neutron1smam4j5cypw2vp7un3q8w68sg97zq9s2c95ukwsmpsl2jh4xwzdskxm6az
// eris_compound_proxy:         90->271->554 -> neutron14eyjgeutlqlp6g9ka027waj04j68hpcsxqw09jrl5rncgdsst6qqlh2qvf
// eris_generator_proxy:        99 -> neutron1xm0pgsu436sht7t39gu44z8q4emtsy8nujxz2yg2jmkdv930up9q26mkd2
// eris_fees_collector:         92 -> neutron17j39j5xw6ukphvkct6zkjzwavgdkujhf2xpruwgggpwf0jh2whls3mlda5
// 1: ts-node amp-compounder/2_instantiate_fee_collector.ts --network neutron --key key-mainnet --contract-code-id 92
// 2: ts-node amp-compounder/3_instantiate_generator.ts --network neutron --key key-mainnet --contract-code-id 94 --label "Eris Generator Proxy"
// 3: ts-node amp-compounder/4_instantiate_compound.ts --network neutron --key key-mainnet --contract-code-id 90->269->270g->271 --label "Eris Zapper"
// 4: ts-node amp-compounder/4_instantiate_farms.ts --network neutron --key key-mainnet --contract-code-id 98
// add lps:   ts-node amp-compounder/7_add_lp.ts --network neutron --key key-mainnet --contract neutron14eyjgeutlqlp6g9ka027waj04j68hpcsxqw09jrl5rncgdsst6qqlh2qvf
// opt route: ts-node amp-compounder/7_add_route_neutron.ts --network neutron --key key-mainnet --contract neutron14eyjgeutlqlp6g9ka027waj04j68hpcsxqw09jrl5rncgdsst6qqlh2qvf
// opt data:  ts-node amp-compounder/6_get_data.ts --network neutron
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
    const fullPath = `../${argv.folder}/artifacts/${contract}.wasm`;
    const codeId = await uploadCode(deployer, path.resolve(fullPath));
    ids += `${contract}: ${codeId}\r\n`;
    console.log(ids);
  }
})();
