import React,{useState,useEffect} from 'react'
import Navbar from '../components/Navbar'
import ChatIcon from '@material-ui/icons/Chat';
import CallIcon from '@material-ui/icons/Call';
import { makeStyles } from '@material-ui/core/styles';
import PeopleIcon from '@material-ui/icons/People';
import ChatList from '../components/ChatList';
import ChatContent from '../components/ChatContent';
import Sidebar from '../components/Sidebar';
import {unmountComponentAtNode, useParams,useHistory } from 'react-router-dom';
import axios from 'axios';
import { api } from './Helper';


const useStyles = makeStyles((theme) => ({
    sidebar: {
        width: "68px",
        boxShadow: " 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ebebeb",
        color: "#6264a7",
        alignItems: "center",
        position: "fixed",
        left: "0",
        height: "100vh",
    },

    p: {
        margin: "0",
    },

    sidediv: {
        display: "flex",
        padding: "24%",
        alignItems: "center",
        cursor: "pointer",
        flexDirection: "column",
        '&:hover': {
            backgroundColor: "white",
        }
    },

    subComponent: {
        // alignItems: "center",
        // maxWidth: "90%",
        // minHeight: "94.5vh",
        boxSizing: "border-box",
        display: "flex",
        borderRadius: "10px",
        marginLeft: "68px",
        paddingBottom: 0,
        // justifyContent: "center",
        paddingLeft: 0,
        marginRight: "auto",
        // flexDirection: "column",
        backgroundColor: "#f5f5f5",
        padding: "20px",
        marginTop: "56px"

    },

    webkitScrollbar: {
        width: "5px",
    },

    webkitScrollbarTrack: {
        backgroundColor: "#f1f1f1"
    },

    webkitScrollbarThumb: {
        backgroundColor: "purple",
        borderRadius: "10px"
    },


}));

function Chat() {
    const classes = useStyles();
    const history = useHistory();
    const token = localStorage.getItem('token');
    const [chatuuid,setChatuuid] = useState();
    const [chatItms,setChatItms] = useState([]);
    const [otherUserName,setOtherUserName] = useState('');
    const [allChatUsers,setAllChatUsers] = useState([]);
    const {chat_uuid} = useParams();
    useEffect(()=>{
        fetchChatList();
        
        setChatuuid(chat_uuid);
    },[]);

    useEffect(()=>{
        setChatItms([]);
        fetchMsgs();
    },[chatuuid]);

    const fetchMsgs=()=>{
        if(chatuuid && chatuuid!=='all-conversations'){
            // console.log(chatuuid)
            axios({
                method: 'post',
                url: api + 'communication/get_thread_messages',
                data: {'thread_id': chatuuid},
                headers: {Authorization: 'Token '+ token}
            })
            .then(res=>{
                // console.log(res.data);
                setChatItms(res.data.all_msgs);
                setOtherUserName(res.data.name);
            })
            .catch(err=>{
                console.log(err);
            })
        }
    }

    const fetchChatList=()=>{
        
        axios({
            method: 'post',
            url: api + 'communication/get_all_threads',
            headers: {Authorization: 'Token '+ token}
        })
        .then(res=>{
            // console.log(res.data);
            let obj = "";
            let all_uuid = res.data.all_uuid.map(i=>{
                if(i.thread_id===chat_uuid){
                    obj ={
                        active: true,
                        has_unseen_messages: i.has_unseen_messages,
                        other_user: i.other_user,
                        thread_id: i.thread_id,
                        unseen_messages_count: i.unseen_messages_count,
                        other_user_name: i.other_user_name
                    }
                    return obj;
                }
                else{
                    return i;
                }
             });
            setAllChatUsers(all_uuid);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const setCurrChatuuid=(uuid)=>{
        // console.log('user changes');
        setChatuuid(uuid);
        setOtherUserName("");
        history.push('/chat/'+uuid);
        // console.log(uuid);
        
    }
    return (
        <div>
            <Navbar />
            <div style={{ display: 'flex', height: '100%', backgroundColor: "#f5f5f5" }}>
                <Sidebar />
            </div>
            <div className={classes.subComponent} >
                <ChatList allChatUsers={allChatUsers} setCurrChatuuid = {setCurrChatuuid} thread_id={chatuuid} />
                {otherUserName &&
                    <ChatContent chatItms={chatItms} thread_id={chatuuid} setChatItms={setChatItms} name={otherUserName}  />
                }
            </div>
        </div>
    )
}

export default Chat
