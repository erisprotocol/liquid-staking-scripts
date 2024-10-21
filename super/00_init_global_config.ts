import yargs from "yargs/yargs";
import { Chains, addInfo, createLCDClient, createWallet, getInfo, getPrefix, instantiateWithConfirm } from "../helpers";
import * as keystore from "../keystore";
import { InstantiateMsg } from "../types/super/util-global-config/instantiate";
import { Codes, SuperInfoKeys, config } from "./config";

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
  const msg = (templates[network] as InstantiateMsg) ?? {};
  msg.owner = config[network]?.owner ?? "";

  const result = await instantiateWithConfirm(
    deployer,
    deployer.key.accAddress(getPrefix()),
    +getInfo("super", network, SuperInfoKeys.code(Codes.util_global_config)),
    msg,
    Codes[Codes.util_global_config]
  );

  addInfo("super", network, SuperInfoKeys.global_config_addr, result.address);
})();
