// Register the `issueStats` component on the `issueStats` module,
angular.
module('issueStats').
component('issueStats', {
	templateUrl: 'issue-stats/issue-stats.template.html',
	controller: ['Issue','$timeout',
	function IssueStatsController(Issue,$timeout) {
		var self = this;

		//Initializing values
		self.repoUrl = "";
		self.user = "";
		self.repoName = "";

		self.totalIssues = 0;
		self.issuesInLast24Hours = 0;
		self.issuesBetween24HoursAnd7Days = 0;
		self.issuesOlderThan7Days = 0;
		//Boolean to show the success prompt on successful query
		self.dataFetchSuccess = false;

		//Setting the Date values beforehand for consistency, in milliseconds
		var currentDate = Date.now();
		var _24Hours = currentDate - (86400*1000);
		var _7Days = currentDate - (7*86400*1000);

		//Function to count issues according to creation date
		self.countIssues = function countIssues(issueList){
			self.totalIssues += issueList['length'];
			for(issue in issueList){
				//Check if current issue is a pull request
				if(!angular.isObject(issueList[issue]['pull_request'])){
					//Get issue created date in milliseconds
					var issueCreatedDate = Date.parse(issueList[issue]['created_at']);
					if(issueCreatedDate >= _24Hours){
						self.issuesInLast24Hours++;
					}
					else if(issueCreatedDate < _24Hours && issueCreatedDate >= _7Days){
						self.issuesBetween24HoursAnd7Days++;
					}
					else if(issueCreatedDate < _7Days){
						self.issuesOlderThan7Days++;
					}
				}
				else{
					//Decrement total issues if current issue is a pull request
					self.totalIssues--;
				}
			}
		}

		//Function called after submission of form to fetch data from Github api
		self.trackOpenIssues = function trackOpenIssues(repoUrl){
			//Reset values for successive calls
			self.totalIssues = 0;
			self.issuesInLast24Hours = 0;
			self.issuesBetween24HoursAnd7Days = 0;
			self.issuesOlderThan7Days = 0;
			//Last page number of results retutrned by the api, as the results are paginated
			self.lastPage = 1;

			//Getting the User name and Repository from the input url
			var regex = new RegExp("github\.com/([A-Za-z0-9-]+)/([A-Za-z0-9._-]+)");
			var match = regex.exec(repoUrl);
			self.user = match[1];
			self.repoName = match[2];

			// Using the issue resource to get the first page of results and also determining the last page number from the response link header 
			Issue.query({user:self.user, repoName:self.repoName, pageNo:1}).$promise.then(function(response) {

				//Counting issues for the first page
				self.countIssues(response.data);

				self.dataFetchSuccess = true;

				//Check if link header is present, happens if results contain only one page
				if(response.headers.link){
					//Extracting Last page number from the link header
					var regex = new RegExp("page=([0-9]+)>; rel=\"last\"");
					var match = regex.exec(response.headers.link);
					self.lastPage = match[1];
					//looping through all the pages from 2nd page to the last page of results
					for(var i = 2; i<=self.lastPage;i++){
						Issue.query({user:self.user, repoName:self.repoName, pageNo:i}).$promise.then(function(response) {
							self.countIssues(response.data);
						});
					}
				}

				//Hide the success prompt after 1 second
				$timeout(function () {
					self.dataFetchSuccess = false;
				}, 1000);

			});

		} 

	}
	]
});