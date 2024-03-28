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
import { InstantiateMsg } from "../types/ica/hub/instantiate";

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
    label: {
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

const templates: Partial<Record<Chains, InstantiateMsg>> = {
  "testnet-kujira": {
    denom: "ampATOMt",
    epoch_period: 86400,
    unbond_period: 1814400,
    owner: "kujira1dpaaxgw4859qhew094s87l0he8tfea3l4z76jq",
    operator: "kujira1dpaaxgw4859qhew094s87l0he8tfea3l4z76jq",
    delegation_operator: "kujira1dpaaxgw4859qhew094s87l0he8tfea3l4z76jq",
    fee_addr: "kujira1z3txc4x7scxsypx9tgynyfhu48nw60a55as0fq",
    reward_fee: "0.05",
    utoken_controller:
      "ibc/C82173695F4C472A6F4EBF7369DFA69852A710834C24CEB7DF4DC90132B178E6",
    utoken_host: "uatom",
    validators: [
      "cosmosvaloper10v6wvdenee8r9l6wlsphcgur2ltl8ztkfrvj9a",
      "cosmosvaloper1mngvkkhm6g7nqxh4hcv8hjxvgax4m8xujzt964",
      "cosmosvaloper183aycgtstp67r6s4vd7ts2npp2ckk4xah7rxj6",
    ],
    strategy: {
      defined: {
        shares_bps: [
          ["cosmosvaloper10v6wvdenee8r9l6wlsphcgur2ltl8ztkfrvj9a", 3333],
          ["cosmosvaloper1mngvkkhm6g7nqxh4hcv8hjxvgax4m8xujzt964", 3333],
          ["cosmosvaloper183aycgtstp67r6s4vd7ts2npp2ckk4xah7rxj6", 3334],
        ],
      },
    },
  },

  //   mainnet: {
  //     dao_interface: {
  //       enterprise: {
  //         addr: "terra17c6ts8grcfrgquhj3haclg44le8s7qkx6l2yx33acguxhpf000xqhnl3je",
  //         fund_distributor:
  //           "terra16j3yxfwzytjm7xq7kcdmfyessz8vg6r938hrfkk64nq9dyyqcd9qczudmr",
  //       },
  //     },
  //     denom: "ampROAR",
  //     utoken: {
  //       token: {
  //         contract_addr:
  //           "terra1lxx40s29qvkrcj8fsa3yzyehy7w50umdvvnls2r830rys6lu2zns63eelv",
  //       },
  //     },
  //     epoch_period: 1 * 24 * 60 * 60,
  //     unbond_period: 7 * 24 * 60 * 60,
  //     operator: "terra1gtuvt6eh4m67tvd2dnfqhgks9ec6ff08c5vlup",
  //     owner: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
  //     protocol_reward_fee: "0.05",
  //     protocol_fee_contract:
  //       "terra1v3h5lejqer5qnjnj6gds94u55x0qsxq7cpxs2kf7kqu6drwgmz4qd9qav9",
  //   },
};

// KUJIRA TESTNET
// ts-node amp-governance/1_upload_contracts.ts --network testnet-kujira --key key-mainnet --folder contracts-ica --contracts eris_ica_staking_hub_kujira
// ts-node ica/1_deploy_hub.ts --network testnet-kujira --key key-mainnet --code-id 3216 --folder contracts-ica --contracts eris_ica_staking_hub_kujira --label "ampATOM Testnet"
// ts-node ica/2_create_accounts.ts --network testnet-kujira --key key-mainnet --contract kujira14vgxywl4vtg8q9rp0je2e9c6uges9pahvwspf3067t8mqse8sg5qjqn9en
// ts-node ica/3_init_accounts.ts --network testnet-kujira --key key-mainnet --contract kujira1ylxjqcvt42lp7kk2ajkxwc93zmlrq4jrgcq0md64f707vn4tjyhq7rga78
// eris_ica_staking_hub_kujira -> 3214: kujira1ylxjqcvt42lp7kk2ajkxwc93zmlrq4jrgcq0md64f707vn4tjyhq7rga78

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const hubCodeId =
    argv["code-id"] ??
    (await uploadCode(deployer, path.resolve(argv["hub-binary"])));

  let msg: any;
  if (argv["msg"]) {
    msg = JSON.parse(fs.readFileSync(path.resolve(argv["msg"]), "utf8"));
  } else {
    msg = templates[argv["network"] as any as Chains];
  }

  // console.log(JSON.stringify(msg));

  // if (1 === 1) return;

  msg["owner"] = msg["owner"] || deployer.key.accAddress(getPrefix());
  msg["operator"] = msg["operator"] || deployer.key.accAddress(getPrefix());

  console.log("\n" + JSON.stringify(msg).replace(/\\/g, "") + "\n");

  await waitForConfirm("Proceed to deploy contracts?");
  const result = await instantiateWithConfirm(
    deployer,
    argv["admin"] ? argv["admin"] : deployer.key.accAddress(getPrefix()),
    hubCodeId,
    msg,
    argv.label,
    {
      ukuji: "100000000",
    }
  );
  const address =
    result.logs[0].eventsByType["instantiate"]["_contract_address"][0] ??
    result.logs[0].eventsByType["instantiate"]["contract_address"][0];
  console.log(`Contract instantiated! Address: ${address}`);
})();
