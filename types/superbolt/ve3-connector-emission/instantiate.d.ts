/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

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
export type MintConfig =
  | ("mint_direct" | "mint_proxy")
  | "use_balance"
  | {
      create_token: {
        subdenom: string;
      };
    };
export type RebaseConfg =
  | {
      fixed: Decimal;
    }
  | {
      dynamic: {};
    }
  | {
      target_yearly_apy: Decimal;
    };
/**
 * A fixed-point decimal value with 18 fractional digits, i.e. Decimal(1_000_000_000_000_000_000) == 1.0
 *
 * The greatest possible value that can be represented is 340282366920938463463.374607431768211455 (which is (2^128 - 1) / 10^18)
 */
export type Decimal = string;

export interface InstantiateMsg {
  emission_token: AssetInfoBaseFor_String;
  emissions_per_week: Uint128;
  gauge: string;
  global_config_addr: string;
  mint_config: MintConfig;
  rebase_config: RebaseConfg;
  team_share: Decimal;
}
