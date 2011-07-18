(function() {
  var $, bind, drews, nimble, severus, trigger, _, __useLookup__;
  var __lookup = function (obj, property, dontBindObj, childObj, debug) {
    __slice = Array.prototype.slice
    if (property == "call" && "__original" in obj) {
      return function(){
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        thethis = args[0]
        theargs = args.slice(1)
        return obj.__original.apply(thethis, theargs)
      } 
    }
    if (property == "apply" && "__original" in obj) {
      return function(){
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        thethis = args[0]
        theargs = args[1]
        return obj.__original.apply(thethis, theargs)
      } 
    }
    var originalFunction = function(){}
    var isString = function(obj) {
      return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
    };
    isUndefined = function(obj) {
      return obj === void 0;
    };
    var isFunction = function(obj) {
      return !!(obj && obj.constructor && obj.call && obj.apply);
    }; 
    var isRegExp = function(obj) {
      return !!(obj && obj.test && obj.exec && (obj.ignoreCase || obj.ignoreCase === false)); 
    }
    var thissedFunction = function () {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      method = obj[property]
      if (method) {
        //todo make this conditional
        return method.apply(obj, args);
      } else {
        return
      }
    }
    if (typeof obj !== "object" && typeof obj !== "function") {
      if (isString(obj) && property === "length") {
        return obj.length;
      } else if (isRegExp(obj) && property === "source") {
        return obj.source
      } else if (typeof obj === "number") {
        return obj[property]
      } else if (obj[property] === void 0) { //might not need this one
        return
      } else {
        //thissedFunction.__original == ????
        return thissedFunction //everyting else is a function
      }
    }
    if (property in obj) {
      var ret = obj[property];  
      if (!dontBindObj && isFunction(ret)) {
        originalFunction = ret
        thissedFunction.__original = ret
        ret = thissedFunction
      }
      return ret
    } else if ("_lookup" in obj) {
      var usedObj = childObj || obj
      var ret = (obj._lookup(usedObj, property))
      if (!isUndefined(ret)) {
        return ret  
      }
    }
    var type = obj._type
    var hasTypeObj = (typeof type === "object") || (typeof type === "function");
    if (hasTypeObj) {
      ret = __lookup(type, property, true, obj);
      if (!dontBindObj && isFunction(ret)) { //is don't bind obj needed here
        var fn = function () {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          args.unshift(obj)
          return ret.apply(obj, args)
        }
        fn.__original = ret
        return fn
      } else {
        return ret;
      }
  
    } else {
      return;
    }
  }, __slice = Array.prototype.slice, __hasProp = Object.prototype.hasOwnProperty;
  __useLookup__ = true;
  $ = require("jquery");
  severus = require("severus");
  _ = require("underscore");
  nimble = require("nimble");
  drews = require("drews-mixins");
  severus = require("severus");
  severus.db = "aterciolandia_drewl_us";
  bind = __lookup(drews, "on"), trigger = __lookup(drews, "trigger");
  define("yo-verse-form-view", function() {});
  define("yo-view", function() {
    var YoView;
    return YoView = {
      init: function() {
        var view;
        view = {
          _type: YoView
        };
        __lookup($(".add-form"), "submit")(function(e) {
          __lookup(e, "preventDefault")();
          trigger(view, "submit", {
            line1: __lookup($("#line1"), "val")(),
            line2: __lookup($("#line2"), "val")()
          });
          __lookup($("#line1"), "val")("");
          return __lookup($("#line2"), "val")("");
        });
        return view;
      },
      addVerse: function(yoView, verse) {
        var view;
        view = __lookup(verse, "view");
        return __lookup($("#verses"), "append")(__lookup(view, "el"));
      }
    };
  });
  define("yo-verse-view", function() {
    var YoVerseView, splitter;
    splitter = $("<div class=\"pointer red no-quiero\">No quiero ser nada que no sea yo, nada que no sea yo</div>");
    YoVerseView = {
      init: function(verse, yoView) {
        var html, mySplitter, versePart, view;
        view = {
          verse: verse,
          _type: YoVerseView
        };
        verse.view = view;
        html = $("<div class=\"verse\">\n  <div class=\"verse-part\">\n    <div>" + __lookup(verse, "line1") + "</div>\n    <div>" + __lookup(verse, "line2") + "</div>\n  </div>\n  <div class=\"delete blue pointer\" style=\"display:none;\">Delete</div>\n</div>");
        versePart = __lookup(html, "find")(".verse-part");
        __lookup(versePart, "click")(function() {
          if (!("_id" in verse)) {
            return;
          }
          return __lookup(__lookup(html, "find")(".delete"), "toggle")("fast");
        });
        __lookup(__lookup(html, "find")(".delete"), "click")(function() {
          return trigger(yoView, "delete", verse);
        });
        mySplitter = __lookup(splitter, "clone")();
        __lookup(mySplitter, "bind")("click", function() {
          return __lookup(__lookup($("#no-quiero"), 0), "play")();
        });
        __lookup(html, "append")(mySplitter);
        view.el = html;
        return view;
      },
      remove: function(view) {
        return __lookup(__lookup(view, "el"), "remove")();
      }
    };
    return YoVerseView;
  });
  define("yo-verse", function() {
    var YoVerse;
    YoVerse = {
      init: function(verse) {
        if (verse == null) {
          verse = {};
        }
        verse._type = YoVerse;
        return verse;
      },
      save: function(verse, cb) {
        verse = __lookup(_, "clone")(verse);
        delete verse.view;
        delete verse._type;
        return __lookup(severus, "save")("verses", verse, cb);
      },
      remove: function(verse, cb) {
        return __lookup(severus, "remove")("verses", __lookup(verse, "_id"), cb);
      },
      find: function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return __lookup(severus, "find").apply(severus, ["verses"].concat(__slice.call(args)));
      }
    };
    return YoVerse;
  });
  define("yo-presenter", function() {
    var YoPresenter, YoVerse, YoVerseView, YoView, addVerse;
    YoView = require("yo-view");
    YoVerseView = require("yo-verse-view");
    YoVerse = require("yo-verse");
    addVerse = function(presenter, verse) {
      if (verse == null) {
        verse = {};
      }
      verse = __lookup(YoVerse, "init")(verse);
      verse.view = __lookup(YoVerseView, "init")(verse, __lookup(presenter, "yoView"));
      __lookup(__lookup(presenter, "yoView"), "addVerse")(verse);
      return verse;
    };
    YoPresenter = {
      init: function() {
        var presenter, verse1, verse2, yoView;
        yoView = __lookup(YoView, "init")();
        presenter = {
          _type: YoPresenter
        };
        presenter.yoView = yoView;
        bind(yoView, "submit", function(verse) {
          verse = addVerse(presenter, verse);
          return __lookup(verse, "save")();
        });
        verse1 = __lookup(presenter, "addVerse")({
          line1: "yo no quiero ser Soda",
          line2: "y no me importa no estar de moda"
        });
        verse2 = __lookup(presenter, "addVerse")({
          line1: "yo no quiero ser Julieta",
          line2: "aunque ella sea una mu&#xF1;eca"
        });
        bind(yoView, "delete", function(verse) {
          return __lookup(verse, "remove")(function(err) {
            if (err) {
              return alert(err);
            } else {
              return __lookup(__lookup(verse, "view"), "remove")();
            }
          });
        });
        __lookup(YoVerse, "find")(function(err, verses) {
          return __lookup(_, "each")(verses, function(verse) {
            return __lookup(presenter, "addVerse")(verse);
          });
        });
        return presenter;
      },
      addVerse: addVerse
    };
    return YoPresenter;
  });
  $(function() {
    var yoPresenter;
    return yoPresenter = __lookup(require("yo-presenter"), "init")();
  });
}).call(this);
