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
} from "../helpers";
import * as keystore from "../keystore";
import { InstantiateMsg } from "../types/update-scaling-factor/instantiate";

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
  })
  .parseSync();

async function uploadCode(deployer: Wallet, path: string) {
  await waitForConfirm(`Upload code ${path}?`);
  const codeId = await storeCodeWithConfirm(deployer, path);
  console.log(`Code uploaded! ID: ${codeId}`);
  return codeId;
}

const templates: Partial<Record<Chains, InstantiateMsg>> = {
  osmosis: <InstantiateMsg>{
    hub: "osmo1dv8wz09tckslr2wy5z86r46dxvegylhpt97r9yd6qc3kyc6tv42qa89dr9",
    owner: "osmo1dpaaxgw4859qhew094s87l0he8tfea3lv30jfc",
    pool_id: 1,
    scale_first: true,
  },
};

// OSMOSIS
// ts-node amp-governance/1_upload_contracts.ts --network osmosis --key mainnet-osmosis --contracts eris_update_scaling_factor --folder "contracts-osmosis"
// eris_update_scaling_factor: 112
// ts-node chain/osmosis_instantiate_scaling_factor.ts --network osmosis --key mainnet-osmosis --code-id 112
// osmo16r0c97w2w9u894mcgee2c0wysjkve6cvwhr6kesrtzf3vy80v3gszdcesp

// ts-node amp-governance/1_upload_contracts.ts --network osmosis --key key-mainnet --code-id 134 --contracts xx --migrates osmo16r0c97w2w9u894mcgee2c0wysjkve6cvwhr6kesrtzf3vy80v3gszdcesp
// ts-node 3_migrate.ts --network osmosis --key key-mainnet --key-migrate key-mainnet --contract-address osmo16r0c97w2w9u894mcgee2c0wysjkve6cvwhr6kesrtzf3vy80v3gszdcesp --code-id 134

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const codeId = argv["code-id"];

  let msg: any;
  if (argv["msg"]) {
    msg = JSON.parse(fs.readFileSync(path.resolve(argv["msg"]), "utf8"));
  } else {
    msg = templates[argv["network"] as Chains];
  }

  msg["owner"] = msg["owner"] || deployer.key.accAddress(getPrefix());

  console.log("\n" + JSON.stringify(msg).replace(/\\/g, "") + "\n");

  await waitForConfirm("Proceed to deploy contracts?");
  const result = await instantiateWithConfirm(
    deployer,
    argv["admin"] ? argv["admin"] : deployer.key.accAddress(getPrefix()),
    codeId,
    msg,
    undefined
  );
  const address =
    result.logs[0].eventsByType["instantiate"]["_contract_address"][0] ??
    result.logs[0].eventsByType["instantiate"]["contract_address"][0];
  console.log(`Contract instantiated! Address: ${address}`);
})();
