import { tokens_neutron, tokens_neutron_testnet } from "../amp-compounder/tokens";
import { Chains, toNew } from "../helpers";
import { AssetInfoBaseFor_Addr } from "../types/alliance-hub-lst/eris_alliance_hub_lst_whitewhale_execute";
import { AssetBaseFor_String } from "../types/ve3/bribe-manager/execute";

interface Data {
  pool_tax: string;
  creation_fee: AssetBaseFor_String;
  candy_fee: string;

  owner: string;
  controller: string;
  fee_collector: string;
  gauges: string[];
  astroport_factory: string;

  marketplace: MarketplaceData;
}

interface MarketplaceData {
  min_bid_increment: string;
  protocol_auction_fee: string;
  extension_duration: number;
  auction_duration: number;
  accepted_assets: AssetInfoBaseFor_Addr[];
}

export class SuperInfoKeys {
  static foundry = "foundry";
  static offer = "collection_offer";
  static marketplace = "marketplace";

  static global_config_addr = "global_config_addr";
  static asset_gauge_addr = "asset_gauge_addr";
  static zapper_addr = "zapper_addr";
  static voting_escrow_addr = "voting_escrow_addr";
  static bribe_manager_addr = "bribe_manager_addr";

  static asset_staking_addr = (gauge: string) => `gauges.${gauge}.asset_staking_addr`;

  static asset_staking_addr_str = "asset_staking_addr";
  static alliance_connector_addr_str = "alliance_connector_addr";
  static gauges = "gauges";

  static code = (code: Codes) => `codes.${Codes[code]}`;
}

export enum Codes {
  super_candy,
  super_collection,
  super_collector,
  super_foundry,
  super_marketplace,
  super_minter,
  super_offer,
  super_particles,
  ve3_asset_gauge,
  ve3_asset_staking,
  ve3_bribe_manager,
  ve3_connector_emission,
  util_global_config,
  ve3_voting_escrow,
  util_zapper,
}

export const config: Partial<Record<Chains, Data>> = {
  ["testnet-neutron"]: {
    owner: "neutron1dpaaxgw4859qhew094s87l0he8tfea3lq44q9d",
    controller: "neutron1dpaaxgw4859qhew094s87l0he8tfea3lq44q9d",
    fee_collector: "neutron1dpaaxgw4859qhew094s87l0he8tfea3lq44q9d",
    gauges: ["collection"],
    astroport_factory: "neutron1jj0scx400pswhpjes589aujlqagxgcztw04srynmhf0f6zplzn2qqmhwj7",

    candy_fee: "0.05",
    creation_fee: {
      info: toNew(tokens_neutron.ntrn),
      amount: "100000",
    },
    pool_tax: "0.04",
    marketplace: {
      accepted_assets: [
        tokens_neutron_testnet.ntrn,
        tokens_neutron_testnet.astro,
        tokens_neutron_testnet.usdc,
        tokens_neutron_testnet.mars,
        tokens_neutron_testnet.atom,
      ].map(toNew),
      auction_duration: 1 * 24 * 60 * 60,
      extension_duration: 1 * 60 * 60,
      min_bid_increment: "1000",
      protocol_auction_fee: "0.05",
    },
  },
  neutron: {
    owner: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
    controller: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
    fee_collector: "terra1k8ug6dkzntczfzn76wsh24tdjmx944yj6mk063wum7n20cwd7lxq4lppjg",
    gauges: ["collection"],
    astroport_factory: "neutron1hptk0k5kng7hjy35vmh009qd5m6l33609nypgf2yc6nqnewduqasxplt4e",

    candy_fee: "0.05",
    creation_fee: {
      info: toNew(tokens_neutron.ntrn),
      amount: "100000",
    },
    pool_tax: "0.04",
    marketplace: {
      accepted_assets: [],
      auction_duration: 7 * 24 * 60 * 60,
      extension_duration: 4 * 60 * 60,
      min_bid_increment: "1000",
      protocol_auction_fee: "0.05",
    },
  },
};
