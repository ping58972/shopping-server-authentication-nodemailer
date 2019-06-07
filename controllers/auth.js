const User = require('../modles/user');

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('cookie').split(';')[0].trim().split('=')[1] === 'true';
  //console.log(req.session.isLoggedIn);
         res.render('auth/login', {
           path: '/login',
           pageTitle: 'Login',
           isAuthenticated: false
         });
       
   
   };
exports.postLogin = (req, res, next) => {
    //req.isLoggedIn = true;
    //res.setHeader('Set-Cookie', 'loggedId=true');
    User.findById('5cf8915ffcf7093404b2dca4')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect('/'); 
      });
    })
    .catch(err=>console.log(err));
   };
  
exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
  