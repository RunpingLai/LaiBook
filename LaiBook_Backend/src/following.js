// TODO /following	GET, PUT, DELETE
const Profile = require("./model").Profile
const {deleteModel} = require("mongoose");
const following = [
    {
        username: 'a',
        following: ['b','c']
    },
    {
        username: 'b',
        following: ['c', 'd']
    },
    {
        username: 'c',
        following: ['d', 'e', 'f']
    }
]

// GET /following/:user?
const getFollows = (req, res) => {
    const username = req.params.user ? req.params.user : req.username

    Profile.find({username: username}).exec(function(err, profile){
        if(!profile || profile.length === 0){
            res.status(400).send("Requested User is not Found")
            return
        }
        const profileObj = profile[0]
        res.status(200).send({username: username, following: profileObj.following})
    })
}

// PUT /following/:user
// TODO add ":user" to the following list for the logged in user
const putFollow = (req, res) => {
    const user = req.params.user
    const username = req.username
    if (!user) {
        res.status(400).send("You Didn't Say Who to Follow")
    }
    Profile.find({username: user}).exec(function(err, profile){
        if(!profile || profile.length === 0) {
            res.status(400).send('Requested User is not Found')
        } else {
            console.log("Found User")
            Profile.findOneAndUpdate({username: username}, { $addToSet: { following: user }}, {new: true}, function(err, profile){})
            Profile.find({username: username}).exec(function(err, profile){
                const profileObj = profile[0]
                res.status(200).send({username: username, following: profileObj.following})
            })
        }
    })
}

// DELETE /following/:user
// TODO remove ":user" to the following list for the logged in user
const delFollow = (req, res) => {
    const user = req.params.user
    const username = req.username
    if (!user) {
        res.status(400).send("You Didn't Say Who to UnFollow")
    }
    Profile.findOneAndUpdate({username: username}, { $pull: { following: user }}, {new: true }, function(err, profile){})
    Profile.find({username: username}).exec(function(err, profile){
        const profileObj = profile[0]
        res.status(200).send({username: username, following: profileObj.following})
    })
}

module.exports = (app) => {
    app.get('/following/:user?', getFollows)
    app.put('/following/:user', putFollow)
    app.delete('/following/:user', delFollow)
}