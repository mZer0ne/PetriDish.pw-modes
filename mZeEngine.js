// Доп переменые нашего чата
var viewChat = {'ru':true,'en':true,'fr':true,'chatenter':false};
var viewMods = ['ru','en','fr','chatenter'];
var chatMods = ['','all','team','clan'];
var chatMode = 'all';
var teamList = [];
var tempVals = {};

// Инициализация ядра
$.getScript( "https://cdn.socket.io/socket.io-1.3.5.js" ).done(function() {
  // game states
  var chatBoard = [];
  var agar_server = null;
  var map_server = null;
  var map_party = null;
  var map_room_id = null;
  var player_name = [];
  var players = [];
  var id_players = [];
  var user_players = [];
  var cells = [];
  var current_cell_ids = [];
  var start_x = 0,
    start_y = 0,
    end_x = 7000,
    end_y = 7000,
    length_x = 7000,
    length_y = 7000;
  var render_timer = null;
  var chathistory = 100;
  var dop = 0;

  var options = {
    enableMultiCells: true,
    enableCross: true
  };
    var _WebSocket = window._WebSocket = window.WebSocket;
    
    function miniMapConnectToServer() {
      try {
        var host = '5.175.193.30:5001';
        map_server = io(host);
      } catch (e) {
        alert('Minimap not supported :(');
      }
      map_server.on('connect', function(event) {
        if (map_party != null){
          map_server.send({type: 'restore_connection', agar_url: agar_server, party: map_party, room_id: map_room_id});
        }
      });
      map_server.on('message', function(event) {
        if (event.type == 'room_info'){
          if (event.id != undefined) {
            $('#input_party').val(event.id);
            connect();
            join();
          }
        } else if (event.type == 'room_confirm'){
          if (event.room_id != ''){
            map_room_id = event.room_id;
            map_party = event.party;
            var data = map_party.split('@');
            if( $('#region').val() != data[1]){
              showonly(data[0]);

              $("#region [value='" + data[1] + "']").attr("selected", "selected");
              $('#region').val(data[1]);
              
              connn($('#region').val(), $('#region option:selected').html());
              
            }
          } else {
            disconnect();
          }
        } else if (event.type == 'room_data') {
          id_players = event.data.my_tokens;
          user_players = event.data.user_tokens;
        }
      });
      map_server.on('error', function(event) {
        map_server = null;
        console.error('failed to connect to map server');
      });

      map_server.on('close', function(event) {
        console.log('map server disconnected');
      });
    }
    
    function miniMapRender() {
      var canvas = window.mini_map;
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (map_server != null && map_party != null){
        var default_color = 'rgba(132, 132, 132, 1)';
        var id, token = null;
        for (id in id_players){
          token = id_players[id];
          draw(token, token.color);
          if (options.enableCross && current_cell_ids.indexOf(token.id) != -1)
            miniMapDrawCross(token.x, token.y, token.color);
        }
        if (options.enableMultiCells){
          for (id in user_players)
            draw(user_players[id], default_color);
        }
        function draw(token, color){
          var x = token.x * canvas.width;
          var y = token.y * canvas.height;
          var size = token.size * canvas.width;
          ctx.beginPath();
          ctx.arc(
            x,
            y,
            size,
            0,
            2 * Math.PI,
            false
          );
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
        }
      }
    }
    
    function miniMapDrawCross(x, y) {
      var canvas = window.mini_map;
      var ctx = canvas.getContext('2d');
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, y * canvas.height);
      ctx.lineTo(canvas.width, y * canvas.height);
      ctx.moveTo(x * canvas.width, 0);
      ctx.lineTo(x * canvas.width, canvas.height);
      ctx.closePath();
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();
    }
    function miniMapCreateToken(id, color) {
      var mini_map_token = {
        id: id,
        color: color,
        x: 0,
        y: 0,
        size: 0
      };
      return mini_map_token;
    }
    function miniMapRegisterToken(id, token) {
      if (window.mini_map_tokens[id] === undefined) {
        // window.mini_map.append(token);
        window.mini_map_tokens[id] = token;
      }
    }
    function miniMapUnregisterToken(id) {
      if (window.mini_map_tokens[id] !== undefined) {
        // window.mini_map_tokens[id].detach();
        delete window.mini_map_tokens[id];
      }
    }
    function miniMapIsRegisteredToken(id) {
      return window.mini_map_tokens[id] !== undefined;
    }
    function miniMapUpdateToken(id, x, y, size) {
      if (window.mini_map_tokens[id] !== undefined) {
        window.mini_map_tokens[id].x = x;
        window.mini_map_tokens[id].y = y;
        window.mini_map_tokens[id].size = size;
        return true;
      } else {
        return false;
      }
    }
    function miniMapUpdatePos(x, y) {
      window.mini_map_pos.text('x: ' + x.toFixed(0) + ', y: ' + y.toFixed(0));
    }
    function miniMapInit() {
      miniMapConnectToServer();
      window.mini_map_tokens = {};

      // minimap dom
      if ($('#mini-map-wrapper').length === 0) {
        var wrapper = $('<div>').attr('id', 'mini-map-wrapper').css({
          position: 'fixed',
          bottom: 10,
          right: 10,
          width: 300,
          height: 300,
          background: 'rgba(128, 128, 128, 0.58)'
        });
        var mini_map = $('<canvas>').attr({
          id: 'mini-map',
          width: 300,
          height: 300
        }).css({
          width: '100%',
          height: '100%',
          position: 'relative'
        });
        wrapper.append(mini_map).appendTo(document.body);
        window.mini_map = mini_map[0];
      }

      // minimap renderer
      if (render_timer === null)
        render_timer = setInterval(miniMapRender, 1000 / 30);
      
      // minimap location
      if ($('#mini-map-pos').length === 0) {
        window.mini_map_pos = $('<div>').attr('id', 'mini-map-pos').css({
          bottom: 10,
          right: 10,
          color: 'white',
          fontSize: 15,
          fontWeight: 800,
          position: 'fixed',
          padding: '0px 10px'
        }).appendTo(document.body);
      }

      // minimap options
      if ($('#mini-map-options').length === 0) {
        window.mini_map_options = $('<div>').attr('id', 'mini-map-options').css({
          bottom: 315,
          right: 10,
          color: '#666',
          fontSize: 14,
          position: 'fixed',
          fontWeight: 400,
        }).appendTo(document.body);
        
        var container = $('<div>')
          .css({
            background: 'rgba(200, 200, 200, 0.58)',
            padding: 5,
            borderRadius: 5
          })
          .hide();

        for (var name in options) {
          var label = $('<label>').css({
            display: 'block'
          });
          var checkbox = $('<input>').attr({
            type: 'checkbox'
          }).prop({
            checked: options[name]
          });
          label.append(checkbox);
          label.append(' ' + camel2cap(name));
          checkbox.click(function(options, name) { return function(evt) {
            options[name] = evt.target.checked;
            console.log(name, evt.target.checked);
          }}(options, name));
          label.appendTo(container);
        }
        
        var reCreate = $('<a>')
          .attr('href','javascript:void(0);')
          .click(create)
          .text('Create new server')
          .appendTo(container);
        
        container.appendTo(window.mini_map_options);
          
        // minimap form
        var form = $('<div>')
          .addClass('form-inline')
          .css({
            opacity: 0.7,
            marginTop: 2
          })
          .appendTo(window.mini_map_options);
          
        var main_group = $('<div>')
          .addClass('main-group')
          .css({
            display: 'block',
          })
          .appendTo(form);
        
        var CteateBtn = $('<button>')
          .attr('id', 'mini-map-create-btn')
          .css({
            width: '149px'
          })
          .text('Create')
          .click(create)
          .addClass('btn')
          .appendTo(main_group);
          
        var joinBtn = $('<button>')
          .attr('id', 'mini-map-join-btn')
          .css({
            marginLeft: 2,
            width: '149px'
          })
          .text('Join')
          .click(join)
          .addClass('btn')
          .appendTo(main_group);

        // Игрокое меню
        var form_group = $('<div>')
          .addClass('form-group')
          .css({
            display: 'none',
          })
          .appendTo(form);

        var setting_btn = $('<button>')
          .addClass('btn')
          .css({
            float: 'right',
            fontWeight: 800,
            marginLeft: 2,
            height: '34px'
          })
          .on('click', function() {
            container.toggle();
            setting_btn.blur();
            return false;
          })
          .append($('<i>').addClass('glyphicon glyphicon-cog'))
          .appendTo(form_group);

        var addressInput = $('<input>')
          .css({
            width: '160px'
          })
          .attr('id', 'input_party')
          .attr('placeholder', 'Party Code')
          .attr('type', 'text')
          .addClass('form-control')
          .appendTo(form_group);

        var connectBtn = $('<button>')
          .attr('id', 'mini-map-connect-btn')
          .css({
            marginLeft: 2,
            width: '96px'
          })
          .text('Connect')
          .click(connect)
          .addClass('btn')
          .appendTo(form_group);
      }
    }
    
    var create = function () {
      var gameMode = readCookie("selectedmode");
      map_server.send({type: 'room_create', party: '#' + gameMode + '@' + $('#region').val()});
    };
    
    var join = function () {
      $('.main-group').hide();
      $('.form-group').show();
    };
    
    var connect = function () {
      var connectBtn = $('#mini-map-connect-btn');
      map_server.send({type: 'room_connect', agar_url: agar_server, room_id: $('#input_party').val()});
      connectBtn.text('Disconnect');
      connectBtn.off('click');
      connectBtn.on('click', disconnect);
      connectBtn.blur();
    };

    var disconnect = function() {
      var connectBtn = $('#mini-map-connect-btn')
      connectBtn.text('Connect');
      connectBtn.off('click');
      connectBtn.on('click', connect);
      connectBtn.blur();
      map_server.emit('room_disconnect', {});
      map_party = map_room_id = null;
    };
    
    // cell constructor
    function Cell(id, x, y, size, color, name) {
      cells[id] = this;
      this.id = id;
      this.ox = this.x = x;
      this.oy = this.y = y;
      this.oSize = this.size = size;
      this.color = color;
      this.points = [
      ];
      this.pointsAcc = [
      ];
      this.setName(name);
    }
    Cell.prototype = {
      id: 0,
      points: null,
      pointsAcc: null,
      name: null,
      nameCache: null,
      sizeCache: null,
      x: 0,
      y: 0,
      size: 0,
      ox: 0,
      oy: 0,
      oSize: 0,
      nx: 0,
      ny: 0,
      nSize: 0,
      updateTime: 0,
      updateCode: 0,
      drawTime: 0,
      destroyed: false,
      isVirus: true,
      isAgitated: false,
      wasSimpleDrawing: true,
      destroy: function () {
        delete cells[this.id];
        id = current_cell_ids.indexOf(this.id);
        - 1 != id && current_cell_ids.splice(id, 1);
        this.destroyed = true;
        miniMapUnregisterToken(this.id);
      },
      setName: function (name) {
        this.name = name;
      },
      updatePos: function () {
        if (options.enableMultiCells || - 1 != current_cell_ids.indexOf(this.id)) {
          if (!miniMapIsRegisteredToken(this.id))
          {
            miniMapRegisterToken(this.id, miniMapCreateToken(this.id, this.color)
            );
          }
          var size_n = this.nSize / length_x;
          miniMapUpdateToken(this.id, (this.nx - start_x) / length_x, (this.ny - start_y) / length_y, size_n);
        }
        if (options.enablePosition && - 1 != current_cell_ids.indexOf(this.id)) {
          miniMapUpdatePos(this.nx, this.ny);
        }
      }
    };

    String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    };

    function camel2cap(str) {
      return str.replace(/([A-Z])/g, function(s){return ' ' + s.toLowerCase();}).capitalize();
    };

    // create a linked property from slave object
    // whenever master[prop] update, slave[prop] update
    function refer(master, slave, prop) {
      Object.defineProperty(master, prop, {
        get: function () {
          return slave[prop];
        },
        set: function (val) {
          slave[prop] = val;
        },
        enumerable: true,
        configurable: true
      });
    };
    // extract a websocket packet which contains the information of cells
    function extractCellPacket(data, offset) {
      var I = + new Date;
      var qa = false;
      var b = Math.random(),
      c = offset;
      var size = data.getUint16(c, true);
      c = c + 2;
      // destroy foods? (or cells?)
      for (var e = 0; e < size; ++e) {
        var p = cells[data.getUint32(c, true)],
        f = cells[data.getUint32(c + 4, true)],
        c = c + 8;
        p && f && (f.destroy(), f.ox = f.x, f.oy = f.y, f.oSize = f.size, f.nx = p.x, f.ny = p.y, f.nSize = f.size, f.updateTime = I)
      }
      // update or create cells (player)
   
      for (e = 0; ; ) {
        var d = data.getUint32(c, true);
        c += 4;
        if (0 == d) {
          break;
        }
        ++e;
        var p = data.getInt16(c, true),
        c = c + 2,
        f = data.getInt16(c, true),
        c = c + 2;
        g = data.getInt16(c, true);
        c = c + 2;
        for (var h = data.getUint8(c++), m = data.getUint8(c++), q = data.getUint8(c++), h = (h << 16 | m << 8 | q).toString(16); 6 > h.length; )
        h = '0' + h;
        var h = '#' + h,
        k = data.getUint8(c++),
        m = !!(k & 1),
        q = !!(k & 16);
        k & 2 && (c += 4);
        k & 4 && (c += 8);
        k & 8 && (c += 16);
        for (var n, k = ''; ; ) {
          n = data.getUint16(c, true);
          c += 2;
          if (0 == n)
          break;
          k += String.fromCharCode(n)
        }
        n = k;
        k = null;
        // if d in cells then modify it, otherwise create a new cell
        cells.hasOwnProperty(d)
        ? (k = cells[d], k.updatePos(), k.ox = k.x, k.oy = k.y, k.oSize = k.size, k.color = h)
        : (k = new Cell(d, p, f, g, h, n), k.pX = p, k.pY = f);
        k.isVirus = m;
        k.isAgitated = q;
        k.nx = p;
        k.ny = f;
        k.nSize = g;
        k.updateCode = b;
        k.updateTime = I;
        n && k.setName(n);
      }
      // destroy cells(?)
   
      b = data.getUint32(c, true);
      c += 4;
      for (e = 0; e < b; e++)
      d = data.getUint32(c, true),
      c += 4,
      k = cells[d],
      null != k && k.destroy();
    }
    // extract the type of packet and dispatch it to a corresponding extractor
   
    function extractPacket(event) {
      var c = 0;
      var data = new DataView(event.data);
      240 == data.getUint8(c) && (c += 5);
      var opcode = data.getUint8(c);
      c++;
      switch (opcode) {
        case 16: // cells data
          extractCellPacket(data, c);
        break;
        case 20: // cleanup ids
          current_cell_ids = [];
        break;
        case 32: // cell id belongs me
          var id = data.getUint32(c, true);
          if (current_cell_ids.indexOf(id) === -1)
            current_cell_ids.push(id);
        break;
        case 64: // get borders
          start_x = data.getFloat64(c, !0), c += 8,
          start_y = data.getFloat64(c, !0), c += 8,
          end_x = data.getFloat64(c, !0), c += 8,
          end_y = data.getFloat64(c, !0), c += 8,
          center_x = (start_x + end_x) / 2,
          center_y = (start_y + end_y) / 2,
          length_x = Math.abs(start_x - end_x),
          length_y = Math.abs(start_y - end_y);
        break;
        case 99:
          addChat(data, c);
        break;
      }
    }
    
  function addChat(view, offset) {
    function getString() {
      var text = '',
        varchar;
      while ((varchar = view.getUint16(offset, true)) != 0) {
        offset += 2;
        text += String.fromCharCode(varchar);
      }
      offset += 2;
      return text;
    }
    var flags = view.getUint8(offset++);
    // for future expansions
    if (flags & 2) {
      offset += 4;
    }
    if (flags & 4) {
      offset += 8;
    }
    if (flags & 8) {
      offset += 16;
    }

    var r = view.getUint8(offset++),
      g = view.getUint8(offset++),
      b = view.getUint8(offset++),
      color = (r << 16 | g << 8 | b).toString(16);
    while (color.length > 6) {
      color = '0' + color;
    }
    color = '#' + color;
    chatBoard.push({
      "name": getString(),
      "color": color,
      "message": getString(),
      "time": Date.now()
    });
    drawChatBoard();
  }
  
  function drawChatBoard() {
    var nowtime = Date.now();
    var lasttime = 0;
    if (chatBoard.length >= 1) {
      lasttime = chatBoard[chatBoard.length - 1].time;
    } else {
      return;
    }
    var deltat = nowtime - lasttime;
    var len = chatBoard.length;
    var chatnick = chatBoard[len - 1].name;
    var stringlang = '';
    var iddlina = chatnick.indexOf(")") - 1;
    var chatid = chatnick.substr(1,iddlina);
    var chatnicknoid = chatnick.substr(iddlina+2,30);
    var state;
    var mod = '';
    var verif = '';
    var escnick = htmlspecialchars(chatnicknoid);
    
    // Общий чат
    var chColor = '';
    var chType = 'all';
    
    // Клан чат
    var usernickname = $("#nick").val().toLowerCase().trim();
    for(var i = 0; i < superclans.length; i++) {
      if (superclans[i] != '') {
        var getClan = superclans[i].length;
        if (usernickname.substr(0,getClan) == superclans[i]) {
          if (escnick.toLowerCase().substr(0,getClan) == superclans[i]) {
            chColor = 'color:#00FF00';
            chType = 'clan';
          }
        }
      }
    }
    
    // Группавой чат
    if( teamList.indexOf(chatid + ';' + escnick) != -1 ) {
      chColor = 'color:#0000FF';
      chType = 'team';
    }
    
    // Старый чат
    if ((supernames.indexOf(escnick.toLowerCase()) != -1) && (escnick.toLowerCase() != 'wrong password')) {
      verif = '<span class="verified"></span>';
    }
    var gamelang = readCookie("lang");
    if (gamelang == null) {
      gamelang = 'en';
    }
    var chatenter = readCookie("chatenter");
    if (chatenter == null || chatenter == 'false') {
      state = 'display:none;';
      viewChat['chatenter'] = false;
    }
    if (chatenter == 'true') {
      viewChat['chatenter'] = true;
      state = '';
    }
    var chattt = htmlspecialchars(chatBoard[len - 1].message);
    
    if (chatBoard[len - 1].message == '***playerenter***') {
      if(chatMode != chType){
        state = 'display:none;';
      }
      dop = dop+20;
      if (gamelang == 'ru') { chattt = ' вошёл в игру. '; }
      if (gamelang == 'fr') { chattt = ' entre dans le chat. '; }
      if (gamelang == 'en') { chattt = ' enters the game. '; }
      
      
      var mg = "<div class='chatenter " + chType + "'style='" + state + chColor + "'>" + verif + "<small><strong onclick='mZeEngine.chTo(\""  + escnick + "\");' oncontextmenu='mZeEngine.chMenu(\""  + escnick + "\"," + chatid + ",event);return false;'  title='" + chatid + "'  style='color:" + chatBoard[len - 1].color + "'>" + escnick + ":</strong> " + chattt + "</small></div>";
    }
    if (chatBoard[len - 1].message != '***playerenter***') {
      chattt = makeItCultural(chattt);
      dop = 0;
      stringlang = chattt.substr(-3,3);
      state = '';
      var checkchat = readCookie("ruschat");
      viewChat['ru'] = true;
      if ((checkchat == 'false') && (stringlang.substr(1,2) == 'ru')) {
        state = 'display:none;';
        viewChat['ru'] = false;
      }
      var checkchat1 = readCookie("engchat");
      viewChat['en'] = true;
      if ((checkchat1 == 'false') && (stringlang.substr(1,2) == 'en')) {
        state = 'display:none;';
        viewChat['en'] = false;
      }
      var checkchat2 = readCookie("frchat");
      viewChat['fr'] = true;
      if ((checkchat2 == 'false') && (stringlang.substr(1,2) == 'fr')) {
        state = 'display:none;';
        viewChat['fr'] = false;
      }
      if (supermods.indexOf(chatnicknoid.toLowerCase()) != -1) {
        mod = "color:white;background-color:red;padding:0px 5px;";
        chColor = '';
      }
      if(chatMode != chType){
        if(chatMode != 'all'){
          state = 'display:none;';
        }
      }
      var selectedRegion = socketaddr.substr(5,socketaddr.length);
      var mg = "<div class='" + stringlang.substr(1,2) +  " " + chType + "' style='" + state + mod + chColor + "'>" + verif + "<strong onclick='mZeEngine.chTo(\""  + escnick + "\");' oncontextmenu='mZeEngine.chMenu(\""  + escnick + "\"," + chatid + ",event);return false;' title='" + chatid + "' style='color:" + chatBoard[len - 1].color + "'>" + escnick + ":</strong> " + mZeEngine.addSmiles(chattt.substr(0,chattt.length-4)) + "</div>";
    }
    $("#newChatLog").append(mg);
    if ($('#newChatLog div').length > chathistory) {
      $('#newChatLog div').eq(0).remove();
    }
    $("#chatlog").html('');
    var chatWindow = document.getElementById("newChatLog");
    dif = chatWindow.scrollHeight - chatWindow.scrollTop - dop;
    var scrollchats = readCookie("scrollchat");
    if (scrollchats == null) { dif = 0; }
    if (scrollchats == false) { dif = 0; }
    if (dif < 530) {
      $("#newChatLog").scrollTop(500000);
    }
    var from = len - 15;
    if (from < 0) from = 0;
  }

    window.my_tokens = function(){
      var tt = [];
      var user_tokens = [];
      if (current_cell_ids.length > 0){
        for (var id in window.mini_map_tokens) {
          var t = window.mini_map_tokens[id];
          if (-1 != current_cell_ids.indexOf(t.id))
            tt.push(t);
          else if (options.enableMultiCells && t.size > 0.005)
            user_tokens.push(t);
        }
      }
      return {my_tokens: tt, user_tokens: user_tokens}
    };
    
    // the injected point, overwriting the WebSocket constructor
    window.WebSocket = function(url, protocols) {
      console.log('Listen');
      if (protocols === undefined) {
        protocols = [];
      }

      var ws = new _WebSocket(url, protocols);
      refer(this, ws, 'binaryType');
      refer(this, ws, 'bufferedAmount');
      refer(this, ws, 'extensions');
      refer(this, ws, 'protocol');
      refer(this, ws, 'readyState');
      refer(this, ws, 'url');
      this.send = function(data){
        return ws.send.call(ws, data);
      };
      this.close = function(){
        return ws.close.call(ws);
      };
      this.onopen = function(event){};
      this.onclose = function(event){};
      this.onerror = function(event){};
      this.onmessage = function(event){};
      ws.onopen = function(event) {
        miniMapInit();
        agar_server = url;
        if (this.onopen)
          return this.onopen.call(ws, event);
      }.bind(this);
      ws.onmessage = function(event) {
        extractPacket(event);
        if (map_server != null && map_server.connected && map_party != null)
          map_server.emit('game_message', window.my_tokens());
        if (this.onmessage)
          return this.onmessage.call(ws, event);
      }.bind(this);
      ws.onclose = function(event) {
        if (this.onclose)
          return this.onclose.call(ws, event);
      }.bind(this);
      ws.onerror = function(event) {
        if (this.onerror)
          return this.onerror.call(ws, event);
      }.bind(this);
    };
    
    window.WebSocket.prototype = _WebSocket;
    
    $(window.document).ready(function() {
      miniMapInit();
    });

    $(window).load(function() {
      var main_canvas = document.getElementById('canvas');
      if (main_canvas && main_canvas.onmousemove) {
        document.onmousemove = main_canvas.onmousemove;
        main_canvas.onmousemove = null;
      }
    });
});

