/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type QueryMsg =
  | {
      ownership: {};
    }
  | {
      config: {};
    }
  | {
      state: {};
    }
  | {
      launch: {
        id: number;
      };
    }
  | {
      launch_deposit: {
        id: number;
        user?: string | null;
      };
    }
  | {
      launches: {
        direction?: Direction | null;
        limit?: number | null;
        start_after?: number | null;
      };
    }
  | {
      user_deposits: {
        limit?: number | null;
        start_after?: number | null;
        user: string;
      };
    }
  | {
      user_vestings: {
        limit?: number | null;
        start_after?: number | null;
        user: string;
      };
    };
export type Direction = "asc" | "desc";