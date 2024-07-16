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
} from "./helpers";
import * as keystore from "./keystore";
import { InstantiateMsg } from "./types/alliance-hub-lst/instantiate";

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
      default: "../artifacts/eris_alliance_hub_lst_terra.wasm",
    },
    label: {
      type: "string",
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
  // mainnet: <InstantiateMsg>{
  //   denom: "ampWHALEt",
  //   protocol_fee_contract: "terra1rgggsspquaxjp4lmegx7a3q4l9lg44hnu7rjxa",
  //   protocol_reward_fee: "0.1",
  //   owner: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
  //   operator: "terra1gtuvt6eh4m67tvd2dnfqhgks9ec6ff08c5vlup",
  //   utoken: {
  //     native_token: {
  //       denom:
  //         "ibc/B3F639855EE7478750CC8F82072307ED6E131A8EFF20345E1D136B50C4E5EC36",
  //     },
  //   },
  //   dao_interface: {
  //     alliance: {
  //       addr: "terra1jwyzzsaag4t0evnuukc35ysyrx9arzdde2kg9cld28alhjurtthq0prs2s",
  //     },
  //   },
  // },
  // mainnet: <InstantiateMsg>{
  //   denom: "boneWHALEt",
  //   protocol_fee_contract: "terra1rgggsspquaxjp4lmegx7a3q4l9lg44hnu7rjxa",
  //   protocol_reward_fee: "0.1",
  //   owner: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
  //   operator: "terra1gtuvt6eh4m67tvd2dnfqhgks9ec6ff08c5vlup",
  //   utoken: {
  //     native_token: {
  //       denom:
  //         "ibc/517E13F14A1245D4DE8CF467ADD4DA0058974CDCC880FA6AE536DBCA1D16D84E",
  //     },
  //   },
  //   dao_interface: {
  //     alliance: {
  //       addr: "terra1jwyzzsaag4t0evnuukc35ysyrx9arzdde2kg9cld28alhjurtthq0prs2s",
  //     },
  //   },
  // },
  mainnet: <InstantiateMsg>{
    denom: "ampCAPA",
    protocol_fee_contract: "terra1rgggsspquaxjp4lmegx7a3q4l9lg44hnu7rjxa",
    protocol_reward_fee: "0.05",
    owner: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
    operator: "terra1gtuvt6eh4m67tvd2dnfqhgks9ec6ff08c5vlup",
    utoken: {
      token: {
        contract_addr:
          "terra1t4p3u8khpd7f8qzurwyafxt648dya6mp6vur3vaapswt6m24gkuqrfdhar",
      },
    },
    dao_interface: {
      capa: {
        gov: "terra1sf66d5vap897xlvv2hlcp4l20y4pp42r6ala4snk8mgd246jvufqwe0cnm",
      },
    },
  },

  // migaloo: <InstantiateMsg>{
  //   denom: "ampUSDC",
  //   protocol_fee_contract:
  //     "migaloo17w97atfwdnjpe6wywwsjjw09050aq9s78jjjsmrmhhqtg7nevpmq0u8t9v",
  //   protocol_reward_fee: "0.069",
  //   owner: "migaloo1dpaaxgw4859qhew094s87l0he8tfea3lf74c2y",
  //   operator: "migaloo1c023jxq099et7a44ledfwuu3sdkfq8caya90nk",

  //   utoken: {
  //     token: {
  //       contract_addr:
  //         "migaloo10nucfm2zqgzqmy7y7ls398t58pjt9cwjsvpy88y2nvamtl34rgmqt5em2v",
  //     },
  //   },
  //   dao_interface: {
  //     alliance: {
  //       addr: "migaloo190qz7q5fu4079svf890h4h3f8u46ty6cxnlt78eh486k9qm995hquuv9kd",
  //     },
  //   },
  // },
  // migaloo: <InstantiateMsg>{
  //   denom: "ampASH",
  //   protocol_fee_contract:
  //     "migaloo17w97atfwdnjpe6wywwsjjw09050aq9s78jjjsmrmhhqtg7nevpmq0u8t9v",
  //   protocol_reward_fee: "0.069",
  //   owner: "migaloo1dpaaxgw4859qhew094s87l0he8tfea3lf74c2y",
  //   operator: "migaloo1c023jxq099et7a44ledfwuu3sdkfq8caya90nk",

  //   utoken: {
  //     native_token: {
  //       denom:
  //         "factory/migaloo1erul6xyq0gk6ws98ncj7lnq9l4jn4gnnu9we73gdz78yyl2lr7qqrvcgup/ash",
  //     },
  //   },
  //   dao_interface: {
  //     alliance: {
  //       addr: "migaloo190qz7q5fu4079svf890h4h3f8u46ty6cxnlt78eh486k9qm995hquuv9kd",
  //     },
  //   },
  // },
  migaloo: <InstantiateMsg>{
    denom: "ampGASH",
    protocol_fee_contract:
      "migaloo17w97atfwdnjpe6wywwsjjw09050aq9s78jjjsmrmhhqtg7nevpmq0u8t9v",
    protocol_reward_fee: "0.069",
    owner: "migaloo1dpaaxgw4859qhew094s87l0he8tfea3lf74c2y",
    operator: "migaloo1c023jxq099et7a44ledfwuu3sdkfq8caya90nk",

    utoken: {
      native_token: {
        denom:
          "factory/migaloo1r9x8fz4alekzr78k42rpmr9unpa7egsldpqeynmwl2nfvzexue9sn8l5rg/gash",
      },
    },
    dao_interface: {
      alliance: {
        addr: "migaloo190qz7q5fu4079svf890h4h3f8u46ty6cxnlt78eh486k9qm995hquuv9kd",
      },
    },
  },
};

