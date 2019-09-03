import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import './App.css';
import AuthPage from './pages/Auth'
import BlogPage from './pages/Blogs';
import Highlight from './pages/Highlights';
import Nav from './components/Navigation/Navbar';

function App() {
  
  return (
    <BrowserRouter>
      <React.Fragment>
        <Nav />
        <main>
          <Switch>
            <Redirect exact from="/" to="/auth" />
            <Route exact path="/auth" component={AuthPage} />
            <Route exact path="/blogs" component={BlogPage} />
            <Route exact path="/highlights" component={Highlight} />
          </Switch>
        </main>
      </React.Fragment>
    </BrowserRouter>


  );
}

export default App;
