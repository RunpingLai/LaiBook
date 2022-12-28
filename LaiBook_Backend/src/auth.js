const md5 = require("md5");
let sessionUser = {};
let cookieKey = "sid";
// const callbackURL = 'http://localhost:3000/auth/callback'
// const callbackURL = 'https://stark-ridge-57925.herokuapp.com/auth/callback'
// const clientSecret = "9d0cd69d1e8167e68307248e3e79b5e9"
// const clientID = "661028574071891"
const session = require('express-session')
// const config = {clientSecret, clientID, callbackURL}
const User = require('./model').User
const Profile = require('./model').Profile
const Comment = require('./model').Comment
const Article = require('./model').Article
// const apiUrl = "https://final-backend-rl106.herokuapp.com"
// const corsOptions = {origin: 'https://final-backend-rl106.herokuapp.com', credentials: true};
var loggedInUser
const FRONTEND_URL = "http://localhost:3000"
// const FRONTEND_URL = "https://final-frontend-rl106.herokuapp.com"
const GOOGLE_JPG = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png"


const passport = require('passport')
const cors = require("cors");
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
let originHostUrl = ""

const configGoogleAuth = {
    clientID:'990960894820-hb40rt1kqsan5turc7mbb9qa6uf6316m.apps.googleusercontent.com',
    clientSecret:'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',
    // callbackURL: 'http://shrouded-citadel-55552.herokuapp.com/auth/google/callback',
    callbackURL: 'https://final-backend-rl106.herokuapp.com/auth/google/callback'
    // passReqToCallback: true
}

passport.use(new GoogleStrategy(configGoogleAuth,
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            return done(null, profile)
        })
        // userProfile = profile
        // return done(null, userProfile)
        }
    )
)

const ggLogin = (req, res) => {
    const userProfile = req.user
    const ggId = userProfile.id
    const ggDisplayname = userProfile.displayName
    const ggUsername = ggId + '@' + userProfile.provider
    const ggUserEmail = userProfile.emails? userProfile.emails[0] : ''
    User.find({username: ggUsername}).exec(function(err, user){
        if(!user || user.length === 0) {
            var salt = ggUsername + new Date().getTime();
            var hash = md5(ggUsername)
            var newUser = new User({username: ggUsername, salt:salt, hash: hash, auth:[]})
            newUser.save(function(err, user) {
                if(err) {
                    return console.log(err)
                }
            })
            var newProfile = new Profile({
                username: ggUsername,
                headline: "I'm from google oauth",
                following: [],
                phone: "0000000000",
                email: ggUserEmail.value,
                dob: "1980-01-01",
                zipcode: "00000",
                avatar: GOOGLE_JPG
            })
            newProfile.save(function (err, profile) {
                if(err) {
                    return console.log(err)
                }
            })
            // res.redirect(`${FRONTEND_URL}/main/${ggUsername}`)
            generateCookie(ggUsername, res)
        }
        else {
            // res.redirect(`${FRONTEND_URL}/main/${ggUsername}`)
            generateCookie(ggUsername, res)
        }
    })
    // res.redirect(`http://localhost:3001/main/${userProfile.displayName}`)
    return
}


function generateCookie(ggUsername, res) {
    var sessionKey = md5(ggUsername)
    console.log("generating"+sessionKey)
    sessionUser[sessionKey] = ggUsername
    res.cookie(cookieKey, sessionKey,
        {maxAge: 1800*1000, httpOnly:true, sameSite:'none', secure:true})
    res.cookie("shit", "SHIT", {maxAge: 1800*1000, httpOnly:true, sameSite:'none', secure:true})
    res.redirect(`${FRONTEND_URL}/main/${ggUsername}`)
    // res.cookie(cookieKey, sessionKey,
    //     {maxAge: 1800*1000, httpOnly:true})
    return
}


const ggFail = (req, res) => {
    res.redirect(FRONTEND_URL)
    return
}

passport.serializeUser(function(user, done){
    done(null, user)
})

passport.deserializeUser(function(user,done){
    // User.findOne({authId: id}).exec(function(err, user) {
    //     done(null, user)
    done(null, user)
    // })
})

