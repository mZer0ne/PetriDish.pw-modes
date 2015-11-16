// ==UserScript==
// @name         PetriMods
// @namespace    PetriMods Engine
// @version      1.0
// @description  Улучшенный игровой процесс
// @author       mZe
// @match        http://petridish.pw/*
// @grant        none
// @run-at       document-body
// ==/UserScript==
var loadEngine = setInterval(function(){
  if(window.jQuery){
    window.jQuery.getScript('https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/mZeEngine.js?' + Math.floor((Math.random() * 1000000) + 1));
    clearInterval(loadEngine);
  }
}, 10);
