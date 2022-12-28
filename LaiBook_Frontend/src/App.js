import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Auth from "./auth/auth";
import Main, {Posts} from "./main/main";
import Profile from "./profile/Profile";
import React from "react";
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
// import {createBrowserRouter, RouterProvider, Route, BrowserRouter, Routes} from "react-router-dom";
// import Auth from "./auth/auth";
// import Main, {Feeds} from "./main/main"
// import Profile from "./profile/Profile"
// import {Posts} from "./main/main";
import AuthExample from "./auth/auth";
// import RiceBook from "./App";
// import RiceBook from "./index";

// function App() {
//   console.log("hi")
//   return (
//     <div>app</div>
//   )
// }
// export default function RiceBook() {
//     return (
//         <BrowserRouter>
//             <Routes>
//                 {/*<Route path="/" element={<AuthExample />} />*/}
//                 <Route path="/" element={<Auth />} />
//                 <Route path="/main" element={<Main />} >
//                     <Route path={":userName"} element={<Posts />} />
//                     {/*<Route path={"/main/profile"} element={} />*/}
//                 </Route>
//                 <Route path="/profile/*" element={<Profile />}>
//                     {/*<Route path=":"></Route>*/}
//                 < /Route>
//             </Routes>
//         </BrowserRouter>
//     );
// }
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<RiceBook />);
// export default RiceBook;
