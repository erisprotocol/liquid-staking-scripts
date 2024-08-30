import { TxLog } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  Chains,
  createLCDClient,
  createWallet,
  getPrefix,
  instantiateWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { InstantiateMsg } from "../types/prop_gauges/eris_gov_prop_gauges_instantiate";

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
      default: "Prop Gauge",
    },
  })
  .parseSync();

// Testnet
// ts-node amp-governance/4_instantiate_propgauges.ts --network testnet --key testnet --contract-code-id 7770 --label "Proposal Gauge"

// Mainnet
// ts-node amp-governance/4_instantiate_propgauges.ts --network mainnet --key ledger --contract-code-id 1164 --label "Prop Gauge"

// MIGALOO
// ts-node amp-governance/4_instantiate_propgauges.ts --network migaloo --key mainnet-migaloo --contract-code-id 16 --label "Prop Gauge"

// ts-node amp-governance/4_instantiate_propgauges.ts --network archwaytest --key mainnet-archway --contract-code-id 201 --label "Prop Gauge"
// ts-node amp-governance/4_instantiate_propgauges.ts --network archway --key mainnet-archway --contract-code-id 41 --label "Prop Gauge"
// ts-node amp-governance/4_instantiate_propgauges.ts --network osmosis --key mainnet-osmosis --contract-code-id 107 --label "Prop Gauge"
// ts-node amp-governance/4_instantiate_propgauges.ts --network juno --key key-mainnet --contract-code-id 3399 --label "Prop Gauge"

