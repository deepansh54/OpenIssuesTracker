# OpenIssuesTracker
A web app for Open Issue tracking for public git repositories.

Check it out on - https://openissuestracker.herokuapp.com/

## Technologies
1.Frontend - AngularJS
2.Backend - NodeJS

## How it works
The app uses the Github API to fetch the issue statistics of a public git repository. It counts the issues based on following criteria :  
1. Total no. of Open issues
2. Total no. of Open issues opened in the last 24 Hours
3. Total no. of Open issues opened more than 24 hours ago but less than 7 days ago
4. Total no. of Open issues opened more than 7 days ago

The Github API URL used is  

https://api.github.com/repos/:user/:repoName/issues?per_page=100&page=:pageNo
  
Parameters :  
* user     - Username of the repository owner, extracted from input url.
* repoName - Name of the repository, extracted from input url.
* per_page - No. of results per page of response data, set to max(100) for reducing api calls.
* pageNo   - Current page no. of the results. 
  
The total no. of pages to scan for counting issues, is extracted from the response Link headers. They contain the url of the last page, if multiple pages are present, which is used to determine the last page number.
  
The response data also contain the open pull requests as part of the results. These are eliminated by checking the existence of a 'pull_request' object. This object is only present in open pull requests.

## How to use
1. Enter the full URL of the Git Repository in the input box and Click on 'Track!' button
2. A 'Success' prompt is displayed on successful fetch of the issue stats.
3. The Open issue stats are shown below.

## Further Improvements
1. Add Loader graphics to simulate loading of data.
2. Add animations on change of data.
3. Use Charts to represent data. 
4. Add additional features based on data, such as categorization based on issue labels.