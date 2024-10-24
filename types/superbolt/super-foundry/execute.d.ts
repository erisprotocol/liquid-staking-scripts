/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type ExecuteMsg =
  | {
      update_config: {
        astroport_factory?: string | null;
        candy_code_id?: number | null;
        candy_protocol_fee?: Decimal | null;
        collection_code_id?: number | null;
        collector_code_id?: number | null;
        minter_code_id?: number | null;
        particle_code_id?: number | null;
        pool_tax?: Decimal | null;
      };
    }
  | {
      collection: FeatureWrapperFor_CollectionFeature;
    }
  | {
      royalty: CollectionFeatureWrapperFor_RoyaltyFeature;
    }
  | {
      candy: NamedFeatureWrapperFor_CandyFeature;
    }
  | {
      particle: NamedFeatureWrapperFor_ParticleFeature;
    }
  | {
      pool: PoolFeatureWrapperFor_PoolFeature;
    }
  | {
      dao_dao: CollectionFeatureWrapperFor_DaoDaoFeature;
    };
/**
 * A fixed-point decimal value with 18 fractional digits, i.e. Decimal(1_000_000_000_000_000_000) == 1.0
 *
 * The greatest possible value that can be represented is 340282366920938463463.374607431768211455 (which is (2^128 - 1) / 10^18)
 */
export type Decimal = string;
export type CollectionFeature =
  | {
      init: {
        collection_owner?: string | null;
        draft_id: string;
        name: string;
        symbol: string;
      };
    }
  | {
      import: {
        collection: string;
        collection_owner?: string | null;
        draft_id: string;
        name: string;
      };
    }
  | {
      update: {
        collection: string;
        collection_owner?: string | null;
        name?: string | null;
      };
    }
  | {
      mint: {
        collection: string;
        recipient: string;
        token_ids: string[];
      };
    };
export type RoyaltyFeature =
  | {
      init: {
        royalty: Decimal;
        royalty_cw20: string[];
        royalty_distribution_asset: AssetInfoBaseFor_String;
        royalty_targets: TargetFor_String[];
      };
    }
  | {
      update: {
        royalty?: Decimal | null;
        royalty_cw20?: string[] | null;
        royalty_distribution_asset?: AssetInfoBaseFor_String | null;
        royalty_targets?: TargetFor_String[] | null;
      };
    }
  | {
      migrate: {};
    };
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
export type CandyFeature =
  | {
      add: {
        candy_type: CandyType;
        mint_recipient: string;
        phases: Phase[];
      };
    }
  | {
      close: {};
    }
  | {
      migrate: {};
    };
export type CandyType =
  | {
      pre_mint: {};
    }
  | {
      mint: {};
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
export type ParticleFeature =
  | {
      add: {
        charge_royalty_on_withdraw: boolean;
        particle_function: ParticleFunction;
      };
    }
  | {
      update: {
        charge_royalty_on_withdraw?: boolean | null;
      };
    }
  | {
      migrate: {};
    };
export type ParticleFunction =
  | {
      uniform: {
        particles_per_nft: Uint128;
      };
    }
  | {
      xyk: {
        first_particles: Uint128;
        total_particles: Uint128;
      };
    }
  | {
      mapping: {};
    };
export type PoolFeature =
  | {
      add: {};
    }
  | {
      callback_create_pool: {};
    }
  | {
      callback_setup_pool_collector: {};
    }
  | {
      update: {};
    }
  | {
      migrate: {};
    };
export type DaoDaoFeature = {
  init: {};
};

export interface FeatureWrapperFor_CollectionFeature {
  action: CollectionFeature;
}
export interface CollectionFeatureWrapperFor_RoyaltyFeature {
  action: RoyaltyFeature;
  collection: string;
}
export interface TargetFor_String {
  addr: string;
  asset_override?: AssetInfoBaseFor_String | null;
  msg?: Binary | null;
  target_type: TargetType;
  weight: number;
}
export interface NamedFeatureWrapperFor_CandyFeature {
  action: CandyFeature;
  collection: string;
  name: string;
}
export interface Phase {
  end_time_s: number;
  mint_fee: AssetBaseFor_Addr;
  mint_limit: number;
  start_time_s: number;
  use_whitelist: boolean;
}
/**
 * Represents a fungible asset with a known amount
 *
 * Each asset instance contains two values: `info`, which specifies the asset's type (CW20 or native), and its `amount`, which specifies the asset's amount.
 */
export interface AssetBaseFor_Addr {
  /**
   * Specifies the asset's amount
   */
  amount: Uint128;
  /**
   * Specifies the asset's type (CW20 or native)
   */
  info: AssetInfoBaseFor_Addr;
}
export interface NamedFeatureWrapperFor_ParticleFeature {
  action: ParticleFeature;
  collection: string;
  name: string;
}
export interface PoolFeatureWrapperFor_PoolFeature {
  action: PoolFeature;
  collection: string;
  particle_name: string;
  trade_asset_info: AssetInfoBaseFor_String;
}
export interface CollectionFeatureWrapperFor_DaoDaoFeature {
  action: DaoDaoFeature;
  collection: string;
}
