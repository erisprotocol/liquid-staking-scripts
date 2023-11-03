import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import { tokens } from "../amp-compounder/tokens";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/ampz/eris_ampz_execute";

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

(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const address = admin.key.accAddress(getPrefix());
  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(address, argv.contract, <ExecuteMsg>{
        update_config: {
          // astroport: {
          //   generator:
          //     "terra1gc4d4v82vjgkz0ag28lrmlxx3tf6sq69tmaujjpe7jwmnqakkx0qm28j2l",
          //   coins: [
          //     {
          //       token: {
          //         contract_addr:
          //           "terra167dsqkh2alurx997wmycw9ydkyu54gyswe3ygmrs4lwume3vmwks8ruqnv",
          //       },
          //     },
          //     {
          //       native_token: {
          //         denom: "uluna",
          //       },
          //     },
          //   ],
          // },
          // zapper:
          //   "terra1pk3hj8k0nasnru5p0pfrsrhkfpqdway8ef8rqzn204r0ykvz8srqvyf4x0",
          // fee: {
          //   fee_bps: 100,
          //   operator_bps: 100,
          //   receiver: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
          // },
          // capapult: {
          //   market:
          //     "terra1h4cknjl5k0aysdhv0h4eqcaka620g8h69k8h0pjjccxvf9esfhws3cyqnc",
          //   overseer:
          //     "terra10qnsw3wn4uaxs7en2kynhet2dsyy76lmprh2ptcz85d8hu59gkuqcpndnv",
          //   custody:
          //     "terra18uxq2k6wpsqythpakz5n6ljnuzyehrt775zkdclrtdtv6da63gmskqn7dq",
          //   stable_cw:
          //     "terra10aa3zdkrc7jwuf8ekl3zq7e7m42vmzqehcmu74e4egc7xkm5kr2s0muyst",
          // },
          // arb_vault:
          //   "terra1r9gls56glvuc4jedsvc3uwh6vj95mqm9efc7hnweqxa2nlme5cyqxygy5m",
          // add_farms: [
          //   // "terra1lv2cscvakmtaahj8a6kw43zaefzemydwaswrf38sn2s2depv0wls6ut57q",
          //   // "terra1r0ykpvttzxdx573hypmmdzq4g8e2k5cf5ur0rrjhp6mxrux9rmaq9xw9ff",
          //   // "terra1c6vzxwfcfur2fg08n3nhtdlaxpmjd5wk9nztv8fjgfsjgagtghzsfftutt",
          //   // "terra1xskgvsew6u6nmfwv2mc58m4hscr77xw884x65fuxup8ewvvvuyysr5k3lj",
          //   // "terra1q3q88nyhn7a206djjk40xespszrwg26s8j5fswfgsv6cyu8qlsmsncmppe",
          //   // "terra1qv5pklpnqmugqfehsytakk7tj2fsw4kt69xn2gvaq0edsynm9c7qnjecq2",
          //   // "terra1c98f5dg90cyx5uklezsvac46e4c3msq3ghktkmeksyahytsvuh0q438m6c",
          //   // "terra129jsdzd9nm7ywuyr0hlxs3zqm7jle00vtl4akf4wuke4yr5zs82qafcm4n",
          //   // "terra1v4gh6nrps2yjdzqct5m7mwqkfusxgghjvd7sy5dsndsyy86pfyasum2qh5",
          //   // "terra1g0g5ehu2lvdrta9m62yggaa6x375lz5t5zas3xnzmna7kx74szlsw20es6",
          //   // "terra1l4phwrfqyg9l0vzlqcxn0vmnjd45rp5gx620zc2updpc9peazteqfk3y2p"
          //   "terra1zsm7cgu3vg2kwwzzehl38ft7z2ffksql9d6twh3pugvf0yl0u5vs74xx55",
          //   "terra1yfmpzj79n8g356kp6xz0rkjehegwqw7zhus8jzreqvec5ay9a7kqs7a6hc",
          // ],

          alliance: {
            claim_coins: [tokens.ampwhale, tokens.bonewhale, tokens.rswth],
            contract:
              "terra1jwyzzsaag4t0evnuukc35ysyrx9arzdde2kg9cld28alhjurtthq0prs2s",
            tamplifiers: [
              [
                tokens.ampwhale,
                "terra1j35ta0llaxcf55auv2cjqau5a7aee6g8fz7md7my7005cvh23jfsaw83dy",
              ],
              [
                tokens.bonewhale,
                "terra10j3zrymfrkta2pxe0gklc79gu06tqyuy8c3kh6tqdsrrprsjqkrqzfl4df",
              ],
            ],
          },
          whitewhale: {
            coins: [tokens.whale],
            fee_distributor:
              "terra1xm0yh8cv8rww6g87h3q0megt6ntxqzw6p6hgh5l4jrhed4fe7hnq9cvzm5",
            incentive_factory_addr:
              "terra1qsfcuketm4slntdp92kg3ltnn57j7dzq3wg3yqjr8xhsnae6fn3sjmle9y",
            lp_tokens: [],
          },
        },
      }),
    ]
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
