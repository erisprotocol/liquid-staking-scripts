/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { wasmTypes } from "@cosmjs/cosmwasm-stargate/build/modules";
import { toUtf8 } from "@cosmjs/encoding";
import { LedgerSigner } from "@cosmjs/ledger-amino";
import {
  DirectSecp256k1Wallet,
  EncodeObject,
  Registry,
} from "@cosmjs/proto-signing";
import {
  AuthExtension,
  BankExtension,
  defaultRegistryTypes,
  QueryClient,
  setupAuthExtension,
  setupBankExtension,
  setupStakingExtension,
  setupTxExtension,
  StakingExtension,
  StdFee,
  TxExtension,
} from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import { MsgSend as CosmosMsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import { MsgExecuteContract as CosmosMsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { Any } from "cosmjs-types/google/protobuf/any";
import * as promptly from "promptly";
import * as keystore from "./../keystore";

import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";

// const DEFAULT_GAS_SETTINGS = {
//   // gasPrices: "5.665uluna",
//   // gasAdjustment: 1.2,
// };

interface NetworkInfo {
  lcd: string;
  rpc: string;
  gasDenom?: string;
  gasFee?: string;
  gasFactor?: number;
}

export interface MsgWrapper {
  type?: "send" | undefined;
  // if sender is empty wallet address is used
  sender?: string;
  contract: string;
  execute_msg: any;
  // if empty, will send no coins
  coins?: Record<string, number | string>;
}

export enum Chain {
  Juno = "juno",
  Kujira = "kujira",
  Osmosis = "osmo",
}

const networks: Record<Chain, NetworkInfo> = {
  [Chain.Juno]: {
    lcd: "https://lcd-juno.itastakers.com", //,'', // 'https://rpc-juno.whispernode.com/', ///rest', //',
    rpc: "https://rpc.juno.omniflix.co/",
    gasDenom: "ujuno",
    gasFee: "0.0025",
    gasFactor: 1.3,
  },
  [Chain.Kujira]: {
    lcd: "https://lcd-kujira.whispernode.com/rest",
    rpc: "https://rpc-kujira.whispernode.com/",
  },
  [Chain.Osmosis]: {
    lcd: "https://osmosis-lcd.quickapi.com:443/",
    rpc: " https://osmosis-rpc.quickapi.com:443/",
  },
};

export interface CosmosClients {
  wasmClient?: CosmWasmClient | undefined;
  tendermint: Tendermint34Client;
  queryClient: QueryClient &
    TxExtension &
    StakingExtension &
    BankExtension &
    AuthExtension;
  signingClient: SigningCosmWasmClient;
  address: string;
  info: NetworkInfo;
}

export async function createClient(
  network: Chain,
  keyName: string,
  keyDir: string
): Promise<CosmosClients> {
  const config = networks[network];

  const wasmClient = undefined; // await CosmWasmClient.connect(config.rpc);
  const tendermint = await Tendermint34Client.connect(config.rpc);

  const queryClient = QueryClient.withExtensions(
    tendermint,
    setupStakingExtension,
    setupBankExtension,
    setupTxExtension,
    setupAuthExtension
  );

  let signingClient: SigningCosmWasmClient | undefined;

  let addresses: string[];

  if (keyName === "ledger") {
    const transport = await TransportNodeHid.create(60 * 1000);
    const signer = new LedgerSigner(transport, { prefix: network });

    addresses = (await signer.getAccounts()).map((a) => a.address);
    signingClient = await SigningCosmWasmClient.connectWithSigner(
      config.rpc, // + '/rest',
      signer,
      {
        broadcastPollIntervalMs: 0,
        broadcastTimeoutMs: 0,
      }
    );
  } else {
    const password = await promptly.password(
      "Enter password to decrypt the key:"
    );

    const key = keystore.load(keyName, keyDir, password);

    const signer = await DirectSecp256k1Wallet.fromKey(key.privateKey, network);
    console.log("🚀 ~ file: helpers.ts ~ line 140 ~ key", key);
    addresses = (await signer.getAccounts()).map((a) => a.address);

    signingClient = await SigningCosmWasmClient.connectWithSigner(
      config.rpc, // + '/rest',
      signer,
      {
        broadcastPollIntervalMs: 0,
        broadcastTimeoutMs: 0,
      }
    );
  }

  console.log("ADDRESS", addresses);
  return {
    address: addresses[0],
    wasmClient,
    tendermint,
    queryClient,
    signingClient,
    info: config,
  };
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
  clients: CosmosClients,
  msgs: ExecuteWrapper,
  memo?: string
) {
  const cosmosMsgs = mapToCosmos(msgs);
  const anyMsgs = cosmosMsgs.map((a) => encodeCosmosMsgAsAny(a));
  const account = await clients.signingClient.getAccount(clients.address);
  console.log("🚀 ~ file: helpers.ts ~ line 185 ~ account", account);

  if (!account || !account.pubkey) {
    throw new Error("No account found");
  }

  const result = await clients.queryClient.tx.simulate(
    anyMsgs,
    undefined,
    account.pubkey,
    account.sequence
  );

  const gas = Math.ceil(
    (result.gasInfo?.gasUsed.toNumber() ?? 0) * (clients.info.gasFactor ?? 1.3)
  );
  const fee = Math.ceil(gas * +(clients.info.gasFee || 0));

  const signed = await clients.signingClient.sign(
    clients.address,
    cosmosMsgs,
    <StdFee>{
      gas: gas.toFixed(),
      amount: [
        {
          denom: clients.info.gasDenom,
          amount: fee.toFixed(),
        },
      ],
    },
    memo ?? ""
  );

  // const tx = await clients.createAndSignTx({
  //   msgs,
  //   ...DEFAULT_GAS_SETTINGS,
  //   memo: memo as string,
  //   gas: gas as string,
  //   signMode: signMode as SignMode,
  // });
  console.log("\n" + JSON.stringify(signed).replace(/\\/g, "") + "\n");
  console.log("\n" + JSON.stringify(cosmosMsgs).replace(/\\/g, "") + "\n");

  await waitForConfirm("Confirm transaction before broadcasting");

  const bytes = TxRaw.encode(signed).finish();
  const res = await clients.signingClient.broadcastTx(bytes);
  console.log("🚀 ~ file: helpers.ts ~ line 233 ~ res", res);

  return res;
}

// /**
//  * @notice Same with `storeCode`, but requires confirmation for CLI before broadcasting
//  */
// export async function storeCodeWithConfirm(signer: Wallet, filePath: string) {
//   const code = fs.readFileSync(filePath).toString("base64");
//   const result = await sendTxWithConfirm(signer, [
//     new MsgStoreCode(signer.key.accAddress, code),
//   ]);
//   return parseInt(result.logs[0].eventsByType["store_code"]["code_id"][0]);
// }

// /**
//  * @notice Same with `instantiateContract`, but requires confirmation for CLI before broadcasting
//  */
// export async function instantiateWithConfirm(
//   signer: Wallet,
//   admin: string,
//   codeId: number,
//   initMsg: object,
//   label = "Eris Liquid Staking Hub"
// ) {
//   const result = await sendTxWithConfirm(signer, [
//     new MsgInstantiateContract(
//       signer.key.accAddress,
//       admin,
//       codeId,
//       initMsg,
//       undefined,
//       label
//     ),
//   ]);
//   return result;
// }

// export async function instantiateMultipleWithConfirm(
//   signer: Wallet,
//   admin: string,
//   codeId: number,
//   init: { msg: object; label: string }[]
// ) {
//   const result = await sendTxWithConfirm(
//     signer,
//     init.map(
//       (a) =>
//         new MsgInstantiateContract(
//           signer.key.accAddress,
//           admin,
//           codeId,
//           a.msg,
//           undefined,
//           a.label
//         )
//     )
//   );
//   return result;
// }

// /**
//  * Encode a JSON object to base64 string
//  */
// export function encodeBase64(obj: object | string | number) {
//   return Buffer.from(JSON.stringify(obj)).toString("base64");
// }

export interface MsgWrapper {
  type?: "send" | undefined;
  // if sender is empty wallet address is used
  sender?: string;
  contract: string;
  execute_msg: any;
  // if empty, will send no coins
  coins?: Record<string, number | string>;
}

export interface ShareAndFeeInfo<T = any> {
  // share?: number;

  addition: Partial<T>;

  fee: number;
  gas: number;
  feeSymbol: string;
  feeDenom: string;
  tax: number;

  msgs: MsgWrapper[];
}

export interface ExecuteWrapper {
  feeInfo?: ShareAndFeeInfo;
  msgs: MsgWrapper[];
}

const defaultRegistry = new Registry([...defaultRegistryTypes, ...wasmTypes]);

export const encodeCosmosMsgAsAny = (encodeObject: EncodeObject): Any => {
  const binaryValue = defaultRegistry.encode(encodeObject);
  return Any.fromPartial({
    typeUrl: encodeObject.typeUrl,
    value: binaryValue,
  });
};

export const mapToCosmos = (execution: ExecuteWrapper): EncodeObject[] => {
  return execution.msgs
    .map((msg) => {
      if (!msg.type) {
        return {
          typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
          value: CosmosMsgExecuteContract.fromPartial({
            sender: msg.sender,
            contract: msg.contract,
            msg: toUtf8(JSON.stringify(msg.execute_msg)),
            funds: getCoinsCosmos(msg.coins),
          }),
        };
      } else if (msg.type === "send") {
        if (!msg.coins) {
          throw new Error("Coins not provided");
        }
        return {
          typeUrl: "/cosmos.bank.v1beta1.MsgSend",
          value: CosmosMsgSend.fromPartial({
            fromAddress: msg.sender,
            toAddress: msg.contract,
            amount: getCoinsCosmos(msg.coins)!,
          }),
        };
      }
      return undefined;
    })

    .filter(notEmpty);
};

const getCoinsCosmos = (
  coins: Record<string, string | number> | undefined
): { denom: string; amount: string }[] => {
  if (!coins) {
    return [];
  }

  if (coins instanceof Array) {
    return coins.map((c) => ({ denom: c.denom, amount: c.amount }));
  }

  return Object.keys(coins).map((key) => ({
    denom: key,
    amount: getCoinValue(coins[key]),
  }));
};

const getCoinValue = (amount: string | number): string => {
  if (typeof amount === "number") {
    return amount.toFixed();
  } else {
    return amount;
  }
};

export const notEmpty = <TValue>(
  value: TValue | null | undefined
): value is TValue => {
  return value !== null && value !== undefined;
};
