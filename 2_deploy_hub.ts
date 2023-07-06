import { Wallet } from "@terra-money/feather.js";
import * as fs from "fs";
import * as path from "path";
import yargs from "yargs/yargs";
import {
  Chains,
  createLCDClient,
  createWallet,
  getPrefix,
  instantiateWithConfirm,
  storeCodeWithConfirm,
  waitForConfirm,
} from "./helpers";
import * as keystore from "./keystore";
import { InstantiateMsg as InstantiateCw20Msg } from "./types/cw20/hub/instantiate_msg";
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

const templates: Partial<Record<Chains, InstantiateMsg>> = {
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
  migaloo: <InstantiateMsg>{
    name: "Eris Amplified WHALE",
    symbol: "ampWHALE",
    denom: "ampWHALE",
    cw20_code_id: -1,
    decimals: -1,
    // epoch_period: Math.ceil((10 * 60) / 7),
    // unbond_period: 10 * 60,
    epoch_period: 3 * 24 * 60 * 60,
    unbond_period: 21 * 24 * 60 * 60,
    validators: [
      "migaloovaloper1xesqr8vjvy34jhu027zd70ypl0nnev5eec90ew",
      "migaloovaloper1670dvuv348eynr9lsmdrhqu3g7vpmzx94s460k",
      "migaloovaloper1rrv6nnt0susu4altt3m6ud2r85qjkc2cw6ptwz",
    ],
    protocol_fee_contract: "migaloo1z3txc4x7scxsypx9tgynyfhu48nw60a5gpmd3y",
    protocol_reward_fee: "0.05",
    owner: "",
    chain_config: {},
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
  chihuahua: <InstantiateCw20Msg>{
    name: "Eris Amplified HUAHUA",
    symbol: "ampHUAHUA",
    denom: "ampHUAHUA",
    operator: "",
    utoken: "uhuahua",
    delegation_strategy: "uniform",
    cw20_code_id: 0,
    decimals: 6,
    epoch_period: 3 * 24 * 60 * 60,
    unbond_period: 21 * 24 * 60 * 60,
    validators: [
      "chihuahuavaloper149c3xwd6al6nphyvx8gkvnd9363rnc4v3uwcfu",
      "chihuahuavaloper1vrd6h59f2e95r52t5rj4yt5mpkrxeuluud56z3",
      "chihuahuavaloper18jlk0pkpr8cnnpjtgu3dqxjvpvlnj6r4e2dtvf",
      "chihuahuavaloper1670dvuv348eynr9lsmdrhqu3g7vpmzx96h4l2d",
      "chihuahuavaloper166ks8xvs36m0ggyxwavv7rj4d9nqwthgq5g7s8",
      "chihuahuavaloper1pzqjgfd25qsyfdtmx9elrqx6zjjvnc9sj52r2y",
      "chihuahuavaloper1h6vcu4r2hx70x5f0l3du3ey2g98u9ut2tafnnv",
      "chihuahuavaloper15tnycxe9csn7mkul4vvlyxlkd9jyqlw4q80nmy",
      "chihuahuavaloper1gp957czryfgyvxwn3tfnyy2f0t9g2p4p40qac2",
    ],
    protocol_fee_contract: "chihuahua1dpaaxgw4859qhew094s87l0he8tfea3l8l3v7g",
    protocol_reward_fee: "0.05",
    owner: "",
  },
  archwaytest: <InstantiateMsg>{
    name: "Eris Amplified CONST",
    symbol: "ampCONST",
    cw20_code_id: 0,
    decimals: 18,
    epoch_period: 3 * 24 * 60 * 60,
    unbond_period: 21 * 24 * 60 * 60,
    validators: [
      "archwayvaloper122fv2m9j8ule47dczer8grmzwwzg9p4hey6v75", // kjnodes
      "archwayvaloper1wcynzzk7fj2fsgz2dmk3qr0hk0msezxs48jhcd", // pronodes
      "archwayvaloper1etx55kw7tkmnjqz0k0mups4ewxlr324tq6qfec", // node stake
      "archwayvaloper1nc0j54aj2xc8dars072rg62550h2ywgradddjs", // Kiiltech
      "archwayvaloper1dng6m8q6wel8dxd7aykhy54445exqgjfk06hp4", // Takeshi
      "archwayvaloper1q422p5m0gej7gp43385thsfpmjuwql72d7fzkk", // A41
    ],
    protocol_fee_contract: "archway1z3txc4x7scxsypx9tgynyfhu48nw60a5s7wnwa",
    protocol_reward_fee: "0.05",
    owner: "archway1dpaaxgw4859qhew094s87l0he8tfea3l3pqx4a",
  },
  archway: <InstantiateMsg>{
    name: "Eris Amplified ARCH",
    symbol: "ampARCH",
    cw20_code_id: 0,
    decimals: 18,
    epoch_period: 3 * 24 * 60 * 60,
    unbond_period: 21 * 24 * 60 * 60,
    validators: [
      "archwayvaloper1cz6unq70w0sdm2gwghv8m4uqmhwxz5x4adam88", // smart stake
      "archwayvaloper1k8wmx9texf0velkysk69wkse0gxv7ahtdayy2s", // kjnodes
      "archwayvaloper1n3fjzmr2kd9jy8rd2k9c9j30w5zrf3w4s3clvd", // Golden Ratio
      "archwayvaloper1jrgjvtv0p5yu3fulz24wfhav577p68fcxgxnw7", // Coinhall
      "archwayvaloper1jdm7fprjl8p94fygap772jpqhq4fekppc6upv4", // SCV
      "archwayvaloper1v8er9uqsx0hd6tav2pltqplu2zgj0a3reaaamt", // Cros Nest
    ],
    protocol_fee_contract: "archway1z3txc4x7scxsypx9tgynyfhu48nw60a5s7wnwa",
    protocol_reward_fee: "0.05",
    owner: "archway1dpaaxgw4859qhew094s87l0he8tfea3l3pqx4a",
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

// CHIHUAHUA
// ts-node 2_deploy_hub.ts --network chihuahua --key mainnet-chihuahua --hub-code-id 280 --token-code-id 281 --hub-binary "../contracts-cw20/artifacts/eris_staking_hub_cw20.wasm" --token-binary "../contracts-cw20/artifacts/eris_staking_token.wasm"
// chihuahua12c7cn87udfg9uktk0kdaressme7s7ae5nxg0yqsawxf3q8exsr7sq9ueyh

// ARCHWAY TEST
// ts-node 2_deploy_hub.ts --network archwaytest --key mainnet-archway --hub-binary "../contracts-terra/artifacts/eris_staking_hub.wasm" --token-binary "../contracts-terra/artifacts/eris_staking_token.wasm"
// 197, 198 (token)
// archway102t7f76edspqrpvqq7xe93uk5q7uhknqccrxa73va0knjyupd2ksexhhky

// ARCHWAY
// ts-node 2_deploy_hub.ts --network archway --key mainnet-archway --hub-code-id 37 --token-code-id 38
// hub 37 archway1yg4eq68xyll74tdrrcxkr4qpam4j9grknunmp74zzc6km988dadqy0utmj
// token 38 archway1fwurjg7ah4v7hhs6xsc3wutqpvmahrfhns285s0lt34tgfdhplxq6m8xg5
// eris_gov_voting_escrow.wasm: 39, archway16eu995d6pkhjkhs5gst4c8f7z07qpw8d6u36ejq9nmap27qxz2fqk2w9wu
// eris_gov_amp_gauges.wasm: 40 archway1225r4qnj0tz3rpm0a4ukuqwe4tdyt70ut0kg308dxcpwl2s58p0qayn6n3,
// eris_gov_prop_gauges.wasm: 41 archway1jzkz28dmgwprmx4rnz54ny5vv8xqexcazgl2xg89x2t952fryg0qfg08at

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
    msg = templates[argv["network"] as Chains];
  }
  msg["cw20_code_id"] = tokenCodeId;
  msg["owner"] = msg["owner"] || deployer.key.accAddress(getPrefix());
  msg["operator"] = msg["operator"] || deployer.key.accAddress(getPrefix());

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
