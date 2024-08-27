// 数据模型（规范数据格式）

const mongoose = require("../db/index.js");

// 定义schema（数据规范）
const MultipleChoiceQuestions = mongoose.Schema(
  {
	 question: String,
        options: [String],
        correctIndex: Number,
        type: String,
        correctIndics: [Number],


   
    
  },
  {
    timestamps: true, // 时间戳，自动添加文档的创建时间
  }
);

module.exports = mongoose.model("multiChocieQuestion", MultipleChoiceQuestions);
