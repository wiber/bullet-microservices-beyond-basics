SearchConn = Cluster.discoverConnection('search');
SearchConn.subscribe('topSearches');
TopSearches = new Mongo.Collection('top-searches', {connection: SearchConn});

SearchConn.onReconnect = function() {
  var loginToken = Meteor._localStorage.getItem('Meteor.loginToken');
  this.call('authenticate', loginToken);
};

Tracker.autorun(function() {
  Meteor.userId();
  SearchConn.onReconnect();
});
