const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const multer = require("multer");
const OSS = require("ali-oss");

// const uuid = require("uuid");


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


let client = null;
const Credential = require("@alicloud/credentials");

 console.log( 'process',process.env.ALIBABA_CLOUD_ACCESS_KEY_ID);
// 使用RamRoleArn初始化Credentials Client。
const credentialsConfig = new Credential.Config({
 
  // 凭证类型。
  type: "ram_role_arn",
  // 从环境变量中获取AccessKey ID的值
  accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID,
  // 从环境变量中获取AccessKey Secret的值
  accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET,
  // 要扮演的RAM角色ARN，示例值：acs:ram::123456789012****:role/adminrole，可以通过环境变量ALIBABA_CLOUD_ROLE_ARN设置roleArn
  roleArn: 'acs:ram::1284423962368172:role/ramosstest',
  // 角色会话名称，可以通过环境变量ALIBABA_CLOUD_ROLE_SESSION_NAME设置RoleSessionName
  roleSessionName: 'RamOssTest',
  // 设置更小的权限策略，非必填。示例值：{"Statement": [{"Action": ["*"],"Effect": "Allow","Resource": ["*"]}],"Version":"1"}
  // policy: '<Policy>',
  roleSessionExpiration: 3600
});
const initOss = async () => {
  const credentialClient = new Credential.default(credentialsConfig);
const credential = await credentialClient.getCredential();

// 初始化OSS
 client = new OSS({
  accessKeyId:credential.accessKeyId,
  accessKeySecret: credential.accessKeySecret,
  stsToken: credential.securityToken,
  refreshSTSTokenInterval: 0, // 由Credential控制accessKeyId、accessKeySecret和stsToken值的更新
  refreshSTSToken: async () => {
    const { accessKeyId, accessKeySecret, securityToken } = await credentialClient.getCredential();
    return {
      accessKeyId,
      accessKeySecret,
      stsToken: securityToken,
    };
  }
});
}
initOss()









const ossRouter = express.Router();

// 使用内存存储引擎，文件数据将保存在内存中的 Buffer 对象
// const upload = multer({ storage: multer.memoryStorage() });
const upload = multer({ dest: 'uploads/' });
ossRouter.post('/uploadImage',upload.single('file'),async (req,res)=> {
	console.log(req.file,'ffffile')
	let fileName = req.file.originalname
	let userId = req.user_id;
	fileName = `upload/${userId}/${fileName}`;
	try {
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








module.exports = ossRouter;




// ossRouter.get("/dowmloadImage", async (req, res) => {
//   const filename =
//     "travels/1712677732798-1712677732783-n2uMiKUZycvH907f26eace7f9272fdc0cdea2d4863c9.png";
//   try {
//     // 下载图片
//     const fileData = await getImageFromOSS(filename);
//     // 将文件内容发送给客户端
//     res.set("Content-Type", "image/png");
//     res.send(fileData);
//   } catch (error) {
//     console.error("Failed to get image from OSS:", error);
//     res.status(500).send("Failed to get image from OSS");
//   }
// });

// ossRouter.get("/listIamge", async (req, res) => {
//   try {
//     const result = await client.list({
//       prefix: "travels/",
//     });
//     console.log("Files listed:", result.objects);
//     res.status(200).json(result.objects.map((obj) => obj.name));
//   } catch (err) {
//     console.error("Listing failed:", err);
//     res.status(500).send("Listing failed");
//   }
// });

// // 删除文件路由
// ossRouter.delete("/deleteIamge", async (req, res) => {
//   try {
//     const result = await client.delete("travels/object-key");
//     console.log("Deleted:", result);
//     res.status(200).send("File deleted successfully");
//   } catch (err) {
//     console.error("Deletion failed:", err);
//     res.status(500).send("Deletion failed");
//   }
// });