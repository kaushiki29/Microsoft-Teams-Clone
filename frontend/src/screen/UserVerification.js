import axios from 'axios';
import React, { useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom';
import { api } from '../screen/Helper'

function UserVerification() {
    const { email_uuid } = useParams();

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
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    return (
        <div>
            You are verified user.
        </div>
    )
}

export default UserVerification
