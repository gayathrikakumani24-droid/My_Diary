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
const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});
// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME
// });
// connection.connect((err)=>{
//     if(err){
//         console.error("Error connecting to database:",err);
//     }
//     else{
//         console.log("Connected to MySQL database");
//     }
// });

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
});

connection.connect((err) => {
    if(err){
        console.log("Connection Failed");
        console.error(err);
    }
    else{
        console.log("Connected to Aiven MySQL 🚀");
    }
});
connection.query(
    "SELECT * FROM Users",
    (err, result) => {
        console.log(result);
    }
);
connection.query(`
CREATE TABLE IF NOT EXISTS Users(
    ID INT PRIMARY KEY AUTO_INCREMENT,
    EmailID VARCHAR(50) UNIQUE,
    HashedPassword VARCHAR(100)
);
`, (err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("Users table ready");
    }
});

connection.query(`
CREATE TABLE IF NOT EXISTS Posts(
    ID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    postTitle VARCHAR(100),
    postDescription VARCHAR(1500),
    FOREIGN KEY(UserID) REFERENCES Users(ID)
);
`, (err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("Posts table ready");
    }
});
// app.listen(3000,()=>{
//     console.log("Server is running on port 3000");
// })

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

app.post('/userLogin', async (req, res) => {

    const { email, password } = req.body;

    connection.query(
        "SELECT ID, HashedPassword FROM Users WHERE EmailID = ?",
        [email],
        async (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database error"
                });
            }

            console.log("Query Result:", result);

            if (result.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const hashedPassword = result[0].HashedPassword;
            const userID = result[0].ID;

            const response = await bcrypt.compare(
                password,
                hashedPassword
            );

            if (response) {
                return res.status(200).json({
                    userID: userID
                });
            }

            return res.status(401).json({
                message: "Invalid password"
            });
        }
    );
});
app.post('/newPost',(req,res)=>{

    const { userID, postTitle, postDescription } = req.body;

    connection.query(
        `INSERT INTO Posts
         (UserID, postTitle, postDescription)
         VALUES (?, ?, ?)`,
        [userID, postTitle, postDescription],
        (err,result)=>{

            if(err){
                console.log(err);
                return res.status(500).json({
                    message:"Database error"
                });
            }

            res.status(200).json({
                message:"Post received"
            });
        }
    );
});
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
        "SELECT * FROM Posts WHERE ID = ?",
        [postID],
        (err, result) => {

            if(err){
                console.log(err);
                return res.status(500).json({
                    message: "Database error"
                });
            }

            console.log("Post Query Result:", result);

            if(result.length === 0){
                return res.status(404).json({
                    message: "Post not found"
                });
            }

            res.status(200).json(result);
        }
    );
});
app.post("/diary-feelings", async (req, res) => {

    try {

        const { title, description } = req.body;

        const prompt = `
You are a personal diary.

The user has just written a diary entry.

Respond naturally as if you are the diary speaking back.

Rules:
- Do not say "Emotions I sensed".
- Do not say "How I feel".
- Do not say "Reflection".
- Do not analyze the user.
- Write like a caring friend who has been listening.
- Sound warm, human and conversational.
- Keep it between 50 and 100 words.
- Start directly without titles or headings.
- Mention details from the diary entry.
- End naturally.

Title:
${title}

Diary Entry:
${description}
`;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a living diary that emotionally reacts to diary entries."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.8,
            max_tokens: 200
        });

        const reply =
            completion.choices[0].message.content;

        res.status(200).json({
            success: true,
            reply
        });

    } catch (error) {

        console.error("Groq Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to generate diary response"
        });

    }

});
module.exports = app;
