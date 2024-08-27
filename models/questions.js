// 数据模型（规范数据格式）

const mongoose = require('../db/index.js')

// 定义schema（数据规范）
const QuestionSchema = mongoose.Schema({
	 prompt: {
    type: String,
    required: true,
    unique: false
  },
  wrongTokens:[String],
  correctTokens: [String],
  correctSolutions: [String],


  choices: [{ // 题目数组  
    image: String, // 题目内容  
    phrase: String, // 选项数组  
    hint: String, // 答案,
	text: String 
  }],  
  correctIndices:[Number],
 
    correctIndex: {
    type: Number,
    required: false
  },
  type: {
    type: String,
    required: true
  },
	sourceLanguage:String,
	targetLanguage: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
    timestamps: true        // 时间戳，自动添加文档的创建时间
})






 module.exports = mongoose.model('question',QuestionSchema);

