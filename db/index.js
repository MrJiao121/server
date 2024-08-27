
// 连接数据库（mongodb的服务端）
// 获取mongoose插件
const mongoose = require('mongoose');
// const { MongoClient } = require('mongodb');
// const url = 'mongodb://localhost';
const url = 'mongodb+srv://duoduo_try:ceshi123@cluster0.i65gz.mongodb.net';

const dbName = 'poem'

// 连接数据库
mongoose.connect(`${url}/${dbName}`,{
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
//  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// 获取当前的连接对象
const conn = mongoose.connection;



conn.on('error', err => {
    console.error('mongoose连接出错', err)

	 mongoose.connect(`${url}/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).catch((err) => {
    console.error('重新连接失败', err);
  });
})
conn.once('open',()=>{
	console.log('connect...')
})


module.exports = mongoose;
