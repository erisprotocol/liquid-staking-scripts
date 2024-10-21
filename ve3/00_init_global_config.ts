import yargs from "yargs/yargs";
import { Chains, addInfo, createLCDClient, createWallet, getPrefix, instantiateWithConfirm } from "../helpers";
import * as keystore from "../keystore";
import { InstantiateMsg } from "../types/ve3/global-config/instantiate";
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
  })
  .parseSync();

const templates: Partial<Record<Chains, any>> = {
  "mainnet-copy": <InstantiateMsg>{
    owner: "",
  },
  mainnet: <InstantiateMsg>{
    owner: "",
  },
};

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const network = argv["network"] as Chains;
  const msg = templates[network] as InstantiateMsg;
  msg.owner = config[network]?.owner ?? "";

  const result = await instantiateWithConfirm(
    deployer,
    deployer.key.accAddress(getPrefix()),
    argv.contractCodeId,
    msg,
    argv.label
  );

  addInfo("ve3", network, Ve3InfoKeys.global_config_addr, result.address);
})();
