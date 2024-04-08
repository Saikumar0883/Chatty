import React, { useState, useContext } from 'react';
import { TextField, Button, Link, Typography, Container } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Navigate } from 'react-router-dom';
import { UserContext } from './userContext'
import Header from './Header';
const Signin = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [userNameError, setUserNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo, isLoading } = useContext(UserContext)

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
    setUserNameError('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError('');
  };




  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:4000/signup', {
        method: 'POST',
        body: JSON.stringify({ password, userName }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (response.ok) {
        response.json().then(userInfo => {
          setPasswordError('');
          console.log(userInfo)
          setUserInfo(userInfo)
          setRedirect(true)
        })
      }
      else {
        const data = await response.json()
        console.log(data.errors);
        setUserNameError(data.errors.userName)
        setPasswordError(data.errors.password)
      }

    } catch (error) {
      console.error('Error during registration:', error);
      console.log(error.data)

    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }


  return (
    <>
      <Header />
      <Container component="main" maxWidth="xs">
        <div style={{ marginTop: '5vh', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #ccc', borderRadius: '8px', padding: '40px 30px', boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.1)' }}>
          <AccountCircleIcon style={{ fontSize: 50, marginBottom: '2vh', color: '#3f51b5' }} />
          <Typography component="h1" variant="h5" style={{ marginBottom: '2vh', color: '#3f51b5', fontWeight: 'bold' }}>
            Signup
          </Typography>
          <form
            style={{ width: '100%', }}
            onSubmit={handleSubmit}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="userName"
              label="User Name"
              name="userName"
              // autoFocus
              value={userName}
              onChange={handleUserNameChange}
              error={!!userNameError}
              helperText={userNameError}
              sx={{
                '& .MuiInputBase-root': {
                  height: '50px', // Set your desired height here
                },
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              error={!!passwordError}
              helperText={passwordError}
              sx={{
                '& .MuiInputBase-root': {
                  height: '50px', // Set your desired height here
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              style={{ marginBottom: '1vh', backgroundColor: '#265073', color: '#fff' }}
            >
              signup
            </Button>

            <Typography component="div" style={{ marginTop: '1vh', textAlign: 'center' }}>
              <Link href="login" variant="body2" color={'#265073'}>
                Already Registered? Login
              </Link>
            </Typography>
          </form>
        </div>
      </Container>
    </>
  );
};

export default Signin;

