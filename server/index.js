const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./configs/key');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(config.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

app.use('/api/user', require('./router/user') )
app.use('/api/video', require('./router/video') )
app.use('/api/subscribe', require('./router/subscribe') )
app.use('/api/comment', require('./router/comment') )
app.use('/api/like', require('./router/like') )




app.use('/uploads', express.static('uploads'));



const port = process.env.PORT || 5000
app.listen(port, function(){
    console.log(`Server Listening on ${port}`)
})
