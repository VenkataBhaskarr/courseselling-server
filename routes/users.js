const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const {User, Course} = require("../db/index")
const {userAuthentication} = require("../middleware/userAuth");

router.post('/signup', async (req, res) => {
    const {username , password} = req.body
    const user = await User.findOne(username)
    if(user){
        res.status(201).send("user already exists")
    }else{
        const newUser = new User({ username : username, password : password });
        await newUser.save();
        const token = jwt.sign({
            username : username,
            password : password
        },"s3cr3t")
        res.json({ message: 'User created successfully', token });
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body
    const user = await User.findOne({username : username , password : password})
    if(user){
        const token = jwt.sign({
            username : username,
            password : password
        },"s3cr3t");
        return res.json({ message: 'Logged in successfully', token });
    }else{
        return res.send("user not esisted please signup")
    }
});

router.get('/courses', userAuthentication, async (req, res) => {
    const courses = await Course.find({published :true})
    res.json({courses})
});

router.post('/courses/:courseId', userAuthentication, async (req, res) => {
    const id = req.params.courseId
    const course = await Course.findById({_id : id});
    console.log(course);
    if (course) {
        const user = await User.findOne({ username: req.user.username });
        if (user) {
            user.purchasedCourses.push(course);
            await user.save();
            res.json({ message: 'Course purchased successfully' });
        } else {
            res.status(403).json({ message: 'User not found' });
        }
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
});

router.get('/purchasedCourses', userAuthentication, async (req, res) => {
    const purchased = await Course.findOne({username : req.user.username}).populate('purchasedCourses')
    if(purchased){
        res.json({purchasedCourses : purchased.purchasedCourses || []})
    }
    else{
        res.send("no courses available")
    }
});

module.exports = router