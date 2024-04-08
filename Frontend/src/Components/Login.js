
import React, { useState,useContext } from 'react';
import { TextField, Button, Container, Typography, Link } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { UserContext } from './userContext';
import { Navigate } from 'react-router-dom'
import Header from './Header';
const Login = () => {
  const [userName, setuserName] = useState('');
  const [password, setPassword] = useState('');
  const [userNameError, setuserNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext)

  const handleuserNameChange = (event) => {
    setuserName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  async function handleSubmit(event) {
    event.preventDefault()
    const response = await fetch('http://127.0.0.1:4000/login', {
      method: 'POST',
      body: JSON.stringify({ userName, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    if (response.ok) {
      response.json().then((userInfo) => {
        console.log(userInfo);
        setUserInfo(userInfo);
        setRedirect(true);
      })
    }
    else {
      alert('Wrong Credentials');
      const err = await response.json();
      setuserNameError(err.errors.userName);
      setPasswordError(err.errors.password);
    }
  }
  if (redirect)
    return <Navigate to={'/'} />

  return (
    <>
    <Header />
    <Container component="main" maxWidth="xs">
      <div style={{ marginTop: '5vh', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #ccc', borderRadius: '8px', padding: '40px 30px', boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.1)' }}>
        <PersonIcon style={{ fontSize: 50, marginBottom: '2vh', color: '#3f51b5' }} />
        <Typography component="h1" variant="h5" style={{ marginBottom: '2vh', color: '#3f51b5', fontWeight: 'bold' }}>
          Login
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
            label="userName"
            name="userName"
            autoFocus
            value={userName}
            onChange={handleuserNameChange}
            error={!!userNameError}
            helperText={userNameError}
            style={{ marginBottom: '1.5vh' }}
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
            style={{ marginBottom: '2.5vh' }}
            sx={{
              '& .MuiInputBase-root': {
                height: '50px', // Set your desired height here
                color:'#265073'
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
           
            style={{ marginBottom: '1vh', backgroundColor: '#265073', color: '#fff' }}
          >
            Login
          </Button>
         
          <Typography component="div" style={{ marginTop: '1vh', textAlign: 'center' }}>
            <Link href="signup" variant="body2" style={{ color: '#265073' }}>
              Don't have an account? Sign up
            </Link>
          </Typography>
        </form>
      </div>
      </Container>
      </>
  );
};

export default Login;
