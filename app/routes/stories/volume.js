const express = require("express");
const router = express.Router();
const { execute_query } = require("../../../frames/postgres/db.js");
const { format_date } = require("../../../frames/datetime/datetime.js");
const { check_auth } = require("../../../frames/core/authorization.js");

/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      メイン処理
    -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---
      公開編情報取得
    ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */
router.get("/GetPublicInfo", function (req, res, next) {
  res.json({
    message: "GetPublicInfo",
  });
});
/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */

/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---
      公開編詳細取得
    ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */
router.get("/GetPublicDetail", function (req, res, next) {
  res.json({
    message: "GetPublicDetail",
  });
});
/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */

/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---
      編管理情報取得
    ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */
router.get("/GetManageInfo", function (req, res, next) {
  res.json({
    message: "GetManageInfo",
  });
});
/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */

/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---
      編管理詳細取得
    ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */
router.get("/GetManageDetail", function (req, res, next) {
  res.json({
    message: "GetManageDetail",
  });
});
/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */

/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---
      編表示番号反映
    ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */
router.post("/SetNo", function (req, res, next) {
  res.json({
    message: "SetNo",
  });
});
/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */

/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---
      編登録
    ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */
router.post("/SetDetail", async function (req, res, next) {
  // 権限チェック
  if (!check_auth(req, res, 5)) {
    return;
  }

  let query = "";
  let params = [];

  // 必須チェック
  if (!req.query.volume_title) {
    res.status(400);
    res.json({
      results: "volume_title is required.",
    });
    return;
  }
  if (!req.query.display_no) {
    res.status(400);
    res.json({
      results: "display_no is required.",
    });
    return;
  }
  if (!req.query.status) {
    res.status(400);
    res.json({
      results: "status is required.",
    });
    return;
  }

  // 存在チェック
  query += " select";
  query += " volume_title as title";
  query += " from t_story_volume";
  query += " where";
  query += " volume_title = $1";
  params.push(req.query.volume_title);
  const exist_check = await execute_query(query, params);
  query = "";
  params = [];

  if (exist_check.rowCount) {
    // 既に存在してる時
    query += " update t_story_volume";
    query += " set";
    query += " outline = $1,";
    query += " display_no = $2,";
    query += " status = $3,";
    if (req.query.public_date) {
      query += " public_date = $4,";
      query += " update_date = $5";
      query += " where volume_title = $6";
    } else {
      query += " update_date = $4";
      query += " where volume_title = $5";
    }
    query += ";";
    params.push(req.query.outline);
    params.push(req.query.display_no);
    params.push(req.query.status);
    if (req.query.public_date) {
      params.push(req.query.public_date);
    }
    params.push(format_date(new Date()));
    params.push(req.query.volume_title);
  } else {
    // 新規の時
    query += " insert into t_story_volume";
    query += " (";
    query += " volume_title,";
    query += " outline,";
    query += " display_no,";
    query += " status,";
    if (req.query.public_date) {
      query += " public_date,";
    }
    query += " update_date,";
    query += " create_date";
    query += " )";
    query += " values";
    query += " (";
    query += " $1,";
    query += " $2,";
    query += " $3,";
    query += " $4,";
    if (req.query.public_date) {
      query += " $5,";
      query += " $6,";
      query += " $7";
    } else {
      query += " $5,";
      query += " $6";
    }
    query += " )";
    query += ";";
    params.push(req.query.volume_title);
    params.push(req.query.outline ? req.query.outline : "");
    params.push(req.query.display_no);
    params.push(req.query.status);
    if (req.query.public_date) {
      params.push(req.query.public_date);
    }
    params.push(format_date(new Date()));
    params.push(format_date(new Date()));
  }

  try {
    const result = await execute_query(query, params);
    res.json({
      result_count: result.rowCount,
      results: result.rows,
    });
  } catch (e) {
    if (exist_check.rowCount) {
      res.status(409);
    } else {
      res.status(400);
    }
    console.log(e);
    res.json({
      results: e,
    });
  }
});
/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */

module.exports = router;
/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-  */
