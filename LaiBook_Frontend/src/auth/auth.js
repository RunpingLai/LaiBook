import React from "react";
import {Navigate} from "react-router-dom";
import {users} from "../data";
// import '../styleSheets.css'
import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import GoogleIcon from '@mui/icons-material/Google';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
// import Icon from '@mui/material/Icon';
// or
// import { Icon } from '@mui/material';
import Icon from "../Icon/icon";
import { Stack } from "@mui/system";
import { StackedBarChart } from "@mui/icons-material";

let theme = createTheme();
// const isLocal = true
// export const apiUrl = isLocal ? "http://localhost:3000" : "herokuapp.com"
const apiUrl = "http://localhost:3000"
// const apiUrl = "https://final-backend-rl106.herokuapp.com"
export class RegForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            AccountName: '',
            DisplayName: '',
            EmailAddress: '',
            PhoneNumber: '',
            DateofBirth: '',
            Zipcode: '',
            Password: '',
            PasswordCfm: '',
            errors: [],
            loginState: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    validate(form) {
        const errors = [];

        var actnameformat = /^[A-Za-z0-9]*$/;
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var phoneformat = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;;
        var zipcodeformat = /(^\d{5}$)|(^\d{5}-\d{4}$)/;

        var isValidActname;
        if (/[0-9]/.test(form.AccountName[0])) {
            isValidActname = false;
        }
        else {
            if (actnameformat.test(form.AccountName)) {
                isValidActname = true;
            }
            else {
                isValidActname = false;
            }
        }
        var isValidPhone = phoneformat.test(form.PhoneNumber);
        var isValidMail = mailformat.test(form.EmailAddress);
        var dob = new Date(form.DateofBirth);
        var today = new Date();
        var age = today.getFullYear() - dob.getFullYear();
        var m = today.getMonth() - dob.getMonth();
        var d = today.getDate() - dob.getDate();
        if ( m<0 || (m===0 && d < 0) ) {
            age--;
        }
        var isValidDob;
        if ( age < 18) {
            isValidDob = false;
        }
        else {
            isValidDob = true;
        }
        var isValidZip = zipcodeformat.test(form.Zipcode);
        var isPasswordMatch;
        if (form.Password === form.PasswordCfm) {
            isPasswordMatch = true;
        }
        else {
            isPasswordMatch = false;
        }

        if (!isValidActname) {
            errors.push("Account Name Error");
        }
        if (!isValidMail) {
            errors.push("Email Address Error");
        }
        if (!isValidPhone) {
            errors.push("Phone Number Error");
        }
        if( !isValidDob) {
            errors.push("Birthday Error");
        }
        if (!isValidZip) {
            errors.push("Zipcode Error");
        }
        if (!isPasswordMatch) {
            errors.push("Passwords don't match");
        }
        return errors
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
        event.preventDefault();
        const errors = this.validate(this.state);
        this.setState({ errors });
        if (errors.length > 0) {
            return;
        }

        var BODY = {
            username: this.state.AccountName,
            email: this.state.EmailAddress,
            dob: this.state.DateofBirth,
            zipcode: this.state.Zipcode,
            password: this.state.Password,
            phone: this.state.PhoneNumber
        }
        fetch(`${apiUrl}/register`, {
            credentials: 'include',
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            // mode: 'no-cors',
            body: JSON.stringify(BODY)
        })
            .then((response) => response.json())
            .then((resp) => {
                if(resp.result === 'success') {
                    this.setState({loginState: true})
                }
                if(resp.result === 'failed') {
                    this.setState({errors: [resp.comment]})
                }
            })
            .catch((err) => {
                console.log(err.message)
            })
        // this.setState({loginState: true})
    }

    render() {

        if (this.state.loginState) {
            return <Navigate to={`/main/${this.state.AccountName}`} />
        }
        const errors = this.state.errors;
        return (
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                        >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <HowToRegIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        <Box component="form" onSubmit={this.handleSubmit} noValidate sx={{ mt: 1 }}>
                            {errors.map((err) => (
                                <p className="notice" key={err}>Error: {err}</p>
                            ))}
                                
                            {/* <Grid TextField xs={9} sm={3}> */}

                            
                            <TextField
                                margin="normal"
                                required
                                // fullWidth
                                label="Account Name"
                                name="AccountName"
                                ref="AccountName"
                                autoComplete="email"
                                autoFocus
                                onChange={evt => this.setState({AccountName: evt.target.value})}
                                value={this.state.AccountName}
                                />
                            {/* </Grid>
                            <Grid TextField xs={9} sm={3}> */}
                            <TextField
                                margin="normal"
                                required
                                // fullWidth
                                label="Display Name"
                                name="DisplayName"
                                ref="DisplayName"
                                autoComplete="email"
                                autoFocus
                                onChange={evt => this.setState({DisplayName: evt.target.value})}
                                value={this.state.DisplayName}
                                />
                            {/* </Grid>
                            <Grid> */}
                            <TextField
                                margin="normal"
                                required
                                // fullWidth
                                label="Email Address"
                                name="EmailAddress"
                                ref="EmailAddress"
                                autoComplete="email"
                                autoFocus
                                onChange={evt => this.setState({EmailAddress: evt.target.value})}
                                value={this.state.EmailAddress}
                                />
                            
                            <TextField
                                margin="normal"
                                required
                                // fullWidth
                                label="Phone Number"
                                name="PhoneNumber"
                                ref="PhoneNumber"
                                autoComplete="email"
                                autoFocus
                                onChange={evt => this.setState({PhoneNumber: evt.target.value})}
                                value={this.state.PhoneNumber}
                                />
                            <TextField
                                margin="normal"
                                required
                                // fullWidth
                                label="Date of Birth"
                                name="DateofBirth"
                                ref="DateofBirth"
                                autoComplete="email"
                                autoFocus
                                onChange={evt => this.setState({DateofBirth: evt.target.value})}
                                value={this.state.DateofBirth}
                                />
                            <TextField
                                margin="normal"
                                required
                                // fullWidth
                                label="Zipcode"
                                name="Zipcode"
                                ref="Zipcode"
                                autoComplete="email"
                                autoFocus
                                onChange={evt => this.setState({Zipcode: evt.target.value})}
                                value={this.state.Zipcode}
                                />
                            <TextField
                                margin="normal"
                                required
                                // fullWidth
                                label="Password"
                                name="Password"
                                ref="Password"
                                autoComplete="email"
                                autoFocus
                                onChange={evt => this.setState({Password: evt.target.value})}
                                value={this.state.Password}
                                />
                            <TextField
                                margin="normal"
                                required
                                // fullWidth
                                label="Password Confirmation"
                                name="PasswordCfm"
                                ref="PasswordCfm"
                                autoComplete="email"
                                autoFocus
                                onChange={evt => this.setState({PasswordCfm: evt.target.value})}
                                value={this.state.PasswordCfm}
                                />
                            {/* </Grid> */}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                >
                                Sign Up
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
            // <>
            // <form onSubmit={this.handleSubmit}>
            //     {errors.map((err) => (
            //         <p className="notice" key={err}>Error: {err}</p>
            //     ))}
            //     <label>
            //         Account Name
            //         <input name={"AccountName"} ref={"AccountName"} type={"text"} value={this.state.AccountName} onChange={evt => this.setState({AccountName: evt.target.value})} />
            //     </label>
            //     <br />
            //     <label>
            //         Display Name
            //         <input name={"DisplayName"} ref={"DisplayName"} type={"text"} value={this.state.DisplayName} onChange={evt => this.setState({DisplayName: evt.target.value})} />
            //     </label>
            //     <br />
            //     <label>
            //         Email Address
            //         <input name={"EmailAddress"} ref={"EmailAddress"} type={"text"} value={this.state.EmailAddress} onChange={evt => this.setState({EmailAddress: evt.target.value})} />
            //     </label>
            //     <br />
            //     <label>
            //         Phone Number
            //         <input name={"PhoneNumber"} ref={"PhoneNumber"} type={"text"} value={this.state.PhoneNumber} onChange={evt => this.setState({PhoneNumber: evt.target.value})}/>
            //     </label>
            //     <br />
            //     <label>
            //         Date of Birth
            //         <input name={"DateofBirth"} ref={"DateofBirth"} type={"date"} value={this.state.DateofBirth} onChange={evt => this.setState({DateofBirth: evt.target.value})} />
            //     </label>
            //     <br />
            //     <label>
            //         Zipcode
            //         <input name={"Zipcode"} ref={"Zipcode"} type={"number"} value={this.state.value} onChange={evt => this.setState({Zipcode: evt.target.value})} />
            //     </label>
            //     <br />
            //     <label>
            //         Password
            //         <input name={"Password"} ref={"Password"} type={"password"} value={this.state.value} onChange={evt => this.setState({Password: evt.target.value})} />
            //     </label>
            //     <br />
            //     <label>
            //         Password Confirmation
            //         <input name={"PasswordCfm"} ref={"PasswordCfm"} type={"password"} value={this.state.value} onChange={evt => this.setState({PasswordCfm: evt.target.value})} />
            //     </label>
            //     <br />
            //     <input type={"submit"} value={"Submit"}/>
            // </form>

            // </>
        )
    }
}

