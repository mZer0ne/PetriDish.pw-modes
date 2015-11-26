window.jQuery.getScript( "https://cdn.socket.io/socket.io-1.3.5.js" );
window.jQuery.getScript( "http://cdn.jsdelivr.net/msgpack/1.05/msgpack.js" );

window.msgpack = this.msgpack;

setTimeout(function(){
  (function () {
    var _WebSocket = window._WebSocket = window.WebSocket;
    var $ = window.jQuery;
    var msgpack = window.msgpack;
    var options = {
      enableMultiCells: true,
      enableCross: true
    };

    // game states
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
    var start_x = -7000,
      start_y = -7000,
      end_x = 7000,
      end_y = 7000,
      length_x = 14000,
      length_y = 14000;
    var render_timer = null;
    
    function miniMapConnectToServer() {
      try {
        var host = '5.175.193.30:5001';
        map_server = io(host);
      } catch (e) {
        alert('Minimap not supported :(');
      }
      map_server.on('connect', function(event) {
        if (map_party != null)
          map_server.send({type: 'restore_connection', agar_url: agar_server, party: map_party, room_id: map_room_id});
      });
      map_server.on('message', function(event) {
        if (event.type == 'room_confirm'){
          if (event.room_id != ''){
            map_room_id = event.room_id;
            map_party = event.party;
            joinParty(event.party);
          } else {
            $('#input_party').val('')
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
      for (var id in window.mini_map_tokens) {
        var token = window.mini_map_tokens[id];
        ctx.beginPath();
        ctx.arc(token.x * canvas.width, token.y * canvas.height, token.size * canvas.width, 0, 2 * Math.PI, false
        );
        ctx.closePath();
        ctx.fillStyle = token.color;
        ctx.fill();
        if (options.enableCross && - 1 != current_cell_ids.indexOf(token.id))
        miniMapDrawCross(token.x, token.y);
      };
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
      var $ = window.jQuery;
      window.mini_map_tokens = {};
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
      setInterval(miniMapRender, 1000 / 30);
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
      if ($('#mini-map-options').length === 0) {
        window.mini_map_options = $('<div>').attr('id', 'mini-map-options').css({
          bottom: 315,
          right: 10,
          color: '#666',
          fontSize: 14,
          position: 'fixed',
          padding: '0px 10px',
          fontWeight: 400
        }).appendTo(document.body);
        var container = $('<div>').hide();
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
          label.append(' ' + name);
          checkbox.click(function (options, name) {
            return function (evt) {
              options[name] = evt.target.checked;
              console.log(name, evt.target.checked);
            }
          }(options, name));
          label.appendTo(container);
        }
        container.appendTo(window.mini_map_options);
        $('<a>').attr('href', '#').css({
          float: 'right',
          fontWeight: 800
        }).text('settings').click(function () {
          container.toggle();
          return false;
        }).appendTo(window.mini_map_options);
      }
    }
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
      isVirus: false,
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
      switch (data.getUint8(c++)) {
        case 16: // cells data
          extractCellPacket(data, c);
          break;
        case 20: // cleanup ids
          current_cell_ids = [
          ];
          break;
        case 32: // cell id belongs me
          var id = data.getUint32(c, true);
          current_cell_ids.push(id);
          break;
        case 64: // get borders
          start_x = data.getFloat64(c, !0),
          c += 8,
          start_y = data.getFloat64(c, !0),
          c += 8,
          end_x = data.getFloat64(c, !0),
          c += 8,
          end_y = data.getFloat64(c, !0),
          c += 8,
          center_x = (start_x + end_x) / 2,
          center_y = (start_y + end_y) / 2,
          length_x = Math.abs(start_x - end_x),
          length_y = Math.abs(start_y - end_y);
      }
    };
    // the injected point, overwriting the WebSocket constructor
    window.WebSocket = function (url, protocols) {
      console.log('Listen');
      if (protocols === undefined) {
        protocols = [
        ];
      }
      var ws = new _WebSocket(url, protocols);
      refer(this, ws, 'binaryType');
      refer(this, ws, 'bufferedAmount');
      refer(this, ws, 'extensions');
      refer(this, ws, 'protocol');
      refer(this, ws, 'readyState');
      refer(this, ws, 'url');
      this.send = function (data) {
        return ws.send.call(ws, data);
      };
      this.close = function (code, reason) {
        return ws.close.call(ws, code, reason);
      };
      this.onopen = function (event) {
      };
      this.onclose = function (event) {
      };
      this.onerror = function (event) {
      };
      this.onmessage = function (event) {
      };
      ws.onopen = function (event) {
        return this.onopen.call(ws, event);
      }.bind(this);
      ws.onmessage = function (event) {
        extractPacket(event);
        return this.onmessage.call(ws, event);
      }.bind(this);
      ws.onclose = function (event) {
        return this.onclose.call(ws, event);
      }.bind(this);
      ws.onerror = function (event) {
        return this.onerror.call(ws, event);
      }.bind(this);
    };
    window.WebSocket.prototype = _WebSocket;
    $(window.document).ready(function () {
      miniMapInit();
    })
  }) ();
},1500);