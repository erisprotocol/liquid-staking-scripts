import yargs from "yargs/yargs";
import { Chains, addInfo, createLCDClient, createWallet, getInfo, getPrefix, instantiateWithConfirm } from "../helpers";
import * as keystore from "../keystore";
import { InstantiateMsg } from "../types/super/super-foundry/instantiate";
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
    astroport_factory: c.astroport_factory,

    candy_code_id: +getInfo("super", network, SuperInfoKeys.code(Codes.super_candy)),
    collection_code_id: +getInfo("super", network, SuperInfoKeys.code(Codes.super_collection)),
    collector_code_id: +getInfo("super", network, SuperInfoKeys.code(Codes.super_collector)),
    minter_code_id: +getInfo("super", network, SuperInfoKeys.code(Codes.super_minter)),
    particle_code_id: +getInfo("super", network, SuperInfoKeys.code(Codes.super_particles)),

    candy_protocol_fee: c.candy_fee,
    creation_fee: c.creation_fee,
    pool_tax: c.pool_tax,
    global_config_addr: getInfo("super", network, SuperInfoKeys.global_config_addr),
  };

  const result = await instantiateWithConfirm(
    deployer,
    deployer.key.accAddress(getPrefix()),
    +getInfo("super", network, SuperInfoKeys.code(Codes.super_foundry)),
    msg,
    Codes[Codes.super_foundry]
  );

  addInfo("super", network, SuperInfoKeys.foundry, result.address);
})();
