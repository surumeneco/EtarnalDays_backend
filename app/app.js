const express = require("express");
const path = require("path");
const app = express();

/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      関数定義
    -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
// ルーティング関数
const routing = (path, url) => {
  const router = require("./routes/" + path);
  app.use(url, router);
};
/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-  */

//

/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      メイン処理
    -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ルーティング
routing("generals/", "general");
routing("stories/", "story");
routing("tips/", "tip");
routing("dictionaries/", "dictionary");
routing("manages/", "manage");

// ルーティングで該当先が無かったら、404画面を表示するミドルウェア。
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// エラーが発生したら、500画面を表示するミドルウェア。
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//サーバ起動
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("listen on port: " + port);
});
/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-  */
