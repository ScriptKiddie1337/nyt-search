var searchTerm = "";
var startDate = "";
var endDate = "";
var numFetch = 1;
var author;


var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";


      $(document).ready(function()
      {
        // User hit the submit button
        $("#searchit").on("click", function(event)
        {
            event.preventDefault();  // Keeps from refreshing the page

            console.log("Clicked search");

            // Grab the start and end years from the form
            var start = document.getElementById("start-year").value;
            var end = document.getElementById("end-year").value;

            // Grab the search term and the number of articles to return from the form
            searchTerm = document.getElementById("search-term").value;
            numFetch= document.getElementById("number-of-records").value;

            console.log("search term", searchTerm);

            // we need to make build start/end dates as optional
            if (start)
            {
                startDate =  "&begin_date=" + start + "0101";
            }
            else
                startDate = "";

            if (end)
            {
               endDate = "&end_date=" + end + "1231";
            }
            else 
              endDate = "";

            // This builds the query
            queryURL += '?' + $.param({
            'api-key': "d0d8316ccccd4426b403229ab6762b11",
            'q': searchTerm,
            'page': 0
            }); 

            // We just add the start and end at the end of the query string
            queryURL += startDate + endDate;

            console.log(queryURL);

          // Get the data
          $.ajax({
            url: queryURL,
            method: "GET"
          }).then(function(response) 
          {
            // Got something back
            var results = response;
            console.log(results);

            // Clear out from last search
            $("#temp").empty();
            console.log("# records ", numFetch);

            for (var i=0; i < numFetch; i++) 
            {
                var headLine = $("<a></a>");  // We're going to make the search results clickable
                var byLine = $("<h5>");

                // Item number for the articles returned
                num = i+1;

                // This is the URL
                headLine.attr("href", results.response.docs[i].web_url);
                headLine.attr("target", "_blank");
                headLine.attr("style", "font-size: 20px; font-family: 'News Cycle', sans-serif;");

                // This is the text for the URL
                var restHead = num + ". " + results.response.docs[i].headline.main;

                console.log("rest", restHead);

                headLine.html(restHead);

                console.log("url" + results.response.docs[i].web_url);
                
                if (results.response.docs[i].byline){
                    // console.log("byline worked")
                    author = results.response.docs[i].byline.original;
                }
                else {
                    // console.log("no workee");
                    author = " ";
                }

                byLine.append(author);

                $("#temp").append(headLine);
                $("#temp").append(byLine);

                // Need to reset the query string for the next search
                queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
            }  // End of looping through all the articles
      
          });  // This ends the Ajax data return

        });  // End of the submit function

      }); // End of document ready