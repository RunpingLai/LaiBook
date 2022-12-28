var mongoose = require('mongoose')
require('./db')
const {mongo} = require("mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    salt: String,
    hash: String,
    auth: [],
    authId: String
})

var profileSchema = new mongoose.Schema({
    username: String,
    headline: String,
    following: [ String ],
    phone: String,
    email: String,
    dob: String,
    zipcode: String,
    avatar: String
})

var commentSchema = new mongoose.Schema({
    commentId: String,
    date: Date,
    text: String,
    avatar: String,
    commentAuthor: String
})

var articleSchema = new mongoose.Schema({
    pid: Number,
    author: String,
    text: String,
    img: String,
    date: Date,
    comments: [ commentSchema ]
})

exports.User = mongoose.model('users', userSchema)
exports.Profile = mongoose.model('profiles', profileSchema)
exports.Comment = mongoose.model('comments', commentSchema)
exports.Article = mongoose.model('articles', articleSchema)