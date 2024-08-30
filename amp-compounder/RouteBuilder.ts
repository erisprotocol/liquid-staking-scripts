import { LCDClient } from "@terra-money/feather.js";
import { AssetInfo } from "../types/ampz/eris_ampz_execute";

export function getToken(a: AssetInfo) {
  if ("token" in a) {
    return a.token.contract_addr;
  } else {
    return a.native_token.denom;
  }
}

export class RouteBuilder {
  assets: AssetInfo[] = [];
  routes: {
    type: "astroport" | "whitewhale";
    assets: AssetInfo[];
    pair: string | undefined;
  }[] = [];
  current: AssetInfo | undefined;

  static start(asset: AssetInfo) {
    return new RouteBuilder().create(asset);
  }

  private create(asset: AssetInfo) {
    this.current = asset;
    this.assets.push(asset);
    return this;
  }

  toTfmRoute(): [string, string][] {
    return this.routes.map((a) => [a.type, a.pair!]);
  }

  astro(asset: AssetInfo) {
    const assets = [this.current!, asset];
    this.create(asset);
    this.routes.push({
      assets: assets,
      pair: undefined,
      type: "astroport",
    });
    return this;
  }

  whale(asset: AssetInfo) {
    const assets = [this.current!, asset];
    this.create(asset);
    this.routes.push({
      assets: assets,
      pair: undefined,
      type: "whitewhale",
    });
    return this;
  }

  pair(asset: AssetInfo, pair: string) {
    const assets = [this.current!, asset];
    this.create(asset);
    this.routes.push({
      assets: assets,
      pair,
      type: "whitewhale",
    });
    return this;
  }

  async preparePairs(cache: Record<string, string>, client: LCDClient) {
    for (const route of this.routes) {
      const tokens = route.assets.map((a) => getToken(a));
      tokens.sort();

      const key = `${route.type}:${tokens.join("-")}`;

      if (!route.pair) {
        if (cache[key]) {
          route.pair = cache[key];
        } else {
          let pair = "";
          if (route.type === "astroport") {
            const factory =
              "terra14x9fr055x5hvr48hzy2t4q7kvjvfttsvxusa4xsdcy702mnzsvuqprer8r";
            const response = await client.wasm.contractQuery<{
              contract_addr: string;
            }>(factory, {
              pair: {
                asset_infos: route.assets,
              },
            });

            pair = response.contract_addr;
          } else {
            const factory =
              "terra1f4cr4sr5eulp3f2us8unu6qv8a5rhjltqsg7ujjx6f2mrlqh923sljwhn3";
            const response = await client.wasm.contractQuery<{
              contract_addr: string;
            }>(factory, {
              pair: {
                asset_infos: route.assets,
              },
            });

            pair = response.contract_addr;
          }

          cache[key] = pair;
          route.pair = pair;
          console.log(`['${key}']: '${pair}',`);
        }
      }
    }
  }
}
