const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const multer = require("multer");
const OSS = require("ali-oss");

// const uuid = require("uuid");

const accessKeyId = "LTAI5tL3sKdgVSYg93kJhhqz";
const accessKeySecret = "7Kf84Z02AMc9sHhvmXMsn8349uv0bU";
const endpoint = "http://oss-cn-shanghai.aliyuncs.com";
const bucketName = "poems-resource";
const OSSregion =  "oss-cn-shanghai";

const client = new OSS({
  accessKeyId,
  accessKeySecret,
  region: "oss-cn-shanghai",
  bucket: bucketName,
  authorizationV4: true,
//   endpoint,
});




/* try {
  const putObjectResult = await store.put(bucketName, 'tuxiang', {
    headers: {
      // The headers of this request
      header1: 'value1',
      header2: 'value2'
    },
    // The keys of the request headers that need to be calculated into the V4 signature. Please ensure that these additional headers are included in the request headers.
    additionalHeaders: ['additional header1', 'additional header2']
  });
  console.log(putObjectResult);
} catch (e) {
  console.log(e);
} */


/* const client = new OSS({
  // 从环境变量中获取访问凭证。运行本代码示例之前，请确保已设置环境变量OSS_ACCESS_KEY_ID和OSS_ACCESS_KEY_SECRET。
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: 'yourRegion',
  authorizationV4: true,
  // yourBucketName填写Bucket名称。
  bucket: 'yourBucketName',
}); */

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