import { MsgMigrateContract, Wallet } from "@terra-money/feather.js";
import * as path from "path";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
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
    "key-dir": {
      type: "string",
      demandOption: false,
      default: keystore.DEFAULT_KEY_DIR,
    },
    contracts: {
      type: "array",
      demandOption: true,
    },
    migrates: {
      type: "array",
    },
    folder: {
      type: "string",
      default: "contracts-terra",
    },
  })
  .parseSync();

// TESTNET
// DO NOT FORGET THE RIGHT PERIOD TIME FRAME
// ts-node amp-governance/1_upload_contracts.ts --network testnet --key testnet --contracts eris_gov_voting_escrow eris_gov_amp_gauges eris_gov_prop_gauges
// ts-node amp-governance/1_upload_contracts.ts --network testnet --key testnet --contracts eris_gov_amp_gauges
// ts-node amp-governance/1_upload_contracts.ts --network testnet --key testnet --contracts eris_staking_hub eris_gov_prop_gauges
// ts-node amp-governance/1_upload_contracts.ts --network testnet --key testnet --contracts eris_gov_emp_gauges
// ts-node amp-governance/1_upload_contracts.ts --network testnet --key testnet --contracts eris_gov_voting_escrow eris_gov_amp_gauges
// ts-node amp-governance/1_upload_contracts.ts --network testnet --key testnet --contracts eris_gov_prop_gauges

// eris_gov_voting_escrow: 6603 terra15h6tu0qxx542rs0njefujw5mjag3gfc0d3seruydhvs6z07ftz6s6uuwdp
// eris_gov_emp_gauges: 5543 terra14s88p4t7uxqdf96vgsnqavx68lzgpcp3dy505hlywjm2tm9p97ms0ks83a
// eris_gov_amp_gauges: 5527 terra1a507lxc7sztyfu8az5np54t6w86nhv2a0n2q5y858jf9ms5t5rsqh648jt
// eris_staking_hub: 5535 terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88
// eris_gov_prop_gauges: 7018 terra1xvef2n7kky4ffzg6yl0rrej9j9d6prdgn79na7yxzcy006znkqwsrztmg5

// Migrate
// escrow: ts-node 3_migrate.ts --network testnet --key testnet --key-migrate testnet --code-id 7768 --contract-address terra15h6tu0qxx542rs0njefujw5mjag3gfc0d3seruydhvs6z07ftz6s6uuwdp
// empgau: ts-node 3_migrate.ts --network testnet --key testnet --key-migrate testnet --code-id 6995 --contract-address terra14s88p4t7uxqdf96vgsnqavx68lzgpcp3dy505hlywjm2tm9p97ms0ks83a
// ampgau: ts-node 3_migrate.ts --network testnet --key testnet --key-migrate testnet --code-id 7769 --contract-address terra1a507lxc7sztyfu8az5np54t6w86nhv2a0n2q5y858jf9ms5t5rsqh648jt
// stakin: ts-node 3_migrate.ts --network testnet --key testnet --key-migrate testnet --code-id 7771 --contract-address terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88
// propga: ts-node 3_migrate.ts --network testnet --key testnet --key-migrate testnet --code-id 7770 --contract-address terra1xvef2n7kky4ffzg6yl0rrej9j9d6prdgn79na7yxzcy006znkqwsrztmg5

// ampLUNA
// eris_gov_voting_escrow:  7768 terra185fzsf0e247dsa9npuc0kdn8ef3ht2q5rwedle43h3q5ymjmvs2qkvdp3f
// eris_gov_emp_gauges:
// eris_gov_amp_gauges:     7769 terra1rpa66hlslyy9jl6hxkufv83eyje2lx6022569k497ytjf7nvm7hqu3wndk
// eris_staking_hub:        7771 terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88
// eris_gov_prop_gauges:    7770 terra1ut233rtsdjkdf775xq866tdvjkuazmgsyrh5n9l8ac9qpuj6sd3sr8a0q7

// TERRA  TESTNET
// ts-node amp-governance/1_upload_contracts.ts --network testnet --key testnet --contracts eris_staking_hub --migrates terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88

// classic
// ts-node 1_upload_contracts.ts --network classic --key mainnet --folder contracts-terra-classic --contracts eris_staking_hub_classic
// eris_staking_hub_classic: 6370

