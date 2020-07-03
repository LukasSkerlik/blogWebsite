// ---------------------------------------------------------------------require packages------------------------------------------------------------
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require ("mongoose");
const _ = require ("lodash");
const favicon = require('serve-favicon');
var path = require('path');

// ---------------------------------------------------------------------set up express-------------------------------------------------------------


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// -------------------------------------------------------------set up favicon and js for navbar-----------------------------------------------------

app.use(express.static(path.join(__dirname, 'js')))
app.use(favicon(__dirname + '/public/images/favicon.ico'));
// ---------------------------------------------------------------set up mongoose and schema--------------------------------------------------------

mongoose.connect('mongodb+srv://admin-slukas:Test111@cluster0blog.4ln9i.mongodb.net/blogDB', {useNewUrlParser: true, useUnifiedTopology: true });


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
// ------------------------------------------------------------Set home, about and contact here-----------------------------------------------------
const homeStartingContent = "Welcome to my blog that talks about...  YOUR TEXT HERE. PLACEHOLDER.";
const aboutContent = "This is blog site with full CRUD capabilities.";
const contactContent = "Please Contact me @ skerlik.lukas@gmail.com";



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



app.get("/deleteFailure",function(req,res){
  res.render("deleteFailure")
});

app.get("/deleteSuccess",function(req,res){
  res.render("deleteSuccess")
});

app.get("/updateFailure",function(req,res){
  res.render("updateFailure")
});

app.get("/updateSuccess",function(req,res){
  res.render("updateSuccess")
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

app.get("/update/:postName",function(req,res){
  let  requestedTitle = _.lowerCase(req.params.postName);
  Post.find({title: requestedTitle}, function(err, results){
    if (err){
      console.log(err);
      res.redirect("/");
    } else {
      console.log(results[0]);
      res.render ("update", {collection: results[0]})
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
  res.redirect("/deleteFailure")
} else {
      Post.deleteMany ({ title: _.lowerCase(results[0].title)}, function(err){
        if (err){
          console.log(err);
        } else {
          console.log("deleted the specified post");
        }
      });
      res.redirect("/deleteSuccess")

    }}
  })

});


// -------------------------------------------------------------------Update of CRUD------------------------------------------------------------
app.post("/update",function(req,res){
  Post.find({ title: _.lowerCase(req.body.postTitle)}, function(err, results){
    if (err){
      // console.log(err);
    } else {
console.log(results);
if (results.length == 0) {
  res.redirect("/updateFailure")
} else {
      Post.updateOne ({ title: _.lowerCase(results[0].title)}, { content: req.body.postBody}, function(err){
        if (err){
          console.log(err);
        } else {
          console.log("updated the specified post");
        }
      });
      res.redirect("/updateSuccess")

    }}
  })

});



// ---------------------------------------------------------------server listen (heroku specified)---------------------------------------------------
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
