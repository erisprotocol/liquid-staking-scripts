/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type ExecuteMsg =
  | {
      query: {
        callback: CallbackRequest;
        msgs: QueryRequestFor_Empty[];
        timeout_seconds: Uint64;
      };
    }
  | {
      execute: {
        callback?: CallbackRequest | null;
        msgs: CosmosMsgFor_Empty[];
        timeout_seconds: Uint64;
      };
    };
/**
 * Binary is a wrapper around Vec<u8> to add base64 de/serialization with serde. It also adds some helper methods to help encode inline.
 *
 * This is only needed as serde-json-{core,wasm} has a horrible encoding for Vec<u8>. See also <https://github.com/CosmWasm/cosmwasm/blob/main/docs/MESSAGE_TYPES.md>.
 */
export type Binary = string;
export type QueryRequestFor_Empty =
  | {
      bank: BankQuery;
    }
  | {
      custom: Empty;
    }
  | {
      staking: StakingQuery;
    }
  | {
      stargate: {
        /**
         * this is the expected protobuf message type (not any), binary encoded
         */
        data: Binary;
        /**
         * this is the fully qualified service path used for routing, eg. custom/cosmos_sdk.x.bank.v1.Query/QueryBalance
         */
        path: string;
        [k: string]: unknown;
      };
    }
  | {
      ibc: IbcQuery;
    }
  | {
      wasm: WasmQuery;
    };
export type BankQuery =
  | {
      balance: {
        address: string;
        denom: string;
        [k: string]: unknown;
      };
    }
  | {
      all_balances: {
        address: string;
        [k: string]: unknown;
      };
    };
export type StakingQuery =
  | {
      bonded_denom: {
        [k: string]: unknown;
      };
    }
  | {
      all_delegations: {
        delegator: string;
        [k: string]: unknown;
      };
    }
  | {
      delegation: {
        delegator: string;
        validator: string;
        [k: string]: unknown;
      };
    }
  | {
      all_validators: {
        [k: string]: unknown;
      };
    }
  | {
      validator: {
        /**
         * The validator's address (e.g. (e.g. cosmosvaloper1...))
         */
        address: string;
        [k: string]: unknown;
      };
    };
/**
 * These are queries to the various IBC modules to see the state of the contract's IBC connection. These will return errors if the contract is not "ibc enabled"
 */
export type IbcQuery =
  | {
      port_id: {
        [k: string]: unknown;
      };
    }
  | {
      list_channels: {
        port_id?: string | null;
        [k: string]: unknown;
      };
    }
  | {
      channel: {
        channel_id: string;
        port_id?: string | null;
        [k: string]: unknown;
      };
    };
export type WasmQuery =
  | {
      smart: {
        contract_addr: string;
        /**
         * msg is the json-encoded QueryMsg struct
         */
        msg: Binary;
        [k: string]: unknown;
      };
    }
  | {
      raw: {
        contract_addr: string;
        /**
         * Key is the raw key used in the contracts Storage
         */
        key: Binary;
        [k: string]: unknown;
      };
    }
  | {
      contract_info: {
        contract_addr: string;
        [k: string]: unknown;
      };
    };
/**
 * A thin wrapper around u64 that is using strings for JSON encoding/decoding, such that the full u64 range can be used for clients that convert JSON numbers to floats, like JavaScript and jq.
 *
 * # Examples
 *
 * Use `from` to create instances of this and `u64` to get the value out:
 *
 * ``` # use cosmwasm_std::Uint64; let a = Uint64::from(42u64); assert_eq!(a.u64(), 42);
 *
 * let b = Uint64::from(70u32); assert_eq!(b.u64(), 70); ```
 */
export type Uint64 = string;
export type CosmosMsgFor_Empty =
  | {
      bank: BankMsg;
    }
  | {
      custom: Empty;
    }
  | {
      staking: StakingMsg;
    }
  | {
      distribution: DistributionMsg;
    }
  | {
      stargate: {
        type_url: string;
        value: Binary;
        [k: string]: unknown;
      };
    }
  | {
      ibc: IbcMsg;
    }
  | {
      wasm: WasmMsg;
    }
  | {
      gov: GovMsg;
    };
