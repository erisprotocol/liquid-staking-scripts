import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import {
  Coins,
  isTxError,
  LCDClient,
  LCDClientConfig,
  MnemonicKey,
  Msg,
  MsgExecuteContract,
  MsgInstantiateContract,
  MsgStoreCode,
  Tx,
  TxLog,
  Wallet,
} from "@terra-money/feather.js";
import { LedgerKey } from "@terra-money/ledger-station-js";
import { SignMode } from "@terra-money/terra.proto/cosmos/tx/signing/v1beta1/signing";
import * as axios from "axios";
import * as fs from "fs";
import { get, set } from "lodash";
import * as promptly from "promptly";
import * as keystore from "./keystore";
import { AssetInfo } from "./types/ampz/eris_ampz_execute";
import { NeutronTxResponse } from "./types/model";
import { AssetInfoBaseFor_Addr } from "./types/ve3/asset-staking/response_to_all_pending_rewards";

const DEFAULT_GAS_SETTINGS = {
  // gasPrices: "5.665uluna",
  // gasAdjustment: 1.2,
};

// interface LCDExtension {}

const phoenix: LCDClientConfig = {
  chainID: "phoenix-1",
  // lcd: "https://phoenix-lcd.terra.dev",
  lcd: "https://phoenix-lcd.erisprotocol.com",
  gasAdjustment: 1.4,
  prefix: "terra",
  gasPrices: { uluna: 0.015 },
};
const phoenixLowfee: LCDClientConfig = {
  chainID: "phoenix-1",
  // lcd: "https://phoenix-lcd.terra.dev",
  lcd: "https://phoenix-lcd.erisprotocol.com",
  gasAdjustment: 1.3,
  prefix: "terra",
  gasPrices: { uluna: 0.000025 },
};
const columbus: LCDClientConfig = {
  chainID: "columbus-5",
  lcd: "https://lcd.terra.dev",
  gasPrices: { uluna: "28.325" },
  gasAdjustment: 1.3,
  prefix: "terra",
};
const phoenix_newmetric: LCDClientConfig = {
  chainID: "phoenix-1",
  // lcd: "https://phoenix-lcd.terra.dev",
  lcd: "https://cradle-manager.ec1-prod.newmetric.xyz/cradle/proxy/3d0f9480-3445-4038-b1de-303791b951ff",
  gasAdjustment: 1.4,
  prefix: "terra",
  gasPrices: { uluna: 0.015 },
};

