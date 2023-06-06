import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/amp-compounder/compound_proxy/execute_msg";

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

// MAINNET
// ts-node 7_add_route.ts --network mainnet --key mainnet --contract terra1cs0tkknd2t94jd7hgdkmfyvenwr05ztra4rj6uackr597j9jfkxsghtywg

// TESTNET
// ts-node amp-compounder/7_change_slippage.ts --network testnet --key testnet --contract terra1pk3hj8k0nasnru5p0pfrsrhkfpqdway8ef8rqzn204r0ykvz8srqvyf4x0

(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const address = admin.key.accAddress(getPrefix());
  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(address, argv.contract, <ExecuteMsg>{
        update_config: {
          default_max_spread: 50,
        },
      }),
    ]
  );
  console.log(`Contract update config! Txhash: ${txhash}`);
})();
