Cluster.connect( "mongodb://localhost/service-discovery" );
Cluster.register( "web" );
Cluster.allowPublicAccess( 'search' );
var searchConn = Cluster.discoverConnection( 'search' );

Meteor.publish( 'topPackages', function () {
  console.log( "accessing topPackages" );
  var options = {
    sort: {
      isoScore: -1
    },
    limit: 20
  };
  return Packages.find( {}, options );
} );

Meteor.methods( {
  "getUserByToken": function ( loginToken ) {
    var hashedToken = loginToken && Accounts._hashLoginToken( loginToken );
    console.log( hashedToken, 'hashedToken' );
    var selector = {
      'services.resume.loginTokens.hashedToken': hashedToken
    };
    var options = {
      fields: {
        _id: 1
      }
    };
    var user = Meteor.users.findOne( selector, options );
    return ( user ) ? user._id : null;
  }
} );
