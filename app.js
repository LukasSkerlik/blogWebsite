//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require ("mongoose");
const _ = require ("lodash");

const homeStartingContent = "Welcome to my blog that talks about... Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const aboutContent = "This is blog site with full CRUD capabilities.";
const contactContent = "Please Contact me @";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true, useUnifiedTopology: true });

const postSchema = new mongoose.Schema ({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
});

const Post = mongoose.model("Post", postSchema);



// ---------------------------------------------------------------------Read of CRUD------------------------------------------------------------


app.get("/",function(req,res){

   Post.find({}, function(err, results){
     if (err){
       // console.log(err);
     } else {
       // console.log(results);
       res.render("home", {homeContent: homeStartingContent, collection: results});
       }
   })
  });



app.get("/about",function(req,res){
  res.render("about", {aboutContent: aboutContent})
});

app.get("/contact",function(req,res){
  res.render("contact", {contactContent: contactContent})
});

app.get("/compose",function(req,res){
  res.render("compose")
});

app.get("/delete",function(req,res){

   Post.find({}, function(err, results){
     if (err){
       // console.log(err);
     } else {
       // console.log(results);
       res.render("delete", {collection: results});
       }
   })
  });

app.get("/failure",function(req,res){
  res.render("failure")
});

app.get("/success",function(req,res){
  res.render("success")
});

app.get("/posts/:postName", function(req,res){
  let  requestedTitle = _.lowerCase(req.params.postName);
  Post.find({title: requestedTitle}, function(err, results){
    if (err){
      console.log(err);
      res.redirect("/");
    } else {
      console.log(results[0]);
      res.render ("post", {collection: results[0]})
      }
  })
});

// -------------------------------------------------------------------Create of CRUD------------------------------------------------------------

app.post("/", function(req,res){
  const post = new Post ({title: _.lowerCase(req.body.postTitle), content: req.body.postBody });


  post.save(function(err){
   if (!err){
     res.redirect("/");
   }

 });
});
// -------------------------------------------------------------------Delete of CRUD------------------------------------------------------------


app.post("/delete",function(req,res){
  Post.find({ title: _.lowerCase(req.body.postTitle)}, function(err, results){
    if (err){
      // console.log(err);
    } else {
console.log(results);
if (results.length == 0) {
  res.redirect("/failure")
} else {
      Post.deleteMany ({ title: _.lowerCase(results[0].title)}, function(err){
        if (err){
          console.log(err);
        } else {
          console.log("deleted the specified post");
        }
      });
      res.redirect("/success")

    }}
  })

});

function handleClick() {
  document.getElementById("demo").innerHTML = "Hello World";
}








app.listen(3000, function() {
  console.log("Server started on port 3000");
});
