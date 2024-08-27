const express = require('express');
const router = express.Router();
 
// 假设这是一个获取用户信息的接口
router.get('/userinfo', (req, res) => {
  res.json({
    id: 1,
    name: 'John Doe',
    age: 30
  });
});
 
module.exports = router;