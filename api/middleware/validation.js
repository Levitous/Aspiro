var db = require('../conf/database');

module.exports = {
    validateReg: async function(req,res,next){
        const {firstname, lastname, username, password, passconfirm ,email} = req.body;
        try{
            if(!/^[A-Za-z'-]{2,}$/.test(firstname)) return res.status(403).json({Error:"invalid first name"});
            if(!/^[A-Za-z'-]{2,}$/.test(lastname)) return res.status(403).json({Error:"invalid last name"});
            if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return res.status(403).json({Error:"invalid email"});
            if(!/^[A-Za-z][A-Za-z0-9]{4,}$/.test(username)) return res.status(403).json({Error:"invalid username"});
            if(!/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,255}$/.test(password)) return res.status(403).json({Error:"invalid password"});
            if(password !== passconfirm) return res.status(403).json({Error:"Passwords do not match"});
            next();
        }
        catch(error){
            next(error);
        }
    }
};
