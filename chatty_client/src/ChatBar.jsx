import React, {Component} from 'react';

class ChatBar extends Component {
  render() {
    console.log('Rendering <ChatBar/>');
    return (
      <footer className='chatbar'>
        <input
          className='chatbar-username'
          type='text'
          placeholder='Your Name (Optional)'
          onKeyUp={this.props.changeName}
          defaultValue={this.props.currentUser.name}
        />
        <input
          className='chatbar-message'
          type='text'
          id='message-input'
          placeholder='Type a message and hit ENTER'
          onKeyUp={this.props.sendMessage}
        />
      </footer>
    );
  }
};

export default ChatBar;
