import { TxLog } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import { tokens } from "../amp-compounder/tokens";
import { Chains, addInfo, createLCDClient, createWallet, getInfo, getPrefix, instantiateWithConfirm } from "../helpers";
import * as keystore from "../keystore";
import { InstantiateMsg } from "../types/ve3/voting-escrow/instantiate";
import { SuperInfoKeys } from "./config";

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
    "contract-code-id": {
      type: "number",
      demandOption: true,
    },
    label: {
      type: "string",
      demandOption: true,
    },
  })
  .parseSync();

const templates: Partial<Record<Chains, any>> = {
  "mainnet-copy": <InstantiateMsg>{
    global_config_addr: "",
    deposit_assets: [
      {
        config: "default",
        info: {
          native: "uluna",
        },
      },
      {
        config: {
          exchange_rate: {
            contract: "terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk",
          },
        },
        info: {
          cw20: tokens.ampluna.token.contract_addr,
        },
      },
    ],
  },
  mainnet: <InstantiateMsg>{
    global_config_addr: "",
    deposit_assets: [
      {
        config: "default",
        info: {
          native: "uluna",
        },
      },
      {
        config: {
          exchange_rate: {
            contract: "terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk",
          },
        },
        info: {
          cw20: tokens.ampluna.token.contract_addr,
        },
      },

      {
        config: {
          exchange_rate: {
            contract: "terra1l2nd99yze5fszmhl5svyh5fky9wm4nz4etlgnztfu4e8809gd52q04n3ea",
          },
        },
        info: {
          cw20: tokens.boneluna.token.contract_addr,
        },
      },

      {
        config: "default",
        info: {
          native: "ibc/08095CEDEA29977C9DD0CE9A48329FDA622C183359D5F90CF04CC4FF80CBE431",
        },
      },
    ],
  },
};

(async function () {
  const network = argv["network"] as Chains;
  const terra = createLCDClient(network);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const msg = templates[network] as InstantiateMsg;
  msg.global_config_addr = getInfo("super", network, SuperInfoKeys.global_config_addr);

  console.log(msg);

  const result = await instantiateWithConfirm(
    deployer,
    deployer.key.accAddress(getPrefix()),
    argv.contractCodeId,
    msg,
    argv.label
  );

  const addresses = result.logs.map((a: TxLog) => a.eventsByType["instantiate"]["_contract_address"][0]);

  console.log(`Contract instantiated! Address: ${addresses}`);
  addInfo("super", network, SuperInfoKeys.voting_escrow_addr, addresses[0]);
})();
