import React, { Component } from 'react'
import './Blogs.css'
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/BackDrop/Backdrop';

class BlogPage extends Component {
    state = {
        creating: false
    }
    createBlog = () => {
        this.setState({ creating: true });
    }
    cancelModal = () => {
        this.setState({ creating: false });
    }
    confirmModal = () => {
        this.setState({ creating: false });
    }
    render() {
        return (
            <React.Fragment>
                {this.state.creating &&<Backdrop />}
                {this.state.creating && <Modal className="modal"
                    title="Add Blog"
                    canCancel
                    canConfirm
                    onCancel={this.cancelModal}
                    onConfirm={this.confirmModal}
                >
                    <p>MODAL CONTENT</p>
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