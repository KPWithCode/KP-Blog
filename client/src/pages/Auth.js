import React, { Component } from 'react'
import './Auth.css'

class AuthPage extends Component {
    state = {
        isLoggedIn: true
    }
    constructor(props) {
        super(props);
        this.email = React.createRef();
        this.password = React.createRef();
    }

    handleSwitch = () => {
        this.setState(prevState => {
            return { isLoggedIn: !prevState.isLoggedIn }
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const email = this.email.current.value
        const password = this.password.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }
        console.log(email, password);

        let requestBody = {
            query: `
                query {
                    login(email: "${email}", password: "${password}") {
                    userId
                    token
                    tokenExpiration
                    }
                }
            `
        };
        if (!this.state.isLoggedIn) {
            requestBody = {
                query: `
                mutation {
                    createUser(userInput: {email:"${email}",password:"${password}"}) {
                    _id
                    email
                    }     
                } 
            `
            };
        }
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed')
                }
                return res.json();
            })
            .then(resData => {
                console.log(resData);
            })
            .catch(err => {
                console.log(err)
            })

    };
    render() {
        return (
            <form className="form" onSubmit={this.handleSubmit}>
                <div className="form-control">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" ref={this.email}></input>
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="pass" ref={this.password}></input>
                </div>
                <div className="form-actions">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={this.handleSwitch}>
                        Switch To {this.state.isLoggedIn ? 'Signup' : 'Login'}
                    </button>
                </div>
            </form>
        )
    }
}

export default AuthPage;