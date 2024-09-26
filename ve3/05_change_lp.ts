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
import { AssetConfigFor_String, AssetInfoWithConfigFor_String, ExecuteMsg } from "../types/ve3/asset-staking/execute";
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

  if (!config[network]) {
    throw new Error(`no data available for network ${network}`);
  }

  const gauge = argv.gauge;

  const ww = {
    stable: {
      // WW LUNA-SOLID,
      solid: token("factory/terra18fved7svlqq9q9h23cg4uw97lllmg7fa03psevczy20ayhdwrm3sznjeh5/uLP"),
      // WW LUNA-USDT,
      usdt: token("factory/terra1wymgwg90ry2w04avy899ucmuuak7w8n3xw2msmw2jf9rfugre0ssenx4hn/uLP"),
      // WW LUNA-USDC,
      usdc: token("factory/terra16a45v4k74w3yy30utfxdsekdlnks27sv48sn2suaf4wt7u6meq8scz75mx/uLP"),
    },
    project: {
      // WW USDC-SOLID,
      usdc_solid: token("factory/terra1wje8lj3372njwuw8t4scmyp94t5pyxxh89tsnkrfyxghqh6aunzqz4a9k3/uLP"),
      // WW SWTH,
      swth: token("factory/terra1nll8xy7m2dyac3sww2tg7dqj8s0mlak68drgtzd9gh4yvnvpplhsn3sxnv/uLP"),
      // WW stLUNA,
      stluna: token("factory/terra12exvyhctk6ggqvzj2tlhsv769llctntf5zdj9erz6q2uq4h8hn8q5k5xpg/uLP"),
      // WW ROAR,
      roar: token("factory/terra126w5m24usxydxn0tjqd73k8uw06r42wttahf9t0cjyhmljlqhrdsjucx45/uLP"),
      // WW ASTRO,
      astro: token("factory/terra1hvntefafgn05llkqyl6uxx6j0jjwmqjtxqdrwdm43s9tkzx7xkfqkcl7h6/uLP"),
      // WW WHALE,
      whale: token("factory/terra1zushwxgqdkg22mtv9p946yp53r6den6lv427esjaadua3ftzyjpsqgtl5z/uLP"),
      // WW ampLUNA,
      ampluna: token("terra10un5hr6asmn7g0ggh9sz0x3v8f9evh5cvawk8xs65rghundc25mq7g5par"),
      // WW bLUNA,
      blune: token("terra1q475uvk9te5nxq2lzu0h96t0devmx4v8ctxqtm253ut05wrpugsq0m4e3k"),
    },
    bluechip: [
      // WW ATOM
      token("terra1adp223mw8937arxcfl36acjjyn2dcf7wzp8h09jek5k0gw3vch8sqlq6su"),
      // WW SOL,
      token("factory/terra12u7a9wkjqrkhxjcxx70uhfx8y49j4lclfnet2smw9agpnrv9chps27n9mh/uLP"),
      // WW BNB,
      token("factory/terra1m5juz238n27dd24d9e3kacmqax8gu7j5ee9hhfczpl52f3n7adaqudk2c9/uLP"),
      // WW INJ,
      token("factory/terra1q2gd6kc7nt8xct94chrlsqtpxfs9rve0j76lquce624y5zp85cdseshh85/uLP"),
      // WW USDC-USDT,
      token("factory/terra17vas9rhxhc6j6f5wrup9cqapxn74jvpft069py7l7l9kr7wx3tnsxrazux/uLP"),
      // WW wstETH,
      token("factory/terra12hs75vlyd38zjvhegsqzr8uvz2r764fdy8mhqw0qg0s2mv858yvstwmsf8/uLP"),
      // WW BTC,
      token("factory/terra1aysexulsnuxna62m5rlnuzfcvct3df93gd4q0kkjtjcqsvv93s5sd0fyd2/uLP"),
    ],
  };

  const astro = {
    stable: {
      // ASTRO LUNA-SOLID,
      solid: token("terra14arerdfc88cdv6m6frc03a0963z877756kqac4h4xvd9vftn0hqqhquca8", true),
      // ASTRO LUNA-USDT,
      usdt: token("terra14h48hukanmfv6wrrs50m4w2f9hf09lakwl5d5pkpt4rpl3gtg7ks4ye6d4", true),
      // ASTRO LUNA-USDC,
      usdc: token("terra1yqp35sjllqjqh25pt49pcqnnpe3960tanmf2upfadej2gdumz6psn8t5vp", true),
      // ASTRO LUNA-USDC-PCL,
      usdc_pcl: token("terra1s275y73lfupag0g03nglxaedfnsw5z4m5zc9wk66guy503zuw5ss889tlx", true),
    },
    project: {
      // ASTRO USDC-SOLID,
      solid: token("terra12usr3jlgvuzq70kpt6u03stxrgzwpjxnej6herpuw9t7echj8z3q44dyyk", true),
      // ASTRO SWTH,
      swth: token("terra1wwy8xjk4mff7qp2g7qzmgfu9agd6wjdmz99crj94zv9tmh7dvhmq0jsf6a", true),
      // ASTRO stLUNA,
      stluna: token("terra14n22zd24nath0tf8fwn468nz7753rjuks67ppddrcqwq37x2xsxsddqxqc", true),
      // ASTRO ROAR,
      roar: token("terra1vczn40ch624g2kserhzqu2n69j3h7h7c5nfeznw96pnxjuly5h5s25u9dm", true),
      // ASTRO ASTRO,
      astro: token("terra14lul8rjcad0jeuu680n4q7dwgxjkr6mqzx8umyewj8c6xn93squqllleht", true),
      // ASTRO WHALE,
      whale: token("terra1a2nc0k4m6hun6yr4g6ujnc46wlpfuywzves689at3tdkezrjg8wq7p35ra", true),
      whale_pcl: token("terra1stavsz7hhsw56tngxt6p5xmkm86a9nvgztgvv56wj7q6yceutmwsvrwjdz", true),
      // ASTRO ampLUNA,
      ampluna: token("terra1my4tml2ae4zewq0u5fpq2qzq4rdpfh5pq7y3eekxxhwxdwdmce4shw9mt4", true),
      // ASTRO bLUNA,
      bluna: token("terra1h3z2zv6aw94fx5263dy6tgz6699kxmewlx3vrcu4jjrudg6xmtyqk6vt0u", true),
    },
    bluechip: [
      // ASTRO ATOM
      token("terra19xrvvkq5607xudcxvw444yycjz6e3vk3l8p633z68k0vv5q09wnsa9q2qt", true),
      // ASTRO SOL,
      token("terra1vc66wpr2ghcesnf203em6yefpze3vrmq99n8yz0me3jzs6g4e8rs2kec75", true),
      // ASTRO BNB,
      token("terra12eu8jk4w7lgn2rk7xs46nz7c7r9fw8q98afy9adlwtkghazj40asjf65zu", true),
      // ASTRO INJ,
      token("terra1euf8klqukk4wlly90nve0n6drqvq9pst73wc34pruuvx09nptxyse68hgl", true),
      // ASTRO USDC-USDT,
      token("terra1huw82c9grj9xz9umkc8hqcjqgndadlkrp8rn9u6eh5jh5j2s2t7qs33vry", true),
      // ASTRO wstETH,
      token("terra19d8tttv0lvhwpj828qqrcmm6yaqdfhrchfheuufcw4kywtmk9u3q98ask3", true),
      // ASTRO BTC,
      token("terra1a5apghncafx0nem740fsrmd6demaywvp332a4uat63u2jtwn8mgsz7khkw", true),
    ],
  };
  const stable = getInfo("ve3", network, Ve3InfoKeys.asset_staking_addr("stable"));
  const project = getInfo("ve3", network, Ve3InfoKeys.asset_staking_addr("project"));

  const address = admin.key.accAddress(getPrefix());
  const { txhash } = await sendTxWithConfirm(
    admin,
    [
      addProposal(
        new MsgExecuteContract(address, stable, <ExecuteMsg>{
          remove_assets: [astro.stable.usdc.info],
        })
      ),
      addProposal(
        new MsgExecuteContract(address, project, <ExecuteMsg>{
          remove_assets: [astro.project.whale.info],
        })
      ),
      addProposal(
        new MsgExecuteContract(address, stable, <ExecuteMsg>{
          whitelist_assets: [astro.stable.usdc_pcl],
        })
      ),
      addProposal(
        new MsgExecuteContract(address, project, <ExecuteMsg>{
          whitelist_assets: [astro.project.whale_pcl],
        })
      ),
      done("[asset-staking] Change Whitelist", "terra1k8ug6dkzntczfzn76wsh24tdjmx944yj6mk063wum7n20cwd7lxq4lppjg"),
    ].filter(notEmpty)
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();

function token(denom: string, isastroport = false): AssetInfoWithConfigFor_String {
  const config: AssetConfigFor_String | null = !isastroport
    ? null
    : {
        stake_config: {
          astroport: {
            contract: "terra1eywh4av8sln6r45pxq45ltj798htfy0cfcf7fy3pxc2gcv6uc07se4ch9x",
            reward_infos: [toNew(tokens.astro_native)],
          },
        },
      };

  if (denom.startsWith("factory")) {
    return {
      info: {
        native: denom,
      },
      config,
    };
  } else {
    return {
      info: {
        cw20: denom,
      },
      config,
    };
  }
}
