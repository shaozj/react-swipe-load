"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.on = on;
exports.off = off;
// 浏览器事件封装，支持一次监听多个事件

function on(el, eventName, cb, opts) {
  opts = opts || false;
  var eventNameArr = eventName.split(/\s+/);

  if (el.addEventListener) {
    eventNameArr.map(function (name) {
      if (name) {
        el.addEventListener(name, cb, opts);
      }
    });
  } else if (el.attachEvent) {
    eventNameArr.map(function (name) {
      if (name) {
        el.attachEvent("on" + name, function (e) {
          cb.call(el, e || window.event);
        });
      }
    });
  }
}

function off(el, eventName, cb, opts) {
  opts = opts || false;
  var eventNameArr = eventName.split(/\s+/);

  if (el.removeEventListener) {
    eventNameArr.map(function (name) {
      if (name) {
        el.removeEventListener(name, cb, opts);
      }
    });
  } else if (el.detachEvent) {
    eventNameArr.map(function (name) {
      if (name) {
        el.detachEvent("on" + name, cb);
      }
    });
  }
}