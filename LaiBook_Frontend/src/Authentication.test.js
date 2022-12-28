import React from 'react';
import ReactDOM from 'react-dom'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import jsdom from 'jsdom'
// import {EnzymeAdapter} from "enzyme";
// import Adapter from 'enzyme-adapter-react-16'
// import Login from './Landing/Login'
// import User from './Main/User'
import {SignInForm, RegForm} from './auth/auth'
import {users} from './data'
import Main from "./main/main";

// Enzyme.configure({ adapter: new Adapter() })
Enzyme.configure( { adapter: new Adapter() } )
describe('Test Authentication', () => {
    it('should log in a user (login state should be set)',  async () => {
        users.map(eachUser => {
            let wrapper = shallow(<SignInForm />);
            wrapper.find('input[name="UsernameTypein"]').simulate('change', { target: { name: 'UsernameTypein', value: eachUser.username}});
            wrapper.find('input[name="PasswordTypein"]').simulate('change', { target: { name: 'PasswordTypein', value: eachUser.address.street}});
            wrapper.find('button').simulate('click');
            expect(wrapper.state().loginState).toBe(true);
        })

    })

    it("should not log in an invalid user (error state should be set)", () => {
        let wrapper = shallow(<SignInForm />);
        wrapper.find('input[name="UsernameTypein"]').simulate('change', { target: { name: 'UsernameTypein', value: 'random username'}});
        wrapper.find('input[name="PasswordTypein"]').simulate('change', { target: { name: 'PasswordTypein', value: 'random password'}});
        wrapper.find('button').simulate('click');
        expect(wrapper.state().errors).toEqual("Username & Password don't match. Or user doesn't exist");
    })

    it("should log out a user (login state should be cleared)", () => {

        let wrapper = shallow(<SignInForm />);
        wrapper.find('input[name="UsernameTypein"]').simulate('change', { target: { name: 'UsernameTypein', value: "Bret"}});
        wrapper.find('input[name="PasswordTypein"]').simulate('change', { target: { name: 'PasswordTypein', value: "Kulas Light"}});
        wrapper.find('button').simulate('click');

        let wrapper2 = shallow(<Main />);
        wrapper2.find('Link[id="logout"]').simulate('click');
        wrapper = shallow(<SignInForm />)
        expect(wrapper.state().loginState).toBe(false);
    })

    it("should have a register form", async () => {
        let wrapper = shallow(<RegForm />);
        const instance = wrapper.instance();
        await instance.validate({
            AccountName: '',
            DisplayName: '',
            EmailAddress: '',
            PhoneNumber: '',
            DateofBirth: '',
            Zipcode: '',
            Password: '',
            PasswordCfm: '',
            errors: [],
            loginState: false
        });
        expect(wrapper.state().loginState).toBe(false);
    })
    it("should have a register form validatation", async () => {
        let wrapper = shallow(<RegForm />);
        const instance = wrapper.instance();
        wrapper.find('input[name="AccountName"]').simulate('change', {target: {ref: 'AccountName', value: "1213"}});
        wrapper.find('input[name="DisplayName"]').simulate('change', {target: {ref: 'AccountName', value: "1213"}});
        wrapper.find('input[name="EmailAddress"]').simulate('change', {target: {ref: 'AccountName', value: "1213"}});
        wrapper.find('input[name="PhoneNumber"]').simulate('change', {target: {ref: 'AccountName', value: "1213"}});
        wrapper.find('input[name="DateofBirth"]').simulate('change', {target: {ref: 'AccountName', value: "1213"}});
        wrapper.find('input[name="Zipcode"]').simulate('change', {target: {ref: 'AccountName', value: "1213"}});
        wrapper.find('input[name="Password"]').simulate('change', {target: {ref: 'AccountName', value: "1213"}});
        wrapper.find('input[name="PasswordCfm"]').simulate('change', {target: {ref: 'AccountName', value: "1213"}});
        wrapper.find('form').simulate('submit', {target: { event: wrapper.state().name = "shit" }});
        await instance.validate({
            AccountName: '',
            DisplayName: '',
            EmailAddress: '',
            PhoneNumber: '',
            DateofBirth: '',
            Zipcode: '',
            Password: '',
            PasswordCfm: '',
            errors: [],
            loginState: false
        });
        expect(wrapper.state().loginState).toBe(false);
    })
})