var interval;
var switchy = false;
$(document).on('keydown',function(e){
  switch(e.keyCode){
    case 9:
      console.log("TAB keydown");
    break;
    case 81:
      if(switchy){
        return;
      }
      switchy = true;
      interval = setInterval(function() {
        $("body").trigger($.Event("keydown", { keyCode: 87}));
        $("body").trigger($.Event("keyup", { keyCode: 87}));
      }, 10);//increase this number to make it fire them out slower
    break;
  }
});
 
$(document).on('keyup',function(e){
  switch(e.keyCode){
    case 9:
      console.log("TAB keyup");
    break;
    case 81:
      switchy = false;
      clearInterval(interval);
    break;
  }
});

$(document).ready(function(){
  $('body').append(
    '<div id="contextMenu">' +
      '<ul>' +
        '<li onclick="mZeEngine.menuGroup();" id="addgroup">Добавить в группу</li>' +
        '<li onclick="mZeEngine.menuGroup();" id="ungroup">Разорвать группу</li>' +
        '<li onclick="mZeEngine.menuSend();">Сообщение</li>' +
        '<li onclick="mZeEngine.menuHide();">Закрыть</li>' +
      '</ul>' +
    '</div>' +
    '<div id="chatdiv">' + 
      '<div id="newChatLog"></div>' +
      '<div class="chatmenu">' +
        '<div id="ch_1" onclick="mZeEngine.chatMod(1);" class="chatall" style="padding:0px;opacity:1;">Общий</div>' +
        '<div id="ch_2" onclick="mZeEngine.chatMod(2);" class="chatteam" style="padding:0px;">Группа</div>' +
        '<div id="ch_3" onclick="mZeEngine.chatMod(3);" class="chatclans" style="padding:0px;">Клан</div>' +
      '</div>' +
    '</div>' +
    "<style>" +
      // Миникарта
      "#minimap-frame{z-index:-999;width:300px;height:300px;}" +
      "#minimap-div{position:relative;left:0px;top:0px;}" +
      
      // Новый Чат Улучшение
      ".chatmenu div{text-align:center;border-radius: 10px 10px 0px 0px;width:111px;float:left;margin:0px 5px;cursor:pointer;opacity:0.2;}" +
      ".chatmenu{position:absolute;top:-20px;left:5px;width:365px;}" +
      "#chatdiv{position:relative;left:10px;top:0px;}" +
      ".chatmenu div:hover{opacity:1;}" +
      
      // Старый чат (UPDATE)
      "#newChatLog{position:absolute;max-height:200px;min-height:200px;width:375px;left:0px;top:0px;overflow:hidden;}" +
      "#chat_textbox{border-radius: 0px 0px 10px 10px;width:375px;left:10px;}" +
      ".blackchat, .whitechat{border-radius: 10px 10px 0px 0px;}" +
      "#newChatLog div strong{cursor: pointer;}" +
      
      // Context Menu
      "#contextMenu{background-color: #FFFFFF;border: 1px solid #bababa;position: absolute;z-index: 999;display:none;}" +
      "#contextMenu ul{list-style-type:none;padding:0px;font-famaly:initial;font-size:12px;margin:0px;}" +
      "#contextMenu ul li{cursor:pointer;padding:7px 36px;background-color:#FFFFFF;color:#000000;}" +
      "#contextMenu ul li:hover{background-color:#4281f4;color:#000000;}" +
    "</style>" + 
    "<script>" + 
      "var mZeEngine = {" +
        "chTo: function( nick ){" + 
          "$('#chat_textbox').val(nick + ', ' + $('#chat_textbox').val());" + 
          "$('body').trigger($.Event('keydown', { keyCode: 13}));" + 
          "$('body').trigger($.Event('keyup', { keyCode: 13}));" + 
        "}," +
        "chMenu: function( nick, id, event ){" + 
          "tempVals['chMenu'] = id + ';' + nick;" +
          "var contextPos = getPosition(event);" +
          "$('#addgroup').hide();" +
          "$('#ungroup').show();" +
          "if(teamList.indexOf(tempVals['chMenu']) == -1) {" +
            "$('#addgroup').show();" +
            "$('#ungroup').hide();" +
          "}" +
          "$('#contextMenu').css({" +
            "'top': contextPos.y + 'px'," +
            "'left': contextPos.x + 'px'" +
          "}).show();" +
        "}," +
        "menuGroup: function(){" + 
          "if(teamList.indexOf(tempVals['chMenu']) != -1) {" +
            "delete teamList[teamList.indexOf(tempVals['chMenu'])];" +
          "}else{" +
            "teamList.push(tempVals['chMenu']);" +
          "}" +
          "this.menuHide();" +
        "}," +
        "menuSend: function(){" + 
          "this.chTo(tempVals['chMenu'].split(';')[1]);" +
          "this.menuHide();" +
        "}," +
        "menuHide: function(){" + 
          "delete tempVals['chMenu'];" +
          "$('#contextMenu').hide();" +
        "}," +
        "addSmiles: function(textNode){" +
          "textNode = textNode.replace(/(\\\:smile\\\:|\\\:\\\))/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/smile.gif\" />');" +
          "textNode = textNode.replace(/(\\\:baby\\\:|\\\:\\\-\\\*)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/baby.gif\" />');" +
          "textNode = textNode.replace(/(\\\:ok\\\:|\\\*OK\\\*)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/ok.gif\" />');" +
          "textNode = textNode.replace(/(\\\:hi\\\:|\\\*HI\\\*)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/hi.gif\" />');" +
          "textNode = textNode.replace(/(\\\:no\\\:|\\\*NO\\\*)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/no.gif\" />');" +
          "textNode = textNode.replace(/(\\\:bye\\\:|\\\*BYE\\\*)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/bye.gif\" />');" +
          "textNode = textNode.replace(/(\\\:nono\\\:|\\\*NONO\\\*)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/nono.gif\" />');" +
          "textNode = textNode.replace(/(\\\:super\\\:|\\\*THUMBS UP\\\*)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/super.gif\" />');" +
          "textNode = textNode.replace(/(\\\:dont\\\:|\\\*STOP\\\*)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/dont.gif\" />');" +
          "textNode = textNode.replace(/(\\\:beer\\\:|\\\*DRINK\\\*)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/beer.gif\" />');" +
          "textNode = textNode.replace(/(\\\:yes\\\:|\\\*YES\\\*)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/yes.gif\" />');" +
          "textNode = textNode.replace(/(\\\:smoke\\\:|\\\*WASSUP\\\*)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/smoke.gif\" />');" +
          "textNode = textNode.replace(/(\\\:love\\\:|\\\*IN LOVE\\\*)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/love.gif\" />');" +
          "textNode = textNode.replace(/(\\\:jeer\\\:|\\\*ROFL\\\*)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/jeer.gif\" />');" +
          "textNode = textNode.replace(/(\\\:kiss\\\:|\\\*KISSING\\\*)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/kiss.gif\" />');" +
          "textNode = textNode.replace(/(\\\:idea\\\:|\\\*YAHOO\\\*)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/idea.gif\" />');" +
          "textNode = textNode.replace(/(\\\:help\\\:|\\\*HELP\\\*)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/help.gif\" />');" +
          "textNode = textNode.replace(/(\\\:red\\\:|\\\:\\\-\\\[)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/red.gif\" />');" +
//          "textNode = textNode.replace(/(\\\:rose\\\:|\\\@\\\}\\\-\\\>\\\-)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/rose.gif\" />');" +
          "textNode = textNode.replace(/(\\\:rose\\\:)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/rose.gif\" />');" +
          "textNode = textNode.replace(/(\\\:grust\\\:|\\\:\\\()/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/grust.gif\" />');" +
          "textNode = textNode.replace(/(\\\:tongue\\\:|\\\:\\\-p)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/tongue.gif\" />');" +
          "textNode = textNode.replace(/(\\\:eek\\\:|\\\=\\\-O)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/eek.gif\" />');" +
          "textNode = textNode.replace(/(\\\:fire\\\:|\\\]\\\:\\\-\\\>)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/fire.gif\" />');" +
          "textNode = textNode.replace(/(\\\:crying\\\:|\\\:\\\'\\\()/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/crying.gif\" />');" +
          "textNode = textNode.replace(/(\\\:wink\\\:|\\\:\\\;\\\))/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/wink.gif\" />');" +
          "textNode = textNode.replace(/(\\\:tongue2\\\:|\\\:\\\-P)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/tongue2.gif\" />');" +
          "textNode = textNode.replace(/(\\\:grenade\\\:|\\\@\\\=)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/grenade.gif\" />');" +
          "textNode = textNode.replace(/(\\\:angel\\\:|O\\\:\\\-\\\))/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/angel.gif\" />');" +
          "textNode = textNode.replace(/(\\\:laugh\\\:|\\\:\\\-D|xD)/ig, '<img src=\"https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/smiles/laugh.gif\" />');" +
          "return textNode;" +
        "}," +
        "chatMod: function( id ){" + 
          "for(var i = 1; i < 4; i++) {" +
            "if( id != i ) {" +
              "if(chatMods[id] == 'all') {" +
                "for(var c = 0; c < viewMods.length; c++) {" +
                  "if(viewChat[viewMods[c]]) {" +
                    "$('#newChatLog .' + viewMods[c]).show();" +
                  "}" +
                "}" +
              "} else {" +
                "$('#newChatLog .' + chatMods[i]).hide();" +
              "}" + 
              "$('#ch_' + i).css('opacity','');" +
            "}" + 
          "}" +
          "for(var i = 0; i < viewMods.length; i++) {" +
            "if(viewChat[viewMods[i]]) {" +
              "$('#newChatLog .' + viewMods[i] + '.' + chatMods[id]).show();" +
            "}" +
          "}" +
          "$('#ch_' + id).css('opacity','1');" +
          "$('#newChatLog').scrollTop(500000);" + 
          "chatMode = chatMods[id];" + 
        "}" +
      "};" +
      "$(window).resize(function(){" +
        "$('#chatdiv').css('top', ($(window).height() - 320) + 'px');" +
      "});" +
      "$('#chatdiv').css('top', ($(window).height() - 320) + 'px');" +
      "$('#livekills').css({'top':'40px','left':'10px'});" +
      "function getPosition(e) {" +
        "var posx = 0;" +
        "var posy = 0;" +
        "if (!e) var e = window.event;" +
        "if (e.pageX || e.pageY) {" +
          "posx = e.pageX;" +
          "posy = e.pageY;" +
        "}else if (e.clientX || e.clientY) {" +
          "posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;" +
          "posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;" +
        "}" +
        "return {x: posx, y: posy};" +
      "}" +
    "</script>"
  );
  
  // Добавляем нас в сворачивание
  $('#chatloghide').attr('onclick', $('#chatloghide').attr('onclick') + ";$('#chatdiv').hide();");
  $('#chatlogshow').attr('onclick', $('#chatlogshow').attr('onclick') + ";$('#chatdiv').show();");
  
  
  
  // Всякое говно от проекта)
  var hhh = screen.width;
  hhh = hhh/2-450;
  $('#chatlog').css({'position':'absolute','width':'0px','height':'0px','z-index':'-999'});
  $("#settingsDialog").animate({ "left": hhh + "px" }, "1" );
  $('#donatewindow, #curser').remove();
});

