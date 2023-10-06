const express = require("express")
const router = express.Router()
const {Admin, Course} = require("../db/index")
const jwt = require("jsonwebtoken")
const {adminAuthentication} = require("../middleware/adminAuth.js")


router.post('/signup',async (req, res) => {
    const {username , password} = req.body
    console.log(username)
    const admin = await Admin.findOne({
        username : username,
        password : password
    })
    if(admin){
        return res.status(201).send("Admin already exists")
    }else{
        const newAdmin = new Admin({username: username,password: password})

        await newAdmin.save()
        const token = jwt.sign({
            username : username,
            password : password
        },"s3cr3t")
        res.json({ message: 'User created successfully', token });
    }
});

router.post('/login',adminAuthentication, (req, res) => {
    const {username ,password} = req.body
    const admin = Admin.findOne({username : username,password:password})
    if(admin){
        const token = jwt.sign({
            username : username,
            password : password
        },"s3cr3t")
        return res.json({"messsage" : "logged in successfully" , token})
    }else{
        return res.send("admin does'nt exist please get back later")
    }
});

router.post('/courses',adminAuthentication, async (req, res) => {
    const {title,description,price,published} = req.body
    const course = new Course({
        title : title,
        description : description,
        price : price,
        published : published
    })
    await course.save()
    res.send("course created successfully")
});

router.put('/courses/:courseId',adminAuthentication, async (req, res) => {
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    if (course) {
        res.json({ message: 'Course updated successfully' });
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
});

router.get('/courses',adminAuthentication, async (req, res) => {
    const courseIds = req.user.pid;
    const courses = await Course.find({_id : {$in : courseIds});
    res.json({ courses });
});

module.exports = router
