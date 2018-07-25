// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

// Initialize Express
var app = express();

app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local news database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


var databaseUrl = "news";
var collections = ["articles"];

// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
  console.log("Database Error:", error);
});


// At the root path, I display every entry in the article collection (The title and link)

app.get("/scrape", function(req, res) {
    
    
     db.articles.find({}, function(error, found) {
      // Handles errors if found
      if (error) {
        console.log(error);
      }
      else { 
          // Run scrape function and return as JSON
          scrape();
          console.log("found:" + found);
          res.json(found);
      }
    });
});


// Function to go to news site, grab the information, and place it into my Mongo Database
function scrape() {
      request("https://news.ycombinator.com/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    
    $(".title").each(function(i, element) {
      // Save the text and href of each link enclosed in the current element
      var title = $(element).children("a").text();
      var link = $(element).children("a").attr("href");

      // If this found element had both a title and a link
      if (title && link) {
        // Insert the data in the scrapedData db
        db.articles.insert({
          title: title,
          link: link
        },
          function(err, inserted) {
            if (err) {
              // Log the error if one is encountered during the query
              console.log(err);
            }
            else {
              // Console.log inserted data
              console.log("Inserted data:" + inserted);
              //res.json(found)
            }
        });
      }
    }); 
  });
         
    // }); }// Break in case of emergency, this ends the JSON converter Function, last ) is if scrape() is used
};

// Listen on PORT 3000
  app.listen(3000, function() {
    console.log("App running on port 3000!");
  });