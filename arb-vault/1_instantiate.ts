import { Coin, TxLog } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  Chains,
  createLCDClient,
  createWallet,
  getPrefix,
  instantiateWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { InstantiateMsg } from "../types/arb-vault/eris_arb_vault_instantiate";
import { InstantiateMsg as TfInstantiateMsg } from "../types/tokenfactory/arb-vault/eris_arb_vault_instantiate";

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
    "contract-code-id": {
      type: "number",
      demandOption: true,
    },
    label: {
      type: "string",
      demandOption: true,
    },
  })
  .parseSync();

// Testnet
// ts-node ampz/1_upload_contracts.ts --network testnet --key testnet --contracts eris_arb_vault
// ts-node amp-governance/1_upload_contracts.ts --network testnet --key testnet --contracts eris_arb_vault --migrates terra1xjvf8rd3vz4j7xgr80k9pqekcuwywgyfepaeujm06g4xc20qetyshe4uth
// ts-node arb-vault/1_instantiate.ts --network testnet --key testnet --contract-code-id 8249 --label "Eris Arbitrage Vault"
// ts-node arb-vault/10_update_config.ts --network testnet --key testnet --contract terra1xjvf8rd3vz4j7xgr80k9pqekcuwywgyfepaeujm06g4xc20qetyshe4uth

// mainnet
// ts-node ampz/1_upload_contracts.ts --network mainnet --key mainnet --contracts eris_arb_vault
// ts-node arb-vault/1_instantiate.ts --network mainnet --key ledger --contract-code-id 1312 --label "Eris Arbitrage Vault"
// ts-node arb-vault/10_update_config.ts --network mainnet --key mainnet --contract terra1r9gls56glvuc4jedsvc3uwh6vj95mqm9efc7hnweqxa2nlme5cyqxygy5m
// 1312 - terra1r9gls56glvuc4jedsvc3uwh6vj95mqm9efc7hnweqxa2nlme5cyqxygy5m

// TEST ts-node arb-vault/1_instantiate.ts --network mainnet --key mainnet --contract-code-id 1312 --label "Eris Arbitrage Vault Test"
// TEST 1367 - terra1uz7x69xkekc2gqqzfymqxye3nklkt63r4q8jzta8khjdp7nj95wqmcl7d7
// TEST ts-node arb-vault/10_update_config.ts --network mainnet --key mainnet --contract terra1uz7x69xkekc2gqqzfymqxye3nklkt63r4q8jzta8khjdp7nj95wqmcl7d7
// TEST ts-node amp-governance/1_upload_contracts.ts --network mainnet --key mainnet --contracts eris_arb_vault --migrates terra1uz7x69xkekc2gqqzfymqxye3nklkt63r4q8jzta8khjdp7nj95wqmcl7d7

// MIGALOO
// ts-node amp-governance/1_upload_contracts.ts --network migaloo --key mainnet-migaloo --contracts eris_arb_vault_whitewhale --folder contracts-tokenfactory
// eris_arb_vault_whitewhale: 60
// ts-node arb-vault/1_instantiate.ts --network migaloo --key mainnet-migaloo --contract-code-id 60 --label "Eris Arbitrage Vault"

