import { TxLog } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
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
// ts-node amp-compounder/4_instantiate_compound.ts --network mainnet --key mainnet --contract-code-id 1630 --label "Eris Zapper (Test)"

// ts-node 4_instantiate_compound.ts --network mainnet --key ledger --contract-code-id 513 --label "Eris Zapper"

const templates: Record<string, InstantiateMsg> = {
  testnet: <InstantiateMsg>{
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
  // mainnet: <InstantiateMsg>{
  //   factory: "terra14x9fr055x5hvr48hzy2t4q7kvjvfttsvxusa4xsdcy702mnzsvuqprer8r",
  //   lps: [
  //     // axlUSDC-axlUSDT
  //     {
  //       commission_bps: 5,
  //       pair_contract:
  //         "terra1ygn5h8v8rm0v8y57j3mtu3mjr2ywu9utj6jch6e0ys2fc2pkyddqekwrew",
  //       slippage_tolerance: "0.01",
  //       wanted_token: {
  //         native_token: {
  //           denom:
  //             "ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4",
  //         },
  //       },
  //     },
  //     // LUNA-axlUSDC
  //     {
  //       commission_bps: 30,
  //       pair_contract:
  //         "terra1fd68ah02gr2y8ze7tm9te7m70zlmc7vjyyhs6xlhsdmqqcjud4dql4wpxr",
  //       slippage_tolerance: "0.01",
  //       wanted_token: { native_token: { denom: "uluna" } },
  //     },
  //     // VKR-axlUSDC
  //     {
  //       commission_bps: 30,
  //       pair_contract:
  //         "terra1alzkrc6hkvs8g5a064cukfxnv0jj4l3l8vhgfypfxvysk78v6dgqsymgmv",
  //       slippage_tolerance: "0.01",
  //       wanted_token: {
  //         native_token: {
  //           denom:
  //             "ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4",
  //         },
  //       },
  //     },
  //     // ASTRO-axlUSDC
  //     {
  //       commission_bps: 30,
  //       pair_contract:
  //         "terra1w579ysjvpx7xxhckxewk8sykxz70gm48wpcuruenl29rhe6p6raslhj0m6",
  //       slippage_tolerance: "0.01",
  //       wanted_token: {
  //         token: {
  //           contract_addr:
  //             "terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26",
  //         },
  //       },
  //     },
  //     // TPT-LUNA
  //     {
  //       commission_bps: 30,
  //       pair_contract:
  //         "terra15l5pqlp8q5d4z8tvermadvp429d8pfctg4j802t8edzkf8aavp7q59t7er",
  //       slippage_tolerance: "0.01",
  //       wanted_token: { native_token: { denom: "uluna" } },
  //     },
  //     // LUNAX-LUNA
  //     {
  //       commission_bps: 30,
  //       pair_contract:
  //         "terra1mpj7j25fw5a0q5vfasvsvdp6xytaqxh006lh6f5zpwxvadem9hwsy6m508",
  //       slippage_tolerance: "0.01",
  //       wanted_token: { native_token: { denom: "uluna" } },
  //     },
  //     // ampLUNA-LUNA
  //     {
  //       commission_bps: 30,
  //       pair_contract:
  //         "terra1cr8dg06sh343hh4xzn3gxd3ayetsjtet7q5gp4kfrewul2kql8sqvhaey4",
  //       slippage_tolerance: "0.01",
  //       wanted_token: { native_token: { denom: "uluna" } },
  //     },
  //   ],
  //   owner: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
  //   routes: [],
  // },
  mainnet: <InstantiateMsg>{
    factory: "terra14x9fr055x5hvr48hzy2t4q7kvjvfttsvxusa4xsdcy702mnzsvuqprer8r",
    lps: [
      // ampLUNA-LUNA Astroport
      {
        commission_bps: 30,
        pair_contract:
          "terra1cr8dg06sh343hh4xzn3gxd3ayetsjtet7q5gp4kfrewul2kql8sqvhaey4",
        slippage_tolerance: "0.01",
        wanted_token: { native_token: { denom: "uluna" } },
      },
      // ampLUNA-LUNA WhiteWhale
      {
        commission_bps: 30,
        pair_contract:
          "terra1tsx0dmasjvd45k6tdywzv77d5t9k3lpzyuleavuah77pg3lwm9cq4469pm",
        slippage_tolerance: "0.01",
        wanted_token: { native_token: { denom: "uluna" } },
        lp_type: "white_whale",
      },
    ],
    owner: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
    routes: [],
  },
};

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const msg = templates[argv["network"]];

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
