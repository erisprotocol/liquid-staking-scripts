import { MsgExecuteContract } from "@terra-money/feather.js";
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
  const amount = 9990;
  const price = 0.3587;
  const discount = 0.05;
  const discountPrice = price * (1 - discount);
  const expected = amount * discountPrice;

  const name = `OTC ${amount.toFixed(2)} LUNA -> ${expected.toFixed(2)} axlUSDC`;

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      addProposal(
        new MsgExecuteContract(address, contract, <ExecuteMsg>{
          setup: {
            name: name,
            action: {
              otc: {
                amount: {
                  amount: (amount * 1e6).toFixed(0),
                  info: toNew(tokens.luna),
                },
                into: {
                  amount: (expected * 1e6).toFixed(0),
                  info: toNew(tokens.axlUsdc),
                },
              },
            },
          },
        })
      ),
      done(
        `[axelar-recovery] Setup ${name} @${discountPrice.toFixed(4)} (CoinGecko: ${price})`,
        "terra1k8ug6dkzntczfzn76wsh24tdjmx944yj6mk063wum7n20cwd7lxq4lppjg"
      ),
    ].filter(notEmpty)
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
