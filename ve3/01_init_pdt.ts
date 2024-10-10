import { TxLog } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import { tokens } from "../amp-compounder/tokens";
import {
  Chains,
  addInfo,
  createLCDClient,
  createWallet,
  getInfo,
  getPrefix,
  instantiateWithConfirm,
  toNew,
} from "../helpers";
import * as keystore from "../keystore";
import { InstantiateMsg } from "../types/ve3/phoenix-treasury/instantiate";
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
    "contract-code-id": {
      type: "number",
      demandOption: true,
    },
    label: {
      type: "string",
      demandOption: true,
    },
  })
  .parseSync();

const templates: Partial<Record<Chains, any>> = {
  mainnet: <InstantiateMsg>{
    global_config_addr: "",
    veto_owner: "terra10d07y265gmmuvt4z0w9aw880jnsr700juxf95n",
    alliance_token_denom: "vt",
    oracles: [
      [
        toNew(tokens.luna),
        {
          pair: {
            contract: "terra1v3lqxl0eyte9x3nhdgcj8hwvjq76aupnnzz0yll8mxs5cckc29pqvg2scu",
            simulation_amount: "1000000",
          },
        },
      ],
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
      [toNew(tokens.usdc), "usdc"],
      [toNew(tokens.usdt), "usdc"],
      [toNew(tokens.axlUsdc), "usdc"],
      [toNew(tokens.axlUsdt), "usdc"],
    ],
    reward_denom: "uluna",
    vetos: [
      {
        vetoer: "terra10d07y265gmmuvt4z0w9aw880jnsr700juxf95n",
        spend_above_usd: "0",
        spend_above_usd_30d: "0",
        delay_s: 0,
      },
      {
        vetoer: "terra10d07y265gmmuvt4z0w9aw880jnsr700juxf95n",
        spend_above_usd: "150000",
        spend_above_usd_30d: "450000",
        delay_s: 10 * 24 * 60 * 60,
      },
      {
        vetoer: "terra15l7567hhxttv2k5enmu4k8uez8e3cx3sxqfg6fsq4zzuwuzy2fqsjq00gr",
        spend_above_usd: "50000",
        spend_above_usd_30d: "150000",
        delay_s: 3 * 24 * 60 * 60,
      },
    ],
  },
};

(async function () {
  const network = argv["network"] as Chains;
  const terra = createLCDClient(network);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const msg = templates[network] as InstantiateMsg;
  msg.global_config_addr = getInfo("ve3", network, Ve3InfoKeys.global_config_addr);

  const result = await instantiateWithConfirm(
    deployer,
    deployer.key.accAddress(getPrefix()),
    argv.contractCodeId,
    msg,
    argv.label,
    {
      uluna: (1 * 10 * 1e6).toFixed(0),
    }
  );

  const addresses = result.logs.map((a: TxLog) => a.eventsByType["instantiate"]["_contract_address"][0]);

  console.log(`Contract instantiated! Address: ${addresses}`);
  addInfo("ve3", network, Ve3InfoKeys.pdt_addr, addresses[0]);
})();