const networks = {
  mainnet: phoenix,
  ["mainnet-lowfee"]: phoenixLowfee,
  ["mainnet-copy"]: phoenix_newmetric,
  ledger: phoenix,
  classic: columbus,
  ["classic-testnet"]: columbus,
  ["ledger-classic"]: columbus,
  testnet: {
    chainID: "pisco-1",
    // lcd: "https://pisco-lcd.terra.dev",
    lcd: "https://pisco-lcd.erisprotocol.com",
    gasAdjustment: 1.5,
    prefix: "terra",
    gasPrices: { uluna: 0.015 },
  },
  ["testnet-kujira"]: {
    chainID: "harpoon-4",
    lcd: "https://kujira-testnet-api.polkachu.com",
    gasAdjustment: 1.3,
    prefix: "kujira",
    gasPrices: {
      ukuji: 0.0025,
    },
  },
  kujira: {
    chainID: "kaiyo-1",
    lcd: "https://kujira-api.polkachu.com",
    gasAdjustment: 1.3,
    prefix: "kujira",
    gasPrices: {
      ukuji: 0.0034,
    },
  },
  "kujira-copy": {
    chainID: "kaiyo-1",
    lcd: "https://cradle-manager.ec1-prod.newmetric.xyz/cradle/proxy/2128d7dc-6cbb-49b7-987a-a2e706a1898b",
    gasAdjustment: 1.3,
    prefix: "kujira",
    gasPrices: {
      ukuji: 0.0034,
    },
  },
  ["testnet-migaloo"]: {
    chainID: "narwhal-1",
    lcd: "https://whitewhale-testnet-api.polkachu.com",
    gasAdjustment: 1.5,
    prefix: "migaloo",
    gasPrices: { uwhale: 0 },
  },
  ["testnet-cosmos"]: {
    chainID: "theta-testnet-001",
    lcd: "https://rest.sentry-01.theta-testnet.polypore.xyz",
    gasAdjustment: 1.5,
    prefix: "cosmos",
    gasPrices: { uatom: 0.01 },
  },
  migaloo: {
    chainID: "migaloo-1",
    // lcd: "https://migaloo-lcd.erisprotocol.com",
    lcd: "https://migaloo-api.polkachu.com",
    // lcd: "https://api-migaloo.cosmos-spaces.cloud",
    gasAdjustment: 1.5,
    prefix: "migaloo",
    gasPrices: { uwhale: 1 },
  },
  ["archwaytest"]: {
    chainID: "constantine-3",
    lcd: "https://api.constantine.archway.tech",
    gasAdjustment: 1.3,
    prefix: "archway",
    gasPrices: { aconst: 900000000000 },
  },
  ["archway"]: {
    chainID: "archway-1",
    lcd: "https://api.mainnet.archway.io",
    gasAdjustment: 1.3,
    prefix: "archway",
    gasPrices: { aarch: 900000500000 },
  },
  chihuahua: {
    chainID: "chihuahua-1",
    lcd: "https://api.chihuahua.wtf",
    gasAdjustment: 1.3,
    prefix: "chihuahua",
    gasPrices: { uhuahua: "500" },
  },
  juno: <LCDClientConfig>{
    chainID: "juno-1",
    lcd: "https://juno-api.polkachu.com",
    gasPrices: {
      ujuno: "0.075",
    },
    gasAdjustment: 1.3,
    prefix: "juno",
  },
  osmosis: {
    chainID: "osmosis-1",
    lcd: "https://osmosis-api.polkachu.com/",
    gasAdjustment: 1.3,
    prefix: "osmo",
    // gasPrices: { uosmo: 0.0025 },
    gasPrices: { uosmo: 0.004 },
  },
  "testnet-osmosis": {
    chainID: "osmo-test-5",
    lcd: "https://lcd.osmotest5.osmosis.zone",
    gasAdjustment: 1.5,
    prefix: "osmo",
    gasPrices: { uosmo: 0.01 },
  },
  neutron: {
    chainID: "neutron-1",
    lcd: "https://rest-kralum.neutron-1.neutron.org/",
    gasAdjustment: 1.4,
    prefix: "neutron",
    gasPrices: { untrn: 0.01 },
  },
  "testnet-neutron": {
    chainID: "pion-1",
    lcd: "https://rest-falcron.pion-1.ntrn.tech/",
    gasAdjustment: 1.5,
    prefix: "neutron",
    gasPrices: { untrn: 0.0053 },
  },
  sei: {
    chainID: "pacific-1",
    lcd: "https://sei-api.polkachu.com/",
    gasAdjustment: 1.1,
    prefix: "sei",
    gasPrices: { usei: 0.1 },
  },
  nibiru: {
    chainID: "cataclysm-1",
    // lcd: "https://lcd.nibiru.fi/",
    lcd: "https://nibiru.api.kjnodes.com",
    gasAdjustment: 1.3,
    prefix: "nibi",
    gasPrices: { unibi: 0.025 },
  },
  "testnet-nibiru": {
    chainID: "nibiru-testnet-1",
    // lcd: "https://lcd.nibiru.fi/",
    lcd: "https://lcd.testnet-1.nibiru.fi",
    gasAdjustment: 1.3,
    prefix: "nibi",
    gasPrices: { unibi: 0.025 },
  },
};

export type Chains = keyof typeof networks;

let current_network: Chains = "testnet";

export function getChainId() {
  const result = networks[current_network];
  return result.chainID;
}

export function getPrefix() {
  const result = networks[current_network];
  return result.prefix;
}

export function getCurrent() {
  return networks[current_network];
}

/**
 * @notice Create an `LCDClient` instance based on provided network identifier
 */
export function createLCDClient(network: string): LCDClient {
  current_network = network as any;
  const config = networks[current_network];
  return new LCDClient({
    [config.chainID]: config,
  });
}

/**
 * @notice Create a `Wallet` instance by loading the private key stored in the keystore
 */
export async function createWallet(terra: LCDClient, keyName: string, keyDir: string): Promise<Wallet> {
  if (keyName === "ledger") {
    const lk = await LedgerKey.create({
      transport: await TransportNodeHid.create(60 * 1000),
    });
    return terra.wallet(lk as any);
  }
  if (keyName === "ledger-classic") {
    const lk = await LedgerKey.create({
      transport: await TransportNodeHid.create(60 * 1000),
    });
    return terra.wallet(lk as any);
  }
  if (keyName === "ledger-juno") {
    const lk = await LedgerKey.create({
      transport: await TransportNodeHid.create(60 * 1000),
      coinType: 118,
    });
    return terra.wallet(lk as any);
  }
  // if (keyName === "ledger-juno") {
  //   const lk = await JunoLedgerKey.create(
  //     await TransportNodeHid.create(60 * 1000)
  //   );

  //   return terra.wallet(lk);
  // }

  const password = await promptly.password("Enter password to decrypt the key:");

  if (keyName.startsWith("key-")) {
    const words = keystore.loadKey(keyName, keyDir, password);
    const mnemonic = new MnemonicKey({ mnemonic: words, coinType: 118 });
    return terra.wallet(mnemonic);
  }

  const key = keystore.load(keyName, keyDir, password);
  return terra.wallet(key);
}

