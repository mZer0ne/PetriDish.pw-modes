// ==UserScript==
// @name         PetriMods
// @namespace    PetriMods Engine
// @version      1.2
// @description  Улучшенный игровой процесс
// @author       mZe
// @match        http://petridish.pw/*
// @grant        none
// @run-at       document-body
// ==/UserScript==
var loadEngine = setInterval(function(){
  if(window.jQuery){
    clearInterval(loadEngine);
    window.jQuery.ajax({
        url: "https://api.github.com/repos/mZer0ne/PetriDish.pw-mods/git/refs/heads/master",
        cache: false,
        dataType: "jsonp"
    }).done(function(data) {
        window.jQuery.getScript('https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/' + data.data.object.sha + '/mZeEngine.js');
    }).fail(function() {alert('Error update PetriMod');window.location = 'http://vk.com/petrimods';});
  }
}, 10);
