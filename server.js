const express = require('express');
const app = express();

const apiRoutes = require('./routes/api');
const poems = require('./routes/poems')
const user = require('./routes/user');
const comment = require('./routes/comment');
const bodyParser = require("body-parser");
const  OSS =require("./routes/oss")
const fs = require('fs');
 
const JWT = require("./utils/JWT");
 
// const MpUploadOssHelper = require("./utils/oss/uploadOssHelper.js");





app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json()); // 用于解析 JSON 请求体

app.use((req, res, next) => {  
  console.log(req.path)
  let whiteList = ['/api/login','/api/addPost'];
  if (whiteList.includes(req.path)) return next()
 
  let token = req.get('Authorization');
  if (token) {
    const result = JWT.verifyToken(token.split(' ')[1])
    console.log(result,'result');
    if (result) {
      req.user_id = result.id;
      next()
    } else {
      res.status(401).send({ code: 401, msg: '登录信息已失效，请重新登录' })
    }
  } else { 
    res.send({ code: 500, msg: '未携带token' })
  }
  
})
 



// const PORT = process.env.PORT || 3000;

const https = require('https');


app.use('/upload', OSS);

app.use('/api',comment)
app.use('/api',user)
app.use('/api',poems)
app.use('/api', apiRoutes);
app.get('/', (req, res) => {
  res.send('Hello World!');
});
const options = {
    key: fs.readFileSync('ssl/guohanshizhou.cn.key'),
    cert: fs.readFileSync('ssl/guohanshizhou.cn.pem')
};
 
// app.listen(options, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const PORT = 443; // HTTPS 默认端口
https.createServer(options, app)
    .listen(PORT, () => {
        console.log(`HTTPS Server is running on https://localhost:${PORT}`);
    });