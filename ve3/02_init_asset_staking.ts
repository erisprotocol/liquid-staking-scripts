import { TxLog } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
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
import { InstantiateMsg } from "../types/ve3/asset-staking/instantiate";
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
    gauge: {
      type: "string",
      demandOption: true,
    },
  })
  .parseSync();

const templates: Partial<Record<Chains, any>> = {
  "mainnet-copy": <InstantiateMsg>{
    global_config_addr: "",
    default_yearly_take_rate: "0.1",
    gauge: "",
    reward_info: {
      native: "",
    },
  },
  mainnet: <InstantiateMsg>{
    global_config_addr: "",
    default_yearly_take_rate: "0.1",
    gauge: "",
    reward_info: {
      native: "",
    },
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
  msg.reward_info = {
    native: getInfo(
      "ve3",
      network,
      Ve3InfoKeys.alliance_connector_zasset(msg.gauge)
    ),
  };

  const result = await instantiateWithConfirm(
    deployer,
    deployer.key.accAddress(getPrefix()),
    argv.contractCodeId,
    msg,
    argv.label
  );

  const addresses = result.logs.map(
    (a: TxLog) => a.eventsByType["instantiate"]["_contract_address"][0]
  );

  console.log(`Contract instantiated! Address: ${addresses}`);
  addInfo(
    "ve3",
    network,
    Ve3InfoKeys.asset_staking_addr(msg.gauge),
    addresses[0]
  );
})();
