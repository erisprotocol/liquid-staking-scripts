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
import { InstantiateMsg } from "../types/amp_gauges/eris_gov_amp_gauges_instantiate";

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
// ts-node amp-governance/4_instantiate_ampgauges.ts --network testnet --key testnet --contract-code-id 7769 --label "vAMP Gauge"
//

// Mainnet
// ts-node amp-governance/4_instantiate_ampgauges.ts --network mainnet --key ledger --contract-code-id 1163  --label "vAMP ampLUNA Gauge"
// terra1aumv9uyv2ltf8upsf88338ctf922q439a0v2tpss5s2j9g0j8zzsrtq9t2

// MIGALOO
// ts-node amp-governance/4_instantiate_ampgauges.ts --network migaloo --key mainnet-migaloo --contract-code-id 15  --label "vAMP Gauge"

// ts-node amp-governance/4_instantiate_ampgauges.ts --network archwaytest --key mainnet-archway --contract-code-id 200  --label "vAMP Gauge"
// ts-node amp-governance/4_instantiate_ampgauges.ts --network archway --key mainnet-archway --contract-code-id 40  --label "vAMP Gauge"
// ts-node amp-governance/4_instantiate_ampgauges.ts --network osmosis --key mainnet-osmosis --contract-code-id 106  --label "vAMP Gauge"
// ts-node amp-governance/4_instantiate_ampgauges.ts --network juno --key key-mainnet --contract-code-id 3398  --label "vAMP Gauge"

const templates: Partial<Record<Chains, InstantiateMsg>> = {
  // testnet: <InstantiateMsg>{
  //   hub_addr:
  //     "terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88",
  //   owner: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
  //   validators_limit: 5,
  //   escrow_addr:
  //     "terra15h6tu0qxx542rs0njefujw5mjag3gfc0d3seruydhvs6z07ftz6s6uuwdp",
  // },
  testnet: <InstantiateMsg>{
    hub_addr:
      "terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88",
    owner: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
    validators_limit: 30,
    // ampLUNA Escrow
    escrow_addr:
      "terra185fzsf0e247dsa9npuc0kdn8ef3ht2q5rwedle43h3q5ymjmvs2qkvdp3f",
  },
  mainnet: <InstantiateMsg>{
    hub_addr:
      "terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk",
    owner: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
    validators_limit: 30,
    // ampLUNA Escrow
    escrow_addr:
      "terra1ep7exp42jjtwgjly36y4vgylz82fplnjwpkz95wljzwfald8zwwqggsdzz",
  },
  migaloo: <InstantiateMsg>{
    hub_addr:
      "migaloo1436kxs0w2es6xlqpp9rd35e3d0cjnw4sv8j3a7483sgks29jqwgshqdky4",
    owner: "migaloo1dpaaxgw4859qhew094s87l0he8tfea3lf74c2y",
    validators_limit: 30,
    // ampLUNA Escrow
    escrow_addr:
      "migaloo1hntfu45etpkdf8prq6p6la9tsnk3u3muf5378kds73c7xd4qdzysuv567q",
  },
  osmosis: <InstantiateMsg>{
    hub_addr: "osmo1dv8wz09tckslr2wy5z86r46dxvegylhpt97r9yd6qc3kyc6tv42qa89dr9",
    owner: "osmo1dpaaxgw4859qhew094s87l0he8tfea3lv30jfc",
    validators_limit: 30,
    escrow_addr:
      "osmo1vcg9a7zwfeuqwtkya5l34tdgzxnafdzpe22ahphd02uwed43wnfs3wtf8a",
  },
  // inj17w7hjaqf6qc3zp3r68q3sq3jezsg4tr3g7e0n2
  // injective: <InstantiateMsg>{
  //   hub_addr: "inj1cdwt8g7nxgtg2k4fn8sj363mh9ahkw2qt0vrnc",
  //   owner: "inj1rnh5c7emgt2g9s2ezg6km7lylyxyddq5jjnjav",
  //   validators_limit: 30,
  //   escrow_addr: "inj1yp0lgxq460ked0egtzyj2nck3mdhr8smfmteh5",
  // },

  archwaytest: {
    hub_addr:
      "archway102t7f76edspqrpvqq7xe93uk5q7uhknqccrxa73va0knjyupd2ksexhhky",
    owner: "archway1dpaaxgw4859qhew094s87l0he8tfea3l3pqx4a",
    validators_limit: 30,
    escrow_addr:
      "archway1kmg5j6tkc5k9dj0x042y8k0pn5clu6pdfddq0glrl8agxuy2we0scqr324",
  },

  // ampTOKEN archway1fwurjg7ah4v7hhs6xsc3wutqpvmahrfhns285s0lt34tgfdhplxq6m8xg5
  // hub archway1yg4eq68xyll74tdrrcxkr4qpam4j9grknunmp74zzc6km988dadqy0utmj
  archway: {
    hub_addr:
      "archway1yg4eq68xyll74tdrrcxkr4qpam4j9grknunmp74zzc6km988dadqy0utmj",
    owner: "archway1dpaaxgw4859qhew094s87l0he8tfea3l3pqx4a",
    validators_limit: 30,
    escrow_addr:
      "archway16eu995d6pkhjkhs5gst4c8f7z07qpw8d6u36ejq9nmap27qxz2fqk2w9wu",
  },
  juno: {
    hub_addr: "juno17cya4sw72h4886zsm2lk3udxaw5m8ssgpsl6nd6xl6a4ukepdgkqeuv99x",
    owner: "juno1dpaaxgw4859qhew094s87l0he8tfea3ljcleck",
    validators_limit: 30,
    escrow_addr:
      "juno1s74s5wssxamuh37nqu3gus9m6l77mvh2d9urq9slmxfh3nh5seyqpze8w5",
  },
  sei: <InstantiateMsg>{
    hub_addr: "sei1x2fgaaqecvk8kwuqkjqcj27clw5p5g99uawdzy9sc4rku8avumcq3cky4k",
    owner: "sei1dpaaxgw4859qhew094s87l0he8tfea3lfxd5et",
    validators_limit: 30,
    escrow_addr:
      "sei1jkntjf038jtwzs7zefuyt35v6esv2ht986p4m8rrcfm9xtafphqq8gtw8w",
  },
};

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const msg = templates[argv["network"] as Chains];
  console.log("🚀 ~ file: 2_instantiate_fee_collector.ts ~ line 89 ~ msg", msg);

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