/**
 * @notice Create a `Wallet` instance by loading the private key stored in the keystore
 */
export async function getMnemonic(keyName: string, keyDir: string): Promise<string> {
  const password = await promptly.password("Enter password to decrypt the key:");
  const key = keystore.loadKey(keyName, keyDir, password);
  return key;
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
export async function sendTxWithConfirm(signer: Wallet, msgs: Msg[], memo?: string, gas?: string, confirm = true) {
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

    let tx: Tx;

    try {
      const info = await signer.accountNumber(x.chainID);
      // console.log("signer", signer, info);
      tx = await signer.createAndSignTx(x);
    } catch (error: any) {
      if (error?.response?.data?.message?.includes("not found")) {
        // console.log("INSIDE " + error?.response?.data?.message);
        const accountNumber = await signer.accountNumber(x.chainID);
        // console.log("🚀 ~ file: helpers.ts:223 ~ accountNumber", accountNumber);
        tx = await signer.createAndSignTx({
          ...x,
          accountNumber,
          sequence: 0,
        });
      } else {
        console.log("fallback axios");
        const lcd = signer.lcd.config[x.chainID].lcd;
        const account = await axios.default.get<{ info: { account_number: string; sequence: string } }>(
          `${lcd}/cosmos/auth/v1beta1/account_info/nibi1dpaaxgw4859qhew094s87l0he8tfea3ln0cmke`
        );
        console.log(account.data);
        tx = await signer.createAndSignTx({
          ...x,
          accountNumber: +account.data.info.account_number,
          sequence: +account.data.info.sequence,
        });
      }
    }

    // if (x.chainID === "chihuahua-1") {
    //   const fee = new Coin("uchihuahua", tx.auth_info.fee.gas_limit);
    //   tx = await signer.createAndSignTx({
    //     ...x,
    //     fee: new Fee(tx.auth_info.fee.gas_limit, [fee]),
    //   });
    // }

    if (confirm) {
      console.log("\n" + JSON.stringify(tx).replace(/\\/g, "") + "\n");

      await waitForConfirm("Confirm transaction before broadcasting");
    }

    const result = await signer.lcd.tx.broadcast(tx, getChainId());
    console.log("Hash: ", result.txhash);
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
 * @notice Same with `sendTransaction`, but requires confirmation for CLI before broadcasting
 */
export async function sendTxWithConfirmUnsigned(
  wallet: Wallet,
  msgs: Msg[],
  memo?: string,
  gas?: string,
  confirm = true
) {
  try {
    const x = {
      msgs,
      ...DEFAULT_GAS_SETTINGS,
      memo: memo as string,
      gas: gas as string,
      chainID: getChainId(),
    };

    const tx = await wallet.createTx(x);

    if (confirm) {
      console.log("\n" + JSON.stringify(tx).replace(/\\/g, "") + "\n");
      await waitForConfirm("Confirm transaction before broadcasting");
    }

    const result = await wallet.lcd.tx.broadcast(tx, getChainId());
    console.log("Hash: ", result.txhash);
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
export async function storeCodeWithConfirm(signer: Wallet, filePath: string, confirm = true) {
  const code = fs.readFileSync(filePath).toString("base64");
  const result = await sendTxWithConfirm(
    signer,
    [new MsgStoreCode(signer.key.accAddress(getPrefix()), code)],
    undefined,
    undefined,
    confirm
  );

  if (!result.logs.length) {
    const tx = await getTx(result.txhash);
    if (tx) {
      return parseInt(
        tx.events.find((a) => a.type === "store_code")?.attributes.find((a) => a.key === "code_id")?.value ?? ""
      );
    }
  }
  return parseInt(result.logs[0].eventsByType["store_code"]["code_id"][0]);
}
export async function getTx(txhash: string) {
  const config = getCurrent();
  for (let index = 0; index < 10; index++) {
    try {
      const tx = (await axios.default.get<NeutronTxResponse>(`${config.lcd}/cosmos/tx/v1beta1/txs/${txhash}`)).data
        .tx_response;

      if (tx.code === 0) {
        return tx;
      }
    } catch (error) {}
  }
  return undefined;
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
    new MsgInstantiateContract(signer.key.accAddress(getPrefix()), admin, codeId, initMsg, initCoins, label),
  ]);

  if (!result.logs.length) {
    // console.log("SEARCH");
    const tx = await getTx(result.txhash);
    // console.log("found tx", tx?.events);
    const attributes = tx?.events.find((a) => a.type === "instantiate")?.attributes;
    // console.log("attributes", attributes);
    const address = attributes?.find((a) => a.key === "_contract_address")?.value ?? "";

    return {
      ...result,
      tx,
      address,
    };
  }

  const extendedResult = {
    ...result,
    address: result.logs.map((a: TxLog) => a.eventsByType["instantiate"]["_contract_address"][0])[0],
  };

  return extendedResult;
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
      (a) => new MsgInstantiateContract(signer.key.accAddress(getPrefix()), admin, codeId, a.msg, undefined, a.label)
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

export const delayPromise = (delayMs: number): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(delayMs);
    }, delayMs);
  });
};