export class SignInForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {loginState: false,
            UserName: "",
            userId: "",
            errors: "",
            UsernameTypein: "",
            PasswordTypein: ""
        };

        // this.handleSubmit = this.handleSubmit.bind(this);

    }

    change = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
        this.setState({loginState: false})
    }

    handleLogin = () => {
        var BODY = {
            username: this.state.UsernameTypein,
            password: this.state.PasswordTypein
        }
        fetch(`${apiUrl}/login`, {
            credentials: 'include',
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(BODY)
        })
            // .then((res) => console.log(res))
            .then((response) => response.json())
            .then((resp) => {
                if(resp.result === 'success') {
                    this.setState({
                        errors: "",
                        UserName: this.state.UsernameTypein,
                        loginState: true
                    })
                    console.log(`${resp.username} logged in successfully`)
                }
                else {
                    this.setState({errors: "No Such User or Wrong Password"})
                }
            })
            .catch((err) => {
                console.log(err.message)
            })
    }

    render() {
        if (this.state.loginState) {
            return <Navigate to={`/main/${this.state.UserName}`} />
        }
        else {

        }
        return (
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                        >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Username"
                                name="UsernameTypein"
                                autoComplete="email"
                                autoFocus
                                onChange={this.change}
                                value={this.state.UsernameTypein}
                                />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                name="PasswordTypein"
                                autoComplete="email"
                                autoFocus
                                onChange={this.change}
                                value={this.state.PasswordTypein}
                                />
                            <Button
                                onClick={this.handleLogin}
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                >
                                Sign In
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
            // {/* <>
            //     <p className="notice">{this.state.errors}</p>
            //     <label>
            //         Username
            //         <input name="UsernameTypein" ref="UserName" onChange={this.change} value={this.state.UsernameTypein} type={"text"} />
            //     </label>
            //     <br/>
            //     <label>
            //         Password
            //         <input name="PasswordTypein" ref="Password" onChange={this.change} value={this.state.PasswordTypein} type={"text"} />
            //     </label>
            //     <br/>
            //     <button className="signinbutton" name="Submit" onClick={this.handleLogin} value="Log in" />
            // </> */}
        )
    }
}

