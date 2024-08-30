/* eslint-disable @typescript-eslint/no-non-null-assertion */
import yargs from "yargs/yargs";
import { tokens } from "../amp-compounder/tokens";
import { Chains, createLCDClient, getInfo, getToken } from "../helpers";
import { AssetInfo } from "../types/ampz/eris_ampz_execute";
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

  const tokensUntyped: Record<string, AssetInfo> = tokens;

  const contractToToken = new Map(
    Object.keys(tokens).map((key) => [getToken(tokensUntyped[key]), key])
  );

  const getState = (key: string | undefined) => {
    return terra.wasm.contractStates(zapper, {
      "pagination.limit": "100",
      "pagination.key": key,
      "pagination.reverse": "false",
      order_by: "ORDER_BY_ASC",
    } as any);
  };

  const state = "";
  const length = 100;

  try {
    while (length === 100) {
      const existingRoutes = await getState(state);

      console.log(existingRoutes);

      // const used: [string, string][] = existingRoutes.map(
      //   (a) => a.key.map((b) => contractToToken.get(b)!) as [string, string]
      // );
      // length = existingRoutes.length;

      // const last = used[used.length - 1];

      // console.log(used, existingRoutes.length);
      // state = [toNew(tokensUntyped[last[0]]), toNew(tokensUntyped[last[1]])];
      break;
    }
  } catch (error) {
    console.log(error);
  }
})();
