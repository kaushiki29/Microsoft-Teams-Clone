import React from 'react'
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';


// Css


const useStyles = makeStyles((theme) => ({

    modal: {
        display: 'flex',
        padding: theme.spacing(1),
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalDiv: {
        margin: 'auto',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: "column",
        padding: 20,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        padding: 20
    },

    button: {
        outline: 'none',
        border: 'none',
        height: 36,
        width: 150,
        backgroundColor: '#464775',
        cursor: 'pointer'
    },

    close: {
        height: 40,
        width: 40,
        cursor: 'pointer'
    },

    img: {
        maxWidth: '85vw',
        maxHeight: '85vh',
        objectFit: 'contain'
    }
}));


export default function ImageModal(props) {
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
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <CloseIcon className={classes.close} onClick={props.handleClose} />
                </div>
                <img src={"https://www.msteams.games:9000" + props.img} className={classes.img} ></img>
            </div>
        </Modal>
    )
}


