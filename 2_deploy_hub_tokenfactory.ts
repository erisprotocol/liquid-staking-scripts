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
import { InstantiateMsg } from "./types/kujira/hub/eris_staking_hub_tokenfactory_instantiate";

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
    "hub-binary": {
      type: "string",
      demandOption: false,
      default: "../artifacts/eris_staking_hub_tokenfactory.wasm",
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
  migaloo: <InstantiateMsg>{
    denom: "ampWHALE",
    epoch_period: 3 * 24 * 60 * 60,
    unbond_period: 21 * 24 * 60 * 60,
    validators: [
      "migaloovaloper1xesqr8vjvy34jhu027zd70ypl0nnev5eec90ew",
      "migaloovaloper1670dvuv348eynr9lsmdrhqu3g7vpmzx94s460k",
      "migaloovaloper1rrv6nnt0susu4altt3m6ud2r85qjkc2cw6ptwz",
    ],
    protocol_fee_contract: "migaloo1z3txc4x7scxsypx9tgynyfhu48nw60a5gpmd3y",
    protocol_reward_fee: "0.05",
    owner: "migaloo1dpaaxgw4859qhew094s87l0he8tfea3lf74c2y",
    chain_config: {},
    operator: "migaloo1c023jxq099et7a44ledfwuu3sdkfq8caya90nk",
    utoken: "uwhale",
    delegation_strategy: "uniform",
  },
  injective: <InstantiateMsg>{
    chain_config: {},
    denom: "ampINJ",
    owner: "inj1rnh5c7emgt2g9s2ezg6km7lylyxyddq5jjnjav",
    operator: "inj1hpay25j5c8ufgdxcyfpfkfghp6j80pzmcnjgvf",
    protocol_reward_fee: "0.05",
    protocol_fee_contract: "inj1gna5fqgt0qqzpekw6c2cdwaxd3hd0xe6emah82",
    utoken: "inj",
    delegation_strategy: "uniform",
    epoch_period: 3 * 24 * 60 * 60,
    unbond_period: 21 * 24 * 60 * 60,
    validators: [
      "injvaloper19a77dzm2lrxt2gehqca3nyzq077kq7qsgvmrp4",
      "injvaloper1r3lgsyq49zvl36cnevjx3q6u2ep897rws9hauk",
      "injvaloper1agu7gu9ay39jkaccsfnt0ykjce6daycjuzyg2a",
      "injvaloper1ltu4jgw850x7kg9kl7g8hjtuzatvzfpy0svplt",
      "injvaloper1esud09zs5754g5nlkmrgxsfdj276xm64cgmd3w",
      "injvaloper16gdnrnl224ylje5z9vd0vn0msym7p58f00qauj",
    ],
  },
  ["testnet-osmosis"]: <InstantiateMsg>{
    denom: "ampOSMO",
    epoch_period: 3 * 24 * 60 * 60,
    unbond_period: 21 * 24 * 60 * 60,
    validators: [
      "osmovaloper1hh0g5xf23e5zekg45cmerc97hs4n2004dy2t26",
      "osmovaloper1vaq0tneq0vmnkk48jxrqlaaefdx8kl2tx06eg9",
    ],
    protocol_fee_contract: "osmo1ugmmclpunq08v4uwj2q2knr9e3uveakwxfx9pq",
    protocol_reward_fee: "0.05",
    owner: "osmo1dpaaxgw4859qhew094s87l0he8tfea3lv30jfc",
    chain_config: {},
    operator: "osmo1ugmmclpunq08v4uwj2q2knr9e3uveakwxfx9pq",
    utoken: "uosmo",
    delegation_strategy: "uniform",
  },
  ["osmosis"]: <InstantiateMsg>{
    denom: "ampOSMO",
    epoch_period: 3 * 24 * 60 * 60,
    unbond_period: 21 * 24 * 60 * 60,
    validators: [
      "osmovaloper1pxphtfhqnx9ny27d53z4052e3r76e7qq495ehm",
      "osmovaloper1s29zkm444lr8u4jjfkrycl9wh8gttwfze230hj",
      "osmovaloper16n0t7lmy4wnhjytzkncjdkxrsu9yfjm3ex7hxr",
      "osmovaloper16q8xd335y38xk2ul67mjg27vdnrcnklt4wx6kt",
      "osmovaloper1t48236ajss9wswamwll4nj7up2gqdns52gvyaa",
      "osmovaloper1u5v0m74mql5nzfx2yh43s2tke4mvzghr6m2n5t",
    ],
    protocol_fee_contract: "osmo1ugmmclpunq08v4uwj2q2knr9e3uveakwxfx9pq",
    protocol_reward_fee: "0.05",
    owner: "osmo1dpaaxgw4859qhew094s87l0he8tfea3lv30jfc",
    chain_config: {},
    operator: "osmo1ugmmclpunq08v4uwj2q2knr9e3uveakwxfx9pq",
    utoken: "uosmo",
    delegation_strategy: "uniform",
  },
  ["sei"]: <InstantiateMsg>{
    denom: "ampSEI",
    epoch_period: 3 * 24 * 60 * 60,
    unbond_period: 21 * 24 * 60 * 60,
    validators: [
      "seivaloper1d4lyuujr4urd7fkdlytccrd0cljqycycjp9xz8", // notional
      "seivaloper1mm5p6ak2w94cwry0n42px3ssajgytxnwfvd4w8", // cros
      "seivaloper1ykls6dhh2mjqk9x0d3ee29873stf7wwvedcjmh", // danku
      "seivaloper1t9fq3qfm7ngau5gr8qgf5dpfzjqg79kf65cu04", // imperator
      "seivaloper1qe8uuf5x69c526h4nzxwv4ltftr73v7qnkypla", // stakecito
      "seivaloper140l6y2gp3gxvay6qtn70re7z2s0gn57zl6nups", // lavender
    ],
    protocol_fee_contract: "sei1z3txc4x7scxsypx9tgynyfhu48nw60a5gerpzt",
    protocol_reward_fee: "0.05",
    owner: "sei1dpaaxgw4859qhew094s87l0he8tfea3lfxd5et",
    chain_config: {},
    operator: "sei1c023jxq099et7a44ledfwuu3sdkfq8cay9arqe",
    utoken: "usei",
    delegation_strategy: "uniform",
  },
};

