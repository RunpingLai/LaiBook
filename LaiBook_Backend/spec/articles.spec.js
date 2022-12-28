/*
 * Test suite for articles
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;
let cookie;

// describe('Validate Article functionality', () => {


    // it('should give me three or more articles', (done) => {
    //     fetch(url('/articles'), {
    //         method: 'GET',
    //         headers: { 'Content-Type': 'application/json' }
    //     }).then(res => res.json()).then(res => {
    //         if (res instanceof Array)
    //             expect(res.length).toBeGreaterThan(2);
    //         done();
    //     });
    // });

    // it('should add new article with successive article id, return list of articles with new article', (done) => {
    //     // add a new article
    //     // verify you get the articles back with new article
    //     // verify the id, author, content of the new article
    //     let post = {author: 'Tom', body: 'A new post'};
    //     fetch(url('/article'), {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(post)
    //     }).then(res => res.json()).then(res => {
    //         if (res instanceof Array) {
    //             //TODO test new article expected id, author, post
    //             expect(res.at(-1).id).toEqual(3);
    //             expect(res.at(-1).author).toEqual(post.author);
    //             expect(res.at(-1).body).toEqual(post.body);
    //         }
    //         else {
    //             done(new Error('WTF'));
    //         }
    //         done();
    //     })
    // });

    // it('should return an article with a specified id', (done) => {
    //     let options = {
    //         method: 'GET',
    //         headers: {'Content-Type': 'application/json'}
    //     }
    // //     fetch(url(`/articles/1`), options)
    // //         .then(res => res.json())
    // //         .then(res => {
    // //             expect(res.id).toEqual(1);
    // //             done()
    // //         })
    // // })
    //     fetch(url("/articles"),options)
    //         .then(res => {
    //             expect(res.status).toEqual(200)
    //             return(res.json());
    //         })
    //         .then(articles => {
    //             // console.log(body);
    //             // console.log(body.articles)
    //             console.log(articles);
    //             console.log(articles.length);
    //             console.log("shit");
    //             expect(articles.length).toBeGreaterThan(3);
    //             return articles[0].id;
    //         })
    //         .then( randID =>{
    //             // then call GET /articles/id with the chosen id
    //             return fetch(url(`/articles/${randID}`), options)
    //         })
    //         .then( res => {
    //             // expect(res.status).toEqual(200)
    //             return res.json();
    //         })
    //         .then(article => {
    //             console.log(article)
    //             // validate that only one article is returned
    //             expect(article).toBeTruthy();
    //             // expect(article).(id);
    //             // expect(articles.length).toEqual(1);
    //         })
    //         .then(done)
    //         .catch(done)
    // }, 200)
//     done()
// });