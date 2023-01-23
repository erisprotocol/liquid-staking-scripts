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
  mainnet: <InstantiateMsg>{},
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
