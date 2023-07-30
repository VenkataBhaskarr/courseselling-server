const jwt = require("jsonwebtoken")
const {User} = require("../db/index")
const ADMIN_SECRET = "s3cr3t"
const adminAuthentication = async (req,res,next) => {
    const bearer = req.headers.bearertoken
    if(bearer){
        jwt.verify(bearer, ADMIN_SECRET , (err,user) => {
            if(err){
                res.status(403).send("Authorization revoked")
            }else{
                req.user = user
                next()
            }
        })
    }else{
        res.status(403).send("Authorization revoked")
    }
}

module.exports = {
    adminAuthentication
}