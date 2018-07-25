
// function to display results from JSON to the pre-made DOM
// 
function displayResults(article) {
    
    $("tbody").empty();
  
    articles.forEach(function(article) {
     
      $("tbody").append("<tr><td>" + article.title + "</td>" +
                           "<td>" + article.link + "</td></tr>");
    });
  };

  // Calls my function on Load
  $.getJSON("/scrape", function(data) {
    
    displayResults(data);
  });