// MIGALOO
// ts-node 2_deploy_hub_tokenfactory.ts --network migaloo --key mainnet-migaloo --hub-code-id 5 --hub-binary "../contracts-tokenfactory/artifacts/eris_staking_hub_tokenfactory.wasm"

// OSMOSIS
// ts-node 2_deploy_hub_tokenfactory.ts --network testnet-osmosis --key testnet-osmosis --hub-code-id 684 --hub-binary "../contracts-tokenfactory/artifacts/eris_staking_hub_tokenfactory_osmosis.wasm"
// ts-node 3_migrate.ts --network testnet-osmosis --key testnet-osmosis --key-migrate testnet-osmosis --contract-address osmo1e6rfztv9q3w6534ux34gzxp3ljhcsugvf9p5r4pfdatr23hzzxus7ktvh8  --binary "../contracts-tokenfactory/artifacts/eris_staking_hub_tokenfactory_osmosis.wasm"

// 683

// ts-node 2_deploy_hub_tokenfactory.ts --network osmosis --key mainnet-osmosis --hub-code-id 105
// eris_staking_hub_tokenfactory_osmosis.wasm: 105 -> osmo1dv8wz09tckslr2wy5z86r46dxvegylhpt97r9yd6qc3kyc6tv42qa89dr9
// factory/osmo1dv8wz09tckslr2wy5z86r46dxvegylhpt97r9yd6qc3kyc6tv42qa89dr9/ampOSMO
// eris_gov_voting_escrow.wasm: 108 osmo1vcg9a7zwfeuqwtkya5l34tdgzxnafdzpe22ahphd02uwed43wnfs3wtf8a
// eris_gov_amp_gauges.wasm: 106, osmo1sx8wrjfh5dvv4s9njhcrau2c6x80t85wnlhh0lm24uu3ppgpunqs74cqk6
// eris_gov_prop_gauges.wasm: 107, osmo1mr8dr22sc0r3yxu6rhu9kc8nq7096kw3rlh5kzc7eggk32lyc8hqdwatz3

