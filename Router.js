const e = require("express");

class Router{
    constructor(app,db){
        this.login(app,db);
        this.isLoggedIn(app,db);
        this.sign(app,db);
        this.showHomeproducts(app,db);
        this.showTrendproducts(app,db);
        this.Cartproducts(app,db);
        this.deleteproduct(app,db);
        this.additemtocart(app,db);
        this.addproduct(app,db);
        this.customsearch(app,db);
        this.totalupdate(app,db);

    }
    totalupdate(app,db){
        
    }
    login(app,db){
        app.post('/login',(req,res) => {
            let username = req.body.username;
            let password = req.body.password;
            username = username.toLowerCase();
            if(username.length > 30 || password.length >30){
                res.json({
                    success: false,
                    msg: 'An errors occured, please try again'
                 
                })
                return;
            }

            let cols = [username];
            db.query('SELECT * FROM userlogin WHERE username = ? LIMIT 1',cols,(err,data,fields)=>{
                if(err){
                    res.json({
                        success: false,
                        msg:'An error occured, please try again"'
                    })
                    return;
                }

                if(data && data.length===1){
                
                        if(data[0].password==password)
                        {
                            req.session.userID = data[0].id;
                            res.json({
                                success: true,
                                username: data[0].username
                            })
                            return;
                        }
                        else{
                            res.json({
                                success:false,
                                msg:'Invalid Password'
                            })
                        }
                    
                }
                else{
                    res.json({
                        success: false,
                        msg: ' User not found'
                    })
                }
            })

        })
    }
    
    showHomeproducts(app,db){
        app.post('/showhomeproducts',(req,res) => {

                db.query('SELECT * FROM Homeproducts',function(err,result){
                    if(err){
                        console.log(err)
                    }
                    res.json({
                        success:true,
                        msg: result,
                    })
                })
            
            })
    }
    customsearch(app,db){
        app.post('/customsearch',(req,res) => {
            let txt = req.body.txt;
            var sql = 'SELECT * FROM '+txt

            db.query(sql,function(err,result){
                if(err){
                    console.log(err)
                }
                res.json({
                    success:true,
                    msg: result,
                })
            })
            return
        
        })

    }
    addproduct(app,db){
        app.post('/showproduct',(req,res) => {

                db.query('SELECT * FROM products',function(err,result){
                    if(err){
                        console.log(err)
                    }
                    res.json({
                        success:true,
                        msg: result,
                    })
                })
                return
            
            })
    }
    additemtocart(app,db){
        app.post('/additemtocart',(req,res)=>{
            console.log(req.body.image);
            let image=req.body.image;
            let name=req.body.name;
            let prize = req.body.prize;
            let cols=[name,prize,image]
            var sql = "INSERT INTO cartproducts (Name,Prize,Image) VALUES (?, ?, ?)";
            db.query(sql,cols,(err,data,fields)=>{
                if(err){
                    res.json({
                        success: false,
                        msg:'An error occured, please try again"'
                    })
                    return;                    
                }
                res.json({
                    success:true,
                    msg: 'Successfully deleted',
                })
            })

        })
    }
    deleteproduct(app,db){
        app.post('/deleteproduct',(req,res) =>{
            let id =req.body.item;
            let cols=[id]
            db.query('DELETE FROM cartproducts WHERE id= ?',cols,(err,data)=>{
                if(err){
                    res.json({
                        success: false,
                        msg:'An error occured, please try again"'
                    })
                    return;
                }
                res.json({
                    success:true,
                    msg: 'Successfully deleted',
                })
                return
            })
        })
    }
    Cartproducts(app,db){
        app.post('/cartproducts',(req,res) => {

                db.query('SELECT * FROM Cartproducts',function(err,result){
                    if(err){
                        console.log(err)
                    }
                    res.json({
                        success:true,
                        msg: result,
                    })
                    return
                })
            
            })
    }
    showTrendproducts(app,db){
        app.post('/showtrendproducts',(req,res) => {

            db.query('SELECT * FROM Trendproducts',function(err,result){
                if(err){
                    console.log(err)
                }
                res.json({
                    success:true,
                    msg: result,
                })
                return
            })
        
        })
    }
    sign(app,db){
        app.post('/signup',(req,res) => {
            let username = req.body.username;
            let password = req.body.password;
            let email = req.body.email;
            username = username.toLowerCase();
            if(username.length > 100 || password.length >100){
                res.json({
                    success: false,
                    msg: 'An errors occured, please try again3'
                 
                })
                return;
            }

            let cols = [username,password,email];
            let cols1 = [username,password];
            var sql = "INSERT INTO usersignup (username,password,email) VALUES (?, ?, ?)";
            db.query(sql,cols,(err,data)=>{
                if(err){
                    res.json({
                        success: false,
                        msg:'An error occured, please try again2'
                    })

                    return;
                }


 
                    
    
            })
            var sql1 = "INSERT INTO userlogin (username,password) VALUES (?, ?)";

            db.query(sql1,cols1,(err,data)=>{
                if(err){
                    res.json({
                        success: false,
                        msg:'An error occured, please try again1'
                    })

                    return;
                }
                    res.json({
                    success: false,
                    msg:'Successfully Registered',
                })
                return;
            })

        })
    }
    isLoggedIn(app,db){
        app.post('/isLoggedIn',(req,res)=>{
            if(req.session.userID){
                let cols = [req.session.userID];
                db.query('SELECT * FROM userlogin WHERE  id = ? LIMIT 1',cols,(err,data,fields)=>{
                    if(data && data.length === 1){
                        res.json({
                            success: true,
                            username: data[0].username
                        })
                        return;
                    }
                    else{
                        console.log("Error in fetch");
                        res.json({
                            success: false
                        })
                    }
                })
            }
            else{
                console.log("not get");
                res.json({
                    success: false

                })
            }
        });
    }
}
module.exports = Router;