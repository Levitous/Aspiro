// Import Necessaries
var express = require("express");
var router = express.Router();
var db = require('../conf/database');

router.post("/athletes", async (req, res) => {
  const { searchTerm, sport, school } = req.body;
  let queryParts = [];
  let queryParams = [];

  if (searchTerm) {
      queryParts.push(`(Users.firstname LIKE CONCAT('%', ?, '%') OR Users.lastname LIKE CONCAT('%', ?, '%'))`);
      queryParams.push(searchTerm, searchTerm); 
  }
  if (sport) {
      queryParts.push("Sports.name = ?");
      queryParams.push(sport); 
  }
  if (school) {
      queryParts.push("Schools.name = ?");
      queryParams.push(school); 
  }

  let query = `SELECT Users.*, Sports.name AS sportName, Schools.name AS schoolName 
               FROM Athletes 
               INNER JOIN Users ON Athletes.fk_userEmail = Users.email 
               LEFT JOIN Sports ON Athletes.fk_sport = Sports.sportID 
               LEFT JOIN Schools ON Athletes.fk_school = Schools.schoolID`;

  if (queryParts.length > 0) {
      query += " WHERE " + queryParts.join(" AND ");
  }

  try {
      let [rows, fields] = await db.execute(query, queryParams);
      res.json({ results: rows });
  } catch (error) {
      console.error('Failed to fetch search results:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.post("/schoolsbysport", async (req, res) => {
  var { location, sport } = req.body;
  if(!location){location = ""}
  try {
      let [rows, _] = await db.execute(`
          SELECT 
          Schools.name, address, city, state, sportranking
          FROM Schools
          JOIN SchoolSportScores ON SchoolSportScores.fk_schoolID = Schools.schoolID
          JOIN Sports ON Sports.sportID = SchoolSportScores.fk_sportID
          WHERE Sports.name = ?
          AND LOCATE(?, Schools.state)
          ORDER BY SchoolSportScores.sportranking ASC;
          `, [sport, location]
      );
      if(rows.length === 0){
          res.status(404).json({ error: 'No schools found.' });
      }else{
          res.status(200).json({result: rows});
      }
  } catch (error) {
      console.error('Failed to fetch search results:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.post("/statesbysport", async (req, res) => {
    var { sport } = req.body;
    try {
        let [rows, _] = await db.execute(
            `SELECT state
             FROM Schools
             INNER JOIN SchoolSportScores
             ON Schools.schoolID = SchoolSportScores.fk_schoolID
             WHERE SchoolSportScores.fk_sportID = (
                SELECT sportID FROM Sports WHERE name = ?
             );`,
             [sport]
        );
        if(rows.length === 0){
            return res.status(404).json({message: 'No states for this sport found.' });
        }else{
            var results=[];
            for(var i=0;i<rows.length;i++){
                results.push(rows[i].state);
            }
            return res.status(200).json(results);
        }
    } catch (error) {
        console.error('Failed to fetch search results:', error);
        return res.status(500).json({message: 'Internal server error' });
    }
  });

router.post("/schools/:searchTerm", async (req, res) => {
  var {searchTerm} = req.params;
  searchTerm = searchTerm.replace(/%20/g, " ");
  if(searchTerm === "all"){
    searchTerm = "";
  }
  try {
      let [rows, fields] = await db.execute(
          `SELECT * FROM Schools
           WHERE NAME LIKE CONCAT('%', ?, '%')
           AND Schools.ranking > 0
           ORDER BY Schools.ranking ASC LIMIT 50;`,
           [searchTerm]
      );
      res.json({ result: rows });
  } catch (error) {
      console.error('Failed to fetch search results:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.post("/sports", async (req, res) => {
    const {searchterm} = req.body;
    try{
        let [rows, _] = await db.execute(
            `SELECT *
             FROM Sports
             WHERE
             LOCATE(?, Sports.name) > 0
             ORDER BY Sports.name;`,
             [searchterm]
        );
        if(rows.length === 0){
            res.status(404).json({ error: 'No such sports found.' });
        }else{
            res.status(200).json({result: rows});
        }
    }catch (error) {
        console.error('Failed to fetch search results:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

})

// End
module.exports = router;