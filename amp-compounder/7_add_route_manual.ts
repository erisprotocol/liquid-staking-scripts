/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { AssetInfo } from "../types/ampz/eris_ampz_execute";
import { getContractFromTokenFactory, tokens } from "./tokens";

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

// mainnet router: terra1j8hayvehh3yy02c2vtw5fdhz9f4drhtee8p5n5rguvg3nyd6m83qd2y90a
// ts-node amp-compounder/7_add_route_manual.ts --network mainnet --key mainnet --contract terra1cs0tkknd2t94jd7hgdkmfyvenwr05ztra4rj6uackr597j9jfkxsghtywg

const tokensUntyped: Record<string, AssetInfo> = tokens;

const contractToToken = new Map(
  Object.keys(tokens).map((key) => [getToken(tokensUntyped[key]), key])
);

function getToken(a: AssetInfo) {
  if ("token" in a) {
    return a.token.contract_addr;
  } else {
    return a.native_token.denom;
  }
}

(async function () {
  const terra = createLCDClient(argv["network"]);

  // const getRoutes = (start_after: [AssetInfo, AssetInfo] | null) => {
  //   return terra.wasm.contractQuery<
  //     {
  //       key: [string, string];
  //     }[]
  //   >(argv.contract, {
  //     get_routes: { limit: 30, start_after },
  //   });
  // };

  // let start_with: null | [AssetInfo, AssetInfo] = null;
  // let length = 30;

  // while (length === 30) {
  //   const existingRoutes = await getRoutes(start_with);

  //   const used: [string, string][] = existingRoutes.map(
  //     (a) => a.key.map((b) => contractToToken.get(b)!) as [string, string]
  //   );
  //   length = existingRoutes.length;

  //   const last = used[used.length - 1];

  //   console.log(used, existingRoutes.length);
  //   start_with = [tokensUntyped[last[0]], tokensUntyped[last[1]]];
  // }

  // return;

  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);
  const address = admin.key.accAddress(getPrefix());

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(address, argv.contract, <ExecuteMsg>{
        update_config: {
          insert_routes: [
            // {
            //   pair_proxy: {
            //     pair_contract: getContractFromTokenFactory(tokens.ampwhalet),
            //   },
            // },
            {
              pair_proxy: {
                pair_contract: getContractFromTokenFactory(tokens.bonewhalet),
              },
            },
          ],
        },
      }),
    ]
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