/**
 * The message types of the bank module.
 *
 * See https://github.com/cosmos/cosmos-sdk/blob/v0.40.0/proto/cosmos/bank/v1beta1/tx.proto
 */
export type BankMsg =
  | {
      send: {
        amount: Coin[];
        to_address: string;
        [k: string]: unknown;
      };
    }
  | {
      burn: {
        amount: Coin[];
        [k: string]: unknown;
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
 * The message types of the staking module.
 *
 * See https://github.com/cosmos/cosmos-sdk/blob/v0.40.0/proto/cosmos/staking/v1beta1/tx.proto
 */
export type StakingMsg =
  | {
      delegate: {
        amount: Coin;
        validator: string;
        [k: string]: unknown;
      };
    }
  | {
      undelegate: {
        amount: Coin;
        validator: string;
        [k: string]: unknown;
      };
    }
  | {
      redelegate: {
        amount: Coin;
        dst_validator: string;
        src_validator: string;
        [k: string]: unknown;
      };
    };
/**
 * The message types of the distribution module.
 *
 * See https://github.com/cosmos/cosmos-sdk/blob/v0.42.4/proto/cosmos/distribution/v1beta1/tx.proto
 */
export type DistributionMsg =
  | {
      set_withdraw_address: {
        /**
         * The `withdraw_address`
         */
        address: string;
        [k: string]: unknown;
      };
    }
  | {
      withdraw_delegator_reward: {
        /**
         * The `validator_address`
         */
        validator: string;
        [k: string]: unknown;
      };
    };
/**
 * These are messages in the IBC lifecycle. Only usable by IBC-enabled contracts (contracts that directly speak the IBC protocol via 6 entry points)
 */
export type IbcMsg =
  | {
      transfer: {
        /**
         * packet data only supports one coin https://github.com/cosmos/cosmos-sdk/blob/v0.40.0/proto/ibc/applications/transfer/v1/transfer.proto#L11-L20
         */
        amount: Coin;
        /**
         * exisiting channel to send the tokens over
         */
        channel_id: string;
        /**
         * when packet times out, measured on remote chain
         */
        timeout: IbcTimeout;
        /**
         * address on the remote chain to receive these tokens
         */
        to_address: string;
        [k: string]: unknown;
      };
    }
  | {
      send_packet: {
        channel_id: string;
        data: Binary;
        /**
         * when packet times out, measured on remote chain
         */
        timeout: IbcTimeout;
        [k: string]: unknown;
      };
    }
  | {
      close_channel: {
        channel_id: string;
        [k: string]: unknown;
      };
    };
/**
 * A point in time in nanosecond precision.
 *
 * This type can represent times from 1970-01-01T00:00:00Z to 2554-07-21T23:34:33Z.
 *
 * ## Examples
 *
 * ``` # use cosmwasm_std::Timestamp; let ts = Timestamp::from_nanos(1_000_000_202); assert_eq!(ts.nanos(), 1_000_000_202); assert_eq!(ts.seconds(), 1); assert_eq!(ts.subsec_nanos(), 202);
 *
 * let ts = ts.plus_seconds(2); assert_eq!(ts.nanos(), 3_000_000_202); assert_eq!(ts.seconds(), 3); assert_eq!(ts.subsec_nanos(), 202); ```
 */
export type Timestamp = Uint64;
/**
 * The message types of the wasm module.
 *
 * See https://github.com/CosmWasm/wasmd/blob/v0.14.0/x/wasm/internal/types/tx.proto
 */
export type WasmMsg =
  | {
      execute: {
        contract_addr: string;
        funds: Coin[];
        /**
         * msg is the json-encoded ExecuteMsg struct (as raw Binary)
         */
        msg: Binary;
        [k: string]: unknown;
      };
    }
  | {
      instantiate: {
        admin?: string | null;
        code_id: number;
        funds: Coin[];
        /**
         * A human-readbale label for the contract
         */
        label: string;
        /**
         * msg is the JSON-encoded InstantiateMsg struct (as raw Binary)
         */
        msg: Binary;
        [k: string]: unknown;
      };
    }
  | {
      migrate: {
        contract_addr: string;
        /**
         * msg is the json-encoded MigrateMsg struct that will be passed to the new code
         */
        msg: Binary;
        /**
         * the code_id of the new logic to place in the given contract
         */
        new_code_id: number;
        [k: string]: unknown;
      };
    }
  | {
      update_admin: {
        admin: string;
        contract_addr: string;
        [k: string]: unknown;
      };
    }
  | {
      clear_admin: {
        contract_addr: string;
        [k: string]: unknown;
      };
    };
/**
 * This message type allows the contract interact with the [x/gov] module in order to cast votes.
 *
 * [x/gov]: https://github.com/cosmos/cosmos-sdk/tree/v0.45.12/x/gov
 *
 * ## Examples
 *
 * Cast a simple vote:
 *
 * ``` # use cosmwasm_std::{ #     HexBinary, #     Storage, Api, Querier, DepsMut, Deps, entry_point, Env, StdError, MessageInfo, #     Response, QueryResponse, # }; # type ExecuteMsg = (); use cosmwasm_std::{GovMsg, VoteOption};
 *
 * #[entry_point] pub fn execute( deps: DepsMut, env: Env, info: MessageInfo, msg: ExecuteMsg, ) -> Result<Response, StdError> { // ... Ok(Response::new().add_message(GovMsg::Vote { proposal_id: 4, vote: VoteOption::Yes, })) } ```
 *
 * Cast a weighted vote:
 *
 * ``` # use cosmwasm_std::{ #     HexBinary, #     Storage, Api, Querier, DepsMut, Deps, entry_point, Env, StdError, MessageInfo, #     Response, QueryResponse, # }; # type ExecuteMsg = (); # #[cfg(feature = "cosmwasm_1_2")] use cosmwasm_std::{Decimal, GovMsg, VoteOption, WeightedVoteOption};
 *
 * # #[cfg(feature = "cosmwasm_1_2")] #[entry_point] pub fn execute( deps: DepsMut, env: Env, info: MessageInfo, msg: ExecuteMsg, ) -> Result<Response, StdError> { // ... Ok(Response::new().add_message(GovMsg::VoteWeighted { proposal_id: 4, options: vec![ WeightedVoteOption { option: VoteOption::Yes, weight: Decimal::percent(65), }, WeightedVoteOption { option: VoteOption::Abstain, weight: Decimal::percent(35), }, ], })) } ```
 */
export type GovMsg = {
  vote: {
    proposal_id: number;
    /**
     * The vote option.
     *
     * This should be called "option" for consistency with Cosmos SDK. Sorry for that. See <https://github.com/CosmWasm/cosmwasm/issues/1571>.
     */
    vote: VoteOption;
    [k: string]: unknown;
  };
};
export type VoteOption = "yes" | "no" | "abstain" | "no_with_veto";

/**
 * A request for a callback.
 */
export interface CallbackRequest {
  msg: Binary;
  receiver: string;
}
/**
 * An empty struct that serves as a placeholder in different places, such as contracts that don't set a custom message.
 *
 * It is designed to be expressable in correct JSON and JSON Schema but contains no meaningful data. Previously we used enums without cases, but those cannot represented as valid JSON Schema (https://github.com/CosmWasm/cosmwasm/issues/451)
 */
export interface Empty {
  [k: string]: unknown;
}
export interface Coin {
  amount: Uint128;
  denom: string;
  [k: string]: unknown;
}
/**
 * In IBC each package must set at least one type of timeout: the timestamp or the block height. Using this rather complex enum instead of two timeout fields we ensure that at least one timeout is set.
 */
export interface IbcTimeout {
  block?: IbcTimeoutBlock | null;
  timestamp?: Timestamp | null;
  [k: string]: unknown;
}
/**
 * IBCTimeoutHeight Height is a monotonically increasing data type that can be compared against another Height for the purposes of updating and freezing clients. Ordering is (revision_number, timeout_height)
 */
export interface IbcTimeoutBlock {
  /**
   * block height after which the packet times out. the height within the given revision
   */
  height: number;
  /**
   * the version that the client is currently on (eg. after reseting the chain this could increment 1 as height drops to 0)
   */
  revision: number;
  [k: string]: unknown;
}
