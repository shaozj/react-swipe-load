// 浏览器事件封装

export function on(el, eventName, cb, opts) {
  opts = opts || false;
  if (el.addEventListener) {
    el.addEventListener(eventName, cb, opts);
  } else if (el.attachEvent) {
    el.attachEvent(`on${eventName}`, e => {
      cb.call(el, e || window.event);
    });
  }
}

export function off(el, eventName, cb, opts) {
  opts = opts || false;
  if (el.removeEventListener) {
    el.removeEventListener(eventName, cb, opts);
  } else if (el.detachEvent) {
    el.detachEvent(`on${eventName}`, cb);
  }
}
