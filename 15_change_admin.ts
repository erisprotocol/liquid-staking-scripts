import { MsgUpdateContractAdmin } from "@terra-money/terra.js";
import yargs from "yargs/yargs";
import { createLCDClient, createWallet, sendTxWithConfirm } from "./helpers";
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
// ts-node 15_change_admin.ts --network testnet --key testnet --contract-address terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88 --new-admin terra1q0vny4wx2pfteh9zq323wh48c654xacpfq5tew
// ts-node 15_change_admin.ts --network mainnet --key mainnet --contract-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk --new-admin terra1q0vny4wx2pfteh9zq323wh48c654xacpfq5tew

(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const { txhash } = await sendTxWithConfirm(
    admin,
    [
      new MsgUpdateContractAdmin(
        admin.key.accAddress,
        argv.newAdmin ?? "",
        argv["contract-address"]
      ),
    ],
    undefined,
    "70000"
  );
  console.log(`Contract admin changed! Txhash: ${txhash}`);
})();
