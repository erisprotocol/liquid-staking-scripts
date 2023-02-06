import { Wallet } from "@terra-money/feather.js";
import * as fs from "fs";
import * as path from "path";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  instantiateWithConfirm,
  storeCodeWithConfirm,
  waitForConfirm,
} from "./helpers";
import * as keystore from "./keystore";
import { InstantiateMsg } from "./types/hub/instantiate_msg";

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
    admin: {
      type: "string",
      demandOption: false,
    },
    msg: {
      type: "string",
      demandOption: false,
    },
    "hub-code-id": {
      type: "number",
      demandOption: false,
    },
    "token-code-id": {
      type: "number",
      demandOption: false,
    },
    "hub-binary": {
      type: "string",
      demandOption: false,
      default: "../artifacts/eris_staking_hub.wasm",
    },
    "token-binary": {
      type: "string",
      demandOption: false,
      default: "../artifacts/eris_staking_token.wasm",
    },
  })
  .parseSync();

async function uploadCode(deployer: Wallet, path: string) {
  await waitForConfirm(`Upload code ${path}?`);
  const codeId = await storeCodeWithConfirm(deployer, path);
  console.log(`Code uploaded! ID: ${codeId}`);
  return codeId;
}

const templates: Record<string, InstantiateMsg> = {
  "testnet-migaloo": <InstantiateMsg>{
    name: "Eris Amplified WHALE",
    symbol: "ampWHALE",
    cw20_code_id: 0,
    decimals: 6,
    // epoch_period: Math.ceil((10 * 60) / 7),
    // unbond_period: 10 * 60,
    epoch_period: 3 * 24 * 60 * 60,
    unbond_period: 21 * 24 * 60 * 60,
    validators: [
      "migaloovaloper1rqvctgdpafvc0k9fx4ng8ckt94x723zmp3g0jv",
      "migaloovaloper1820a86x8e70ecsw486uvh5af6zqk3tq037pqcr",
      "migaloovaloper18ulrp6juyj0tt0zmkrxn3ex4mkd3kkg6uk7nfx",
    ],
    protocol_fee_contract: "migaloo1z3txc4x7scxsypx9tgynyfhu48nw60a5gpmd3y",
    protocol_reward_fee: "0.05",
    owner: "",
  },
  testnet: <InstantiateMsg>{
    name: "Eris Amplified LUNA",
    symbol: "ampLUNA",
    cw20_code_id: 0,
    decimals: 6,
    epoch_period: Math.ceil((10 * 60) / 7),
    unbond_period: 10 * 60,
    validators: [
      "terravaloper1cevf3xwxm8zjhj7yrnjc0qy6y6ng98lxgxp79x",
      "terravaloper1uxx32m0u5svtvrujnpcs6pxuv7yvn4pjhl0fux",
    ],
    protocol_fee_contract: "terra1pm8wqcrvk2qysf30u4e5mwprjfj9hj87dph3ne",
    protocol_reward_fee: "0.05",
    owner: "",
  },
  mainnet: <InstantiateMsg>{
    name: "Test Migration",
    symbol: "test",
    cw20_code_id: 0,
    decimals: 6,
    epoch_period: 3 * 24 * 60 * 60,
    unbond_period: 21 * 24 * 60 * 60,
    validators: [
      "terravaloper15lsftv92eyssjwkh2393s0nhjc07kryqen2fqf",
      "terravaloper17kh8ngu3s74epwympaxrp4ukahm5rvtf5zc8ma",
      "terravaloper1ge3vqn6cjkk2xkfwpg5ussjwxvahs2f6at87yp",
      "terravaloper1u53qwdgafryksqnzq3k7e5eyph7jlh8kgc3va4",
      "terravaloper188e99yz54744uhr8xjfxmmplhnuw75xea55zfp",
      "terravaloper199fjq4rnfvz24cktl8cervx8h8e90rukmgdv5x",
      "terravaloper13fkxypqa0e3lvzu2fay7mslc2xsghv26a3a7jl",
      // "",
      // "",
      // "",
    ],
    protocol_fee_contract: "terra1rgggsspquaxjp4lmegx7a3q4l9lg44hnu7rjxa",
    protocol_reward_fee: "0.05",
    owner: "",
  },
  classic: <InstantiateMsg>{
    name: "Eris Amplified LUNC",
    symbol: "ampLUNC",
    cw20_code_id: 0,
    decimals: 6,
    epoch_period: 3 * 24 * 60 * 60,
    unbond_period: 21 * 24 * 60 * 60,
    validators: [
      "terravaloper1e6w5qgzs5rzrz8ark25lagm2ga2h9n2tvgzpsl",
      "terravaloper1alpf6snw2d76kkwjv3dp4l7pcl6cn9uyt0tcj9",
      "terravaloper12g4nkvsjjnl0t7fvq3hdcw7y8dc9fq69nyeu9q",
      "terravaloper19hflr9ay8usqxsxm4zzrsxfy3xz7hp6kv4ydnd",
      "terravaloper1fjuvyccn8hfmn5r7wc2t3kwqy09zzp6tyjcf50",
      "terravaloper1we68q2zel6ajpxuzw5aqhh07zlxxywrkx7jcfz",
      "terravaloper12r8929na0amxfj406zw7vk8jmd03fmzcj9r2gg",
      "terravaloper13slfa8cc7zvmjt4wkap2lwmlkp4h3azwltlj6s",
      "terravaloper1k5hw6rl060zpnnjhgnvky9cs8evrts2g2l28tt",
      "terravaloper1krj7amhhagjnyg2tkkuh6l0550y733jnjnnlzy",
    ],
    protocol_fee_contract: "terra1rgggsspquaxjp4lmegx7a3q4l9lg44hnu7rjxa",
    protocol_reward_fee: "0.05",
    owner: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
  },
  "classic-testnet": <InstantiateMsg>{
    name: "Eris Amplified TEST",
    symbol: "ampTEST",
    cw20_code_id: 0,
    decimals: 6,
    epoch_period: 3 * 24 * 60 * 60,
    unbond_period: 21 * 24 * 60 * 60,
    validators: [
      "terravaloper1e6w5qgzs5rzrz8ark25lagm2ga2h9n2tvgzpsl",
      "terravaloper1alpf6snw2d76kkwjv3dp4l7pcl6cn9uyt0tcj9",
      "terravaloper12g4nkvsjjnl0t7fvq3hdcw7y8dc9fq69nyeu9q",
      "terravaloper19hflr9ay8usqxsxm4zzrsxfy3xz7hp6kv4ydnd",
      "terravaloper1fjuvyccn8hfmn5r7wc2t3kwqy09zzp6tyjcf50",
      "terravaloper1we68q2zel6ajpxuzw5aqhh07zlxxywrkx7jcfz",
      "terravaloper12r8929na0amxfj406zw7vk8jmd03fmzcj9r2gg",
      "terravaloper13slfa8cc7zvmjt4wkap2lwmlkp4h3azwltlj6s",
      "terravaloper1k5hw6rl060zpnnjhgnvky9cs8evrts2g2l28tt",
      "terravaloper1krj7amhhagjnyg2tkkuh6l0550y733jnjnnlzy",
    ],
    protocol_fee_contract: "terra1rgggsspquaxjp4lmegx7a3q4l9lg44hnu7rjxa",
    protocol_reward_fee: "0.05",
    owner: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
  },
  juno: <InstantiateMsg>{
    name: "Eris Amplified JUNO",
    symbol: "ampJUNO",
    cw20_code_id: 0,
    decimals: 6,
    epoch_period: 4 * 24 * 60 * 60,
    unbond_period: 28 * 24 * 60 * 60,
    validators: [
      "junovaloper17n3w6v5q3n0tws4xv8upd9ul4qqes0nlg7q0xd", // Imperator
      "junovaloper1083svrca4t350mphfv9x45wq9asrs60cpqzg0y", // Notional
      "junovaloper1gp957czryfgyvxwn3tfnyy2f0t9g2p4pvzc6k3", // Polkachu
      "junovaloper1ncu32g0lzhk0epzdar7smd3qv9da2n8w8mwn4k", // CryptoCrew
      "junovaloper13qjgwewgrwu979wn8xxrh274rjtwk4m5gqkehp", // Danku
      "junovaloper1y3u3ht35yn82j72sejtf85dkvqwlt302x47lk9", // Coinhall
    ],
    protocol_fee_contract: "juno1z3txc4x7scxsypx9tgynyfhu48nw60a5n83vrk",
    protocol_reward_fee: "0.05",
    owner: "juno1dpaaxgw4859qhew094s87l0he8tfea3ljcleck",
  },
};

