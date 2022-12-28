import React from "react";
import {Link, Outlet} from "react-router-dom";
import {users, posts} from "../data";
import '../styleSheets.css'
import {logout, getArticles, getHeadline, putHeadline, getFollows, findUser, delFollow, getAvatar} from "../actions";
import uuid from 'react-uuid';

const imgSrc = "https://www.thesprucepets.com/thmb/UlqV5bn8o9orBDPqwC0pvn-PX4o=/941x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-145577979-d97e955b5d8043fd96747447451f78b7.jpg"

const apiUrl = "http://localhost:3000"
// const apiUrl = "https://final-backend-rl106.herokuapp.com"
export default class Main extends React.Component {
    constructor() {
        super();
        const userName = window.location.href.split("/")[4];

        this.handleStatusUpdate = this.handleStatusUpdate.bind(this);



        let userInfo = users.filter(function (value, index, arr) {
            return value.username === userName;
        })[0];
        var userStatus;
        if (userInfo) {
            // var userStatus;
            if (JSON.parse(window.localStorage.getItem(JSON.stringify(userName)))) {
                console.log(JSON.parse(window.localStorage.getItem(JSON.stringify(userName))));
                userStatus = JSON.parse(window.localStorage.getItem(JSON.stringify(userName))).userStatus_localStorage;
            }
            else {
                userStatus = userInfo.company.catchPhrase;
            }

            let userId = userInfo.id;
            this.state = {userId: userId, userName: userName, userStatus: userStatus, userStatusDraft: userStatus, avatar:""};
        } else {
            // var userStatus;
            if (JSON.parse(window.localStorage.getItem(JSON.stringify(userName)))) {
                userStatus = JSON.parse(window.localStorage.getItem(JSON.stringify(userName))).userStatus_localStorage;
            }
            else {
                userStatus = "I'm ok";
            }

            let userId = 100;
            this.state = {userId: userId, userName: userName, userStatus: userStatus, userStatusDraft: userStatus, avatar:""};
        }
    }

    async componentDidMount() {
        let headline = await getHeadline(this.state.userName)
        let avatar = await getAvatar(this.state.userName)
        this.setState({userStatus: headline, avatar: avatar})
    }

    async handleStatusUpdate(e) {
        await putHeadline(this.state.userName, this.state.userStatusDraft)
        this.setState({userStatus: this.state.userStatusDraft});
        // window.localStorage.setItem(JSON.stringify(this.state.userName), JSON.stringify({userStatus_localStorage: this.state.userStatusDraft}));

    }

    render() {
        return (
            <>

                <Link to={`/profile/${this.state.userName}`}>Go to Profile Page</Link>
                <br />
                <Link to="/" id={"logout"} onClick={logout}>Log Out</Link><br />
                <br />
                <h2>Personal Info</h2>
                <img className="mid" alt={"imgSrc didn't give me a pic!"} src={this.state.avatar} height={"20%"} width={"20%"} /><br />
                <span>{this.state.userName}</span><br />
                <span className="mid">{this.state.userStatus}</span>
                <textarea className="mid" defaultValue={this.state.userStatus} onChange={event => this.setState({userStatusDraft: event.target.value})}></textarea>
                {/*<button onClick={event => {this.setState({userStatus:this.state.userStatusDraft})}}>Update Your Status</button>*/}
                <button onClick={this.handleStatusUpdate}>Update Your Status</button>
                {/*<Follows userId={this.state.userId} />*/}
                <Outlet />
            </>
        )
    }

}

export class Posts extends React.Component {
    constructor(props) {
        super(props);
        const userName = window.location.href.split("/")[4];
        this.handleHideShowComment = this.handleHideShowComment.bind(this);
        this.handleAddPost = this.handleAddPost.bind(this);
        this.follow2post_func = this.follow2post_func.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        // this.load = this.load.bind(this);
        this.state = {userName: userName, page: 0};

        const userInfo = users.filter(
            function (user) {
                return user.username === userName;
            }
        );
        // const Barticles = getArticles()
        // console.log(Barticles.length)

        if (userInfo.length === 0) {
            this.state = {displayPosts: [], userId: 100, posts:[], backupposts:[], page:0};
        }
        else {
            let userId = userInfo[0].id;
            let heAndhisFollowsIds = [userId, (userId + 1) % 10, (userId + 2) % 10, (userId + 3) % 10];
            this.state = {displayPosts: [], userId: userId, posts: getPostsByUserIds(heAndhisFollowsIds), backupposts: getPostsByUserIds(heAndhisFollowsIds), hiddenstate: false, page:0};
        }
        // this.load()
        // this.state = {posts: getPostsByUsername(userName), backupposts: getPostsByUsername(userName)};
    }

