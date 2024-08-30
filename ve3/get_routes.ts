/* eslint-disable @typescript-eslint/no-non-null-assertion */
import yargs from "yargs/yargs";
import { tokens } from "../amp-compounder/tokens";
import { Chains, createLCDClient, getInfo, getToken } from "../helpers";
import { AssetInfoBaseFor_Addr } from "../types/alliance-hub-lst/eris_alliance_hub_lst_whitewhale_execute";
import { AssetInfo } from "../types/ampz/eris_ampz_execute";
import { RouteResponseItem } from "../types/ve3/zapper/response_to_get_routes";
import { Ve3InfoKeys, config } from "./config";

const argv = yargs(process.argv)
  .options({
    network: {
      type: "string",
      demandOption: true,
    },
  })
  .parseSync();

(async function () {
  const network = argv["network"] as Chains;
  const terra = createLCDClient(network);

  if (!config[network]) {
    throw new Error(`no data available for network ${network}`);
  }

  const zapper = getInfo("ve3", network, Ve3InfoKeys.zapper_addr);

  const configResponse = await terra.wasm.contractQuery<any>(zapper, {
    config: {},
  });
  console.log("CONFIG", configResponse);

  const tokensUntyped: Record<string, AssetInfo> = tokens;

  const contractToToken = new Map(
    Object.keys(tokens).map((key) => [getToken(tokensUntyped[key]), key])
  );

  const getRoutes = (
    start_after: [AssetInfoBaseFor_Addr, AssetInfoBaseFor_Addr] | null
  ) => {
    return terra.wasm.contractQuery<RouteResponseItem[]>(zapper, {
      get_routes: { limit: 100, start_after },
    });
  };

  let start_with: null | [AssetInfoBaseFor_Addr, AssetInfoBaseFor_Addr] = null;
  let length = 100;

  try {
    while (length === 100) {
      const existingRoutes = await getRoutes(start_with);

      for (const route of existingRoutes) {
        const used = route.key.map((b) => contractToToken.get(getToken(b))!);
        console.log(
          route.key.map((a) => getToken(a)),
          used,
          route.stages
            .map(
              (stage) =>
                Object.keys(stage.stage_type).join(" ") +
                `->(${contractToToken.get(getToken(stage.to))})`
            )
            .join("->")
        );
      }

      console.log("read next, current length:", existingRoutes.length);
      length = existingRoutes.length;

      const last: any = existingRoutes[existingRoutes.length - 1].key;

      start_with = last;
    }
  } catch (error) {
    console.log(error);
  }
})();
