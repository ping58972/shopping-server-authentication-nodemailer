const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../modles/user');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
  }
}));

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('cookie').split(';')[0].trim().split('=')[1] === 'true';
  //console.log(req.session.isLoggedIn);
  //console.log(req.flash('error'));
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
         res.render('auth/login', {
           path: '/login',
           pageTitle: 'Login',
           //isAuthenticated: false
           errorMessage: message
         });
       
   
   };
   exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
     // isAuthenticated: false
     errorMessage: message
    });
  };
exports.postLogin = (req, res, next) => {
    //req.isLoggedIn = true;
    //res.setHeader('Set-Cookie', 'loggedId=true');
    const email = req.body.email;
    const password = req.body.password;
    //User.findById('5cf8915ffcf7093404b2dca4')
    User.findOne({email: email})
    .then(user => {
      if(!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      bcrypt.compare(password, user.password).then(doMatch => {
        if(doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            return res.redirect('/'); 
          });
        }
        req.flash('error', 'Invalid email or password.');
        res.redirect('/login');
      }).catch(err => {
        console.log(err);
        res.redirect('/login');
      });
      
    })
    .catch(err=>console.log(err));
   };
   
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({email: email}).then(userDoc => {
    if(userDoc) {
      req.flash('error', 'E-mail exist already, please pick a different one!');
      return res.redirect('/signup');
    }
    return bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email, password: hashedPassword,
        cart: {items: []}
      });
      return user.save();
    }).then( result => {
      res.redirect('/login');
      return transporter.sendMail({
        to: email,
        from: 'ping@ping58972.com',
        subject: 'SignUp succeeded!',
        html: '<h1>You successfully signed up!</h1>'
      });
      
    }).catch(err=>console.log(err));
  })
  .catch(err=>console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
  