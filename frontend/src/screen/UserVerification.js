import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom';
import { api } from '../screen/Helper'
import WarningModal from '../components/WarningModal';

function UserVerification(props) {
    const { email_uuid } = useParams();
    const [open, setOpen] = useState(false);
    const [verified, isVerified] = useState(false);
    const [token, setToken] = useState("")

    useEffect(() => {
        axios({
            method: 'post',
            data: {
                email_uuid: email_uuid
            },
            url: api + "auth/verify_email",
            headers: {

            }
        })
            .then(res => {
                console.log(res.data)
                isVerified(res.data.is_verified);
                if (res.data.is_verified) {
                    localStorage.setItem("token", res.data.token);
                    props.refreshToken();
                    setToken(res.data.token)
                }
                setOpen(true)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    const handleClose = () => {
        console.log("Closed")
    }

    return (
        // <WarningModal open={open} handleClose={handleClose} text={"This email has been successfully verified."} redirect={"/home"} />
        <div>
            {verified && token ? <WarningModal open={open} handleClose={handleClose} text={"This email has been successfully verified."} redirect={"/home"} /> :
                <WarningModal open={open} handleClose={handleClose} text={"Please try reclicking on the link sent in the email"} redirect={""} />

            }
        </div>
    )
}

export default UserVerification
