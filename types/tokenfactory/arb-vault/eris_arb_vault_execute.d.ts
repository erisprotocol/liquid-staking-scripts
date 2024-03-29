/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * This structure describes the execute messages available in the contract.
 */
export type ExecuteMsg =
  | {
      unbond: {
        immediate?: boolean | null;
      };
    }
  | {
      deposit: {
        asset: Description;
        receiver?: string | null;
      };
    }
  | {
      withdraw_unbonded: {};
    }
  | {
      withdraw_immediate: {
        id: number;
      };
    }
  | {
      update_config: {
        disable_lsd?: string | null;
        fee_config?: FeeConfigFor_String | null;
        force_remove_lsd?: string | null;
        insert_lsd?: LsdConfigFor_String | null;
        remove_lsd?: string | null;
        remove_whitelist?: boolean | null;
        set_whitelist?: string[] | null;
        unbond_time_s?: number | null;
        utilization_method?: UtilizationMethod | null;
      };
    }
  | {
      execute_arbitrage: {
        msg: ExecuteSubMsg;
        result_token: AssetInfo;
        wanted_profit: Decimal;
      };
    }
  | {
      withdraw_from_liquid_staking: {
        names?: string[] | null;
      };
    }
  | {
      unbond_from_liquid_staking: {
        names?: string[] | null;
      };
    }
  | {
      propose_new_owner: {
        /**
         * The validity period of the proposal to change the owner
         */
        expires_in: number;
        /**
         * The newly proposed owner
         */
        owner: string;
      };
    }
  | {
      drop_ownership_proposal: {};
    }
  | {
      claim_ownership: {};
    }
  | {
      callback: CallbackMsg;
    };
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
 * This enum describes available Token types. ## Examples ``` # use cosmwasm_std::Addr; # use astroport::asset::AssetInfo::{NativeToken, Token}; Token { contract_addr: Addr::unchecked("terra...") }; NativeToken { denom: String::from("uluna") }; ```
 */
export type AssetInfo =
  | {
      token: {
        contract_addr: Addr;
        [k: string]: unknown;
      };
    }
  | {
      native_token: {
        denom: string;
        [k: string]: unknown;
      };
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
 * A fixed-point decimal value with 18 fractional digits, i.e. Decimal(1_000_000_000_000_000_000) == 1.0
 *
 * The greatest possible value that can be represented is 340282366920938463463.374607431768211455 (which is (2^128 - 1) / 10^18)
 */
export type Decimal = string;
export type LsdTypeFor_String =
  | {
      eris: {
        addr: string;
        denom: string;
      };
    }
  | {
      backbone: {
        addr: string;
        denom: string;
      };
    };
export type UtilizationMethod = {
  steps: [Decimal, Decimal][];
};
/**
 * Binary is a wrapper around Vec<u8> to add base64 de/serialization with serde. It also adds some helper methods to help encode inline.
 *
 * This is only needed as serde-json-{core,wasm} has a horrible encoding for Vec<u8>. See also <https://github.com/CosmWasm/cosmwasm/blob/main/docs/MESSAGE_TYPES.md>.
 */
export type Binary = string;
/**
 * This structure describes the callback messages of the contract.
 */
export type CallbackMsg = {
  assert_result: {
    result_token: AssetInfo;
    wanted_profit: Decimal;
  };
};

/**
 * This enum describes a Terra asset (native or CW20).
 */
export interface Description {
  /**
   * A token amount
   */
  amount: Uint128;
  /**
   * Information about an asset stored in a [`AssetInfo`] struct
   */
  info: AssetInfo;
  [k: string]: unknown;
}
export interface FeeConfigFor_String {
  immediate_withdraw_fee: Decimal;
  protocol_fee_contract: string;
  protocol_performance_fee: Decimal;
  protocol_withdraw_fee: Decimal;
}
export interface LsdConfigFor_String {
  disabled: boolean;
  lsd_type: LsdTypeFor_String;
  name: string;
}
export interface ExecuteSubMsg {
  contract_addr?: string | null;
  funds_amount: Uint128;
  msg: Binary;
}
