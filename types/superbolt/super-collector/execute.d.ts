/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type ExecuteMsg =
  | {
      collect: {
        /**
         * The assets to swap to stablecoin
         */
        assets?: AssetWithLimit[] | null;
        min_received?: Uint128 | null;
      };
    }
  | {
      update_config: {
        controller?: string | null;
        cw20?: string[] | null;
        distribution_asset?: AssetInfoBaseFor_String | null;
        target_list?: TargetFor_String[] | null;
      };
    }
  | {
      callback: CallbackMsg;
    };
/**
 * Represents the type of an fungible asset.
 *
 * Each **asset info** instance can be one of three variants:
 *
 * - Native SDK coins. To create an **asset info** instance of this type, provide the denomination. - CW20 tokens. To create an **asset info** instance of this type, provide the contract address.
 */
export type AssetInfoBaseFor_Addr =
  | {
      native: string;
    }
  | {
      cw20: Addr;
    };
/**
 * A human readable address.
 *
 * In Cosmos, this is typically bech32 encoded. But for multi-chain smart contracts no assumptions should be made other than being UTF-8 encoded and of reasonable length.
 *
 * This type represents a validated address. It can be created in the following ways 1. Use `Addr::unchecked(input)` 2. Use `let checked: Addr = deps.api.addr_validate(input)?` 3. Use `let checked: Addr = deps.api.addr_humanize(canonical_addr)?` 4. Deserialize from JSON. This must only be done from JSON that was validated before such as a contract's state. `Addr` must not be used in messages sent by the user because this would result in unvalidated instances.
 *
 * This type is immutable. If you really need to mutate it (Really? Are you sure?), create a mutable copy using `let mut mutable = Addr::to_string()` and operate on that `String` instance.
 */
export type Addr = string;
/**
 * A thin wrapper around u128 that is using strings for JSON encoding/decoding, such that the full u128 range can be used for clients that convert JSON numbers to floats, like JavaScript and jq.
 *
 * # Examples
 *
 * Use `from` to create instances of this and `u128` to get the value out:
 *
 * ``` # use cosmwasm_std::Uint128; let a = Uint128::from(123u128); assert_eq!(a.u128(), 123);
 *
 * let b = Uint128::from(42u64); assert_eq!(b.u128(), 42);
 *
 * let c = Uint128::from(70u32); assert_eq!(c.u128(), 70); ```
 */
export type Uint128 = string;
/**
 * Represents the type of an fungible asset.
 *
 * Each **asset info** instance can be one of three variants:
 *
 * - Native SDK coins. To create an **asset info** instance of this type, provide the denomination. - CW20 tokens. To create an **asset info** instance of this type, provide the contract address.
 */
export type AssetInfoBaseFor_String =
  | {
      native: string;
    }
  | {
      cw20: string;
    };
/**
 * Binary is a wrapper around Vec<u8> to add base64 de/serialization with serde. It also adds some helper methods to help encode inline.
 *
 * This is only needed as serde-json-{core,wasm} has a horrible encoding for Vec<u8>. See also <https://github.com/CosmWasm/cosmwasm/blob/main/docs/MESSAGE_TYPES.md>.
 */
export type Binary = string;
export type TargetType =
  | "weight"
  | {
      fill_up_first: {
        filled_to: Uint128;
        min_fill?: Uint128 | null;
      };
    }
  | {
      ibc: {
        channel_id: string;
        ics20?: string | null;
      };
    };
export type CallbackMsg = {
  distribute: {};
};

export interface AssetWithLimit {
  /**
   * Information about the fee token to swap
   */
  info: AssetInfoBaseFor_Addr;
  /**
   * The amount of tokens to swap
   */
  limit?: Uint128 | null;
}
export interface TargetFor_String {
  addr: string;
  asset_override?: AssetInfoBaseFor_String | null;
  msg?: Binary | null;
  target_type: TargetType;
  weight: number;
}