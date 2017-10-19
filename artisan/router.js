module.exports = Router;

function Router(opts) {
  if (!(this instanceof Router)) {
    return new Router(opts);
  }

  this.opts = opts || {};
  this.methods = this.opts.methods || [
    'HEAD',
    'OPTIONS',
    'GET',
    'PUT',
    'PATCH',
    'POST',
    'DELETE'
  ];

  this.params = {};
  this.stack = [];
};

Router.prototype.use = function () {
  var router = this;
  var middleware = Array.prototype.slice.call(arguments);
  var path;

  // support array of paths
  if (Array.isArray(middleware[0]) && typeof middleware[0][0] === 'string') {
    middleware[0].forEach(function (p) {
      router.use.apply(router, [p].concat(middleware.slice(1)));
    });

    return this;
  }

  if (typeof middleware[0] === 'string') {
    path = middleware.shift();
  }

  // filter out nested routers from filter
  middleware = middleware.filter(function (fn) {
    if (fn.router) {
      fn.router.stack.forEach(function (layer) {
        if (path) layer.setPrefix(path);
        if (router.opts.prefix) layer.setPrefix(router.opts.prefix);
        router.stack.push(layer);
      });

      if (router.params) {
        Object.keys(router.params).forEach(function (key) {
          fn.router.param(key, router.params[key]);
        });
      }

      return false;
    }

    return true;
  });

  if (middleware.length) {
    router.register(path || '(.*)', [], middleware, {
      end: false,
      ignoreCaptures: !path
    });
  }

  return this;
}

Router.prototype.register = function (path, methods, middleware, opts) {
  opts = opts || {};

  var stack = this.stack;

  // create route
  var route = new Layer(path, methods, middleware, {
    end: opts.end === false ? opts.end : true,
    name: opts.name,
    sensitive: opts.sensitive || this.opts.sensitive || false,
    strict: opts.strict || this.opts.strict || false,
    prefix: opts.prefix || this.opts.prefix || "",
    ignoreCaptures: opts.ignoreCaptures
  });

  if (this.opts.prefix) {
    route.setPrefix(this.opts.prefix);
  }

  // add parameter middleware
  Object.keys(this.params).forEach(function (param) {
    route.param(param, this.params[param]);
  }, this);

  // register route with router
  if (methods.length || !stack.length) {
    // if we don't have parameters, put before any with same route
    // nesting level but with parameters
    var added = false;

    if (!route.paramNames.length) {
      var routeNestingLevel = route.path.toString().split('/').length;

      added = stack.some(function (m, i) {
        var mNestingLevel = m.path.toString().split('/').length;
        var isParamRoute = !!m.paramNames.length;
        if (routeNestingLevel === mNestingLevel && isParamRoute) {
          return stack.splice(i, 0, route);
        }
      });
    }

    if (!added) stack.push(route);
  } else {
    stack.some(function (m, i) {
      if (!m.methods.length && i === stack.length - 1) {
        return stack.push(route);
      } else if (m.methods.length) {
        if (stack[i - 1]) {
          return stack.splice(i, 0, route);
        } else {
          return stack.unshift(route);
        }
      }
    });
  }

  return route;
};
