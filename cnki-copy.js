// ==UserScript==
// @name         CNKI copy
// @version      0.1
// @description  复制知网HTML阅读内容
// @author       kuai
// @match        https://kns.cnki.net/KXReader/*
// @match        https://x.cnki.net/read/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  setTimeout(function () {
    document.onkeydown = function (e) {
      if (e.key == 'c' && e.ctrlKey) {
        const selection = window.getSelection();
        navigator.clipboard.writeText(selection.toString()).then(function() {
          console.log('copy');
        }, function() {
          console.log('copy failed');
        });
      }
    };
    console.log('key timeout');
  }, 2000);
})();
