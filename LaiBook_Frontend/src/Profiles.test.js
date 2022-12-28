import React from 'react';
import ReactDOM from 'react-dom'
import Enzyme, {mount, shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Profile from "./profile/Profile";
import {Posts} from "./main/main";
import jsdom from 'jsdom'
import {SignInForm} from './auth/auth'
import {users} from './data'
import Main from "./main/main";

Enzyme.configure( { adapter: new Adapter() } )
describe(' Test Profile',  () => {
    it('should fetch the user profile username',  async () => {
        const url = "http://2/3/Bret";
        Object.defineProperty(window, "location", {
            value: new URL(url)
        } );

        window.location.href = url;
        let wrapper = shallow(<Profile />);
        const instance = wrapper.instance();
        expect(wrapper.state().userName).toBe("Bret");
    })

    it('should remain info after inputting wrong info', async () => {
        const url = "http://2/3/Bret";
        Object.defineProperty(window, "location", {
            value: new URL(url)
        });

        window.location.href = url;
        let wrapper = shallow(<Profile />);
        // wrapper.find('input[name="newName"]').simulate('change', { target: { name: 'newName', value: "123"}})
        const instance = wrapper.instance();
        // await instance.updateInfo({})
        await instance.handleUpdateInfo('123','123','123','123','123')
        expect(wrapper.state().userName).toBe("Bret");
    })

    it('should remain normal after initialization', async () => {
        const url = "http://2/3/Bret";
        Object.defineProperty(window, "location", {
            value: new URL(url)
        });

        window.location.href = url;
        let wrapper = shallow(<Profile />);
        // wrapper.find('input[name="newName"]').simulate('change', { target: { name: 'newName', value: "123"}})
        const instance = wrapper.instance();
        // await instance.updateInfo({})
        await instance.calc(1);
        expect(wrapper.state().ca).toBe(118);
    })
})