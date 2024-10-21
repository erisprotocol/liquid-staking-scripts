import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import { Chains, createLCDClient, createWallet, getInfo, getPrefix, sendTxWithConfirm } from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/super/super-foundry/execute";
import { Codes, SuperInfoKeys } from "./config";

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
  const network = argv["network"] as Chains;
  const terra = createLCDClient(network);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const address = admin.key.accAddress(getPrefix());
  const contract = getInfo("super", network, SuperInfoKeys.foundry);

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(address, contract, <ExecuteMsg>{
        update_config: {
          candy_code_id: +getInfo("super", network, SuperInfoKeys.code(Codes.super_candy)),
          collection_code_id: +getInfo("super", network, SuperInfoKeys.code(Codes.super_collection)),
          collector_code_id: +getInfo("super", network, SuperInfoKeys.code(Codes.super_collector)),
          minter_code_id: +getInfo("super", network, SuperInfoKeys.code(Codes.super_minter)),
          particle_code_id: +getInfo("super", network, SuperInfoKeys.code(Codes.super_particles)),
        },
      }),
    ]
  );
  console.log(`Txhash: ${txhash}`);
})();
