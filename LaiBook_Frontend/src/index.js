import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {Route, BrowserRouter, Routes} from "react-router-dom";
import Auth from "./auth/auth";
import Main from "./main/main"
import Profile from "./profile/Profile"
import {Posts} from "./main/main";
import {TestHello} from './test/testHello'


export default function RiceBook() {
    return (
        <BrowserRouter>
            <Routes>
                {/*<Route path="/" element={<AuthExample />} />*/}
                {/*<Route path={'/testHello'} element={<TestHello />}></Route>*/}
                <Route path="/" element={<Auth />} />
                <Route path="/main" element={<Main />} >
                    <Route path={":userName"} element={<Posts />} />
                    {/*<Route path={"/main/profile"} element={} />*/}
                </Route>
                <Route path="/profile/*" element={<Profile />}>
                    {/*<Route path=":"></Route>*/}
                < /Route>
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RiceBook />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
