/* eslint-disable @typescript-eslint/no-unused-vars */
import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { AssetInfo } from "../types/ampz/eris_ampz_execute";
import {
  ExecuteMsg,
  RouteDelete,
  RouteInit,
} from "../types/tokenfactory/amp-compounder/compound_proxy/execute_msg";
import { tokens, tokens_neutron as tokensn } from "./tokens";

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
  })
  .parseSync();

const tokensUntyped: Record<string, AssetInfo> = tokens;

const contractToToken = new Map(
  Object.keys(tokens).map((key) => [getToken(tokensUntyped[key]), key])
);

function getToken(a: AssetInfo) {
  if ("token" in a) {
    return a.token.contract_addr;
  } else {
    return a.native_token.denom;
  }
}

(async function () {
  const terra = createLCDClient(argv["network"]);

  // const getRoutes = (start_after: [AssetInfo, AssetInfo] | null) => {
  //   return terra.wasm.contractQuery<
  //     {
  //       key: [string, string];
  //     }[]
  //   >(argv.contract, {
  //     get_routes: { limit: 30, start_after },
  //   });
  // };

  // let start_with: null | [AssetInfo, AssetInfo] = null;
  // let length = 30;

  // while (length === 30) {
  //   const existingRoutes = await getRoutes(start_with);

  //   const used: [string, string][] = existingRoutes.map(
  //     (a) => a.key.map((b) => contractToToken.get(b)!) as [string, string]
  //   );
  //   length = existingRoutes.length;

  //   const last = used[used.length - 1];

  //   console.log(used, existingRoutes.length);
  //   start_with = [tokensUntyped[last[0]], tokensUntyped[last[1]]];
  // }

  // return;

  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);
  const address = admin.key.accAddress(getPrefix());

  const routes: any[] = [
    // [tokensn.atom, tokensn.ntrn, tokensn.usdc],
    // [tokensn.atom, tokensn.ntrn, tokensn.usdc, tokensn.astro],
    // [tokensn.ntrn, tokensn.usdc, tokensn.astro],
    // [tokensn.atom, tokensn.ntrn, tokensn.usdc],
    // [tokensn.atom, tokensn.ntrn, tokensn.usdc, tokensn.wsteth],
    // [tokensn.ntrn, tokensn.usdc, tokensn.wsteth],
    // [tokensn.astro, tokensn.usdc, tokensn.wsteth],
  ];

  // const from = [red, sayve, tpt];
  // const intermmediate = luna;
  // const resulttoken = solid;

  // const from2 = [astro, vkr];
  // const intermmediate2 = usdc;

  // const additionals = [[xastro, astro, usdc, resulttoken]];

  // const directs = [[ampluna, resulttoken]];

  // const routes = [
  //   ...from.map((f) => [f, intermmediate, resulttoken]),
  //   ...from2.map((f) => [f, intermmediate2, resulttoken]),
  //   ...additionals,
  //   ...directs,
  // ];

  const remove = true;

  const insert_routes = routes.map(
    (route) =>
      <RouteInit>{
        path: {
          route: route,
          router_type: "astro_swap",
          router:
            "neutron1eeyntmsq448c68ez06jsy6h2mtjke5tpuplnwtjfwcdznqmw72kswnlmm0",
        },
      }
  );

  if (1 == 1) {
    insert_routes.push(<RouteInit>{
      unwrap: {
        from: tokensn.wsteth_astroport_wrapped,
        to: tokensn.wsteth,
        contract:
          "neutron17ky48dqk9lqhyp72v4kaxgvmzz8xvm4c3na55famjlw05rxtstxsxs6jad",
      },
    });
  }

  const todelete = routes.map(
    (route) =>
      <RouteDelete>{
        from: route.assets[0],
        to: route.assets[route.assets.length - 1],
        both: true,
      }
  );

  // const todelete = [astro, red, ampluna, sayve, tpt, vkr, xastro].map(
  //   (route) =>
  //     <RouteDelete>{
  //       from: route,
  //       to: resulttoken,
  //       both: true,
  //     }
  // );

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(address, argv.contract, <ExecuteMsg>{
        update_config: {
          delete_routes: remove ? todelete : undefined,
          insert_routes: insert_routes,
        },
      }),
    ]
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
