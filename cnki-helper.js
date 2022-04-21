// ==UserScript==
// @name         CNKI helper
// @version      0.3.1
// @description  知网助手
// @author       kuai
// @match        https://kns.cnki.net/*
// @match        https://x.cnki.net/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  function copy_hook() {
    const unselectable = document.querySelectorAll('h1,h2');
    for (const element of unselectable) {
      element.style.userSelect = 'text';
    }

    document.onkeydown = function (e) {
      if (e.key == 'c' && e.ctrlKey) {
        const selection = window.getSelection();
        navigator.clipboard.writeText(selection.toString()).then(
          function () {
            console.log('[cnki-helper]copy finished');
          },
          function () {
            console.log('[cnki-helper]copy failed');
          }
        );
      }
    };
    console.log('[cnki-helper]copy hooked');
  }

  function dl_pdf() {
    let parent = document.querySelector('.operate-btn');
    if (parent.children.length < 5) {
      console.log('[cnki-helper]unnecessary to hook dl_pdf');
    } else {
      let pdf_btn = parent.children[2].cloneNode(true);
      let pdf_a = pdf_btn.children[0];
      pdf_a.innerHTML = '<i></i>整本PDF';
      pdf_a.href = parent.children[1].children[0].href
        .replace('dflag=nhdown', 'dflag=pdfdown')
        .replace('dflag=cajdown', 'dflag=pdfdown');
      parent.insertBefore(pdf_btn, parent.children[2]);
      let mirror_btn = parent.children[5].cloneNode(true);
      let mirror_a = mirror_btn.children[0];
      mirror_a.innerHTML = '<i></i>oversea镜像';
      mirror_a.href = location.href.replace('kns.cnki.net', 'oversea.cnki.net');
      parent.appendChild(mirror_btn);
      console.log('[cnki-helper]hook dl_pdf finished');
    }
  }

  function main() {
    if (document.readyState !== 'complete') {
      setTimeout(main, 1000);
      console.log('[cnki-helper]waiting for document ready');
    } else {
      const path = location.pathname.split('/');
      switch (path[1]) {
        case 'kcms':
          if (path[3] === 'detail.aspx') {
            dl_pdf();
          }
          break;
        case 'read':
          copy_hook();
          break;
        case 'KXReader':
          copy_hook();
          break;
      }
    }
  }
  main();
})();
