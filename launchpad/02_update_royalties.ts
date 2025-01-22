import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import { Chains, createLCDClient, createWallet, getInfo, getPrefix, sendTxWithConfirm } from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg, RoyaltyInfoFor_String } from "../types/launchpad/launch-nft/execute";
import { LaunchpadInfoKeys } from "./config";

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

(async function () {
  const network = argv["network"] as Chains;
  const terra = createLCDClient(network);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const address = admin.key.accAddress(getPrefix());
  const contract = getInfo("launchpad", network, LaunchpadInfoKeys.launch_nft_addr('permissionless'));


  const elements = [
    // // Nucleus Council of Scientists:
    // ["terra10zduaxfw0gv5kul3g4nax4906tq0vpgcytqjfe09qntn282k0vxsnm7g6g", "terra1f2paj7thjjp28pj47lquu6g35s07sxu04zwuzv", "0.05"],
    // // Galactic Punks:
    // ["terra16ds898j530kn4nnlc7xlj6hcxzqpcxxk4mj8gkcl3vswksu6s3zszs8kp2", "terra149h2na988cka05rwcpmnqfse64r6vspmfmkk0z", "0.05"]

    // pixeLions
    ['terra17z7fpaa8kah698xn5tarrcucvualdy4wsztkfc404g3garucpu6qmxp50g', 'terra1c690mdrwdetnr09zfk3tf9xz9jhrgd9wpjyf3tuccj74ql09eqmq6sh7en', '0.05'],

    // // Alliance DAO
    // ['terra1phr9fngjv7a8an4dhmhd0u0f98wazxfnzccqtyheq4zqrrp4fpuqw3apw9', 'terra1sffd4efk2jpdt894r04qwmtjqrrjfc52tmj6vkzjxqhd8qqu2drs3m5vzm', '0.05']

    //LA
    // ['terra1uqhj8agyeaz8fu6mdggfuwr3lp32jlrx5hqag4jxexde92rzkamq3l62zg', 'terra1rgggsspquaxjp4lmegx7a3q4l9lg44hnu7rjxa', '0.05']
  ];
  console.log(elements);

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(address, contract, <ExecuteMsg>{
        update_config: {
          royalties: elements.map(([collection, rec, fee]) => {
            return [collection, <RoyaltyInfoFor_String>{ recipient: rec, share: fee }]
          })
        },
      }),
    ]
  );
  console.log(`Txhash: ${txhash}`);
})();
