/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type QueryMsg =
  | {
      config: {};
    }
  | {
      next_claim_period: {
        user: string;
      };
    }
  | {
      bribes: {
        period?: Time | null;
      };
    }
  | {
      user_claimable: {
        periods?: number[] | null;
        user: string;
      };
    };
export type Time =
  | ("current" | "next" | "last")
  | {
      time: number;
    }
  | {
      period: number;
    };