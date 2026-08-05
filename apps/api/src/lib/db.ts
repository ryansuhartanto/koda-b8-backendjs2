import { Pool, types } from "pg";

// pg hands BIGINT back as a string to protect precision it cannot represent;
// every id here sits well inside 2^53
types.setTypeParser(types.builtins.INT8, Number);

// pg reads PG* from the environment
export const pool: Pool = new Pool();
