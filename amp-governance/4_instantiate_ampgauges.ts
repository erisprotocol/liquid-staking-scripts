import { TxLog } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
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
//
const templates: Record<string, InstantiateMsg> = {
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
};

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const msg = templates[argv["network"]];
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
