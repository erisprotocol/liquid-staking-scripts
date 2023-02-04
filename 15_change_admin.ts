import { MsgUpdateContractAdmin } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "./helpers";
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
    "contract-address": {
      type: "string",
      demandOption: true,
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

// mainnet
// TESTMIGRATION
// ts-node 15_change_admin.ts --network mainnet --key invest --contract-address terra1ckthjpaw9w74s409hsr2peracq8akx6e86lxyd0j28e0hw4dd6tqn938pa --new-admin terra1e9zwkd9epy8863d3ezmp5m4fsf95ceknhtmadwjt9rukvf8wtflstlecx8

(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const { txhash } = await sendTxWithConfirm(
    admin,
    [
      new MsgUpdateContractAdmin(
        admin.key.accAddress(getPrefix()),
        argv.newAdmin ?? "",
        argv["contract-address"]
      ),
    ],
    undefined,
    "75000"
  );
  console.log(`Contract admin changed! Txhash: ${txhash}`);
})();
