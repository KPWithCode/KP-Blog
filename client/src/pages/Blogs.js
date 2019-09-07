import React, { Component } from 'react'
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/BackDrop/Backdrop';
import './Blogs.css';
import './Auth.css'
import AuthContext from '../Context/auth-context';


class BlogPage extends Component {
    constructor(props) {
        super(props);
        this.title = React.createRef();
        this.rating = React.createRef();
        this.date = React.createRef();
        this.description = React.createRef();
    }
    state = {
        creating: false
    }
    static contextType = AuthContext;
    createBlog = () => {
        this.setState({ creating: true });
    }
    cancelModal = () => {
        this.setState({ creating: false });
    }
    confirmModal = () => {
        this.setState({ creating: false });
        const title = this.title.current.value;
        const rating = this.rating.current.value;
        const date = this.date.current.value;
        const description = this.description.current.value;

        if (title.trim().length === 0 ||
            rating <= 0 ||
            date.trim().length === 0 ||
            description.trim().length === 0) {
            return;
        }

        const blog = { title, rating, date, description };
        console.log(blog)


        const requestBody = {
            query: `
                mutation {
                    createBlog(blogInput: {title:"${title}",rating:"${rating}", date:"${date}",description:"${description}"}) {
                    _id
                    title
                    rating
                    date
                    description
                    creator {
                        _id
                        email
                    }
                    }     
                } 
            `
        };
        const token = this.context.token;
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed')
                }
                return res.json();
            })
            .then(resData => {
                console.log(resData)
            })
            .catch(err => {
                console.log(err)
            })




    }
    render() {
        return (
            <React.Fragment>
                {this.state.creating && <Backdrop />}
                {this.state.creating && <Modal className="modal"
                    title="Add Blog"
                    canCancel
                    canConfirm
                    onCancel={this.cancelModal}
                    onConfirm={this.confirmModal}
                >
                    <form>
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" ref={this.title}></input>
                        </div>
                        <div className="form-control">
                            <label htmlFor="price">Rating</label>
                            <input type="number" id="price" ref={this.rating}></input>
                        </div>
                        <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input type="date" id="date" ref={this.date}></input>
                        </div>
                        <div className="form-control">
                            <label htmlFor="description">Description</label>
                            <textarea type="number" rows="4" id="description" ref={this.description} />
                        </div>
                    </form>
                </Modal>}
                <div>
                    <div className="header">
                        <h1 className="h1">SHARE YOUR BLOG</h1>
                        <button className="btn" onClick={this.createBlog} >Start Here</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default BlogPage