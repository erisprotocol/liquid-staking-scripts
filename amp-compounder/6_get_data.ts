import yargs from "yargs/yargs";
import { Chains, createLCDClient, getToken } from "../helpers";
import { ConfigResponse } from "../types/amp-compounder/astroport_farm/config_response";
import { StateResponse } from "../types/amp-compounder/astroport_farm/state_response";
import { AssetInfo } from "../types/ampz/eris_ampz_execute";

const argv = yargs(process.argv)
  .options({
    network: {
      type: "string",
      demandOption: true,
    },
    farm: {
      type: "string",
    },
  })
  .parseSync();

// testnet
// ts-node 5_migrate.ts --network testnet --key testnet --code-id 4640 --contracts terra1l2cnn902x6rc2zw28ug9c592f2arxsq29n7mu5w97g8rcq4ekq0qr9szr0 terra1uaz8gyr0lelvcuz8q0ynzpwsj578ads6esgjrtguf2svp2yaf4pqhuexxu terra1l70vrerf6mywfujuq8ldygtpy7gtrzh82uw3gxg5ehnz60w7p8eq40j6zd terra1wuuqc832jazjm0ffe798tzs8gqywnalz4ua4ssn2vv7flncrptvs0l8tw3

// ts-node amp-compounder/6_get_data.ts --network mainnet

const templates: Partial<Record<Chains, string>> = {
  // mainnet:
  // "terra1lv2cscvakmtaahj8a6kw43zaefzemydwaswrf38sn2s2depv0wls6ut57q,terra1r0ykpvttzxdx573hypmmdzq4g8e2k5cf5ur0rrjhp6mxrux9rmaq9xw9ff,terra1c6vzxwfcfur2fg08n3nhtdlaxpmjd5wk9nztv8fjgfsjgagtghzsfftutt,terra1xskgvsew6u6nmfwv2mc58m4hscr77xw884x65fuxup8ewvvvuyysr5k3lj,terra1q3q88nyhn7a206djjk40xespszrwg26s8j5fswfgsv6cyu8qlsmsncmppe,terra1qv5pklpnqmugqfehsytakk7tj2fsw4kt69xn2gvaq0edsynm9c7qnjecq2,terra1c98f5dg90cyx5uklezsvac46e4c3msq3ghktkmeksyahytsvuh0q438m6c",

  // mainnet:
  //   "terra1pvn5up4n4ttmdatvpxa8t2klpcy2u5t5nmyclv30yz8xmphjxlrqgqwxv6,terra1a3k77cgja875f6ffdsflxtaft570em82te4suw9nfhx77u6dqh8qykuq6f,terra176e78qnvvclrlrmuyjaqxsy72zp2m3szshljdxakdsmr33zulumqa3hr9d,terra1m64fmenadmpy7afp0675jrkz9vs0cq97mgzzpzg0klgc4ahgylms7gvnt5",

  mainnet: "terra1cna9z77qlwnk9kysucde096du7nkzh46jx65dsmr74rcty2vnxdqrqfv9y",
  neutron: "neutron1kery9q2uhfu874aqrtx2u7peh7ljfsqjq3ka2lfqmdj5lmhx6fwqx9dw5d",
};

export interface AmpCompounderPool {
  pair: string;
  farm: string;
  name: string;
  amplp: string;
  lp: string;
  tokens?: string[];
}

(async function () {
  const terra = createLCDClient(argv["network"]);

  try {
    const contracts =
      (argv.farm && [argv.farm]) ??
      (templates[argv.network as Chains] ?? "").split(",");

    const result: AmpCompounderPool[] = [];

    for (const contract of contracts) {
      const state = await terra.wasm.contractQuery<StateResponse>(contract, {
        state: {},
      });

      const config = await terra.wasm.contractQuery<ConfigResponse>(contract, {
        config: {},
      });
      const amplp = getToken(config.amp_lp_token);
      const token = await terra.wasm.contractQuery<{ name: string }>(amplp, {
        token_info: {},
      });

      const pair = await terra.wasm.contractQuery<{ asset_infos: AssetInfo[] }>(
        state.pair_contract,
        { pair: {} }
      );

      result.push({
        amplp: amplp,
        farm: contract,
        lp: config.lp_token,
        name: token.name,
        pair: state.pair_contract,
        tokens: pair.asset_infos.map((a) => getToken(a)),
      });
    }

    console.log(JSON.stringify(result));
  } catch (error) {
    console.log(error);
  }
})();
