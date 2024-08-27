const mongoose = require('../db/index.js')

const postPoemSchema = new mongoose.Schema({
  userId: {  
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'user' // 引用 User 模型  
  },  
  poemId: {  
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'poems' // 引用 Poem 模型  
  },
  commentId:{
     type: mongoose.Schema.Types.ObjectId,  
    ref: 'comment' // 引用 Poem 模型  

  }
});
module.exports = mongoose.model('postPoem',postPoemSchema);