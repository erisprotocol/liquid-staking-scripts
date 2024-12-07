import { MsgExecuteContract } from "@terra-money/feather.js";
import * as axios from "axios";
import { addMonths, setDate, subMonths } from "date-fns";
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
  selectMany,
  sendTxWithConfirm,
  toNew,
} from "../helpers";
import * as keystore from "../keystore";
import { AssetInfo } from "../types/ampz/eris_ampz_execute";
import { ExecuteMsg, Milestone, PaymentDescription } from "../types/ve3/phoenix-treasury/execute";
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
  const contract = argv.contract || getInfo("ve3", network, Ve3InfoKeys.pdt_addr);

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

  const stewardship = "terra1k8ug6dkzntczfzn76wsh24tdjmx944yj6mk063wum7n20cwd7lxq4lppjg";
  const c1 = "terra1gaxzcygjyz7gq8gq9tjy02qq38kcf84um9wy0a";

  const mod1 = "terra1lqqsydqeeccndxcaatgryf4ra8ujnrluk5meqs";
  const mod2 = "terra1xtyq8trkwwvpyjf4z0vltyr0c260pnnfm8vy68";

  const infra1 = "terra18ruqkccl5tp493uhvra0u6jylrzq8t8dv5qs4c";
  const legalContingencyDao = "terra1fnyxf85yd7z5wvwa2fxxspynh40ex9ajlgjr4dg7s9f6rhjma0uqfqr650";

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
  const enableMilestone = (action: number, milestone: number) => {
    return addProposal(
      new MsgExecuteContract(address, contract, <ExecuteMsg>{
        update_milestone: {
          enabled: true,
          id: action,
          index: milestone - 1,
        },
      })
    );
  };

  const generatePaymentSchedule = (dayOfMonth: number, months: number, future = false): Date[] => {
    const today = new Date();

    // Determine the starting month: if today's date is greater than dayOfMonth, start this month, otherwise start last month
    const startMonth = !future ? (today.getDate() > dayOfMonth ? 0 : -1) : today.getDate() > dayOfMonth ? 1 : 0;

    // Get the initial date (last occurrence of the `dayOfMonth`)
    const startDate = setDate(subMonths(today, -startMonth), dayOfMonth);

    // Generate the schedule
    const schedule = Array.from({ length: months }, (_, index) => addMonths(startDate, index));

    // Format the dates (e.g., "dd.MM.")
    return schedule;
  };

  const addPaymentsEachMonth = (
    text: string,
    payments: { amount: number; info: AssetInfo; recipient: string }[],
    schedule: Date[],
    toDecimals = 1e6
  ) => {
    console.log(text, payments, schedule.map((a) => a.toDateString()).join(", "));
    return addProposal(
      new MsgExecuteContract(address, contract, <ExecuteMsg>{
        setup: {
          name: text,
          action: {
            payment: {
              payments: selectMany(payments, (payment) => {
                return schedule.map((time) => {
                  return <PaymentDescription>{
                    asset: {
                      amount: (payment.amount * toDecimals).toFixed(0),
                      info: toNew(payment.info),
                    },
                    recipient: payment.recipient,
                    claimable_after_s: Math.floor(time.getTime() / 1000),
                  };
                });
              }),
            },
          },
        },
      })
    );
  };

  const addMilestones = (name: string, info: AssetInfo, recipient: string, milestones: Milestone[]) => {
    console.log(name, milestones);
    return addProposal(
      new MsgExecuteContract(address, contract, <ExecuteMsg>{
        setup: {
          name,
          action: {
            milestone: {
              asset_info: toNew(info),
              recipient,
              milestones,
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
      // addMilestones("SOLID Protocol Grant", tokens.usdc, "terra1dgmanyfy7ch3qn0g6fvpm6e60pwxdheuujfkee", [
      //   {
      //     amount: (7500 * 1e6).toFixed(0),
      //     text: "Delivery of CAPA",
      //   },
      //   {
      //     amount: (7500 * 1e6).toFixed(0),
      //     text: "Fixing SOLID Oracle Issue, Keplr Integration and Front-End Fixes",
      //   },
      // ]),
      // addPayment("Refund 400$ hydro + 150$ equinox", 550, tokens.usdc, c1),
      // addPaymentsEachMonth(
      //   "mod payments (2024-11-15 - 2025-02-15)",
      //   [
      //     {
      //       amount: 1800,
      //       info: tokens.usdc,
      //       recipient: mod1,
      //     },
      //     {
      //       amount: 1500,
      //       info: tokens.usdc,
      //       recipient: mod2,
      //     },
      //   ],
      //   generatePaymentSchedule(1, 3, true)
      // ),
      // addPaymentsEachMonth(
      //   "infra payments (2024-11-15 - 2025-02-15)",
      //   [
      //     {
      //       amount: 400,
      //       info: tokens.usdc,
      //       recipient: infra1,
      //     },
      //   ],
      //   generatePaymentSchedule(1, 3, true)
      // ),
      // cancelAction(8),
      // addOtc(300000, lunaPrice, 0.02, "USDC", tokens.usdc, 1e6),
      // addOtc(600000, lunaPrice, 0.01, "axlUSDC", tokens.axlUsdc, 1e6),
      // addOtc(150000, lunaPrice, 0.01, "axlUSDT", tokens.axlUsdt, 1e6),
      // addOtc(100000, lunaPrice / btcPrice, 0.01, "axlWBTC", tokens.axlWbtc, 1e8),
      // done(
      //   `[pdt] Transfer 40k LUNA for Long Term Alignment Program`,
      //   "LUNA will be locked with an auto max lock and distributed as lock to Veto Multi-Sig participants.",
      //   "terra1k8ug6dkzntczfzn76wsh24tdjmx944yj6mk063wum7n20cwd7lxq4lppjg"
      // ),
      // done(
      //   `[pdt] Setup SOLID Protocol Grant`,
      //   "",
      //   "terra1k8ug6dkzntczfzn76wsh24tdjmx944yj6mk063wum7n20cwd7lxq4lppjg"
      // ),
      // done(`[pdt] Setup mod payments`, ".", "terra1k8ug6dkzntczfzn76wsh24tdjmx944yj6mk063wum7n20cwd7lxq4lppjg"),
      enableMilestone(11, 2),
      done(
        `[pdt] Enable SOLID Protocol Grant - Milestone 2`,
        ".",
        "terra1k8ug6dkzntczfzn76wsh24tdjmx944yj6mk063wum7n20cwd7lxq4lppjg"
      ),
      // addPayment("Setup Legal Contingency DAO", 70000, tokens.usdc, legalContingencyDao),
      // done(
      //   `[pdt] Setup Legal Contingency DAO - 70k USDC`,
      //   ".",
      //   "terra1k8ug6dkzntczfzn76wsh24tdjmx944yj6mk063wum7n20cwd7lxq4lppjg"
      // ),
      // done(
      //   `[pdt] Setup OTC (CoinGecko: ${lunaPrice.toFixed(5)}, ${btcPrice.toFixed(5)})`,
      //   ".",
      //   "terra1k8ug6dkzntczfzn76wsh24tdjmx944yj6mk063wum7n20cwd7lxq4lppjg"
      // ),
    ].filter(notEmpty)
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
