import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import Message from './Message.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: {
        name: '',
        colorNum: Math.floor((Math.random() * 6) + 1)
      },
      messages: [], // messages coming from the server will be stored here as they arrive
      userCount: '0'
    };
    this.changeName = this.changeName.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:3001/socketserver');
    this.socket.onopen = (event) => {
      console.log('Connected to Server');
    };
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch(data.type) {
        case 'incomingMessage':
          this.incomingMessage(data);
          break;
        case 'incomingNotification':
          this.incomingNotification(data);
          break;
        case 'userCountChanged':
          this.userCountChanged(data);
          break;
        default:
          throw new Error('Unknown event type ' + data.type);
      }
    };
  }

  userCountChanged(data) {
    const userCount = data.userCount;
    this.setState({ userCount: userCount })
  }

  incomingMessage(data) {
    const messages = this.state.messages.concat(data);
    this.setState({ messages: messages });
  }

  incomingNotification(data) {
    const notification = {
      id: data.id,
      notification: true,
      content: data.content
    }
    const messages = this.state.messages.concat(notification);
    this.setState({ messages: messages });
  }

  changeName(event) {
    if (event.key === 'Enter') {
      const oldName = this.state.currentUser.name;
      const newName = event.target.value;
      const currentUser = {
        name: newName,
        colorNum: this.state.currentUser.colorNum
      };
      this.setState({ currentUser: currentUser });
      const notification = {
        type: 'postNotification',
        content: `${oldName || 'Anonymous'} has changed name to ${newName}.`
      };
      this.socket.send(JSON.stringify(notification));
    }
  }

  sendMessage(event) {
    if (event.key === 'Enter') {
      const newMessage = {
        type: 'newMessage',
        username: this.state.currentUser.name || 'Anonymous',
        content: event.target.value,
        colorNum: this.state.currentUser.colorNum
      };
      document.getElementById('message-input').value = '';
      this.socket.send(JSON.stringify(newMessage));
    }
  }

  render() {
    console.log('Rendering <App/>');
    return (
      <div>
        <nav className='navbar'>
          <a href='/' className='navbar-brand'>Chatty</a>
          <span className='navbar-usercount'>Users online: {this.state.userCount}</span>
        </nav>
        <main className='messages'>
          <MessageList messages={this.state.messages} />
        </main>
        <ChatBar
          currentUser={this.state.currentUser}
          sendMessage={this.sendMessage}
          changeName={this.changeName}
        />
      </div>
    );
  }
};

export default App;
