const express = require('express');
const router = express.Router();
const {Subscribe} = require('../model/Subscribe')

router.post('/getSubscribeNumber', (req,res) => {
    Subscribe.find({userTo:req.body.userTo}).exec((err,subscribe) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({success:true, SubscribeNumber:subscribe.length})
    })
})

router.post('/subscribed', (req,res) => {
    Subscribe.find({userTo:req.body.userTo, userFrom:req.body.userFrom}).exec((err, subscribe) => {
        if(err) return res.status(400).send(err)
        let result = false
        if(subscribe.length !== 0){
            result = true
        }
        res.status(200).json({success:true, Subscribed:result})
    })
})

router.post('/subscribe', (req,res) => {
    const subscribe = new Subscribe(req.body)

    subscribe.save((err,doc) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({success:true})
    })
})

router.post('/unSubscribe', (req,res) => {
    Subscribe.findOneAndDelete({userTo:req.body.userTo, userFrom:req.body.userFrom}).exec((err,doc) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({success:true})
    })
})
module.exports = router