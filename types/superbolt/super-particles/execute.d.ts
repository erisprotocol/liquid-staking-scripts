/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type ExecuteMsg =
  | {
      receive_nft: Cw721ReceiveMsg;
    }
  | {
      deposit_all: {
        token_ids: string[];
      };
    }
  | {
      withdraw: {
        token_id: string;
      };
    }
  | {
      update_config: {
        charge_royalty_on_withdraw?: boolean | null;
        controller?: string | null;
      };
    }
  | {
      update_data: {
        token_map?: TokenMapEntry[] | null;
      };
    };
/**
 * Binary is a wrapper around Vec<u8> to add base64 de/serialization with serde. It also adds some helper methods to help encode inline.
 *
 * This is only needed as serde-json-{core,wasm} has a horrible encoding for Vec<u8>. See also <https://github.com/CosmWasm/cosmwasm/blob/main/docs/MESSAGE_TYPES.md>.
 */
export type Binary = string;

/**
 * Cw721ReceiveMsg should be de/serialized under `Receive()` variant in a ExecuteMsg
 */
export interface Cw721ReceiveMsg {
  msg: Binary;
  sender: string;
  token_id: string;
}
export interface TokenMapEntry {
  particles: number;
  token_id: string;
}
