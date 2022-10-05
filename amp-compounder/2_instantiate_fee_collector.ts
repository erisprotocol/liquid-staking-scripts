import { TxLog } from "@terra-money/terra.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
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
};

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const msg = templates[argv["network"]];

  const result = await instantiateWithConfirm(
    deployer,
    deployer.key.accAddress,
    argv.contractCodeId,
    msg,
    "Eris Fee Collector"
  );

  const addresses = result.logs.map(
    (a: TxLog) => a.eventsByType["instantiate"]["_contract_address"][0]
  );

  console.log(`Contract instantiated! Address: ${addresses}`);
})();
