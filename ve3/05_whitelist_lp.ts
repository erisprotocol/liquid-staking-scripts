import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  Chains,
  createLCDClient,
  createWallet,
  getInfo,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/ve3/asset-staking/execute";
import { Ve3InfoKeys, config } from "./config";

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
      demandOption: false,
    },
    gauge: {
      type: "string",
      demandOption: true,
    },
  })
  .parseSync();

(async function () {
  const network = argv["network"] as Chains;
  const terra = createLCDClient(network);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);
  const gauge = argv.gauge;

  const address = admin.key.accAddress(getPrefix());
  const contract =
    argv.contract ||
    getInfo("ve3", network, Ve3InfoKeys.asset_staking_addr(gauge));

  if (!config[network]) {
    throw new Error(`no data available for network ${network}`);
  }

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(address, contract, <ExecuteMsg>{
        whitelist_assets: [
          // Astroport LUNA-axlUSDC
          // {
          //   info: {
          //     cw20: "terra1f8epc9r74uk2yle4nnrw9j95a2t3p5nalr7r0zlhc8zuy3fwhmqqqefvh6",
          //   },
          //   config: {
          //     stake_config: {
          //       astroport: {
          //         contract:
          //           "terra1eywh4av8sln6r45pxq45ltj798htfy0cfcf7fy3pxc2gcv6uc07se4ch9x",
          //         reward_infos: [
          //           {
          //             native: tokens.astro_native.native_token.denom,
          //           },
          //         ],
          //       },
          //     },
          //     yearly_take_rate: "0.1",
          //   },
          // },

          // WW LUNA-WHALE
          {
            info: {
              native:
                "factory/terra1zushwxgqdkg22mtv9p946yp53r6den6lv427esjaadua3ftzyjpsqgtl5z/uLP",
            },
          },
        ],
      }),
    ]
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
