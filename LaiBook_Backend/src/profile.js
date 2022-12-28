// this is profile.js which contains all user profile
// information except passwords which is in auth.js

// TODO
// /headline	PUT	profile.js
// /headline	GET	profile.js
// /email	GET, PUT	profile.js
// /dob	GET	profile.js
// /zipcode	GET, PUT	profile.js
// /avatar	GET	profile.js
// /avatar	PUT	profile.js

const Profile = require('./model').Profile
const upCloud = require('./uploadCloudinary')

const profile = {
    username: 'DLeebron',
    headline: 'This is my headline!',
    email: 'foo@bar.com',
    zipcode: 12345,
    dob: '128999122000',
    avatar: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/DWLeebron.jpg/220px-DWLeebron.jpg',
}

// TODO GET /headline/:user?
const getHeadline = (req, res) => {
    var username
    if (req.params.user) {
        username = req.params.user
    }
    else {
        username = req.username
    }

    Profile.find({username: username}).exec(function(err, profiles){
        if(!profiles || profiles.length === 0) {
            res.status(400).send("Didn't find this headline")
        }
        else {
            res.status(200).send({username:username, headline: profiles[0].headline})
        }
    })
}

// TODO PUT /headline
const putHeadline = (req, res) => {
    // var user = profile
    var username = req.username
    var newHeadline = req.body.headline
    Profile.updateOne({username: username}, {$set:{headline: newHeadline}}, function(err, profile){
        if(err){
            return console.log(err)
        }
        res.status(200).send({
            username: username,
            headline: newHeadline
        })
    })

    // user.headline = newHeadline
    // console.log(user)
    // res.send({ username: user["username"], headline: user["headline"]})
}

const getEmail = (req, res) => {
    var username
    if (req.params.user) {
        username = req.params.user
    }
    else {
        username = req.username
    }

    Profile.find({username: username}).exec(function(err, profiles){
        if(!profiles || profiles.length === 0) {
            res.status(400).send("Didn't find this user")
        }
        else {
            res.status(200).send({username:username, email: profiles[0].email})
        }
    })
}



const putEmail = (req, res) => {
    var username = req.username
    var newEmail = req.body.email
    Profile.updateOne({username: username}, {$set:{email: newEmail}}, function(err, profile){
        if(err){
            return console.log(err)
        }
        res.status(200).send({
            username: username,
            email: newEmail
        })
    })
}

const getPhone = (req, res) => {
    var username
    if (req.params.user) {
        username = req.params.user
    }
    else {
        username = req.username
    }

    Profile.find({username: username}).exec(function(err, profiles){
        if(!profiles || profiles.length === 0) {
            res.status(400).send("Didn't find this user")
        }
        else {
            res.status(200).send({username:username, phone: profiles[0].phone})
        }
    })
}

const putPhone = (req, res) => {
    var username = req.username
    var newPhone = req.body.phone
    Profile.updateOne({username: username}, {$set:{phone: newPhone}}, function(err, profile){
        if(err){
            return console.log(err)
        }
        res.status(200).send({
            username: username,
            phone: newPhone
        })
    })
}

const getZipcode = (req, res) => {
    var username
    if (req.params.user) {
        username = req.params.user
    }
    else {
        username = req.username
    }

    Profile.find({username: username}).exec(function(err, profiles){
        if(!profiles || profiles.length === 0) {
            res.status(400).send("Didn't find this user")
        }
        else {
            res.status(200).send({username:username, zipcode: profiles[0].zipcode})
        }
    })
}

const putZipcode = (req, res) => {
    var username = req.username
    var newZipcode = req.body.zipcode
    Profile.updateOne({username: username}, {$set:{zipcode: newZipcode}}, function(err, profile){
        if(err){
            return console.log(err)
        }
        res.status(200).send({
            username: username,
            zipcode: newZipcode
        })
    })
}

const getDob = (req, res) => {
    var username
    if (req.params.user) {
        username = req.params.user
    }
    else {
        username = req.username
    }

    Profile.find({username: username}).exec(function(err, profiles){
        if(!profiles || profiles.length === 0) {
            res.status(400).send("Didn't find this user")
        }
        else {
            res.status(200).send({username:username, dob: profiles[0].dob})
        }
    })
}

const getAvatar = (req, res) => {
    var username
    if (req.params.user) {
        username = req.params.user
    }
    else {
        username = req.username
    }
    Profile.find({username: username}).exec(function(err, profiles){
        if(!profiles || profiles.length === 0) {
            res.status(400).send("Didn't find this user")
        }
        else {
            res.status(200).send({username:username, avatar: profiles[0].avatar})
        }
    })
}

const putAvatar = (req, res) => {
    var newAvatar = req.fileurl
    var username = req.username
    Profile.updateOne({username: username}, {$set:{avatar: newAvatar}}, function(err, profile){
        if(err){
            return console.log(err)
        }
        res.status(200).send({
            result: "success",
            avatar: newAvatar
        })
    })
}


module.exports = (app) => {
    app.get('/headline/:user?', getHeadline)
    app.put('/headline/:user?', putHeadline)
    app.get('/email/:user?', getEmail)
    app.put('/email', putEmail)
    app.get('/dob', getDob)
    app.get('/phone/:user?', getPhone)
    app.put('/phone', putPhone)
    app.get('/zipcode/:user?', getZipcode)
    app.put('/zipcode', putZipcode)
    app.get('/avatar/:user?', getAvatar)
    app.put('/avatar', upCloud.parseFD("img"), putAvatar)
}