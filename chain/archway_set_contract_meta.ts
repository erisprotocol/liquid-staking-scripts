import { RewardsMsgEncoder, SigningArchwayClient } from "@archwayhq/arch3.js";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import yargs from "yargs/yargs";
import { getMnemonic, waitForConfirm } from "../helpers";
import * as keystore from "../keystore";

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
  })
  .parseSync();

// ts-node chain/archway_set_contract_meta.ts --key key-mainnet --network archway
(async function () {
  const mnemonic = await getMnemonic(argv["key"], argv["key-dir"]);

  const endpoint = "https://rpc.mainnet.archway.io";
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: "archway",
  });
  const client = await SigningArchwayClient.connectWithSigner(endpoint, wallet);

  const contracts = [
    "archway1fwurjg7ah4v7hhs6xsc3wutqpvmahrfhns285s0lt34tgfdhplxq6m8xg5",
    "archway1yg4eq68xyll74tdrrcxkr4qpam4j9grknunmp74zzc6km988dadqy0utmj",
    "archway1225r4qnj0tz3rpm0a4ukuqwe4tdyt70ut0kg308dxcpwl2s58p0qayn6n3",
    "archway1jzkz28dmgwprmx4rnz54ny5vv8xqexcazgl2xg89x2t952fryg0qfg08at",
    "archway16eu995d6pkhjkhs5gst4c8f7z07qpw8d6u36ejq9nmap27qxz2fqk2w9wu",
  ];

  const owner = "archway1dpaaxgw4859qhew094s87l0he8tfea3l3pqx4a";

  const msgs = contracts.map((contract) => {
    return RewardsMsgEncoder.setContractMetadata({
      senderAddress: owner,
      metadata: {
        ownerAddress: owner,
        contractAddress: contract,
        rewardsAddress: "archway1z3txc4x7scxsypx9tgynyfhu48nw60a5s7wnwa",
      },
    });
  });

  await waitForConfirm(JSON.stringify(msgs));

  const { transactionHash } = await client.signAndBroadcast(
    owner,
    msgs,
    "auto"
  );

  console.log(`Success! Txhash: ${transactionHash}`);
})();