//use merge to link all
const merge = (req, res) => {
    const username = req.body.regUsername;
    const password = req.body.regPassword;
    if (!username || !password) {
        res.status(400).send("username or password is missing")
        return
    }
    User.find({username: username}).exec(function(err, users){
        if (!users || users.length === 0){
            res.sendStatus(400)
            return
        }
        const userObj = users[0]
        if(!userObj){
            res.status(400).send("Don't have this user in db")
            return
        }
        const salt = userObj.salt;
        const hash = userObj.hash;

        if(md5(salt + password) === hash){
            //third party username
            Article.update({author:req.username}, { $set: { 'author': username}}, { new: true, multi: true}, function(){})
            Article.update({'comments.author' : req.username}, { $set: {'comments.$.author': username}}, { new: true, multi: true }, function(){})
            Comment.update({author:req.username}, { $set: { 'author': username}}, { new: true, multi: true }, function(){})
            Profile.findOne({username: req.username}).exec(function(err, profile){
                if(profile){
                    const oldFollowingArr = profile.following
                    Profile.findOne({username: username}).exec(function(err, newProfile) {
                        if(newProfile){
                            //concat
                            const newFollowingArr = newProfile.following.concat(oldFollowingArr)
                            Profile.update({username: username}, {$set: {'following': newFollowingArr}}, function(){})
                        }
                    })
                    //delete the profile record
                    Profile.update({username: req.username}, {$set: {'following':[]}}, function(){})
                }
            })
            User.findOne({username: username}).exec(function(err, user){
                if(user){
                    const usrArr = req.username.split('@');
                    const authObj = {}
                    authObj[`${usrArr[1]}`] = usrArr[0]
                    User.update({username: username}, {$addToSet: {'auth': authObj}}, {new: true}, function(){})
                }
            })
            res.status(200).send({ username: username, result: 'success'})
            return
        } else{
            res.status(401).send("incorrect password!")
            return
        }
    })
}

const unlink = (req, res) => {
    const username = req.username
    const company = req.body.company
    User.findOne({username: username}).exec(function(err, user){
        if(user.auth.length !== 0){
            User.findOne({username: username}).exec(function(err,user){
                let authArr = user.auth
                authArr = authArr.filter(function (obj) {
                    return Object.keys(obj)[0] !== company;
                })
                User.update({username: username}, {$set: {'auth': authArr}}, {new: true}, function(){})
                console.log("successfully unlinked")
                res.status(200).send({result: 'successfully unlink ' + company})
            })
        } else {
            res.status(400).send("no link account")
        }
    })
}

let userObjs = {};
var testUser = {
    name: "testUser",
    password: "123",
    headline: "TestUser Headline is here"
}


// Now we can update the isLoggedIn middleware to grab the cookie from the request (if it exists),
// and lookup in sessionUser the corresponding user, adding it to the request object for the down
// stream endpoints. If there is none,or the cookie did not exist, then the user is not logged in
// and we should respond with a 401 Unauthorized.
//
// When a user logs out, remove their sessionKey from the sessionUser  map and clear / delete the
// cookie in the response object.
function isLoggedIn(req, res, next) {
    // likely didn't install cookie parser
    // console.log(req.cookies[cookieKey])
    if (!req.cookies) {
        console.log("no cookies")
        return res.sendStatus(401);
    }
    console.log("111")
    console.log(req.cookies)
    console.log("111")
    let sid = req.cookies[cookieKey];
    console.log("Sid "+sid)
    // no sid for cookie key
    if (!sid) {
        console.log("no sid")
        return res.sendStatus(401);
    }

    console.log(sessionUser)
    let username = sessionUser[sid];

    // no username mapped to sid
    if (username) {
        req.username = username;
        next();
    } else {
        console.log("no username")
        return res.sendStatus(401)
    }
}

function login(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }
    User.find({username: username}).exec(function(err, user){
        if(err){
            return console.log(err)
        }
        else{
            if(!user || user.length === 0){
                res.status(401).send({result: 'User not registered'})
                return
            }
            var userObj = user[0]
            var hash = md5(userObj.salt + password)
            if (hash != userObj.hash){
                console.log("didn't find this hash")
                res.status(401).send({result: 'Unauthorized User'})
                return
            }
            loggedInUser = username
            var sessionKey = md5(userObj.username)
            sessionUser[sessionKey] = username
            res.cookie(cookieKey, sessionKey,
                {maxAge: 1800*1000, httpOnly: true, sameSite: 'none', secure: true})
            var msg = { username: username, result: 'success'}
            res.send(msg)
        }
    })
}

