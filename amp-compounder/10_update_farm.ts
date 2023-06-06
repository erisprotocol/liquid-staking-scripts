import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/amp-compounder/astroport_farm/eris_astroport_farm_execute";

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
    contract: {
      type: "string",
      demandOption: true,
    },
  })
  .parseSync();

// ts-node amp-compounder/10_update_farm.ts --network mainnet --key mainnet --contract terra1l4phwrfqyg9l0vzlqcxn0vmnjd45rp5gx620zc2updpc9peazteqfk3y2p

(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(admin.key.accAddress(getPrefix()), argv.contract, <
        ExecuteMsg
      >{
        update_config: {
          deposit_profit_delay_s: 1 * 10 * 60,
        },
      }),
    ]
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
