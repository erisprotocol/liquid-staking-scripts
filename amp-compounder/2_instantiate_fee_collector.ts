import { TxLog } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  instantiateWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { InstantiateMsg } from "../types/amp-compounder/fees_collector/instantiate_msg";

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
  })
  .parseSync();

// ts-node 2_instantiate_fee_collector.ts --network testnet --key testnet --contract-code-id 4549

// ts-node 2_instantiate_fee_collector.ts --network mainnet --key ledger --contract-code-id 514

// ts-node amp-compounder/1_upload_contracts.ts --network migaloo --key mainnet-migaloo --contracts eris_fees_collector
// ts-node amp-compounder/2_instantiate_fee_collector.ts --network migaloo --key mainnet-migaloo --contract-code-id 50

const templates: Record<string, InstantiateMsg> = {
  testnet: <InstantiateMsg>{
    // astroport factory
    factory_contract:
      "terra1z3y69xas85r7egusa0c7m5sam0yk97gsztqmh8f2cc6rr4s4anysudp7k0",
    max_spread: "0.01",
    operator: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
    owner: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
    stablecoin: { native_token: { denom: "uluna" } },
    target_list: [
      {
        addr: "terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88",
        weight: 1,
        msg: Buffer.from(JSON.stringify({ donate: {} })).toString("base64"),
      },
      {
        addr: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
        weight: 4,
      },
    ],
  },
  mainnet: <InstantiateMsg>{
    // astroport factory
    factory_contract:
      "terra14x9fr055x5hvr48hzy2t4q7kvjvfttsvxusa4xsdcy702mnzsvuqprer8r",
    max_spread: "0.01",
    operator: "terra1gtuvt6eh4m67tvd2dnfqhgks9ec6ff08c5vlup",
    owner: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
    stablecoin: { native_token: { denom: "uluna" } },
    target_list: [
      {
        addr: "terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk",
        weight: 1,
        msg: Buffer.from(JSON.stringify({ donate: {} })).toString("base64"),
      },
      {
        addr: "terra1gtuvt6eh4m67tvd2dnfqhgks9ec6ff08c5vlup",
        weight: 1,
      },
      {
        addr: "terra1rgggsspquaxjp4lmegx7a3q4l9lg44hnu7rjxa",
        weight: 3,
      },
    ],
  },
  migaloo: <InstantiateMsg>{
    // astroport factory
    factory_contract:
      "migaloo1z89funaazn4ka8vrmmw4q27csdykz63hep4ay8q2dmlspc6wtdgq92u369",
    max_spread: "0.01",
    operator: "migaloo1c023jxq099et7a44ledfwuu3sdkfq8caya90nk",
    owner: "migaloo1dpaaxgw4859qhew094s87l0he8tfea3lf74c2y",
    stablecoin: { native_token: { denom: "uwhale" } },
    target_list: [
      {
        addr: "migaloo1z3txc4x7scxsypx9tgynyfhu48nw60a5gpmd3y",
        weight: 7,
      },
      {
        addr: "migaloo1erul6xyq0gk6ws98ncj7lnq9l4jn4gnnu9we73gdz78yyl2lr7qqrvcgup",
        weight: 3,
        msg: Buffer.from(JSON.stringify({ burn: {} })).toString("base64"),
      },
      {
        addr: "migaloo1c023jxq099et7a44ledfwuu3sdkfq8caya90nk",
        weight: 0,
        target_type: {
          fill_up_first: {
            filled_to: "10000000",
            min_fill: "5000000",
          },
        },
      },
    ],
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
    "Eris Fee Collector"
  );

  const addresses = result.logs.map(
    (a: TxLog) => a.eventsByType["instantiate"]["_contract_address"][0]
  );

  console.log(`Contract instantiated! Address: ${addresses}`);
})();
