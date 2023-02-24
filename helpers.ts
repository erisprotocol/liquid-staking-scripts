import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import {
  Coins,
  isTxError,
  LCDClient,
  Msg,
  MsgInstantiateContract,
  MsgStoreCode,
  Tx,
  Wallet,
} from "@terra-money/feather.js";
import { LedgerKey } from "@terra-money/ledger-station-js";
import { SignMode } from "@terra-money/terra.proto/cosmos/tx/signing/v1beta1/signing";
import * as fs from "fs";
import * as promptly from "promptly";
import * as keystore from "./keystore";

const DEFAULT_GAS_SETTINGS = {
  // gasPrices: "5.665uluna",
  // gasAdjustment: 1.2,
};

let current_network:
  | "juno"
  | "classic"
  | "ledger"
  | "ledger-juno"
  | "mainnet"
  | "migaloo"
  | "testnet-migaloo"
  | "testnet-kujira"
  | "testnet" = "testnet";

export function getChainId() {
  switch (current_network) {
    case "juno":
      return "juno-1";
    case "ledger":
      return "phoenix-1";
    case "mainnet":
      return "phoenix-1";
    case "testnet":
      return "pisco-1";
    case "classic":
      return "columbus-5";
    case "ledger-juno":
      return "juno-1";
    case "testnet-migaloo":
      return "narwhal-1";
    case "migaloo":
      return "migaloo-1";
    case "testnet-kujira":
      return "harpoon-4";
    default: {
    }
  }
  throw new Error("unknown network");
}

export function getPrefix() {
  switch (current_network) {
    case "juno":
      return "juno";
    case "ledger":
      return "terra";
    case "mainnet":
      return "terra";
    case "testnet":
      return "terra";
    case "classic":
      return "terra";
    case "ledger-juno":
      return "juno";
    case "testnet-migaloo":
      return "migaloo";
    case "migaloo":
      return "migaloo";
    case "testnet-kujira":
      return "kujira";
    default: {
    }
  }
  throw new Error("unknown network");
}

/**
 * @notice Create an `LCDClient` instance based on provided network identifier
 */
export function createLCDClient(network: string): LCDClient {
  current_network = network as any;

  return new LCDClient({
    ...(network === "mainnet" || network === "ledger"
      ? {
          "phoenix-1": {
            chainID: "phoenix-1",
            lcd: "https://phoenix-lcd.terra.dev",
            gasAdjustment: 1.2,
            prefix: "terra",
            gasPrices: { uluna: 0.015 },
          },
        }
      : {}),

    ...(network === "testnet"
      ? {
          "pisco-1": {
            chainID: "pisco-1",
            lcd: "https://pisco-lcd.terra.dev",
            // lcd: "https://pisco-lcd.erisprotocol.com",
            gasAdjustment: 1.5,
            prefix: "terra",
            gasPrices: { uluna: 0.015 },
          },
        }
      : {}),

    ...(network === "testnet-migaloo"
      ? {
          "narwhal-1": {
            chainID: "narwhal-1",
            lcd: "https://whitewhale-testnet-api.polkachu.com",
            gasAdjustment: 1.5,
            prefix: "migaloo",
            gasPrices: { uwhale: 0 },
          },
        }
      : {}),
    ...(network === "migaloo"
      ? {
          "migaloo-1": {
            chainID: "migaloo-1",
            lcd: "https://migaloo-api.polkachu.com",
            gasAdjustment: 1.5,
            prefix: "migaloo",
            gasPrices: { uwhale: 0 },
          },
        }
      : {}),

    // ...(network === "testnet-kujira"
    // ? {
    //     "harpoon-4": {
    //       chainID: "harpoon-4",
    //       lcd: "https://lcd.harpoon.kujira.setten.io",
    //       gasAdjustment: 1.3,
    //       prefix: "kujira",
    //       gasPrices: {
    //         ukuji: 0.0025,
    //       },
    //     },
    //   }
    // : {}),
    ...(network === "testnet-kujira"
      ? {
          "harpoon-4": {
            chainID: "harpoon-4",
            lcd: "https://kujira-testnet-api.polkachu.com",
            gasAdjustment: 1.3,
            prefix: "kujira",
            gasPrices: {
              ukuji: 0.0025,
            },
          },
        }
      : {}),

    ...(network === "classic"
      ? {
          "columbus-5": {
            chainID: "columbus-5",
            lcd: "https://lcd.terra.dev",
            gasPrices: { uluna: "28.325" },
            gasAdjustment: 1.2,
            prefix: "terra",
          },
        }
      : {}),

    "juno-1": {
      chainID: "juno-1",
      lcd: "https://juno-api.polkachu.com",
      gasPrices: {
        ujuno: "0.0025",
      },
      gasAdjustment: 1.3,
      prefix: "juno",
    },
  });
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
    const lk = await LedgerKey.create({
      transport: await TransportNodeHid.create(60 * 1000),
    });
    return terra.wallet(lk);
  }
  if (keyName === "ledger-juno") {
    const lk = await LedgerKey.create({
      transport: await TransportNodeHid.create(60 * 1000),
      coinType: 118,
    });
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
  gas?: string,
  confirm = true
) {
  try {
    let signMode: SignMode | undefined;
    if (signer.key instanceof LedgerKey) {
      signMode = SignMode.SIGN_MODE_LEGACY_AMINO_JSON;
    }

    const x = {
      msgs,
      ...DEFAULT_GAS_SETTINGS,
      memo: memo as string,
      gas: gas as string,
      signMode: signMode as SignMode,
      chainID: getChainId(),
    };
    // console.log("🚀 ~ file: helpers.ts:195 ~ x", x);

    let tx: Tx;

    try {
      tx = await signer.createAndSignTx(x);
    } catch (error: any) {
      if (error?.response?.data?.message?.includes("not found")) {
        console.log("INSIDE");
        const accountNumber = await signer.accountNumber(x.chainID);
        console.log("🚀 ~ file: helpers.ts:223 ~ accountNumber", accountNumber);
        tx = await signer.createAndSignTx({
          ...x,
          accountNumber,
          sequence: 0,
        });
      } else {
        throw error;
      }
    }
    // console.log("🚀 ~ file: helpers.ts:195 ~ tx", tx);

    if (confirm) {
      console.log("\n" + JSON.stringify(tx).replace(/\\/g, "") + "\n");

      await waitForConfirm("Confirm transaction before broadcasting");
    }

    const result = await signer.lcd.tx.broadcast(tx, getChainId());
    if (isTxError(result)) {
      throw new Error(`tx failed! raw log: ${result.raw_log}`);
    }
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * @notice Same with `storeCode`, but requires confirmation for CLI before broadcasting
 */
export async function storeCodeWithConfirm(
  signer: Wallet,
  filePath: string,
  confirm = true
) {
  const code = fs.readFileSync(filePath).toString("base64");
  const result = await sendTxWithConfirm(
    signer,
    [new MsgStoreCode(signer.key.accAddress(getPrefix()), code)],
    undefined,
    undefined,
    confirm
  );
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
  label = "Eris Liquid Staking Hub",
  initCoins?: Coins.Input
) {
  const result = await sendTxWithConfirm(signer, [
    new MsgInstantiateContract(
      signer.key.accAddress(getPrefix()),
      admin,
      codeId,
      initMsg,
      initCoins,
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
          signer.key.accAddress(getPrefix()),
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
