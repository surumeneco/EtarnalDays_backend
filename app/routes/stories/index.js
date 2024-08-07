const express = require("express");
const router = express.Router();

/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      メイン処理
    -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
router.use("/volume", require("./volume.js"));
router.use("/part", require("./part.js"));
router.use("/chapter", require("./chapter.js"));

module.exports = router;
/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-  */