// Terra
// ts-node amp-governance/1_upload_contracts.ts --network mainnet --key mainnet --contracts eris_alliance_hub_lst_terra --folder contracts-dao-lst
// ts-node 2_deploy_alliance_hub_tokenfactory.ts --network mainnet --key mainnet --hub-code-id 1913
// eris_alliance_hub_lst_terra: 1913
// ampWHALE terra1j35ta0llaxcf55auv2cjqau5a7aee6g8fz7md7my7005cvh23jfsaw83dy
// boneWHALE terra10j3zrymfrkta2pxe0gklc79gu06tqyuy8c3kh6tqdsrrprsjqkrqzfl4df

// ts-node 15_change_admin.ts --network mainnet --key mainnet --contract-address terra1j35ta0llaxcf55auv2cjqau5a7aee6g8fz7md7my7005cvh23jfsaw83dy --new-admin terra1q0vny4wx2pfteh9zq323wh48c654xacpfq5tew
// ts-node 15_change_admin.ts --network mainnet --key mainnet --contract-address terra10j3zrymfrkta2pxe0gklc79gu06tqyuy8c3kh6tqdsrrprsjqkrqzfl4df --new-admin terra1q0vny4wx2pfteh9zq323wh48c654xacpfq5tew

// ts-node amp-governance/1_upload_contracts.ts --network mainnet --key mainnet --contracts eris_alliance_hub_lst_terra --folder contracts-dao-lst --migrates terra1j35ta0llaxcf55auv2cjqau5a7aee6g8fz7md7my7005cvh23jfsaw83dy

// ampwhalet: ts-node amp-governance/1_upload_contracts.ts --network mainnet --key mainnet --key-migrate ledger --contracts eris_alliance_hub_lst_terra --folder contracts-dao-lst --migrates terra1j35ta0llaxcf55auv2cjqau5a7aee6g8fz7md7my7005cvh23jfsaw83dy
// boneWhale: ts-node amp-governance/1_upload_contracts.ts --network mainnet --key mainnet --key-migrate ledger --contracts eris_alliance_hub_lst_terra --folder contracts-dao-lst --code-id 2790 --migrates terra10j3zrymfrkta2pxe0gklc79gu06tqyuy8c3kh6tqdsrrprsjqkrqzfl4df
// 1927 -> 2038 -> 2040 -> 2790

// CAPA 2042 -> terra186rpfczl7l2kugdsqqedegl4es4hp624phfc7ddy8my02a4e8lgq5rlx7y
// ts-node amp-governance/1_upload_contracts.ts --network mainnet --key mainnet --contracts eris_alliance_hub_lst_terra --folder contracts-dao-lst
// ts-node 2_deploy_alliance_hub_tokenfactory.ts --network mainnet --key mainnet --hub-code-id 2042

// Migaloo
// ts-node amp-governance/1_upload_contracts.ts --network migaloo --key key-mainnet --contracts eris_alliance_hub_lst_whitewhale --folder contracts-dao-lst --migrates migaloo1cwk3hg5g0rz32u6us8my045ge7es0jnmtfpwt50rv6nagk5aalasa733pt
// ts-node 2_deploy_alliance_hub_tokenfactory.ts --network migaloo --key key-mainnet --hub-code-id 220 --label "ERIS Amplified USDC Hub"
// ts-node 2_deploy_alliance_hub_tokenfactory.ts --network migaloo --key key-mainnet --hub-code-id 220 --label "ERIS Amplified ASH Hub"
// ts-node 2_deploy_alliance_hub_tokenfactory.ts --network migaloo --key key-mainnet --hub-code-id 626 --label "ERIS Amplified gASH Hub"
// ampUSDC -> 220 -> 525 -> migaloo1cwk3hg5g0rz32u6us8my045ge7es0jnmtfpwt50rv6nagk5aalasa733pt
// ampASH -> 220 -> 525 -> migaloo1cmcnld5q4z9nltml664nuxthcrz5r9vpfv0efgadxj4pwl3ry8yq26nk76
// ampGASH -> 626 -> migaloo1nsskhvvh0msm7d5ke2kfg24a8d4jecsnxd28s27h0uz5kf9ap60shlqmcl

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
    msg = templates[argv["network"] as Chains];
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
