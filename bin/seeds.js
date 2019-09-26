const mongoose = require('mongoose');
const User = require('../models/User');
const Feed = require('../models/Feed');
const Comment = require('../models/Comment');
const dbName = 'Jumblr';

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true})

