// 引入express模块
const express = require("express");
const axios = require("axios");
// 定义路由级中间件
const router = express.Router();
const userFavorite = require("../models/userFavorite");
const Comment = require("../models/comment");
const post = require("../models/postPoem")
router.get("/addComment", async (req, res) => {
  console.log(req.body, "collectPoem");
  let {content = '测试一下',id=''} = req.query

	let userId = req.user_id;
  //古诗id
//   let userId = "66c6d551c84f06f8a3676535";
  let poemId = "66c6e41ee4efc4e9371af2c4";
  if(id){
	//添加二级评论
	let findContent = await Comment.findById(id);
	if(findContent){
		 const newReply = {
        content: content,
        author: "小新",
        imgUrl: userId
      };
	  findContent.replies.push(newReply)
	   await findContent.save();
		res.send({ status: 200, message: "评论已更新", data: '' });
	}else {
		// Promise.reject(new Error("评论不存在"));
		res.send({ status: 200, message: "评论不存在", data: '' });
	}
	
  }else {
	  let data = await Comment.create({ content,
  author: userId,
  replies: [] });
  console.log(data, "dddd");
  res.send({ status: 200, message: "", data: '评论已更新' });

  }


});



//是否需要分页查询
router.get("/getComments", async (req, res) => {
  console.log(req.body, "collectPoem");

  let data = await Comment.find()
  .sort({ _id: -1 })
  .limit(10)
console.log(data,'dddd')
  
  res.send({ status: 200, message: "", data: data });
});

// 点赞
/* 
点赞过的评论

*/
router.get("/setLike",async(req,res)=> {
	let { like,id } = req.query;
	let userId = req.user_id
	console.log(like,id)
	try {
			// let user_id = req.user_id;
	let findComment = await Comment.findById(id);
	if(!findComment.like){
		findComment.like=0;
	}
	findComment.like = like ? findComment.like+1 : findComment.like-1;
	console.log(findComment)
  	await findComment.save();
	//将点赞的评论添加到足迹里
	if(like){

			  //检查用户是否收藏过该古诗
  let hasData = await post.find({
	$and:[{ userId },{commentId: id}]});
	if(hasData){
		await post.deleteOne({_id: hasData._id})
		//删除
	}

	//将点赞的评论添加到足迹中
  	let addPost = await post.create({ userId, commentId: id });

	}
	res.send({
		status: 200,
		msg:'success'
	})

	}catch(err){
		console.log(err)
		res.send({
		status: 500,
		msg:'操作失败'
	})

	}




})

router.get("/collectComment", async (req, res) => {
  console.log(req.body, "collectPoem");

  let userId= req.user_id;
  let { id } = req.query; 
  console.log(id)
  try{
	  //检查用户是否收藏过该古诗
  let hasData = await userFavorite.find({
	$and:[{ userId,  },{commentId: id}]});
	if(hasData.length){
		console.log(hasData,'2222')
		res.send({ status: 200, message: "评论已收藏", data: "" });
		return 
	}

  let data = await userFavorite.create({ userId, commentId: id, type:'comment' });
  console.log(data, "dddd");
  res.send({ status: 200, message: "收藏成功", data: "" });

  }catch(err){
	console.log(err);
	res.send({ status: 500, message: "收藏失败", data: "" });
  }

});


module.exports = router;