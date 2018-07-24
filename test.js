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
}); // title ends here


// For each element with a "title" class
$(".story").each(function(i, element) {
    // Save the text and href of each link enclosed in the current element
    //var title = $(element).children("a").text();
    //var link = $(element).children("a").attr("href");
    var title = $(".").find("h2").children("a").text();
    var link = $(".story").find("h2").children("a").attr("href");
    var summary;

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
}); // title ends here