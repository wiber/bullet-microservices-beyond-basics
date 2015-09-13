Cluster.connect("mongodb://localhost/service-discovery");
Cluster.register("search");

var webConn = Cluster.discoverConnection('web');
Meteor.methods({
  "authenticate": function(loginToken) {
    var userId = webConn.call('getUserByToken', loginToken);
    this.setUserId(userId);
    return userId;
  }
});

Packages = new Mongo.Collection('packages');

Meteor.methods({

  "getPackages": function(searchText, options) {
    this.unblock();
    if(!this.userId) {
      throw new Meteor.Error(401, "Unauthorized");
    }
    var options = {sort: {isoScore: -1}, limit: 5};

    if(searchText) {
      var regExp = buildRegExp(searchText);
      var selector = {$or: [
        {packageName: regExp},
        {description: regExp}
      ]};

      return Packages.find(selector, options).fetch();
    } else {
      return Packages.find({}, options).fetch();
    }
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}
