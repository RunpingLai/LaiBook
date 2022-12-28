import React from "react";
import {users} from "../data"
import '../styleSheets.css'
import {
    putEmail,
    putZipcode,
    putAvatar,
    getEmail,
    getZipcode,
    getDob,
    getAvatar,
    getPhone,
    putPhone,
    putPassword
} from "../actions";
// import {Link} from "react-router-dom";
import {LinkAccountForm, UnlinkBtn} from "./LinkAct";
import Avatar from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CardContent } from "@mui/material";

// const imgSrc = "https://www.thesprucepets.com/thmb/UlqV5bn8o9orBDPqwC0pvn-PX4o=/941x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-145577979-d97e955b5d8043fd96747447451f78b7.jpg"

const theme = createTheme();

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        const userName = window.location.href.split("/")[4];
        let profile = {
            username: userName,
            headline: "",
            following: [],
            email: "",
            dob: "",
            zipcode: "",
            avatar: "",
            phone: "",
            password: ""
        };
        // let starPasswords = "**************";
        // starPasswords = "";
        // for (let i=0;i<profile[0].address.street.length;i++){
        //     starPasswords += "*";}

        // console.log(profile);
        this.state = {myProfile:profile, userName:userName, starPassword: "", errors: []};
        this.updateInfo = this.updateInfo.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.file = ""
    }

    async componentDidMount() {
        const email = await getEmail()
        const zipcode = await getZipcode()
        const dob = await getDob()
        const avatar = await getAvatar()
        const phone = await getPhone()

        let profile = this.state.myProfile
        profile.email = email
        profile.zipcode = zipcode
        profile.dob = dob
        profile.avatar = avatar
        profile.phone = phone
        this.setState({myProfile: profile})
    }

    updateInfo(e) {
        e.preventDefault();
        const refs = this.refs;
        // console.log(e.target.Email.value)
        // console.log(refs)
        // let newName = refs.newName.value;
        let newEmail = refs.newEmail.value;
        console.log(newEmail)
        let newPhone = refs.newPhone.value;
        let newZip = refs.newZip.value;
        let newPassword = refs.newPassword.value;
        // let newEmail = e.target.Email.value
        // let newPhone = e.target.PhoneNumber.value
        // let newZip = e.target.Zipcode.value
        // let newPassword = e.target.Password.value
        this.handleUpdateInfo(newEmail, newPhone, newZip, newPassword, this.file);
    }

    handleImageChange(e) {
        e.preventDefault()
        let reader = new FileReader()
        reader.onloadend = () => {
            this.preview = reader.result
            this.forceUpdate()
        }
        if (e.target.files.length !== 0) {
            this.file = e.target.files[0]
            reader.readAsDataURL(this.file)
        }
    }

    async handleUpdateInfo(newEmail, newPhone, newZip, newPassword, newAvatar) {
        let oldProfile = this.state.myProfile;
        let errors = [];
        // if (newName !== "") {
        //     var actnameformat = /^[A-Za-z0-9]*$/;
        //     var isValidActname;
        //     if (/[0-9]/.test(newName)) {
        //         isValidActname = false;
        //     }
        //     else {
        //         if (actnameformat.test(newName)) {
        //             isValidActname = true;
        //         }
        //         else {
        //             isValidActname = false;
        //         }
        //     }
        //     if (isValidActname === true) {
        //         oldProfile.username = newName;
        //     }
        //     else {
        //         errors.push("name format wrong");
        //     }
        // }
        if (newEmail !== "") {
            var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            var isValidMail = mailformat.test(newEmail);
            if (isValidMail === true) {
                oldProfile.email = newEmail;
            }
            else {
                errors.push("email format wrong");
            }
        }
        if (newPhone !== "") {
            var phoneformat = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
            var isValidPhone = phoneformat.test(newPhone);
            if (isValidPhone === true) {
                oldProfile.phone = newPhone;
            }
            else {
                errors.push("phone format wrong");
            }
        }
        if (newZip !== "") {
            var zipcodeformat = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
            var isValidZip = zipcodeformat.test(newZip);
            if (isValidZip === true) {
                oldProfile.zipcode = newZip;
            }
            else {
                errors.push("zipcode format wrong");
                // return
            }
        }
        if (newPassword !== "") await putPassword(newPassword)
        if (errors.length === 0 && newEmail) await putEmail(newEmail)
        if (errors.length === 0 && newZip) await putZipcode(newZip)
        if (errors.length === 0 && newPhone) await putPhone(newPhone)
        if (errors.length === 0 && newAvatar) {
            const nAvatar = await putAvatar(newAvatar)
            oldProfile.avatar = nAvatar
        }
        let newProfile = oldProfile;
        this.setState({myProfile: newProfile, starPassword: "stars", errors:errors});
    }

    render() {
        // console.log("Rendering Profile...")
        const profile = this.state.myProfile
        const username = profile.username
        const email = profile.email
        const dob = profile.dob
        const zipcode = profile.zipcode
        const avatar = profile.avatar
        const phone = profile.phone
        return (
            <ThemeProvider theme={theme}>
                <Grid>
                    <CssBaseline/>
                    {/* <Grid
                        item
                        xs={false}
                        sm={4}
                        md={7}
                        sx={{
                            backgroundImage: 'url(https://source.unsplash.com/random)',
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    /> */}
                    <LinkAccountForm />
                    <UnlinkBtn />
                    <Link href={`/main/${username}`}>Go to Main Page</Link>
                        <br />
                    <Link href="/">Log Out</Link><br />
                        <br />
                    
                    <Card xs={2}>
                        <CardContent>
                            <Typography component="h2" variant="h5">
                                Your Current Information
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                Username: {username}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                Email: {email}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                Phone: {phone}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                Date of Birth: {dob}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                Zipcode: {zipcode}
                            </Typography>
                            <CardMedia
                                component="img"
                                sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
                                image={avatar}
                                alt={"Not Found"}
                            />
                        </CardContent>
                    </Card>
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
                            Update Your Profile
                        </Typography>
                        <Box component="form" onSubmit={this.updateInfo} noValidate sx={{ mt: 1 }}>
                            {/* {errors.map((err) => (
                                <p className="notice" key={err}>Error: {err}</p>
                            ))} */}
                                
                            {/* <Grid TextField xs={9} sm={3}> */}

                            
                            <label>
                                    Avatar
                                    <input type={"file"} accept="image/*" onChange={(e) => this.handleImageChange(e)}/>
                            </label><br />
                            {/* </Grid>
                            <Grid TextField xs={9} sm={3}> */}
                            <TextField
                                margin="normal"
                                // fullWidth
                                label="Email"
                                name="Email"
                                ref={"newEmail"}
                                autoComplete="email"
                                autoFocus
                                />
                            {/* </Grid>
                            <Grid> */}
                            <TextField
                                margin="normal"
                                // fullWidth
                                label="PhoneNumber"
                                name="PhoneNumber"
                                ref="newPhone"
                                autoComplete="email"
                                autoFocus
                                onChange={evt => this.setState({EmailAddress: evt.target.value})}
                                value={this.state.EmailAddress}
                                />
                            
                            <TextField
                                margin="normal"
                                // required
                                // fullWidth
                                label="Zipcode"
                                name="Zipcode"
                                ref="newZip"
                                autoComplete="email"
                                autoFocus
                                />
                            <TextField
                                margin="normal"
                                // required
                                // fullWidth
                                label="Password"
                                name="Password"
                                type={"password"}
                                ref="newPassword"
                                autoFocus
                                />
                            {/* </Grid> */}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                >
                                Update
                            </Button>
                        </Box>
                    </Box>
                    {/* </Grid> */}
                    {/* <div>
                        <Link href={`/main/${username}`}>Go to Main Page</Link>
                        <br />
                        <Link href="/">Log Out</Link><br />
                        <br />
                        <div>
                            <h2>Current Info</h2><br />
                            <img src={avatar} alt={"No avatar found!"} width={"40%"} height={"60%"}></img><br />
                            <span>{"username:"}{username}</span><br></br>
                            <span>{"email:"}{email}</span><br />
                            <span>{"phone:"}{phone}</span><br />
                            <span>{"dob:"}{dob}</span><br />
                            <span>{"password:"}{this.state.starPassword}</span><br />
                            <span>{"zipcode"}{zipcode}</span>
                        </div>
                        <div>
                            <h2>Update Info</h2>
                            {this.state.errors.map((err) => (
                                <p class="notice" key={err}>Error: {err}</p>
                            ))}
                            <form onSubmit={this.updateInfo}>
                                <label>
                                    Avatar
                                    <input type={"file"} accept="image/*" onChange={(e) => this.handleImageChange(e)}/>
                                </label><br />
                                <label>
                                    Email
                                    <input type={"text"} ref={"newEmail"}/>
                                </label><br />
                                <label>
                                    Phone
                                    <input type={"text"} ref={"newPhone"}/>
                                </label><br />
                                <label>
                                    Zip
                                    <input type={"text"} ref={"newZip"}/>
                                </label><br />
                                <label>
                                    Password
                                    <input type={"password"} ref={"newPassword"}/>
                                </label><br />
                                <input type={"submit"} value={"Update Info"} />
                            </form>
                        </div>
                    </div> */}
                </Grid>
            </ThemeProvider>
        )
    }
}