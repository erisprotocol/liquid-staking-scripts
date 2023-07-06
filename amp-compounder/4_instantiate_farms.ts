import { TxLog } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  instantiateMultipleWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { InstantiateMsg } from "../types/amp-compounder/astroport_farm/eris_astroport_farm_instantiate";

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

// ts-node 4_instantiate_farms.ts --network testnet --key testnet --contract-code-id 4813
// ts-node amp-compounder/4_instantiate_farms.ts --network mainnet --key ledger --contract-code-id 1170

//

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

  mainnet: <InstantiateMsg>{
    amp_lp: {
      cw20_code_id: 12,
      decimals: 6,
      name: "",
      symbol: "",
    },
    base_reward_token:
      "terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26",
    compound_proxy:
      "terra1cs0tkknd2t94jd7hgdkmfyvenwr05ztra4rj6uackr597j9jfkxsghtywg",
    controller: "terra1gtuvt6eh4m67tvd2dnfqhgks9ec6ff08c5vlup",
    fee: "0.05",
    fee_collector:
      "terra1v3h5lejqer5qnjnj6gds94u55x0qsxq7cpxs2kf7kqu6drwgmz4qd9qav9",
    liquidity_token: "",
    owner: "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
    staking_contract:
      "terra1m42utlz6uvnlzn82f58pfkkuxw8j9vf24hf00t54qfn4k23fhj3q70vqd0",
    deposit_profit_delay_s: 12 * 60 * 60,
  },
};

const lps: Record<string, { lp: string }[]> = {
  testnet: [
    { lp: "terra1n7pgzxhunusffja0mfqls7tntj604s2ywvu2ufuxxqk2spzmttwqc45qh0" }, // ampLUNA-LUNA terra16j2hg99dkln8y0yjhp2zqvvn2xcj5jlmgqdhx3a3sfjjhvnpf4kqp42w62
    // {
    //   lp: "terra15npavsvzqsnphnda67v5jpr2md4fp7gyexeffnv08wp8tlxn88xsjvxkgx",
    // },
    // {
    //   lp: "terra1886vn036tc9e7ejx8pe4nkhts3gwpdfegwc4n3u77n0q76fjdthqarl8uc",
    // },
    // {
    //   lp: "terra1hwwzt7sv386me5t7hy9ujafy6mfnyjl0h8cn92lnqd58jjmeksqstja4ng",
    // },
    // {
    //   lp: "terra1wfl4rrghs2glm874dnzfknl62j2uw6n62mdzcyplg5hfwegyhkzqgkec9z",
    // },
  ],

  mainnet: [
    // {
    //   lp: "terra16esjk7qqlgh8w7p2a58yxhgkfk4ykv72p7ha056zul58adzjm6msvc674t", x
    // },
    // {
    //   lp: "terra18mcmlf4v23ehukkh7qxgpf5tznzg6893fxmf9ffmdt9phgf365zqvmlug6", x
    // },
    // {
    //   lp: "terra1ces6k6jp7qzkjpwsl6xg4f7zfwre0u23cglg69hhj3g20fhygtpsu24dsy",
    // },
    // {
    //   lp: "terra1ckmsqdhlky9jxcmtyj64crgzjxad9pvsd58k8zsxsnv4vzvwdt7qke04hl", x
    // },
    // {
    //   lp: "terra1cq22eugxwgp0x34cqfrxmd9jkyy43gas93yqjhmwrm7j0h5ecrqq5j7dgp",
    // },
    // {
    //   lp: "terra1kggfd6z0ad2k9q8v24f7ftxyqush8fp9xku9nyrjcs2wv0e4kypszfrfd0",
    // },
    // {
    //   lp: "terra1khsxwfnzuxqcyza2sraxf2ngkr3dwy9f7rm0uts0xpkeshs96ccsqtu6nv",
    // },
    // // boneLuna-Luna LP
    // {
    //   lp: "terra1h3z2zv6aw94fx5263dy6tgz6699kxmewlx3vrcu4jjrudg6xmtyqk6vt0u",
    // },
    // RED
    // {
    //   lp: "terra1ua7uk7xvx89dg8tnr8k8smk5vermlaer50zsglmpx8plttaxvvtsem5fgy",
    // },
    // // SAYVE
    // {
    //   lp: "terra1zqthrqndchxp5ye443zdulhhh2938uak78q4ztthfrnkfltpgrpsu3c5xd",
    // },
    // stLUNA-LUNA
    // {
    //   lp: "terra14n22zd24nath0tf8fwn468nz7753rjuks67ppddrcqwq37x2xsxsddqxqc",
    // },
    // // ROAR-LUNA
    // {
    //   lp: "terra1qmr5wagmeej33hsnqdmqyvkq6rg3sfkvflmu6gd6drhtjfpx4y5sew88s4",
    // },
    // SOLID-USDC
    {
      lp: "terra1rdjm94n3r4uvhfh23s98tfcgzedkuvjwvkcjqa503amef9afya7sddv098",
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
    console.log("ampLP", clone.amp_lp);
    msgs.push({
      msg: clone,
      label: "Eris Farm " + token_info.name,
    });
  }
  console.log("MSGS", msgs);

  const result = await instantiateMultipleWithConfirm(
    deployer,
    deployer.key.accAddress(getPrefix()),
    argv.contractCodeId,
    msgs
  );

  const addresses = result.logs.map(
    (a: TxLog) => a.eventsByType["instantiate"]["_contract_address"][0]
  );

  console.log(`Contract instantiated! Address: ${addresses}`);
})();
