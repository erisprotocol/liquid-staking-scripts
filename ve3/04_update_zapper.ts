/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import { RouteBuilder } from "../amp-compounder/RouteBuilder";
import { tokens } from "../amp-compounder/tokens";
import { Chains, createLCDClient, createWallet, getInfo, getPrefix, sendTxWithConfirm, toNew } from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg, RouteInit } from "../types/ve3/zapper/execute";
import { Ve3InfoKeys } from "./config";

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
  })
  .parseSync();

(async function () {
  const network = argv["network"] as Chains;
  const terra = createLCDClient(network);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const address = admin.key.accAddress(getPrefix());
  const contract = getInfo("ve3", network, Ve3InfoKeys.zapper_addr);

  const centers = [tokens.luna];

  const routes = [
    // RouteBuilder.start(tokens.ampluna).astro(tokens.luna),
    // using whale as ampluna pcl has issues
    RouteBuilder.start(tokens.ampluna).whale(tokens.luna),
    RouteBuilder.start(tokens.boneluna).whale(tokens.luna),

    RouteBuilder.start(tokens.astro_native).astro(tokens.axlUsdc).astro(tokens.luna),

    RouteBuilder.start(tokens.solid).astro(tokens.luna),
    RouteBuilder.start(tokens.solid).astro(tokens.usdc),

    RouteBuilder.start(tokens.ampwhale).whale(tokens.whale).whale(tokens.luna),

    RouteBuilder.start(tokens.bonewhale).whale(tokens.whale).whale(tokens.luna),

    RouteBuilder.start(tokens.roar).whale(tokens.whale),
    RouteBuilder.start(tokens.roar).astro(tokens.luna),

    RouteBuilder.start(tokens.luna).astro(tokens.usdc),
    RouteBuilder.start(tokens.luna).whale(tokens.usdt),
    RouteBuilder.start(tokens.usdc).astro(tokens.usdt),

    RouteBuilder.start(tokens.luna).astro(tokens.axlWbtc),
    RouteBuilder.start(tokens.luna).whale(tokens.wbtc),

    RouteBuilder.start(tokens.luna).astro(tokens.atom),
    RouteBuilder.start(tokens.luna).whale(tokens.inj),
    RouteBuilder.start(tokens.luna).whale(tokens.wsol),
    // RouteBuilder.start(tokens.luna).astro(tokens.astro).astro(tokens.xastro_native),
    // RouteBuilder.start(tokens.rswth).astro(tokens.swth),
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
    ["whitewhale:ibc/36A02FFC4E74DF4F64305130C3DFA1B06BEAC775648927AA44467C76A77AB8DB-uluna"]:
      "terra1zushwxgqdkg22mtv9p946yp53r6den6lv427esjaadua3ftzyjpsqgtl5z",
    ["astroport:terra17aj4ty4sz4yhgm08na8drc0v03v2jwr3waxcqrwhajj729zhl7zqnpc0ml-uluna"]:
      "terra1h32epkd72x7st0wk49z35qlpsxf26pw4ydacs8acq6uka7hgshmq7z7vl9",
    ["astroport:ibc/8D8A7F7253615E5F76CB6252A1E1BD921D5EDB7BBAAF8913FB1C77FF125D9995-ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4"]:
      "terra1pcge26n2f7p8cwuk42ehj2mqp52ps5dnssd94655elp0gz97u36se894z8",
    ["whitewhale:terra17aj4ty4sz4yhgm08na8drc0v03v2jwr3waxcqrwhajj729zhl7zqnpc0ml-uluna"]:
      "terra1j5znhs9jeyty9u9jcagl3vefkvzwqp6u9tq9a3e5qrz4gmj2udyqp0z0xc",

    ["whitewhale:terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct-uluna"]:
      "terra1tsx0dmasjvd45k6tdywzv77d5t9k3lpzyuleavuah77pg3lwm9cq4469pm",
    ["astroport:ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4-terra10aa3zdkrc7jwuf8ekl3zq7e7m42vmzqehcmu74e4egc7xkm5kr2s0muyst"]:
      "terra1jd04eztujfgt4z0uyw7lkm0gujs0gpxs6pd5gv8ltt5xccmq3v8sppm7wg",
    ["whitewhale:ibc/36A02FFC4E74DF4F64305130C3DFA1B06BEAC775648927AA44467C76A77AB8DB-ibc/517E13F14A1245D4DE8CF467ADD4DA0058974CDCC880FA6AE536DBCA1D16D84E"]:
      "terra1j9jmsplecj9ay2py27953p84nfmv7f6ce75ms5fleyhd0aecpc7q0hgmsa",
    ["astroport:terra1lxx40s29qvkrcj8fsa3yzyehy7w50umdvvnls2r830rys6lu2zns63eelv-uluna"]:
      "terra189v2ewgfx5wdhje6geefdtxefeemujplk8qw2wx3x5hdswn95l8qf4n2r0",

    ["astroport:terra10aa3zdkrc7jwuf8ekl3zq7e7m42vmzqehcmu74e4egc7xkm5kr2s0muyst-uluna"]:
      "terra1e45ctmel6t5m9vdgxv3zxh3ecflkfcd6mr42sluzrqnhveqmy3fss338s7",
    ["astroport:ibc/2C962DAB9F57FE0921435426AE75196009FAA1981BF86991203C8411F8980FDB-terra10aa3zdkrc7jwuf8ekl3zq7e7m42vmzqehcmu74e4egc7xkm5kr2s0muyst"]:
      "terra1fwjxdjpl98shj20l4swlen9hyu4lhvekrvqkqn393lzzghmsn2wqjdnvpu",
    ["astroport:ibc/2C962DAB9F57FE0921435426AE75196009FAA1981BF86991203C8411F8980FDB-uluna"]:
      "terra1v3lqxl0eyte9x3nhdgcj8hwvjq76aupnnzz0yll8mxs5cckc29pqvg2scu",
    ["whitewhale:ibc/9B19062D46CAB50361CE9B0A3E6D0A7A53AC9E7CB361F32A73CC733144A9A9E5-uluna"]:
      "terra1wymgwg90ry2w04avy899ucmuuak7w8n3xw2msmw2jf9rfugre0ssenx4hn",
    ["astroport:ibc/2C962DAB9F57FE0921435426AE75196009FAA1981BF86991203C8411F8980FDB-ibc/9B19062D46CAB50361CE9B0A3E6D0A7A53AC9E7CB361F32A73CC733144A9A9E5"]:
      "terra1dnssvse0fqw4d4gqc8kvchfud5r6e8cr7w9cdpervhl2pgr2eecquujpg6",
    ["astroport:ibc/05D299885B07905B6886F554B39346EA6761246076A1120B1950049B92B922DD-uluna"]:
      "terra1afkvgc0mxfqakqlaqpxdgy58n79x4r239q3tucxmrsqvqk7ce3ksnctxfu",
    ["whitewhale:ibc/05D299885B07905B6886F554B39346EA6761246076A1120B1950049B92B922DD-uluna"]:
      "terra1xhhr7x8yhv9p336t3squh5f8t2827ttrevnwrwwvqrp88nkt665qy0w07c",
    ["astroport:ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2-uluna"]:
      "terra1j3d29y506cvtavdpakdzl6e0g2xcskvmmulsetcd0jfwrpr8eu9qfe0dmf",
    ["whitewhale:ibc/25BC59386BB65725F735EFC0C369BB717AA8B5DAD846EAF9CBF5D0F18F207211-uluna"]:
      "terra1q2gd6kc7nt8xct94chrlsqtpxfs9rve0j76lquce624y5zp85cdseshh85",
    ["whitewhale:terra1ctelwayk6t2zu30a8v9kdg3u2gr0slpjdfny5pjp7m3tuquk32ysugyjdg-uluna"]:
      "terra12u7a9wkjqrkhxjcxx70uhfx8y49j4lclfnet2smw9agpnrv9chps27n9mh",
  };

  for (const route of routes) {
    await route.preparePairs(cache, terra);
  }

  console.log("DONE");

  const insert_routes = routes.map(
    (route) =>
      <RouteInit>{
        routes: route.routes.map((step) => ({
          from: toNew(step.assets[0]),
          to: toNew(step.assets[1]),
          stage_type:
            step.type === "astroport"
              ? {
                  astroport: {
                    pair: step.pair!,
                  },
                }
              : {
                  white_whale: {
                    pair: step.pair!,
                  },
                },
        })),
      }
  );

  console.log(JSON.stringify(insert_routes, undefined, 2));

  const { txhash } = await sendTxWithConfirm(admin, [
    new MsgExecuteContract(address, contract, <ExecuteMsg>{
      update_config: {
        insert_routes: insert_routes,
        update_centers: centers.map(toNew),
      },
    }),
  ]);
  console.log(`Txhash: ${txhash}`);
})();
