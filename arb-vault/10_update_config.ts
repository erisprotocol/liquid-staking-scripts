import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/arb-vault/eris_arb_vault_execute";

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

// ts-node arb-vault/10_update_config.ts --network mainnet --key mainnet --contract terra1r9gls56glvuc4jedsvc3uwh6vj95mqm9efc7hnweqxa2nlme5cyqxygy5m
// arbOSMO
// ts-node arb-vault/10_update_config.ts --network osmosis --key key-mainnet --contract osmo1lq8g8jax6wh0dfwfjnyqm69q6zuv08dkppeemllqlwdyhfv06njquhcejr
(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const account = admin.key.accAddress(getPrefix());
  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(account, argv.contract, <ExecuteMsg>{
        update_config: {
          // unbond_time_s: (14 + 3) * 24 * 60 * 60,
          // utilization_method: {
          //   steps: [
          //     ["0.01", "0.4"],
          //     ["0.02", "0.7"],
          //     ["0.03", "0.9"],
          //     ["0.05", "1.0"],
          //   ],
          // },
          // insert_lsd: {
          //   name: "LunaX",
          //   disabled: false,
          //   lsd_type: {
          //     stader: {
          // addr: "terra179e90rqspswfzmhdl25tg22he0fcefwndgzc957ncx9dleduu7ms3evpuk",
          // cw20: "terra14xsm2wzvu7xaf567r693vgfkhmvfs08l68h4tjj5wjgyn5ky8e2qvzyanh",
          //     },
          //   },
          // },
          // insert_lsd: {
          //   name: "boneLUNA",
          //   disabled: false,
          //   lsd_type: {
          //     backbone: {
          //       addr: "terra1l2nd99yze5fszmhl5svyh5fky9wm4nz4etlgnztfu4e8809gd52q04n3ea",
          //       cw20: "terra17aj4ty4sz4yhgm08na8drc0v03v2jwr3waxcqrwhajj729zhl7zqnpc0ml",
          //     },
          //   },
          // },
          // insert_lsd: {
          //   disabled: false,
          //   lsd_type: {
          //     stader: {
          //       addr: "terra179e90rqspswfzmhdl25tg22he0fcefwndgzc957ncx9dleduu7ms3evpuk",  :1468800
          //       cw20: "terra14xsm2wzvu7xaf567r693vgfkhmvfs08l68h4tjj5wjgyn5ky8e2qvzyanh",
          //     },
          //   },
          //   name: "LunaX",
          // },
          // force_remove_lsd: "boneLUNA",
          // set_whitelist: [
          //   "terra1gtuvt6eh4m67tvd2dnfqhgks9ec6ff08c5vlup",
          //   "terra187r4dlnw8negcvupryhtgc88vcy0w7j3e7n69e",
          //   "terra1m8hqwvajj5ehnm3qt5yam6ufrg8se5fdvj5gyu",
          //   "terra1zu6wprm7dzasrrj692cynvgsf3skentxldplr3",
          //   "terra1ypg6ky6akzu57940sk203jhz2lt3udc9cvzryp",
          //   "terra138tlx5dlkclka5lc8xkxxswrry2upras3y54e5",
          //   "terra10ggjkjwzt3jcfng00w5mny26p04erczms5j3yu",
          //   "terra18ukmp3pqdpx0dv2q476h400e2dawy0jdef926j",
          // ],
        },
      }),
    ]
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
