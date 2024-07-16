import { Chains } from "../helpers";

interface Data {
  owner: string;
  controller: string;
  fee_collector: string;
  take_collector: string;
  gauges: string[];
  weights: string[];
  lst_hub: string;
}

export class Ve3InfoKeys {
  static global_config_addr = "global_config_addr";
  static asset_gauge_addr = "asset_gauge_addr";
  static zapper_addr = "zapper_addr";
  static voting_escrow_addr = "voting_escrow_addr";
  static bribe_manager_addr = "bribe_manager_addr";

  static asset_staking_addr = (gauge: string) =>
    `gauges.${gauge}.asset_staking_addr`;
  static alliance_connector_addr = (gauge: string) =>
    `gauges.${gauge}.alliance_connector_addr`;
  static alliance_connector_zasset = (gauge: string) =>
    `gauges.${gauge}.alliance_connector_zasset`;
  static alliance_connector_vt = (gauge: string) =>
    `gauges.${gauge}.alliance_connector_vt`;

  static asset_staking_addr_str = "asset_staking_addr";
  static alliance_connector_addr_str = "alliance_connector_addr";
  static gauges = "gauges";

  static contract_map = [
    ["ve3_asset_gauge", "asset_gauge_addr"],
    ["ve3_bribe_manager", "bribe_manager_addr"],
    ["ve3_global_config", "global_config_addr"],
  ];
}

export const config: Partial<Record<Chains, Data>> = {
  "mainnet-copy": {
    owner: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
    controller: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
    fee_collector: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
    take_collector: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
    lst_hub: "terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk",
    gauges: ["stable", "project", "bluechip"],
    weights: ["0.1", "0.05", "0.05"],
  },
};
