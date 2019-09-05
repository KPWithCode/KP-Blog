import React, { Component } from 'react'
import './Auth.css'

class AuthPage extends Component {
    constructor(props) {
        super(props);
        this.email = React.createRef();
        this.password = React.createRef();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const email = this.email.current.value
        const password = this.password.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }
        console.log(email, password);

        const requestBody = {
            query: `
            mutation {
                createUser(userInput: {email:"${email}",password:"${password}"}) {
                _id
                email
                }
            `
        }

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }


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
                    <button type="button">Sign Up</button>
                </div>
            </form>
        )
    }
}

export default AuthPage