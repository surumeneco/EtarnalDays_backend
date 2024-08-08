/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      関数定義
    -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
// 日時
const format_date = (datetime) => {
  // yyyy-MM-dd hh:mm:ss
  return datetime.toLocaleString("sv-SE").replace("T", " ");
};

// 日付のみ
const format_date_only = (datetime) => {
  // yyyy-MM-dd
  return datetime.toLocaleString("sv-SE").split(" ")[0];
};
/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-  */

//

/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      エクスポート
    -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
module.exports = {
  format_date,
  format_date_only,
};
/*  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-  */
