// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// request and cheerio makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// app.use(express.static("public"));

// Database configuration
// db then table
// !!! OG = "zoo" and then "animals"
var databaseUrl = "news";
var collections = ["article"];

// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
  console.log("Database Error:", error);
});


// At the root path, I display every entry in the article collection (The title and link)

app.get("/test", function(req, res) {
    // Testing by sending out Hello World!
    res.send("Hello World!");
    // Query: In our database, go to the articles collection, then "find" everything
     db.article.find({}, function(error, found) {
      // Log any errors if the server encounters one
      if (error) {
        console.log(error);
      }
      // Otherwise, send the result of this query to the browser
      else { 
          res.json(found);
      }
    });
});

app.get("/", function(req, res) {
    request("https://news.ycombinator.com/", function(error, response, html) {
      // Load the html body from request into cheerio
      var $ = cheerio.load(html);
      // For each element with a "title" class
      $(".title").each(function(i, element) {
        // Save the text and href of each link enclosed in the current element
        var title = $(element).children("a").text();
        var link = $(element).children("a").attr("href");
  
        // If this found element had both a title and a link
        if (title && link) {
          // Insert the data in the article db
          db.article.insert({
            title: title,
            link: link
          },
          function(err, inserted) {
            if (err) {
              // Log the error if one is encountered during the query
              console.log(err);
            }
            else {
              // Otherwise, log the inserted data
              console.log(inserted);
            }
        });
      }
    });
  });
         
    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
});




  app.listen(3000, function() {
    console.log("App running on port 3000!");
  });