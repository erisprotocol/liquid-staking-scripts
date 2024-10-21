import { MsgExecuteContract } from "@terra-money/feather.js";
import * as axios from "axios";
import yargs from "yargs/yargs";
import { tokens } from "../amp-compounder/tokens";
import { notEmpty } from "../cosmos/helpers";
import {
  addProposal,
  Chains,
  createLCDClient,
  createWallet,
  done,
  getInfo,
  getPrefix,
  sendTxWithConfirm,
  toNew,
} from "../helpers";
import * as keystore from "../keystore";
import { AssetInfo } from "../types/ampz/eris_ampz_execute";
import { ExecuteMsg } from "../types/ve3/phoenix-treasury/execute";
import { config, Ve3InfoKeys } from "./config";

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
  const contract = argv.contract || getInfo("ve3", network, Ve3InfoKeys.pdt_axl_recovery_addr);

  if (!config[network]) {
    throw new Error(`no data available for network ${network}`);
  }

  const ids = ["terra-luna-2", "bitcoin"];
  const idString = ids.join(",");
  const prices = await axios.default.get<Record<string, { usd: number }>>(
    `https://api.coingecko.com/api/v3/simple/price?ids=${idString}&vs_currencies=usd`
  );
  const lunaPrice = prices.data["terra-luna-2"].usd;
  const btcPrice = prices.data["bitcoin"].usd;

  // const amount = 600000;
  // const discount = 0.01;

  const cancelAction = (id: number) => {
    return addProposal(
      new MsgExecuteContract(address, contract, <ExecuteMsg>{
        cancel: {
          id: id,
        },
      })
    );
  };

  const addOtc = (
    amount: number,
    price: number,
    discount: number,
    toSymbol: string,
    toInfo: AssetInfo,
    toDecimals = 1e6
  ) => {
    const discountPrice = price * (1 - discount);
    const expected = amount * discountPrice;

    const name = `OTC ${amount.toFixed(5)} LUNA -> ${expected.toFixed(5)} ${toSymbol}`;

    console.log(name, price);
    return addProposal(
      new MsgExecuteContract(address, contract, <ExecuteMsg>{
        setup: {
          name,
          action: {
            otc: {
              amount: {
                amount: (amount * 1e6).toFixed(0),
                info: toNew(tokens.luna),
              },
              into: {
                amount: (expected * toDecimals).toFixed(0),
                info: toNew(toInfo),
              },
            },
          },
        },
      })
    );
  };

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      cancelAction(8),
      // addOtc(600000, lunaPrice, 0.01, "axlUSDC", tokens.axlUsdc, 1e6),
      // addOtc(150000, lunaPrice, 0.01, "axlUSDT", tokens.axlUsdt, 1e6),
      addOtc(100000, lunaPrice / btcPrice, 0.01, "axlWBTC", tokens.axlWbtc, 1e8),
      done(
        `[axelar-recovery] Cancel BTC OTC and Setup new OTC batch (CoinGecko: ${lunaPrice.toFixed(
          5
        )}, ${btcPrice.toFixed(5)})`,
        "terra1k8ug6dkzntczfzn76wsh24tdjmx944yj6mk063wum7n20cwd7lxq4lppjg"
      ),
    ].filter(notEmpty)
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
