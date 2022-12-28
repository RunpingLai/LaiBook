import React, { Component, PropTypes } from 'react'
import Button from "@mui/material/Button";
const apiUrl = "http://localhost:3000"
// const apiUrl = "https://final-backend-rl106.herokuapp.com"
function linkAccountFunction({regUsername, regPassword}) {
    if (regUsername && regPassword){
        return fetch(`${apiUrl}/merge`, {
            credentials: 'include',
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            // mode: 'no-cors',
            body: JSON.stringify({regUsername, regPassword})
        })
            .then((response) => response.json())
            .then((resp) => {
                if(resp.result === 'success') {
                    return `You have successfully linked with ${resp.username}`
                }
                else {
                    return "Incorrect Password"
                }
            })
            .catch((err) => {
                return err
            })
    }
    else {
        console.log("No username or password")
    }
}

class LinkAccountForm extends Component {

    constructor() {
        super();
        const userName = window.location.href.split("/")[4];
        console.log(userName)
        this.state = {userName: userName}
        // this.setState({userName: userName})
    }

    render() { return (

        <form onSubmit={(e) => {
            if (e) e.preventDefault()
            const payload = {
                regUsername:this.regUsername.value,
                regPassword:this.regPassword.value
            }
            linkAccountFunction(payload)
        }}>
            { !this.state.userName.split('@')[1] ? '' :
                <div>
                    <div className="form-group row">
                        <label className="col-sm-3 form-control-label" for="regUsername">regualr username</label>
                        <div className="col-sm-6">
                            <input className="form-control" id="regUsername" type="text" placeholder="username for regualr login"
                                   ref={(node) => this.regUsername = node }/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 form-control-label" for="regPassword">regular password</label>
                        <div className="col-sm-6">
                            <input className="form-control" id="regPassword" type="password" placeholder="password for regular login"
                                   ref={(node) => this.regPassword = node }/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <span className="col-sm-3 form-control-label"></span>
                        <div className="col-sm-9">
                            <button className="btn btn-primary" type="submit" id="linkAccountBtn">Link Account</button>
                        </div>
                    </div>
                </div>
            }
        </form>
    )}
}

class UnlinkBtn extends Component {
    constructor(props) {
        super(props);
        const userName = window.location.href.split("/")[4];
        this.state = {userName: userName}
    }


    render() { return (
        <div>
            {this.state.userName.split('@')[1] ? '' :
                <div className="form-group row">
                    <div className="col-sm-6">
                        <Button fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                className="btn btn-warning" type="button"
                                onClick = {() => {unlinkAccount('google')}}>UnLink Google</Button>
                    </div>
                </div>
            }
        </div>
    )}
}

function unlinkAccount(company) {
    return fetch(`${apiUrl}/unlink`, {
        credentials: 'include',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        // mode: 'no-cors',
        body: JSON.stringify({company: company})
    })
        .then((response) => response.json())
        .then((resp) => {
            if(resp.result === 'success') {
                return `You have successfully unlinked with ${company}`
            }
            else {
                return "Incorrect Password"
            }
        })
        .catch((err) => {
            return err
    })
}

export {LinkAccountForm, UnlinkBtn}