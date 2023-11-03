/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { LCDClient, MsgExecuteContract } from "@terra-money/feather.js";
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

// ts-node amp-compounder/7_add_route_tfm.ts --network mainnet --key mainnet --contract terra1cs0tkknd2t94jd7hgdkmfyvenwr05ztra4rj6uackr597j9jfkxsghtywg

// mainnet zapper: terra1cs0tkknd2t94jd7hgdkmfyvenwr05ztra4rj6uackr597j9jfkxsghtywg
// mainnet router: terra1j8hayvehh3yy02c2vtw5fdhz9f4drhtee8p5n5rguvg3nyd6m83qd2y90a
// testnet router: terra1na348k6rvwxje9jj6ftpsapfeyaejxjeq6tuzdmzysps20l6z23smnlv64

// 1298 -> 1631

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

export class RouteBuilder {
  assets: AssetInfo[] = [];
  routes: {
    type: "astroport" | "whitewhale";
    assets: AssetInfo[];
    pair: string | undefined;
  }[] = [];
  current: AssetInfo | undefined;

  static start(asset: AssetInfo) {
    return new RouteBuilder().create(asset);
  }

  private create(asset: AssetInfo) {
    this.current = asset;
    this.assets.push(asset);
    return this;
  }

  toTfmRoute(): [string, string][] {
    return this.routes.map((a) => [a.type, a.pair!]);
  }

  astro(asset: AssetInfo) {
    const assets = [this.current!, asset];
    this.create(asset);
    this.routes.push({
      assets: assets,
      pair: undefined,
      type: "astroport",
    });
    return this;
  }

  whale(asset: AssetInfo) {
    const assets = [this.current!, asset];
    this.create(asset);
    this.routes.push({
      assets: assets,
      pair: undefined,
      type: "whitewhale",
    });
    return this;
  }

  pair(asset: AssetInfo, pair: string) {
    const assets = [this.current!, asset];
    this.create(asset);
    this.routes.push({
      assets: assets,
      pair,
      type: "whitewhale",
    });
    return this;
  }

