const express = require('express');
const router = express.Router();
const {Video} = require('../model/Video')
const {Subscribe} = require('../model/Subscribe')
const multer = require('multer')
const ffmpeg = require('fluent-ffmpeg');


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename:  (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4'){
            return cb(res.status(400).send('only mp4 is allowed'), false)
        }
        return cb(null, true)
    }
})

const upload = multer({ storage: storage }).single('file')

router.post('/uploadfiles', (req,res) => {
    upload(req, res, err => {
        
        if(err){
            return res.json({success:false, err})
        } 
        return res.json({success:true, url:res.req.file.path, fileName:res.req.file.filename})
    })
})

router.post('/thumbnail', (req,res) => {
    let filePath = ''
    let fileDuration = ''

    ffmpeg.ffprobe(req.body.url, (err, metadata) => {
        fileDuration = metadata.format.duration
    })

    ffmpeg(req.body.url)
    .on('filenames', function(filenames){
        filePath = 'uploads/thumbnail/' + filenames[0]
    })
    .on('end', function(){
        return res.json({
            success:true,
            url:filePath,
            fileDuration:fileDuration
        })
    })
    .on('error', function(err){
        return res.json({
            success:false,
            err
        })
    })
    .screenshots({
        count:1,
        filename:'thumbnail-%b.png',
        folder:'./uploads/thumbnail',
        size: '320x240'
    })
})

router.post('/uploadVideo', (req,res) => {
    const video = new Video(req.body)

    video.save((err,doc) => {
        if(err) return res.status(400).json({success:false, err})
        res.status(200).json({success:true})
    })
})

router.post('/getVideos', (req,res) => {
    Video.find().populate('writer').exec((err,videos) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({success:true, videos})
    })
})

router.post('/getVideoDetail', (req,res) => {
    Video.findOne({_id:req.body.videoId}).populate('writer').exec((err, video) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({success:true, video})
    })
})

router.post('/getSubscriptionVideos', (req,res) => {
    Subscribe.find({userFrom:req.body.userFrom}).exec((err, subscribeInfo) => {
        let writerUser = []
        subscribeInfo.map((subscribe, index) => {
            writerUser.push(subscribe.userTo)
        })

        Video.find({writer:{$in:writerUser}}).populate('writer').exec((err, videos) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({success:true, videos})
        })
    })
})
module.exports = router