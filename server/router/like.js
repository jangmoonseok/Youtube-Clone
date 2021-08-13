const express = require('express');
const router = express.Router();
const {Like} = require('../model/Like')
const {DisLike} = require('../model/DisLike')


router.post('/upLike', (req,res) => {
    let variable = {}

    if(req.body.videoId){
        variable={
            userId:req.body.userId,
            videoId:req.body.videoId
        }
    }else{
        variable={
            userId:req.body.userId,
            commentId:req.body.commentId
        }
    }
    const like = new Like(variable)
    like.save((err,likeResult) => {
        if(err) return res.status(400).json({success:false, err})
        DisLike.findOneAndDelete(variable).exec((err, dislikeResult) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({success:true})
        })
    })
})

router.post('/unLike', (req,res) => {
    let variable = {}

    if(req.body.videoId){
        variable={
            userId:req.body.userId,
            videoId:req.body.videoId
        }
    }else{
        variable={
            userId:req.body.userId,
            commentId:req.body.commentId
        }
    }

    Like.findOneAndDelete(variable).exec((err,result) => {
        if(err) return res.status(400).json({success:false, err})
        res.status(200).json({success:true})
    })
})

router.post('/upDislike', (req,res) => {
    let variable = {}

    if(req.body.videoId){
        variable={
            userId:req.body.userId,
            videoId:req.body.videoId
        }
    }else{
        variable={
            userId:req.body.userId,
            commentId:req.body.commentId
        }
    }
    const disLike = new DisLike(variable)
    disLike.save((err,disLike) => {
        if(err) return res.status(400).json({success:false, err})
        Like.findOneAndDelete(variable).exec((err, likeResult) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({success:true})
        })
    })
})

router.post('/unDisLike', (req,res) => {
    let variable = {}

    if(req.body.videoId){
        variable={
            userId:req.body.userId,
            videoId:req.body.videoId
        }
    }else{
        variable={
            userId:req.body.userId,
            commentId:req.body.commentId
        }
    }

    DisLike.findOneAndDelete(variable).exec((err,result) => {
        if(err) return res.status(400).json({success:false, err})
        res.status(200).json({success:true})
    })
})

router.post('/getLikes', (req,res) => {
    let variable = {}

    if(req.body.videoId){
        variable={
            videoId:req.body.videoId
        }
    }else{
        variable={
            commentId:req.body.commentId
        }
    }

    Like.find(variable).exec((err, likes) => {
        if(err) return res.status(400).json({success:false, err})
        res.status(200).json({success:true, likes})
    })
})

router.post('/getDisLikes', (req,res) => {
    let variable = {}

    if(req.body.videoId){
        variable={
            videoId:req.body.videoId
        }
    }else{
        variable={
            commentId:req.body.commentId
        }
    }

    DisLike.find(variable).exec((err, disLikes) => {
        if(err) return res.status(400).json({success:false, err})
        res.status(200).json({success:true, disLikes})
    })
})
module.exports = router