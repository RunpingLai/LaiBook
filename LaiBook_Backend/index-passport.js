
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
var userProfile

const corsOptions = {origin: 'http://localhost:3000', credentials: true};

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(session({
    secret: 'doNotGuessTheSecret',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
            // clientID: '123',
            clientID: '990960894820-hb40rt1kqsan5turc7mbb9qa6uf6316m.apps.googleusercontent.com',
            // clientSecret: '86e474e',
            clientSecret: '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',
            callbackURL: "http://localhost:3000/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            // let user = {
            //     /*'email': profile.emails[0].value,
            //     'name' : profile.name.givenName + ' ' + profile.name.familyName,
            //     'id'   : profile.id,*/
            //     'token': accessToken
            // };
            userProfile = profile
            // You can perform any necessary actions with your user at this point,
            // e.g. internal verification against a users table,
            // creating new user entries, etc.

            return done(null, userProfile);
            // User.findOrCreate(..., function(err, user) {
            //     if (err) { return done(err); }
            //     done(null, user);
            // });
        })
);
// Redirect the user to Google for authentication.  When complete,
// Google will redirect the user back to the application at
//     /auth/google/callback
app.get('/auth/google', passport.authenticate('google',{ scope: ['profile', 'email'] })); // could have a passport auth second arg {scope: 'email'}
// app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}))
// Google will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
const test = (req,res) => {
    console.log("333")
    res.send("shit")
    return
}
const error = (req,res) => {
    res.send("error logging in")
    return
}

const success = (req, res) => {
    res.send(userProfile)
    return
}

app.get('/main', test)
app.get('/auth/google/callback',
    // passport.authenticate('google', { successRedirect: 'http://localhost:3000/#/main',
    passport.authenticate('google', { successRedirect: '/success',
        failureRedirect: '/error' }));
app.get('/error', error);
app.get('/success', success);
//express endpoints would normally start here

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    const addr = server.address();
    console.log(`Server listening at http://${addr.address}:${addr.port}`)
});