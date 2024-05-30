'use strict'
var express = require("express");
var router = express.Router();
var db = require('../conf/database');
var { isLoggedIn } = require("../middleware/auth.js");

router.get('/userinfo', isLoggedIn, async (req, res, next) => {
    if(res.locals.user) {
      res.json(res.locals.user);
    }else{
      res.json("No user logged in");
    }
});
  
  router.get("/sports", async (req, res) => {
    try {
      const [rows, fields] = await db.execute(
        `SELECT * FROM team6db.Sports ORDER BY Sports.name`
      );
      if(rows.length > 0){
        res.status(200).json(rows);
      }else{
        res.status(404).json({result: "No schools found"});
      }
    } catch (error) {
      res.status(500).json({result: "Internal server error"});
    }
  });
  
  router.get("/schools", async (req, res) => {
    try {
      const [rows, fields] = await db.execute(
       `SELECT DISTINCT Schools.name
        FROM team6db.Schools
        ORDER BY Schools.name;`
      );
      if(rows.length > 0){
        res.status(200).json(rows);
      }else{
        res.status(404).json({result: "No schools found"});
      }
    } catch (error) {
      res.status(500).json({result: "Internal server error"});
    }
  });

  router.get("/posts", async (req, res) => {
    const {userID} = req.body;
    try{
      const [rows, fields] = await db.execute(
        `SELECT * FROM Posts WHERE Posts.fk_userID=?`,
          [userID]
        );
        if(rows.length > 0){
          res.status(200).json({result: rows});
        }else{
          res.status(404).json({result: "No posts found"});
        }
      } catch (error) {
        res.status(500).json({result: "Internal server error"});
    }
  });

  router.get("/schoolfaculty/:schoolname", async (req, res) => {
    const {schoolname} = req.params;
    const parsedname = schoolname.replace("%20", " ");
    try{
      const [rows, fields] = await db.execute(`
        SELECT
        Users.firstname, Users.lastname, Users.username,
        Users.email, Users.profilePhoto, Sports.name
        FROM Users
        JOIN Faculty ON Faculty.fk_userEmail = Users.email
        JOIN Sports ON Faculty.fk_sport = Sports.sportID
        JOIN Schools ON Faculty.fk_school = Schools.schoolID 
        WHERE Schools.name = ?;`,
        [parsedname]
      );
      if(rows.length > 0){
        const faculty = rows.map((row) => {
          return {
            firstname: row.firstname,
            lastname: row.lastname,
            username: row.username,
            email: row.email,
            profilePhoto: row.profilePhoto,
            sport: row.name
          }
        });
        res.status(200).json(faculty);
      }else{
        res.status(404).send("No school faculty found.");
      }
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  });

  router.get("/sportranks/:schoolname", async (req, res) =>{
    const {schoolname} = req.params;
    const parsedname = schoolname.replace("%20", " ");
    try{
      const [rows, fields] = await db.execute(`
        SELECT sportranking, Sports.name FROM team6db.SchoolSportScores
        JOIN Schools ON Schools.schoolID = SchoolSportScores.fk_schoolID
        JOIN Sports ON Sports.sportID = SchoolSportScores.fk_sportID
        WHERE Schools.name = ?
        ORDER BY sportranking ASC;`,
        [parsedname]
      );
      if(rows.length > 0){
        res.status(200).json({result: rows});
      }else{
        res.status(404).send("No sport rankings found.");
      }
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  });
  
  router.get("/postphotos", async (req, res) => {
    const {postID} = req.body;
    try{
      const [rows, fields] = await db.execute(
        `SELECT * FROM PostsPhotos WHERE Posts.fk_postID=?`,
          [postID]
        );
        if(rows.length > 0){
          res.status(200).json({result: rows});
        }else{
          res.status(404).json({result: "No postphotos found"});
        }
      } catch (error) {
        res.status(500).json({result: "Internal server error"});
    }
  });
  
  router.get("/posts", async (req, res) => {
    const {postID} = req.body;
    try{
      const [rows, fields] = await db.execute(
        `SELECT * FROM PostVideos WHERE Posts.fk_postID=?`,
          [postID]
        );
        if(rows.length > 0){
          res.status(200).json({result: rows});
        }else{
          res.status(404).json({result: "No postvideos found"});
        }
      } catch (error) {
        res.status(500).json({result: "Internal server error"});
    }
  });


// End
module.exports = router;