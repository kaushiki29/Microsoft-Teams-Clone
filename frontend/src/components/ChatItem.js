import React, { Component } from "react";
import Avatar from "../components/Avatar";
import Linkify from 'react-linkify';
export default class ChatItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: 'Today'
    }
    this.month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  }
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
    if (new Date().getTime() - this.time.getTime() > 24 * 60 * 60 * 1000) {
      this.day = this.time.getDate() + '-' + this.month[this.time.getMonth()] + '-' + this.time.getFullYear();
    }
    this.setState({
      day: this.day,
    })

  }
  render() {
    return (
      <div
        style={{ animationDelay: `0.8s` }}
        className={`chat__item ${this.props.user ? this.props.user : ""}`}
      >
        <div className="chat__item__content">
        <Linkify ><div className="chat__msg">{this.props.msg}</div></Linkify>
          <div className="chat__meta">
            <span>{this.formatAMPM(new Date(this.props.sent_time))}  &nbsp; {this.state.day}</span>
            {/* <span>Seen 1.03PM</span> */}
          </div>
        </div>
        <Avatar isOnline="active" image={this.props.image} />
      </div>
    );
  }
}
