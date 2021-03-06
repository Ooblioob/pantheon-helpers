// Generated by IcedCoffeeScript 1.8.0-e
(function() {
  var exec, u, _,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('underscore');

  exec = require('child_process').exec;

  u = {
    mkObjs: function(obj, path_array, val) {
      var path_part;
      if (val == null) {
        val = {};
      }

      /*
      make a set of nested object.
      
      obj = {'x': 1}
      mkObjs(obj, ['a', 'b'], ['1'])
       * returns []
       * obj now equals {'x': 1, 'a': {'b': ['1']}}
      
      return the val
       */
      if (!path_array.length) {
        return obj;
      }
      path_part = path_array.shift();
      if (!obj[path_part]) {
        if (path_array.length) {
          obj[path_part] = {};
        } else {
          obj[path_part] = val;
        }
      } else if (path_array.length && _.isArray(obj[path_part])) {
        throw new Error('item at "' + path_part + '" must be an Object, but it is an Array.');
      } else if (path_array.length && !_.isObject(obj[path_part])) {
        throw new Error('item at "' + path_part + '" must be an Object, but it is a ' + typeof obj[path_part] + '.');
      }
      return u.mkObjs(obj[path_part], path_array, val);
    }
  };

  u.process_resp = function(opts, callback) {

    /*
    process a request HTTP response. return a standardized
    error regardless of whether there was a transport error or a server error
    opts is a hash with an optional:
      ignore_codes - array of error codes to ignore, or if 'all' will ignore all http error codes
      body_only - boolean whether to return the body or the full response
     */
    var ignore_codes, is_http_err;
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    ignore_codes = opts.ignore_codes || [];
    is_http_err = function(resp) {
      var _ref;
      if (ignore_codes === 'all' || resp.statusCode < 400 || (_ref = resp.statusCode, __indexOf.call(ignore_codes || [], _ref) >= 0)) {
        return false;
      } else {
        return true;
      }
    };
    return function(err, resp, body) {
      var req;
      if (err || is_http_err(resp)) {
        req = (resp != null ? resp.req : void 0) || {};
        req = _.pick(req, '_headers', 'path', 'method');
        err = {
          err: err,
          msg: body,
          code: resp != null ? resp.statusCode : void 0,
          req: req
        };
      }
      if (opts.body_only) {
        return callback(err, body);
      } else {
        return callback(err, resp, body);
      }
    };
  };

  u.deepExtend = function(target, source) {

    /*
    recursively extend an object.
    does not recurse into arrays
     */
    var k, sv, tv;
    for (k in source) {
      sv = source[k];
      tv = target[k];
      if (tv instanceof Array) {
        target[k] = sv;
      } else if (typeof tv === 'object' && typeof sv === 'object') {
        target[k] = u.deepExtend(tv, sv);
      } else {
        target[k] = sv;
      }
    }
    return target;
  };

  u.proxyExec = function(cmd, process, callback) {

    /*
    proxy stdout/stderr to process;
    call optional callback when done
    return child process
     */
    var cp;
    cp = exec(cmd);
    cp = exec(cmd);
    cp.stdout.pipe(process.stdout);
    cp.stderr.pipe(process.stderr);
    cp.on('exit', function(code) {
      if (code) {
        return process.exit(code);
      } else if (_.isFunction(callback)) {
        return callback(code);
      }
    });
    return cp;
  };

  u.removeInPlace = function(container, value) {
    var i;
    if (__indexOf.call(container, value) >= 0) {
      i = container.indexOf(value);
      return container.splice(i, 1);
    }
  };

  u.removeInPlaceById = function(container, record) {

    /*
    given a record hash with an id key, look through the container array
    to find an item with the same id as record. If such an item exists,
    remove it in place.
    return the deleted record or undefined
     */
    var existing_record, i, item, _i, _len;
    for (i = _i = 0, _len = container.length; _i < _len; i = ++_i) {
      item = container[i];
      if (item.id === record.id) {
        existing_record = container.splice(i, 1)[0];
        return existing_record;
      }
    }
    return void 0;
  };

  u.insertInPlace = function(container, value) {
    if (__indexOf.call(container, value) < 0) {
      return container.push(value);
    }
  };

  u.insertInPlaceById = function(container, record) {

    /*
    given a record hash with an id key, add the record to the container
    if an item with the record's key is not already in the container
    return the existing or new record.
     */
    var existing_record;
    existing_record = _.findWhere(container, {
      id: record.id
    });
    if (existing_record) {
      return existing_record;
    } else {
      container.push(record);
      return record;
    }
  };

  u.formatId = function(id, typeName) {

    /*
    return an id ready for CouchDB with the typeName prepended to the id.
     */
    if (id.indexOf(typeName + '_') === 0) {
      return id;
    } else {
      return typeName + '_' + id;
    }
  };

  u.getActor = function(couchUtils, userName) {

    /* returns promise */
    var Promise, systemUser, systemUserName, userDb;
    Promise = require('./promise');
    systemUserName = couchUtils.conf.COUCHDB.SYSTEM_USER;
    if (_.isObject(userName)) {
      return Promise.resolve(userName);
    }
    if (userName === systemUserName) {
      systemUser = {
        name: systemUserName,
        roles: []
      };
      return Promise.resolve(systemUser);
    } else {
      userDb = couchUtils.nano_system_user.use('_users');
      return userDb.get('org.couchdb.user:' + userName, 'promise');
    }
  };

  module.exports = u;

}).call(this);
