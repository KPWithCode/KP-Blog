import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import AuthContext from '../../Context/auth-context';

const Nav = props => (
    <AuthContext.Consumer>
        {context => {
            return (
                <div>
                    <nav className="main-nav ">
                        <div className="main-nav-logo">
                            <h1><NavLink to="/">BlogEasy</NavLink></h1>
                        </div>
                        <nav className="main-nav-items">
                            <ul>
                                {!context.token && (<li><NavLink to="/auth">Authenticate</NavLink></li>)}
                                <li><NavLink to="/blogs">Check Out Blogs</NavLink></li>
                                {context.token && (<React.Fragment><li><NavLink to="/highlights">Highlighted</NavLink></li> <li>Logout</li></React.Fragment>)}
                            </ul>
                        </nav>
                    </nav>
                    <hr style={{ width: '90%' }} />
                </div>
            )
        }}
    </AuthContext.Consumer>
)
export default Nav;