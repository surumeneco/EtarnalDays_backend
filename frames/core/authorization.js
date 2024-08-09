const { execute_query } = require("../../../frames/postgres/db.js");

/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---
      権限チェック
    ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */
const check_auth = async (req, res, level) => {
  let query = "";
  let params = [];

  // 型チェック
  if (typeof level != "number") {
    throw new TypeError("level is not number object.");
  }

  // 必須チェック
  if (!req.query.user_id) {
    res.status(401);
    res.json({
      results: "required login",
    });
    return;
  }

  query += " select";
  query += " display_name";
  query += " from m_user";
  query += " where";
  query += " user_id = $1";
  query += " and";
  query += " authorization_level::integer >= $2";
  params.push(req.query.user_id);
  params.push(level);
  const result = await execute_query(query, params);

  if (!result.rowCount) {
    res.status(401);
    res.json({
      results: "lack of authority",
    });
    return false;
  }

  return true;
};
/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */

//

/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      エクスポート
    -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
module.exports = {
  check_auth,
};
/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-  */
