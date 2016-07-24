// Register the `issueStats` component on the `issueStats` module,
angular.
module('issueStats').
component('issueStats', {
	templateUrl: 'issue-stats/issue-stats.template.html',
	controller: ['Issue','$timeout',
	function IssueStatsController(Issue,$timeout) {
		var self = this;

		self.repoUrl = "";
		self.user = "Shippable";
		self.repoName = "support";

		self.totalIssues = 0;
		self.issuesInLast24Hours = 0;
		self.issuesBetween24HoursAnd7Days = 0;
		self.issuesOlderThan7Days = 0;
		self.dataFetchSuccess = false;

		var currentDate = Date.now();
		var _24Hours = currentDate - (86400*1000);
		var _7Days = currentDate - (7*86400*1000);

		self.countIssues = function countIssues(issueList){
			self.totalIssues += issueList['length'];
			for(issue in issueList){
				if(!angular.isObject(issueList[issue]['pull_request'])){
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
					self.totalIssues--;
				}
			}
		}

		self.trackOpenIssues = function trackOpenIssues(repoUrl){
			self.totalIssues = 0;
			self.issuesInLast24Hours = 0;
			self.issuesBetween24HoursAnd7Days = 0;
			self.issuesOlderThan7Days = 0;
			self.lastPage = 1;

			var regex = new RegExp("github\.com/([A-Za-z0-9-]+)/([A-Za-z0-9._-]+)");
			var match = regex.exec(repoUrl);
			self.user = match[1];
			self.repoName = match[2];

			Issue.query({user:self.user, repoName:self.repoName, pageNo:1}).$promise.then(function(response) {

				self.countIssues(response.data);
				self.dataFetchSuccess = true;

				if(response.headers.link){
					var regex = new RegExp("page=([0-9]+)>; rel=\"last\"");
					var match = regex.exec(response.headers.link);
					self.lastPage = match[1];
					for(var i = 2; i<=self.lastPage;i++){
						Issue.query({user:self.user, repoName:self.repoName, pageNo:i}).$promise.then(function(response) {
							self.countIssues(response.data);
						});
					}
				}
				
				$timeout(function () {
					self.dataFetchSuccess = false;
				}, 1000);

			});

		} 

	}
	]
});