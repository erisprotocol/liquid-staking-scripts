/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type DelegationStrategyFor_String =
  | "uniform"
  | {
      defined: {
        shares_bps: [string, number][];
      };
    }
  | {
      gauges: {
        /**
         * weight between amp and emp gauges between 0 and 1
         */
        amp_factor_bps: number;
        /**
         * gauges based on vAmp voting
         */
        amp_gauges: string;
        /**
         * gauges based on eris merit points
         */
        emp_gauges?: string | null;
        /**
         * max amount of delegation needed
         */
        max_delegation_bps: number;
        /**
         * min amount of delegation needed
         */
        min_delegation_bps: number;
        /**
         * count of validators that should receive delegations
         */
        validator_count: number;
      };
    };
/**
 * A fixed-point decimal value with 18 fractional digits, i.e. Decimal(1_000_000_000_000_000_000) == 1.0
 *
 * The greatest possible value that can be represented is 340282366920938463463.374607431768211455 (which is (2^128 - 1) / 10^18)
 */
export type Decimal = string;
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
export type Denom = string;

export interface InstantiateMsg {
  /**
   * Strategy how delegations should be handled
   */
  delegation_strategy?: DelegationStrategyFor_String | null;
  /**
   * Name of the liquid staking token
   */
  denom: string;
  /**
   * How often the unbonding queue is to be executed, in seconds
   */
  epoch_period: number;
  /**
   * fin multi contract addr
   */
  fin_multi_contract: string;
  /**
   * Account who can call harvest
   */
  operator: string;
  /**
   * Account who can call certain privileged functions
   */
  owner: string;
  /**
   * Contract address where fees are sent
   */
  protocol_fee_contract: string;
  /**
   * Fees that are being applied during reinvest of staking rewards
   */
  protocol_reward_fee: Decimal;
  /**
   * Stages that should be used in the permissionless harvest function
   */
  stages_preset?: [Addr, Denom][][] | null;
  /**
   * The staking module's unbonding time, in seconds
   */
  unbond_period: number;
  /**
   * Initial set of validators who will receive the delegations
   */
  validators: string[];
  /**
   * Contract address that is allowed to vote
   */
  vote_operator?: string | null;
}