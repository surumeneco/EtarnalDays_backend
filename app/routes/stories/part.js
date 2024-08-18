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
      公開部情報取得
    ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */
router.get("/GetPublicInfo", async function (req, res, next) {
  // 権限チェック
  if (!(await check_auth(req, res, 0))) {
    return;
  }

  // パラメータ変換
  const req_params = parse_param(req, res);
  if (!req_params) {
    return;
  }
  /*  -----=-----=-----=-----=-----=-----
        {
          volume_title: string
        }
      -----=-----=-----=-----=-----=-----  */

  let part_query = "";
  let part_params = [];
  let chapter_query = "";

  part_query += " select";
  part_query += " volume_title,";
  part_query += " part_title,";
  part_query += " summary,";
  part_query += " update_date";
  part_query += " from t_story_part";
  part_query += " where";
  part_query += " volume_title = $1";
  part_query += " and";
  part_query += " status = 'public'";
  part_query += " and";
  part_query += " public_date <= $2";
  part_query += " order by display_no, part_title";
  part_params.push(req_params.volume_title);
  part_params.push(format_date(new Date()));

  chapter_query += " select";
  chapter_query += " public_date,";
  chapter_query += " part_title,";
  chapter_query += " chapter_title";
  chapter_query += " from t_story_chapter";
  chapter_query += " where";
  chapter_query += " volume_title = $1";
  chapter_query += " and";
  chapter_query += " part_title = $2";
  chapter_query += " and";
  chapter_query += " status = 'public'";
  chapter_query += " and";
  chapter_query += " public_date <= $3";
  chapter_query += " order by public_date";
  chapter_query += " limit 1";

  try {
    const part_result = await execute_query(part_query, part_params);
    const res_results = part_result.rows;

    const queries = res_results.reduce((acc, res_result) => {
      res_result.update_date = res_result.update_date
        ? format_date(res_result.update_date)
        : null;

      let chapter_params = [];
      chapter_params.push(req_params.volume_title);
      chapter_params.push(res_result.part_title);
      chapter_params.push(format_date(new Date()));
      acc.push({ text: chapter_query, params: chapter_params });
      return acc;
    }, []);

    const chpater_results = await execute_transaction(queries);
    chpater_results.forEach((chpater_result, index) => {
      res_results[index].latest_chapter = chpater_result.rowCount
        ? (() => {
            chpater_result.rows[0].public_date
              ? format_date(chpater_result.rows[0].public_date)
              : null;
            return chpater_result.rows[0];
          })()
        : null;
    });

    res.json({
      result_count: res_results.length,
      results: res_results,
    });
  } catch (e) {
    res.status(400);
    res.json({
      results: "request failed.",
    });
  }
});
/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */

/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---
      公開部詳細取得
    ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */
router.get("/GetPublicDetail", async function (req, res, next) {
  // 権限チェック
  if (!(await check_auth(req, res, 0))) {
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
          part_title: string,
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
  if (!req_params.part_title) {
    res.status(400);
    res.json({
      results: "part_title is required.",
    });
    return;
  }

  let query = "";
  let params = [];

  query += " select";
  query += " volume_title,";
  query += " part_title,";
  query += " summary,";
  query += " public_date,";
  query += " update_date";
  query += " from t_story_part";
  query += " where";
  query += " volume_title = $1";
  query += " and";
  query += " part_title = $2";
  query += " and";
  query += " status = 'public'";
  query += " and";
  query += " public_date <= $3";
  params.push(req_params.volume_title);
  params.push(req_params.part_title);
  params.push(format_date(new Date()));

  try {
    const result = await execute_query(query, params);
    if (result.rowCount) {
      result.rows.forEach((row) => {
        row.public_date = row.public_date ? format_date(row.public_date) : null;
        row.update_date = row.update_date ? format_date(row.update_date) : null;
      });
    }
    res.json({
      result_count: result.rowCount,
      results: result.rowCount ? result.rows[0] : null,
    });
  } catch (e) {
    res.status(400);
    res.json({
      results: "request failed.",
    });
  }
});
/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */

/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---
      部管理情報取得
    ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */
router.get("/GetManageInfo", async function (req, res, next) {
  // 権限チェック
  if (!(await check_auth(req, res, 1))) {
    return;
  }
});
/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */

/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---
      部管理詳細取得
    ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */
router.get("/GetManageDetail", async function (req, res, next) {
  // 権限チェック
  if (!(await check_auth(req, res, 1))) {
    return;
  }
});
/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */

/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---
      部表示番号反映
    ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */
router.post("/SetNo", async function (req, res, next) {
  // 権限チェック
  if (!(await check_auth(req, res, 3))) {
    return;
  }
});
/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */

/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---
      部登録
    ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */
router.post("/SetDetail", async function (req, res, next) {
  // 権限チェック
  if (!(await check_auth(req, res, 5))) {
    return;
  }
});
/*  ---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---  */

module.exports = router;
/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-  */
