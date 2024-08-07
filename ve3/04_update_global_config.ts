import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  Chains,
  createLCDClient,
  createWallet,
  getInfo,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/ve3/global-config/execute";
import { Ve3InfoKeys, config } from "./config";

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
    contract: {
      type: "string",
      demandOption: false,
    },
  })
  .parseSync();

(async function () {
  const network = argv["network"] as Chains;
  const terra = createLCDClient(network);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const address = admin.key.accAddress(getPrefix());
  const contract =
    argv.contract || getInfo("ve3", network, Ve3InfoKeys.global_config_addr);

  // vec![
  //   // controller
  //   (
  //     AT_DELEGATION_CONTROLLER.to_string(),
  //     self.address("AT_DELEGATION_CONTROLLER").to_string(),
  //   ),
  //   (
  //     AT_ASSET_WHITELIST_CONTROLLER.to_string(),
  //     self.address("AT_ASSET_WHITELIST_CONTROLLER").to_string(),
  //   ),
  //   (
  //     AT_BRIBE_WHITELIST_CONTROLLER.to_string(),
  //     self.address("AT_BRIBE_WHITELIST_CONTROLLER").to_string(),
  //   ),
  //   (AT_VE_GUARDIAN.to_string(), self.address("AT_VE_GUARDIAN").to_string()),
  //   // receivers
  //   (AT_TAKE_RECIPIENT.to_string(), self.address("AT_TAKE_RECIPIENT").to_string()),
  //   (AT_FEE_COLLECTOR.to_string(), self.address("AT_FEE_COLLECTOR").to_string()),
  //   (AT_TEAM_WALLET.to_string(), self.address("AT_TEAM_WALLET").to_string()),
  //   // contracts
  //   (AT_VOTING_ESCROW.to_string(), self.addresses.ve3_voting_escrow.to_string()),
  //   (AT_ASSET_GAUGE.to_string(), self.addresses.ve3_asset_gauge.to_string()),
  //   (AT_BRIBE_MANAGER.to_string(), self.addresses.ve3_bribe_manager.to_string()),
  //   (at_connector(&self.gauge1()), self.addresses.ve3_connector_alliance_mock.to_string()),
  //   (at_connector(&self.gauge2()), self.addresses.ve3_connector_alliance_eris.to_string()),
  //   (at_connector(&self.gauge3()), self.addresses.ve3_connector_emissions.to_string()),
  //   (at_asset_staking(&self.gauge1()), self.addresses.ve3_asset_staking_1.to_string()),
  //   (at_asset_staking(&self.gauge2()), self.addresses.ve3_asset_staking_2.to_string()),
  //   (at_asset_staking(&self.gauge3()), self.addresses.ve3_asset_staking_3.to_string()),
  // ],
  // vec![(
  //   AT_FREE_BRIBES.to_string(),
  //   vec![
  //     self.addresses.ve3_asset_staking_1.to_string(),
  //     self.addresses.ve3_asset_staking_2.to_string(),
  //     self.addresses.ve3_asset_staking_3.to_string(),
  //     self.addresses.creator.to_string(),
  //   ],
  // )],

  const connector = (x: string) => `CONNECTOR__${x}`;
  const staking = (x: string) => `ASSET_STAKING__${x}`;

  if (!config[network]) {
    throw new Error(`no data available for network ${network}`);
  }

  const connectors =
    config[network]?.gauges.map((a) => [
      connector(a),
      getInfo("ve3", network, Ve3InfoKeys.alliance_connector_addr(a)),
    ]) ?? [];

  const stakings =
    config[network]?.gauges.map((a) => [
      staking(a),
      getInfo("ve3", network, Ve3InfoKeys.asset_staking_addr(a)),
    ]) ?? [];

  const controller = config[network]?.controller ?? "";

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(address, contract, <ExecuteMsg>{
        set_addresses: {
          addresses: [
            // ["DELEGATION_CONTROLLER", controller],
            // ["ASSET_WHITELIST_CONTROLLER", controller],
            // ["BRIBE_WHITELIST_CONTROLLER", controller],
            // ["VE_GUARDIAN", controller],

            // ["TAKE_RECIPIENT", config[network]?.take_collector],
            // ["FEE_COLLECTOR", config[network]?.fee_collector],
            // ["TEAM_WALLET", ""],

            [
              "ASSET_GAUGE",
              getInfo("ve3", network, Ve3InfoKeys.asset_gauge_addr),
            ],

            // [
            //   "VOTING_ESCROW",
            //   getInfo("ve3", network, Ve3InfoKeys.voting_escrow_addr),
            // ],
            // [
            //   "BRIBE_MANAGER",
            //   getInfo("ve3", network, Ve3InfoKeys.bribe_manager_addr),
            // ],
            // ...connectors,
            // ...stakings,
          ],
          lists: [],
          // lists: [["FREE_BRIBES", [...stakings.map((a) => a[1])]]],
        },
      }),
    ]
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
