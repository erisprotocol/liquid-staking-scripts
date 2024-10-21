import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import { Chains, createLCDClient, createWallet, getInfo, getPrefix, sendTxWithConfirm } from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/ve3/global-config/execute";
import { SuperInfoKeys } from "./config";

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
  const contract = argv.contract || getInfo("super", network, SuperInfoKeys.global_config_addr);

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

  // const connector = (x: string) => `CONNECTOR__${x}`;
  // const staking = (x: string) => `ASSET_STAKING__${x}`;

  // if (!config[network]) {
  //   throw new Error(`no data available for network ${network}`);
  // }

  // const connectors: [string, string][] =
  //   config[network]?.gauges.map((a) => [
  //     connector(a),
  //     getInfo("super", network, SuperInfoKeys.alliance_connector_addr(a)),
  //   ]) ?? [];

  // const stakings: [string, string][] =
  //   config[network]?.gauges.map((a) => [staking(a), getInfo("super", network, SuperInfoKeys.asset_staking_addr(a))]) ??
  //   [];
  // const controller = config[network]?.controller ?? "";

  // const stewardship = config[network]?.stewardship ?? "";

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(address, contract, <ExecuteMsg>{
        set_addresses: {
          addresses: [["FEE_COLLECTOR", "neutron1z3txc4x7scxsypx9tgynyfhu48nw60a5p2m47d"]],
          lists: [
            [
              "DATA_BOT",
              ["neutron1z3txc4x7scxsypx9tgynyfhu48nw60a5p2m47d", "neutron1re54yjznwq863t74n6mm3q0es5e23df6470wyt"],
            ],
          ],
        },
        // // default setting
        // set_addresses: {
        //   addresses: [
        //     // ["DELEGATION_CONTROLLER", stewardship],
        //     // ["ASSET_WHITELIST_CONTROLLER", stewardship],
        //     // ["BRIBE_WHITELIST_CONTROLLER", stewardship],
        //     // ["VE_GUARDIAN", stewardship],

        //     // ["TAKE_RECIPIENT", config[network]?.take_collector],
        //     // ["FEE_COLLECTOR", config[network]?.fee_collector],
        //     // // ["TEAM_WALLET", ""],

        //     // ["ASSET_GAUGE", getInfo("super", network, SuperInfoKeys.asset_gauge_addr)],

        //     // ["VOTING_ESCROW", getInfo("super", network, SuperInfoKeys.voting_escrow_addr)],
        //     // ["BRIBE_MANAGER", getInfo("super", network, SuperInfoKeys.bribe_manager_addr)],
        //     ...connectors,
        //     ...stakings,
        //   ],
        //   lists: [["FREE_BRIBES", [...stakings.map((a) => a[1])]]],
        // },

        // // PDT
        // set_addresses: {
        //   addresses: [
        //     // ["PDT_CONTROLLER", stewardship],
        //     ["PDT_CONFIG_OWNER", "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl"],
        //   ],
        //   lists: [],
        //   // lists: [["PDT_DCA_EXECUTOR", [stewardship, "terra1gtuvt6eh4m67tvd2dnfqhgks9ec6ff08c5vlup"]]],
        // },
      }),
    ]
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
