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

// ICS20
// ts-node 15_change_admin.ts --network mainnet --key ledger --contract-address terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au --new-admin terra1e9zwkd9epy8863d3ezmp5m4fsf95ceknhtmadwjt9rukvf8wtflstlecx8

// HUB
// ts-node 15_change_admin.ts --network mainnet --key ledger --contract-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --new-admin terra1e9zwkd9epy8863d3ezmp5m4fsf95ceknhtmadwjt9rukvf8wtflstlecx8

// CW20
// ts-node 15_change_admin.ts --network mainnet --key mainnet --contract-address terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct --new-admin terra1e9zwkd9epy8863d3ezmp5m4fsf95ceknhtmadwjt9rukvf8wtflstlecx8

// ts-node 15_change_admin.ts --network mainnet --key mainnet --contract-address terra1chdtp8z4wcu3g3g2qqdame8a5jjt0jvnajgux54h5udgp3gx6dqs5ylcxh --new-admin terra1k9j8rcyk87v5jvfla2m9wp200azegjz0eshl7n2pwv852a7ssceqsnn7pq

// ts-node 15_change_admin.ts --network mainnet --key mainnet --contract-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --new-admin terra1q0vny4wx2pfteh9zq323wh48c654xacpfq5tew

// ts-node 15_change_admin.ts --network mainnet --key mainnet --contract-address terra1zxwam5gmqvkxrj4j5s8ct92mxyd90x8snv4m7m46j685kf8d3krs4k76pq --new-admin terra1k9j8rcyk87v5jvfla2m9wp200azegjz0eshl7n2pwv852a7ssceqsnn7pq

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
    "100000"
  );
  console.log(`Contract admin changed! Txhash: ${txhash}`);
})();
