const express=require("express");
const path=require("path");
const bcrypt=require("bcrypt");
const collection=require("./config");
const ejs=require("ejs");
const protect=require("protect");

const app=express();
//convert data into json format
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set('views',path.join(__dirname,'../views'));
app.set("view engine","ejs");

//app.use(express.static("public"));
app.use(express.static(path.join(__dirname,'../public')));

// Serve static files from the "public" directory
app.use('../public', express.static(path.join(__dirname, '../public')));

//Routes
app.get("/",(req,res)=>{
    res.render("login");
});

app.get("/signup",(req,res)=>{
    res.render("signup");
});
app.post("/home",(req,res)=>{
    res.render("home");
});

app.get("/home",(req,res)=>{
    res.render("home");
});
app.get("/library",(req,res)=>{
    res.render("library");
});
app.get("/profile",(req,res)=>{
    res.render("profile");
});

//Register user
app.post("/signup",async(req,res)=>{
    try{
        const {username,email,password,confirmpassword}=req.body;

        if (password !== confirmpassword) {
            return res.status(400).send("Passwords do not match");
        }

        //Check if the username already taken
        const existingUser=await collection.findOne({username});

        if(existingUser){
            return res.status(400).send("Username already exists!");
        }

        //Hash the password for security
        const hashedPassword=await bcrypt.hash(password,10);
        
        const data={
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            
        };

//insert user data into the database
    const userdata=await collection.insertMany([data]);
    console.log(userdata);

    res.render("home");
    } catch (error){
        console.error(error);
        res.status(500).send("Error registering user!");
    }
});



//Login user 
app.post("/login",async(req,res)=>{
    try{
        const {username,password}=req.body;
        const user=await collection.findOne({username});

        if(!user){
            return  res.status(400).send("User not found!");
        }

        const isMatch=await bcrypt.compare(password,user.password);

        if(isMatch){
            res.redirect("/home");
        } else{
            res.status(400).send("Username & Password does not match!");
        }
   
    } catch(error){
        console.error(error);
        res.status(500).send("An error occured during Login!");
    }
});


//user profile
app.get("/profile",async(req,res)=>{
    try{
        const userProfile = await UserProfile.findOne({username: req.session.username});
        res.render("profile",{userProfile});
    } catch(error){
        console.error(error);
        res.status(500).send("Error fetching profile data");
    }
});




const port=3000;

app.listen(port,()=>{
    console.log(`Server running on Port: ${port}`);
});