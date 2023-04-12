import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "./helpers";
import * as keystore from "./keystore";

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
    "factory-address": {
      type: "string",
      demandOption: true,
    },
    "token-address": {
      type: "string",
      demandOption: true,
    },
  })
  .parseSync();

// ts-node 13_provide_liquidity.ts --network testnet --key testnet --factory-address terra1jha5avc92uerwp9qzx3flvwnyxs3zax2rrm6jkcedy2qvzwd2k7qk7yxcl --token-address terra1xgvp6p0qml53reqdyxgcl8ttl0pkh0n2mtx2n7tzfahn6e0vca7s0g7sg6
// ts-node 13_provide_liquidity.ts --network mainnet --key invest --factory-address terra1466nf3zuxpya8q9emxukd7vftaf6h4psr0a07srl5zw74zh84yjqxl5qul --token-address terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct

// terra14lr9zdfn0d5gxjwafh3mg5nrrculj4dndunynve452zws2lzyd3smx46ta
// terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct

// Astroport testnet
// ts-node 13_provide_liquidity.ts --network testnet --key testnet --factory-address terra1z3y69xas85r7egusa0c7m5sam0yk97gsztqmh8f2cc6rr4s4anysudp7k0 --token-address terra1xgvp6p0qml53reqdyxgcl8ttl0pkh0n2mtx2n7tzfahn6e0vca7s0g7sg6

// Astroport classic terra1fnywlw4edny3vw44x04xd67uzkdqluymgreu7g
// ts-node 13_provide_liquidity.ts --network classic --key invest --factory-address terra1fnywlw4edny3vw44x04xd67uzkdqluymgreu7g --token-address terra1wvk6r3pmj0835udwns4r5e0twsclvcyuq9ucgm

// Terraswap classic
// ts-node 13_provide_liquidity.ts --network classic --key invest --factory-address terra1ulgw0td86nvs4wtpsc80thv6xelk76ut7a7apj --token-address terra1wvk6r3pmj0835udwns4r5e0twsclvcyuq9ucgm

// Astroport mainnet
// ts-node 13_provide_liquidity.ts --network mainnet --key ledger --factory-address terra14x9fr055x5hvr48hzy2t4q7kvjvfttsvxusa4xsdcy702mnzsvuqprer8r --token-address terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct

(async function () {
  const terra = createLCDClient(argv["network"]);
  const worker = await createWallet(terra, argv["key"], argv["key-dir"]);

  const token1 = argv["token-address"];
  const token2 =
    "terra10aa3zdkrc7jwuf8ekl3zq7e7m42vmzqehcmu74e4egc7xkm5kr2s0muyst";

  const pair = await worker.lcd.wasm.contractQuery<{ contract_addr: string }>(
    argv["factory-address"],
    {
      pair: {
        asset_infos: [
          {
            token: {
              contract_addr: token1,
            },
          },
          {
            token: {
              contract_addr: token2,
            },
          },
        ],
      },
    }
  );

  console.log("Found contract: " + JSON.stringify(pair));

  const SOLID = 5000;
  const amount1 = (SOLID / 1.7548).toFixed(0);
  const amount2 = SOLID.toFixed(0);

  const { txhash } = await sendTxWithConfirm(worker, [
    new MsgExecuteContract(worker.key.accAddress(getPrefix()), token1, {
      increase_allowance: {
        spender: pair.contract_addr,
        amount: amount1,
        expires: {
          never: {},
        },
      },
    }),
    new MsgExecuteContract(worker.key.accAddress(getPrefix()), token2, {
      increase_allowance: {
        spender: pair.contract_addr,
        amount: amount2,
        expires: {
          never: {},
        },
      },
    }),

    new MsgExecuteContract(
      worker.key.accAddress(getPrefix()),
      pair.contract_addr,
      {
        provide_liquidity: {
          assets: [
            {
              info: {
                token: {
                  contract_addr: token1,
                },
              },
              amount: amount1,
            },
            {
              info: {
                token: {
                  contract_addr: token2,
                },
              },
              amount: amount2,
            },
          ],

          slippage_tolerance: "0.5",
        },
        // swap: {
        //   offer_asset: {
        //     info: {
        //       native_token: {
        //         denom: "uluna",
        //       },
        //     },
        //     amount: "50000",
        //   },
        //   max_spread: "0.5",
        // },
      },
      {
        // uluna: "50000",
      }
    ),
  ]);
  console.log(`Success! Txhash: ${txhash}`);
})();
