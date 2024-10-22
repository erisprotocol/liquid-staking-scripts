import { MsgUpdateContractAdmin } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import { createLCDClient, createWallet, getPrefix, sendTxWithConfirm } from "./helpers";
import * as keystore from "./keystore";

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
    "new-admin": {
      type: "string",
      demandOption: false,
    },
  })
  .parseSync();

// testnet
// ts-node 15_change_admin.ts --network testnet --key ledger --contract-address terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88 --new-admin terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr
// ts-node 15_change_admin.ts --network mainnet --key mainnet --contract-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --new-admin terra1q0vny4wx2pfteh9zq323wh48c654xacpfq5tew
// ts-node 15_change_admin.ts --network mainnet --key mainnet --contract-address terra1se7rvuerys4kd2snt6vqswh9wugu49vhyzls8ymc02wl37g2p2ms5yz490 --new-admin terra1q0vny4wx2pfteh9zq323wh48c654xacpfq5tew

// mainnet
// TESTMIGRATION
// ts-node 15_change_admin.ts --network mainnet --key invest --contract-address terra1ckthjpaw9w74s409hsr2peracq8akx6e86lxyd0j28e0hw4dd6tqn938pa --new-admin terra1e9zwkd9epy8863d3ezmp5m4fsf95ceknhtmadwjt9rukvf8wtflstlecx8

// ICS20
// ts-node 15_change_admin.ts --network mainnet --key ledger --contract-address terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au --new-admin terra1e9zwkd9epy8863d3ezmp5m4fsf95ceknhtmadwjt9rukvf8wtflstlecx8

// HUB
// ts-node 15_change_admin.ts --network mainnet --key ledger --contract-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --new-admin terra1e9zwkd9epy8863d3ezmp5m4fsf95ceknhtmadwjt9rukvf8wtflstlecx8

// CW20
// ts-node 15_change_admin.ts --network mainnet --key mainnet --contract-address terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct --new-admin terra1e9zwkd9epy8863d3ezmp5m4fsf95ceknhtmadwjt9rukvf8wtflstlecx8

// ts-node 15_change_admin.ts --network mainnet --key mainnet --contract-address terra1chdtp8z4wcu3g3g2qqdame8a5jjt0jvnajgux54h5udgp3gx6dqs5ylcxh --new-admin terra1k9j8rcyk87v5jvfla2m9wp200azegjz0eshl7n2pwv852a7ssceqsnn7pq

// ts-node 15_change_admin.ts --network mainnet --key mainnet --contract-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --new-admin terra1q0vny4wx2pfteh9zq323wh48c654xacpfq5tew

// ts-node 15_change_admin.ts --network mainnet --key mainnet --contract-address terra1zxwam5gmqvkxrj4j5s8ct92mxyd90x8snv4m7m46j685kf8d3krs4k76pq --new-admin terra1k9j8rcyk87v5jvfla2m9wp200azegjz0eshl7n2pwv852a7ssceqsnn7pq

// ts-node 15_change_admin.ts --network mainnet --key mainnet --new-admin terra1q0vny4wx2pfteh9zq323wh48c654xacpfq5tew

