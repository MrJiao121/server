// 引入express模块
const express = require("express");
const axios = require("axios");
// 定义路由级中间件
const router = express.Router();
// 引入数据模型模块
const Poems = require("../models/poems");
const userFavorite = require("../models/userFavorite");
const post = require("../models/postPoem")
const poems = require("../models/poems");
console.log(Poems, "poems");

const parsePoemsList = (data = []) => {
  let list = data.map((v) => ({ id: v._id, title: v.poemId?.title }));
  return list;
};
router.get('/addPost',async(req,res)=>{
	console.log(req.query,'query');
	
  let { userId,poemId } = req.query; 
  try{
	  //检查用户是否收藏过该古诗
  let hasData = await post.find({
	$and:[{ userId },{poemId}]});
	if(hasData){
		await post.deleteOne({_id: hasData._id})
		//删除
	}

  let data = await post.create({ userId, poemId });
  console.log(data, "dddd");
  res.send({ status: 200, message: "足迹添加成功", data: "" });

  }catch(err){
	console.log(err);
	res.send({ status: 500, message: "添加失败", data: "" });
  }




})
router.get("/collectPoem", async (req, res) => {
  console.log(req.body, "collectPoem");

  
  let userId= req.user_id;
  let { id,commentId,status } = req.query; 
 status = Boolean(JSON.parse(status))!=void 0 ? JSON.parse(status):false;


  console.log(commentId)
  try{
    if(!status){
      //取消收藏
      await userFavorite.deleteOne({
    $and: [{ userId }, { poemId: id }]
})
	res.send({ status: 200, message: "取消收藏", data: "" });

    }else {
      	  //检查用户是否收藏过该古诗
    let hasData = await userFavorite.find({
	$and:[{ userId },{poemId: id}]});
  console.log(hasData,'hasData2');
	if(hasData.length){
		res.send({ status: 200, message: "诗歌已收藏", data: "" });
		return 
	}
    let data = await userFavorite.create({ userId, poemId: id });
  console.log(data, "dddd");
  res.send({ status: 200, message: "收藏成功", data: "" });

    }




  }catch(err){
	console.log(err);
	res.send({ status: 500, message: "收藏失败", data: "" });
  }

});
//获取用户收藏列表 是否需要滚动加载？
router.get("/getCollectList", async (req, res) => {
  console.log(req.body, "collectPoem");
  let userId = req.user_id;
  //古诗id

  let { type,pageNum } = req.query;

  const pageSize = 20; // 每页显示的文档数量    
  
const skipCount = (pageNum - 1) * pageSize; // 计算需要跳过的文档数量  
  
  
  let mapping = {
	poem :'poemId',
	comment: 'commentId'
  }
  let name = mapping[type]||'poemId';

  let data = await userFavorite.find({ userId,
[name]: { $ne: null }
}).sort({ createdAt: -1 }).skip(skipCount).limit(pageSize).populate(name);
  let favoriteList = data.map((v) => { 
	console.log( v[name],' v[mapping[type]]')
  let id = name == 'poemId'? v.poemId._id: v.commentId._id;
	return {
		// id: v._id, 
    id: id,
    replies: name == 'poemId'? [] : v.commentId.replies,
		content: v[name]?.title||v[name]?.content

	}
	 });
  console.log(favoriteList, data, "dddd");
  res.send({ status: 200, message: "", data: favoriteList });
});

//获取古诗详情
router.get("/getPoemDetail", async (req, res) => {
   let userId= req.user_id;
  console.log(req.body, "collectPoem");
  //古诗id

    let poemId = req.query?.id || "66c6e3736e7b39f27362cd9a";
    console.log(poemId,'poemId')

  let data = await Poems.findById(poemId)||{};


    let hasData = await userFavorite.find({
	$and:[{ userId },{poemId: poemId}]});
  console.log(hasData,'hasData');
  let isCollect = !!hasData.length;
  console.log(data,'daaa')

  let {
    content='',
    group,
    createdAt,
    judgementAnsList,
    judgementQuestions,

    updatedAt,
    lines,
    multipleChoiceQuestions,
    notes,
    poem,
    subGroup,
    title,
	_id,
	audioUrl
  } = data;

  console.log(data, "dddd");

  /* 
  
  http://10.0.112.13:3000/
  
  */

  // let url = 'https://guohanshizhou.cn/'
  // let url = 'http://10.1.166.55:3000'
  let url = 'http://47.116.218.142:3000'

  //将数据保存到浏览记录里
  try {
        const response = {}
        await axios.get(`${url}/api/addPost?userId=${req.user_id}&poemId=${poemId}`);
	console.log(response,'reee')
  let newData = {
    isCollect,
    content,
    group,
    createdAt,
    judgementAnsList,
    judgementQuestions,
	audioUrl,

    updatedAt,
    lines,
    multipleChoiceQuestions,
    notes,
    poem,
    subGroup,
    title,
	id: _id
  };
  res.send({ status: 200, message: "", data: newData });

  }catch(err){
    console.log(err,'errrrrr')
    res.send({ status: 500, message: "", data: err });

  }

});


