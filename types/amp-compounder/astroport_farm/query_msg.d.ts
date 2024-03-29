/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * This structure describes query messages available in the contract.
 */
export type QueryMsg =
  | {
      config: {
        [k: string]: unknown;
      };
    }
  | {
      user_info: {
        staker_addr: string;
        [k: string]: unknown;
      };
    }
  | {
      state: {
        staker_addr?: string | null;
        [k: string]: unknown;
      };
    };