(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const contracts = [
    // "terra1dy5c2fqh00t6ptv7tplj43mkkl5smtrxzg0q0kz7mljlaun3939qsynf2g",
    // "terra1flxt6akuldavdu4q0kcassvql5ju2ljyhwujezyslk0lj29h8yrqk7hfm5",
    // "terra1zd2rkvzcm7m2aearymr9lv53cqwxjlujjcujtkyfphur7azqwahsrftnm8",
    // "terra138l5l4djy7kkn4xelw806k9389mmd22txrqpn773x4y4p5f0kljszt5683",
    // "terra1e5vchf97lakl6sulztkn54aapekzfzsa6amdt88exvwmu25s3z0sg6hplq",
    // "terra1nrzw3c28h5sq9q7pw9umc0882607exz8he5uj9yx2yw22m3mhrmsxw2lql",
    // "terra1m9fvkwjpwd4ddgkxd5ddvc2jst9wtv33u7kj89tq2wr0tjm34j8qyfmpwm",
    // "terra1as76h247wvey3aqmw22mlkq8g6vj8zj7qw4wywwn388s2mjt0rtqpp570z",
    // "terra1ymwcpz20lcaue5kkawj3t2fe7et4xd7xkxtuxzc43at0dvcywrsqcuunk2",
    // "terra1kle8kd6gwx9fwpav6spj8zg25uhftsm87gdss4ssmej4pnee2rtshhyct4",
    // "terra1cgtn7dnlexpqdzr44srt7t5edxlwjqae970prfmlzywjhttae99sche4v8",
    // "terra16akp34qkh3v6537gra4ypqj4z208fmesdpzp9vgx3w3luruplgmse5rvku",
    // "terra1xxyr0tduxlggrujcsqmnllu74dmg4697heyjmvvyv6tj3q0hh0qqqq8d6h",
    // "terra1rlfuqcq935j6avrwsurzn6altrq6htet0ggz3hv86kueeewfzunqj2u6lw",
    // "terra1zanekgprlqpdhu2nmqq9efcnr5f4f76vph2fykvw94pq8sylltdsll64qj",
    // "terra10yalv9g9q27hzwdqm9qlma2phjqrr4z46793ygyh0htjpw0dlzesr8f3m2",
    // "terra1snnu9nkmasfek5h2g68mat2uw3knk3zguzw2k3g5shafzkr0n8qst0ckza",
    // "terra1zkxylr2xyvgzeedz4yd54l4p9j8dtajr2ramewn8f35x46gr7cqs74jfxz",

    // "terra1hwxg6s732eparz3ys7sa4t5f64ngpd2w8syrca6z7ckv3fs9uqnsvrpcqa",
    // // "terra1qdjsxsv96aagrdxz83gwtjk8qvf2mrg4y8y3dqjxg556lm79pg5qdgmaxl",
    // "terra1hfksrhchkmsj4qdq33wkksrslnfles6y2l77fmmzeep0xmq24l2smsd3lj",
    // "terra1ym2495f63mdx63tu96085x2vf3xpy9z9k5urxwhvmf9jldm99q5qr4q6n8",
    // "terra1v399cx9drllm70wxfsgvfe694tdsd9x96p9ha36w7muffe4znlusqswspq",
    // "terra1x8v9fujf3c78q2we23x0vgzmxgtt0hgvuvfsxy4w3ar9kcua4c6qqcnhyh",
    // "terra1awq6t7jfakg9wfjn40fk3wzwmd57mvrqtt3a39z9rmet7wdjj3ysgw3lpa",
    // "terra16l43xt2uq09yvz4axg73n8rtm0qte9lremdwm6ph0e35r2jnm43qnl8h53",
    // "terra14mmvqn0kthw6sre75vku263lafn5655mkjdejqjedjga4cw0qx2qlf4arv",
    // "terra1uqhj8agyeaz8fu6mdggfuwr3lp32jlrx5hqag4jxexde92rzkamq3l62zg",
    // "terra1tuuwm8yrj54qeg0c8xu00aha9ryatyhtczq8qq2q8tntuw0auzas9037wh",

    // "terra1qdz5qgafx88kp5mf6m2tah8742g4u5g2cek0m3jrgssexexk7g4qw6e23k",
    // "terra1zly98gvcec54m3caxlqexce7rus6rzgplz7eketsdz7nh750h2rqvu8uzx",
    "terra1u72y7gppxrsncctvgfyqduv3md6pgq77pqhz9rxgwl3dqgye00cq7vmf8u",
  ];

  const { txhash } = await sendTxWithConfirm(
    admin,
    contracts.map(
      (contract) => new MsgUpdateContractAdmin(admin.key.accAddress(getPrefix()), argv.newAdmin ?? "", contract)
    ),
    undefined,
    (contracts.length * 70000).toFixed(0)
  );
  console.log(`Contract admin changed! Txhash: ${txhash}`);
})();
