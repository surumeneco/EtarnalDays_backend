const express = require("express");
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
routing("/generals/", "general");
routing("/stories/", "story");
routing("/tips/", "tip");
routing("/dictionaries/", "dictionary");
routing("/manages/", "manage");

//サーバ起動
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("listen on port: " + port);
});
/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-  */
