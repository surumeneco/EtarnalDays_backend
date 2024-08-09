const express = require("express");
const router = express.Router();
const {
  execute_query,
  execute_transaction,
} = require("../../../frames/postgres/db.js");
const { format_date } = require("../../../frames/datetime/datetime.js");
const { check_auth } = require("../../../frames/core/authorization.js");
const { parse_param } = require("../../../frames/core/parse_param.js");

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
router.post("/SetNo", async function (req, res, next) {
  // 権限チェック
  if (!(await check_auth(req, res, 3))) {
    return;
  }

  // パラメータ変換
  const req_params = parse_param(req, res);
  if (!req_params) {
    return;
  }
  /*  -----=-----=-----=-----=-----=-----
        {
          volumes: [
            {
              volume_title,
              display_no
            }
          ]
        }
      -----=-----=-----=-----=-----=-----  */

  // 必須チェック
  if (!req_params.volumes) {
    res.status(400);
    res.json({
      results: "volumes is required.",
    });
    return;
  }

  // 型チェック
  if (!Array.isArray(req_params.volumes)) {
    res.status(400);
    res.json({
      results: "volumes are not Array object.",
    });
    return;
  }

  let queries = [];
  req_params.volumes.forEach((volume) => {
    let text = "";
    let params = [];
    text += " update t_story_volume";
    text += " set";
    text += " display_no = $1";
    text += " where volume_title = $2";
    params.push(volume.display_no);
    params.push(volume.volume_title);
    queries.push({ text, params });
  });

  try {
    const results = await execute_transaction(queries);
    res.json({
      result_count: results.reduce((acc, result) => {
        return acc + result.rowCount;
      }, 0),
      results: results.reduce((acc, result) => {
        result.rows.forEach((row) => {
          acc.push(row);
        });
        return acc;
      }, []),
    });
  } catch (e) {
    console.log(e);
    res.status(400);
    res.json({
      results: "request failed.",
    });
  }
});
/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */

/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---
      編登録
    ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */
router.post("/SetDetail", async function (req, res, next) {
  // 権限チェック
  if (!(await check_auth(req, res, 5))) {
    return;
  }

  // パラメータ変換
  const req_params = parse_param(req, res);
  if (!req_params) {
    return;
  }
  /*  -----=-----=-----=-----=-----=-----
        {
          volume_title: string,
          outline: string,
          display_no: number string,
          status: string,
          public_date: date string
        }
      -----=-----=-----=-----=-----=-----  */

  // 必須チェック
  if (!req_params.volume_title) {
    res.status(400);
    res.json({
      results: "volume_title is required.",
    });
    return;
  }
  if (!req_params.display_no) {
    res.status(400);
    res.json({
      results: "display_no is required.",
    });
    return;
  }
  if (!req_params.status) {
    res.status(400);
    res.json({
      results: "status is required.",
    });
    return;
  }

  let query = "";
  let params = [];

  // 存在チェック
  query += " select";
  query += " volume_title as title";
  query += " from t_story_volume";
  query += " where";
  query += " volume_title = $1";
  params.push(req_params.volume_title);
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
    if (req_params.public_date) {
      query += " public_date = $4,";
      query += " update_date = $5";
      query += " where volume_title = $6";
    } else {
      query += " update_date = $4";
      query += " where volume_title = $5";
    }
    params.push(req_params.outline ? req_params.outline : "");
    params.push(req_params.display_no);
    params.push(req_params.status);
    if (req_params.public_date) {
      params.push(req_params.public_date);
    }
    params.push(format_date(new Date()));
    params.push(req_params.volume_title);
  } else {
    // 新規の時
    query += " insert into t_story_volume";
    query += " (";
    query += " volume_title,";
    query += " outline,";
    query += " display_no,";
    query += " status,";
    if (req_params.public_date) {
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
    if (req_params.public_date) {
      query += " $5,";
      query += " $6,";
      query += " $7";
    } else {
      query += " $5,";
      query += " $6";
    }
    query += " )";
    params.push(req_params.volume_title);
    params.push(req_params.outline ? req_params.outline : "");
    params.push(req_params.display_no);
    params.push(req_params.status);
    if (req_params.public_date) {
      params.push(req_params.public_date);
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
    res.status(400);
    res.json({
      results: "request failed.",
    });
  }
});
/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */

module.exports = router;
/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-  */
