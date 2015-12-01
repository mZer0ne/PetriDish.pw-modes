// ==UserScript==
// @name         PetriMods
// @namespace    PetriMods Engine
// @version      1.3
// @description  Улучшенный игровой процесс
// @author       mZe
// @match        http://petridish.pw/*
// @grant        none
// ==/UserScript==
$.ajax({
  url: "https://api.github.com/repos/mZer0ne/PetriDish.pw-mods/git/refs/heads/master",
  cache: false,
  dataType: "jsonp"
}).done(function(data) {
  $.getScript('https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/' + data.data.object.sha + '/mZeEngine.js');
}).fail(function() {
  alert('Error update PetriMod');
  window.location = 'http://vk.com/petrimods';
});