export const toBase64 = (obj: any): string => {
  return Buffer.from(JSON.stringify(obj)).toString("base64");
};

export const getToken = (asset: AssetInfo | AssetInfoBaseFor_Addr | string) => {
  if (typeof asset === "string") {
    return asset;
  } else if ("token" in asset) {
    return asset.token.contract_addr;
  } else if ("native_token" in asset) {
    return asset.native_token.denom;
  } else if ("cw20" in asset) {
    return asset.cw20;
  } else {
    return asset.native;
  }
};

export const toNew = (asset: AssetInfo): AssetInfoBaseFor_Addr => {
  if ("native_token" in asset) {
    return { native: asset.native_token.denom };
  } else {
    return { cw20: asset.token.contract_addr };
  }
};

export const addInfo = (folder: string, network: Chains, path: string, value: string) => {
  const filePath = folder + "/data.json";
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath).toString() : "{}";
  const data = JSON.parse(existing);

  if (!data[network]) {
    data[network] = {};
  }

  const existingValue = get(data[network], path);

  if (existingValue) {
    console.log(`changing value ${folder}.${network}.${path}: ${existingValue} -> ${value}`);
  } else {
    console.log(`adding value ${folder}.${network}.${path}: ${value}`);
  }

  set(data[network], path, value);

  fs.writeFileSync(filePath, JSON.stringify(data, undefined, 2));
};

export const getInfo = (folder: string, network: Chains, path: string) => {
  const filePath = folder + "/data.json";
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath).toString() : "{}";
  const data = JSON.parse(existing);

  if (!data[network]) {
    data[network] = {};
  }

  const existingValue = get(data[network], path);

  if (existingValue) {
    return existingValue;
  } else {
    throw new Error(`did not find ${folder}.${network}.${path}`);
  }
};

export const selectMany = <T, U>(array: T[], selector: (x: T) => U[]): Array<U> => {
  const result = array.map((x) => selector(x));
  if (!result.length) {
    return [];
  }
  return result.reduce((a, b) => a.concat(b));
};

export function printProposal(msg: MsgExecuteContract): MsgExecuteContract {
  console.log("Contract: ", msg.contract);
  console.log(JSON.stringify(msg.execute_msg, null, 2));

  return msg;
}

let props: MsgExecuteContract[] = [];
export function addProposal(msg: MsgExecuteContract): MsgExecuteContract {
  props.push(msg);
  return msg;
}

export function done(title: string, description: string, dao: string) {
  const data = {
    id: "DaoProposalSingle",
    data: {
      title,
      description,
      actionData: props.map((a, index) => ({
        _id: index.toString(),
        actionKey: "execute",
        data: {
          chainId: "phoenix-1",
          sender: dao,
          address: a.contract,
          message: JSON.stringify(a.execute_msg, null, 2),
          funds: [],
          cw20: false,
        },
      })),
    },
  };

  const dataFill = Buffer.from(JSON.stringify(data)).toString("base64");
  const urlFill = encodeURIComponent(JSON.stringify(data));

  const url = `https://daodao.zone/dao/${dao}/proposals/create?prefill=${dataFill}`;
  const url2 = `https://daodao.zone/dao/${dao}/proposals/create?prefill=${urlFill}`;

  props = [];
  console.log(url);
  console.log("---");
  console.log(url2);
  throw new Error("dont commit");
  return undefined;
}
