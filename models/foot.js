// 数据模型（规范数据格式）

const mongoose = require("../db/index.js");
/* 

浏览的古诗
浏览的评论


*/
// 定义schema（数据规范）
const FootSchema = mongoose.Schema(
  {
	userId: String,
	poemId: String,
	commentId: String

	


   
    
  },
  {
    timestamps: true, // 时间戳，自动添加文档的创建时间
  }
);

module.exports = mongoose.model("foot", FootSchema);
