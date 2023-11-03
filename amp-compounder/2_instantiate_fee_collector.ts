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
import { InstantiateMsg } from "../types/amp-compounder/fees_collector/instantiate_msg";
import { tokens, tokens_neutron } from "./tokens";

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

// Terra
// ts-node amp-governance/1_upload_contracts.ts --network mainnet --key mainnet --key-migrate ledger --contracts eris_fees_collector --migrates terra1v3h5lejqer5qnjnj6gds94u55x0qsxq7cpxs2kf7kqu6drwgmz4qd9qav9

// MIGALOO
// ts-node amp-governance/1_upload_contracts.ts --network migaloo --key mainnet-migaloo --contracts eris_fees_collector --migrates migaloo17w97atfwdnjpe6wywwsjjw09050aq9s78jjjsmrmhhqtg7nevpmq0u8t9v
// ts-node amp-compounder/2_instantiate_fee_collector.ts --network migaloo --key mainnet-migaloo --contract-code-id 70
// send to terra: migaloo1u0h8ls4rkzj3mkzgmywyqf4ahaljzaf2zszcj23kq389lk9hdc2sjzz9sq
// Zapper

// ts-node amp-governance/1_upload_contracts.ts --network migaloo --key mainnet-migaloo --contracts eris_fees_collector eris_compound_proxy
// [migaloo] eris_fees_collector -> 188
// [migaloo] eris_compound_proxy -> 190
// [phoenix] eris_fees_collector -> 2037
// Zapper:  -> migaloo10nlt59t9s8fdtv0nt934rg602dmgrmxz33k5ld6vtkx0wkf3pweqad5srw
// - ts-node amp-compounder/4_instantiate_compound.ts --network migaloo --key mainnet-migaloo --contract-code-id 190 --label "Eris Zapper"
// - (1) Instantiate https://migaloo.explorers.guru/transaction/665FE818952378E6A375B48922802213322E63738797C0076936333D6B04E853

// Migaloo Fee Collector: eris_fees_collector -> 188 -> migaloo13uf6cv8htse7dkcuykajr6e25czxcxct8pu2mnhq8zyr2hr0vxkqjwgvhm
// - ts-node amp-compounder/2_instantiate_fee_collector.ts --network migaloo --key mainnet-migaloo --contract-code-id 188
// - (2) Instantiate https://migaloo.explorers.guru/transaction/1822731967AB3B28BE040C4498A70C19F6B96C907E683EF18067FD0FF57309BF
// - (4) Update Targets https://migaloo.explorers.guru/transaction/769A77BBB92DD368F94085E469181DD3A6EC203D344019D0080D7969A847A840

// Terra Fee Collector 1: eris_fees_collector -> 2037 -> terra1tqnwsvl6pd7xqem7e7yfgs3dkgew8wy3j8h8ejmhgajupygeg8zqg2zkgj
// - ts-node amp-compounder/2_instantiate_fee_collector.ts --network mainnet --key mainnet --contract-code-id 2037
// - (3) Instantiate https://terrasco.pe/mainnet/tx/DD4C2C987B7C52483A9F781D608C80BF99C31F66F71F80374BDEE956AC7698B0

// ts-node amp-governance/1_upload_contracts.ts --network migaloo --key mainnet-migaloo --contracts eris_compound_proxy --migrates migaloo10nlt59t9s8fdtv0nt934rg602dmgrmxz33k5ld6vtkx0wkf3pweqad5srw
// CC52FFF9FCCA66EAADC4919418752597CC548305521400B6E4CA179C2B407F35

