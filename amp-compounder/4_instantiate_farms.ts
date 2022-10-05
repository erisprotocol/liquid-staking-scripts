import { TxLog } from "@terra-money/terra.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  instantiateMultipleWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { InstantiateMsg } from "../types/amp-compounder/astroport_farm/instantiate_msg";

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
  })
  .parseSync();

// ts-node 4_instantiate_farms.ts --network testnet --key testnet --contract-code-id 4547

const templates: Record<string, InstantiateMsg> = {
  testnet: <InstantiateMsg>{
    amp_lp: {
      cw20_code_id: 125,
      decimals: 6,
      name: "",
      symbol: "",
    },
    base_reward_token:
      "terra167dsqkh2alurx997wmycw9ydkyu54gyswe3ygmrs4lwume3vmwks8ruqnv",
    compound_proxy:
      "terra1pk3hj8k0nasnru5p0pfrsrhkfpqdway8ef8rqzn204r0ykvz8srqvyf4x0",
    controller: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
    fee: "0.05",
    fee_collector:
      "terra1250jufq9xdxkkgakx27elqzch53curh94tyy0gugd2k35kmjnszs9zawyf",
    liquidity_token: "",
    owner: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
    staking_contract:
      "terra19cs7ml4ktecpp26x3udx6cvmhmp09rg3y0h8c0qles05hned0xxsgp46nr",
  },
};

const lps: Record<string, { lp: string }[]> = {
  testnet: [
    {
      lp: "terra15npavsvzqsnphnda67v5jpr2md4fp7gyexeffnv08wp8tlxn88xsjvxkgx",
    },
    {
      lp: "terra1886vn036tc9e7ejx8pe4nkhts3gwpdfegwc4n3u77n0q76fjdthqarl8uc",
    },
    {
      lp: "terra1hwwzt7sv386me5t7hy9ujafy6mfnyjl0h8cn92lnqd58jjmeksqstja4ng",
    },
    {
      lp: "terra1wfl4rrghs2glm874dnzfknl62j2uw6n62mdzcyplg5hfwegyhkzqgkec9z",
    },
  ],
};

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const msg = templates[argv["network"]];
  const init_lps = lps[argv["network"]];

  const msgs: { label: string; msg: any }[] = [];

  for (const init of init_lps) {
    const clone: InstantiateMsg = JSON.parse(JSON.stringify(msg));
    const liquidity_token = init.lp;
    const token_info = await deployer.lcd.wasm.contractQuery<{
      name: string;
      symbol: string;
    }>(liquidity_token, { token_info: {} });

    clone.amp_lp.name = "amp-" + token_info.name;
    clone.amp_lp.symbol = "ampLP";
    clone.liquidity_token = liquidity_token;
    msgs.push({
      msg: clone,
      label: "Eris Farm " + token_info.name,
    });
  }

  const result = await instantiateMultipleWithConfirm(
    deployer,
    deployer.key.accAddress,
    argv.contractCodeId,
    msgs
  );

  const addresses = result.logs.map(
    (a: TxLog) => a.eventsByType["instantiate"]["_contract_address"][0]
  );

  console.log(`Contract instantiated! Address: ${addresses}`);
})();