    async componentDidMount() {
        const Barticles = await getArticles()
        // var displayPosts = []
        // for(let i=this.state.page; i<this.state.page+10; i++) {
        //     displayPosts.unshift(Barticles[i])
        // }
        this.setState({displayPosts: [...Barticles], posts: Barticles, backupposts: Barticles, page:0})
    }

    // async load() {
    //     const Barticles = await getArticles()
    //     this.setState({posts: Barticles})
    // }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.posts !== this.state.posts) {
            this.setState({page:0})
            var displayPosts = []
            for(let i=(this.state.page) * 10; i<this.state.posts.length; i++) {
                if(i - (this.state.page) * 10 == 10) break
                displayPosts.push(this.state.posts[i])
            }
            if (displayPosts.length !== 0) {
                this.setState({displayPosts: displayPosts})
            }
        }
    }

    // for search box
    handleSearchByText = searchText => {
        // console.log(searchText);
        let allposts = this.state.backupposts;
        var filtered = allposts.filter(function (value, index, arr){
            return value.body.includes(searchText) || value.title.includes(searchText)
        });
        this.setState({posts: filtered});
    }

    // for add/delete follow
    follow2post_func = follows_ids => {
        // let userIds = follows.map(obj => {return obj.id});
        let userIds = follows_ids;
        userIds.unshift(this.state.userId);
        let shouldPosts = getPostsByUserIds(userIds);
        // console.log(shouldPosts.length);
        // console.log(userIds);
        // console.log("shit");

        this.setState({posts:[], backupposts:[]});
        // this.forceUpdate();
        this.setState({posts: shouldPosts, backupposts: shouldPosts});
    }

    handleHideShowComment(){
        this.setState({hiddenstate: !this.state.hiddenstate});
    }

    async handleAddPost(text, img, comments){
        // let newPost = {"userId": posts[0].userId, "id": posts[9].id+1, "title":"", "body":text, time: new Date(), imgs:imgs, comments: comments};
        let oldposts = this.state.posts;
        var payload
        if(img) {
            payload = new FormData();
            payload.append('text', text)
            payload.append('img', img)
            payload.append('comments', [])
            await fetch(`${apiUrl}/article`, {
                credentials: "include",
                method: "POST",
                body: payload,
                // headers: {'Content-Type':'application/json'}
            })
                // .then((res) => console.log(res))
                .then((response) => response.json())
                .then((resp) => {
                    if(resp.result === 'success') {
                        var newPost = resp.articles[0]
                        oldposts.unshift(newPost)
                        this.setState({
                            posts: oldposts,
                            backupposts: oldposts
                        })
                        console.log("Successfully Added New Article")
                    }
                    else {
                        // TODO What may cause failed post uploading?
                        console.log("failed in uploding post")
                    }
                })
                .catch((err) => {
                    console.log(err.message)
                })
        }
        else{
            var BODY = {
                text: text,
                img: img,
                comments: []
            }
            console.log(BODY)
            await fetch(`${apiUrl}/article`, {
                credentials: 'include',
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(BODY)
            })
                // .then((res) => console.log(res))
                .then((response) => response.json())
                .then((resp) => {
                    if(resp.result === 'success') {
                        var newPost = resp.articles[0]
                        oldposts.unshift(newPost)
                        this.setState({
                            posts: oldposts,
                            backupposts: oldposts
                        })
                        console.log("Successfully Added New Article")
                    }
                    else {
                        // TODO What may cause failed post uploading?
                        console.log("failed in uploding post")
                    }
                })
                .catch((err) => {
                    console.log(err.message)
                })
        }

    }

    nextPage() {
        console.log(this.state.page)
        var displayPosts = []
        console.log(this.state.posts.length)
        for(let i=(this.state.page+1) * 10; i<this.state.posts.length; i++) {
            if(i - (this.state.page+1) * 10 == 10) break
            displayPosts.push(this.state.posts[i])
        }
        if (displayPosts.length !== 0) {
            this.setState({displayPosts: displayPosts, page: this.state.page+1})
        }
        console.log(this.state.page)
    }

    prevPage() {
        console.log(this.state.page)
        var displayPosts = []
        for(let i=(this.state.page-1)*10; i<this.state.posts.length; i++) {
            if(i - (this.state.page-1) * 10 == 10 || i<0) break
            displayPosts.push(this.state.posts[i])
        }
        if (displayPosts.length !== 0) {
            this.setState({displayPosts: displayPosts, page: this.state.page-1})
        }
        console.log(this.state.page)
    }

    render() {
        return (
            <>
                {/*<NewPost />*/}
                <div>
                    <Follows userId={this.state.userId} follow2post={this.follow2post_func} />
                </div>
                <NewPost onClick={this.handleAddPost}/>
                <SearchBox searchByText={this.handleSearchByText}/>
                <div className="posts" id={"posts"}>
                    <table>
                        <thead defaultValue={"Posts"}></thead>
                        <tbody>
                        {/*{posts = this.state.posts}*/}
                        {/*{this.state.posts.map( ({v, ID, author, text, imgs, date, comments}) => {*/}
                        {/*    console.log(v)*/}
                        {/*    console.log(ID)*/}
                        {/*    console.log(author)*/}
                        {/*    console.log(text)*/}
                        {/*    console.log(imgs)*/}
                        {/*    console.log(date)*/}
                        {/*    console.log(comments)*/}
                        {/*} )}*/}
                        {
                            // this.state.posts.map()
                        }
                        <tr>
                            <td><button onClick={this.prevPage}>prev page</button></td>
                            <td><button onClick={this.nextPage}>next page</button></td>
                        </tr>

                        {this.state.displayPosts.map( ({v, ID, author, text, img, date, comments}) => (
                            <tr key={uuid()}>
                                <td>{date}</td>
                                <td>{author}</td>
                                <td>{text}</td>
                                <td><img src={img} width={"30%"} height={"30%"} alt={"This post has no images"}/></td>
                                {comments.map(({cmt}) => (
                                    <td>{cmt}</td>
                                    ))}
                                <td><button>Edit</button><br/><button>Comment</button></td>
                            </tr>
                        ) )}
                        {/*{this.state.posts.map( ({ userId, id, title, body, time, author, imgs, comments }) => (*/}
                        {/*    <tr>*/}
                        {/*        <th>{time.getDate() + "/"*/}
                        {/*            + (time.getMonth()+1)  + "/"*/}
                        {/*            + time.getFullYear() + " @ "*/}
                        {/*            + time.getHours() + ":"*/}
                        {/*            + time.getMinutes() + ":"*/}
                        {/*            + time.getSeconds()}</th>*/}
                        {/*        <th>{title}</th>*/}
                        {/*        <th>{author}</th>*/}
                        {/*        <th>{body}</th>*/}
                        {/*        <th><img src={imgs[0]} alt={""} height={"60%"} width={"60%"} hidden={!imgs[0]}/></th>*/}
                        {/*        <th hidden={this.state.hiddenstate}>{comments.map((cmt) => <p>{cmt}</p>)}</th>*/}
                        {/*        /!*<th><img src={imgSrc} height={"160%"} width={"60%"}/></th>*!/*/}
                        {/*        <th><button>Comment</button><br /><button>Edit Article</button><br /><button onClick={this.handleHideShowComment}>Show/Hide Comments</button></th>*/}
                        {/*    </tr>*/}
                        {/*) )}*/}
                        </tbody>
                    </table>
                </div>
            </>
        )
    }

}

