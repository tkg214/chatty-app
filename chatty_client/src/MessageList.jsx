import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends Component {
  render() {
    console.log('Rendering <MessageList/>')
    return (
      <div className='system'>
        {this.props.messages.map((message) => {
          if (message.notification) {
            return <div key={message.id} className='message'>{message.content}</div>
          }
          return <Message key={message.id} message={message} />
        })}
      </div>
    );
  }
};

export default MessageList;
