// 数据模型（规范数据格式）

const mongoose = require('../db/index.js')

// 定义schema（数据规范）
const UserSchema = mongoose.Schema({
    openid: {
        type: String,
        required: true,      // 必填
        unique: true         // 唯一，不重复
    },

    nickname: String,

    avatarUrl: String,
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],//该用户的关注者
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],//被关注
    createTime: { type: Date, default: Date.now }
}, {
    timestamps: true        // 时间戳，自动添加文档的创建时间
})






const User = module.exports = mongoose.model('user',UserSchema);

