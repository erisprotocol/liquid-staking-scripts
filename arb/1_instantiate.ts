import { TxLog } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  Chains,
  createLCDClient,
  createWallet,
  getPrefix,
  instantiateWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { InstantiateMsg } from "../types/arb/arb_instantiate";

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

// TERRA
// ts-node amp-governance/1_upload_contracts.ts --network mainnet --key mainnet --contracts arb --folder contracts-private --migrates terra15tjchjcvu672jx7grfcunev3feyvp9w6lwdrkkg9whrzavz54dqsjzars2
// eris_arb_vault_osmosis: 2904
// ts-node arb/1_instantiate.ts --network mainnet --key mainnet --contract-code-id 2904 --label "bot"
// terra15tjchjcvu672jx7grfcunev3feyvp9w6lwdrkkg9whrzavz54dqsjzars2
// https://station.terra.money/contract/execute/terra15tjchjcvu672jx7grfcunev3feyvp9w6lwdrkkg9whrzavz54dqsjzars2

const templates: Partial<Record<Chains, InstantiateMsg>> = {
  mainnet: <InstantiateMsg>{
    operators: [
      "terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl",
      "terra1gtuvt6eh4m67tvd2dnfqhgks9ec6ff08c5vlup",
      "terra187r4dlnw8negcvupryhtgc88vcy0w7j3e7n69e",
      "terra1m8hqwvajj5ehnm3qt5yam6ufrg8se5fdvj5gyu",
      "terra1zu6wprm7dzasrrj692cynvgsf3skentxldplr3",
      "terra1ypg6ky6akzu57940sk203jhz2lt3udc9cvzryp",
      "terra138tlx5dlkclka5lc8xkxxswrry2upras3y54e5",
      "terra10ggjkjwzt3jcfng00w5mny26p04erczms5j3yu",
      "terra18ukmp3pqdpx0dv2q476h400e2dawy0jdef926j",
    ],
  },
};

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const msg = templates[argv["network"] as Chains];
  if (!msg) throw new Error("no message");

  const addr = deployer.key.accAddress(getPrefix());

  console.log("msg", msg);

  const result = await instantiateWithConfirm(
    deployer,
    addr,
    argv.contractCodeId,
    msg,
    argv.label,
    // [new Coin("uwhale", 50000000)]
    // [new Coin("uosmo", 0)]
    []
  );

  const addresses = result.logs.map(
    (a: TxLog) => a.eventsByType["instantiate"]["_contract_address"][0]
  );

  console.log(`Contract instantiated! Address: ${addresses}`);
})();
