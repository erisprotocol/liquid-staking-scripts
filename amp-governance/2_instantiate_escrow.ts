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
import { InstantiateMsg as TfInstantiateMsg } from "../types/tokenfactory/voting_escrow/eris_gov_voting_escrow_instantiate";
import { InstantiateMsg } from "../types/voting_escrow/eris_gov_voting_escrow_instantiate";

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
// ts-node amp-governance/2_instantiate_escrow.ts --network testnet --key testnet --contract-code-id 7768 --label "Vote-escrowed ampLUNA"
// ampLP: terra15h6tu0qxx542rs0njefujw5mjag3gfc0d3seruydhvs6z07ftz6s6uuwdp
// ampLUNA: terra185fzsf0e247dsa9npuc0kdn8ef3ht2q5rwedle43h3q5ymjmvs2qkvdp3f

// ts-node 2_instantiate_escrow.ts --network mainnet --key ledger --contract-code-id xx

// ts-node amp-governance/2_instantiate_escrow.ts --network mainnet --key ledger --contract-code-id 1162 --label "Vote-escrowed ampLUNA"

// ts-node amp-governance/2_instantiate_escrow.ts --network migaloo --key mainnet-migaloo --contract-code-id 14 --label "Vote-escrow ampWHALE"

// ts-node amp-governance/2_instantiate_escrow.ts --network archwaytest --key mainnet-archway --contract-code-id 199 --label "Vote-escrow ampCONST"

// ts-node amp-governance/2_instantiate_escrow.ts --network archway --key mainnet-archway --contract-code-id 39 --label "Vote-escrow ampARCH"
// ts-node amp-governance/2_instantiate_escrow.ts --network osmosis --key mainnet-osmosis --contract-code-id 108 --label "Vote-escrow ampOSMO"
// ts-node amp-governance/2_instantiate_escrow.ts --network juno --key key-mainnet --contract-code-id 3397 --label "Vote-escrow ampJUNO"

