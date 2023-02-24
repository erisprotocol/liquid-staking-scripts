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

// ts-node amp-compounder/7_add_lp.ts --network testnet --key testnet --contract terra1pk3hj8k0nasnru5p0pfrsrhkfpqdway8ef8rqzn204r0ykvz8srqvyf4x0
// ts-node amp-compounder/7_add_lp.ts --network mainnet --key mainnet --contract terra1cs0tkknd2t94jd7hgdkmfyvenwr05ztra4rj6uackr597j9jfkxsghtywg

// commission_bps
(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const account = admin.key.accAddress(getPrefix());

  const { txhash } = await sendTxWithConfirm(admin, [
    new MsgExecuteContract(account, argv.contract, <ExecuteMsg>{
      update_config: {
        upsert_lps: [
          // {
          //   commission_bps: 5,
          //   pair_contract:
          //     "terra1h32epkd72x7st0wk49z35qlpsxf26pw4ydacs8acq6uka7hgshmq7z7vl9",
          //   slippage_tolerance: "0.01",
          //   wanted_token: {
          //     native_token: {
          //       denom: "uluna",
          //     },
          //   },
          // },
          {
            commission_bps: 30,
            pair_contract:
              "terra1nckl6ex6239tv4kjzv03ecmuxwakjm8uj8cy6p850vmlmejfmj9sy094yr",
            slippage_tolerance: "0.01",
            wanted_token: {
              native_token: {
                denom: "uluna",
              },
            },
          },
        ],
      },
    }),
  ]);
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