// SEI
// owner sei1dpaaxgw4859qhew094s87l0he8tfea3lfxd5et
// operator sei1c023jxq099et7a44ledfwuu3sdkfq8cay9arqe
// factory/sei1x2fgaaqecvk8kwuqkjqcj27clw5p5g99uawdzy9sc4rku8avumcq3cky4k/ampSEI
// ts-node 2_deploy_hub_tokenfactory.ts --network sei --key key-mainnet --hub-code-id 206 --hub-binary "../contracts-tokenfactory/artifacts/eris_staking_hub_tokenfactory_sei.wasm"
// eris_staking_hub_tokenfactory_sei.wasm: 206 -> sei1x2fgaaqecvk8kwuqkjqcj27clw5p5g99uawdzy9sc4rku8avumcq3cky4k
// ts-node amp-compounder/1_upload_contracts.ts --network sei --key key-mainnet --contracts eris_gov_voting_escrow eris_gov_amp_gauges eris_gov_prop_gauges eris_astroport_farm eris_compound_proxy eris_generator_proxy eris_fees_collector --folder contracts-tokenfactory
// ts-node amp-governance/2_instantiate_escrow.ts --network sei --key key-mainnet --contract-code-id 234 --label "Vote-escrow ampSEI"
// ts-node amp-governance/4_instantiate_ampgauges.ts --network sei --key key-mainnet --contract-code-id 235  --label "vAMP Gauge"
// ts-node amp-governance/4_instantiate_propgauges.ts --network sei --key key-mainnet --contract-code-id 236 --label "Prop Gauge"
// ts-node amp-governance/5_config_escrow_for_update.ts --network sei --key key-mainnet --contract sei1jkntjf038jtwzs7zefuyt35v6esv2ht986p4m8rrcfm9xtafphqq8gtw8w
// TODO ts-node amp-governance/6_config_hub.ts --network sei --key key-mainnet --contract sei1x2fgaaqecvk8kwuqkjqcj27clw5p5g99uawdzy9sc4rku8avumcq3cky4k
// eris_gov_voting_escrow: 234 sei1jkntjf038jtwzs7zefuyt35v6esv2ht986p4m8rrcfm9xtafphqq8gtw8w
// eris_gov_amp_gauges: 235 sei1fg7f9p2jcjm339yx49evpnylpxlc2g0ahym6az3kmyqx3yg3tjwsd3wq35
// eris_gov_prop_gauges: 236 sei1qwzdnwzdka4yc5z2v5rlathef44flmvh66uahsmraatcyvfyxc6sze0ec8
// eris_astroport_farm: 237
// eris_compound_proxy: 238
// eris_generator_proxy: 239
// eris_fees_collector: 240

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const hubCodeId =
    argv["hub-code-id"] ??
    (await uploadCode(deployer, path.resolve(argv["hub-binary"])));

  let msg: any;
  if (argv["msg"]) {
    msg = JSON.parse(fs.readFileSync(path.resolve(argv["msg"]), "utf8"));
  } else {
    msg = templates[argv["network"]];
  }

  msg["owner"] = msg["owner"] || deployer.key.accAddress(getPrefix());
  msg["operator"] = msg["operator"] || deployer.key.accAddress(getPrefix());

  console.log("\n" + JSON.stringify(msg).replace(/\\/g, "") + "\n");

  await waitForConfirm("Proceed to deploy contracts?");
  const result = await instantiateWithConfirm(
    deployer,
    argv["admin"] ? argv["admin"] : deployer.key.accAddress(getPrefix()),
    hubCodeId,
    msg,
    undefined
    // {
    //   uosmo: "10000000",
    // }
  );
  const address =
    result.logs[0].eventsByType["instantiate"]["_contract_address"][0] ??
    result.logs[0].eventsByType["instantiate"]["contract_address"][0];
  console.log(`Contract instantiated! Address: ${address}`);
})();
