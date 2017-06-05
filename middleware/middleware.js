

exports.isLoggedIn = function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You must be signed in to do that!");
        res.redirect(host+"/login");
    }
exports.havePermission = function(req, res, next){
        if(env == 'dev')
            return next();
        if(req.url.indexOf("login")!=-1
        // ||req.url.indexOf("register")!=-1
        )
            return next();
        if(req.user.isAdmin == true){
            return next();
        }
        req.flash("error", "you have not permission!");
        res.redirect(host);
    }