// TERRA MAINNET
// ts-node amp-governance/1_upload_contracts.ts --network mainnet --key invest --contracts eris_gov_voting_escrow eris_gov_amp_gauges eris_gov_prop_gauges
// ts-node amp-governance/1_upload_contracts.ts --network mainnet --key invest --folder contracts-terra --contracts eris_generator_proxy
// staking:
//   ts-node amp-governance/1_upload_contracts.ts --network mainnet --key invest --contracts eris_staking_hub
//   1160
// voting-escrow:
//   ts-node amp-governance/1_upload_contracts.ts --network mainnet --key invest --contracts eris_gov_voting_escrow
//   1162
//   terra1ep7exp42jjtwgjly36y4vgylz82fplnjwpkz95wljzwfald8zwwqggsdzz
// amp-gauge:
//   ts-node amp-governance/1_upload_contracts.ts --network mainnet --key invest --contracts eris_gov_amp_gauges
//   1163
//   terra1aumv9uyv2ltf8upsf88338ctf922q439a0v2tpss5s2j9g0j8zzsrtq9t2
// prop-gauges:
//   ts-node amp-governance/1_upload_contracts.ts --network mainnet --key invest --contracts eris_gov_prop_gauges
//   1164
//   terra1z0cxlq62a9dsjhz7g7hhgpuplcl32c0qeckhm9jyggln0rxq6z8syesq8j

// admin terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl
// guardian

// stakin: ts-node amp-governance/1_upload_contracts.ts --network mainnet --key invest --folder contracts-terra --contracts eris_generator_proxy

// ts-node amp-governance/1_upload_contracts.ts --network mainnet --key mainnet --folder contracts-terra --contracts eris_fees_collector
// ts-node 3_migrate.ts --network mainnet --key mainnet --key-migrate ledger --code-id 1122 --contract-address terra1v3h5lejqer5qnjnj6gds94u55x0qsxq7cpxs2kf7kqu6drwgmz4qd9qav9

// KUJIRA TESTNET
// ts-node amp-governance/1_upload_contracts.ts --network testnet-kujira --key mainnet-kujira --folder contracts-tokenfactory --contracts eris_staking_hub_tokenfactory
// ts-node 3_migrate.ts --network testnet-kujira --key mainnet-kujira --key-migrate mainnet-kujira --code-id 1372 --contract-address kujira1hf3898lecj8lawxq8nwqczegrla9denzfkx4asjg0q27cyes44sq68gvc9
// kujira1hf3898lecj8lawxq8nwqczegrla9denzfkx4asjg0q27cyes44sq68gvc9 -- 1372

// WHITEWHALE TESTNET
//
// ts-node amp-governance/1_upload_contracts.ts --network testnet-migaloo --key testnet-migaloo --folder contracts-whitewhale --contracts eris_staking_hub
// ts-node 3_migrate.ts --network testnet-migaloo --key testnet-migaloo --key-migrate testnet-migaloo --code-id 13 --contract-address migaloo1r0krq4hfttfuyd4tvcqnjk887xqeq0xae3u4qtya35qsfqy2trlqxavmra

async function uploadCode(deployer: Wallet, path: string) {
  await waitForConfirm(`Upload code ${path}?`);
  const codeId = await storeCodeWithConfirm(deployer, path, false);
  console.log(`Code uploaded! ID: ${codeId}`);
  return codeId;
}

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const ids = [];

  if (
    argv.migrates &&
    argv.contracts &&
    argv.migrates.length !== argv.contracts.length
  ) {
    throw new Error("Invalid parameters, need to be same length as contracts");
  }

  let index = 0;
  for (const contract of argv.contracts) {
    const fullPath = `../${argv.folder}/artifacts/${contract}.wasm`;
    const codeId = await uploadCode(deployer, path.resolve(fullPath));
    ids.push(`${contract}: ${codeId}`);
    console.log(ids);

    const migrate = argv.migrates && argv.migrates[index];
    if (migrate && typeof migrate === "string") {
      const { txhash } = await sendTxWithConfirm(deployer, [
        new MsgMigrateContract(
          deployer.key.accAddress(getPrefix()),
          migrate,
          codeId,
          {}
        ),
      ]);
      console.log(`Contract migrated! Txhash: ${txhash}`);
    }

    index++;
  }
})();
