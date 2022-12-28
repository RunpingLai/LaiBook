import React from 'react';
import ReactDOM from 'react-dom'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {Posts, NewPost, SearchBox} from "./main/main";
import jsdom from 'jsdom'
import {SignInForm} from './auth/auth'
import {users} from './data'
import Main from "./main/main";

Enzyme.configure( { adapter: new Adapter() } )
describe('Test Articles', () => {
    it('should fetch articles for current logged in user (posts state is set)',  () => {
        const url = "http://2/3/Bret";
        Object.defineProperty(window, "location", {
            value: new URL(url)
        } );

        window.location.href = url;
        let wrapper = shallow(<Posts/>);
        expect(wrapper.state().posts.length).toBe(40);
    })

    it("should filter displayed articles by the search keyword (posts state is filtered)", async() => {
        const url = "http://2/3/Bret";
        Object.defineProperty(window, "location", {
            value: new URL(url)
        } );

        window.location.href = url;
        let wrapper = shallow(<Posts/>);
        const instance = wrapper.instance();
        // wrapper.find('SearchBox').dive().find('textarea').simulate('change', { target: { name: 'searchTextArea', value: ' '}});
        // wrapper.find('SearchBox').dive().find("button").simulate('click');
        // wrapper.find('SearchBox').state().searchText = "quit et";
        await instance.handleSearchByText("quia et");
        expect(wrapper.state().posts.length).toBe(3);
    })

    it("should add articles when adding a follower (posts state is larger)", async () => {
        const url = "http://2/3/Bret";
        Object.defineProperty(window, "location", {
            value: new URL(url)
        } );

        window.location.href = url;
        let wrapper = shallow(<Posts/>);
        const instance = wrapper.instance();
        wrapper.find("Follows").dive().find('input[name="followTypein"]').simulate('change', { target: { name: 'followTypein', value: "Chelsey Dietrich"}});
        wrapper.find("Follows").dive().find('button[name="addFollowButton"]').simulate('click');
        await instance.follow2post_func([2,3,4,5]);
        expect(wrapper.state().posts.length).toBe(50);
    })

    it("should remove articles when removing a follower (posts state is smaller)", async () => {
        const url = "http://2/3/Bret";
        Object.defineProperty(window, "location", {
            value: new URL(url)
        } );

        window.location.href = url;
        let wrapper = shallow(<Posts/>);
        const instance = wrapper.instance();
        // passed an event
        wrapper.find("Follows").dive().find('button[name="unfollowErvin Howell"]').simulate('click', { target: { id: "2" }});
        await instance.follow2post_func([3,4]);
        expect(wrapper.state().posts.length).toBe(30);
    })

    it("should add new post", async () => {
        const url = "http://2/3/Bret";
        Object.defineProperty(window, "location", {
            value: new URL(url)
        } );

        window.location.href = url;
        let wrapper = shallow(<NewPost/>);
        const instance = wrapper.instance();
        let wrapper2 = shallow(<SearchBox />);
        const instance2 = wrapper2.instance();
        let wrapper3 = shallow(<Posts />)
        const instance3 = wrapper3.instance();
        await instance3.handleAddPost('123',[''], ['']);
        wrapper2.find('textarea').simulate('change', {target: {name:"searchTextArea", value:"12312312"}});
        //
        // // passed an event
        // wrapper.find("").dive().find('button[name="unfollowErvin Howell"]').simulate('click', { target: { id: "2" }});
        // await instance.follow2post_func([3,4]);
        // expect(wrapper.state().posts.length).toBe(30);
    })
    it("should save info from localstorageX", async () => {
        const url = "http://2/3/Bret";
        Object.defineProperty(window, "location", {
            value: new URL(url)
        } );

        window.location.href = url;
        let wrapper = shallow(<Main/>);
        const instance = wrapper.instance();
        window.localStorage.setItem(JSON.stringify("Bret"), JSON.stringify({userStatus_localStorage: "LocalStorage"}));
        // let wrapper2 = shallow(<SearchBox />);
        // const instance2 = wrapper2.instance();
        // let wrapper3 = shallow(<Posts />)
        // const instance3 = wrapper3.instance();
        // await instance3.handleAddPost('123',[''], ['']);
        // wrapper2.find('textarea').simulate('change', {target: {name:"searchTextArea", value:"12312312"}});
        //
        // // passed an event
        // wrapper.find("").dive().find('button[name="unfollowErvin Howell"]').simulate('click', { target: { id: "2" }});
        // await instance.follow2post_func([3,4]);
        // expect(wrapper.state().posts.length).toBe(30);
    })

})