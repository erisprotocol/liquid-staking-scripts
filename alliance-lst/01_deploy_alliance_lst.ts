import { Wallet } from "@terra-money/feather.js";
import * as fs from "fs";
import * as path from "path";
import yargs from "yargs/yargs";
import { tokens, tokens_migaloo } from "../amp-compounder/tokens";
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
import { InstantiateMsg } from "../types/tokenfactory/alliance-lst/eris_alliance_lst_whitewhale_instantiate";

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
  migaloo: {
    denom: "ampBTC",
    protocol_fee_contract:
      "migaloo17w97atfwdnjpe6wywwsjjw09050aq9s78jjjsmrmhhqtg7nevpmq0u8t9v",
    protocol_reward_fee: "0.069",
    owner: "migaloo1dpaaxgw4859qhew094s87l0he8tfea3lf74c2y",
    operator: "migaloo1c023jxq099et7a44ledfwuu3sdkfq8caya90nk",
    epoch_period: 3 * 24 * 60 * 60,
    unbond_period: 21 * 24 * 60 * 60,
    utoken: tokens_migaloo.wbtc.native_token.denom,
    validator_proxy:
      "migaloo1436kxs0w2es6xlqpp9rd35e3d0cjnw4sv8j3a7483sgks29jqwgshqdky4",
    delegation_strategy: {
      gauges: {
        amp_factor_bps: 10000,
        amp_gauges:
          "migaloo14haqsatfqxh3jgzn6u7ggnece4vhv0nt8a8ml4rg29mln9hdjfdqpz474l",
        max_delegation_bps: 2500,
        min_delegation_bps: 50,
        validator_count: 30,
      },
    },
  },

  mainnet: {
    denom: "MOAR",
    protocol_fee_contract: "terra1rgggsspquaxjp4lmegx7a3q4l9lg44hnu7rjxa",
    protocol_reward_fee: "0.1",
    owner: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
    operator: "terra1gtuvt6eh4m67tvd2dnfqhgks9ec6ff08c5vlup",
    epoch_period: 3 * 24 * 60 * 60,
    unbond_period: 21 * 24 * 60 * 60,
    utoken: tokens.amproar.native_token.denom,
    validator_proxy:
      "terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk",
    delegation_strategy: {
      gauges: {
        amp_factor_bps: 10000,
        amp_gauges:
          "terra1aumv9uyv2ltf8upsf88338ctf922q439a0v2tpss5s2j9g0j8zzsrtq9t2",
        max_delegation_bps: 2500,
        min_delegation_bps: 50,
        validator_count: 30,
      },
    },
  },
};

// MIGALOO ampBTC
// ts-node ./alliance-lst/01_deploy_alliance_lst.ts --network migaloo --key mainnet-migaloo --label "ERIS ampBTC Hub" --hub-code-id 476 --hub-binary "../contracts-tokenfactory/artifacts/eris_alliance_lst_whitewhale.wasm"
// ts-node amp-governance/1_upload_contracts.ts --network migaloo --key mainnet-migaloo --folder contracts-tokenfactory --contracts eris_alliance_lst_whitewhale --migrates migaloo1pll95yfcnxd5pkkrcsad63l929m4ehk4c46fpqqp3c2d488ca0csc220d0
// eris_alliance_lst_whitewhale: 476->594->616 : migaloo1pll95yfcnxd5pkkrcsad63l929m4ehk4c46fpqqp3c2d488ca0csc220d0

// TERRA MOAR
// ts-node ./alliance-lst/01_deploy_alliance_lst.ts --network mainnet --key mainnet --label "ERIS MOAR Hub" --hub-code-id 2660 --hub-binary "../contracts-tokenfactory/artifacts/eris_alliance_lst_terra.wasm"
// ts-node amp-governance/1_upload_contracts.ts --network mainnet --key mainnet --code-id 2791 --folder contracts-tokenfactory --contracts eris_alliance_lst_terra --migrates terra1dndhtdr2v7ca8rrn67chlqw3cl3xhm3m2uxls62vghcg3fsh5tpss5xmcu
// eris_alliance_lst_terra: 2660->2661->2687->2689->2788->2791 : terra1dndhtdr2v7ca8rrn67chlqw3cl3xhm3m2uxls62vghcg3fsh5tpss5xmcu

// // // TERRA
// // // ts-node amp-governance/1_upload_contracts.ts --network mainnet --key mainnet --folder contracts-dao-lst --contracts eris_dao_lst_terra eris_gov_voting_escrow eris_gov_prop_gauges
// // // ts-node dao-lst/deploy_dao_lst.ts --network mainnet --key mainnet --hub-code-id 1917 --label "ERIS ampROAR Hub"
// // // ts-node amp-governance/2_instantiate_escrow.ts --network mainnet --key mainnet --contract-code-id 1918 --label "Vote-escrow ampROAR"
// // // ts-node amp-governance/4_instantiate_propgauges.ts --network mainnet --key mainnet --contract-code-id 1919 --label "Prop Gauge"
// // // ts-node amp-governance/5_config_escrow_for_update.ts --network mainnet --key mainnet --contract terra1q33xvxt03ds6rsrk9p7dzaz4540s5q995gmt8dp3u47smaw292jqrmpxgd
// // // ts-node amp-governance/6_config_hub.ts --network mainnet --key mainnet --contract terra1vklefn7n6cchn0u962w3gaszr4vf52wjvd4y95t2sydwpmpdtszsqvk9wy
// // // Migrate
// // // ampRAOR ts-node amp-governance/1_upload_contracts.ts --network mainnet --key mainnet --key-migrate ledger --folder contracts-dao-lst --contracts eris_dao_lst_terra --migrates terra1vklefn7n6cchn0u962w3gaszr4vf52wjvd4y95t2sydwpmpdtszsqvk9wy
// // // PropGauge ts-node amp-governance/1_upload_contracts.ts --network mainnet --key mainnet --folder contracts-dao-lst --contracts eris_gov_prop_gauges --migrates terra1uvv5rs7jl9ugf65k3qvsc9fyt5djcuh2fnwgk37xjea0975ud07qmygr5d
// // // Voting-Escrow ts-node amp-governance/1_upload_contracts.ts --network mainnet --key mainnet --key-migrate ledger --folder contracts-dao-lst --contracts eris_gov_voting_escrow --migrates terra1q33xvxt03ds6rsrk9p7dzaz4540s5q995gmt8dp3u47smaw292jqrmpxgd

// // // 'eris_dao_lst_terra: 1917->2288->2422->2657->2852', terra1vklefn7n6cchn0u962w3gaszr4vf52wjvd4y95t2sydwpmpdtszsqvk9wy
// // // 'eris_gov_voting_escrow: 1918->2686', terra1q33xvxt03ds6rsrk9p7dzaz4540s5q995gmt8dp3u47smaw292jqrmpxgd
// // // 'eris_gov_prop_gauges: 1919->2290 terra1uvv5rs7jl9ugf65k3qvsc9fyt5djcuh2fnwgk37xjea0975ud07qmygr5d
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
      uluna: "10000000",
    }
  );
  const address =
    result.logs[0].eventsByType["instantiate"]["_contract_address"][0] ??
    result.logs[0].eventsByType["instantiate"]["contract_address"][0];
  console.log(`Contract instantiated! Address: ${address}`);
})();
