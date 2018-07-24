function displayResults(article) {
    
    $("tbody").empty();
  
    article.forEach(function(article) {
     
      $("tbody").append("<tr><td>" + article.title + "</td>" +
                           "<td>" + article.link + "</td></tr>");
    });
  };

  $.getJSON("/all", function(data) {
    
    displayResults(data);
  });

