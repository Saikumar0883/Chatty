const User = require('../models/User')
const Message = require('../models/Message')
const jwt = require('jsonwebtoken')

//handle errors
const handleErrors = (err) => {
    let errors = { userName: '', password: '' }

    //incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'that password is incorrect';
        return errors;
    }

    //duplicate error code
    if (err.code === 11000) {
        errors.userName = 'That userName is already registered';
        return errors;
    }
    //validate errors
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

//creating tokens
const secret = 'aer34tsdfq34taasdfadfadfadfad';
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id, userName) => {
    return jwt.sign({ id, userName }, secret, {
        expiresIn: maxAge,
    })
}
module.exports.signup_get = (req, res) => {
    res.send("ok")
}

module.exports.login_get = (req, res) => {
    console.log("logingetcookie", req.cookies)
    res.send(req.cookies);
}

module.exports.signup_post = async (req, res) => {
    console.log(req.body)
    const { password, userName,  } = req.body;

    try {
        const user = await User.create({ userName, password, });
        console.log("From signup post after user being created ", user);
      
        const token = createToken(user._id, user.userName);
        res.cookie('jwt', token, {
            maxAge: maxAge * 1000,
            httpOnly: true,
        });
       
        res.status(201).json({ id: user._id.toString(), userName: user.userName });
    } catch (err) {
        const errors = handleErrors(err);
       
        res.status(400).json({ errors });
    }

}

module.exports.login_post = async (req, res) => {
    const { userName, password } = req.body;
    console.log(userName, password);
    try {
        const user = await User.login(userName, password);
        const token = createToken(user._id, user.userName);
        res.cookie('jwt', token, {
            maxAge: maxAge * 1000,
            httpOnly: true,
        });
        res.status(200).json({ id: user._id, userName: user.userName });
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({ errors })
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.json({ suc: true });
   
}

module.exports.profile_get = (req, res) => {
    
    const token = req.cookies.jwt
    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }
    jwt.verify(token, secret, {}, async (err, info) => {
      
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        // console.log("Iam from profile ", info);
        res.json(info);
    })
}


