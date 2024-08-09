const { execute_query } = require("../postgres/db.js");

/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---
      権限設定
      0: 無権限
      1: 閲覧のみ可能
      2: 設定集/辞書のみ 表示番号/公開情報編集可能
      3: 設定集/辞書のみ 登録/編集可能
      4: 全て 表示番号/公開情報編集可能
      5: 全て 登録/編集可能
    ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */

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
    return false;
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
