const Product = require('../modles/product');
const mongodb = require('mongodb');

exports.getAddProduct = (req, res, next)=>{
    // if(!req.session.isAuthenticated){
    //     return res.redirect('/login');
    // }
    res.render('admin/edit-product', { 
        pageTitle: 'Add Product', 
        path: '/admin/add-product',
        editing: false,
       // isAuthenticated: req.session.isLoggedIn
                                });
                            }

exports.postAddProduct = (req, res, next)=>{
    //console.log(req.body);
    const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  //console.log(req.user);
 //const product = new Product(title, price, description, imageUrl, null, req.user._id);
 const product = new Product({
     title: title,
     price: price,
     description: description,
     imageUrl: imageUrl,
     userId: req.user
 });

 product.save().then(result=>{
       //  console.log(result);
        console.log('Create Product');
        res.redirect('/admin/products');
    }).catch(err=>console.log(err));
}

exports.getEditProduct = (req, res, next)=>{
    const editMode = req.query.edit;
    
    if(!editMode) {
       return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
        if(!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', { 
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product,
            //isAuthenticated: req.session.isLoggedIn
        });
    }).catch(err=>console.log(err)); 
    
}

exports.postEditProduct = (req, res, next) => {
    // console.log(req.body);
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
 
       // const product = new Product(updatedTitle, updatedPrice, updatedDesc, updatedImageUrl,  prodId);
       Product.findById(prodId)
       .then(product => {
           if(product.userId.toString() !== req.user._id.toString()){
               return res.redirect('/')
           }
           product.title = updatedTitle;
           product.price = updatedPrice;
           product.description = updatedDesc;
           product.imageUrl = updatedImageUrl;
           return product.save().then(result=>{
            console.log('UPDATE PRODUCT');
            res.redirect('/admin/products');
       });
        }).catch(err=>console.log(err));
    //}).catch(err=>console.log(err));
}

exports.getProducts = (req, res, next) => {
    Product.find({userId: req.user._id})
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      //  console.log(products);
        res.render('admin/products', 
     {prods: products,
      pageTitle: 'Admin Product', 
      path: '/admin/products',
      //isAuthenticated: req.session.isLoggedIn
     });
    }).catch(err=>console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    //Product.findByIdAndRemove(prodId)
    Product.deleteOne({_id: prodId, userId: req.user._id})
    .then(()=>{
          console.log('DESTROYED PRODUCT');
          res.redirect('/admin/products');
      }).catch(err=> console.log(err));
    //}).catch(err=>console.log(err));
}