const templates: Partial<Record<Chains, any>> = {
  testnet: <InstantiateMsg>{
    // ampLUNA
    deposit_token_addr:
      "terra1xgvp6p0qml53reqdyxgcl8ttl0pkh0n2mtx2n7tzfahn6e0vca7s0g7sg6",
    logo_urls_whitelist: [
      "https://dev.erisprotocol.com/",
      "https://erisprotocol.com/",
      "https://www.erisprotocol.com/",
    ],
    owner: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
    guardian_addr: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
  },
  // testnet: <InstantiateMsg>{
  //   deposit_token_addr:
  //     "terra1s2prs6eaepym9tfck5fxnhlqjlku43thkvayhdyc2afdmv8t2hfqx74ynk",
  //   logo_urls_whitelist: [
  //     "https://dev.erisprotocol.com/",
  //     "https://erisprotocol.com/",
  //     "https://www.erisprotocol.com/",
  //   ],
  //   owner: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
  //   guardian_addr: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
  // },
  // mainnet: <InstantiateMsg>{
  //   // ampLUNA
  //   deposit_token_addr:
  //     "terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct",
  //   logo_urls_whitelist: [
  //     "https://dev.erisprotocol.com/",
  //     "https://erisprotocol.com/",
  //     "https://www.erisprotocol.com/",
  //   ],
  //   owner: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
  //   guardian_addr: "terra1q0vny4wx2pfteh9zq323wh48c654xacpfq5tew",
  // },

  mainnet: <TfInstantiateMsg>{
    deposit_denom:
      "factory/terra1vklefn7n6cchn0u962w3gaszr4vf52wjvd4y95t2sydwpmpdtszsqvk9wy/ampROAR",
    logo_urls_whitelist: ["https://www.erisprotocol.com/"],
    owner: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
    guardian_addr: "terra1q0vny4wx2pfteh9zq323wh48c654xacpfq5tew",
  },
  migaloo: <TfInstantiateMsg>{
    deposit_denom:
      "factory/migaloo1436kxs0w2es6xlqpp9rd35e3d0cjnw4sv8j3a7483sgks29jqwgshqdky4/ampWHALE",
    logo_urls_whitelist: [
      "https://dev.erisprotocol.com/",
      "https://erisprotocol.com/",
      "https://www.erisprotocol.com/",
    ],
    owner: "migaloo1dpaaxgw4859qhew094s87l0he8tfea3lf74c2y",
    guardian_addr: "migaloo1dpaaxgw4859qhew094s87l0he8tfea3lf74c2y",
  },
  osmosis: <TfInstantiateMsg>{
    deposit_denom:
      "factory/osmo1dv8wz09tckslr2wy5z86r46dxvegylhpt97r9yd6qc3kyc6tv42qa89dr9/ampOSMO",
    logo_urls_whitelist: ["https://www.erisprotocol.com/"],
    owner: "osmo1dpaaxgw4859qhew094s87l0he8tfea3lv30jfc",
    guardian_addr: "osmo1dpaaxgw4859qhew094s87l0he8tfea3lv30jfc",
  },
  // inj1yp0lgxq460ked0egtzyj2nck3mdhr8smfmteh5
  // injective: <TfInstantiateMsg>{
  //   deposit_denom: "factory/inj1cdwt8g7nxgtg2k4fn8sj363mh9ahkw2qt0vrnc/ampINJ",
  //   logo_urls_whitelist: ["https://www.erisprotocol.com/"],
  //   owner: "inj1rnh5c7emgt2g9s2ezg6km7lylyxyddq5jjnjav",
  //   guardian_addr: "inj1rnh5c7emgt2g9s2ezg6km7lylyxyddq5jjnjav",
  // },

  archwaytest: <InstantiateMsg>{
    // ampTOKEN
    // hub archway102t7f76edspqrpvqq7xe93uk5q7uhknqccrxa73va0knjyupd2ksexhhky
    deposit_token_addr:
      "archway17xs35uqq3mygfts8qpex9fq8kj96jdcwj9jr0fm25hp0h9fp6gpqafvgnd",
    logo_urls_whitelist: ["https://www.erisprotocol.com/"],
    owner: "archway1dpaaxgw4859qhew094s87l0he8tfea3l3pqx4a",
    guardian_addr: "archway1dpaaxgw4859qhew094s87l0he8tfea3l3pqx4a",
  },
  archway: <InstantiateMsg>{
    // ampTOKEN archway1fwurjg7ah4v7hhs6xsc3wutqpvmahrfhns285s0lt34tgfdhplxq6m8xg5
    // hub archway1yg4eq68xyll74tdrrcxkr4qpam4j9grknunmp74zzc6km988dadqy0utmj
    deposit_token_addr:
      "archway1fwurjg7ah4v7hhs6xsc3wutqpvmahrfhns285s0lt34tgfdhplxq6m8xg5",
    logo_urls_whitelist: ["https://www.erisprotocol.com/"],
    owner: "archway1dpaaxgw4859qhew094s87l0he8tfea3l3pqx4a",
    guardian_addr: "archway1dpaaxgw4859qhew094s87l0he8tfea3l3pqx4a",
  },
  juno: <InstantiateMsg>{
    // ampTOKEN archway1fwurjg7ah4v7hhs6xsc3wutqpvmahrfhns285s0lt34tgfdhplxq6m8xg5
    // hub archway1yg4eq68xyll74tdrrcxkr4qpam4j9grknunmp74zzc6km988dadqy0utmj
    deposit_token_addr:
      "juno1a0khag6cfzu5lrwazmyndjgvlsuk7g4vn9jd8ceym8f4jf6v2l9q6d348a",
    logo_urls_whitelist: ["https://www.erisprotocol.com/"],
    owner: "juno1dpaaxgw4859qhew094s87l0he8tfea3ljcleck",
    guardian_addr: "juno1dpaaxgw4859qhew094s87l0he8tfea3ljcleck",
  },
  sei: <TfInstantiateMsg>{
    deposit_denom:
      "factory/sei1x2fgaaqecvk8kwuqkjqcj27clw5p5g99uawdzy9sc4rku8avumcq3cky4k/ampSEI",
    logo_urls_whitelist: ["https://www.erisprotocol.com/"],
    owner: "sei1dpaaxgw4859qhew094s87l0he8tfea3lfxd5et",
    guardian_addr: "sei1dpaaxgw4859qhew094s87l0he8tfea3lfxd5et",
  },
  "testnet-kujira": <TfInstantiateMsg>{
    deposit_denom:
      "factory/kujira1n8yke2vzsqe3h67h42yh66360q7pe67zwer8rvzjkttr2wqffnes56q9jj/ampMNTA",
    logo_urls_whitelist: ["https://www.erisprotocol.com/"],
    owner: "kujira1dpaaxgw4859qhew094s87l0he8tfea3l4z76jq",
    guardian_addr: "kujira1dpaaxgw4859qhew094s87l0he8tfea3l4z76jq",
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
    msg,
    argv.label
  );

  const addresses = result.logs.map(
    (a: TxLog) => a.eventsByType["instantiate"]["_contract_address"][0]
  );

  console.log(`Contract instantiated! Address: ${addresses}`);
})();