  async preparePairs(cache: Record<string, string>, client: LCDClient) {
    for (const route of this.routes) {
      const tokens = route.assets.map((a) => getToken(a));
      tokens.sort();

      const key = `${route.type}:${tokens.join("-")}`;

      if (!route.pair) {
        if (cache[key]) {
          route.pair = cache[key];
        } else {
          let pair = "";
          if (route.type === "astroport") {
            const factory =
              "terra14x9fr055x5hvr48hzy2t4q7kvjvfttsvxusa4xsdcy702mnzsvuqprer8r";
            const response = await client.wasm.contractQuery<{
              contract_addr: string;
            }>(factory, {
              pair: {
                asset_infos: route.assets,
              },
            });

            pair = response.contract_addr;
          } else {
            const factory =
              "terra1f4cr4sr5eulp3f2us8unu6qv8a5rhjltqsg7ujjx6f2mrlqh923sljwhn3";
            const response = await client.wasm.contractQuery<{
              contract_addr: string;
            }>(factory, {
              pair: {
                asset_infos: route.assets,
              },
            });

            pair = response.contract_addr;
          }

          cache[key] = pair;
          route.pair = pair;
          console.log(`['${key}']: '${pair}',`);
        }
      }
    }
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
    // RouteBuilder.start(tokens.luna).astro(tokens.usdc).whale(tokens.whale),

    // RouteBuilder.start(tokens.red)
    //   .astro(tokens.luna)
    //   .astro(tokens.usdc)
    //   .whale(tokens.whale),

    // RouteBuilder.start(tokens.sayve)
    //   .astro(tokens.luna)
    //   .astro(tokens.usdc)
    //   .whale(tokens.whale),

    // RouteBuilder.start(tokens.tpt)
    //   .astro(tokens.luna)
    //   .astro(tokens.usdc)
    //   .whale(tokens.whale),

    // RouteBuilder.start(tokens.ampluna)
    //   .astro(tokens.luna)
    //   .astro(tokens.usdc)
    //   .whale(tokens.whale),

    // RouteBuilder.start(tokens.roar).whale(tokens.whale),
    // RouteBuilder.start(tokens.ampwhale).whale(tokens.whale),
    // RouteBuilder.start(tokens.usdc).whale(tokens.whale),

    // RouteBuilder.start(tokens.vkr).astro(tokens.usdc).whale(tokens.whale),
    // RouteBuilder.start(tokens.astro).astro(tokens.usdc).whale(tokens.whale),
    // RouteBuilder.start(tokens.xastro)
    //   .astro(tokens.astro)
    //   .astro(tokens.usdc)
    //   .whale(tokens.whale),

    // // ampwhale

    // RouteBuilder.start(tokens.luna).whale(tokens.whale).whale(tokens.ampwhale),

    // RouteBuilder.start(tokens.red)
    //   .astro(tokens.luna)
    //   .whale(tokens.whale)
    //   .whale(tokens.ampwhale),

    // RouteBuilder.start(tokens.sayve)
    //   .astro(tokens.luna)
    //   .whale(tokens.whale)
    //   .whale(tokens.ampwhale),

    // RouteBuilder.start(tokens.tpt)
    //   .astro(tokens.luna)
    //   .whale(tokens.whale)
    //   .whale(tokens.ampwhale),

    // RouteBuilder.start(tokens.ampluna)
    //   .astro(tokens.luna)
    //   .whale(tokens.whale)
    //   .whale(tokens.ampwhale),

    // RouteBuilder.start(tokens.luna).whale(tokens.whale).whale(tokens.bonewhale),

    // ==================
    // RouteBuilder.start(tokens.red)
    //   .astro(tokens.luna)
    //   .whale(tokens.whale)
    //   .whale(tokens.bonewhale),

    // RouteBuilder.start(tokens.sayve)
    //   .astro(tokens.luna)
    //   .whale(tokens.whale)
    //   .whale(tokens.bonewhale),

    // RouteBuilder.start(tokens.tpt)
    //   .astro(tokens.luna)
    //   .whale(tokens.whale)
    //   .whale(tokens.bonewhale),

    // RouteBuilder.start(tokens.ampluna)
    //   .astro(tokens.luna)
    //   .whale(tokens.whale)
    //   .whale(tokens.bonewhale),

    // RouteBuilder.start(tokens.whale).whale(tokens.bonewhale),
    // ==================

    // RouteBuilder.start(tokens.ampwhalet).pair(
    //   tokens.ampwhale,
    //   getContractFromTokenFactory(tokens.ampwhalet)
    // ),
    // RouteBuilder.start(tokens.bonewhalet).pair(
    //   tokens.bonewhale,
    //   getContractFromTokenFactory(tokens.bonewhalet)
    // ),
    // RouteBuilder.start(tokens.ampwhalet)
    //   .pair(tokens.ampwhale, getContractFromTokenFactory(tokens.ampwhalet))
    //   .whale(tokens.whale),
    // RouteBuilder.start(tokens.bonewhalet)
    //   .pair(tokens.bonewhale, getContractFromTokenFactory(tokens.bonewhalet))
    //   .whale(tokens.whale),

    // ==================

    RouteBuilder.start(tokens.amproar).whale(tokens.roar).whale(tokens.whale),

    // RouteBuilder.start(tokens.whale).whale(tokens.ampwhale),

    // RouteBuilder.start(tokens.roar).whale(tokens.whale).whale(tokens.ampwhale),

    // // RouteBuilder.start(tokens.ampwhale)
    // //   .whale(tokens.whale)
    // //   .whale(tokens.ampwhale),
    // RouteBuilder.start(tokens.usdc).whale(tokens.whale).whale(tokens.ampwhale),

    // RouteBuilder.start(tokens.vkr)
    //   .astro(tokens.usdc)
    //   .whale(tokens.whale)
    //   .whale(tokens.ampwhale),
    // RouteBuilder.start(tokens.astro)
    //   .astro(tokens.usdc)
    //   .whale(tokens.whale)
    //   .whale(tokens.ampwhale),
    // RouteBuilder.start(tokens.xastro)
    //   .astro(tokens.astro)
    //   .astro(tokens.usdc)
    //   .whale(tokens.whale)
    //   .whale(tokens.ampwhale),
  ];

