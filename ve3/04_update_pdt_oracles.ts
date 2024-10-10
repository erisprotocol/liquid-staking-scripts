import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import { tokens } from "../amp-compounder/tokens";
import { Chains, createLCDClient, createWallet, getInfo, getPrefix, sendTxWithConfirm, toNew } from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/ve3/phoenix-treasury/execute";
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
  })
  .parseSync();

(async function () {
  const network = argv["network"] as Chains;
  const terra = createLCDClient(network);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const address = admin.key.accAddress(getPrefix());
  const contract = argv.contract || getInfo("ve3", network, Ve3InfoKeys.pdt_axl_recovery_addr);

  const connector = (x: string) => `CONNECTOR__${x}`;
  const staking = (x: string) => `ASSET_STAKING__${x}`;

  if (!config[network]) {
    throw new Error(`no data available for network ${network}`);
  }

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(address, contract, <ExecuteMsg>{
        update_config: {
          add_oracle: [
            [
              toNew(tokens.luna),
              {
                pair: {
                  contract: "terra1v3lqxl0eyte9x3nhdgcj8hwvjq76aupnnzz0yll8mxs5cckc29pqvg2scu",
                  simulation_amount: "1000000",
                },
              },
            ],
            [toNew(tokens.usdc), "usdc"],
            [toNew(tokens.usdt), "usdc"],
            [
              toNew(tokens.axlWbtc),
              {
                route: {
                  path: [toNew(tokens.luna), toNew(tokens.usdc)],
                  contract: "terra1j8hayvehh3yy02c2vtw5fdhz9f4drhtee8p5n5rguvg3nyd6m83qd2y90a",
                  simulation_amount: "10000",
                },
              },
            ],
            [toNew(tokens.axlUsdc), "usdc"],
            [toNew(tokens.axlUsdt), "usdc"],
          ],
        },
      }),
    ]
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
