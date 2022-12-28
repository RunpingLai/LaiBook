require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;
let cookie;
let lastLength;

let testUser = {
    username: "bestUser",
    password: "123"
    // headline: "TestUser Headline is here"
};
// TODO
// Register a new user named "testUser" with password "123"
// Log in as "testUser"
// Create a new article and verify that the article was added
// Update the status headline and verify the change
// Log out "testUser"
// TODO
// 1 POST /register register new user
// 2 POST /login log in user
// 3 PUT /logout log out current logged in user
// 4 GET /headline return headline for logged in user
// 5 PUT /headline update logged in user headline
// 6 GET /articles returns articles of logged in user
// 7 GET /articles/id (where id is a valid or invalid article id)
// 8 POST /article (adding an article for logged in user returns list of articles with new article,
// validate list increased by one and contents of the new article)

describe('Register, Login, Logout', () => {
    // TODO POST /register
    it('register new user', (done) => {
        fetch(url('/register'), {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(testUser)
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual('bestUser');
            expect(res.result).toEqual('success');
            console.log("1 done")
            done();
        }).catch((err) => console.log(err));
    });

    // TODO POST /login
    it('log in old user', (done) => {
        fetch(url('/login'), {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(testUser)
        }).then(res => {
            cookie = res.headers.get('set-cookie')
            return res.json()
        }).then(res => {
            expect(res.username).toEqual('bestUser')
            expect(res.result).toEqual('success')
            console.log("2 done")
            done()
        }).catch((err) => console.log(err))
    })

    // TODO PUT /logout
    it('log out current logged in user', (done) => {
        fetch(url('/logout'), {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'Cookie': cookie}
        }).then(res => res.json()).then(res => {
            expect(res.result).toEqual('logout success')
            console.log("3 done")
            done();
        })
    })
})

describe('headline, article', () => {

    beforeEach((done) => {
        // fetch(url('/register'), {
        //     method: 'POST',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify(testUser)
        // }).then(res => res.json()).then(res => {
        //     expect(res.username).toEqual('bestUser');
        //     expect(res.result).toEqual('success');
        //     console.log("1 done")
        //     done();
        // }).catch((err) => console.log(err));

        fetch(url('/login'), {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(testUser)
        }).then(res => {
            cookie = res.headers.get('set-cookie')
            res.json()
        }).then(res => {
            console.log("4 done")
            done();
        })
    })

    // TODO GET /headline
    it('return headline for logged in user', (done) => {
        fetch(url('/headline/bestUser'), {
            method: 'GET',
            headers: {'Content-Type': 'application', 'Cookie': cookie}
        }).then(res => res.json()).then(res => {
            expect(res.headline).toEqual("default headline")
            console.log("5 done")
            done()
        })
    })

    // TODO PUT /headline
    it('update logged in user headline', (done) => {
        var newHeadline = {headline: "comp531"}
        fetch(url('/headline'), {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'Cookie': cookie},
            body: JSON.stringify(newHeadline)
        }).then(res => res.json()).then(res => {
            expect(res.headline).toEqual("comp531")
            done()
        })
    })

    // TODO GET /articles
    it('return articles of logged in user', (done) => {
        fetch(url('/articles'), {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Cookie': cookie}
        }).then(res => res.json()).then(res => {
            lastLength = res.articles.length
            console.log(res.articles.length)
            expect(res.articles.length >= 1).toBe(true)
            done()
        })
    })

    // TODO POST /article
    it('adding an article for looged in user return list of articles with new article', (done) => {
        fetch(url('/article'), {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Cookie': cookie},
            body: JSON.stringify({text: "text example"})
        }).then(res => res.json()).then(res => {
            expect(res.articles.length).toEqual(lastLength+1);
            done()
        })
    })
    // TODO GET /articles/id
    it('where id is a valid article id'), (done) => {
        fetch(url('articles/1'), {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Cookie': cookie}
        }).then(res => res.json()).then(res => {
            expect(res.id === 1)
            done()
        })
    }
    // TODO GET /articles/invalidId
    it('where id is a invalid article id'), (done) => {
        fetch(url('articles/3431414234'), {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Cookie': cookie}
        }).then(res => res.json()).then(res => {
            expect(res.result === "Unable to get articles")
            done()
        })
    }

    // TODO This is just to turn headline to "default headline"
    // so that next test can pass
    it('update logged in user headline', (done) => {
        var newHeadline = {headline: "default headline"}
        fetch(url('/headline'), {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'Cookie': cookie},
            body: JSON.stringify(newHeadline)
        }).then(res => res.json()).then(res => {
            done()
        })
    })

})