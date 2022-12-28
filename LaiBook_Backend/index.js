const auth = require('./src/auth');
const profile = require('./src/profile')
const articles = require('./src/articles')
const following = require('./src/following')
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const userSchema = require('./src/userSchema');
const User = mongoose.model('user', userSchema);
// const connectionString = 'mongodb+srv://Regan:RiceUniversity@cluster0.ke0lrfr.mongodb.net/?retryWrites=true&w=majority';
const connectionString = 'mongodb+srv://Regan:RiceUniversity@cluster0.ke0lrfr.mongodb.net/?retryWrites=true&w=majority';
const upCloud = require('./src/uploadCloudinary')
const cors = require('cors')



const enableCORS = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || "*")
    // res.header('Access-Control-Allow-Origin', "https://quixotic-guide.surge.sh")
    // res.header('Access-Control-Allow-Origin', "https://final-frontend-rl106.herokuapp.com")
    // res.header('Access-Control-Allow-Origin', "http://localhost:3001")
    // req.header('Access-Control-Allow-Origin', )
    res.header('Access-Control-Allow-Credentials',true)
    res.header('Access-Control-Allow-Headers','Authorization, Content-Type, Origin, X-Requested-With, Accept, X-Session-Id')
    res.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE')
    res.header('Access-Control-Expose-Headers', 'Location, X-Session-Id')
    if(req.method == 'OPTIONS'){
        res.status(200).send('OK')
    } else {
        next()
    }
}

// let articles = [{ id: 0, author: 'Mack', body: 'Post 1' },
//     { id: 1, author: 'Jack', body: 'Post 2' },
//     { id: 2, author: 'Zack', body: 'Post 3' }];
// let articles = 'hhh'

const hello = (req, res) => res.send({ hello: 'world' });

// const addUser = (req, res) => {
//     (async () => {
//         const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
//
//         const username = req.params.uname;
//         // TODO: add a user to the database
//         await (connector.then((res)=> {
//             let user = new User({
//                 username: username,
//                 created: Date.now()
//             });
//             user.save();
//         }));
//         res.send({name: username});
//         // process.exit(0);
//     })();
//
// };

// const getArticles = (req, res) => {
//     res.send(articles);
// }
//
// const getArticle = (req, res) => res.send(articles[req.params.id]);
//
// const addArticle = (req, res) => {
//     let post = req.body;
//     let article = {id: articles.length, author: post.author, body: post.body}
//     articles.push(article);
//     res.send(articles);
// }



const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(enableCORS);
// app.use(cors())
app.get('', hello)
app.get('/testHello', hello);
// app.post('/users/:uname', addUser);
auth(app);
profile(app);
articles(app);
following(app);
// app.get('/articles', getArticles);
// app.get('/articles/:id', getArticle);
// app.post('/article', addArticle);
upCloud.setup(app)

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    const addr = server.address();
    console.log(`Server listening at http://${addr.address}:${addr.port}`)
});