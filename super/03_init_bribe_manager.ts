import { TxLog } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import { Chains, addInfo, createLCDClient, createWallet, getInfo, getPrefix, instantiateWithConfirm } from "../helpers";
import * as keystore from "../keystore";
import { InstantiateMsg } from "../types/ve3/bribe-manager/instantiate";
import { SuperInfoKeys } from "./config";

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
  "mainnet-copy": <InstantiateMsg>{
    global_config_addr: "",
    fee: {
      amount: "1000000",
      info: {
        native: "uluna",
      },
    },
    whitelist: [],
  },
  mainnet: <InstantiateMsg>{
    global_config_addr: "",
    fee: {
      amount: "10000000",
      info: {
        native: "uluna",
      },
    },
    whitelist: [
      // toNew(tokens.luna),
      // toNew(tokens.axlUsdc),
      // toNew(tokens.usdc),
      // toNew(tokens.ampluna),
      // toNew(tokens.whale),
      // toNew(tokens.solid),
      // toNew(tokens.roar),
      // toNew(tokens.capa),
      // toNew(tokens.astro),
      // toNew(tokens.astro_native),
    ],
  },
};

(async function () {
  const network = argv["network"] as Chains;
  const terra = createLCDClient(network);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const msg = templates[network] as InstantiateMsg;
  msg.global_config_addr = getInfo("super", network, SuperInfoKeys.global_config_addr);

  const result = await instantiateWithConfirm(
    deployer,
    deployer.key.accAddress(getPrefix()),
    argv.contractCodeId,
    msg,
    argv.label
  );

  const addresses = result.logs.map((a: TxLog) => a.eventsByType["instantiate"]["_contract_address"][0]);

  console.log(`Contract instantiated! Address: ${addresses}`);
  addInfo("super", network, SuperInfoKeys.bribe_manager_addr, addresses[0]);
})();
