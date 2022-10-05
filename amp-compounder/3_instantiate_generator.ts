import { TxLog } from "@terra-money/terra.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  instantiateWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { InstantiateMsg } from "../types/amp-compounder/generator_proxy/instantiate_msg";

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

// ts-node 3_instantiate_generator.ts --network testnet --key testnet --contract-code-id 4550 --label "Eris Governance Proxy"

const templates: Record<string, InstantiateMsg> = {
  testnet: <InstantiateMsg>{
    astro_gov: {
      fee_distributor:
        "terra1gc4d4v82vjgkz0ag28lrmlxx3tf6sq69tmaujjpe7jwmnqakkx0qm28j2l",
      generator_controller:
        "terra1gc4d4v82vjgkz0ag28lrmlxx3tf6sq69tmaujjpe7jwmnqakkx0qm28j2l",
      voting_escrow:
        "terra1gc4d4v82vjgkz0ag28lrmlxx3tf6sq69tmaujjpe7jwmnqakkx0qm28j2l",
      xastro_token:
        "terra1ctzthkc0nzseppqtqlwq9mjwy9gq8ht2534rtcj3yplerm06snmqfc5ucr",
    },
    astro_token:
      "terra167dsqkh2alurx997wmycw9ydkyu54gyswe3ygmrs4lwume3vmwks8ruqnv",
    boost_fee: "0.01",
    controller: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
    fee_collector:
      "terra1250jufq9xdxkkgakx27elqzch53curh94tyy0gugd2k35kmjnszs9zawyf",
    generator:
      "terra1gc4d4v82vjgkz0ag28lrmlxx3tf6sq69tmaujjpe7jwmnqakkx0qm28j2l",
    max_quota: "0",
    owner: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
    staker_rate: "0.5",
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
    argv.label
  );

  const addresses = result.logs.map(
    (a: TxLog) => a.eventsByType["instantiate"]["_contract_address"][0]
  );

  console.log(`Contract instantiated! Address: ${addresses}`);
})();
