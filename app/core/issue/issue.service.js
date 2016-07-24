angular.
  module('core.issue').
  factory('Issue', ['$resource',
    function($resource) {
      return $resource('https://api.github.com/repos/:user/:repoName/issues?per_page=100&page=:pageNo', {}, {
        query: {
          method: 'GET',
          params: { 
            user: 'user',
            repoName: 'repoName',
            pageNo: 'pageNo' },
          transformResponse: function(data, headers){
            response = {}
            response.data = JSON.parse(data);
            response.headers = headers();
            return response;
          }
        }
      });
    }
  ]);