export default function Auth() {
    return (
        <Container sx={{height:'25%'}}>
            <Icon />
            <Grid container spacing={1} justifyContent="center">
                <Grid item xs={5} alignItems="center">
                    <RegForm />
                </Grid>
                <Grid item xs={5} alignItems="center">
                    <Stack alignItems={"center"}>
                        <SignInForm /><br />
                        <form action={`${apiUrl}/auth/google`}>
                            <Button fullWidth type="submit" variant="contained" startIcon={<GoogleIcon />}>
                                Sign in with Google
                            </Button>
                        </form>
                    </Stack>
                    
                    
                </Grid>
                {/* <Grid item xs={2}>
                    <form action={`${apiUrl}/auth/google`}>
                        <Button type="submit" variant="contained" startIcon={<GoogleIcon />}>
                            Sign in with Google
                        </Button>
                    </form>
                </Grid> */}
            </Grid>
            {/* <a className={"Google-SignIn-Btn"} href={`${apiUrl}/auth/google`}>Sign in with google</a> */}
            

        </Container>
    // </div>
                // <a className={"Google-SignIn-Btn"} href={`${apiUrl}/auth/google`}>Sign in with google</a>
    //         <div className="regForm" name={"RegForm"}>
    //             <RegForm />
    //         </div>
    //         <div className="signForm" name={"SignInForm"}>
    //             <SignInForm />
    //         </div>
    //     </>
    )
}

// function matchJsonUsers(InputUsername, InputPassword) {
//     for (let i=0; i<users.length; i++) {
//         if (users[i].username === InputUsername && users[i].address.street === InputPassword) {
//             return true;
//         }
//     }
//     return false;
// }