setInterval(function(){
  var setdarks = readCookie("setdark");
  if (setdarks == 'true') {
    $("#setdark").attr("checked","checked");
    $("#chat_textbox").css("color","white").css("background","rgba(255, 255, 255, 0.2) none repeat scroll 0 0");
    $("#newChatLog, .chatall, .chatteam, .chatclans").removeClass("whitechat").addClass("blackchat");
    $(".chatall, .chatteam, .chatclans").css("background","rgba(255, 255, 255, 0.2)");
    $("#newChatLog, .chatall, .chatteam, .chatclans").css("color","white");
  }
  if (setdarks == 'false') {
    $("#setdark").removeAttr("checked");
    $("#chat_textbox").css("color","black").css("background","rgba(0, 0, 0, 0.2) none repeat scroll 0 0")
    $("#newChatLog, .chatall, .chatteam, .chatclans").removeClass("blackchat").addClass("whitechat");
    $(".chatall, .chatteam, .chatclans").css("background","rgba(0, 0, 0, 0.2)");
    $("#newChatLog, .chatall, .chatteam, .chatclans").css("color","black");
  }
  var scrollchats = readCookie("scrollchat");
	if (scrollchats == null) {
		$("#scrollchat").removeAttr("checked");
		$("#newChatLog").css("overflow-y","hidden");
	}
	if (scrollchats == 'true') {
		$("#scrollchat").attr("checked","checked");
		$("#newChatLog").css("overflow-y","auto");
	}

	if (scrollchats == 'false') {
		$("#scrollchat").removeAttr("checked");
		$("#newChatLog").css("overflow-y","hidden");
	}
}, 1500);