import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import { LedgerKey } from "@terra-money/ledger-terra-js";
import {
  isTxError,
  LCDClient,
  LocalTerra,
  Msg,
  MsgInstantiateContract,
  MsgStoreCode,
  Wallet,
} from "@terra-money/terra.js";
import { SignMode } from "@terra-money/terra.proto/cosmos/tx/signing/v1beta1/signing";
import * as fs from "fs";
import * as promptly from "promptly";
import * as keystore from "./keystore";

const DEFAULT_GAS_SETTINGS = {
  // gasPrices: "5.665uluna",
  // gasAdjustment: 1.2,
};

/**
 * @notice Create an `LCDClient` instance based on provided network identifier
 */
export function createLCDClient(network: string): LCDClient {
  if (network === "mainnet") {
    return new LCDClient({
      chainID: "phoenix-1",
      URL: "https://phoenix-lcd.terra.dev",
      gasAdjustment: 1.2,
    });
  } else if (network === "testnet") {
    return new LCDClient({
      chainID: "pisco-1",
      URL: "https://pisco-lcd.terra.dev",
      gasAdjustment: 1.5,
    });
  } else if (network === "classic" || network === "classic-testnet") {
    return new LCDClient({
      chainID: "columbus-5",
      URL: "https://lcd.terra.dev",
      gasPrices: { uluna: "5.665" },
      gasAdjustment: 1.2,
    });
  } else if (network === "classic-testnet") {
    return new LCDClient({
      chainID: "bombay-12",
      URL: "https://bombay-lcd.terra.dev",
    });
  } else if (network === "juno") {
    return new LCDClient({
      chainID: "juno-1",
      // URL: "https://juno-api.polkachu.com",
      URL: "https://lcd-juno.whispernode.com",
      gasPrices: {
        ujuno: "0.0025",
      },
      gasAdjustment: 1.3,
    });
  } else if (network === "localterra") {
    return new LocalTerra();
  } else {
    throw new Error(
      `invalid network: ${network}, must be mainnet|testnet|localterra|classic-testnet`
    );
  }
}

/**
 * @notice Create a `Wallet` instance by loading the private key stored in the keystore
 */
export async function createWallet(
  terra: LCDClient,
  keyName: string,
  keyDir: string
): Promise<Wallet> {
  if (keyName === "ledger") {
    const lk = await LedgerKey.create(await TransportNodeHid.create(60 * 1000));
    return terra.wallet(lk);
  }
  // if (keyName === "ledger-juno") {
  //   const lk = await JunoLedgerKey.create(
  //     await TransportNodeHid.create(60 * 1000)
  //   );

  //   return terra.wallet(lk);
  // }

  const password = await promptly.password(
    "Enter password to decrypt the key:"
  );
  const key = keystore.load(keyName, keyDir, password);
  console.log("🚀 ~ file: helpers.ts ~ line 90 ~ key", key);
  return terra.wallet(key);
}

/**
 * @notice Pause script execution until user confirms
 */
export async function waitForConfirm(msg: string) {
  const proceed = await promptly.confirm(`${msg} [y/N]:`);
  if (!proceed) {
    console.log("User aborted!");
    process.exit(1);
  }
}

/**
 * @notice Same with `sendTransaction`, but requires confirmation for CLI before broadcasting
 */
export async function sendTxWithConfirm(
  signer: Wallet,
  msgs: Msg[],
  memo?: string,
  gas?: string
) {
  console.log("🚀 ~ file: helpers.ts ~ line 95 ~ signer", signer);

  let signMode: SignMode | undefined;
  if (signer.key instanceof LedgerKey) {
    signMode = SignMode.SIGN_MODE_LEGACY_AMINO_JSON;
  }

  const tx = await signer.createAndSignTx({
    msgs,
    ...DEFAULT_GAS_SETTINGS,
    memo: memo as string,
    gas: gas as string,
    signMode: signMode as SignMode,
  });
  console.log("\n" + JSON.stringify(tx).replace(/\\/g, "") + "\n");

  await waitForConfirm("Confirm transaction before broadcasting");

  const result = await signer.lcd.tx.broadcast(tx);
  if (isTxError(result)) {
    throw new Error(`tx failed! raw log: ${result.raw_log}`);
  }
  return result;
}

/**
 * @notice Same with `storeCode`, but requires confirmation for CLI before broadcasting
 */
export async function storeCodeWithConfirm(signer: Wallet, filePath: string) {
  const code = fs.readFileSync(filePath).toString("base64");
  const result = await sendTxWithConfirm(signer, [
    new MsgStoreCode(signer.key.accAddress, code),
  ]);
  return parseInt(result.logs[0].eventsByType["store_code"]["code_id"][0]);
}

/**
 * @notice Same with `instantiateContract`, but requires confirmation for CLI before broadcasting
 */
export async function instantiateWithConfirm(
  signer: Wallet,
  admin: string,
  codeId: number,
  initMsg: object,
  label = "Eris Liquid Staking Hub"
) {
  const result = await sendTxWithConfirm(signer, [
    new MsgInstantiateContract(
      signer.key.accAddress,
      admin,
      codeId,
      initMsg,
      undefined,
      label
    ),
  ]);
  return result;
}

export async function instantiateMultipleWithConfirm(
  signer: Wallet,
  admin: string,
  codeId: number,
  init: { msg: object; label: string }[]
) {
  const result = await sendTxWithConfirm(
    signer,
    init.map(
      (a) =>
        new MsgInstantiateContract(
          signer.key.accAddress,
          admin,
          codeId,
          a.msg,
          undefined,
          a.label
        )
    )
  );
  return result;
}

/**
 * Encode a JSON object to base64 string
 */
export function encodeBase64(obj: object | string | number) {
  return Buffer.from(JSON.stringify(obj)).toString("base64");
}
