const express=require("express")
const bodyParser=require("body-parser")
const request=require("request")
const https=require("https")
const secret=require("./config.js")

const app=express()
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html")
})

app.post("/failure",function(req,res){
  res.redirect("/")
})

app.post("/",function(req,res){

  const firstName=req.body.fName;
  const lastName=req.body.lName;
  const email=req.body.email;

  const data={
    members:[
      {
        email_address:email,
        status:"subscribed",
        merge_fields:{
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ]
  }

  const jsonData=JSON.stringify(data)
  const url="https://us1.api.mailchimp.com/3.0/lists/"+secret.listID//replace us1 with last 3 characters of your API key
  const options={
    method:"POST",
    auth:"vishal:"+secret.apiKey //Add your name and your API key
  }


  const request1=https.request(url,options,function(response){
    if(response.statusCode===200){
      res.sendFile(__dirname+"/success.html")
    }else{
      res.sendFile(__dirname+"/failure.html")
    }
    response.on("data",function(data){
      console.log(JSON.parse(data));
    })
  })
  request1.write(jsonData)
  request1.end()
})

app.listen(process.env.PORT||3000,function(){//port=process.env.PORT
  console.log("Server is running");
})
