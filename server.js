const express = require('express');
const app = express();

const poems = require('./routes/poems-new')
const user = require('./routes/user');
const newUser = require('./routes/new_user')
const comment = require('./routes/comment');
const bodyParser = require("body-parser");
const  OSS =require("./routes/oss")
const fs = require('fs');
 const https = require('https');
const JWT = require("./utils/JWT");



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json()); // 用于解析 JSON 请求体

app.use((req, res, next) => {  
  console.log(req.path)
  let whiteList = ['/api/login','/api/addPost'];
  if (whiteList.includes(req.path)) return next()
  console.log('bool',whiteList.includes(req.path))
 
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
 
// app.use('/api',newser)
app.use('/upload', OSS);

app.use('/api',comment)
app.use('/api',user)
app.use('/api',poems)
app.get('/', (req, res) => {
  res.send('Hello World!');
});
const options = {
    key: fs.readFileSync('ssl/guohanshizhou.cn.key'),
    cert: fs.readFileSync('ssl/guohanshizhou.cn.pem')
};
 
const PORT = process.env.PORT || 3000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

// const PORT = 443; // HTTPS 默认端口
// https.createServer(options, app)
//     .listen(PORT, () => {
//         console.log(`HTTPS Server is running on https://localhost:${PORT}`);
//     });