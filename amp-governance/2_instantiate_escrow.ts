import { TxLog } from "@terra-money/terra.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
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
// ts-node 2_instantiate_escrow.ts --network testnet --key testnet --contract-code-id 5396 --label "Vote-escrowed ampLUNA-LUNA ampLP"
// terra15h6tu0qxx542rs0njefujw5mjag3gfc0d3seruydhvs6z07ftz6s6uuwdp

// ts-node 2_instantiate_escrow.ts --network mainnet --key ledger --contract-code-id xx

const templates: Record<string, InstantiateMsg> = {
  testnet: <InstantiateMsg>{
    deposit_token_addr:
      "terra1s2prs6eaepym9tfck5fxnhlqjlku43thkvayhdyc2afdmv8t2hfqx74ynk",
    logo_urls_whitelist: [
      "https://dev.erisprotocol.com/",
      "https://erisprotocol.com/",
      "https://www.erisprotocol.com/",
    ],
    owner: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
    guardian_addr: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
  },
  mainnet: <InstantiateMsg>{},
};

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const msg = templates[argv["network"]];
  console.log("🚀 ~ file: 2_instantiate_fee_collector.ts ~ line 89 ~ msg", msg);

  const result = await instantiateWithConfirm(
    deployer,
    deployer.key.accAddress,
    argv.contractCodeId,
    msg,
    argv.label
  );

  const addresses = result.logs.map(
    (a: TxLog) => a.eventsByType["instantiate"]["_contract_address"][0]
  );

  console.log(`Contract instantiated! Address: ${addresses}`);
})();
