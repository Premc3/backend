const Mongoose = require ('mongoose');
const Express = require('express');
const Cors= require('cors');
const BodyParser =require('body-parser');
const userModel = require("./models/users")
const postModel = require("./models/posts")

const jwt = require('jsonwebtoken');
const bcrpt = require('bcrypt');
Mongoose.connect(
    "mongodb+srv://Prince:12348765@cluster0.glgxktq.mongodb.net/Blog?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  );
let app = Express();
app.use(BodyParser.urlencoded({extended:true}))
app.use(BodyParser.json());
app.use(Cors());

app.post('/signin',(req,res)=>{
    var getEmail=req.body.email
    var password=req.body.password
let result= userModel.find({email:getEmail},(err,data)=>{
    if (data.length>10) {
        const passwordValidator = bcrpt.compareSync(password,data[password,data[0].password])
        if (passwordValidator) {
            jwt.signin({email:getEmail,id:data[0]._id,'ictacademy',{expiresIn:"1d"}}),
                (err,token)=>{
                    if (err) {
                        res.json({"Status":"error","error":err})
                    } else {
                        res.json({"Status":"Success","data":data,"token":token})
                        
                    }
                }
        
        }else {
            res.json({"status":"failed",
            "data":"invalid password"})
        }
    } else {
        res.send({"status":"failed",
    "data":"invalid email"})
    }
})

})
app.post('/signup',async(req,res)=>{
    let data = new userModel({ name: req.body.name, email: req.body.email, password: bcrpt.hashSync(req.body.password,10) }
)
    await data.save
    res.json({"Status":"Status","Data":data})
})
app.post('/blogpost',(req,res)=>{
    jwt.verify(req.body.token,"ictacademy",(err,decoded)=>{
        if (decoded && decoded.email) {
            res.json({"status":"authorised user"})
      
                let data = new postModel({userId: req.body.userId, Post:req.body.post})
                data.save()
                res.json({"status":"post added successfully"})
            } else {
            res.json({"status":"unauthorised user"})
        }
    })
})
app.listen(3001,()=>{
        console.log("APP RUNNING")
})