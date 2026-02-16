const express=require('express');
const cors=require('cors');
const bcrypt=require("bcrypt");
const app=express();
app.use(cors());  
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const mysql=require('mysql2');
const { connect } = require('node:http2');
require("dotenv").config();
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
connection.connect((err)=>{
    if(err){
        console.error("Error connecting to database:",err);
    }
    else{
        console.log("Connected to MySQL database");
    }
});
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})
app.post('/registerUser',async(req,res)=>{
    console.log(req.body);
    const {email,password}=req.body;
    try{
    //hash the password
    const hashedPassword=await bcrypt.hash(password,10);
    console.log('User Data: ',{
        email,hashedPassword
    })
    connection.query(`insert into Users(EmailID,HashedPassword) values('${email}','${hashedPassword}');`,(err,result)=>{
  if(err){
    res.status(500).send('no');
    console.log(err); 
  }
  else{
    res.status(200).send('okay');
  }
});
}catch(err){
    console.log(err);
}
   
})
app.get('/',(req,res)=>{
    console.log(req);
    res.status(200).json({message:"Successful"});
}   );
app.post('/userLogin',async(req,res)=>{
    console.log(req.body);
    const {email,password}=req.body;
    let hashedPassword='';
    let userID='';
    // const hashedPassword="$2b$10$xezHaupUdEODZKx5Lh0Yq.6mp8mRMciaQ9hUH1joF0zx9V4iFU8tO"; //example hash
        console.log(password); 
        connection.query(`select ID,HashedPassword from Users where EmailID='${email}'`,async (err,result)=>{
        if(err){
            return res.status(500).json({ message: "Database error" });
        }
        const hashedPassword=result[0].HashedPassword;
        const userID=result[0].ID;
        console.log("hashed password from db: ",hashedPassword);
        let response=await bcrypt.compare(password,hashedPassword);
        console.log("is true? ",response);
        if(response){
             res.status(200).json({userID:userID});
            return}
        else{
            res.status(401);
            return
        }
});
   
});
app.post('/newPost',(req,res)=>{
    const {postTitle,postDescription,userID}=req.body;  
    connection.query(`insert into Posts(UserID,postTitle,postDescription) values('${req.body.userID}','${req.body.postTitle}','${req.body.postDescription}')`,(err,result)=>{
        if(err){
            res.status(500).json({ message: "Database error" });
            return;
        }
        else{
        res.status(200).json({ message: "Post received" });}
    })
})
app.get('/getPosts',(req,res)=>{
    const userID=req.query.userID;
    console.log("UserID received: ",userID);
    connection.query(`select * from Posts where UserID='${userID}'`,(err,result)=>{
        if(err){
            res.status(500).json({ message: "Database error" }) ;
            return;
        }
        else{
        res.status(200).json(result);}    
    })
})
app.get('/viewPost/:id', (req, res) => {
    const postID = req.params.id;

    connection.query(
        "SELECT * FROM posts WHERE ID = ?",
        [postID],
        (err, result) => {
            if (err) {
                res.status(500).json({ message: "Database error" });
                return;
            }
            res.status(200).json(result);
        }
    );
});
