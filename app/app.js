const express = require("express");
const port = process.env.PORT || 3000;
const app = express();

/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      メイン処理
    -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ルーティング
app.use("/general", require("./routes/generals/"));
app.use("/story", require("./routes/stories/"));
app.use("/tip", require("./routes/tips/"));
app.use("/dictionary", require("./routes/dictionaries/"));
app.use("/manage", require("./routes/manages/"));

// catch 404 and forward to error handler
app.use(function (req, res) {
  res.status(404).send("Not Found");
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message);
  console.log(err);
});

//サーバ起動
app.listen(port, () => {
  console.log("listen on port: " + port);
});
/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-  */
