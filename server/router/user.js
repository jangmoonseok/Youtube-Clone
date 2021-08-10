const express = require('express');
const router = express.Router();
const { User } = require('../model/User');
const { auth } = require('../middleware/auth');



router.post('/register', (req,res) => {
    const user = new User(req.body)

    user.save((err,user) => {
        if(err) return res.status(400).json({success:false, err})
        res.status(200).json({success:true})
    })
})

router.post('/login', (req, res) => {
    User.findOne({email:req.body.email}).exec((err, user) => {
        if(err) return res.status(400).send(err)
        // email을 가진 유저가 없는경우
        if(!user) return res.json({
            loginSuccess:false,
            message: "Login failed, email not found"
        })
        // email을 가진 유저가 있으면 비밀번호 비교
        user.comparePassword(req.body.password , (err, isMatch) => {
            if(!isMatch) return res.json({ loginSuccess: false, message: "Wrong password" })

            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err)
                res.cookie('w_auth', user.token).status(200).json({
                    loginSuccess:true,
                    userId:user._id
                })
            })

        })

    })
})

router.get('/logout', auth ,(req,res) => {
    User.findOneAndUpdate({_id:req.user._id},{token:""}).exec((err,result) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({
            success:true
        })
    })
})

router.get('/auth', auth, (req,res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image,
    })
})
module.exports = router