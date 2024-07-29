// ==UserScript==
// @name         CNKI helper
// @version      0.4.2
// @description  知网助手 - 复制；下载pdf；oversea镜像；下载引用
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

  function exportFile(name, data) {
    let export_blob = new Blob([data], { type: "text/plain,charset=UTF-8" });
    let save_link = document.createElement("a");
    save_link.href = window.URL.createObjectURL(export_blob);
    save_link.download = name;
    save_link.click();
  }

  function dl_quote() {
    const btn_container = document.querySelectorAll(".operat");
    btn_container.forEach(e => {
      e.style.minWidth = '116px';
      const filename = e.parentNode.children[0].children[0].value
      const btn = e.children[0].cloneNode(true);
      btn.href = 'javascript:void(0)'
      btn.target = '_self'
      btn.onclick = r => {
        console.log(r);
        $.post('https://kns.cnki.net/dm8/API/GetExport', {
          filename,
          displaymode: 'GBTREFER,elearning,EndNote',
          uniplatform: 'NZKPT'
        }, data => {
          const file_data = data.data[0].value[0].replaceAll(/\[.\]/, '').split('.')
          const enlData = data.data[2].value[0].replaceAll('%', '\r\n%')
          exportFile(file_data[1] + "_" + file_data[0] + '.enw', enlData)
        })
      }
      e.appendChild(btn);
    })
    console.log(btn_container);
  }

  function init_quote_mutation() {
    const targetNode = document.querySelector("#ModuleSearchResult");
    const config = { attributes: true, childList: true };
    const callback = function (mutationsList, observer) {
      console.log(mutationsList);
      dl_quote()
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }

  function remove_login_ads(){
    document.querySelector(".read-btn-box").style.padding = "0";
    document.querySelector(".guide-box").style.display = "none";
    document.querySelector("main").style.height = "calc(100vh - 44px)";
  }

  function main() {
    if (document.readyState !== 'complete') {
      setTimeout(main, 1000);
      console.log('[cnki-helper]waiting for document ready');
    } else {
      const path = location.pathname.split('/');
      switch (path[1]) {
        case 'kcms':
        case 'kcms2':
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
        case 'kns8s':
          dl_quote();
          init_quote_mutation();
          break;
        case 'nzkhtml':
          remove_login_ads();
          break;
      }
    }
  }
  main();
})();
