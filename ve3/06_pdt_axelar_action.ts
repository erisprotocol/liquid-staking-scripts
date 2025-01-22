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
    fromSymbol: string,
    fromInfo: AssetInfo,
    toSymbol: string,
    toInfo: AssetInfo,
    fromDecimals = 1e6,
    toDecimals = 1e6
  ) => {
    const discountPrice = price * (1 - discount);
    amount = amount / discountPrice;
    const expected = amount * discountPrice;

    const name = `OTC ${amount.toFixed(5)} ${fromSymbol} -> ${expected.toFixed(5)} ${toSymbol}`;

    console.log(name, price);
    return addProposal(
      new MsgExecuteContract(address, contract, <ExecuteMsg>{
        setup: {
          name,
          action: {
            otc: {
              amount: {
                amount: (amount * fromDecimals).toFixed(0),
                info: toNew(fromInfo),
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


  const addPayment = (name: string, amount: number, info: AssetInfo, recipient: string, toDecimals = 1e6) => {
    console.log(name, amount);
    return addProposal(
      new MsgExecuteContract(address, contract, <ExecuteMsg>{
        setup: {
          name,
          action: {
            payment: {
              payments: [
                {
                  asset: {
                    amount: (amount * toDecimals).toFixed(0),
                    info: toNew(info),
                  },
                  recipient,
                },
              ],
            },
          },
        },
      })
    );
  };

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      // cancelAction(25),
      // cancelAction(26),
      // cancelAction(28),
      // cancelAction(29),

      // cancelAction(8),
      // addOtc(150000, lunaPrice, 0.02, "USDC", tokens.usdc, 1e6),
      // addOtc(200000, lunaPrice, 0.01, "axlUSDC", tokens.axlUsdc, 1e6),
      // addOtc(50000, lunaPrice, 0.01, "axlUSDT", tokens.axlUsdt, 1e6),
      // addOtc(50000, lunaPrice / btcPrice, 0.01, "WBTC.axl", tokens.axlWbtc, 1e8),
      // addOtc(1281870, 1, 0.005, 'USDC', tokens.usdc, "USDC.axl", tokens.axlUsdc, 1e6, 1e6),
      // addOtc(67667, 1, 0.01, 'USDC', tokens.usdc, "USDT.axl", tokens.axlUsdt, 1e6, 1e6),
      // addOtc(1.104, 1, 0.005, 'WBTC.osmo', tokens.wbtc, "WBTC.axl", tokens.axlWbtc, 1e8, 1e8),
      addPayment(
        "Refund 651,103.000000 LUNA to recovery multi-sig",
        651103.0,
        tokens.luna,
        "terra1uh34jacuacgzlc7tmd99txafk29g22zqkdervya9nktzhu2q3hlsenfcyq"
      ),
      // addPayment(
      //   "Withdraw 259.310430 axlUSDT",
      //   259.310430,
      //   tokens.axlUsdt,
      //   "terra1k8ug6dkzntczfzn76wsh24tdjmx944yj6mk063wum7n20cwd7lxq4lppjg"
      // ),
      // addPayment(
      //   "Withdraw 0.00065203 axlWBTC",
      //   0.00065203,
      //   tokens.axlWbtc,
      //   "terra1k8ug6dkzntczfzn76wsh24tdjmx944yj6mk063wum7n20cwd7lxq4lppjg"
      // ),
      // addPayment(
      //   "Withdraw 0.589847 WBTC",
      //   0.589847,
      //   tokens.wbtc,
      //   "terra1k8ug6dkzntczfzn76wsh24tdjmx944yj6mk063wum7n20cwd7lxq4lppjg"
      // ),
      // addPayment(
      //   "Withdraw 3429.340594 USDC",
      //   3429.340594,
      //   tokens.usdc,
      //   "terra1k8ug6dkzntczfzn76wsh24tdjmx944yj6mk063wum7n20cwd7lxq4lppjg"
      // ),





      done(
        `[axelar-recovery] Refund 651,103.000000 LUNA to recovery multi-sig`,
        ".",
        "terra1k8ug6dkzntczfzn76wsh24tdjmx944yj6mk063wum7n20cwd7lxq4lppjg"
      ),
      // done(
      //   `[pdt] Setup remaining OTC (CoinGecko: ${lunaPrice.toFixed(5)}, ${btcPrice.toFixed(5)})`,
      //   ".",
      //   "terra1k8ug6dkzntczfzn76wsh24tdjmx944yj6mk063wum7n20cwd7lxq4lppjg"
      // ),
    ].filter(notEmpty)
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
