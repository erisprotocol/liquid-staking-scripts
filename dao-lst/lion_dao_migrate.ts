import { MsgMigrateContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import { Chains, createLCDClient, createWallet, getPrefix, sendTxWithConfirm } from "../helpers";
import * as keystore from "../keystore";
import { MigrateMsg } from "../types/dao-lst/hub/migrate";

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
    "code-id": {
      type: "number",
      demandOption: true,
    },
  })
  .parseSync();

(async function () {
  const network = argv["network"] as Chains;
  const terra = createLCDClient(network);

  console.log("wait for wallet");
  const admin = await createWallet(terra, argv["key"] || argv.key, argv["key-dir"]);

  console.log(`Account migrate: ${admin.key.accAddress(getPrefix())}`);

  // AllowSubmit https://chainsco.pe/terra2/tx/FCB81B52F4038B0B5A607B4E789A6871EA4998D755EDEB706AE6226CCCC24A61
  // SUBMIT BATCH https://chainsco.pe/terra2/tx/07739F72944A6B4ACE206F393F9AD89D97D2FFC1403E2CB003C113214166CB79

  // Disable, https://chainsco.pe/terra2/tx/886BB16F237C7044AA61E11C21D414AF93EC18893B6DB4C70F43363BAA0EFB0E
  // Unstake, https://chainsco.pe/terra2/tx/7FFEE893142A820149570D6AD8F3B0F6F44B3FDDFC71EDC44025B9E410A7E850

  // WAIT
  // Claim, https://chainsco.pe/terra2/tx/2877D49AEE26E00012C47422DF7EE6321A21BDA76EE9617346013B93783C033D
  // ReconcileAll, https://chainsco.pe/terra2/tx/6CA56F4328540CEFF074F2B99EBF70542F1B89BA3BFE57C990AC6A3B432F3FD0

  // UPDATE CONFIG to DAODAO https://chainsco.pe/terra2/tx/80A519D05F6FC06813E2A07642B8178164DC49BF2C0394943EA71C9EC04E3D22

  // Stake, https://chainsco.pe/terra2/tx/1184870AE07870586317CEB9EB89446AB640D08ABC40A93868F8AE5DE2B89B71
  // Enable,

  const { txhash } = await sendTxWithConfirm(admin, [
    new MsgMigrateContract(admin.key.accAddress(getPrefix()), argv.contract, argv.codeId, <MigrateMsg>{
      action: "enable",
    }),
  ]);
  console.log(`Contract migrated! Txhash: ${txhash}`);
})();
