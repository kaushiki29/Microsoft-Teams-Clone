import React, { Component } from "react";
import Avatar from "../components/Avatar";
import ImageModal from "./ImageModal";
import Linkify from 'react-linkify';
import useMediaQuery from '@material-ui/core/useMediaQuery';


export default class ChatItemTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: 'Today'
    }
    this.month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  }
  // isMobile = useMediaQuery('(max-width:600px)')
  formatAMPM = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
  componentDidMount() {
    this.time = new Date(this.props.sent_time);
    this.day = 'Today';
    if (new Date().getTime() - this.time.getTime() > (new Date().getHours() * 1000 * 60 * 60 + new Date().getMinutes() * 1000 * 60)) {
      this.day = this.time.getDate() + '-' + this.month[this.time.getMonth()] + '-' + this.time.getFullYear();
    }
    this.setState({
      day: this.day,
    })

  }


  setOpen = () => {
    this.setState({
      open: true,
    })
  }

  handleClose = () => {
    this.setState({
      open: false,
    })
  }
  render() {
    const style = {
      '@media (max-width: 500px)': {
        display: 'none',
      },
    }
    return (
      <div
        style={{ animationDelay: `0.8s` }}
        className={`chat__item ${this.props.user ? this.props.user : ""}`}
      >
        <div className="chat__item__content">
          <div className="chat__msg" style={{ fontSize: 17, fontWeight: 'bold' }} >{this.props.sender_name}</div>
          {this.props.type == 'txt' && <Linkify ><div className="chat__msg">{this.props.msg}</div></Linkify>}
          {this.props.type == 'img' && <img onClick={this.setOpen} src={"https://www.msteams.games:9000" + this.props.img} style={{ width: 200, height: 200, objectFit: 'contain' }}></img>}
          <div className="chat__meta">
            <span>{this.formatAMPM(new Date(this.props.sent_time))}  &nbsp; {this.state.day}</span>
            {/* <span>Seen 1.03PM</span> */}
          </div>
        </div>
        <div style={style}><Avatar isOnline="active" image={this.props.image} /></div>
        <ImageModal img={this.props.img} open={this.state.open} handleClose={this.handleClose} />
      </div>
    );
  }
}
