angular.
  module('core.issue').
  factory('Issue', ['$resource',
    function($resource) {
      //Setting methods to call the API url
      //'per_page' parameter - No. of results in one page, Setting to 100(api max value) for reducing the number of pages and api calls
      //'page' parameter - Current page number to fetch
      return $resource('https://api.github.com/repos/:user/:repoName/issues?per_page=100&page=:pageNo', {}, {
        query: {
          method: 'GET',
          params: { 
            user: 'user',
            repoName: 'repoName',
            pageNo: 'pageNo' },
          //transform the response to get data as well as the headers
          transformResponse: function(data, headers){
            response = {}
            //Parsing the response data to object
            response.data = JSON.parse(data);
            response.headers = headers();
            return response;
          }
        }
      });
    }
  ]);