const templates: Partial<Record<Chains, InstantiateMsg>> = {
  // testnet: <InstantiateMsg>{
  //   hub_addr:
  //     "terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88",
  //   owner: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
  //   // validators_limit: 5,
  //   escrow_addr:
  //     "terra15h6tu0qxx542rs0njefujw5mjag3gfc0d3seruydhvs6z07ftz6s6uuwdp",

  //   quorum_bps: 1000,
  // },
  testnet: <InstantiateMsg>{
    hub_addr:
      "terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88",
    owner: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
    // validators_limit: 5,
    escrow_addr:
      "terra185fzsf0e247dsa9npuc0kdn8ef3ht2q5rwedle43h3q5ymjmvs2qkvdp3f",

    quorum_bps: 1000,
    use_weighted_vote: true,
  },
  // mainnet: <InstantiateMsg>{
  //   hub_addr:
  //     "terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk",
  //   owner: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
  //   // ampLUNA Escrow
  //   escrow_addr:
  //     "terra1ep7exp42jjtwgjly36y4vgylz82fplnjwpkz95wljzwfald8zwwqggsdzz",
  //   quorum_bps: 1000,
  //   use_weighted_vote: true,
  // },
  mainnet: <InstantiateMsg>{
    hub_addr:
      "terra1vklefn7n6cchn0u962w3gaszr4vf52wjvd4y95t2sydwpmpdtszsqvk9wy",
    owner: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
    // ampLUNA Escrow
    escrow_addr:
      "terra1q33xvxt03ds6rsrk9p7dzaz4540s5q995gmt8dp3u47smaw292jqrmpxgd",
    quorum_bps: 1000,
  },
  migaloo: <InstantiateMsg>{
    hub_addr:
      "migaloo1436kxs0w2es6xlqpp9rd35e3d0cjnw4sv8j3a7483sgks29jqwgshqdky4",
    owner: "migaloo1dpaaxgw4859qhew094s87l0he8tfea3lf74c2y",
    // ampLUNA Escrow
    escrow_addr:
      "migaloo1hntfu45etpkdf8prq6p6la9tsnk3u3muf5378kds73c7xd4qdzysuv567q",
    quorum_bps: 1000,
    use_weighted_vote: true,
  },
  osmosis: <InstantiateMsg>{
    hub_addr: "osmo1dv8wz09tckslr2wy5z86r46dxvegylhpt97r9yd6qc3kyc6tv42qa89dr9",
    owner: "osmo1ugmmclpunq08v4uwj2q2knr9e3uveakwxfx9pq",
    escrow_addr:
      "osmo1vcg9a7zwfeuqwtkya5l34tdgzxnafdzpe22ahphd02uwed43wnfs3wtf8a",
    quorum_bps: 1000,
    use_weighted_vote: true,
  },
  // inj1qjewg2xd0vc7q9wzrt35vy54uxlz0t6w0xn3hz
  // injective: <InstantiateMsg>{
  //   hub_addr: "inj1cdwt8g7nxgtg2k4fn8sj363mh9ahkw2qt0vrnc",
  //   owner: "inj1rnh5c7emgt2g9s2ezg6km7lylyxyddq5jjnjav",
  //   escrow_addr: "inj1yp0lgxq460ked0egtzyj2nck3mdhr8smfmteh5",
  //   quorum_bps: 1000,
  //   use_weighted_vote: true,
  // },

  archwaytest: <InstantiateMsg>{
    hub_addr:
      "archway102t7f76edspqrpvqq7xe93uk5q7uhknqccrxa73va0knjyupd2ksexhhky",
    owner: "archway1dpaaxgw4859qhew094s87l0he8tfea3l3pqx4a",
    // ampLUNA Escrow
    escrow_addr:
      "archway1kmg5j6tkc5k9dj0x042y8k0pn5clu6pdfddq0glrl8agxuy2we0scqr324",
    quorum_bps: 1000,
    use_weighted_vote: true,
  },
  archway: <InstantiateMsg>{
    hub_addr:
      "archway1yg4eq68xyll74tdrrcxkr4qpam4j9grknunmp74zzc6km988dadqy0utmj",
    owner: "archway1dpaaxgw4859qhew094s87l0he8tfea3l3pqx4a",
    // ampLUNA Escrow
    escrow_addr:
      "archway16eu995d6pkhjkhs5gst4c8f7z07qpw8d6u36ejq9nmap27qxz2fqk2w9wu",
    quorum_bps: 1000,
    use_weighted_vote: true,
  },
  juno: <InstantiateMsg>{
    hub_addr: "juno17cya4sw72h4886zsm2lk3udxaw5m8ssgpsl6nd6xl6a4ukepdgkqeuv99x",
    owner: "juno1dpaaxgw4859qhew094s87l0he8tfea3ljcleck",
    // ampLUNA Escrow
    escrow_addr:
      "juno1s74s5wssxamuh37nqu3gus9m6l77mvh2d9urq9slmxfh3nh5seyqpze8w5",
    quorum_bps: 1000,
    use_weighted_vote: true,
  },
  sei: <InstantiateMsg>{
    hub_addr: "sei1x2fgaaqecvk8kwuqkjqcj27clw5p5g99uawdzy9sc4rku8avumcq3cky4k",
    owner: "sei1dpaaxgw4859qhew094s87l0he8tfea3lfxd5et",
    escrow_addr:
      "sei1jkntjf038jtwzs7zefuyt35v6esv2ht986p4m8rrcfm9xtafphqq8gtw8w",
    quorum_bps: 1000,
    use_weighted_vote: true,
  },
  "testnet-kujira": <InstantiateMsg>{
    hub_addr:
      "kujira1n8yke2vzsqe3h67h42yh66360q7pe67zwer8rvzjkttr2wqffnes56q9jj",
    owner: "kujira1dpaaxgw4859qhew094s87l0he8tfea3l4z76jq",
    escrow_addr:
      "kujira1mgn3ft0vsfsfgjt8tcjn3pjh3zecsmanay7ummnyef6cvgg2xa2qtj7v63",
    quorum_bps: 1000,
  },
  nibiru: <InstantiateMsg>{
    hub_addr: "nibi1udqqx30cw8nwjxtl4l28ym9hhrp933zlq8dqxfjzcdhvl8y24zcqpzmh8m",
    owner: "nibi1dpaaxgw4859qhew094s87l0he8tfea3ln0cmke",
    escrow_addr:
      "nibi1us4rh4a9rexvde8l3m8f8nlz6wcf9qg57zk2w06kqkm4vtp96vkst9kuwd",
    quorum_bps: 1000,
    use_weighted_vote: true,
  },
};

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const msg = templates[argv["network"] as Chains];

  const result = await instantiateWithConfirm(
    deployer,
    deployer.key.accAddress(getPrefix()),
    argv.contractCodeId,
    msg!,
    argv.label
  );

  const addresses = result.logs.map(
    (a: TxLog) => a.eventsByType["instantiate"]["_contract_address"][0]
  );

  console.log(`Contract instantiated! Address: ${addresses}`);
})();
