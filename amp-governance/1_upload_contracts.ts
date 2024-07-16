import { MsgMigrateContract, Wallet } from "@terra-money/feather.js";
import * as path from "path";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  delayPromise,
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
    "key-migrate": {
      type: "string",
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
    "code-id": {
      type: "array",
    },
    migrates: {
      type: "array",
    },
    migratesAll: {
      type: "boolean",
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
// stakin: ts-node 3_migrate.ts --network testnet --key testnet --key-migrate testnet --code-id 8001 --contract-address terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88
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
//   1160 -> 1257
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

// WHITEWHALE TESTNET
//
// ts-node amp-governance/1_upload_contracts.ts --network testnet-migaloo --key testnet-migaloo --folder contracts-whitewhale --contracts eris_staking_hub
// ts-node 3_migrate.ts --network testnet-migaloo --key testnet-migaloo --key-migrate testnet-migaloo --code-id 13 --contract-address migaloo1r0krq4hfttfuyd4tvcqnjk887xqeq0xae3u4qtya35qsfqy2trlqxavmra

// MIGALOO
// eris_gov_voting_escrow.wasm: 14, migaloo1hntfu45etpkdf8prq6p6la9tsnk3u3muf5378kds73c7xd4qdzysuv567q
// eris_gov_amp_gauges.wasm: 15, migaloo14haqsatfqxh3jgzn6u7ggnece4vhv0nt8a8ml4rg29mln9hdjfdqpz474l
// eris_gov_prop_gauges.wasm: 16 migaloo1j2x4vsm2a5qefkvgr7gl30gf2puvsa504plzwgdhwl3wvm5lxayquvvsfq

// ARCHWAY TESTNET
// ts-node amp-governance/1_upload_contracts.ts --network archwaytest --key mainnet-archway --contracts eris_gov_voting_escrow eris_gov_amp_gauges eris_gov_prop_gauges
// 'eris_gov_voting_escrow: 199', archway1kmg5j6tkc5k9dj0x042y8k0pn5clu6pdfddq0glrl8agxuy2we0scqr324
// 'eris_gov_amp_gauges: 200', archway1ntne4eyrydxd2a80qnnggv6cj5aag60azfc2d52reytj6f8js4ns4rcwea
// 'eris_gov_prop_gauges: 201', archway16rnpysnujmp58qtd4xquxpqs3ht3h0290za7hjtztn0p7llseups8dug8q

// JUNO
// ts-node amp-governance/1_upload_contracts.ts --network juno --key key-mainnet --contracts eris_gov_voting_escrow eris_gov_amp_gauges eris_gov_prop_gauges
// owner juno1dpaaxgw4859qhew094s87l0he8tfea3ljcleck
// hub juno17cya4sw72h4886zsm2lk3udxaw5m8ssgpsl6nd6xl6a4ukepdgkqeuv99x
// token juno1a0khag6cfzu5lrwazmyndjgvlsuk7g4vn9jd8ceym8f4jf6v2l9q6d348a
// 'eris_gov_voting_escrow: 3397', juno1s74s5wssxamuh37nqu3gus9m6l77mvh2d9urq9slmxfh3nh5seyqpze8w5
// 'eris_gov_amp_gauges: 3398', juno1c4npgrxu9d9rrxrkd2xtgl8jhz3zsetq0y2mwvxhfvyggrmmvk8qkvw09e
// 'eris_gov_prop_gauges: 3399' juno1l548zam9r7j89agyptrhnn9q9f92w0a7ja5c76vkmx9sreqfz69qq688rl

// KUJIRA TESTNET
// ts-node amp-governance/1_upload_contracts.ts --network testnet-kujira --key mainnet-kujira --folder contracts-tokenfactory --contracts eris_staking_hub_tokenfactory
// ts-node 3_migrate.ts --network testnet-kujira --key mainnet-kujira --key-migrate mainnet-kujira --code-id 1372 --contract-address kujira1hf3898lecj8lawxq8nwqczegrla9denzfkx4asjg0q27cyes44sq68gvc9
// kujira1hf3898lecj8lawxq8nwqczegrla9denzfkx4asjg0q27cyes44sq68gvc9 -- 1372

// ts-node amp-governance/1_upload_contracts.ts --network testnet-kujira --key mainnet-kujira --folder contracts-dao-lst --contracts eris_dao_lst_kujira eris_gov_voting_escrow eris_gov_prop_gauges
// ts-node dao-lst/deploy_dao_lst.ts --network testnet-kujira --key key-mainnet --hub-code-id 2489
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

async function uploadCode(deployer: Wallet, path: string) {
  await waitForConfirm(`Upload code ${path}?`);
  const codeId = await storeCodeWithConfirm(deployer, path, false);
  console.log(`Code uploaded! ID: ${codeId}`);
  return codeId;
}

(async function () {
  const terra = createLCDClient(argv["network"]);

  const admin = await createWallet(
    terra,
    argv["key-migrate"] || argv.key,
    argv["key-dir"]
  );

  const ids = [];

  if (
    argv.migrates &&
    argv.contracts &&
    argv.migrates.length !== argv.contracts.length &&
    !argv.migratesAll
  ) {
    throw new Error("Invalid parameters, need to be same length as contracts");
  }

  let index = 0;
  const upload =
    argv["key"] === (argv["key-migrate"] ?? argv.key)
      ? admin
      : await createWallet(terra, argv["key"], argv["key-dir"]);

  console.log(`Account upload: ${admin.key.accAddress(getPrefix())}`);
  console.log(`Account migrate: ${upload.key.accAddress(getPrefix())}`);
  for (const contract of argv.contracts) {
    const fullPath = `../${argv.folder}/artifacts/${contract}.wasm`;
    console.log("CODEID", argv["code-id"]);
    const codeId =
      (argv["code-id"] && +argv["code-id"][index]) ??
      (await uploadCode(upload, path.resolve(fullPath)));
    ids.push(`${contract}: ${codeId}`);
    console.log(ids);

    await delayPromise(1000);

    if (argv.migratesAll) {
      const migrates = argv.migrates ?? [];
      const { txhash } = await sendTxWithConfirm(
        admin,
        migrates.map(
          (migrate) =>
            new MsgMigrateContract(
              admin.key.accAddress(getPrefix()),
              migrate.toString(),
              codeId,
              {}
            )
        )
      );
      console.log(`Contract migrated! Txhash: ${txhash}`);
    } else {
      const migrate = argv.migrates && argv.migrates[index];
      if (migrate && typeof migrate === "string") {
        const { txhash } = await sendTxWithConfirm(admin, [
          new MsgMigrateContract(
            admin.key.accAddress(getPrefix()),
            migrate,
            codeId,
            {}
          ),
        ]);
        console.log(`Contract migrated! Txhash: ${txhash}`);
      }
    }

    index++;
  }
})();
