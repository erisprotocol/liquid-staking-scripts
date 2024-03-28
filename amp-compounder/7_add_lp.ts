import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/amp-compounder/compound_proxy/execute_msg";
import { tokens_neutron } from "./tokens";

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
      demandOption: true,
    },
  })
  .parseSync();

// ts-node amp-compounder/7_add_lp.ts --network testnet --key testnet --contract terra1pk3hj8k0nasnru5p0pfrsrhkfpqdway8ef8rqzn204r0ykvz8srqvyf4x0
// ts-node amp-compounder/7_add_lp.ts --network mainnet --key mainnet --contract terra1cs0tkknd2t94jd7hgdkmfyvenwr05ztra4rj6uackr597j9jfkxsghtywg

// terra1pvn5up4n4ttmdatvpxa8t2klpcy2u5t5nmyclv30yz8xmphjxlrqgqwxv6,terra1a3k77cgja875f6ffdsflxtaft570em82te4suw9nfhx77u6dqh8qykuq6f,terra176e78qnvvclrlrmuyjaqxsy72zp2m3szshljdxakdsmr33zulumqa3hr9d,terra1m64fmenadmpy7afp0675jrkz9vs0cq97mgzzpzg0klgc4ahgylms7gvnt5

// commission_bps
(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const account = admin.key.accAddress(getPrefix());

  const { txhash } = await sendTxWithConfirm(admin, [
    new MsgExecuteContract(account, argv.contract, <ExecuteMsg>{
      update_config: {
        upsert_lps: [
          // {
          //   commission_bps: 40,
          //   pair_contract:
          //     "terra1tm20pwpzwyyvyadu4v488hrg59nhu9v2l8v7k67nhccam4aagczsg0pzzr",
          //   slippage_tolerance: "0.01",
          //   wanted_token: tokens.astro,
          // },
          // {
          //   commission_bps: 40,
          //   pair_contract:
          //     "terra13cw46g72kwtgln0540j9cqa79ham5k86jlx34e2pqukww6v0v3yseakged",
          //   slippage_tolerance: "0.01",
          //   wanted_token: tokens.luna,
          // },
          // {
          //   commission_bps: 40,
          //   pair_contract:
          //     "terra189v2ewgfx5wdhje6geefdtxefeemujplk8qw2wx3x5hdswn95l8qf4n2r0",
          //   slippage_tolerance: "0.01",
          //   wanted_token: tokens.luna,
          // },
          // {
          //   commission_bps: 40,
          //   pair_contract:
          //     "terra1mc0t6hw8rwqd77jgzyl28er2vpkg205dumvvzh0lry4xxxk2d5lsjmp27h",
          //   slippage_tolerance: "0.01",
          //   wanted_token: tokens.luna,
          // },
          // {
          //   commission_bps: 40,
          //   pair_contract:
          //     "terra1c7g9pmz2xxe66g8ujpe5tlmj3pawjp290f57cl43j6vswkdtrvwqkgme9q",
          //   slippage_tolerance: "0.01",
          //   wanted_token: tokens.luna,
          // },

          // {
          //   commission_bps: 5,
          //   pair_contract:
          //     "terra1h32epkd72x7st0wk49z35qlpsxf26pw4ydacs8acq6uka7hgshmq7z7vl9",
          //   slippage_tolerance: "0.01",
          //   wanted_token: {
          //     native_token: {
          //       denom: "uluna",
          //     },
          //   },
          // },
          // {
          //   commission_bps: 5,
          //   pair_contract:
          //     // LUNA-stLUNA
          //     "terra1re0yj0j6e9v2szg7kp02ut6u8jjea586t6pnpq6628wl36fphtpqwt6l7p",
          //   slippage_tolerance: "0.01",
          //   wanted_token: {
          //     native_token: {
          //       denom: "uluna",
          //     },
          //   },
          // },
          // {
          //   commission_bps: 30,
          //   pair_contract:
          //     // LUNA-ROAR
          //     "terra1c7g9pmz2xxe66g8ujpe5tlmj3pawjp290f57cl43j6vswkdtrvwqkgme9q",
          //   slippage_tolerance: "0.01",
          //   wanted_token: {
          //     native_token: {
          //       denom: "uluna",
          //     },
          //   },
          // },
          // {
          //   commission_bps: 5,
          //   pair_contract:
          //     // SOLID-USDC
          //     "terra1jd04eztujfgt4z0uyw7lkm0gujs0gpxs6pd5gv8ltt5xccmq3v8sppm7wg",
          //   // LP terra1rdjm94n3r4uvhfh23s98tfcgzedkuvjwvkcjqa503amef9afya7sddv098
          //   // farm terra1yfmpzj79n8g356kp6xz0rkjehegwqw7zhus8jzreqvec5ay9a7kqs7a6hc
          //   slippage_tolerance: "0.01",
          //   wanted_token: {
          //     native_token: {
          //       denom:
          //         "ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4",
          //     },
          //   },
          // },
          // terra14n22zd24nath0tf8fwn468nz7753rjuks67ppddrcqwq37x2xsxsddqxqc
          // {
          //   commission_bps: 30,
          //   pair_contract:
          //     "terra1nckl6ex6239tv4kjzv03ecmuxwakjm8uj8cy6p850vmlmejfmj9sy094yr",
          //   slippage_tolerance: "0.01",
          //   wanted_token: {
          //     native_token: {
          //       denom: "uluna",
          //     },
          //   },
          // },
          // terra1g6z93vtttdrwfdtj06ha2nwc6qdxsfy8appge5l5g7wenfzg5mjq8s3r9n
          // {
          //   commission_bps: 30,
          //   pair_contract:
          //     "terra1g6z93vtttdrwfdtj06ha2nwc6qdxsfy8appge5l5g7wenfzg5mjq8s3r9n",
          //   slippage_tolerance: "0.01",
          //   wanted_token: tokens.capa,
          // },
          // {
          //   commission_bps: 30,
          //   pair_contract:
          //     "neutron1jpm7j2cmj2mmk5pnxv20dxz869tw2vyy87qdl0xjasqnn23l04psudtf2y",
          //   slippage_tolerance: "0.01",
          //   wanted_token: tokens_neutron.usdc,
          // },
          // {
          //   commission_bps: 30,
          //   pair_contract:
          //     "neutron1e22zh5p8meddxjclevuhjmfj69jxfsa8uu3jvht72rv9d8lkhves6t8veq",
          //   slippage_tolerance: "0.01",
          //   wanted_token: tokens_neutron.ntrn,
          // },
          // {
          //   commission_bps: 30,
          //   pair_contract:
          //     "neutron1l3gtxnwjuy65rzk63k352d52ad0f2sh89kgrqwczgt56jc8nmc3qh5kag3",
          //   slippage_tolerance: "0.01",
          //   wanted_token: tokens_neutron.usdc,
          // },
          // {
          //   commission_bps: 30,
          //   pair_contract:
          //     "neutron1adk7gupr0thjr3e6wcnlxr7ugclcg4cukv2np8la29dz38zuzymqjcv5s4",
          //   slippage_tolerance: "0.01",
          //   wanted_token: tokens_neutron.usdc,
          // },
          // wstETH-axlETH
          // {
          //   commission_bps: 30,
          //   pair_contract:
          //     "neutron1wzsewgysr8ttdlw96lp7u2j55z3sg7rtuvfjmd70ajavvpr3308s3zekqu",
          //   slippage_tolerance: "0.01",
          //   wanted_token: tokens_neutron.wsteth,
          // },

          {
            commission_bps: 40,
            pair_contract:
              "neutron1jh27klc7z8xk3nr32nynvk40qm9f64eypq7nj2w48egtehu35n3q59pkfn",
            slippage_tolerance: "0.01",
            wanted_token: tokens_neutron.usdc,
          },
          {
            commission_bps: 40,
            pair_contract:
              "neutron1yw0a7nxa8jdgzmdsme4gwxhj76n44z305qgwrzvlfavgna9epcys3k9m2f",
            slippage_tolerance: "0.01",
            wanted_token: tokens_neutron.wsteth,
          },
        ],
      },
    }),
  ]);
  console.log(`Contract added route! Txhash: ${txhash}`);
})();
