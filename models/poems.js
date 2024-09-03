// 数据模型（规范数据格式）

const mongoose = require("../db/index.js");
// const MultipleChoiceQuestions =require( "./multiChoiceQuestion.js")


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

// 定义schema（数据规范）
const PoemsSchema = mongoose.Schema(
  {
    group: String,
    subGroup: String,
    title: String,
    content: String,
    poem: String,
    notes: [String],
    lines: [
      {
        // 题目数组
        pinyin: String,
        text: String,
      },
    ],
    judgementQuestions: [String],
    judgementAnsList: [Boolean],
    audioUrl: String,

    multipleChoiceQuestions: [
        MultipleChoiceQuestions
     /*  {
        // 题目数组
        question: String,
        options: [String],
        correctIndex: Number,
        type: String,
        correctIndics: [Number],
      } */
    ]
  },
  {
    timestamps: true, // 时间戳，自动添加文档的创建时间
  }
);

module.exports = mongoose.model("poems", PoemsSchema);
