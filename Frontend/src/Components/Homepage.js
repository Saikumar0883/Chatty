import React, { useState, useEffect, useContext,useRef } from 'react';
import Header from './Header';
import { UserContext } from './userContext'
import { format } from 'date-fns';
import io from 'socket.io-client'
import '../App.css'
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import {  Button, Snackbar } from '@mui/material';
const socket = io.connect('http://127.0.0.1:4000')
const Homepage = () => {
  const { userInfo, isLoading } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [theme, setTheme] = useState('light');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const scrollref = useRef(null)
  const Id = userInfo?.id;

  useEffect(() => {
    console.log("hello");
    socket.emit("getOldMessages");
    socket.on("getmsgs", (payload) => {
      setChat(payload);
      scroll()
    });
  }, []);

  const renderChat = () => {
    return chat.map((data) => {
      let ownmessage = true;
      if (Id) {
        if (Id === data.Id) ownmessage = true;
        else ownmessage = false;
      } else ownmessage = false;

      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
      const userName = ownmessage ? "You" : capitalizeFirstLetter(data.name);
      return (
        <li key={data.id || Math.random()} className={ownmessage ? "message-right" : "message-left"}>
          <p className='message'>
            <span className='user'>{`~ ${userName}`}</span>
            <span className='content'> {data.message}</span>
            <span>{`${format(new Date(data.time), 'PPP h:mm aa')}`}</span>
          </p>
        </li>
      );
    });
  };

  const handleMessageChange = (event) => {
    event.preventDefault();
    setMessage(event.target.value);
  };


  const handleSend = (e) => {
    e.preventDefault();
    if (!userInfo) {
      setSnackbarMessage('Please Login to send the messages');
      setSnackbarOpen(true);
      
    }
    else {
      if (message.length) {
        setMessage('');
        const data = {
          name: userInfo?.userName,
          Id: userInfo?.id,
          message: message,
          time: new Date(),
        }
        socket.emit("sendmessage", data);
        
      }
    }
  };

  useEffect(() => {
    scroll()
  },[chat])
  const scroll = () => {
    if (scrollref.current) {
      scrollref.current.scrollTop = scrollref.current.scrollHeight;
    }
  }
  useEffect(() => {
    socket.on('sentmessage', (data) => {
      setChat(prevChat => [...prevChat, data]);
      scroll()
    });
    return () => {
      socket.off("sentmessage");
    };
  }, [Id]);


  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (

    <div className={theme === 'dark' ? 'dark-theme' : 'light-theme'}>
      <Header />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <Button size="small" onClick={handleCloseSnackbar} sx={{color: 'white'}}>Close</Button>
        }
      />
     <div style={{ display: 'flex', justifyContent: 'flex-end', margin:'5px 15px 0 0' }}>
        {/* Header content here */}
        <button className="theme-toggle-button" onClick={toggleTheme} >
          {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </button>
      </div>
      <div style={{ flex: 1, margin: '2% 8% 0 12%' }}>
        <div className='Message-container' style={{ overflowY: 'auto', overflow: 'auto' }} >
          <ul className='Message-container' id='Message-container'  ref={scrollref}>
            {chat.length > 0 && renderChat()}
          </ul>
        </div>

        <form className='message-form' style={{ flex: '1', display: 'flex', }}>
          <input type='text' name='message' className='message-input' placeholder="Enter Message" onChange={handleMessageChange} value={message} />
          <button type='submit' className='send-button' onClick={handleSend}>Send</button>
        </form>
      </div>
    </div>
  );
};

export default Homepage;
