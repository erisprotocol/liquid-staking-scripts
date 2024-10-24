/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type DaoInterfaceFor_Addr =
  | {
      enterprise: {
        addr: Addr;
        fund_distributor: Addr;
      };
    }
  | {
      enterprise_v2: {
        distributor: Addr;
        gov: Addr;
        membership: Addr;
      };
    }
  | {
      cw4: {
        addr: Addr;
        fund_distributor: Addr;
        gov: Addr;
      };
    }
  | {
      dao_dao: {
        /**
         * entropic variant of rewards claimable
         */
        cw_rewards: Addr;
        gov: Addr;
        staking: Addr;
      };
    }
  | {
      dao_dao_v2: {
        gov: Addr;
        rewards: [Addr, number][];
        staking: Addr;
      };
    }
  | {
      alliance: {
        addr: Addr;
      };
    }
  | {
      capa: {
        gov: Addr;
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
export type StageType =
  | {
      dex: {
        addr: Addr;
      };
    }
  | {
      manta: {
        addr: Addr;
        msg: MantaMsg;
      };
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
 * This enum describes available Token types. ## Examples ``` # use cosmwasm_std::Addr; # use astroport::asset::AssetInfo::{NativeToken, Token}; Token { contract_addr: Addr::unchecked("stake...") }; NativeToken { denom: String::from("uluna") }; ```
 */
export type AssetInfo =
  | {
      token: {
        contract_addr: Addr;
      };
    }
  | {
      native_token: {
        denom: string;
      };
    };
export type WithdrawType = {
  dex: {
    addr: Addr;
  };
};

export interface ConfigResponse {
  /**
   * Specifies wether donations are allowed.
   */
  allow_donations: boolean;
  /**
   * address of the DAO
   */
  dao_interface: DaoInterfaceFor_Addr;
  /**
   * How often the unbonding queue is to be executed, in seconds
   */
  epoch_period: number;
  /**
   * Information about applied fees
   */
  fee_config: FeeConfig;
  /**
   * Pending ownership transfer, awaiting acceptance by the new owner
   */
  new_owner?: string | null;
  /**
   * Account who can call harvest
   */
  operator: string;
  /**
   * Account who can call certain privileged functions
   */
  owner: string;
  /**
   * Stages that must be used by permissionless users
   */
  stages_preset: [StageType, AssetInfo, Decimal | null, Uint128 | null][][];
  /**
   * Address of the Stake token
   */
  stake_token: string;
  /**
   * The staking module's unbonding time, in seconds
   */
  unbond_period: number;
  /**
   * Underlying staked token
   */
  utoken: AssetInfo;
  /**
   * Update the vote_operator
   */
  vote_operator?: string | null;
  /**
   * withdrawals that must be used by permissionless users
   */
  withdrawals_preset: [WithdrawType, AssetInfo][];
  [k: string]: unknown;
}
export interface FeeConfig {
  /**
   * Contract address where fees are sent
   */
  protocol_fee_contract: Addr;
  /**
   * Fees that are being applied during reinvest of staking rewards
   */
  protocol_reward_fee: Decimal;
}
export interface MantaMsg {
  swap: MantaSwap;
}
export interface MantaSwap {
  min_return: Coin[];
  stages: [string, string][][];
}
export interface Coin {
  amount: Uint128;
  denom: string;
  [k: string]: unknown;
}
