import { LCDClient, MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import { tokens } from "../amp-compounder/tokens";
import {
  createLCDClient,
  createWallet,
  delayPromise,
  encodeBase64,
  getPrefix,
  instantiateWithConfirm,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { AssetInfo } from "../types/ampz/eris_ampz_execute";

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
    pair: {
      type: "string",
      demandOption: true,
    },
  })
  .parseSync();

// MAINNET
// ts-node astroport/setup_reward_proxy.ts --network mainnet --key mainnet --pair roar_luna
// ts-node astroport/setup_reward_proxy.ts --network mainnet --key mainnet --pair roar_luna_cl
// ts-node astroport/setup_reward_proxy.ts --network mainnet --key mainnet --pair solid_ampluna
// ts-node astroport/setup_reward_proxy.ts --network mainnet --key mainnet --pair solid_usdc
// ts-node astroport/setup_reward_proxy.ts --network mainnet --key mainnet --pair luna_capa

interface TokenConfig {
  name: string;
  pair: string | [AssetInfo, AssetInfo];
  reward_token: string;
  lp_staking?: string;
  proxy_generator?: string;
}

const templates: Record<
  string,
  {
    lp_code_id: number;
    proxy_code_id: number;
    generator: string;
    factory: string;
    pair: Record<string, TokenConfig>;
  }