export class Follows extends React.Component {
    constructor(props) {
        super(props);
        // const userId = this.props.userId;

        this.state = { hisFollows: [], addFollowText: "", errorText: "" };
        this.handleUnfollow = this.handleUnfollow.bind(this);
        this.handleAddFollow = this.handleAddFollow.bind(this);
    }

    async componentDidMount() {
        const hisFollows = await getFollows()
        this.setState({hisFollows: hisFollows})
    }

    handleUnfollow(e) {
        e.preventDefault()
        var name = e.target.name;
        // var hisFollows = this.state.hisFollows;
        // var newFollows = hisFollows.filter(function(value, idx, arr) {
        //     return value.id !== id;
        // })
        // this.setState({hisFollows: newFollows})
        // let newFollows_ids = newFollows.map(obj => {return obj.id});
        // if (this.props.follow2post) {
        //     this.props.follow2post(newFollows_ids);
        //     // console.log(newFollows_ids.length);
        // }
        const newFollows = delFollow(name)
        console.log("in handleunfollow "+newFollows.length)
        this.setState({hisFollows: newFollows})
        // if (this.props.follow2post) {
        //     this.props.follow2post(newFollows)
        // }
        // this.forceUpdate()
    }

    async handleAddFollow(e) {
        e.preventDefault()
        var addText = this.state.addFollowText;

        // const follows = await findUser(addText)
        var follows
        await fetch(`${apiUrl}/following/${addText}`, {
            credentials: 'include',
            method: 'PUT'
        }).then((response) => response.json())
            .then((response) => {
                follows = response.following

            })

        this.setState({hisFollows: follows, addFollowText: ""})
        console.log(this.state.hisFollows)
        // if (this.props.follow2post) {
        //     this.props.follow2post(follows)
        // }

        // return
        // following = await names2infos(following)
        // console.log("in actions add "+following.length)
        // return following

        // if (!follows)
        // {this.setState({errorText: "Requested User is not Found"})}
        // else {
        //     // this.forceUpdate()
        //     this.setState({hisfollows: follows})
        //     // this.forceUpdate()
        // }
    }

