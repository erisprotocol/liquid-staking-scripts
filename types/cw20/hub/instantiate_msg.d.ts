/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type DelegationStrategyFor_String =
  | "uniform"
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
        [k: string]: unknown;
      };
    };
/**
 * A fixed-point decimal value with 18 fractional digits, i.e. Decimal(1_000_000_000_000_000_000) == 1.0
 *
 * The greatest possible value that can be represented is 340282366920938463463.374607431768211455 (which is (2^128 - 1) / 10^18)
 */
export type Decimal = string;

export interface InstantiateMsg {
  /**
   * Code ID of the CW20 token contract
   */
  cw20_code_id: number;
  /**
   * Number of decimals of the liquid staking token
   */
  decimals: number;
  /**
   * Strategy how delegations should be handled
   */
  delegation_strategy?: DelegationStrategyFor_String | null;
  /**
   * How often the unbonding queue is to be executed, in seconds
   */
  epoch_period: number;
  /**
   * Name of the liquid staking token
   */
  name: string;
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
   * Symbol of the liquid staking token
   */
  symbol: string;
  /**
   * The staking module's unbonding time, in seconds
   */
  unbond_period: number;
  /**
   * Denom of the underlaying staking token
   */
  utoken: string;
  /**
   * Initial set of validators who will receive the delegations
   */
  validators: string[];
  /**
   * Contract address that is allowed to vote
   */
  vote_operator?: string | null;
  [k: string]: unknown;
}