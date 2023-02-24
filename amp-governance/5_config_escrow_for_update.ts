import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/voting_escrow/eris_gov_voting_escrow_execute";

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

// Testnet
// ampLP
// ts-node amp-governance/5_config_escrow_for_update.ts --network testnet --key testnet --contract terra15h6tu0qxx542rs0njefujw5mjag3gfc0d3seruydhvs6z07ftz6s6uuwdp
// ampLUNA
// ts-node amp-governance/5_config_escrow_for_update.ts --network testnet --key testnet --contract terra185fzsf0e247dsa9npuc0kdn8ef3ht2q5rwedle43h3q5ymjmvs2qkvdp3f

// Mainnet
// ts-node amp-governance/5_config_escrow_for_update.ts --network mainnet --key mainnet --contract terra1ep7exp42jjtwgjly36y4vgylz82fplnjwpkz95wljzwfald8zwwqggsdzz

const templates: Record<string, ExecuteMsg> = {
  // testnet: <ExecuteMsg>{
  //   update_config: {
  //     push_update_contracts: [
  //       "terra1a507lxc7sztyfu8az5np54t6w86nhv2a0n2q5y858jf9ms5t5rsqh648jt", // amp gauge
  //       "terra1xvef2n7kky4ffzg6yl0rrej9j9d6prdgn79na7yxzcy006znkqwsrztmg5", // prop gauge
  //     ],
  //   },
  // },
  testnet: <ExecuteMsg>{
    update_config: {
      push_update_contracts: [
        "terra1rpa66hlslyy9jl6hxkufv83eyje2lx6022569k497ytjf7nvm7hqu3wndk", // amp gauge
        "terra1ut233rtsdjkdf775xq866tdvjkuazmgsyrh5n9l8ac9qpuj6sd3sr8a0q7", // prop gauge
      ],
    },
  },
  mainnet: <ExecuteMsg>{
    update_config: {
      push_update_contracts: [
        "terra1aumv9uyv2ltf8upsf88338ctf922q439a0v2tpss5s2j9g0j8zzsrtq9t2", // amp gauge
        "terra1z0cxlq62a9dsjhz7g7hhgpuplcl32c0qeckhm9jyggln0rxq6z8syesq8j", // prop gauge
      ],
    },
  },
};

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const msg = templates[argv["network"]];
  console.log("msg", msg);

  const { txhash } = await sendTxWithConfirm(deployer, [
    new MsgExecuteContract(
      deployer.key.accAddress(getPrefix()),
      argv.contract,
      msg
    ),
  ]);
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
