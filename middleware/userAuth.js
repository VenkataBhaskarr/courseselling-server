const jwt = require("jsonwebtoken")
const USER_SECRET = "s3cr3t"
const userAuthentication = (req,res,next) => {
    const bearer = req.headers.bearertoken
    if(bearer){
        jwt.verify(bearer, USER_SECRET, (err , user) => {
            if(err){
                return res.status(403).send("auth revoked")
            }else{
                req.user = user
                next()
            }
        })
    }else{
        return res.status(403).send("auth revoked")
    }
}

module.exports = {
    userAuthentication
}