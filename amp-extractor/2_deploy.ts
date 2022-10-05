import { TxLog, Wallet } from "@terra-money/terra.js";
import * as fs from "fs";
import * as path from "path";
import yargs from "yargs/yargs";
import { constants } from "../constants";
import {
  createLCDClient,
  createWallet,
  instantiateMultipleWithConfirm,
  storeCodeWithConfirm,
  waitForConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { InstantiateMsg } from "../types/yield-extractor/instantiate_msg";

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
    name: {
      type: "string",
      demandOption: true,
    },
    msg: {
      type: "string",
      demandOption: false,
    },
    "contract-code-id": {
      type: "number",
      demandOption: false,
    },
    "token-code-id": {
      type: "number",
      demandOption: true,
    },
    "hub-binary": {
      type: "string",
      demandOption: false,
      default:
        "../../liquid-staking-contracts/artifacts/eris_yield_extractor.wasm",
    },
    "yield-extract-addr": {
      type: "string",
      demandOption: false,
    },
  })
  .parseSync();

// ts-node 2_deploy.ts --network testnet --key testnet --token-code-id 125 --contract-code-id 2412 --name Burn
// ts-node 2_deploy.ts --network testnet --key testnet --token-code-id 125 --contract-code-id 2412 --name Angel

// mainnet
// ts-node 2_deploy.ts --network mainnet --key mainnet --token-code-id 12 --yield-extract-addr terra10ge6t62gzesz378e09kkgqvx9ev7tf6xcl0as0 --name Angel
// ts-node 2_deploy.ts --network mainnet --key ledger --token-code-id 12 --yield-extract-addr terra10ge6t62gzesz378e09kkgqvx9ev7tf6xcl0as0 --contract-code-id 292 --name Angel
// ts-node 2_deploy.ts --network mainnet --key ledger --token-code-id 12 --yield-extract-addr terra1tz203ptlsfs8c63f2j0d0872pt5frjrvtxyju7 --contract-code-id 292 --name Burn
// ts-node 2_deploy.ts --network mainnet --key ledger --token-code-id 12 --yield-extract-addr terra16f874e52x5704ecrxyg5m9ljfv20cn0hajpng7 --contract-code-id 292 --name Spaces

async function uploadCode(deployer: Wallet, path: string) {
  await waitForConfirm(`Upload code ${path}?`);
  const codeId = await storeCodeWithConfirm(deployer, path);
  console.log(`Code uploaded! ID: ${codeId}`);
  return codeId;
}

const templates: Record<string, InstantiateMsg> = {
  testnet: <InstantiateMsg>{
    hub_contract: constants.testnet.eris_hub,
    interface: "eris",
    stake_token: constants.testnet.eris_ampluna,
    yield_extract_addr: constants.testnet.eris_fee,
  },
  mainnet: <InstantiateMsg>{
    hub_contract: constants.mainnet.eris_hub,
    interface: "eris",
    stake_token: constants.mainnet.eris_ampluna,
  },
};

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const hubCodeId =
    argv.contractCodeId ??
    (await uploadCode(deployer, path.resolve(argv["hub-binary"])));

  const tokenCodeId = argv.tokenCodeId;

  let msg: InstantiateMsg;
  if (argv["msg"]) {
    msg = JSON.parse(fs.readFileSync(path.resolve(argv["msg"]), "utf8"));
  } else {
    msg = templates[argv["network"]];
  }

  const name = argv.name;

  msg.cw20_code_id = tokenCodeId;
  msg.owner = msg.owner || deployer.key.accAddress;

  const inits: { msg: object; label: string }[] = [];

  for (let i = 10; i <= 100; i = i + 10) {
    const percent = i / 100;
    const contractName = i + "% " + name + " Yield-Extractor";
    msg.decimals = 6;
    msg.name = i + "% " + name + " LP";
    msg.label = "Eris LP Token for " + contractName;
    msg.symbol = name + "LP";
    msg.yield_extract_addr =
      msg.yield_extract_addr || argv.yieldExtractAddr || "";

    msg.yield_extract_p = percent.toFixed(4);
    if (msg.yield_extract_addr === "") {
      throw new Error("Yield extract addr not specified");
    }

    console.log("\n" + JSON.stringify(msg).replace(/\\/g, "") + "\n");

    inits.push({
      msg: JSON.parse(JSON.stringify(msg)),
      label: "Eris " + contractName,
    });
  }

  await waitForConfirm("Proceed to deploy contracts?");

  const result = await instantiateMultipleWithConfirm(
    deployer,
    argv["admin"] ? argv["admin"] : deployer.key.accAddress,
    hubCodeId,
    inits
  );
  const addresses = result.logs.map(
    (a: TxLog) => a.eventsByType["instantiate"]["_contract_address"][0]
  );
  console.log(`Contract instantiated! Address: ${addresses}`);
})();
