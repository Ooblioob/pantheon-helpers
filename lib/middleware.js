// Generated by IcedCoffeeScript 1.8.0-e
(function() {
  var t;

  t = {
    basicAuth: require('basic-auth')
  };

  module.exports = {
    systemAuth: function(conf) {
      var SYSTEM_USER;
      SYSTEM_USER = conf.COUCHDB.SYSTEM_USER;
      return function(req, resp, next) {
        var credentials;
        credentials = t.basicAuth(req);
        if (conf.DEV || (credentials && credentials.name === SYSTEM_USER && credentials.pass === conf.COUCH_PWD)) {
          req.session || (req.session = {});
          req.session.user = SYSTEM_USER;
        }
        return next();
      };
    },
    couch: function(couchUtils) {
      return function(req, resp, next) {
        req.couch = couchUtils.nano_user(req.session.user);
        return next();
      };
    },
    ensureAuthenticated: function(req, resp, next) {
      var _ref;
      if (!((_ref = req.session) != null ? _ref.user : void 0)) {
        return resp.status(401).end(JSON.stringify({
          error: "unauthorized",
          msg: "You are not logged in."
        }));
      } else {
        return next();
      }
    },
    testing: t
  };

}).call(this);
