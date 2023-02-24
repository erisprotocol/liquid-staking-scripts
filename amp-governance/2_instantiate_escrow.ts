import { TxLog } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  instantiateWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
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

const templates: Record<string, InstantiateMsg> = {
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
  mainnet: <InstantiateMsg>{
    // ampLUNA
    deposit_token_addr:
      "terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct",
    logo_urls_whitelist: [
      "https://dev.erisprotocol.com/",
      "https://erisprotocol.com/",
      "https://www.erisprotocol.com/",
    ],
    owner: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
    guardian_addr: "terra1q0vny4wx2pfteh9zq323wh48c654xacpfq5tew",
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
