import { MsgExecuteContract } from "@terra-money/terra.js";
import yargs from "yargs/yargs";
import { createLCDClient, createWallet, sendTxWithConfirm } from "./helpers";
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
(async function () {
  const terra = createLCDClient(argv["network"]);
  const worker = await createWallet(terra, argv["key"], argv["key-dir"]);

  const pair = await worker.lcd.wasm.contractQuery<{ contract_addr: string }>(
    argv["factory-address"],
    {
      pair: {
        asset_infos: [
          {
            token: {
              contract_addr: argv["token-address"],
            },
          },
          {
            native_token: {
              denom: "uluna",
            },
          },
        ],
      },
    }
  );

  console.log("Found contract: " + JSON.stringify(pair));

  const { txhash } = await sendTxWithConfirm(worker, [
    new MsgExecuteContract(worker.key.accAddress, argv["token-address"], {
      increase_allowance: {
        spender: pair.contract_addr,
        amount: "500000000",
        expires: {
          never: {},
        },
      },
    }),

    new MsgExecuteContract(
      worker.key.accAddress,
      pair.contract_addr,
      {
        provide_liquidity: {
          assets: [
            {
              info: {
                token: {
                  contract_addr: argv["token-address"],
                },
              },
              amount: "500000000",
            },
            {
              info: {
                native_token: {
                  denom: "uluna",
                },
              },
              amount: "500000000",
            },
          ],
        },
      },
      {
        uluna: "500000000",
      }
    ),
  ]);
  console.log(`Success! Txhash: ${txhash}`);
})();
