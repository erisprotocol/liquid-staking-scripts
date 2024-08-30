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
import {
  ExecuteMsg,
  RouteInit,
} from "../types/amp-compounder/compound_proxy/execute_msg";
import { AssetInfo } from "../types/ampz/eris_ampz_execute";
import { tokens } from "./tokens";

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

// ts-node amp-compounder/7_add_route.ts --network mainnet --key mainnet --contract terra1cs0tkknd2t94jd7hgdkmfyvenwr05ztra4rj6uackr597j9jfkxsghtywg
// ts-node amp-compounder/7_add_route.ts --network testnet --key testnet --contract terra1pk3hj8k0nasnru5p0pfrsrhkfpqdway8ef8rqzn204r0ykvz8srqvyf4x0

// mainnet router: terra1j8hayvehh3yy02c2vtw5fdhz9f4drhtee8p5n5rguvg3nyd6m83qd2y90a
// testnet router: terra1na348k6rvwxje9jj6ftpsapfeyaejxjeq6tuzdmzysps20l6z23smnlv64

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

  const routes = [
    [tokens.red, tokens.luna, tokens.wbtc],
    [tokens.sayve, tokens.luna, tokens.wbtc],
    [tokens.tpt, tokens.luna, tokens.wbtc],
    [tokens.ampluna, tokens.luna, tokens.wbtc],
    [tokens.roar, tokens.luna, tokens.wbtc],
    [tokens.axlUsdc, tokens.luna, tokens.wbtc],
    [tokens.capa, tokens.luna, tokens.wbtc],
    [tokens.solid, tokens.axlUsdc, tokens.luna, tokens.wbtc],
    [tokens.astro, tokens.axlUsdc, tokens.luna, tokens.wbtc],
    [tokens.vkr, tokens.axlUsdc, tokens.luna, tokens.wbtc],
    [tokens.xastro, tokens.astro, tokens.axlUsdc, tokens.luna, tokens.wbtc],
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

  const insert_routes = routes.map(
    (route) =>
      <RouteInit>{
        path: {
          route: route,
          router_type: "astro_swap",
          router:
            "terra1j8hayvehh3yy02c2vtw5fdhz9f4drhtee8p5n5rguvg3nyd6m83qd2y90a",
        },
      }
  );

  if (1 != 1) {
    insert_routes.push([] as any);
  }

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
          // delete_routes: [
          //   // ...todelete,
          //   // {
          //   //   both: true,
          //   //   from: {
          //   //     token: {
          //   //       contract_addr:
          //   //         "terra167dsqkh2alurx997wmycw9ydkyu54gyswe3ygmrs4lwume3vmwks8ruqnv",
          //   //     },
          //   //   },
          //   //   to: {
          //   //     token: {
          //   //       contract_addr:
          //   //         "terra1s50rr0vz05xmmkz5wnc2kqkjq5ldwjrdv4sqzf983pzfxuj7jgsq4ehcu2",
          //   //     },
          //   //   },
          //   // },
          // ],
          insert_routes: insert_routes,
        },
      }),
    ]
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
