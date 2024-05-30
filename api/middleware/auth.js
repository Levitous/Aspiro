var db = require('../conf/database');

module.exports = {
    isLoggedIn: function(req,res,next){
        if(req.session.user){
            res.locals.isLoggedIn = true,
            res.locals.user = req.session.user
        }else{
            res.locals.isLoggedIn = false;
            res.locals.user = null;
        }
        next();
    },
    isMyProfile: function(req,res,next){
        const { username } = req.params;
        if(res.locals.isLoggedIn){
            var profileUser = username;
            var currentUser = req.session.user.username;
            if(profileUser == currentUser){
                res.locals.isMyProfile = true;
            }else{
                res.locals.isMyProfile = false;
            }
    }else{
        res.locals.isMyProfile = false;
    }
    next();
    }
}