const templates: Partial<Record<Chains, InstantiateMsg>> = {
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
  // mainnet: <InstantiateMsg>{
  //   // astroport factory
  //   factory_contract:
  //     "terra14x9fr055x5hvr48hzy2t4q7kvjvfttsvxusa4xsdcy702mnzsvuqprer8r",
  //   max_spread: "0.01",
  //   operator: "terra1gtuvt6eh4m67tvd2dnfqhgks9ec6ff08c5vlup",
  //   owner: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
  //   stablecoin: { native_token: { denom: "uluna" } },
  //   target_list: [
  //     {
  //       addr: "terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk",
  //       weight: 1,
  //       msg: Buffer.from(JSON.stringify({ donate: {} })).toString("base64"),
  //     },
  //     {
  //       addr: "terra1gtuvt6eh4m67tvd2dnfqhgks9ec6ff08c5vlup",
  //       weight: 1,
  //     },
  //     {
  //       addr: "terra1rgggsspquaxjp4lmegx7a3q4l9lg44hnu7rjxa",
  //       weight: 3,
  //     },
  //   ],
  // },

  mainnet: (<InstantiateMsg>(<any>{
    // astroport factory
    factory_contract:
      "terra14x9fr055x5hvr48hzy2t4q7kvjvfttsvxusa4xsdcy702mnzsvuqprer8r",
    max_spread: "0.01",
    operator: "terra1gtuvt6eh4m67tvd2dnfqhgks9ec6ff08c5vlup",
    owner: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
    zapper: "terra1cs0tkknd2t94jd7hgdkmfyvenwr05ztra4rj6uackr597j9jfkxsghtywg",
    stablecoin: tokens.whale,
    target_list: [
      {
        addr: "migaloo13uf6cv8htse7dkcuykajr6e25czxcxct8pu2mnhq8zyr2hr0vxkqjwgvhm",
        weight: 1,
        target_type: {
          ibc: {
            channel_id: "channel-86",
          },
        },
      },
    ],
  })) as any,

  // collector ERIS
  // migaloo: <InstantiateMsg>{
  //   // astroport factory
  //   factory_contract:
  //     "migaloo1z89funaazn4ka8vrmmw4q27csdykz63hep4ay8q2dmlspc6wtdgq92u369",
  //   max_spread: "0.01",
  //   operator: "migaloo1c023jxq099et7a44ledfwuu3sdkfq8caya90nk",
  //   owner: "migaloo1dpaaxgw4859qhew094s87l0he8tfea3lf74c2y",
  //   stablecoin: { native_token: { denom: "uwhale" } },
  //   target_list: [
  //     // {
  //     //   addr: "migaloo1z3txc4x7scxsypx9tgynyfhu48nw60a5gpmd3y",
  //     //   weight: 7,
  //     // },
  //     // {
  //     //   addr: "migaloo1erul6xyq0gk6ws98ncj7lnq9l4jn4gnnu9we73gdz78yyl2lr7qqrvcgup",
  //     //   weight: 3,
  //     //   msg: Buffer.from(JSON.stringify({ burn: {} })).toString("base64"),
  //     // },
  //     // {
  //     //   addr: "migaloo1c023jxq099et7a44ledfwuu3sdkfq8caya90nk",
  //     //   weight: 0,
  //     //   target_type: {
  //     //     fill_up_first: {
  //     //       filled_to: "10000000",
  //     //       min_fill: "5000000",
  //     //     },
  //     //   },
  //     // },

  //     {
  //       addr: "terra1v3h5lejqer5qnjnj6gds94u55x0qsxq7cpxs2kf7kqu6drwgmz4qd9qav9",
  //       weight: 1,
  //       target_type: {
  //         ibc: {
  //           channel_id: "channel-0",
  //         },
  //       },
  //     },
  //   ],
  // },

  // collector 2
  // migaloo: <InstantiateMsg>{
  //   factory_contract:
  //     "migaloo1z89funaazn4ka8vrmmw4q27csdykz63hep4ay8q2dmlspc6wtdgq92u369",
  //   max_spread: "0.01",
  //   operator: "migaloo1c023jxq099et7a44ledfwuu3sdkfq8caya90nk",
  //   owner: "migaloo1dpaaxgw4859qhew094s87l0he8tfea3lf74c2y",
  //   zapper:
  //     "migaloo10nlt59t9s8fdtv0nt934rg602dmgrmxz33k5ld6vtkx0wkf3pweqad5srw",
  //   stablecoin: {
  //     native_token: {
  //       denom:
  //         "ibc/BC5C0BAFD19A5E4133FDA0F3E04AE1FBEE75A4A226554B2CBB021089FF2E1F8A",
  //     },
  //   },
  //   target_list: [
  //     {
  //       addr: "migaloo18qatlena5eujecsuwrwkpr5qccjddrf8ss4ykzlx8gmrt5dlxxkqysf3lz",
  //       weight: 1,
  //       target_type: "weight",
  //     },
  //   ],
  // },

  // collector 1:
  migaloo: <InstantiateMsg>{
    factory_contract:
      "migaloo1z89funaazn4ka8vrmmw4q27csdykz63hep4ay8q2dmlspc6wtdgq92u369",
    max_spread: "0.01",
    operator: "migaloo1c023jxq099et7a44ledfwuu3sdkfq8caya90nk",
    owner: "migaloo1dpaaxgw4859qhew094s87l0he8tfea3lf74c2y",
    zapper:
      "migaloo10nlt59t9s8fdtv0nt934rg602dmgrmxz33k5ld6vtkx0wkf3pweqad5srw",
    stablecoin: {
      native_token: {
        denom:
          "ibc/BC5C0BAFD19A5E4133FDA0F3E04AE1FBEE75A4A226554B2CBB021089FF2E1F8A",
      },
    },
    target_list: [
      {
        addr: "migaloo18qatlena5eujecsuwrwkpr5qccjddrf8ss4ykzlx8gmrt5dlxxkqysf3lz",
        weight: 1,
        target_type: "weight",
      },
    ],
  },

  neutron: <InstantiateMsg>{
    // astroport factory
    factory_contract:
      "neutron1hptk0k5kng7hjy35vmh009qd5m6l33609nypgf2yc6nqnewduqasxplt4e",
    max_spread: "0.01",
    operator: "neutron1c023jxq099et7a44ledfwuu3sdkfq8cadk9hul",
    owner: "neutron1dpaaxgw4859qhew094s87l0he8tfea3lq44q9d",
    stablecoin: tokens_neutron.usdc,
    target_list: [
      {
        addr: "neutron1z3txc4x7scxsypx9tgynyfhu48nw60a5p2m47d",
        weight: 1,
      },
      {
        addr: "neutron1c023jxq099et7a44ledfwuu3sdkfq8cadk9hul",
        weight: 0,
        target_type: {
          fill_up_first: {
            filled_to: "5000000",
            min_fill: "3000000",
          },
        },
      },
    ],
  },
};

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const msg = templates[argv["network"] as Chains];
  if (!msg) throw new Error("not supported chain");
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
