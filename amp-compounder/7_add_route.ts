import { MsgExecuteContract } from "@terra-money/terra.js";
import yargs from "yargs/yargs";
import { createLCDClient, createWallet, sendTxWithConfirm } from "../helpers";
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

// ts-node 7_add_route.ts --network mainnet --key mainnet --contract terra1cs0tkknd2t94jd7hgdkmfyvenwr05ztra4rj6uackr597j9jfkxsghtywg

(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(admin.key.accAddress, argv.contract, <ExecuteMsg>{
        update_config: {
          insert_routes: [
            // {
            //   path: {
            //     route: [
            //       {
            //         token: {
            //           contract_addr:
            //             "terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct",
            //         },
            //       },
            //       { native_token: { denom: "uluna" } },
            //       {
            //         token: {
            //           contract_addr:
            //             "terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26",
            //         },
            //       },
            //     ],
            //     router:
            //       "terra1j8hayvehh3yy02c2vtw5fdhz9f4drhtee8p5n5rguvg3nyd6m83qd2y90a",
            //     router_type: "astro_swap",
            //   },
            // },
            {
              path: {
                route: [
                  {
                    token: {
                      contract_addr:
                        "terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct",
                    },
                  },
                  { native_token: { denom: "uluna" } },
                  {
                    native_token: {
                      denom:
                        "ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4",
                    },
                  },
                ],
                router:
                  "terra1j8hayvehh3yy02c2vtw5fdhz9f4drhtee8p5n5rguvg3nyd6m83qd2y90a",
                router_type: "astro_swap",
              },
            },
          ],
        },
      }),
    ]
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
