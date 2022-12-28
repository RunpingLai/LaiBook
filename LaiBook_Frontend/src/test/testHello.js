// import React, {useState} from "react";
// import {Link, Route, Routes, Outlet, useParams, useLocation, json} from "react-router-dom";
// import Auth from "../auth/auth";
// import Profile from "../profile/Profile";
// import {users, posts} from "../data";
import '../styleSheets.css'

import React, { useState, useEffect } from 'react';

const TestHello = () => {
    const [posts, setPosts] = useState([]);
    // useEffect(() => {
    //     fetch('http://localhost:3000/testHello')
    //         .then((response) => response.json())
    //         .then((data) => {
    //             console.log(data.hello);
    //             setPosts(data.hello);
    //         })
    //         .catch((err) => {
    //             console.log(err.message);
    //         });
    // }, []);
    useEffect(() => {
        fetch('http://localhost:3000/articles')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setPosts(data.articles);
            })
            .catch((err) => {
                console.log(err.message)
            })
    }, []);

    return (
        <>
            <div>{posts}</div>
            <div>{posts}</div>
            <div>testing</div>
        </>

        // ... consume here
    );
};
export {TestHello};