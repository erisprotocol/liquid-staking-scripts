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
} from "../helpers";
import * as keystore from "../keystore";

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
    "key-upload": {
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
      demandOption: false,
    },
    binary: {
      type: "string",
      demandOption: false,
      // default: "./../../cw-plus/artifacts/cw20_ics20.wasm",
      default: "cw20_ics20.wasm",
    },
  })
  .parseSync();

async function uploadCode(deployer: Wallet, path: string) {
  await waitForConfirm(`Upload code ${path}?`);
  const codeId = await storeCodeWithConfirm(deployer, path);
  console.log(`Code uploaded! ID: ${codeId}`);
  return codeId;
}

interface AllowMsg {
  contract: string;
  gas_limit?: number;
}

export interface InitCw20 {
  /// Default timeout for ics20 packets, specified in seconds
  default_timeout: number;
  /// who can allow more contracts
  gov_contract: string;
  /// initial allowlist - all cw20 tokens we will send must be previously allowed by governance
  allowlist: AllowMsg[];
  /// If set, contracts off the allowlist will run with this gas limit.
  /// If unset, will refuse to accept any contract off the allow list.
  default_gas_limit?: number;
}

const templates: Record<string, InitCw20> = {
  mainnet: <InitCw20>{
    allowlist: [
      {
        contract:
          "terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct",
      },
    ],
    default_timeout: 900,
    gov_contract: "",
  },
  testnet: <InitCw20>{
    allowlist: [
      {
        contract:
          "terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88",
      },
    ],
    default_timeout: 900,
    gov_contract: "",
  },
  classic: {
    allowlist: [
      {
        contract: "terra1wvk6r3pmj0835udwns4r5e0twsclvcyuq9ucgm",
      },
    ],
    default_timeout: 900,
    gov_contract: "",
  },
};

// TESTNET
// ts-node 2_deploy_ics.ts --network testnet --key testnet --key-upload testnet
// terra14uyr0q6kt5fy67h9tq7jra2g9y60859vty0wvpj0p3l75qqh6v8qzd8rpx

// MAINNET
// ts-node 2_deploy_ics.ts --network mainnet --key ledger --key-upload invest --code-id 441
// mainnet code 441
// mainnet contract terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au

// Classic
// ts-node 2_deploy_ics.ts --network classic --key ledger --key-upload invest
// classic code 6193
// classic contract terra1z5a8d75p2vl7528d7wuqhnl6dr0umyqm675h56

(async function () {
  const terra = createLCDClient(argv["network"]);
  const uploader = await createWallet(
    terra,
    argv["key-upload"],
    argv["key-dir"]
  );
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const hubCodeId =
    argv["code-id"] ??
    (await uploadCode(uploader, path.resolve(argv["binary"])));

  let msg: any;
  if (argv["msg"]) {
    msg = JSON.parse(fs.readFileSync(path.resolve(argv["msg"]), "utf8"));
  } else {
    msg = templates[argv["network"]];
  }
  msg["gov_contract"] =
    msg["gov_contract"] || deployer.key.accAddress(getPrefix());

  console.log("\n" + JSON.stringify(msg).replace(/\\/g, "") + "\n");

  await waitForConfirm("Proceed to deploy contracts?");
  const result = await instantiateWithConfirm(
    deployer,
    argv["admin"] ? argv["admin"] : deployer.key.accAddress(getPrefix()),
    hubCodeId,
    msg,
    "Eris ICS20"
  );
  const address =
    result.logs[0].eventsByType["instantiate"]["_contract_address"][0];
  console.log(`Contract instantiated! Address: ${address}`);
})();
