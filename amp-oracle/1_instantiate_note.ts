import { TxLog } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  instantiateWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { InstantiateMsg } from "../types/polytone_note/instantiate";

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

// mainnet
// ts-node ampz/1_upload_contracts.ts --network mainnet --key mainnet --folder polytone  --contracts polytone_note
// ts-node ampz/1_upload_contracts.ts --network migaloo --key mainnet-migaloo --folder polytone  --contracts polytone_proxy
// ts-node ampz/1_upload_contracts.ts --network migaloo --key mainnet-migaloo --folder polytone  --contracts polytone_voice
// ts-node ampz/1_upload_contracts.ts --network mainnet --key mainnet --folder icq-oracle  --contracts eris_oracle

// ts-node amp-oracle/1_instantiate_note.ts --network mainnet --key mainnet --contract-code-id 1479 --label "Note Terra-Migaloo"
// ts-node amp-oracle/1_instantiate_voice.ts --network migaloo --key mainnet-migaloo --contract-code-id 19 --label "Voice Migaloo"
// ts-node amp-oracle/1_instantiate_oracle.ts --network mainnet --key mainnet --contract-code-id 1480 --label "ERIS Oracle"

// terra oracle: 1481 -> terra17jmtlvhhajv7u5zv38tpgghe4uhynsk2e5jsqy6k6jv5pavwgfgqkr7cv3
// terra note: 1479 -> terra1euhckzh8rs2sk5gc7z0t472fz7cmxt6wnwgl784t5npggwsmxemqq43uf7
// migaloo proxy: 18 -> not needed
// migaloo voice: 19 -> migaloo10l0ltapgnd746a6rgty5vkd33tex54ddvf2eyu3qas0050q7yehsuy3j5g

// ts-node amp-oracle/2_execute.ts --network mainnet --key mainnet --contract terra17jmtlvhhajv7u5zv38tpgghe4uhynsk2e5jsqy6k6jv5pavwgfgqkr7cv3

// ORACLE:
// ts-node amp-governance/1_upload_contracts.ts --network mainnet --key mainnet --folder icq-oracle  --contracts eris_oracle --migrates terra17jmtlvhhajv7u5zv38tpgghe4uhynsk2e5jsqy6k6jv5pavwgfgqkr7cv3
// ts-node ampz/5_migrate.ts --network mainnet --key mainnet --code-id 1486 --contracts terra17jmtlvhhajv7u5zv38tpgghe4uhynsk2e5jsqy6k6jv5pavwgfgqkr7cv3
// NOTE:   ts-node ampz/5_migrate.ts --network mainnet --key mainnet --code-id 1485 --contracts terra1euhckzh8rs2sk5gc7z0t472fz7cmxt6wnwgl784t5npggwsmxemqq43uf7 --msg '{"with_update":{"block_max_gas":"1000000"}}'

const templates: Record<string, InstantiateMsg> = {
  mainnet: <InstantiateMsg>{
    block_max_gas: "400000000",
  },
};

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const msg = templates[argv["network"]];

  const addr = deployer.key.accAddress(getPrefix());

  console.log("msg", msg);

  const result = await instantiateWithConfirm(
    deployer,
    addr,
    argv.contractCodeId,
    msg,
    argv.label
  );

  const addresses = result.logs.map(
    (a: TxLog) => a.eventsByType["instantiate"]["_contract_address"][0]
  );

  console.log(`Contract instantiated! Address: ${addresses}`);
})();
