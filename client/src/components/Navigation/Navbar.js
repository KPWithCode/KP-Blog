import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';



const Nav = props => {


    return (
        <div>

        <nav className="main-nav ">
            <div className="main-nav-logo">
                <h1><NavLink to="/">BlogEasy</NavLink></h1>
            </div>
            <nav className="main-nav-items">
                <ul>
                    <li><NavLink to="/auth">Authenticate</NavLink></li>
                    <li><NavLink to="/blogs">Check Out Blogs</NavLink></li>
                    <li><NavLink to="/highlights">Highlighted</NavLink></li>
                </ul>
            </nav>
        </nav>
        <hr style={{width:'90%'}}/>
        </div>
    )
}
export default Nav;