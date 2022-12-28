// Backend: GET /articles returns articles for logged in user
// Backend: POST /article returns an array of articles with newly added article
// Backend: implement GET /articles and GET /articles/:id as one endpoint not two
const upCloud = require('./uploadCloudinary')
const Article = require('./model').Article
const Profile = require('./model').Profile

let articles = [{ id: 0, author: 'Mack', body: 'Post 1' },
    { id: 1, author: 'Jack', body: 'Post 2' },
    { id: 2, author: 'Zack', body: 'Post 3' }];

// TODO GET /articles & GET /articles/:id
// const getArticles = (req, res) => {
//     if (req.params.id) {
//         // res.send(articles[req.params.id])
//         Article.find({_id: req.params.id}).exec(function (err, articles) {
//             if (!articles||articles.length == 0) {
//                 Article.find({author: req.params.id}).exec(function (err, articlesByAuthor){
//                     if(!articlesByAuthor||articlesByAuthor.length == 0) {
//                         res.json({result: 'Unable to get articles'})
//                         return
//                     }
//                     res.status(200).send({articles: articlesByAuthor})
//                 })
//             }
//             else res.status(200).send({articles: articles})
//         })
//     }
//     else{
//         // res.status(200).send({articles: ["123","321"]})
//         Profile.find({username: req.username}).exec(function(err, profile){
//             const profileObj = profile[0]
//             const userToQuery = [req.username, ...profileObj.following]
//             Article.find({author: {$in: userToQuery}}).limit(10).sort('-date').exec(function (err, feeds) {
//                 if(err){
//                     console.log(err)
//                 }
//                 res.status(200).send({articles: feeds})
//
//             })
//         })
//         // res.send(articles)
//     }
// }
const getArticles = (req, res) => {
    if(req.params.id) {
        Article.find(ObjectId(req.params.id)).exec(function(err, articles){
            if (!articles || articles.length === 0){
                User.findOne(ObjectId(req.params.id)).exec(function(err, user) {
                    if(!user || user.length === 0){
                        res.status(401).send("Don't have this article ID or user ID")
                    } else {
                        Article.find({author: user.username}).exec(function(err, articles){
                            res.status(200).send({articles: articles})
                            return
                        })
                    }
                })
            } else {
                const articlesObj = articles[0]
                res.status(200).send({articles: articlesObj})
            }
        })}
    else{
        // Article.find({}).exec(function(err, articles){
        // res.status(200).send({articles: articles})
        const username = req.username;
        Profile.find({username: username}).exec(function(err, profile){
            const profileObj = profile[0]
            const usersToQuery = [username, ...profileObj.following]
            Article.find({author: {$in: usersToQuery}}).sort('-date').exec(function(err, articles){
                res.status(200).send({articles: articles})
            })
        })
    }
}


// POST /article
const addArticle = (req, res) => {
    const articleObj = new Article({
        author: req.username,
        text: req.content,
        img: req.fileurl,
        date: new Date(),
        comments: []
    })
    console.log(req.fileurl)
    console.log(req.file)

    articleObj.save(function(err, article) {
        if(err){
            return console.log(err)
        }
        else{
            res.status(200).send({result: "success", articles: [article]})
        }
    })
}
// const addArticle = (req, res) => {
//     const articleObj = new Article({text: req.content, author: req.username, img:req.fileurl, date:new Date(), comments:[]})
//     new Article(articleObj).save(function (err, articles){
//         if(err) return console.log(err)
//         res.status(200).send({articles: [articles]})
//     })
// }


// PUT /article/:id
// payload {text: message, commentId: optional}
// const putArticle = (req, res) => {
//     if (req.params.id > articles.length || req.params.id < 0) {
//         res.status(401).send("Invalid ID, no such article ID")
//         return
//     }
//     var articleID = req.params.id
//     var newAuthor = req.body.author
//     var newBody = req.body.text
//     articles[articleID].author = newAuthor
//     articles[articleID].body = newBody
//     res.send(articles)
// }
const putArticle = (req, res) => {
    if (!req.params.id) {
        res.status(400).send('invalid ID!')
    } else {
        Article.find(ObjectId(req.params.id)).exec(function(err, articles){
            if (!articles || articles.length === 0) {
                res.status(401).send("Don't have this article ID")
                return
            } else if(req.body.commentId === "-1") {
                //add comment
                const commentId = md5(req.username + new Date().getTime())
                const commentObj = new Comment({commentId: commentId, author: req.username, date: new Date(), text: req.body.text})
                new Comment(commentObj).save(function (err, comments){
                    if(err) return console.log(err)
                })
                Article.findByIdAndUpdate(req.params.id, { $addToSet: {comments: commentObj}}, {upsert: true, new: true},  function(err, articles){})
                Article.find(ObjectId(req.params.id)).exec(function(err, articles){
                    res.status(200).send({articles: articles})
                })
            } else if(req.body.commentId){
                //update comment
                Comment.find({commentId: req.body.commentId}).exec(function(err, comments){
                    if (!comments || comments.length === 0) {
                        res.status(401).send("Don't have this comment ID")
                        return
                    }else if(comments[0].author !== req.username) {
                        res.status(401).send("you don't own this comment")
                        return
                    }else {
                        Comment.update({commentId: req.body.commentId}, { $set: { text: req.body.text }}, { new: true }, function(err, comments){})
                        Article.update({_id: req.params.id, 'comments.commentId': req.body.commentId}, { $set: { 'comments.$.text': req.body.text }}, { new: true }, function(err, articles){})
                        Article.find(ObjectId(req.params.id)).exec(function(err, articles){
                            res.status(200).send({articles: articles})
                        })
                    }
                })
            } else{
                if (articles[0].author !== req.username) {
                    //forbidden if this user dosen't own this article
                    res.status(401).send("you don't own this article")
                    return
                }
                //update articles
                Article.findByIdAndUpdate(req.params.id, { $set: { text: req.body.text }}, { new: true }, function(err, articles){
                    res.status(200).send({articles: articles});
                })
            }
        })

    }
}


module.exports = (app) => {
    app.post('/article', upCloud.parseFD("img"), addArticle)
    app.get('/articles/:id?', getArticles)
    app.put('/article/:id', putArticle)
}

