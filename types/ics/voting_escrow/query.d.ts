/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * This structure describes the query messages available in the contract.
 */
export type QueryMsg =
  | {
      check_voters_are_blacklisted: {
        voters: string[];
      };
    }
  | {
      blacklisted_voters: {
        limit?: number | null;
        start_after?: string | null;
      };
    }
  | {
      balance: {
        address: string;
      };
    }
  | {
      token_info: {};
    }
  | {
      marketing_info: {};
    }
  | {
      download_logo: {};
    }
  | {
      total_vamp: {};
    }
  | {
      total_vamp_at: {
        time: number;
      };
    }
  | {
      total_vamp_at_period: {
        period: number;
      };
    }
  | {
      user_vamp: {
        user: string;
      };
    }
  | {
      user_vamp_at: {
        time: number;
        user: string;
      };
    }
  | {
      user_vamp_at_period: {
        period: number;
        user: string;
      };
    }
  | {
      lock_info: {
        user: string;
      };
    }
  | {
      user_deposit_at_height: {
        height: number;
        user: string;
      };
    }
  | {
      config: {};
    };