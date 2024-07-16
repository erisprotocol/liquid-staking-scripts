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
import { InstantiateMsg } from "../../types/restake_gauges/instantiate";

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

const templates: Partial<Record<Chains, InstantiateMsg>> = {
  // MIGALOO TEST
  // migaloo: <InstantiateMsg>{
  //   hook_sender_addr:
  //     "migaloo162t0dawj98ruwxlmscga432lylgj58xsjkgjqphlw5f5j70hamjq4hye97",
  //   min_gauge_percentage: "0.05",
  //   report_debounce_s: 1000,
  //   restaking_hub_addr:
  //     "migaloo162t0dawj98ruwxlmscga432lylgj58xsjkgjqphlw5f5j70hamjq4hye97",
  //   owner: "migaloo1dpaaxgw4859qhew094s87l0he8tfea3lf74c2y",
  // },
  // MIGALOO MAIN
  migaloo: <InstantiateMsg>{
    // hook_sender_addr:
    //   "migaloo1fnruw95aftrh9tkr497kay89seppkas26jfw82qk5ppdgvenw00qnhh2xw",
    hook_sender_addr:
      "migaloo1gh85pqy33fhlecqp9xteqtcsqpjru7ym6h5e6qe0276yc48uwv3shj5hmd",
    min_gauge_percentage: "0.05",
    report_debounce_s: 15 * 60,
    restaking_hub_addr:
      "migaloo190qz7q5fu4079svf890h4h3f8u46ty6cxnlt78eh486k9qm995hquuv9kd",
    owner: "migaloo1dpaaxgw4859qhew094s87l0he8tfea3lf74c2y",
  },
};

// MIGALOO (RESTAKE TEST)
// ts-node amp-governance/1_upload_contracts.ts --network migaloo --key mainnet-migaloo --contracts eris_restake_gauges --folder contracts-tokenfactory --migrates migaloo1v42evfet0dplrl6x7cxpew05j2x4322dg9ezmuy0kz0e7t4uzycsla8tr0
// eris_restake_gauges: 563-> 566 -> 569
// ts-node chain/migaloo/deploy_restake.ts --network migaloo --key mainnet-migaloo --code-id 566 --label "Eris Test Restake Gauge"
// ts-node chain/migaloo/update_restake.ts --network migaloo --key mainnet-migaloo --contract migaloo1v42evfet0dplrl6x7cxpew05j2x4322dg9ezmuy0kz0e7t4uzycsla8tr0
// migaloo1v42evfet0dplrl6x7cxpew05j2x4322dg9ezmuy0kz0e7t4uzycsla8tr0
// TEST DAO Membership: migaloo162t0dawj98ruwxlmscga432lylgj58xsjkgjqphlw5f5j70hamjq4hye97
// TEST Restake Hub: migaloo1fl005yh4ztvfv4qgr4vc96uz5h658ztgu0n5gu5lpma96g8ya32s6sus5v

// MIGALOO (RESTAKE)
// ts-node amp-governance/1_upload_contracts.ts --network migaloo --key mainnet-migaloo --contracts eris_restake_gauges --folder contracts-tokenfactory --migrates migaloo1m7nt0zxuf3jvj2k8h9kmgkxjmepxz3k9t2c9ce8xwj94csg0epvq5j6z3w
// eris_restake_gauges: 569
// ts-node chain/migaloo/1_deploy_restake.ts --network migaloo --key mainnet-migaloo --code-id 569 --label "Eris Restake Gauge"
// ts-node chain/migaloo/1_update_restake.ts --network migaloo --key mainnet-migaloo --contract migaloo1m7nt0zxuf3jvj2k8h9kmgkxjmepxz3k9t2c9ce8xwj94csg0epvq5j6z3w
// migaloo1m7nt0zxuf3jvj2k8h9kmgkxjmepxz3k9t2c9ce8xwj94csg0epvq5j6z3w

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const hubCodeId = argv["code-id"];

  console.log(deployer.key.accAddress(getPrefix()));

  let msg: any;
  if (argv["msg"]) {
    msg = JSON.parse(fs.readFileSync(path.resolve(argv["msg"]), "utf8"));
  } else {
    msg = templates[argv["network"] as Chains];
  }

  console.log("\n" + JSON.stringify(msg).replace(/\\/g, "") + "\n");

  await waitForConfirm("Proceed to deploy contracts?");
  const result = await instantiateWithConfirm(
    deployer,
    argv["admin"] ? argv["admin"] : deployer.key.accAddress(getPrefix()),
    hubCodeId,
    msg,
    argv.label,
    {
      //   uwhale: "50000000",
    }
  );
  const address =
    result.logs[0].eventsByType["instantiate"]["_contract_address"][0] ??
    result.logs[0].eventsByType["instantiate"]["contract_address"][0];
  console.log(`Contract instantiated! Address: ${address}`);
})();
