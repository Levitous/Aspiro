var express = require("express");
var router = express.Router();
var db = require("../conf/database");
var multer = require('multer');
var { isLoggedIn } = require("../middleware/auth.js");

/* Photo Storage Configuration */

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

/* Document Storage Configuration */
const fileStorage = multer.diskStorage({
  destination: function(req,file,cb) {
    cb(null, 'public/documents');
  },
  filename: function (req, file, cb) {
    var fileExt = file.mimetype.split('/')[1];
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`);
  }
});
const fileUpload = multer({ storage: fileStorage });

router.post('/updateprofilephoto', isLoggedIn, photoUpload.single("photo"), async function (req,res,next) {
  const path = req.file.path;
  if(!path){
    return res.status(500).json({message:"File does not exist. Check front-end routing."});
  }
  const userID = req.session.user.userID;
  if(userID){
    try{
      var [insertResult, _ ] = await db.execute(
        `UPDATE Users SET profilePhoto = ? WHERE userID = ?`,
        [path, userID]
      );
      if(insertResult && insertResult.affectedRows == 1){
        req.session.user.profilePhoto = path;
        return res.status(200).json({message:"Success", photo: path});
      }else{
        return res.status(500).json({message:"Failed to upload"});
      }
    }catch(error){
      console.error("Failed to upload profile photo for current user:", error);
      return res.status(500).json({message:"Ran into unknown problem."});
    }
  }
});

router.post('/removeprofilephoto', isLoggedIn, async function(req,res,next){
  if(req.session.user.profilePhoto == null){
    return res.status(404).json({message: "No profile photo here to remove."});
  }
  try{
    var [insertResult, _ ] = await db.execute(
      `UPDATE Users SET profilePhoto = null WHERE userID =?`,
      [req.session.user.userID]
    );
    if(insertResult && insertResult.affectedRows == 1){
      req.session.user.profilePhoto = null;
      return res.status(200).json({message: "Success"});
    }else{
      return res.status(404).json({message: "Something went wrong - failed to remove from database"});
    }
  }catch(error){
    return res.status(500).json({message: "Error: Ran into an unknown problem"});
  }
});

router.post('/updateresume', isLoggedIn, fileUpload.single("file"), async function (req,res,next) {
  const { path } = req.file;
  if(!path){
    return res.status(500).json({message:"File does not exist. Check front-end routing."});
  }
  const userID = req.session.user.userID;
  if(userID){
    try{
      var [insertResult, _ ] = await db.execute(
        `UPDATE Users SET resume = ? WHERE userID = ?`,
        [path, userID]
      );
      if(insertResult && insertResult.affectedRows == 1){
        return res.status(200).json({message:"Success", resume: path});
      }else{
        return res.status(500).json({message:"Failed to upload"});
      }
    }catch(error){
      console.error("Failed to upload resume for current user:", error);
      return res.status(500).json({message:"Ran into unknown problem."});
    }
  }
});

router.post('/removeresume', isLoggedIn, async function (req,res,next) {
  const userID = req.session.user.userID;
  if(userID){
    try{
      var [insertResult, _ ] = await db.execute(
        `UPDATE Users SET resume = null WHERE userID = ?`,
        [userID]
      );
      if(insertResult && insertResult.affectedRows == 1){
        return res.status(200).json({message:"Success"});
      }else{
        return res.status(500).json({message:"Failed to remove"});
      }
    }catch(error){
      console.error("Failed to remove resume for current user:", error);
      return res.status(500).json({message:"Ran into unknown problem."});
    }
  }
});


/*
router.post('/AboutEdit', async function (req,res,next) {
    var { about } = req.body;
    try{
        var [insertResult, _ ] = await db.execute(
            `UPDATE Users SET aboutuser =? WHERE userID =?`,
            [about, req.session.user.userID]
        );
        if(insertResult && insertResult.affectedRows == 1){
            req.session.user.aboutuser = about;
            req.flash("success", `About me section updated successfully.`);
            return req.session.save(function(error){
            return res.redirect(`/Profile/${req.session.user.userID}`);
            });
        }else{
            next(new Error('Error: Update was unsuccessful.'));
            return res.redirect(`/Profile/${req.session.user.userID}`);
        }
    }catch(error){
        next(error);
    }
});

router.post('/removeAboutUser', async function(req,res,next){
    if(!req.session.user.aboutUser){
        req.flash("error","About Me is already Empty.");
        return res.redirect(`/Profile/${req.session.user.userID}`);
    }
    try{
        var [insertResult, _ ] = await db.execute(
        `UPDATE Users SET aboutUser = null WHERE userID =?`,
        [req.session.user.userID]
        );
        if(insertResult && insertResult.affectedRows == 1){
        req.session.user.aboutUser = null;
        req.flash("success", `About Me entry removed.`);
        return req.session.save(function(error){
            return res.redirect(`/Profile/${req.session.user.userID}`);
        });
        }else{
        next(new Error('Error: Removal was unsuccessful'));
        return res.redirect(`/Profile/${req.session.user.userID}`);
        }
    }catch(error){
        next(error)
    }
});
*/

router.post('/updatebackground', isLoggedIn, photoUpload.single("photo"), async function (req,res,next) {
  if(!req.session.user){
    return res.status(401).json({message:"Unauthorized"});
  }
  const {email} = req.session.user;

  if(req.session.user.type != "faculty"){
    return res.status(401).json({message:"Unauthorized"});
  }

  const {path} = req.file;
  if(!path){
    return res.status(404).json({message:"No file received."});
  }

  try{
    const [result, _ ] = await db.execute(`
      SELECT fk_school FROM Faculty
      WHERE fk_userEmail = ?;`,
      [email]);
    if(result && result.length == 0){
      return res.status(404).json({message:"This user has no school."});
    }
    const schoolID = result[0].fk_school;
    var [insertResult, __ ] = await db.execute(
      `UPDATE Schools SET background = ? WHERE schoolID = ?`,
      [path, schoolID]
    );
    if(insertResult && insertResult.affectedRows == 1){
      return res.status(200).json({message:"Success", photo: path});
    }else{
      return res.status(500).json({message:"Failed to upload"});
    }
  }catch(error){
    console.error("Failed to upload background for current user's school:", error);
    return res.status(500).json({message:"Ran into unknown problem."});
  }
});

router.post('/removebackground', isLoggedIn, async function (req,res,next) {
  if(!req.session.user){
    return res.status(401).json({message:"Unauthorized"});
  }
  const {email} = req.session.user;

  if(req.session.user.type != "faculty"){
    return res.status(401).json({message:"Unauthorized"});
  }
  
  try{
    const [result, _ ] = await db.execute(`
      SELECT fk_school FROM Faculty
      WHERE fk_userEmail = ?;`,
      [email]);
    if(result && result.length == 0){
      return res.status(404).json({message:"This user has no school."});
    }
    const schoolID = result[0].fk_school;
    var [updateResult, __ ] = await db.execute(
      `UPDATE Schools SET background = null WHERE schoolID = ?`,
      [schoolID]
    );
    if(updateResult && updateResult.affectedRows == 1){
      return res.status(200).json({message:"Success"});
    }else{
      return res.status(500).json({message:"Failed to remove background"});
    }
  }catch(error){
    console.error("Failed to remove background for current user's school:", error);
    return res.status(500).json({message:"Ran into unknown problem."});
  }
});

module.exports = router;
