import { TxLog } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  addInfo,
  Chains,
  createLCDClient,
  createWallet,
  getPrefix,
  instantiateWithConfirm
} from "../helpers";
import * as keystore from "../keystore";
import { InstantiateMsg } from "../types/launchpad/launch-nft/instantiate";
import { config, LaunchpadInfoKeys } from "./config";

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
/** @type {*} */
const templates: Partial<Record<Chains, any>> = {
  neutron: <InstantiateMsg>{
    owner: "",
    config: {
      fee_la: '0.03',
      fee_nft: '0.02',
      fee_recipient: '',
      whitelist: []
    },
  },
  mainnet: <InstantiateMsg>{
    owner: "",
    config: {
      fee_la: '0.03',
      fee_nft: '0.02',
      fee_recipient: '',
      whitelist: []
    },
  },
};

(async function () {
  const network = argv["network"] as Chains;
  const terra = createLCDClient(network);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const msg = templates[network] as InstantiateMsg;
  msg.owner = config[network]?.owner ?? "";
  msg.config.fee_recipient = config[network]?.dao ?? "";

  console.log(msg);

  const result = await instantiateWithConfirm(
    deployer,
    deployer.key.accAddress(getPrefix()),
    argv.contractCodeId,
    msg,
    "launch-nft-" + argv.label
  );

  console.log("logs", JSON.stringify(result.logs));

  const addresses = result.logs.map((a: TxLog) => a.eventsByType["instantiate"]["_contract_address"][0]);

  console.log(`Contract instantiated! Address: ${addresses}`);
  addInfo("launchpad", network, LaunchpadInfoKeys.launch_nft_addr(argv.label), addresses[0]);
})();
