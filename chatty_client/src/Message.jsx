import React, {Component} from 'react';

class Message extends Component {
  render() {
    console.log('Rendering <Message/>')
    return (
      <div className='message'>
        <span className={`message-username-${this.props.message.colorNum}`}>{this.props.message.username}</span>
        <span className='message-content'>{this.props.message.content}{this.props.message.image && <img className='message-image' src={this.props.message.image}/>}</span>
      </div>
    );
  }
};

export default Message;
