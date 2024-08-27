 
const jwt = require('jsonwebtoken')
const secret = "ultraman"//解密密钥
 
const JWT = {
    createToken: (data,time) => { 
        return jwt.sign(data,secret,{expiresIn:time})
    },
    verifyToken: (token) => { 
    // 如果token过期或验证失败，将返回false
       try {
        return jwt.verify(token,secret)
       } catch (error) {
        return false
       }
    }
}
 
module.exports = JWT