const templates: Partial<Record<Chains, InstantiateMsg | TfInstantiateMsg>> = {
  testnet: <InstantiateMsg>{
    cw20_code_id: 125,
    decimals: 6,
    name: "ERIS Arbitrage LUNA",
    symbol: "arbLUNA",
    owner: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
    unbond_time_s: (21 + 4) * 24 * 60 * 60,
    utoken: "uluna",
    whitelist: ["terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr"],
    utilization_method: {
      steps: [
        ["0.005", "0.5"],
        ["0.01", "0.7"],
        ["0.03", "1.0"],
      ],
    },
    fee_config: {
      immediate_withdraw_fee: "0.05",
      protocol_withdraw_fee: "0.005",
      protocol_fee_contract: "terra1rgggsspquaxjp4lmegx7a3q4l9lg44hnu7rjxa",
      protocol_performance_fee: "0.1",
    },
    lsds: [
      {
        disabled: false,
        lsd_type: {
          eris: {
            addr: "terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88",
            cw20: "terra1xgvp6p0qml53reqdyxgcl8ttl0pkh0n2mtx2n7tzfahn6e0vca7s0g7sg6",
          },
        },
        name: "eris",
      },
    ],
  },
  mainnet: <InstantiateMsg>{
    cw20_code_id: 12,
    decimals: 6,
    name: "ERIS Arbitrage LUNA TEST",
    symbol: "arbLUNAT",
    owner: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
    unbond_time_s: (21 + 4) * 24 * 60 * 60,
    utoken: "uluna",
    whitelist: ["terra1gtuvt6eh4m67tvd2dnfqhgks9ec6ff08c5vlup"],
    utilization_method: {
      steps: [
        ["0.01", "0.2"],
        ["0.02", "0.5"],
        ["0.03", "0.8"],
        ["0.05", "1.0"],
      ],
    },
    fee_config: {
      immediate_withdraw_fee: "0",
      protocol_withdraw_fee: "0",
      protocol_fee_contract:
        "terra1v3h5lejqer5qnjnj6gds94u55x0qsxq7cpxs2kf7kqu6drwgmz4qd9qav9",
      protocol_performance_fee: "0",
    },
    lsds: [
      {
        disabled: false,
        lsd_type: {
          eris: {
            addr: "terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk",
            cw20: "terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct",
          },
        },
        name: "ampLUNA",
      },
      {
        disabled: false,
        lsd_type: {
          stader: {
            addr: "terra179e90rqspswfzmhdl25tg22he0fcefwndgzc957ncx9dleduu7ms3evpuk",
            cw20: "terra14xsm2wzvu7xaf567r693vgfkhmvfs08l68h4tjj5wjgyn5ky8e2qvzyanh",
          },
        },
        name: "LunaX",
      },
    ],
  },
  migaloo: <TfInstantiateMsg>{
    owner: "migaloo1dpaaxgw4859qhew094s87l0he8tfea3lf74c2y",
    unbond_time_s: (21 + 4) * 24 * 60 * 60,
    denom: "arbWHALE",
    utoken: "uwhale",
    whitelist: [
      "migaloo1l4x3hd7rwj26nqw2dhhdm4t9vtv0lqx3v54hzg",
      "migaloo1eetvnrgndvc9atgqxykmhl9xp34l66hsy2u27u",
      "migaloo187llpg2lgvvnltqg50vfqaap54xnqejvhnslte",
      "migaloo1v6cfsslgx04arl8qx5nmx4qggfxlg6t2wkrfc7",
      "migaloo1a854faa6dm0jgp63u9wx48m2y4kl2283n0kmcm",
      "migaloo146m835sckyqhsm9jmjvjky99lzyvy2kkfql0a9",
      "migaloo1zm4eevxcmv0lh67x5slaxn87szt3c36m4rmmk3",
    ],
    utilization_method: {
      steps: [
        ["0.01", "0.4"],
        ["0.02", "0.7"],
        ["0.03", "0.9"],
        ["0.05", "1.0"],
      ],
    },
    fee_config: {
      immediate_withdraw_fee: "0.05",
      protocol_withdraw_fee: "0.0069",
      protocol_fee_contract:
        "migaloo17w97atfwdnjpe6wywwsjjw09050aq9s78jjjsmrmhhqtg7nevpmq0u8t9v",
      protocol_performance_fee: "0.13",
    },
    lsds: [
      {
        disabled: false,
        lsd_type: {
          eris: {
            addr: "migaloo1436kxs0w2es6xlqpp9rd35e3d0cjnw4sv8j3a7483sgks29jqwgshqdky4",
            denom:
              "factory/migaloo1436kxs0w2es6xlqpp9rd35e3d0cjnw4sv8j3a7483sgks29jqwgshqdky4/ampWHALE",
          },
        },
        name: "ampWHALE",
      },
      {
        disabled: false,
        lsd_type: {
          backbone: {
            addr: "migaloo1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqdhts4u",
            denom:
              "factory/migaloo1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqdhts4u/boneWhale",
          },
        },
        name: "boneWHALE",
      },
    ],
  },
};

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const msg = templates[argv["network"] as Chains];
  if (!msg) throw new Error("no message");

  const addr = deployer.key.accAddress(getPrefix());

  msg.owner = msg.owner || addr;

  console.log("msg", msg);

  const result = await instantiateWithConfirm(
    deployer,
    addr,
    argv.contractCodeId,
    msg,
    argv.label,
    [new Coin("uwhale", 50000000)]
  );

  const addresses = result.logs.map(
    (a: TxLog) => a.eventsByType["instantiate"]["_contract_address"][0]
  );

  console.log(`Contract instantiated! Address: ${addresses}`);
})();
