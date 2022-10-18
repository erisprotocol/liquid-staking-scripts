import yargs from "yargs/yargs";
import { createLCDClient } from "../helpers";
import { ConfigResponse } from "../types/amp-compounder/astroport_farm/config_response";
import { StateResponse } from "../types/amp-compounder/astroport_farm/state_response";

const argv = yargs(process.argv)
  .options({
    network: {
      type: "string",
      demandOption: true,
    },
  })
  .parseSync();

// testnet
// ts-node 5_migrate.ts --network testnet --key testnet --code-id 4640 --contracts terra1l2cnn902x6rc2zw28ug9c592f2arxsq29n7mu5w97g8rcq4ekq0qr9szr0 terra1uaz8gyr0lelvcuz8q0ynzpwsj578ads6esgjrtguf2svp2yaf4pqhuexxu terra1l70vrerf6mywfujuq8ldygtpy7gtrzh82uw3gxg5ehnz60w7p8eq40j6zd terra1wuuqc832jazjm0ffe798tzs8gqywnalz4ua4ssn2vv7flncrptvs0l8tw3

// ts-node 6_get_data.ts --network mainnet

const templates: Record<string, string> = {
  mainnet:
    "terra1lv2cscvakmtaahj8a6kw43zaefzemydwaswrf38sn2s2depv0wls6ut57q,terra1r0ykpvttzxdx573hypmmdzq4g8e2k5cf5ur0rrjhp6mxrux9rmaq9xw9ff,terra1c6vzxwfcfur2fg08n3nhtdlaxpmjd5wk9nztv8fjgfsjgagtghzsfftutt,terra1xskgvsew6u6nmfwv2mc58m4hscr77xw884x65fuxup8ewvvvuyysr5k3lj,terra1q3q88nyhn7a206djjk40xespszrwg26s8j5fswfgsv6cyu8qlsmsncmppe,terra1qv5pklpnqmugqfehsytakk7tj2fsw4kt69xn2gvaq0edsynm9c7qnjecq2,terra1c98f5dg90cyx5uklezsvac46e4c3msq3ghktkmeksyahytsvuh0q438m6c",
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

  const contracts = templates[argv.network].split(",");

  const result: AmpCompounderPool[] = [];

  for (const contract of contracts) {
    const state = await terra.wasm.contractQuery<StateResponse>(contract, {
      state: {},
    });
    const config = await terra.wasm.contractQuery<ConfigResponse>(contract, {
      config: {},
    });
    const token = await terra.wasm.contractQuery<{ name: string }>(
      config.amp_lp_token,
      { token_info: {} }
    );

    result.push({
      amplp: config.amp_lp_token,
      farm: contract,
      lp: config.lp_token,
      name: token.name,
      pair: state.pair_contract,
      tokens: [],
    });
  }

  console.log(JSON.stringify(result));
})();