// TESTNET
// ts-node 2_deploy_hub.ts --network testnet --key testnet --hub-code-id 169 --token-code-id 125

// TESTMIGRATION: terra1ckthjpaw9w74s409hsr2peracq8akx6e86lxyd0j28e0hw4dd6tqn938pa
// ts-node 2_deploy_hub.ts --network mainnet --key invest --hub-code-id 167 --token-code-id 12

// ts-node 2_deploy_hub.ts --network classic --key ledger --hub-code-id 6009 --token-code-id 6010 --hub-binary "../contracts-terra-classic/artifacts/eris_staking_hub_classic.wasm" --token-binary "../contracts-terra-classic/artifacts/eris_stake_token_classic.wasm"
// ts-node 2_deploy_hub.ts --network classic-testnet --key invest --hub-code-id 6009 --token-code-id 6010 --hub-binary "../contracts-terra-classic/artifacts/eris_staking_hub_classic.wasm" --token-binary "../contracts-terra-classic/artifacts/eris_stake_token_classic.wasm"

// ts-node 2_deploy_hub.ts --network juno --key mainnet-juno --hub-code-id 1016 --token-code-id 1017 --hub-binary "../contracts-juno/artifacts/eris_staking_hub.wasm" --token-binary "../contracts-juno/artifacts/eris_staking_token.wasm"
// Hub-Code 1016 , you need to edit bech32 and pubkey of terrajs node_modules

