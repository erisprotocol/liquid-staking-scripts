import { MsgRegisterFeeShare } from "@terra-money/feather.js/dist/core/feeshare/MsgRegisterFeeShare";
import yargs from "yargs/yargs";
import { createLCDClient, createWallet, getPrefix, sendTxWithConfirm } from "../helpers";
import * as keystore from "../keystore";

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
  })
  .parseSync();

interface RegisterFeeShareParams {
  contractAddress: string;
  deployerAddress: string;
  withdrawerAddress: string;
}

export const toRegisterFeeShareMsg = ({
  contractAddress,
  deployerAddress,
  withdrawerAddress,
}: RegisterFeeShareParams) => {
  const registerMsg = new MsgRegisterFeeShare(contractAddress, deployerAddress, withdrawerAddress);
  const packed = registerMsg.packAny();

  const msg = {
    stargate: {
      type_url: packed.typeUrl,
      value: Buffer.from(packed.value).toString("base64"),
    },
  };

  return msg;
};

// ts-node chain/terra_set_fee_share.ts --key mainnet --network mainnet
// ts-node chain/terra_set_fee_share.ts --key ledger --network mainnet
(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv.key, argv["key-dir"]);

  const missing = [
    "terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk",
    "terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct",
    "terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au",
  ];

  const results = missing.map((a) =>
    toRegisterFeeShareMsg({
      contractAddress: a,
      deployerAddress: "terra1e9zwkd9epy8863d3ezmp5m4fsf95ceknhtmadwjt9rukvf8wtflstlecx8",
      withdrawerAddress: "terra1v3h5lejqer5qnjnj6gds94u55x0qsxq7cpxs2kf7kqu6drwgmz4qd9qav9",
    })
  );

  console.log(JSON.stringify(results));

  const contracts = [
    // "",
    // "terra10j3zrymfrkta2pxe0gklc79gu06tqyuy8c3kh6tqdsrrprsjqkrqzfl4df",
    // "terra1q33xvxt03ds6rsrk9p7dzaz4540s5q995gmt8dp3u47smaw292jqrmpxgd",
    // "terra1vklefn7n6cchn0u962w3gaszr4vf52wjvd4y95t2sydwpmpdtszsqvk9wy",
    // "terra186rpfczl7l2kugdsqqedegl4es4hp624phfc7ddy8my02a4e8lgq5rlx7y",
    // "terra1j35ta0llaxcf55auv2cjqau5a7aee6g8fz7md7my7005cvh23jfsaw83dy",
    // "terra1v3h5lejqer5qnjnj6gds94u55x0qsxq7cpxs2kf7kqu6drwgmz4qd9qav9",
    // // vamp
    // "terra1aumv9uyv2ltf8upsf88338ctf922q439a0v2tpss5s2j9g0j8zzsrtq9t2",
    // // props
    // "terra1z0cxlq62a9dsjhz7g7hhgpuplcl32c0qeckhm9jyggln0rxq6z8syesq8j",
    // // voting escrow
    // "terra1ep7exp42jjtwgjly36y4vgylz82fplnjwpkz95wljzwfald8zwwqggsdzz",
    // //arb vault
    // "terra1r9gls56glvuc4jedsvc3uwh6vj95mqm9efc7hnweqxa2nlme5cyqxygy5m",
    // "terra1se7rvuerys4kd2snt6vqswh9wugu49vhyzls8ymc02wl37g2p2ms5yz490",
    // // ampz
    // "terra1kgqwwdyg0sq05tjl34qh48ewu6ln3q0ds63hl87tjdrp80e5s0yqt6rp48",
    // "terra1cs0tkknd2t94jd7hgdkmfyvenwr05ztra4rj6uackr597j9jfkxsghtywg",

    // //farms
    // "terra1a3k77cgja875f6ffdsflxtaft570em82te4suw9nfhx77u6dqh8qykuq6f",
    // "terra1pvn5up4n4ttmdatvpxa8t2klpcy2u5t5nmyclv30yz8xmphjxlrqgqwxv6",
    // "terra176e78qnvvclrlrmuyjaqxsy72zp2m3szshljdxakdsmr33zulumqa3hr9d",
    // "terra1m64fmenadmpy7afp0675jrkz9vs0cq97mgzzpzg0klgc4ahgylms7gvnt5",
    // "terra1lv2cscvakmtaahj8a6kw43zaefzemydwaswrf38sn2s2depv0wls6ut57q",
    // "terra1r0ykpvttzxdx573hypmmdzq4g8e2k5cf5ur0rrjhp6mxrux9rmaq9xw9ff",
    // "terra1c6vzxwfcfur2fg08n3nhtdlaxpmjd5wk9nztv8fjgfsjgagtghzsfftutt",
    // "terra1xskgvsew6u6nmfwv2mc58m4hscr77xw884x65fuxup8ewvvvuyysr5k3lj",
    // "terra1q3q88nyhn7a206djjk40xespszrwg26s8j5fswfgsv6cyu8qlsmsncmppe",
    // "terra1qv5pklpnqmugqfehsytakk7tj2fsw4kt69xn2gvaq0edsynm9c7qnjecq2",
    // "terra1c98f5dg90cyx5uklezsvac46e4c3msq3ghktkmeksyahytsvuh0q438m6c",
    // "terra129jsdzd9nm7ywuyr0hlxs3zqm7jle00vtl4akf4wuke4yr5zs82qafcm4n",
    // "terra1v4gh6nrps2yjdzqct5m7mwqkfusxgghjvd7sy5dsndsyy86pfyasum2qh5",
    // "terra1g0g5ehu2lvdrta9m62yggaa6x375lz5t5zas3xnzmna7kx74szlsw20es6",
    // "terra1l4phwrfqyg9l0vzlqcxn0vmnjd45rp5gx620zc2updpc9peazteqfk3y2p",
    // "terra1zsm7cgu3vg2kwwzzehl38ft7z2ffksql9d6twh3pugvf0yl0u5vs74xx55",
    // "terra1yfmpzj79n8g356kp6xz0rkjehegwqw7zhus8jzreqvec5ay9a7kqs7a6hc",
    // "terra10wsuv79k03gplmcx22j4lxauca4t2a0p4q83fyuv54w88e7ccm0qxkme4l",
    // "terra1m42utlz6uvnlzn82f58pfkkuxw8j9vf24hf00t54qfn4k23fhj3q70vqd0",
    // // amplps

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

    // moar
    // "terra1dndhtdr2v7ca8rrn67chlqw3cl3xhm3m2uxls62vghcg3fsh5tpss5xmcu",

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

    "terra1qdz5qgafx88kp5mf6m2tah8742g4u5g2cek0m3jrgssexexk7g4qw6e23k",
    "terra1u72y7gppxrsncctvgfyqduv3md6pgq77pqhz9rxgwl3dqgye00cq7vmf8u",
    "terra1zly98gvcec54m3caxlqexce7rus6rzgplz7eketsdz7nh750h2rqvu8uzx",
  ];

  const account = admin.key.accAddress(getPrefix());
  const receiver = "terra1rgggsspquaxjp4lmegx7a3q4l9lg44hnu7rjxa";

  console.log(`Account ${account}, Receiver: ${receiver}`);

  const { txhash } = await sendTxWithConfirm(
    admin,
    contracts.map((contract) => new MsgRegisterFeeShare(contract, account, receiver)),
    undefined,
    (contracts.length * 80000).toFixed(0)
  );
  console.log(`Contract migrated! Txhash: ${txhash}`);
})();
