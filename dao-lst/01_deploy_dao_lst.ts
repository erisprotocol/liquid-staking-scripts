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
import { InstantiateMsg } from "../types/dao-lst/hub/eris_dao_lst_kujira_instantiate";

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

const templates: Partial<Record<Chains, InstantiateMsg>> = {
  // "testnet-kujira": {
  //   dao_interface: {
  //     cw4: {
  //       addr: "kujira17z9vd35q83ceap4ph8facx7xjczkqfrcenexs95tdwvttctjpsrq6xfxve",
  //       fund_distributor:
  //         "kujira1tz4s9333x9az99jek4hz9xhltnvqqg53xdd5yplrpe9jl7jqrkjss920xh",
  //       gov: "kujira1m772afpg6rker6ajd6nczv8mgupusf5440k8l83c69p2ezxz4dcqa3yly7",
  //     },
  //   },
  //   denom: "ampMNTA",
  //   utoken: {
  //     native_token: {
  //       denom: "factory/kujira1643jxg8wasy5cfcn7xm8rd742yeazcksqlg4d7/umnta",
  //     },
  //   },
  //   epoch_period: 60,
  //   unbond_period: 600,
  //   operator: "kujira1dpaaxgw4859qhew094s87l0he8tfea3l4z76jq",
  //   owner: "kujira1dpaaxgw4859qhew094s87l0he8tfea3l4z76jq",
  //   protocol_reward_fee: "0.05",
  //   protocol_fee_contract: "kujira1z3txc4x7scxsypx9tgynyfhu48nw60a55as0fq",
  // },

  "testnet-kujira": {
    dao_interface: {
      cw4: {
        addr: "kujira12y9ltc6a0vnlce6dkdmkv23jm6euu3zgvnwcwlggd42wgexyvh2srr8r5q",
        fund_distributor:
          "kujira1lrd5lpuwym3hhv7y590yulnmqyw6j807p92ptmy3wk8836z9kscq0txr5r",
        gov: "kujira15e682nq9jees29rm9j3h030af86lq2qtlejgphlspzqcvs9whf2q00nua5",
      },
    },
    denom: "ampMNTA",
    utoken: {
      native_token: {
        denom: "factory/kujira1643jxg8wasy5cfcn7xm8rd742yeazcksqlg4d7/umnta",
      },
    },
    epoch_period: 86400,
    unbond_period: 1814400,
    operator: "kujira1c023jxq099et7a44ledfwuu3sdkfq8cacpwdtj",
    owner: "kujira1dpaaxgw4859qhew094s87l0he8tfea3l4z76jq",
    protocol_reward_fee: "0.05",
    protocol_fee_contract: "kujira1z3txc4x7scxsypx9tgynyfhu48nw60a55as0fq",
  },

  mainnet: {
    dao_interface: {
      enterprise: {
        addr: "terra17c6ts8grcfrgquhj3haclg44le8s7qkx6l2yx33acguxhpf000xqhnl3je",
        fund_distributor:
          "terra16j3yxfwzytjm7xq7kcdmfyessz8vg6r938hrfkk64nq9dyyqcd9qczudmr",
      },
    },
    denom: "ampROAR",
    utoken: {
      token: {
        contract_addr:
          "terra1lxx40s29qvkrcj8fsa3yzyehy7w50umdvvnls2r830rys6lu2zns63eelv",
      },
    },
    epoch_period: 1 * 24 * 60 * 60,
    unbond_period: 7 * 24 * 60 * 60,
    operator: "terra1gtuvt6eh4m67tvd2dnfqhgks9ec6ff08c5vlup",
    owner: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
    protocol_reward_fee: "0.05",
    protocol_fee_contract:
      "terra1v3h5lejqer5qnjnj6gds94u55x0qsxq7cpxs2kf7kqu6drwgmz4qd9qav9",
  },
};

// KUJIRA MAINNET
// ts-node amp-governance/1_upload_contracts.ts --network kujira --key mainnet-kujira --folder contracts-dao-lst --contracts eris_dao_lst_kujira eris_gov_voting_escrow eris_gov_prop_gauges
// 'eris_dao_lst_kujira: 163', -> kujira175yatpvkpgw07w0chhzuks3zrrae9z9g2y6r7u5pzqesyau4x9eqqyv0rr
// 'eris_gov_voting_escrow: 164',
// 'eris_gov_prop_gauges: 165'

// ts-node dao-lst/01_deploy_dao_lst.ts --network kujira --key key-mainnet --hub-code-id 2489 --label XXX

// KUJIRA TESTNET
// ts-node amp-governance/1_upload_contracts.ts --network testnet-kujira --key mainnet-kujira --folder contracts-dao-lst --contracts eris_dao_lst_kujira eris_gov_voting_escrow eris_gov_prop_gauges
// ts-node dao-lst/01_deploy_dao_lst.ts --network testnet-kujira --key key-mainnet --hub-code-id 2511 --label Hub
// ts-node amp-compounder/1_upload_contracts.ts --network testnet-kujira --key key-mainnet --contracts eris_gov_voting_escrow eris_gov_amp_gauges eris_gov_prop_gauges eris_astroport_farm eris_compound_proxy eris_generator_proxy eris_fees_collector --folder contracts-tokenfactory
// ts-node amp-governance/2_instantiate_escrow.ts --network testnet-kujira --key key-mainnet --contract-code-id 2487 --label "Vote-escrow ampMNTA"
// ts-node amp-governance/4_instantiate_propgauges.ts --network testnet-kujira --key key-mainnet --contract-code-id 2488 --label "Prop Gauge"
// ts-node amp-governance/5_config_escrow_for_update.ts --network testnet-kujira --key key-mainnet --contract kujira1mgn3ft0vsfsfgjt8tcjn3pjh3zecsmanay7ummnyef6cvgg2xa2qtj7v63
// ts-node amp-governance/6_config_hub.ts --network testnet-kujira --key key-mainnet --contract kujira1n8yke2vzsqe3h67h42yh66360q7pe67zwer8rvzjkttr2wqffnes56q9jj

