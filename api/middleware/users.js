var db = require('../conf/database');

module.exports = {
    getUserData: async function(req,res,next){
        const username = req.params.username;
        try{
            let [rows, _ ] = await db.execute(
                `SELECT (firstname, lastname, email, aboutuser, profilePhoto, type)
                FROM Users
                WHERE (username) = (?);`,
                [username]
            );
            res.locals.userdata = rows[0];
            next();
        }catch(error){
            next(error);
        }
    }
};
