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
};

// MIGALOO
// ts-node 2_deploy_hub_tokenfactory.ts --network migaloo --key mainnet-migaloo --hub-code-id 5 --hub-binary "../contracts-tokenfactory/artifacts/eris_staking_hub_tokenfactory.wasm"

// OSMOSIS
// ts-node 2_deploy_hub_tokenfactory.ts --network testnet-osmosis --key testnet-osmosis --hub-code-id 684 --hub-binary "../contracts-tokenfactory/artifacts/eris_staking_hub_tokenfactory_osmosis.wasm"
// ts-node 3_migrate.ts --network testnet-osmosis --key testnet-osmosis --key-migrate testnet-osmosis --contract-address osmo1e6rfztv9q3w6534ux34gzxp3ljhcsugvf9p5r4pfdatr23hzzxus7ktvh8  --binary "../contracts-tokenfactory/artifacts/eris_staking_hub_tokenfactory_osmosis.wasm"

// 683
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
      uosmo: "10000000",
    }
  );
  const address =
    result.logs[0].eventsByType["instantiate"]["_contract_address"][0] ??
    result.logs[0].eventsByType["instantiate"]["contract_address"][0];
  console.log(`Contract instantiated! Address: ${address}`);
})();
