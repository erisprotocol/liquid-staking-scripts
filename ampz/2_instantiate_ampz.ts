import { TxLog } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  instantiateWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { InstantiateMsg } from "../types/ampz/eris_ampz_instantiate";

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

// Testnet
// ts-node ampz/2_instantiate_ampz.ts --network testnet --key testnet --contract-code-id 6526 --label "ERIS Amp Authz"

// ts-node ampz/2_instantiate_ampz.ts --network mainnet --key ledger --contract-code-id 1276 --label "Eris Amp Z"

1276;

const templates: Record<string, InstantiateMsg> = {
  testnet: <InstantiateMsg>{
    controller: "",
    hub: "terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88",
    farms: [
      "terra1l2cnn902x6rc2zw28ug9c592f2arxsq29n7mu5w97g8rcq4ekq0qr9szr0",
      "terra1uaz8gyr0lelvcuz8q0ynzpwsj578ads6esgjrtguf2svp2yaf4pqhuexxu",
      "terra1l70vrerf6mywfujuq8ldygtpy7gtrzh82uw3gxg5ehnz60w7p8eq40j6zd",
      "terra1wuuqc832jazjm0ffe798tzs8gqywnalz4ua4ssn2vv7flncrptvs0l8tw3",
      "terra16j2hg99dkln8y0yjhp2zqvvn2xcj5jlmgqdhx3a3sfjjhvnpf4kqp42w62",
    ],
    owner: "",
    zapper: "terra1pk3hj8k0nasnru5p0pfrsrhkfpqdway8ef8rqzn204r0ykvz8srqvyf4x0",
    astroport: {
      generator:
        "terra1gc4d4v82vjgkz0ag28lrmlxx3tf6sq69tmaujjpe7jwmnqakkx0qm28j2l",
      coins: [
        {
          token: {
            contract_addr:
              "terra167dsqkh2alurx997wmycw9ydkyu54gyswe3ygmrs4lwume3vmwks8ruqnv",
          },
        },
        {
          native_token: {
            denom: "uluna",
          },
        },
      ],
    },
    fee: {
      fee_bps: 100,
      operator_bps: 100,
      receiver: "terra1l86ytzn2mt0h3t2sw7wks4amxvzfhw7xuv7unr",
    },
  },
  mainnet: <InstantiateMsg>{
    controller: "terra1gtuvt6eh4m67tvd2dnfqhgks9ec6ff08c5vlup",
    hub: "terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk",
    farms: [
      "terra1lv2cscvakmtaahj8a6kw43zaefzemydwaswrf38sn2s2depv0wls6ut57q",
      "terra1r0ykpvttzxdx573hypmmdzq4g8e2k5cf5ur0rrjhp6mxrux9rmaq9xw9ff",
      "terra1c6vzxwfcfur2fg08n3nhtdlaxpmjd5wk9nztv8fjgfsjgagtghzsfftutt",
      "terra1xskgvsew6u6nmfwv2mc58m4hscr77xw884x65fuxup8ewvvvuyysr5k3lj",
      "terra1q3q88nyhn7a206djjk40xespszrwg26s8j5fswfgsv6cyu8qlsmsncmppe",
      "terra1qv5pklpnqmugqfehsytakk7tj2fsw4kt69xn2gvaq0edsynm9c7qnjecq2",
      "terra1c98f5dg90cyx5uklezsvac46e4c3msq3ghktkmeksyahytsvuh0q438m6c",
      "terra129jsdzd9nm7ywuyr0hlxs3zqm7jle00vtl4akf4wuke4yr5zs82qafcm4n",
      "terra1v4gh6nrps2yjdzqct5m7mwqkfusxgghjvd7sy5dsndsyy86pfyasum2qh5",
      "terra1g0g5ehu2lvdrta9m62yggaa6x375lz5t5zas3xnzmna7kx74szlsw20es6",
      "terra1l4phwrfqyg9l0vzlqcxn0vmnjd45rp5gx620zc2updpc9peazteqfk3y2p",
    ],
    owner: "",
    zapper: "terra1cs0tkknd2t94jd7hgdkmfyvenwr05ztra4rj6uackr597j9jfkxsghtywg",
    astroport: {
      generator:
        "terra1ksvlfex49desf4c452j6dewdjs6c48nafemetuwjyj6yexd7x3wqvwa7j9",
      coins: [
        {
          // astro
          token: {
            contract_addr:
              "terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26",
          },
        },
        {
          // xastro
          token: {
            contract_addr:
              "terra1x62mjnme4y0rdnag3r8rfgjuutsqlkkyuh4ndgex0wl3wue25uksau39q8",
          },
        },
        {
          // tpt
          token: {
            contract_addr:
              "terra13j2k5rfkg0qhk58vz63cze0uze4hwswlrfnm0fa4rnyggjyfrcnqcrs5z2",
          },
        },
        {
          // sayve
          token: {
            contract_addr:
              "terra1xp9hrhthzddnl7j5du83gqqr4wmdjm5t0guzg9jp6jwrtpukwfjsjgy4f3",
          },
        },
        {
          // red
          token: {
            contract_addr:
              "terra1xe8umegahlqphtpvjsuwfzfvyjfvag5h8rffsx6ezm0el4xzsf8s7uzezk",
          },
        },
      ],
    },
    fee: {
      fee_bps: 200,
      operator_bps: 100,
      receiver:
        "terra1v3h5lejqer5qnjnj6gds94u55x0qsxq7cpxs2kf7kqu6drwgmz4qd9qav9",
    },
  },
};

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const msg = templates[argv["network"]];

  const addr = deployer.key.accAddress(getPrefix());

  msg.controller = msg.controller || addr;
  msg.owner = msg.owner || addr;

  console.log("msg", msg);

  const result = await instantiateWithConfirm(
    deployer,
    addr,
    argv.contractCodeId,
    msg,
    argv.label
  );

  const addresses = result.logs.map(
    (a: TxLog) => a.eventsByType["instantiate"]["_contract_address"][0]
  );

  console.log(`Contract instantiated! Address: ${addresses}`);
})();
