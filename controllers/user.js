const user=require('../models/user');

module.exports.renderSignUpPage=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.addUser=async(req,res)=>{

        let {username,email,password}=req.body;
        let newUser=new user({email,username});
        let registerUser=await user.register(newUser,password);
        console.log(registerUser);
        req.login(registerUser,(err)=>{
            if(err){next(err);}
            req.flash("success","Welocome to WonderLust!")
            res.redirect("/listings");
        });
};

module.exports.renderLoginPage=(req,res)=>{
    res.render("users/login.ejs");
};


module.exports.addLogedInUser=async(req,res)=>{
    req.flash('success',"WELCOME BACK TO WONDERLUST!!")
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.userLoggedOut=(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");

    });
};