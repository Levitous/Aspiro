'use strict'
var express = require("express");
var router = express.Router();
var db = require('../conf/database');
var multer = require('multer');
var { isLoggedIn } = require("../middleware/auth.js");
var dayjs = require("dayjs");
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs().format();
dayjs.extend(relativeTime);
var duration = require('dayjs/plugin/duration')
dayjs.extend(duration)

const photoStorage = multer.diskStorage({
    destination: function(req,file,cb) {
      cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
      var fileExt = file.mimetype.split('/')[1];
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`);
    }
  });
const photoUpload = multer({ storage: photoStorage });
  
/* Video Storage Configuration */
const videoStorage = multer.diskStorage({
destination: function(req,file,cb) {
    cb(null, 'public/videos');
},
filename: function (req, file, cb) {
    var fileExt = file.mimetype.split('/')[1];
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`);
}
});
const videoUpload = multer({ storage: videoStorage });

router.post('/create', isLoggedIn, async function (req, res, next) {
    if(!isLoggedIn) return res.status(500).json({message: "You are not logged in."});
    const userID = req.session.user.userID;
    try{
      var [insertResult, _ ] = await db.execute(
        `INSERT INTO team6db.Posts (fk_userID) VALUES (?)`,
        [userID]
      );
      if (insertResult && insertResult.affectedRows == 1) {
        const postID = insertResult.insertId;
        return res.status(200).json({message: "Success", postId: postID});
      } else {
        return res.status(500).json({message: "Database insert failed"});
      }
    }catch(error){
      return res.status(500).json({message: "Post creation failed due to unknown server error"});
    }
  });
  
  router.post('/addtext', isLoggedIn, async function (req, res, next) {
    if(!isLoggedIn) return res.status(500).json({message: "You are not logged in."});
    const userID = req.session.user.userID;
    const { text, postID } = req.body;
    try{
      var [updateResult, _ ] = await db.execute(
        `UPDATE team6db.Posts SET text=? WHERE fk_userID=? AND postID=?;`,
        [text, userID, postID]
      );
      if(updateResult && updateResult.affectedRows == 1){
        return res.status(200).json({message:"Success"});
      }else{
        return res.status(500).json({message:"Database insert failed"});
      }
    }catch(error){
      return res.status(500).json({message: "Post text creation failed due to unknown server error"});
    }
  });
  
  router.post('/addphoto', isLoggedIn, photoUpload.single("photo"), async function (req, res, next) {
    if(!isLoggedIn) return res.status(500).json({message: "You are not logged in."});
      const postID = req.body.postID;
    const userID = req.session.user.userID;
    var { desc } = req.body;
    if(!desc) desc = "";
    const { path } = req.file;
  
    try{
      // Validate the request:
      const [checkResult] = await db.execute(
        `SELECT fk_userID FROM team6db.Posts WHERE postID = ?;`,
        [postID]
      );
  
      // Check if any post was found
      if (checkResult.length === 0) {
          return res.status(404).json({message: "Post not found."});
      }
  
      // check if the user is authorized to edit the post
      if (checkResult[0].fk_userID !== userID) {
          return res.status(401).json({message: "Unauthorized"});
      }
  
      // Looks good, insert the photo:
      const [insertResult, _ ] = await db.execute(
        `INSERT INTO team6db.PostPhotos (photo, description, fk_postID) VALUES (?, ?, ?);`,
        [path, desc, postID]
      );
      if(insertResult && insertResult.affectedRows == 1){
        return res.status(200).json({message: "Success", photo: path});
      }else{
        return res.status(500).json({message:"Database insert failed"});
      }
    }catch(error){
      console.error("Error in /post/addphoto:", error);
      return res.status(500).json({message: "Post creation failed due to unknown server error"});
    }
  });
  
  router.post('/addvideo', isLoggedIn, videoUpload.single("video"), async function (req, res, next) {
    if(!isLoggedIn) return res.status(500).json({message: "You are not logged in."});
    const userID = req.session.user.userID;
    const { postID } = req.body;
  
    // Not sure if it's req.body.file or req.file ...
    // use console.log to find out if possible. check req.file and req.body:
    // and change the following accordingly:
    const { path } = req.file;  // this doesn't need to be reflected, it's built in.
    const { desc } = req.body;  // name needs to be reflected on front end JSON
  
    try{
      // Validate the request:
      const [checkResult, __] = await db.execute(
        `SELECT fk_userID FROM team6db.Posts WHERE postID=?;`,
        [postID]
      );
      if(checkResult && checkResult.affectRows == 1){
        if(checkResult[0].fk_userID != userID){ // might be checkResult[0].fk_userID?
          return res.status(401).json({message: "You are not authorized to edit this post."});
        }
      }else{
        return res.status(404).json({message: "Post not found."});
      }
  
      // Looks good, insert the photo:
      const [insertResult, _ ] = await db.execute(
        `INSERT INTO team6db.PostVideos (video, description, fk_postID) VALUES (?,?);`,
        [path, desc, postID]
      );
      if(insertResult && insertResult.affectedRows == 1){
        return res.status(200).json({message:"Success"});
      }else{
        return res.status(500).json({message:"Database insert failed"});
      }
    }catch(error){
      return res.status(500).json({message: "Post creation failed due to unknown server error"});
    }
  });
  
  router.get('/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const [posts, _] = await db.execute(
            `SELECT p.postID, p.text, p.timestamp, pp.photo, pp.description AS photoDescription
             FROM Posts p
             LEFT JOIN PostPhotos pp ON p.postID = pp.fk_postID
             WHERE p.fk_userID IN (SELECT userID FROM Users WHERE username = ?)`,
            [username]
        );
        const postsMap = [];
        // Iterate through each post returned by the database
        for (let post of posts) {
            if (!postsMap[post.postID]) {
                postsMap[post.postID] = {
                    postID: post.postID,
                    text: post.text,
                    timestamp: dayjs(post.timestamp).fromNow(),
                    photos: []
                };
            }
            // add the photos to the map if present
            if (post.photo) {
                postsMap[post.postID].photos.push({
                    photo: post.photo,
                    description: post.photoDescription
                });
            }
        }
        // make a normal array object to list the post data for use in frontend
        const postsWithPhotos = Object.values(postsMap);
        res.json({ posts: postsWithPhotos });
    } catch (error) {
        console.error('Failed to fetch posts with photos: ', error);
        res.status(500).json({ message: 'Failed to fetch posts due to a server error' });
    }
  });

// End
module.exports = router;