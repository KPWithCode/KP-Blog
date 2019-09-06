import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import './App.css';
import AuthPage from './pages/Auth'
import BlogPage from './pages/Blogs';
import Highlight from './pages/Highlights';
import Nav from './components/Navigation/Navbar';
import AuthContext from './Context/auth-context';

class App extends Component {

  state = {
    token: null,
    userId: null,

  }
  login = (token, userId, tokenExpiration) => {
    this.setState({ token, userId })
  }
  logout = () => {
    this.setState({ token: null, userId: null })
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider value={{ token: this.state.token, userId: this.state.userId, login: this.login, logout: this.logout }}>
            <Nav />
            <main>
              <Switch>
                {this.state.token && <Redirect from="/" to="/blogs" exact />}
                {this.state.token && <Redirect from="/auth" to="/blogs" exact />}
                {!this.state.token && (<Route exact path="/auth" component={AuthPage} />)}
                <Route exact path="/blogs" component={BlogPage} />
                {this.state.token && (<Route exact path="/highlights" component={Highlight} />)}
                {!this.state.token && <Redirect to="/auth" exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>


    );
  }
}

export default App;
