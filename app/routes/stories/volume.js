var express = require("express");
var router = express.Router();

/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      メイン処理
    -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
// 公開編情報取得
router.get("/GetPublicInfo", function (req, res, next) {
  res.json({
    message: "GetPublicInfo",
  });
});

// 公開編詳細取得
router.get("/GetPublicDetail", function (req, res, next) {
  res.json({
    message: "GetPublicDetail",
  });
});

// 編管理情報取得
router.get("/GetManageInfo", function (req, res, next) {
  res.json({
    message: "GetManageInfo",
  });
});

// 編管理詳細取得
router.get("/GetManageDetail", function (req, res, next) {
  res.json({
    message: "GetManageDetail",
  });
});

// 編表示番号反映
router.post("/SetNo", function (req, res, next) {
  res.json({
    message: "SetNo",
  });
});

// 編登録
router.post("/SetDetail", function (req, res, next) {
  res.json({
    message: "SetDetail",
  });
});

module.exports = router;
/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-  */