// ts-node 3_migrate.ts --network testnet-kujira --key key-mainnet --key-migrate key-mainnet --code-id 2490 --contract-address kujira1n8yke2vzsqe3h67h42yh66360q7pe67zwer8rvzjkttr2wqffnes56q9jj
// ts-node amp-governance/1_upload_contracts.ts --network testnet-kujira --key key-mainnet --folder contracts-dao-lst --contracts eris_dao_lst_kujira --migrates kujira1n8yke2vzsqe3h67h42yh66360q7pe67zwer8rvzjkttr2wqffnes56q9jj
// ts-node amp-governance/1_upload_contracts.ts --network testnet-kujira --key key-mainnet --folder contracts-dao-lst --contracts eris_gov_prop_gauges --migrates kujira1xgfxe88an654rrlm9f2rvz20hgex0aufhuzcdu3j6rx7a4tf75dsut22qk
// 'eris_dao_lst_kujira: 2491', kujira1n8yke2vzsqe3h67h42yh66360q7pe67zwer8rvzjkttr2wqffnes56q9jj -> factory/kujira1n8yke2vzsqe3h67h42yh66360q7pe67zwer8rvzjkttr2wqffnes56q9jj/ampMNTA
// 'eris_gov_voting_escrow: 2487', kujira1mgn3ft0vsfsfgjt8tcjn3pjh3zecsmanay7ummnyef6cvgg2xa2qtj7v63
// 'eris_gov_prop_gauges: 2492', kujira1xgfxe88an654rrlm9f2rvz20hgex0aufhuzcdu3j6rx7a4tf75dsut22qk

// 1.0.1 [
//   'eris_dao_lst_kujira: 2511',
//   'eris_gov_voting_escrow: 2512',
//   'eris_gov_prop_gauges: 2513'
// ]
// ts-node 14_3_change_operator.ts --network testnet-kujira --key key-mainnet --hub-address kujira1n8yke2vzsqe3h67h42yh66360q7pe67zwer8rvzjkttr2wqffnes56q9jj

// TERRA
// ts-node amp-governance/1_upload_contracts.ts --network mainnet --key mainnet --folder contracts-dao-lst --contracts eris_dao_lst_terra eris_gov_voting_escrow eris_gov_prop_gauges
// ts-node dao-lst/deploy_dao_lst.ts --network mainnet --key mainnet --hub-code-id 1917 --label "ERIS ampROAR Hub"
// ts-node amp-governance/2_instantiate_escrow.ts --network mainnet --key mainnet --contract-code-id 1918 --label "Vote-escrow ampROAR"
// ts-node amp-governance/4_instantiate_propgauges.ts --network mainnet --key mainnet --contract-code-id 1919 --label "Prop Gauge"
// ts-node amp-governance/5_config_escrow_for_update.ts --network mainnet --key mainnet --contract terra1q33xvxt03ds6rsrk9p7dzaz4540s5q995gmt8dp3u47smaw292jqrmpxgd
// ts-node amp-governance/6_config_hub.ts --network mainnet --key mainnet --contract terra1vklefn7n6cchn0u962w3gaszr4vf52wjvd4y95t2sydwpmpdtszsqvk9wy
// Migrate
// ampRAOR ts-node amp-governance/1_upload_contracts.ts --network mainnet --key mainnet --key-migrate ledger --folder contracts-dao-lst --contracts eris_dao_lst_terra --migrates terra1vklefn7n6cchn0u962w3gaszr4vf52wjvd4y95t2sydwpmpdtszsqvk9wy
// PropGauge ts-node amp-governance/1_upload_contracts.ts --network mainnet --key mainnet --folder contracts-dao-lst --contracts eris_gov_prop_gauges --migrates terra1uvv5rs7jl9ugf65k3qvsc9fyt5djcuh2fnwgk37xjea0975ud07qmygr5d

// 'eris_dao_lst_terra: 1917->2288->2422->2657', terra1vklefn7n6cchn0u962w3gaszr4vf52wjvd4y95t2sydwpmpdtszsqvk9wy
// 'eris_gov_voting_escrow: 1918', terra1q33xvxt03ds6rsrk9p7dzaz4540s5q995gmt8dp3u47smaw292jqrmpxgd
// 'eris_gov_prop_gauges: 1919->2290 terra1uvv5rs7jl9ugf65k3qvsc9fyt5djcuh2fnwgk37xjea0975ud07qmygr5d
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
      ukuji: "10000000",
    }
  );
  const address =
    result.logs[0].eventsByType["instantiate"]["_contract_address"][0] ??
    result.logs[0].eventsByType["instantiate"]["contract_address"][0];
  console.log(`Contract instantiated! Address: ${address}`);
})();
