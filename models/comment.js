
const mongoose = require('../db/index.js')
const commentSchema = new mongoose.Schema({
	content: String,
	user_id: String,
	author: String,
	replies:[
		{
			content: String,
			author: String,
			imgUrl: String,
			nickname: String,
			authorId: String,
			authoAvator: String



		}

	],
	like: Number
  

}, {
    timestamps: true, // 时间戳，自动添加文档的创建时间
  });


module.exports = mongoose.model('comment',commentSchema);