import yargs from "yargs/yargs";
import { Chains, createLCDClient, getInfo, getToken } from "../helpers";
import { AssetInfo } from "../types/ampz/eris_ampz_execute";
import { QueryMsg } from "../types/ve3/asset-staking/query";
import { ArrayOf_AssetInfoWithRuntime as Resp } from "../types/ve3/asset-staking/response_to_whitelisted_asset_details";
import { Ve3InfoKeys, config } from "./config";

const argv = yargs(process.argv)
  .options({
    network: {
      type: "string",
      demandOption: true,
    },
  })
  .parseSync();

export interface LpInfo {
  pair: string;
  lp: string;
  tokens: string[];
  type: "Astroport" | "WhiteWhale";
}

(async function () {
  const network = argv["network"] as Chains;
  const terra = createLCDClient(network);

  if (!config[network]) {
    throw new Error(`no data available for network ${network}`);
  }

  const gauges: Record<string, any> = getInfo("ve3", network, Ve3InfoKeys.gauges);

  const result: LpInfo[] = [];

  for (const gauge in gauges) {
    const addr = gauges[gauge][Ve3InfoKeys.asset_staking_addr_str] as string;
    const lps = await terra.wasm.contractQuery<Resp>(addr, <QueryMsg>{
      whitelisted_asset_details: {},
    });

    for (const lp of lps) {
      const is_astroport = typeof lp.config.stake_config === "object" && "astroport" in lp.config.stake_config;

      let pair_contract = "";
      let lp_denom = "";
      if ("cw20" in lp.info) {
        lp_denom = lp.info.cw20;
        const minter = await terra.wasm.contractQuery<{ minter: string }>(lp.info.cw20, {
          minter: {},
        });
        pair_contract = minter.minter;
      } else {
        lp_denom = lp.info.native;
        pair_contract = lp.info.native.split("/")[1];
      }

      const pair = await terra.wasm.contractQuery<{ asset_infos: AssetInfo[] }>(pair_contract, { pair: {} });

      result.push({
        lp: lp_denom,
        pair: pair_contract,
        tokens: pair.asset_infos.map((a) => getToken(a)),
        type: is_astroport ? "Astroport" : "WhiteWhale",
      });
    }
  }
  const res = JSON.stringify(result)
    .replace(/"Astroport"/gi, "PairType.Astroport")
    .replace(/"WhiteWhale"/gi, "PairType.WhiteWhale");

  console.log(res);
})();
