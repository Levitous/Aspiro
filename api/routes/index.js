'use strict'
var express = require("express");
var router = express.Router();
var db = require('../conf/database');
var bcrypt = require("bcrypt");

// Import Middleware
var { isLoggedIn } = require("../middleware/auth.js");
var { validateReg } = require('../middleware/validation.js');

// GET ROUTES BEGIN
router.get('/api/auth/status', isLoggedIn, async function (req, res){
  if (res.locals.isLoggedIn) {
      res.json({ isLoggedIn: true });
  } else {
      res.json({ isLoggedIn: false });
  }
});

router.get('/athlete/:username', isLoggedIn, async (req, res, next) => {
  const { username } = req.params;
  try {
      const [rows, fields] = await db.execute(
          `SELECT Users.userID, Users.firstname, Users.lastname, Users.username, Users.email, Users.aboutuser, 
                  Users.profilePhoto, Athletes.fk_userEmail, Users.resume, Sports.name AS sportName, Schools.name AS schoolName 
          FROM Users JOIN Athletes ON Users.email = Athletes.fk_userEmail
          LEFT JOIN Sports ON Athletes.fk_sport = Sports.sportID
          LEFT JOIN Schools ON Athletes.fk_school = Schools.schoolID
          WHERE Users.username = ?;`,
          [username]
      );
      const athlete = rows[0];
      if (!athlete) {
          return res.status(404).json({ error: "Athlete not found" });
      }
      if(req.session.user){
        if(res.locals.user.username === username){
          athlete.isMyProfile = true;
        }else{
          athlete.isMyProfile = false;
        }
      }else{
        athlete.isMyProfile = false;
      }
      return res.json(athlete);
  } catch (error) {
      console.error("Failed to fetch athlete information:", error);
      res.status(500).send("Server error");
  }
});

router.get('/faculty/:username', async (req, res, next) => {
  const { username } = req.params;
  try {
      const [rows, _] = await db.execute(
          `SELECT
          Users.userID, Users.firstname, 
          Users.lastname, Users.username, 
          Users.email, Users.aboutuser, 
          Users.profilePhoto, Users.resume,
          Sports.name AS sportName, Schools.name AS schoolName 
          FROM Users
          JOIN Faculty ON Users.email = Faculty.fk_userEmail
          LEFT JOIN Sports ON Faculty.fk_sport = Sports.sportID
          LEFT JOIN Schools ON Faculty.fk_school = Schools.schoolID
          WHERE Users.username = ?;`,
          [username]
      );
      const faculty = rows[0];
      if (!faculty) {
          return res.status(404).json({ error: "Athlete not found" });
      }
      if(req.session.user){
        if(res.locals.user.username === username){
          faculty.isMyProfile = true;
        }else{
          faculty.isMyProfile = false;
        }
      }else{
        faculty.isMyProfile = false;
      }
      return res.json(faculty);
  } catch (error) {
      console.error("Failed to fetch athlete information:", error);
      res.status(500).send("Server error");
  }
});

router.get('/school/:name', isLoggedIn, async (req, res, next) => {
  const { name } = req.params;
  try {
      const [rows, _] = await db.execute(
          `SELECT * FROM team6db.Schools WHERE name=?;`,
          [name]
      );
      const schoolInfo = rows[0];
      if (!schoolInfo) {
          return res.status(404).json({ error: "School not found." });
      }
      const [faculty, __] = await db.execute(
        `SELECT fk_userEmail FROM Faculty WHERE fk_school=(
          SELECT schoolID FROM Schools WHERE name=?
        );`,
        [name]
      );
      const facultyarray = faculty.map((obj) => {
        const value = obj["fk_userEmail"];
        return value;
      });
      if(req.session.user){
        if(facultyarray.includes(req.session.user.email)){
          schoolInfo.isMySchool = true;
        }else{
          schoolInfo.isMySchool = false;
        }
      }else{
        schoolInfo.isMySchool = false;
      }
      return res.json(schoolInfo);
  } catch (error) {
      console.error("Failed to retrieve school information:", error);
      res.status(500).send("Server error");
  }
});

// Registration Routes
router.post("/register/:type([^/]+)", validateReg, async function(req, res, next) {
  if(res.locals.validationerror) {
    return res.json({Error: res.locals.validationerror});
  }
  const type = req.params.type;
  var {username, password, firstname, lastname, email, school, sport} = req.body;
  try{
    const [checkresult, _ ] = await db.execute(`
      SELECT * FROM team6db.Users WHERE username=? OR email=?;`,
      [username, email]
    );
    if(checkresult.length > 0){
      return res.status(409).json({message: "Username or email already exists"});
    }
    var hashedPassword = await bcrypt.hash(password, 3);
    var [resultObject, fields] = await db.execute(
        `INSERT INTO Users
        (firstname, lastname, username, type,
        email, password)
        value
        (?,?,?,?,?,?);`,
        [firstname, lastname, username, type, email, hashedPassword]
        );
        if (resultObject && resultObject.affectedRows == 1){
          switch (type) {
            case 'athlete':
              await db.execute(
                `INSERT INTO Athletes(fk_userEmail, fk_sport, fk_school)
                VALUES (?,
                  (SELECT s.sportID FROM Sports s WHERE s.name = ?),
                  (SELECT sc.schoolID FROM Schools sc WHERE sc.name =?));`,
                [email, sport, school]
              );
              break;
            case 'faculty':
              await db.execute(
                `INSERT INTO Faculty(fk_userEmail, fk_sport, fk_school)
                VALUES (?,
                        (SELECT s.sportID FROM Sports s WHERE s.name = ?),
                        (SELECT sc.schoolID FROM Schools sc WHERE sc.name =?));`,
                [email, sport, school]
              );
              break;
            case 'admin':
              await db.execute(
                `INSERT INTO Admins (fk_userEmail) VALUES (?);`,
                [email]
              );
              break;
            default:
              throw new Error("Invalid user type");
          }
          return res.status(200).json({message: "Registration successful"});
        } else {
          return res.status(500).json({message: "Registration failed"});
        }
    }catch(error){
      next(error);
    }
  }
);

// Login Routing
router.post("/Login", isLoggedIn, async function (req, res, next){
  const success = 200;
  const failure = 500;

  if(res.locals.isLoggedIn){
    return res.status(failure).json({error: "Already logged in."}); 
  }
 
  var {username, password} = req.body;

  if (!username || !password) {
    return res.status(failure).json({error: "Username or password missing"}); 
  } 

  try {
    var [rows, _] = await db.execute(
      `SELECT userID, firstname, username, 
       password, email, type, profilePhoto 
       FROM Users WHERE username=?;`,
      [username]
    );
    
    if (rows.length === 0){
      return res.status(failure).json({error: "User not found"});
    }
    var userdata = rows[0];
    var passwordsMatch = await bcrypt.compare(password, userdata.password);
    if (passwordsMatch) {
      req.session.user = {
        userID: userdata.userID,
        email: userdata.email,
        username: userdata.username,
        firstname: userdata.firstname,
        profilePhoto: userdata.profilePhoto,
        type: userdata.type
      }
      return res.status(success).json({message: "Login Successful"}); 
    } else {
      return res.status(failure).json({error: "Invalid password"});
    }
  } catch(error) {
    next(error); 
  }
});

router.post("/Logout", isLoggedIn, function (req, res) {
  try{
    req.session.destroy(function(error){
      if(error){
        return res.status(500).json({message: "Logout failed"});
      }else{
        return res.status(200).json({message: "Success"});
      }
    })
  }catch(error){
    return res.status(500).json({message: "Logout failed"});
  }
});

// End
module.exports = router;
