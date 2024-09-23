const mongoose = require('../db/index.js')

// 定义用户收藏模型  
const UserFavoriteSchema = mongoose.Schema({  
  userId: {  
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'user' // 引用 User 模型  
  },  
  poemId: {  
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'poems' // 引用 Poem 模型  
  },
   commentId: {  
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'comment' // 引用 Poem 模型  
  },
  type: String,
   createTime: { type: Date, default: Date.now }

  // 可以添加其他字段，如 timestamp  
},{
    timestamps: true        // 时间戳，自动添加文档的创建时间
}); 
module.exports = mongoose.model('userFavorite',UserFavoriteSchema);