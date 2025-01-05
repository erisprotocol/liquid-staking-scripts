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
      luna_solid: token("factory/terra18fved7svlqq9q9h23cg4uw97lllmg7fa03psevczy20ayhdwrm3sznjeh5/uLP"),
      luna_usdt: token("factory/terra1wymgwg90ry2w04avy899ucmuuak7w8n3xw2msmw2jf9rfugre0ssenx4hn/uLP"),
      luna_usdc: token("factory/terra16a45v4k74w3yy30utfxdsekdlnks27sv48sn2suaf4wt7u6meq8scz75mx/uLP"),

      luna_eure: token("factory/terra1gny66hmejvrkra39cn7r8f7y7yg06hy3cv2xehpxraqfgjtdtpnqjtmu53/uLP"),
    },
    project: {
      // WW USDC-SOLID,
      usdc_solid: token("factory/terra1wje8lj3372njwuw8t4scmyp94t5pyxxh89tsnkrfyxghqh6aunzqz4a9k3/uLP"),
      luna_swth: token("factory/terra1nll8xy7m2dyac3sww2tg7dqj8s0mlak68drgtzd9gh4yvnvpplhsn3sxnv/uLP"),
      luna_stluna: token("factory/terra12exvyhctk6ggqvzj2tlhsv769llctntf5zdj9erz6q2uq4h8hn8q5k5xpg/uLP"),
      luna_roar: token("factory/terra126w5m24usxydxn0tjqd73k8uw06r42wttahf9t0cjyhmljlqhrdsjucx45/uLP"),
      luna_astro: token("factory/terra1hvntefafgn05llkqyl6uxx6j0jjwmqjtxqdrwdm43s9tkzx7xkfqkcl7h6/uLP"),
      luna_whale: token("factory/terra1zushwxgqdkg22mtv9p946yp53r6den6lv427esjaadua3ftzyjpsqgtl5z/uLP"),
      luna_ampluna: token("terra10un5hr6asmn7g0ggh9sz0x3v8f9evh5cvawk8xs65rghundc25mq7g5par"),
      luna_bluna: token("terra1q475uvk9te5nxq2lzu0h96t0devmx4v8ctxqtm253ut05wrpugsq0m4e3k"),

      luna_capa: token("factory/terra15rzp38yq2cqy2jnewc9vgzqguf3t2q0gqpv9evg8tckrtqp8x44qezhthc/uLP"),
    },
    bluechip: {
      // WW ATOM
      luna_atom: token("terra1adp223mw8937arxcfl36acjjyn2dcf7wzp8h09jek5k0gw3vch8sqlq6su"),
      luna_sol: token("factory/terra12u7a9wkjqrkhxjcxx70uhfx8y49j4lclfnet2smw9agpnrv9chps27n9mh/uLP"),
      luna_bnb: token("factory/terra1m5juz238n27dd24d9e3kacmqax8gu7j5ee9hhfczpl52f3n7adaqudk2c9/uLP"),
      luna_inj: token("factory/terra1q2gd6kc7nt8xct94chrlsqtpxfs9rve0j76lquce624y5zp85cdseshh85/uLP"),
      usdc_usdt: token("factory/terra17vas9rhxhc6j6f5wrup9cqapxn74jvpft069py7l7l9kr7wx3tnsxrazux/uLP"),
      luna_wsteth: token("factory/terra12hs75vlyd38zjvhegsqzr8uvz2r764fdy8mhqw0qg0s2mv858yvstwmsf8/uLP"),
      luna_wbtcosmo: token("factory/terra1aysexulsnuxna62m5rlnuzfcvct3df93gd4q0kkjtjcqsvv93s5sd0fyd2/uLP"),

      usdc_eure: token("factory/terra1t9uvn05g0hdlx2nnqug3lt3pkla4sfdj0n0xnd66kmwvyt25y65sk37cej/uLP"),
    },

    // Missing: wETH-wstETH, atom-statom
    single: {
      datom_atom: token("factory/terra1aa8nurhuk7rwedhjyzptggypuxd3y66qp4nsx6ph240g37esdm7qyheqkd/uLP"),
      amproar_roar: token("factory/terra1d8ap3zyd6tfnruuuwvs0t927lr4zwptruhulfwnxjpqzudvyn8usfgl8ze/uLP"),
      rswth_swth: token("factory/terra1nezkc3lxdxv26hqwy44jr7j9typtk39pns254ev52s9guqc2zsyqx7hvc9/uLP"),
      wbtc_wbtc: token("factory/terra13ywdferm4jtcperal9png3cvhtmar5se9nu4r49k7vujrakwy9zqa3rhwe/uLP"),
      ampwhale_whale: token("terra16z3ksy6aqjkug8l3u48q0kvdaqk3dgaytl7ykt6vg2he9d6z9rgslr4k7l"),
      bwhale_whale: token("terra1le46uu9qjk53aktjs8dev96sl9sd2ujvcpspk75pdeg0txfvhyuswm6653"),
      arbluna_luna: token("factory/terra1wttdzwa6pdegtrdjdw49y0pd3dd8qd3cqn89j6t9v978lx05rr8sew5jyq/uLP"),

      statom_atom: token("factory/terra1c439uc3qdlfuqncxae7l07nsdgjtu45g98yhn5ydjn2866nsw3ws0e0vte/uLP"),
      steth_eth: token("factory/terra12252e02w0k5yv9mryctth4j3y2sdas0xremw0jznzwal5v3xeqjst7q537/uLP"),
    },
  };

  const astro = {
    stable: {
      luna_solid: token("terra14arerdfc88cdv6m6frc03a0963z877756kqac4h4xvd9vftn0hqqhquca8", true),
      luna_usdt: token("terra14h48hukanmfv6wrrs50m4w2f9hf09lakwl5d5pkpt4rpl3gtg7ks4ye6d4", true),
      luna_usdc_old: token("terra1yqp35sjllqjqh25pt49pcqnnpe3960tanmf2upfadej2gdumz6psn8t5vp", true),
      luna_usdc_pcl: token("terra1s275y73lfupag0g03nglxaedfnsw5z4m5zc9wk66guy503zuw5ss889tlx", true),

      luna_eure: token("terra1xkt5etsaptddec6achnjlqnx884fwxwuk795fs885v6eyygu6eus7uauhc", true),
    },
    project: {
      luna_solid: token("terra12usr3jlgvuzq70kpt6u03stxrgzwpjxnej6herpuw9t7echj8z3q44dyyk", true),
      luna_swth: token("terra1wwy8xjk4mff7qp2g7qzmgfu9agd6wjdmz99crj94zv9tmh7dvhmq0jsf6a", true),
      luna_stluna: token("terra14n22zd24nath0tf8fwn468nz7753rjuks67ppddrcqwq37x2xsxsddqxqc", true),
      luna_roar: token("terra1vczn40ch624g2kserhzqu2n69j3h7h7c5nfeznw96pnxjuly5h5s25u9dm", true),
      luna_astro: token("terra14lul8rjcad0jeuu680n4q7dwgxjkr6mqzx8umyewj8c6xn93squqllleht", true),
      luna_whale_old: token("terra1a2nc0k4m6hun6yr4g6ujnc46wlpfuywzves689at3tdkezrjg8wq7p35ra", true),
      luna_whale_pcl: token("terra1stavsz7hhsw56tngxt6p5xmkm86a9nvgztgvv56wj7q6yceutmwsvrwjdz", true),
      luna_ampluna: token("terra1my4tml2ae4zewq0u5fpq2qzq4rdpfh5pq7y3eekxxhwxdwdmce4shw9mt4", true),
      luna_bluna: token("terra1h3z2zv6aw94fx5263dy6tgz6699kxmewlx3vrcu4jjrudg6xmtyqk6vt0u", true),

      luna_capa: token("terra1cg9t08mqa88us074mpwpuu8lp5w4jwtye3vaazll45w27at52cpsq7c564", true),
    },
    bluechip: {
      luna_atom: token("terra19xrvvkq5607xudcxvw444yycjz6e3vk3l8p633z68k0vv5q09wnsa9q2qt", true),
      luna_sol: token("terra1vc66wpr2ghcesnf203em6yefpze3vrmq99n8yz0me3jzs6g4e8rs2kec75", true),
      luna_bnb: token("terra12eu8jk4w7lgn2rk7xs46nz7c7r9fw8q98afy9adlwtkghazj40asjf65zu", true),
      luna_inj: token("terra1euf8klqukk4wlly90nve0n6drqvq9pst73wc34pruuvx09nptxyse68hgl", true),
      usdc_usdt: token("terra1huw82c9grj9xz9umkc8hqcjqgndadlkrp8rn9u6eh5jh5j2s2t7qs33vry", true),
      luna_wsteth: token("terra19d8tttv0lvhwpj828qqrcmm6yaqdfhrchfheuufcw4kywtmk9u3q98ask3", true),
      luna_wbtc: token("terra1a5apghncafx0nem740fsrmd6demaywvp332a4uat63u2jtwn8mgsz7khkw", true),

      usdc_eure: token("terra17thxg96vtxv39kcltc0dvrltqgkumu8fv93rpz3xz98675cgxdjq3y4ddn", true),
    },

    single: {
      datom_atom: token("terra12mvtdvn4fgtsqs4fwxr56vcwjw0xe23lhdfyjq5ghk7vmfeuxn0srau9q2", true),
      statom_atom: token("terra1pz99udaf85erk8lumjylczz0cuf70mmq9gns3ejxt7s3mk266mqq6gkqkn", true),
      steth_eth: token("terra18336lhc2vt9s9tw4pqetvdwywg9555rduzv527r9q47smw89epcsxgxuny", true),

      amproar_roar_pair_addr: token("terra1sjujvcvkszrt84280agzv0du7tsrf44y4n7hcd9n8y0q7snfgersd68ens", true),
      amproar_roar: token("terra10xwhrfj2hqtwr4jwam3e24w92ypgl85lqz35lqzqhuay5r2h7pgqv4596s", true),

      rswth_swth: token("terra1mnucaeckccseq66kglv299wasp02akyh535jcpcdu37tdakr92esf9mjm5", true),
      wbtc_wbtc: token("terra10e2rz5etaped4nh0vk502hf7uwtz5lqvxqatxl4qyr0chcynxf2swhfwww", true),
      ampwhale_whale: token("terra1zn0kcywt3epp6md4ugnprslf84hhxklwz4g0d8ck7ldf9uspudqqpmf0ya", true),
      bwhale_whale: token("terra1yxj707eppjphy4fshmt2rcqfnmat4ym58z6x9jk52mvte56ktv7sqfy2r5", true),

      arbluna_luna: token("terra19z7g4fnu529250sdkdmgm9kw4qgwmmqrjas9t24ll84mpd94lxnshf0z2h", true),
      xastro: token("ibc/65B3EB6263482979FD7A80E3FFB9D0C85CFBF6DB63EB8DDE918B2984A40CEAB6", false),
      ampcapa: token("factory/terra186rpfczl7l2kugdsqqedegl4es4hp624phfc7ddy8my02a4e8lgq5rlx7y/ampCAPA", false),
    },
  };
  const stable = getInfo("ve3", network, Ve3InfoKeys.asset_staking_addr("stable"));
  const project = getInfo("ve3", network, Ve3InfoKeys.asset_staking_addr("project"));
  const bluechip = getInfo("ve3", network, Ve3InfoKeys.asset_staking_addr("bluechip"));
  const single = getInfo("ve3", network, Ve3InfoKeys.asset_staking_addr("single"));

  const address = admin.key.accAddress(getPrefix());
  const { txhash } = await sendTxWithConfirm(
    admin,
    [
      // addProposal(
      //   new MsgExecuteContract(address, single, <ExecuteMsg>{
      //     remove_assets: [astro.single.amproar_roar.info],
      //   })
      // ),
      addProposal(
        new MsgExecuteContract(address, bluechip, <ExecuteMsg>{
          whitelist_assets: [astro.bluechip.usdc_eure, ww.bluechip.usdc_eure],
        })
      ),
      // addProposal(
      //   new MsgExecuteContract(address, project, <ExecuteMsg>{
      //     whitelist_assets: [astro.project.luna_capa, ww.project.luna_capa],
      //   })
      // ),
      done(
        "[asset-staking] Adding USDC-EURe to bluechip gauge whitelist",
        ".",
        "terra1k8ug6dkzntczfzn76wsh24tdjmx944yj6mk063wum7n20cwd7lxq4lppjg"
      ),
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

  if (denom.startsWith("factory") || denom.startsWith("ibc")) {
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