    render() {
        // console.log(this.state.hisFollows)
        // console.log("In render "+this.state.hisFollows.length)
        return (
            <table>
                <thead defaultValue={"Users You are Following:"}></thead>
                <tbody>
                <tr><td><h2>Followed Users</h2></td></tr>
                    <tr><td><span className={"warning"}>{this.state.errorText}</span></td></tr>
                    {this.state.hisFollows.map( (username) => (

                        <tr key={uuid()}>
                            <td>
                                <div>
                                    {/*<img src={avatar} alt={"imgSrc didn't give me a pic!"} width={"10%"} height={"10%"}></img><br />*/}
                                    <span>{username}</span><br />
                                    {/*<span>{headline}</span>*/}
                                    <button ref={username} name={username} onClick={this.handleUnfollow}>Unfollow</button>
                                    {/*<button id={id} name={"unfollow"+name} onClick={this.handleUnfollow}>Unfollow</button>*/}
                                </div>
                            </td>
                        </tr>
                    )
                    )}
                    <tr>
                        <td>
                        <input name={"followTypein"} type={"text"} onChange={e => {this.setState({addFollowText: e.target.value})}}></input>
                        <button name={"addFollowButton"} onClick={this.handleAddFollow}>Add Follow</button><br></br>
                        <span>Type in user's name to follow him, and click the button, try "Leanne Graham",<br></br> only registered users can be found</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }

}


export class NewPost extends React.Component{
    constructor(props) {
        super(props);
        this.handleClear = this.handleClear.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.file = ""
        // this.handleSubmit =
        this.state = {inputText: "You can add new articles here!!", img: "", comments: []}
    }

    handleImageChange(e) {
        e.preventDefault()
        let reader = new FileReader()
        reader.onloadend = () => {
            this.preview = reader.result
            this.forceUpdate()
        }
        console.log(e.target.files.length)
        if (e.target.files.length !== 0) {
            this.file = e.target.files[0]
            console.log(this.file)
            reader.readAsDataURL(this.file)
        }
    }

    handleClear(event) {
        this.refs.inputText.value = "";
    }

    handleSubmit(e){
        if (this.props.onClick){
            this.props.onClick(this.state.inputText, this.file, this.state.comments);
        }
        // this.props.onSubmit(this.state);
    }

    render() {
        return (
        <div>
            <h2>Write a New Post</h2><br></br>
            <textarea ref={"inputText"}  defaultValue={this.state.inputText} onChange={evt => this.setState({inputText: evt.target.value})}/><br />
            <span>Choose a photo from your device</span><br />
            {/*<input type={"file"} accept="image/*" onChange={evt => this.setState({imgs:[evt.target.value]})}></input>*/}
            <input type={"file"} accept="image/*" onChange={(e) => this.handleImageChange(e)}></input>
            <button onClick={this.handleClear}>Clear</button>
            <button onClick={this.handleSubmit}>Post</button>
        </div>
        )
    }
}

export class SearchBox extends React.Component{
    constructor(props) {
        super(props);
        this.state = {searchText: ""};
        this.handleSearchText = this.handleSearchText.bind(this);
    }

    handleSearchText(e) {
        if(this.props.searchByText) {
            this.props.searchByText(this.state.searchText);
        }
    }

    render() {
        return (
            <div>
                <h2>Search posts by text or author</h2>
                <textarea name="searchTextArea" ref={"searchText"} defaultValue={this.state.searchText} onChange={evt => this.setState({searchText: evt.target.value})}/><br/>
                <button onClick={this.handleSearchText}>Search by text or author</button>
                {/*<button>Search by author</button>*/}
            </div>
        )
    }
}


function getPostsByUserIds(userIds) {
    var feeds = [];
    for (let i = 0; i < userIds.length; i++) {
        let newFeeds = posts.filter((post) => post.userId === userIds[i]);
        feeds.push(...newFeeds);
    }
    for (let i=0; i<feeds.length; i++) {
        feeds[i].time = new Date(2015-i, 2);
        feeds[i].author = users.filter((user) => user.id === feeds[i].userId)[0].username;
        feeds[i].imgs = [imgSrc];
        feeds[i].comments = ['Comment 111', 'Comment 222', 'Comment 333'];
    }
    return feeds
}
