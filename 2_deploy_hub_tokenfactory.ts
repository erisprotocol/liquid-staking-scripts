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
};

// MIGALOO
// ts-node 2_deploy_hub_tokenfactory.ts --network migaloo --key mainnet-migaloo --hub-code-id 5 --hub-binary "../contracts-tokenfactory/artifacts/eris_staking_hub_tokenfactory.wasm"

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
    undefined,
    {
      uwhale: "50000000",
    }
  );
  const address =
    result.logs[0].eventsByType["instantiate"]["_contract_address"][0] ??
    result.logs[0].eventsByType["instantiate"]["contract_address"][0];
  console.log(`Contract instantiated! Address: ${address}`);
})();