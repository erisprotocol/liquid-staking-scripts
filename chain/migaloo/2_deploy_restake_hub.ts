import * as fs from "fs";
import * as path from "path";
import yargs from "yargs/yargs";
import {
  Chains,
  createLCDClient,
  createWallet,
  getPrefix,
  instantiateWithConfirm,
  waitForConfirm,
} from "../../helpers";
import * as keystore from "../../keystore";

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
    "code-id": {
      type: "number",
      demandOption: true,
    },
    label: {
      type: "string",
      demandOption: true,
    },
  })
  .parseSync();

const templates: Partial<Record<Chains, any>> = {
  migaloo: <any>{
    governance:
      "migaloo1v42evfet0dplrl6x7cxpew05j2x4322dg9ezmuy0kz0e7t4uzycsla8tr0", // set_asset_reward_distribution
    controller: "migaloo1dpaaxgw4859qhew094s87l0he8tfea3lf74c2y", // alliance_delegate
    alliance_token_denom: "testvt",
    oracle: "migaloo1dpaaxgw4859qhew094s87l0he8tfea3lf74c2y",
    reward_denom: "uwhale",
  },
};

// MIGALOO (RESTAKE HUB)
// eris_restake_gauges: 152
// ts-node chain/migaloo/deploy_restake_hub.ts --network migaloo --key mainnet-migaloo --code-id 152 --label "Eris Test Restake Hub"
// ts-node chain/migaloo/2_update_restake_hub.ts --network migaloo --key mainnet-migaloo --contract migaloo1v42evfet0dplrl6x7cxpew05j2x4322dg9ezmuy0kz0e7t4uzycsla8tr0
// migaloo1fl005yh4ztvfv4qgr4vc96uz5h658ztgu0n5gu5lpma96g8ya32s6sus5v

// DAO Membership: migaloo162t0dawj98ruwxlmscga432lylgj58xsjkgjqphlw5f5j70hamjq4hye97

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const hubCodeId = argv["code-id"];

  let msg: any;
  if (argv["msg"]) {
    msg = JSON.parse(fs.readFileSync(path.resolve(argv["msg"]), "utf8"));
  } else {
    msg = templates[argv["network"] as Chains];
  }

  // msg["owner"] = msg["owner"] || deployer.key.accAddress(getPrefix());

  console.log("\n" + JSON.stringify(msg).replace(/\\/g, "") + "\n");

  await waitForConfirm("Proceed to deploy contracts?");
  const result = await instantiateWithConfirm(
    deployer,
    argv["admin"] ? argv["admin"] : deployer.key.accAddress(getPrefix()),
    hubCodeId,
    msg,
    argv.label,
    {
      uwhale: "50000000",
    }
  );
  const address =
    result.logs[0].eventsByType["instantiate"]["_contract_address"][0] ??
    result.logs[0].eventsByType["instantiate"]["contract_address"][0];
  console.log(`Contract instantiated! Address: ${address}`);
})();
