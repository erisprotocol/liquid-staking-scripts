/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type ExecuteMsg =
  | {
      bond: {
        donate?: boolean | null;
        receiver?: string | null;
        [k: string]: unknown;
      };
    }
  | {
      withdraw_unbonded: {
        receiver: string;
        [k: string]: unknown;
      };
    }
  | {
      queue_unbond: {
        receiver?: string | null;
        [k: string]: unknown;
      };
    }
  | {
      submit_batch: {
        [k: string]: unknown;
      };
    }
  | {
      vote: {
        proposal_id: number;
        votes: [Decimal, VoteOption][];
        [k: string]: unknown;
      };
    }
  | {
      operate: OperateMsg;
    }
  | {
      ownership: OwnershipMsg;
    }
  | {
      admin: AdminMsg;
    }
  | {
      retry: RetryMsg;
    }
  | {
      icq: IcqMsg;
    }
  | {
      callback: CallbackMsg;
    };
/**
 * A fixed-point decimal value with 18 fractional digits, i.e. Decimal(1_000_000_000_000_000_000) == 1.0
 *
 * The greatest possible value that can be represented is 340282366920938463463.374607431768211455 (which is (2^128 - 1) / 10^18)
 */
export type Decimal = string;
export type VoteOption = "unspecified" | "yes" | "abstain" | "no" | "no_with_veto";
export type OperateMsg =
  | {
      withdraw_rewards: {
        validators?: string[] | null;
      };
    }
  | {
      send_deposits_to_hub: {
        success: boolean;
      };
    }
  | {
      tune_delegations: {};
    }
  | {
      rebalance: {
        min_redelegation?: Uint128 | null;
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
export type OwnershipMsg =
  | {
      transfer_ownership: {
        new_owner: string;
      };
    }
  | {
      drop_ownership_proposal: {};
    }
  | {
      accept_ownership: {};
    };
export type AdminMsg =
  | {
      add_validator: {
        validator: string;
      };
    }
  | {
      remove_validator: {
        validator: string;
      };
    }
  | {
      create_accounts: {
        connection_id: string;
        controller_channel: string;
        host_channel: string;
        host_prefix: string;
        min_fee_withdrawal?: Uint128 | null;
        min_reward_restake?: Uint128 | null;
        version: string;
      };
    }
  | {
      update_config: {
        /**
         * Sets the stages preset Specifies wether donations are allowed.
         */
        allow_donation?: boolean | null;
        /**
         * Update the delegation_operator
         */
        delegation_operator?: string | null;
        /**
         * Contract address where fees are sent
         */
        fee_addr?: string | null;
        min_fee_withdrawal?: Uint128 | null;
        min_reward_restake?: Uint128 | null;
        /**
         * Sets a new operator
         */
        operator?: string | null;
        /**
         * Fees that are being applied during reinvest of staking rewards
         */
        reward_fee?: Decimal | null;
        /**
         * Strategy how delegations should be handled
         */
        strategy?: DelegationStrategyFor_String | null;
        /**
         * Update the vote_operator
         */
        voter?: string | null;
      };
    };
export type DelegationStrategyFor_String =
  | {
      defined: {
        shares_bps: [string, BasicPoints][];
      };
    }
  | {
      gauges: {
        /**
         * gauges based on vAmp voting
         */
        amp_gauges: string;
        /**
         * max amount of delegation needed
         */
        max_delegation_bps: BasicPoints;
        /**
         * min amount of delegation needed
         */
        min_delegation_bps: BasicPoints;
        /**
         * count of validators that should receive delegations
         */
        validator_count: number;
      };
    };
/**
 * BasicPoints struct implementation. BasicPoints value is within [0, 10000] interval. Technically BasicPoints is wrapper over [`u16`] with additional limit checks and several implementations of math functions so BasicPoints object can be used in formulas along with [`Uint128`] and [`Decimal`].
 */
export type BasicPoints = number;
export type RetryMsg =
  | {
      submit_batch: {};
    }
  | {
      withdraw_unbonded_for_user: {
        user: Addr;
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
export type IcqMsg =
  | {
      submit_delegations: {
        /**
         * this is always tuples of [delegation, validator]*n
         */
        proofs: VerifyMembershipMsg[];
        [k: string]: unknown;
      };
    }
  | {
      submit_balances: {
        /**
         * specifies which operations should execute, as bit-flag const SendFeeToCollector = 0b00000001; const SendRewardsToHub = 0b00000010; const StakeOnHost = 0b00000100; const SendToHost =   0b00001000; const TryReconcile = 0b00010000; const SubmitCurrentBatch = 0b00100000;
         */
        operations: number;
        /**
         * this is always balance proofs. Always provide all ICA address balances at once, and requires newer information
         */
        proofs: VerifyMembershipMsg[];
        [k: string]: unknown;
      };
    };
/**
 * Binary is a wrapper around Vec<u8> to add base64 de/serialization with serde. It also adds some helper methods to help encode inline.
 *
 * This is only needed as serde-json-{core,wasm} has a horrible encoding for Vec<u8>. See also <https://github.com/CosmWasm/cosmwasm/blob/main/docs/MESSAGE_TYPES.md>.
 */
export type Binary = string;
export type CallbackMsg =
  | {
      rewards_to_hub: {
        amount: Uint128;
      };
    }
  | {
      fees_to_collector: {
        amount: Uint128;
      };
    }
  | {
      stake_on_host: {};
    }
  | {
      send_to_host: {};
    };

export interface VerifyMembershipMsg {
  connection: string;
  path_key: Binary;
  path_prefix: string;
  proof: Binary;
  revision_height: number;
  revision_number: number;
  value: Binary;
}
