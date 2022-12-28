import React from "react";
import {Link} from "react-router-dom";

class RegForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: '',
            emailAddr: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this.state.value);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = event.target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        console.log("shit");
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Display Name
                    <input name="Display Name" type={"text"} value={this.state.value} onChange={this.handleInputChange} />
                </label>
                <br />
                <label>
                    Email Address
                    <input type={"email"} value={this.state.fuck} onChange={this.handleInputChange} />
                </label>
                <br />
                <label>
                    Phone Number
                    <input type={"number"} value={this.state.value} onChange={this.handleInputChange}/>
                </label>
                <br />
                <label>
                    Zipcode
                    <input type={"number"} value={this.state.value} onChange={this.handleInputChange} />
                </label>
                <br />
                <label>
                    Password
                    <input type={"password"} value={this.state.value} onChange={this.handleInputChange} />
                </label>
                <br />
                <label>
                    Password Confirmation
                    <input type={"password"} value={this.state.value} onChange={this.handleInputChange} />
                </label>
                <br />
                <input type={"submit"} value={"Submit"}/>
            </form>
        )
    }
}

class SignInForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};

        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleSubmit(event) {
        console.log("fuck");
        this.props.history.push('/main');
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Username
                    <input name="Username" type={"text"} />
                </label>
                <br/>
                <label>
                    Password
                    <input name="Password" type={"text"} />
                </label>
                <br/>
                <input type={"submit"} value="Log in" />
            </form>
        )
    }
}

export default function Landing() {
    return (
        <>
            <div>This is Landing Page</div>
            <div name={"RegForm"}>
                <RegForm />
            </div>
            <div name={"SignInForm"}>
                <SignInForm />
            </div>
            <Link to={"/"}>Home</Link>
        </>
    )
}