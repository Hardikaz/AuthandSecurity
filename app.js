require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect("mongodb://localhost:27017/usersAuthDB",{useNewUrlParser:true})

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

console.log(process.env.API_KEY);
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptFields: ["password"] });

const User=new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    })

    newUser.save().then(()=>{
        res.render("secrets");
    });
})

app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email:username}).exec().then(foundUser=>{
        if(foundUser.password===password)
        {
            res.render("secrets");
        }
        else
        {
            console.warn("Data Not found");
        }
    }).catch(err=>{console.log("Kuch bhi Dal rhe");
console.log(err);});
})

app.listen(3000,function(){
    console.log("Server started on port 3000.");
})

// Level 1 Auth was just storing data and password in databse and verifying it 
// Level 2 involved encryption of data and password
// Level 3 involves dotenv package