async function insertManyPoems(dataList) {
  try {
    const docs = await Poems.insertMany(dataList);
    console.log("多个poems插入成功");
    console.log(docs);
  } catch (err) {
    console.error(err);
  }
}

// insertManyPoems();
//搜索接口
router.get("/search", async (req, res) => {
  try {
    let { search = "月" } = req.query;
    let findData = await Poems.find({
      $or: [
        { title: { $regex: new RegExp(search, "i") } },
        { poem: { $regex: new RegExp(search, "i") } },
      ],
    }).limit(10);
    findData = findData.map((v) => ({ id: v._id, title: v.title,
	poem: v.poem }));

    res.send({
      status: 200,
      message: "",
      data: findData,
      code: 200,
    });
    console.log(findData, "find");
  } catch (err) {
	
    res.send({
      status: 500,
      message: "",
      data: "",
      code: 500,
    });
  }
});

//获取古诗列表

router.post("/getPoems", async (req, res) => {
  console.log(req.body, "dd");
  let { size = 10 } = req.body;
  console.log(typeof size);
  let { group, subGroup } = req.body;
  console.log(size, group, subGroup);
  try {
    let data = null;
    if (group && subGroup) {
      data = await Poems.find({
        group,
        subGroup,
      }).limit(4);
    } else {
      //随机推送诗句
      data = await Poems.aggregate([
        { $sample: { size: size } }, // 这里随机选择10条文档
      ]);
      console.log(data, "ddd");
    }

    data = data.map((v) => {
      let poems = v.poem.split("。");
      if (!poems.length) {
        poems = v.poem.split("；");
      }
      const randomIndex = Math.floor(Math.random() * poems.length);

      return {
        id: v._id,
        title: v.title,
        poem: poems.length && poems[randomIndex] ? poems[randomIndex] : v.poem,
      };
    });
    console.log(data, "sddd");

    res.send({
      status: 200,
      message: "",
      data,
      code: 200,
    });
  } catch (err) {
    console.log(err);
    res.send({
      status: 500,
      message: "获取列表失败",
      data: err,
      code: 500,
    });
  }
});

//获取用户的浏览记录
router.get('/postList',async(req,res)=>{
	let userId = req.user_id;
	let dataA = await post.find({userId}).populate('poemId').populate('commentId').sort({ createdAt: -1 }).limit(10);
	// let dataB = await post.find({userId}).populate('commentId');
	console.log(dataA,'list1')
	// console.log(dataB,'list2');
/* 	dataB = dataB.reduce((pre, cur)=>{
		if(cur.commentId && cur.commentId?.content){
			pre.push({
				type: 'comment',
				content: cur.commentId.content,
			id: cur.commentId._id,
			})
		}
		return pre;
	},[]) */
/* 	dataB = dataB.map(v=>{
		return {
			title: v.commentId.content,
			id: v.poemId._id,
		}
	}) */


	dataA = dataA.reduce((pre, cur)=>{
		if(cur.poemId && cur.poemId?.title){
			pre.push({
				type: 'poem',
				title: cur.poemId.title,
			id: cur.poemId._id,
			})
		}else if(cur.commentId && cur.commentId?.content){
			pre.push({
				type: 'comment',
				content: cur.commentId.content,
			id: cur.commentId._id,
      like: cur.commentId.like,
      replies: cur.commentId.replies
			})
		}
		return pre;
	},[])
/* 	dataA = dataA.map(v=>{
		return {
			title: v.poemId.title,
			id: v.poemId._id,
		}
	}); */
	res.send( {status: 200,
      message: "",
      data: [...dataA],
      })


})


module.exports = router;
