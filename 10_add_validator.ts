import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "./helpers";
import * as keystore from "./keystore";
import { ExecuteMsg } from "./types/hub/execute_msg";

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
    "hub-address": {
      type: "string",
      demandOption: true,
    },
    "validator-address": {
      type: "array",
      demandOption: true,
    },
  })
  .parseSync();

// ts-node 10_add_validator.ts --network testnet --key testnet --hub-address terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88 --validator-address terravaloper1gtw2uxdkdt3tvq790ckjz8jm8qgwkdw3uptstn terravaloper10v2p7430cetcm7xdl86m7mxtccgqce9euq40e6 terravaloper1fzx6z3qlwjyjjt3e5q6sakvt74n08uq9alzae3 terravaloper1uul6yyzf2kpaclpdukrn4fhlnjtag2a3cr0lk5 terravaloper1eh9a0ka6kltyfs7xnyrwtq2k2agzylznxkryzl terravaloper1pj02xdq0rdke4jk5kk2wkn7t5fktsm356ed50d terravaloper13sulzl3p0wk2t0x7aws7w8glmrh83z4y8atvgr terravaloper194khd5cqtmu377ay02wx24wajw44h472vwuhxp
// ts-node 10_add_validator.ts --network testnet --key testnet --hub-address terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88 --validator-address terravaloper15lsftv92eyssjwkh2393s0nhjc07kryqen2fqf

// ts-node 10_add_validator.ts --network mainnet --key mainnet --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --validator-address terravaloper1tz203ptlsfs8c63f2j0d0872pt5frjrvtfg0vd
// ts-node 10_add_validator.ts --network mainnet --key mainnet --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --validator-address terravaloper10c04ysz9uznx2mkenuk3j3esjczyqh0j783nzt
// ts-node 10_add_validator.ts --network mainnet --key mainnet --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --validator-address terravaloper1vrkzjujfds9p8t5g0xety3e3ft4dep02etv9le
// ts-node 10_add_validator.ts --network mainnet --key mainnet --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --validator-address terravaloper1f6wuq93320s6w7vvnkc0576g9mtqfmz9a8wqxk

// ts-node 10_add_validator.ts --network mainnet --key mainnet --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --validator-address terravaloper1lelhxdzwn9ddecv6sv0kcxj5tguurxnzcfs5wf
// ts-node 10_add_validator.ts --network mainnet --key mainnet --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --validator-address terravaloper1rr2g4z2ch4cqwl8s70yj94a5l2vakg0v36nmjh
// ts-node 10_add_validator.ts --network mainnet --key mainnet --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --validator-address terravaloper1cqc26lnatzxvu0z5nd4yx8m4ecllkm7jlakwrw

// gidorah
// ts-node 10_add_validator.ts --network mainnet --key mainnet --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --validator-address terravaloper13qjxhnw98lm36rxc9yjakkmulhpv7zctdhcl03

// 01node terravaloper1wdymftapg5pcvf2aqw4pd0yuuh5w9m6yqdnukv
// ts-node 10_add_validator.ts --network mainnet --key mainnet --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --validator-address terravaloper1wdymftapg5pcvf2aqw4pd0yuuh5w9m6yqdnukv

// enigma synergy fresh
//  ts-node 10_add_validator.ts --network mainnet --key mainnet --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --validator-address terravaloper1u8lglu36g5x6shp2xyd35hcs45x9cvmj6tmvd8 terravaloper1tm0xkark2ufecmdhgaaw7gqsycyt4qag6py8x6 terravaloper1ygwhuksjq3nymd9n8kmceaxd3vxv97u7ja33aj

// CLASSIC
// ts-node 10_add_validator.ts --network classic --key mainnet --hub-address terra1zmf49p3wl7ck2cwer7kghzumfpwhfqk6x893ah --validator-address terravaloper14xjkj5rv72fgqz3h78l883rw0njwhmzce45006 terravaloper1z7we2y02fy2kvw0tdq8k26j4t370n58wxvl4ge terravaloper1khfcg09plqw84jxy5e7fj6ag4s2r9wqsgm7k94

// JUNO
// ts-node 10_add_validator.ts --network juno --key mainnet-juno --hub-address juno17cya4sw72h4886zsm2lk3udxaw5m8ssgpsl6nd6xl6a4ukepdgkqeuv99x --validator-address junovaloper16s96n9k9zztdgjy8q4qcxp4hn7ww98qk0du5jq junovaloper1juczud9nep06t0khghvm643hf9usw45r23gsmr junovaloper19ur8r2l25qhsy9xvej5zgpuc5cpn6syydmwtrt junovaloper193xl2tqh2tjkld2zv49ku5s44ee4qmgr65jcep junovaloper1sgghjqdrj9kujkx38q04d99qsljwfd6mxyrssk junovaloper1x8u2ypdr35802tjyjqyxan8x85fzxe6sk0qmh8 junovaloper1pr5qgj4jg47lvsnejtfvk78090shvuctgdwdm5 junovaloper10wxn2lv29yqnw2uf4jf439kwy5ef00qdelfp7r junovaloper166r5ylkp70xe0ysq2hjxn26m4q9vfn8q3lv46c junovaloper18tjj8ang9pelwxhdj8uuta6pchz292suncrlrq junovaloper1f2jpv5sc6ur6yurq5w0t2chphrznpy8lfvj9vs junovaloper10y7ucn6jhjtakwchgpw32y0tgaku6yn255z7gm

(async function () {
  const terra = createLCDClient(argv["network"]);
  const worker = await createWallet(terra, argv["key"], argv["key-dir"]);

  console.log(argv["validator-address"]);

  const validators = argv["validator-address"].map(
    (val) =>
      new MsgExecuteContract(
        worker.key.accAddress(getPrefix()),
        argv["hub-address"],
        <ExecuteMsg>{
          add_validator: {
            validator: val.toString(),
          },
        }
      )
  );

  const { txhash } = await sendTxWithConfirm(worker, validators);
  console.log(`Success! Txhash: ${txhash}`);
})();