  const cache: Record<string, string> = {
    ["astroport:terra1xe8umegahlqphtpvjsuwfzfvyjfvag5h8rffsx6ezm0el4xzsf8s7uzezk-uluna"]:
      "terra1zhq0rqermczklmw89ranmgz28zthsthw6u35umgvpykfwzlwtgcsylpqqf",
    ["astroport:ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4-uluna"]:
      "terra1fd68ah02gr2y8ze7tm9te7m70zlmc7vjyyhs6xlhsdmqqcjud4dql4wpxr",
    ["whitewhale:ibc/36A02FFC4E74DF4F64305130C3DFA1B06BEAC775648927AA44467C76A77AB8DB-ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4"]:
      "terra1qdu4g5zxxtmwsd95v8vjslq5874nkcull7ejycm0gy2v7p5qc67qenkf8t",
    ["astroport:terra1xp9hrhthzddnl7j5du83gqqr4wmdjm5t0guzg9jp6jwrtpukwfjsjgy4f3-uluna"]:
      "terra1nckl6ex6239tv4kjzv03ecmuxwakjm8uj8cy6p850vmlmejfmj9sy094yr",
    ["astroport:terra13j2k5rfkg0qhk58vz63cze0uze4hwswlrfnm0fa4rnyggjyfrcnqcrs5z2-uluna"]:
      "terra15l5pqlp8q5d4z8tvermadvp429d8pfctg4j802t8edzkf8aavp7q59t7er",
    ["astroport:terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct-uluna"]:
      "terra1cr8dg06sh343hh4xzn3gxd3ayetsjtet7q5gp4kfrewul2kql8sqvhaey4",
    ["whitewhale:ibc/36A02FFC4E74DF4F64305130C3DFA1B06BEAC775648927AA44467C76A77AB8DB-terra1lxx40s29qvkrcj8fsa3yzyehy7w50umdvvnls2r830rys6lu2zns63eelv"]:
      "terra1g8clplgv3ah405qjrf9yhkgur9zqlqayt8ftrvkuzsm5am7pr9ls7s26rx",
    ["whitewhale:ibc/36A02FFC4E74DF4F64305130C3DFA1B06BEAC775648927AA44467C76A77AB8DB-ibc/B3F639855EE7478750CC8F82072307ED6E131A8EFF20345E1D136B50C4E5EC36"]:
      "terra1ntx595elf3ukxcd0wy76h24rzztcv2p6n3wmfd358ks95prv42fs9mn63n",
    ["astroport:ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4-terra1gy73st560m2j0esw5c5rjmr899hvtv4rhh4seeajt3clfhr4aupszjss4j"]:
      "terra1alzkrc6hkvs8g5a064cukfxnv0jj4l3l8vhgfypfxvysk78v6dgqsymgmv",
    ["astroport:ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4-terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26"]:
      "terra1w579ysjvpx7xxhckxewk8sykxz70gm48wpcuruenl29rhe6p6raslhj0m6",
    ["astroport:terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26-terra1x62mjnme4y0rdnag3r8rfgjuutsqlkkyuh4ndgex0wl3wue25uksau39q8"]:
      "terra1muhks8yr47lwe370wf65xg5dmyykrawqpkljfm39xhkwhf4r7jps0gwl4l",
  };
  for (const route of routes) {
    await route.preparePairs(cache, terra);
  }

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
          route: route.assets,
          router_type: {
            t_f_m: {
              route: route.toTfmRoute(),
            },
          },
          router:
            "terra19hz374h6ruwtzrnm8ytkae782uv79h9yt9tuytgvt94t26c4793qnfg7vn",
        },
      }
  );

  if (1 != 1) {
    insert_routes.push([] as any);
    console.log(
      "🚀 ~ file: 7_add_route_tfm.ts:258 ~ insert_routes:",
      insert_routes
    );
  }

  // const todelete = routes.map(
  //   (route) =>
  //     <RouteDelete>{
  //       from: route.assets[0],
  //       to: route.assets[route.assets.length - 1],
  //       both: true,
  //     }
  // );

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(address, argv.contract, <ExecuteMsg>{
        update_config: {
          // delete_routes: todelete,
          insert_routes: insert_routes,
        },
      }),
    ]
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