function logout(req, res) {
    delete sessionUser[req.cookies[cookieKey]]
    res.clearCookie(cookieKey)
    console.log(sessionUser)
    let msg = {result: 'logout success'}
    res.status(200).send(msg)
    return
}

function register(req, res) {
    // console.log("Registering, Backend")
    // console.log(req.body)
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var dob = req.body.dob;
    var zipcode = req.body.zipcode;
    var phone = req.body.phone;

    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }
    User.find({username: username}).exec(function (err, users) {
        if (err) {
            return console.log(err)
        }
        var usersLength = users.length;
        if (usersLength !== 0) {
            res.status(400).send({
                result: "failed",
                comment: `Username: ${username} has already been registered`
            })
            return
        }
        else{
            let salt = username + new Date().getTime();
            // let hash = 0 // TODO: Change this to use md5 to create a hash
            let hash = md5(salt + password);



            var newUser = new User({username: username, salt: salt, hash: hash, auth:[]})
            newUser.save(function (err, user) {
                if(err) {
                    return console.log(err)
                }
            })

            var newProfile = new Profile({
                username: username,
                headline: "default headline",
                email: email,
                zipcode: zipcode,
                dob: dob,
                phone: phone,
                following: [],
                avatar: "https://www.thesprucepets.com/thmb/UlqV5bn8o9orBDPqwC0pvn-PX4o=/941x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-145577979-d97e955b5d8043fd96747447451f78b7.jpg",
            })
            newProfile.save(function (err, profile) {
                if(err){
                    return console.log(err)
                }
            })

            // userObjs[username] =  {password: password, salt: salt, hash: hash} // TODO: Change this to store object with username, salt, hash

            loggedInUser = username
            var sessionKey = md5(username)
            sessionUser[sessionKey] = username
            res.cookie(cookieKey, sessionKey,
                {maxAge: 1800*1000, httpOnly: true, sameSite: 'none', secure: true})

            let msg = {username: username, result: 'success'};
            res.send(msg);
        }
    })

}

const putPassword = (req, res) => {
    const newPassword = req.body.password;
    const username = req.username;
    if (!newPassword) {
        res.status(400).send("newPassword is missing")
        return
    }
    User.find({username: username}).exec(function(err, users){
        const userObj = users[0]
        const oldSalt = userObj.salt;
        const oldHash = userObj.hash;
        if(md5(oldSalt + newPassword) === oldHash){
            res.status(400).send({username: username, status: 'you have used the same password'})
        }
        else{
            const newSalt = md5(username)
            const newHash = md5(newSalt + newPassword)
            User.update({username: username}, { $set: { salt: newSalt, hash: newHash }}, { new: true }, function(err, profile){
                if(err) return console.log(err)
                res.status(200).send({username: username, status: 'successfully change the password and you can logout to check'})
            })
        }
    })
}

const successFun = (req,res) => {
    console.log("333")
    res.redirect(originHostUrl)
}

const errorFun = (err,req,res,next) => {
    if(err) {
        res.status(400);
        res.send({err: err.message});
    }
}

const locationFun = (req, res, next) => {
    if(originHostUrl === ''){
        originHostUrl = req.headers.referer
    }
    next()
}

module.exports = (app) => {
    app.use(locationFun)
    // app.use(cors(corsOptions));
    app.use(session({secret:'doNotGuessTheSecret', resave: false, saveUninitialized: true}))
    app.use(passport.initialize())
    app.use(passport.session())
    app.get('/auth/google', passport.authenticate('google', {scope:['profile', 'email']}))
    app.get('/auth/google/callback',
        passport.authenticate('google', {successRedirect: "/ggLogin",
            failureRedirect:'/ggFail'}))
    app.get("/ggLogin", ggLogin)
    app.get("/ggFail", ggFail)
    app.post('/login', login);
    app.post('/register', register);
    app.use(isLoggedIn);

    app.use('/link/google', passport.authorize('google', {scope:'email'}))

    app.post('/unlink', unlink)
    app.post('/merge', merge)
    app.put('/logout', isLoggedIn, logout);
    app.put('/password', putPassword)
}
