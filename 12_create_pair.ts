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

// ts-node 12_create_pair.ts --network testnet --key testnet --factory-address terra1jha5avc92uerwp9qzx3flvwnyxs3zax2rrm6jkcedy2qvzwd2k7qk7yxcl --token-address terra1xgvp6p0qml53reqdyxgcl8ttl0pkh0n2mtx2n7tzfahn6e0vca7s0g7sg6
// ts-node 12_create_pair.ts --network mainnet --key mainnet --factory-address terra1466nf3zuxpya8q9emxukd7vftaf6h4psr0a07srl5zw74zh84yjqxl5qul --token-address terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct

// testnet
//ts-node 12_create_pair.ts --network testnet --key testnet --factory-address terra1jha5avc92uerwp9qzx3flvwnyxs3zax2rrm6jkcedy2qvzwd2k7qk7yxcl --token-address terra1xgvp6p0qml53reqdyxgcl8ttl0pkh0n2mtx2n7tzfahn6e0vca7s0g7sg6

// phoenix
// ts-node 12_create_pair.ts --network mainnet --key mainnet --factory-address terra1pewdsxywmwurekjwrgvjvxvv0dv2pf8xtdl9ykfce2z0q3gf0k3qr8nezy --token-address terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct

// mainnet: https://finder.terra.money/mainnet/tx/0D5F52EA014C8B36E0ADF86CB7AC9CF30EE1C7B55A4CE4ACA5D95346A3B834B7
// pair contract: terra1ccxwgew8aup6fysd7eafjzjz6hw89n40h273sgu3pl4lxrajnk5st2hvfh
// lp: terra1eh2aulwsyc9m45ggeznav402xcck4ll0yn0xgtlxyf4zkwch7juqsxvfzr

// classic:
// ts-node 12_create_pair.ts --network classic --key invest --factory-address terra1ulgw0td86nvs4wtpsc80thv6xelk76ut7a7apj --token-address terra1wvk6r3pmj0835udwns4r5e0twsclvcyuq9ucgm
// pair luna terra1r8k9pea8wmt93l703azhs82kpjva0cpq8tq5at
// lp luna terra1c64zl49ukr62zdzdggn36luym9edyys63xkywn
// pair ust	terra1305xtjl5qtlpdlp8gg0k8u4yl05hj7qvyffvd4
// lp ust terra14nhfccre389ypnmfr5s462gyhe05naqzwumss0

(async function () {
  const terra = createLCDClient(argv["network"]);
  const worker = await createWallet(terra, argv["key"], argv["key-dir"]);

  const { txhash } = await sendTxWithConfirm(worker, [
    new MsgExecuteContract(
      worker.key.accAddress(getPrefix()),
      argv["factory-address"],
      {
        create_pair: {
          asset_infos: [
            {
              token: {
                contract_addr: argv["token-address"],
              },
            },
            {
              native_token: {
                denom: "uusd",
              },
            },
          ],
        },
      },
      {}
    ),
  ]);
  console.log(`Success! Txhash: ${txhash}`);
})();
