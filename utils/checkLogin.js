const remove_password = require("./remove_password");

module.exports=(req,res)=>{
    const currentUser = req.user ? remove_password(req.user) : undefined;
    
    const token = req.cookies.session_token;
    const isLoggedIn = !!token;
    
    return{
        currentUser,
        status:'success',
        login:isLoggedIn
    }
}