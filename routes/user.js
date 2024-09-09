// 引入express模块
const express = require("express");
const axios = require("axios");
// 定义路由级中间件
const router = express.Router();
// 引入数据模型模块
const Item = require("../models/poems");
const User = require("../models/user");
const JWT = require("../utils/JWT");
console.log(Item, "poems");


const multer = require("multer");
const OSS = require("ali-oss");

// const uuid = require("uuid");

const accessKeyId = "" //;
const accessKeySecret = "" //"";
const endpoint = "http://oss-cn-shanghai.aliyuncs.com";
const bucketName = "poems-resource";
const OSSregion =  "oss-cn-shanghai";

/* const client = new OSS({
  accessKeyId,
  accessKeySecret,
  region: "oss-cn-shanghai",
  bucket: bucketName,
  authorizationV4: true,
//   endpoint,
}); */


// 使用内存存储引擎，文件数据将保存在内存中的 Buffer 对象
// const upload = multer({ storage: multer.memoryStorage() });
const upload = multer({ dest: 'uploads/' });

router.post('/uploadImage',upload.single('file'),async (req,res)=> {
	console.log(req.file,'ffffile')
	try {
		let fileName = req.file.originalname
	let userId = req.user_id;
	fileName = `upload/${userId}/${fileName}`;
		const result = await client.put(fileName,req.file.path);
		 res.send({  
      message: '文件上传成功',  
      data: result  
    });  
	}catch (error) {  
    res.status(500).send({  
      message: '文件上传失败',  
      error: error.message  
    });  
  }  
})

const exchangeCodeForAccessToken = async ({ code, appid, app_secret }) => {
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${app_secret}&js_code=${code}&grant_type=authorization_code`;

  try {
    const response = await axios.get(url);
    console.log(response.data, "response");
    return response.data;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
};
const exchangePhoneNumberForAccessToken = async (code) => {
  const url = `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=ACCESS_TOKEN `;

  try {
    const response = await axios.post(url, { code });
    console.log(response.data, "response");
    return response.data;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
};

//  curl -G 'https://api.weixin.qq.com/wxa/checksession?access_token=OsAoOMw4niuuVbfSxxxxxxxxxxxxxxxxxxx&signature=fefce01bfba4670c85b228e6ca2b493c90971e7c442f54fc448662eb7cd72509&openid=oGZUI0egBJY1zhBYw2KhdUfwVJJE&sig_method=hmac_sha256'
const checkUserLogin = async () => {
  const url = `https://api.weixin.qq.com/wxa/checksession?access_token=${accessToken}&signature=${signature}&openid=${openid}&sig_method=hmac_sha256`;

  try {
    const response = await axios.get(url);
    console.log(response.data, "response");
    return response.data;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
};
const fetchOrCreateUser = async (openid) => {
  try {
    //查找是否存在该用户
    let user = await User.findOne({ openid });
    if (user) {
      return user;
    } else {
      //不存在根据openid创建
      user = User.create({ openid });
      return user;
    }
  } catch (err) {
    console.log("获取 用户失败", err);
    throw err;
  }
};
// 登录接口
router.post("/login", async (req, res) => {
  try {
    let code = req.body.code;
    let appid = "wx12121ee490eb1a7f";
    let app_secret = "315c0a8b71335720d3b1416255477981";
    console.log(req.body, code, "code");
    // 使用code换access_token 和openid
    let data = await exchangeCodeForAccessToken({
      code,
      appid,
      app_secret,
    });
    console.log(data, "data1");

    //根据openid查询or创建用户
    let user = await fetchOrCreateUser(data.openid);
    console.log(user, "user...");

    let token = JWT.createToken(
      { openid: user.openid, id: user._id },
      "1day"
    );
    // console.log(token,'token...')
    res.header("Authorization", token);
    res.send({
      status: 200,
      message: "登录成功!",
      data: {
        token,
      },
    });
  } catch (err) {
	console.log(err,'eee')
	 res.send({ status: 1001, message: '登录失败', data: err });
   
  }

});

router.get("/checkLogin", (req, res) => {
  // https://api.weixin.qq.com/wxa/checksession?access_token=ACCESS_TOKEN&signature=SIGNATURE&openid=OPENID&sig_method=SIG_METHOD
});

// 更新用户信息
router.post("/updateProfile", async (req, res) => {
  try {
    let {avatorUrl,nickName} = req.body;
	let userId = req.user_id;
	let data = await User.findById(userId);
	avatorUrl && (data.avatarUrl = avatorUrl);
	nickName && (data.nickname = nickName)
	console.log(data,'save')
	await data.save();
	console.log(data,'ddd')
 
    res.send({
      status: 200,
      message: "修改成功!",
      data: {
        avatorUrl,
		nickName
      },
    });
  } catch (err) {
	console.log(err,'eee')
	 res.send({ status: 1001, message: '登录失败', data: err });
   
  }

});


//添加关注
router.get('/addFollow',async (req,res)=>{
	/* 
	用户A关注用户B
	将userB添加到用户A的follwer 

	
	*/
	let userA = req.user_id;
	let {userId } = req.query;
	let data = await User.findById(userA);
	//获取该用户是否关注过
	// data.followers.find(v=>)
	data.followers.push(userId);
	await data.save();
	let dataB = await User.findById(userId);
	dataB.following.push(userA)
	await dataB.save();
	 res.send({ status: 200, message: 'success', data: '' });

})
//获取关注和被关注
router.get('/followList',async (req,res)=>{
	/* 
	用户A关注用户B
	将userB添加到用户A的follwer 

	
	*/
	let userA = req.user_id;
	let data = await User.findById(userA);
	let followers = data.followers;
	let following = data.following;
	await data.save();
	 res.send({ status: 200, message: 'success', data: {
		followers,
		following

	 } });

})

// 评论表

module.exports = router;
