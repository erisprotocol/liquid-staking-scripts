import { Wallet } from "@terra-money/feather.js";
import * as path from "path";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  storeCodeWithConfirm,
  waitForConfirm
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
    folder: {
      type: "string",
      default: "liquid-staking-contracts",
    },
  })
  .parseSync();

// TESTNET
// DO NOT FORGET THE RIGHT PERIOD TIME FRAME
// ts-node amp-governance/1_upload_contracts.ts --network testnet --key testnet --contracts eris_gov_voting_escrow eris_gov_emp_gauges eris_gov_amp_gauges eris_staking_hub
// ts-node amp-governance/1_upload_contracts.ts --network testnet --key testnet --contracts eris_gov_amp_gauges
// ts-node amp-governance/1_upload_contracts.ts --network testnet --key testnet --contracts eris_staking_hub
// ts-node amp-governance/1_upload_contracts.ts --network testnet --key testnet --contracts eris_gov_emp_gauges
// ts-node amp-governance/1_upload_contracts.ts --network testnet --key testnet --contracts eris_gov_voting_escrow eris_gov_amp_gauges

// eris_gov_voting_escrow: 6603 terra15h6tu0qxx542rs0njefujw5mjag3gfc0d3seruydhvs6z07ftz6s6uuwdp
// eris_gov_emp_gauges: 5543 terra14s88p4t7uxqdf96vgsnqavx68lzgpcp3dy505hlywjm2tm9p97ms0ks83a
// eris_gov_amp_gauges: 5527 terra1a507lxc7sztyfu8az5np54t6w86nhv2a0n2q5y858jf9ms5t5rsqh648jt
// eris_staking_hub: 5535 terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88

// Migrate
// escrow: ts-node 3_migrate.ts --network testnet --key testnet --key-migrate testnet --code-id 6612 --contract-address terra15h6tu0qxx542rs0njefujw5mjag3gfc0d3seruydhvs6z07ftz6s6uuwdp
// empgau: ts-node 3_migrate.ts --network testnet --key testnet --key-migrate testnet --code-id 6615 --contract-address terra14s88p4t7uxqdf96vgsnqavx68lzgpcp3dy505hlywjm2tm9p97ms0ks83a
// ampgau: ts-node 3_migrate.ts --network testnet --key testnet --key-migrate testnet --code-id 6636 --contract-address terra1a507lxc7sztyfu8az5np54t6w86nhv2a0n2q5y858jf9ms5t5rsqh648jt
// stakin: ts-node 3_migrate.ts --network testnet --key testnet --key-migrate ledger --code-id 6616 --contract-address terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88

// classic
// ts-node 1_upload_contracts.ts --network classic --key mainnet --folder contracts-terra-classic --contracts eris_staking_hub_classic
// eris_staking_hub_classic: 6370

// mainnet

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

  for (const contract of argv.contracts) {
    const fullPath = `../${argv.folder}/artifacts/${contract}.wasm`;
    const codeId = await uploadCode(deployer, path.resolve(fullPath));
    ids.push(`${contract}: ${codeId}`);
    console.log(ids);
  }
})();
