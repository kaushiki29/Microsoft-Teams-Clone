import React from 'react'
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';


// Css Style

const useStyles = makeStyles((theme) => ({

    modal: {
        display: 'flex',
        padding: theme.spacing(1),
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalDiv: {
        margin: 'auto',
        width: 400,
        backgroundColor: 'white',
        height: 150,
        display: 'flex',
        flexDirection: "column",
        padding: 20,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },

    button: {
        outline: 'none',
        border: 'none',
        height: 36,
        width: 150,
        backgroundColor: '#464775',
        cursor: 'pointer'
    }
}));


export default function WarningModal(props) {
    const classes = useStyles();
    const history = useHistory();


    const handleRedirect = () => {
        history.push(props.redirect);
    }


    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={props.open}
            onClose={props.handleClose}
        >
            <div className={classes.modalDiv}>
                <p style={{ fontSize: 20, margin: 0 }}>{props.text}</p>
                <button className={classes.button} onClick={handleRedirect}>
                    <p style={{ margin: 0, fontSize: 15, color: 'white' }}>OK</p>
                </button>
            </div>
        </Modal>
    )
}