// MIGALOO TESTNET
// ts-node 2_deploy_hub.ts --network testnet-migaloo --key testnet-migaloo --hub-binary "../contracts-whitewhale/artifacts/eris_staking_hub.wasm" --token-binary "../contracts-whitewhale/artifacts/eris_staking_token.wasm"

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const hubCodeId =
    argv["hub-code-id"] ??
    (await uploadCode(deployer, path.resolve(argv["hub-binary"])));
  const tokenCodeId =
    argv["token-code-id"] ??
    (await uploadCode(deployer, path.resolve(argv["token-binary"])));

  let msg: any;
  if (argv["msg"]) {
    msg = JSON.parse(fs.readFileSync(path.resolve(argv["msg"]), "utf8"));
  } else {
    msg = templates[argv["network"]];
  }
  msg["cw20_code_id"] = tokenCodeId;
  msg["owner"] = msg["owner"] || deployer.key.accAddress(getPrefix());

  console.log("\n" + JSON.stringify(msg).replace(/\\/g, "") + "\n");

  await waitForConfirm("Proceed to deploy contracts?");
  const result = await instantiateWithConfirm(
    deployer,
    argv["admin"] ? argv["admin"] : deployer.key.accAddress(getPrefix()),
    hubCodeId,
    msg
  );
  const address =
    result.logs[0].eventsByType["instantiate"]["_contract_address"][0];
  console.log(`Contract instantiated! Address: ${address}`);
})();