> = {
  testnet: {
    lp_code_id: 0,
    proxy_code_id: 0,
    generator: "",
    factory: "",
    pair: {},
  },
  mainnet: {
    lp_code_id: 180,
    proxy_code_id: 187,
    generator:
      "terra1ksvlfex49desf4c452j6dewdjs6c48nafemetuwjyj6yexd7x3wqvwa7j9",
    factory: "terra14x9fr055x5hvr48hzy2t4q7kvjvfttsvxusa4xsdcy702mnzsvuqprer8r",
    pair: {
      roar_luna: {
        name: "Lion DAO",
        pair: "terra1c7g9pmz2xxe66g8ujpe5tlmj3pawjp290f57cl43j6vswkdtrvwqkgme9q",
        reward_token: tokens.roar.token.contract_addr,
        lp_staking:
          "terra1ffeg5l5wnggpzw6k8wlmcsgsv47v0n4mqu60xwq32cm4jmq47sqq8ksnyk",
        proxy_generator:
          "terra1chdtp8z4wcu3g3g2qqdame8a5jjt0jvnajgux54h5udgp3gx6dqs5ylcxh",
      },
      roar_luna_cl: {
        name: "Lion DAO CL",
        pair: "terra189v2ewgfx5wdhje6geefdtxefeemujplk8qw2wx3x5hdswn95l8qf4n2r0",
        reward_token: tokens.roar.token.contract_addr,
        lp_staking:
          "terra1zhul64nwhldj756gtu7qmp5fdu6f2l0p5rmh4pquxhldw800e8fsqjrle7",
        proxy_generator:
          "terra1zxwam5gmqvkxrj4j5s8ct92mxyd90x8snv4m7m46j685kf8d3krs4k76pq",
      },
      solid_ampluna: {
        name: "Capapult ampLUNA-SOLID",
        pair: [tokens.solid, tokens.ampluna],
        reward_token: tokens.capa.token.contract_addr,
        proxy_generator:
          "terra1e3srjnr73vjpycfd0vdfnj6kmuas4mf947ux6zl9enl26580l76s9jzm74",
        lp_staking:
          "terra1ep7rzvxfw3nz7lfj0ux2emam37wx60jkrlmvkzn2t3cqkxt0uzkq8gann8",
      },
      solid_usdc: {
        name: "Capapult SOLID-axlUSDC",
        pair: [tokens.solid, tokens.usdc],
        reward_token: tokens.capa.token.contract_addr,
        proxy_generator:
          "terra1xmrywqgwprf6elkvl3tnnq53hle8y6aqatnmsznh0gfplelq3qdsj7xh86",
        lp_staking:
          "terra1q0xxntsv7atf87sjx28lpzwhda0cwtz34ppw0lv22vpsul3vwquqxv8j6u",
      },
      luna_capa: {
        name: "Capapult LUNA-CAPA",
        pair: [tokens.luna, tokens.capa],
        reward_token: tokens.capa.token.contract_addr,
        proxy_generator:
          "terra1s3zlu0xsdwa9f8sy0tnudw7vmnz5fakt738fg93phv2lp0nzu4gslz44yg",
        lp_staking:
          "terra1jevqdkhz0347k5swtq0je76vjum5vtn8szsyv6tk3pqj57u43crqyevz3d",
      },
      // run with ts-node astroport/setup_reward_proxy.ts --network mainnet --key mainnet --pair template
      template: {
        name: "PROJECT",
        pair: "PAIR_CONTRACT",
        reward_token: "REWARD_TOKEN",
      },
    },
  },
};

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);
  const addr = deployer.key.accAddress(getPrefix());

  // https://terrasco.pe/mainnet/codes/187 Generator Proxy
  // https://terrasco.pe/mainnet/codes/180 LP staking
  const config = templates[argv.network];
  const pairConfig = config.pair[argv.pair];

  const pairAddr =
    typeof pairConfig.pair === "string"
      ? pairConfig.pair
      : await getPairContract(terra, config.factory, pairConfig.pair);

  const pairInfo = await terra.wasm.contractQuery<{ liquidity_token: string }>(
    pairAddr,
    {
      pair: {},
    }
  );

  console.log(`LP Token: ${pairInfo.liquidity_token}`);

  const lp_staking = pairConfig.lp_staking
    ? { txhash: "", address: pairConfig.lp_staking }
    : await instantiateWithConfirm(
        deployer,
        addr,
        config.lp_code_id,
        {
          token: pairConfig.reward_token,
          lp_token: pairInfo.liquidity_token,
          pair: pairAddr,
          whitelisted_contracts: [],
          distribution_schedule: [],
        },
        `${pairConfig.name} LP Staking`
      );

  console.log(
    `INIT LP_STAKING: ${lp_staking.txhash ?? "already initialized"} ${
      lp_staking.address
    }`
  );

  await delayPromise(5000);
  const generator_proxy = await instantiateWithConfirm(
    deployer,
    addr,
    config.proxy_code_id,
    {
      generator_contract_addr: config.generator,
      pair_addr: pairAddr,
      lp_token_addr: pairInfo.liquidity_token,
      reward_contract_addr: lp_staking.address,
      reward_token_addr: pairConfig.reward_token,
    },
    `Generator Proxy to ${pairConfig.name}`
  );
  console.log(
    `INIT GENERATOR: ${generator_proxy.txhash} ${generator_proxy.address}`
  );

  await delayPromise(5000);
  const { txhash } = await sendTxWithConfirm(deployer, [
    new MsgExecuteContract(addr, lp_staking.address, {
      update_config: {
        whitelisted_contracts: [generator_proxy.address],
        admin: addr,
      },
    }),
  ]);
  console.log(`UPDATE CONFIG: ${txhash}`);

  const move_to_proxy_msg = {
    wasm: {
      execute: {
        contract_addr: config.generator,
        msg: encodeBase64({
          move_to_proxy: {
            lp_token: pairInfo.liquidity_token,
            proxy: generator_proxy.address,
          },
        }),
        funds: [],
      },
    },
  };

  console.log(`------------------`);
  console.log(`${pairConfig.name}`);
  console.log("");
  console.log(
    `Generator Proxy: https://terrasco.pe/mainnet/address/${generator_proxy.address}`
  );
  console.log("");
  console.log(
    `LP Staking: https://terrasco.pe/mainnet/address/${lp_staking.address}`
  );
  console.log("");
  console.log("Astroport governance message:");
  console.log(JSON.stringify(move_to_proxy_msg));
  console.log("");
  console.log("TODOs:");
  console.log(`- Check messages with Astroport Dev Team`);
  console.log(
    `- Move both contracts & admin over to ${pairConfig.name} (done after the check)`
  );
  console.log(
    "- Deposit reward token into the LP Staking contract & setup distribution schedule (schould be done after the astroport prop passed)"
  );
})();

async function getPairContract(
  lcd: LCDClient,
  factory: string,
  asset_infos: [AssetInfo, AssetInfo]
) {
  const pair = await lcd.wasm.contractQuery<{ contract_addr: string }>(
    factory,
    {
      pair: {
        asset_infos,
      },
    }
  );
  return pair.contract_addr;
}
