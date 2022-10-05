import { TxLog } from "@terra-money/terra.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  instantiateWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { InstantiateMsg } from "../types/amp-compounder/compound_proxy/instantiate_msg";

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

// ts-node 4_instantiate_compound.ts --network testnet --key testnet --contract-code-id 4548 --label "Eris Zapper"

const templates: Record<string, InstantiateMsg> = {
  testnet: <InstantiateMsg>{
    //   astro_gov: {
    //     fee_distributor:
    //       "terra1gc4d4v82vjgkz0ag28lrmlxx3tf6sq69tmaujjpe7jwmnqakkx0qm28j2l",
    //     generator_controller:
    //       "terra1gc4d4v82vjgkz0ag28lrmlxx3tf6sq69tmaujjpe7jwmnqakkx0qm28j2l",
    //     voting_escrow:
    //       "terra1gc4d4v82vjgkz0ag28lrmlxx3tf6sq69tmaujjpe7jwmnqakkx0qm28j2l",
    //     xastro_token:
    //       "terra1ctzthkc0nzseppqtqlwq9mjwy9gq8ht2534rtcj3yplerm06snmqfc5ucr",
    //   },
    //   astro_token:
    //     "terra167dsqkh2alurx997wmycw9ydkyu54gyswe3ygmrs4lwume3vmwks8ruqnv",
    //   boost_fee: "0.01",
    //   controller: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
    //   fee_collector:
    //     "terra1250jufq9xdxkkgakx27elqzch53curh94tyy0gugd2k35kmjnszs9zawyf",
    //   generator:
    //     "terra1gc4d4v82vjgkz0ag28lrmlxx3tf6sq69tmaujjpe7jwmnqakkx0qm28j2l",
    //   max_quota: "0",
    //   owner: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
    //   staker_rate: "0.5",
    // },

    factory: "terra1z3y69xas85r7egusa0c7m5sam0yk97gsztqmh8f2cc6rr4s4anysudp7k0",
    lps: [
      {
        commission_bps: 5,
        pair_contract:
          "terra15207c4rlvz49sr692flm4v4q87c8fhszk7j74avxuzv5kefaywvquthwjq",
        slippage_tolerance: "0.01",
        wanted_token: {
          token: {
            contract_addr:
              "terra1s50rr0vz05xmmkz5wnc2kqkjq5ldwjrdv4sqzf983pzfxuj7jgsq4ehcu2",
          },
        },
      },
      {
        commission_bps: 30,
        pair_contract:
          "terra10kypagsdkrc769dnxs0th3wk87t84vu6gvrfzfg9ee93rfanu32qqfluee",
        slippage_tolerance: "0.01",
        wanted_token: { native_token: { denom: "uluna" } },
      },
      {
        commission_bps: 30,
        pair_contract:
          "terra1d5hvj5l7dd7xuz343pq9zyex47ekgqj27rskqwfde073dhck4mls39ewkk",
        slippage_tolerance: "0.01",
        wanted_token: { native_token: { denom: "uluna" } },
      },
      {
        commission_bps: 30,
        pair_contract:
          "terra1udsua9w6jljwxwgwsegvt6v657rg3ayfvemupnes7lrggd28s0wq7g8azm",
        slippage_tolerance: "0.01",
        wanted_token: {
          token: {
            contract_addr:
              "terra167dsqkh2alurx997wmycw9ydkyu54gyswe3ygmrs4lwume3vmwks8ruqnv",
          },
        },
      },
    ],
    owner: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
    routes: [],
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
