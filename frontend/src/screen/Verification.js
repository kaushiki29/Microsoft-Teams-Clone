import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            // width: '38ch',

        },
    },

    image: {
        width: "99px",
        height: "99px",
    }
}));

function Verification() {
    const classes = useStyles();
    const history = useHistory();
    const handleSignup = () => {
        history.push('/signup');
    }
    return (
        <div className="login">
            <div className="form" style={{ padding: "2%" }}>
                <img src="https://img.icons8.com/fluent/48/000000/microsoft-teams-2019.png" alt="MS-Teams Icon" className={classes.image} />
                <h1 style={{ margin: 0, marginTop: "3%", marginBottom: "3%" }}>Thank you for taking time out to SIGNUP</h1>
                <h3 style={{ margin: 0, marginTop: "3%", marginBottom: "3%", textAlign: "center" }}>Please check your email to verify your account and proceed further.</h3>

                <Button color="primary" style={{ display: "grid" }} onClick={handleSignup}>
                    <div>No account yet? </div>
                    <div style={{ fontWeight: "bolder" }}>Create one!</div>
                </Button>
            </div>
        </div>
    )
}

export default Verification
