import yargs from "yargs/yargs";
import { Chains, addInfo, createLCDClient, createWallet, getInfo, getPrefix, instantiateWithConfirm } from "../helpers";
import * as keystore from "../keystore";
import { InstantiateMsg } from "../types/superbolt/super-offer/instantiate";
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

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const network = argv["network"] as Chains;
  const c = config[network];
  if (!c) {
    throw new Error("needs config");
  }

  const msg = <InstantiateMsg>{
    global_config_addr: getInfo("super", network, SuperInfoKeys.global_config_addr),
  };

  const result = await instantiateWithConfirm(
    deployer,
    deployer.key.accAddress(getPrefix()),
    +getInfo("super", network, SuperInfoKeys.code(Codes.super_offer)),
    msg,
    Codes[Codes.super_offer]
  );

  addInfo("super", network, SuperInfoKeys.offer, result.address);
})();
