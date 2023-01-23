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

// ts-node 12_create_pair.ts --network testnet --key testnet --factory-address terra1jha5avc92uerwp9qzx3flvwnyxs3zax2rrm6jkcedy2qvzwd2k7qk7yxcl --token-address terra1xgvp6p0qml53reqdyxgcl8ttl0pkh0n2mtx2n7tzfahn6e0vca7s0g7sg6
// ts-node 12_create_pair.ts --network mainnet --key mainnet --factory-address terra1466nf3zuxpya8q9emxukd7vftaf6h4psr0a07srl5zw74zh84yjqxl5qul --token-address terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct

// testnet astroport
// ts-node 12_create_pair_phoenix.ts --network testnet --key testnet --factory-address terra1z3y69xas85r7egusa0c7m5sam0yk97gsztqmh8f2cc6rr4s4anysudp7k0 --token-address terra1xgvp6p0qml53reqdyxgcl8ttl0pkh0n2mtx2n7tzfahn6e0vca7s0g7sg6
// lp: terra1n7pgzxhunusffja0mfqls7tntj604s2ywvu2ufuxxqk2spzmttwqc45qh0
// pair: terra1kh5lcndrpgsuclulatmadyl35xl9te3evaant2n4f95we5jext0qxah7j7

// phoenix
// ts-node 12_create_pair_phoenix.ts --network mainnet --key mainnet --factory-address terra1pewdsxywmwurekjwrgvjvxvv0dv2pf8xtdl9ykfce2z0q3gf0k3qr8nezy --token-address terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct

// mainnet: https://finder.terra.money/mainnet/tx/0D5F52EA014C8B36E0ADF86CB7AC9CF30EE1C7B55A4CE4ACA5D95346A3B834B7
// pair contract: terra1ccxwgew8aup6fysd7eafjzjz6hw89n40h273sgu3pl4lxrajnk5st2hvfh
// lp: terra1eh2aulwsyc9m45ggeznav402xcck4ll0yn0xgtlxyf4zkwch7juqsxvfzr

// mainnet astro
// factory: terra14x9fr055x5hvr48hzy2t4q7kvjvfttsvxusa4xsdcy702mnzsvuqprer8r
// ts-node 12_create_pair_phoenix.ts --network mainnet --key mainnet --factory-address terra14x9fr055x5hvr48hzy2t4q7kvjvfttsvxusa4xsdcy702mnzsvuqprer8r --token-address terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct

// classic astroport
// ts-node 12_create_pair_phoenix.ts --network classic --key invest --factory-address terra1fnywlw4edny3vw44x04xd67uzkdqluymgreu7g --token-address terra1wvk6r3pmj0835udwns4r5e0twsclvcyuq9ucgm
// https://finder.terra.money/classic/tx/31007f756f300a65898750a589422bf7dd7779e85705b1fcc62f832245e88836
// pair terra132qwlqxffksjfg6ntzp4m5786lrlmgrufzx5c6
// lp terra1x869hqq8483tc3qc6pdhnmcqnfkccftvwqvp8d

(async function () {
  const terra = createLCDClient(argv["network"]);
  const worker = await createWallet(terra, argv["key"], argv["key-dir"]);

  const { txhash } = await sendTxWithConfirm(worker, [
    new MsgExecuteContract(
      worker.key.accAddress,
      argv["factory-address"],
      {
        create_pair: {
          pair_type: { stableswap: {} },
          asset_infos: [
            {
              token: {
                contract_addr: argv["token-address"],
              },
            },
            { native_token: { denom: "uluna" } },
          ],
          init_params: "",
        },
      },
      {}
    ),
  ]);
  console.log(`Success! Txhash: ${txhash}`);
})();
