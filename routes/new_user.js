const express = require("express");
const axios = require("axios");
// 定义路由级中间件
const router = express.Router();
// 引入数据模型模块
const Item = require("../models/poems");
const User = require("../models/user");
const JWT = require("../utils/JWT");


// 登录接口
router.post("/login", async (req, res) => {
  try {
    console.log('ceshi',res.path)
    let code = req.body.code;
    let appid = "wx12121ee490eb1a7f";
    let app_secret = "315c0a8b71335720d3b1416255477981";
    console.log(req.body, code, "code");

    // console.log(data, "data1");

    //根据openid查询or创建用户
    // let user = await fetchOrCreateUser(data.openid);
    console.log(user, "user...");

    // let token = JWT.createToken(
    //   { openid: user.openid, id: user._id },
    //   "1day"
    // );
    // console.log(token,'token...')
    // res.header("Authorization", token);
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

router.get("/login", async (req, res) => {
  try {
    console.log('ceshi',res.path)
    let code = req.body.code;
    let appid = "wx12121ee490eb1a7f";
    let app_secret = "315c0a8b71335720d3b1416255477981";
    console.log(req.body, code, "code");

    // console.log(data, "data1");

    //根据openid查询or创建用户
    // let user = await fetchOrCreateUser(data.openid);
    // console.log(user, "user...");

    // let token = JWT.createToken(
    //   { openid: user.openid, id: user._id },
    //   "1day"
    // );
    // console.log(token,'token...')
    // res.header("Authorization", token);
    res.send({
      status: 200,
      message: "登录成功!",
      data: {
        token: '',
      },
    });
  } catch (err) {
	console.log(err,'eee')
	 res.send({ status: 1001, message: '登录失败', data: err });
   
  }

});
module.exports = router;