import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import { tokens } from "../amp-compounder/tokens";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/arb/arb_execute";

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

// ts-node arb/2_swap.ts --network mainnet --key mainnet --contract terra15tjchjcvu672jx7grfcunev3feyvp9w6lwdrkkg9whrzavz54dqsjzars2
// ts-node arb/2_swap.ts --network mainnet-lowfee --key mainnet --contract terra15tjchjcvu672jx7grfcunev3feyvp9w6lwdrkkg9whrzavz54dqsjzars2
(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const account = admin.key.accAddress(getPrefix());
  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(account, argv.contract, <ExecuteMsg>{
        do: {
          actions: [
            {
              more: {
                asset: tokens.roar,
              },
            },
            {
              bond: {
                // amount: '500'
                asset: tokens.roar,
                contract:
                  "terra1vklefn7n6cchn0u962w3gaszr4vf52wjvd4y95t2sydwpmpdtszsqvk9wy",
              },
            },
            {
              bond: {
                asset: tokens.amproar,
                contract:
                  "terra1dndhtdr2v7ca8rrn67chlqw3cl3xhm3m2uxls62vghcg3fsh5tpss5xmcu",
              },
            },
            {
              swap: {
                asset: tokens.moar,
                contract:
                  "terra1j0ackj0wru4ndj74e3mhhq6rffe63y8xd0e56spqcjygv2r0cfsqxr36k6",
              },
            },
          ],
        },
      }),
    ]
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
