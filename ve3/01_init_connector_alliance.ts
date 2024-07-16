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
} from "../helpers";
import * as keystore from "../keystore";
import { InstantiateMsg } from "../types/ve3/connector-alliance/instantiate";
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
    "contract-code-id": {
      type: "number",
      demandOption: true,
    },
    label: {
      type: "string",
      demandOption: true,
    },
    gauge: {
      type: "string",
      demandOption: true,
    },
  })
  .parseSync();

const templates: Partial<Record<Chains, any>> = {
  "mainnet-copy": <InstantiateMsg>{
    global_config_addr: "",
    alliance_token_denom: "vt",
    gauge: "",
    lst_asset_info: {
      cw20: tokens.ampluna.token.contract_addr,
    },
    lst_hub_address: "",
    reward_denom: "uluna",
    zasset_denom: "zluna",
  },
};

(async function () {
  const network = argv["network"] as Chains;
  const terra = createLCDClient(network);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const msg = templates[network] as InstantiateMsg;
  msg.global_config_addr = getInfo(
    "ve3",
    network,
    Ve3InfoKeys.global_config_addr
  );
  msg.gauge = argv.gauge;
  msg.lst_hub_address = config[network]?.lst_hub ?? "";

  const result = await instantiateWithConfirm(
    deployer,
    deployer.key.accAddress(getPrefix()),
    argv.contractCodeId,
    msg,
    argv.label,
    {
      uluna: (2 * 10 * 1e6).toFixed(0),
    }
  );

  const addresses = result.logs.map(
    (a: TxLog) => a.eventsByType["instantiate"]["_contract_address"][0]
  );

  console.log(`Contract instantiated! Address: ${addresses}`);
  addInfo(
    "ve3",
    network,
    Ve3InfoKeys.alliance_connector_addr(msg.gauge),
    addresses[0]
  );
  addInfo(
    "ve3",
    network,
    Ve3InfoKeys.alliance_connector_zasset(msg.gauge),
    `factory/${addresses[0]}/${msg.zasset_denom}`
  );
  addInfo(
    "ve3",
    network,
    Ve3InfoKeys.alliance_connector_vt(msg.gauge),
    `factory/${addresses[0]}/${msg.alliance_token_denom}`
  );
})();
