const { Pool } = require("pg");
require("dotenv").config();
const { CONNECTION_STRING } = process.env;

const conn_db = new Pool({
  connectionString: CONNECTION_STRING,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000,
});

/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      クラス定義
    -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
class postgress {
  select_table = "";
  select_columns = [];
  left_joins = [];
  where_conditions = [];
  order_sorts = [];

  // select句設定関数
  set_select = (table, columns) => {
    if (typeof table != "string") {
      throw new TypeError("table is not string object.");
    }
    if (!Array.isArray(columns)) {
      throw new TypeError("columns are not Array object.");
    }
    if (
      columns.reduce((acc, column) => {
        return acc || typeof column != "string";
      }, false)
    ) {
      throw new TypeError("some column is not string object.");
    }

    this.select_table = table;
    this.select_columns = columns;
  };

  // left join句設定関数
  set_left = (joins) => {
    // TODO
  };

  // where句設定関数
  set_where = (conditions) => {
    if (!Array.isArray(conditions)) {
      throw new TypeError("conditions are not Array object.");
    }
    if (
      conditions.reduce((acc, condition) => {
        return acc || typeof condition != "string";
      }, false)
    ) {
      throw new TypeError("some condition is not string object.");
    }

    this.where_conditions = conditions;
  };

  // order句設定関数
  set_order = (sorts) => {
    if (!Array.isArray(sorts)) {
      throw new TypeError("sorts are not Array object.");
    }
    if (
      sorts.reduce((acc, sort) => {
        return acc || typeof sort != "string";
      }, false)
    ) {
      throw new TypeError("some sort is not string object.");
    }

    this.order_sorts = sorts;
  };

  // クエリ実行
  execute_query = () => {
    if (!this.select_table || !this.select_columns.length) {
      throw new Error(
        "some attribute is not defined." +
          "\n" +
          "select_table: " +
          this.select_table +
          "\n" +
          "select_columns: " +
          this.select_columns
      );
    }

    let text = "";

    // select句
    text +=
      " SELECT" +
      this.select_columns.reduce((acc, column, index) => {
        return (
          acc +
          " " +
          column +
          (index < this.select_columns.length - 1 ? "," : "")
        );
      }, "");
    text += " FROM" + " " + this.select_table;

    // left join句
    // if ()
    // TODO

    // where句
    if (this.where_conditions.length) {
      text +=
        " WHERE" +
        this.where_conditions.reduce((acc, condition, index) => {
          return (
            acc +
            " " +
            condition +
            (index < this.where_conditions.length - 1 ? " AND" : "")
          );
        }, "");
    }
  };
}
/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-  */

//

/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      関数定義
    -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
// クエリ実行
const execute_query = async (text, params) => {
  const client = await conn_db.connect();
  const result = await client.query(text, params);
  await console.log(result);
  await client.release();
  return result;
};

// トランザクション実行
const execute_transaction = async (queries) => {
  const client = await conn_db.connect();
  let result = [];

  // 型チェック
  if (!Array.isArray(queries)) {
    throw new TypeError("queries are not Array object.");
  }

  try {
    await client.query("begin");
    try {
      await queries.forEach(async (query) => {
        result.push(await client.query(query.text, query.params));
      });
      await client.query("commit");
    } catch (e) {
      await client.query("rollback");
      throw e;
    }
  } catch (e) {
    throw e;
  } finally {
    await client.release();
  }
  return result;
};
/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-  */

//

/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      エクスポート
    -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
module.exports = {
  // postgress,
  conn_db,
  execute_query,
  execute_transaction,
};
/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-  */
