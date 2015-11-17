// Стандартные переменные
var playerGroup = [];
var isTargeting = false;
var socketState = 0;
var socketaddr = '';
var targetBufferX = 0;
var targetBufferY = 0;
var mapmaxX = 0;
var mapmaxY = 0;
var freeze = false;
var settednick = '';
var chathistory = 100;
var spectclick = false;
var helpte = $("#chat_textbox").attr("placeholder");

// Основное ядро
(function(win, $) {
var myx = 0;
var myy = 0;
var myla = '';
var dop = 0;
var mycolo = '';
var myprevnick = '';

var interval;
var switchy = false;

    const DEBUG = false;
    /**
     * @param {string} total
     * @return {undefined}
     */
    function debug(total) {
        if (DEBUG) {
            console.log("debug: " + Date.now() + " " + total);
        }
    }
    /**
     * @return {undefined}
     */
    function init() {
        /** @type {boolean} */
        initialized = true;
        var isTyping = false;
        var chattxt;
        /** @type {(HTMLElement|null)} */
        canvas = cv = document.getElementById("canvas");
        chatarea = document.getElementById("chatlog");
        ctx = canvas.getContext("2d");
        /**
         * @param {Event} e
         * @return {undefined}
         */




        canvas.onfocus = function () {
            isTyping = false;
        };

        document.getElementById("chat_textbox").onblur = function () {
            isTyping = false;
	    $("#chat_textbox").attr("placeholder",helpte);
        };


        document.getElementById("chat_textbox").onfocus = function () {
	    $("#chat_textbox").attr("placeholder","");
            isTyping = true;
        };

        document.getElementById("nick").onblur = function () {
            isTyping = false;
        };


        document.getElementById("nick").onfocus = function () {
            isTyping = true;
        };

        document.getElementById("password").onblur = function () {
            isTyping = false;
        };


        document.getElementById("password").onfocus = function () {
            isTyping = true;
        };


        document.getElementById("serverpassword").onblur = function () {
            isTyping = false;
        };


        document.getElementById("serverpassword").onfocus = function () {
            isTyping = true;
        };

        document.getElementById("kompasx").onblur = function () {
            isTyping = false;
        };


        document.getElementById("kompasx").onfocus = function () {
            isTyping = true;
        };

        document.getElementById("kompasy").onblur = function () {
            isTyping = false;
        };


        document.getElementById("kompasy").onfocus = function () {
            isTyping = true;
        };


        canvas.onmousedown = function(e) {
            if (isMobile) {
                /** @type {number} */
                var x0 = e.clientX - (5 + width / 5 / 2);
                /** @type {number} */
                var y0 = e.clientY - (5 + width / 5 / 2);
                if (Math.sqrt(x0 * x0 + y0 * y0) <= width / 5 / 2) {
                    updateMousePosition();
                    sendPacket(17);
                    return;
                }
            }
	 if (!isSpectating) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            updateMouseAim();
            updateMousePosition();
	 }
	 if (isSpectating) {
            mouseX = e.clientX;
            mouseY = e.clientY;
	    spectclick = true;
            updateMouseAim();
            updateMousePosition();
	    middleX = aimX;
	    middleY = aimY;
		if (middleX > maxX-1000) { middleX = maxX-1000;}
		if (middleX < 1000) { middleX = 1000;}
		if (middleY > maxY-1000) { middleY = maxY-1000;}
		if (middleY < 1000) { middleY = 1000;}
	 }



        };


	chatarea.onmousedown = function(e) {
	 if (isSpectating) {
            mouseX = e.clientX;
            mouseY = e.clientY;
	    spectclick = true;
            updateMouseAim();
            updateMousePosition();
	    middleX = aimX;
	    middleY = aimY;
		if (middleX > maxX-1000) { middleX = maxX-1000;}
		if (middleX < 1000) { middleX = 1000;}
		if (middleY > maxY-1000) { middleY = maxY-1000;}
		if (middleY < 1000) { middleY = 1000;}
	 }
	}


        window.onmousemove = function(e) {
	 if (!isSpectating) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            updateMouseAim();
	 }
   
        	if (!isSpectating) { 
        	    if (0.8 > zoom) { zoom = 0.8; }
        	    if (zoom > 4 / ratio) { zoom = 4 / ratio; }
        	}


        };





        /**
         * @return {undefined}
         */
        canvas.onmouseup = function() {};
        if (/firefox/i.test(navigator.userAgent)) {
            document.addEventListener("DOMMouseScroll", onDocumentMouseScroll, false);
        } else {
            /** @type {function (Event): undefined} */
            document.body.onmousewheel = onDocumentMouseScroll;
        }
        /** @type {boolean} */
        var keySpacePressed = false;
        /** @type {boolean} */
        var keyQPressed = false;
        /** @type {boolean} */
        var keyWPressed = false;
        var keyVPressed = false;
        /**
         * @param {?} e
         * @return {undefined}
         */
        win.onkeydown = function(e) {
            if (!(32 != e.keyCode)) {
                if ((!keySpacePressed) && (!isTyping)) {
                    updateMousePosition();
                    sendPacket(17);
                    /** @type {boolean} */
                    keySpacePressed = true;
                }
            }
            if (!(81 != e.keyCode)) {
                if ((!keyQPressed) && (!isTyping) && (!freeze)) {
                    if(switchy){
                        return;
                    }
                    switchy = true;
                    interval = setInterval(function() {
                        sendPacket(21);
                    }, 10);
                    keyQPressed = true;
                }
            }
            if (!(87 != e.keyCode)) {
                if ((!keyWPressed) && (!isTyping) && (!freeze)) {
                    updateMousePosition();
                    sendPacket(21);
                    /** @type {boolean} */ 
                    keyWPressed = true;
                }
            }


            if (!(86 != e.keyCode)) {
                if ((!keyVPressed) && (!isTyping) && (!freeze)) {
                    updateMousePosition();
                    sendPacket(22);
                    /** @type {boolean} */ 
                    keyVPressed = true;
                }
            }



            if (27 == e.keyCode) { //XXX
                if ($("#overlays").css("display") == "none") {
                    showOverlays(true);
                } else {
                    hide();
                }
            }

            if (69 == e.keyCode) { //XXX
              if (!isTyping) {
                          if (isTargeting == true) {
                              shootonn();
                          } else {
                              shootofff();
                          }
              }
            }

            if (38 == e.keyCode) { //XXX
              if (!isTyping && isSpectating) {
                spectclick = true;
                           aimY = middleY - 1000;
               middleY -= 1000;
              if (middleY < 1000) { middleY = 1000;}
              updateMousePosition();
              }
            }
            if (40 == e.keyCode) { //XXX
              if (!isTyping && isSpectating) {
                spectclick = true;
                           aimY = middleY + 1000;
               middleY += 1000;
              if (middleY > maxY-1000) { middleY = maxY-1000;}
              updateMousePosition();
              }
            }

            if (37 == e.keyCode) { //XXX
              if (!isTyping && isSpectating) {
                spectclick = true;
                           aimX = middleX - 1000;
               middleX -= 1000;
              if (middleX < 1000) { middleX = 1000;}
              updateMousePosition();
              }
            }

            if (39 == e.keyCode) { //XXX
              if (!isTyping && isSpectating) {
                spectclick = true;
                           aimX = middleX + 1000;
               middleX += 1000;
              if (middleX > maxX-1000) { middleX = maxX-1000;}
              updateMousePosition();
              }
            }

            if (70 == e.keyCode) { //XXX
              if (!isTyping) {
                            if (freeze == true) {
                                freeze = false;
                    $("#pauseblock").hide();
                  fly("Game resumed");
                            } else {
                                freeze = true;
                    $("#pauseblock").show();
                  fly("Game paused");
                            }
              }
            }

            if (65 == e.keyCode) { 
              if (!isTyping) {

                          if ($("#overlays").css("display") == "none") {
                              showOverlays(true);
                jQuery('#opts, #langs, #settingsDialog').show();
                          } else {
                              hide();
                          }

              }
            }


            if (13 == e.keyCode) { //XXX
                    if (isTyping) {
                        isTyping = false;
                        document.getElementById("chat_textbox").blur();
                        var chatlang = readCookie("lang");
                        if (chatlang == null) { chatlang = 'en' };
                        chattxt = document.getElementById("chat_textbox").value;
                        if (chattxt.length > 0) sendChat(chattxt + " :" + chatlang);
                        document.getElementById("chat_textbox").value = "";

                    }
                    else {
                        if (!hasOverlay) {
                            document.getElementById("chat_textbox").focus();
                            isTyping = true;
                        }
                    }
		}



        };
        /**
         * @param {?} event
         * @return {undefined}
         */
        win.onkeyup = function(event) {
            if (32 == event.keyCode) {
                /** @type {boolean} */
                keySpacePressed = false;
            }
            if (87 == event.keyCode) {
                /** @type {boolean} */
                keyWPressed = false;
            }
            if (86 == event.keyCode) {
                /** @type {boolean} */
                keyVPressed = false;
            }
            if (81 == event.keyCode) {
                clearInterval(interval);
                keyQPressed = false;
                switchy = false;
            }
        };
        /**
         * @return {undefined}
         */
        win.onblur = function() {
            sendPacket(19);
            /** @type {boolean} */
            keyWPressed = keyQPressed = keySpacePressed = false;
        };
        /** @type {function (): undefined} */
        window.onresize = onResize;
        onResize();
        if (win.requestAnimationFrame) {
            win.requestAnimationFrame(tick);
        } else {
            setInterval(draw, 1E3 / 60);
        }
        setInterval(updateMousePosition, 100);


        $("#overlays").show();

    }
    /**
     * @param {Event} event
     * @return {undefined}
     */
    function onDocumentMouseScroll(event) {

        zoom *= Math.pow(0.9, event.wheelDelta / -120 || (event.detail || 0));
        if (!isSpectating) { 
            if (0.8 > zoom) {
                zoom = 0.8;
            }
            if (zoom > 4 / ratio) {
                zoom = 4 / ratio;
            }
       }

        if (isSpectating) { 
            if (0.2 > zoom) {
                zoom = 0.2;
            }
            if (zoom > 3 / ratio) {
                zoom = 3 / ratio;
            }
       }


    }
    /**
     * @return {undefined}
     */
    function update() {
        if (0.4 > ratio) {
            /** @type {null} */
            context = null;
        } else {
            /** @type {number} */
            var minX = Number.POSITIVE_INFINITY;
            /** @type {number} */
            var minY = Number.POSITIVE_INFINITY;
            /** @type {number} */
            var maxX = Number.NEGATIVE_INFINITY;
            /** @type {number} */
            var maxY = Number.NEGATIVE_INFINITY;
            /** @type {number} */
            var maxSize = 0;
            /** @type {number} */
            var i = 0;
            for (; i < list.length; i++) {
                var data = list[i];
                if (!!data.shouldRender()) {
                    if (!data.wasSimpleDrawing) {
                        if (!(20 >= data.size * ratio)) {
                            /** @type {number} */
                            maxSize = Math.max(data.size, maxSize);
                            /** @type {number} */
                            minX = Math.min(data.x, minX);
                            /** @type {number} */
                            minY = Math.min(data.y, minY);
                            /** @type {number} */
                            maxX = Math.max(data.x, maxX);
                            /** @type {number} */
                            maxY = Math.max(data.y, maxY);
                        }
                    }
                }
            }
            context = path.init({
                minX: minX - (maxSize + 100),
                minY: minY - (maxSize + 100),
                maxX: maxX + (maxSize + 100),
                maxY: maxY + (maxSize + 100),
                maxChildren: 2,
                maxDepth: 4
            });
            /** @type {number} */
            i = 0;
            for (; i < list.length; i++) {
                if (data = list[i], data.shouldRender() && !(20 >= data.size * ratio)) {
                    /** @type {number} */
                    var j = 0;
                    /** @type {number} */
                    var x = 0;
                    /** @type {number} */
                    var y = 0;
                    for (; j < data.points.length; ++j) {
                        x = data.points[j].x;
                        y = data.points[j].y;
                        if (!(x < offsetX - width / 2 / ratio)) {
                            if (!(y < offsetY - height / 2 / ratio)) {
                                if (!(x > offsetX + width / 2 / ratio)) {
                                    if (!(y > offsetY + height / 2 / ratio)) {
                                        context.insert(data.points[j]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    /**
     * @return {undefined}
     */
    function updateMouseAim() {
      aimX = (mouseX - width / 2) / ratio + offsetX;
      aimY = (mouseY - height / 2) / ratio + offsetY;
    }

    /**
     * @return {undefined}
     */
    function hide() {
      if ($("#stats").css("display") != "none") {
        $('#stats,#serverstats').hide();
        $('#statssmall').show();
        $('#descriptionDialog').show();
        $('#helloDialog').show();
        realtimeenable();
      }else {
        hasOverlay = false;
        $("#overlays").hide();
         realtimedisable();
      }
    }
    /**
     * @param {boolean} isAlive
     * @return {undefined}
     */
    function showOverlays(isAlive) {
      realtimeenable();
        hasOverlay = true;
        /** @type {null} */
        nick = null;
        $("#overlays").fadeIn(isAlive ? 200 : 200);
        OnShowOverlay(isAlive);
    }



    /**
     * @return {undefined}
     */
    function connect() {
      if (initialized) {
        if (region) {
          $("#connecting").show();
        }
      }
    }
    /**
     * @param {string} url
     * @return {undefined}
     */
    function open(url) {
      socketaddr = url;
        if (socket) {
            /** @type {null} */
            socket.onopen = null;
            /** @type {null} */
            socket.onmessage = null;
            /** @type {null} */
            socket.onclose = null;
            try {
                socket.close();
            } catch (b) {}
            /** @type {null} */
            socket = null;
        }
 

        /** @type {Array} */
        ids = [];
        /** @type {Array} */
        playerGroup = [];
        blobs = {};
        /** @type {Array} */
        list = [];
        /** @type {Array} */
        sprites = [];
        /** @type {Array} */
        users = [];
        /** @type {null} */
        img = angles = null;
        /** @type {number} */
        score = 0;
        $("#server_ip").val(url.substr(5)); //XXX
        console.log("Connecting to PetriDish.pw server at " + url);
        /** @type {WebSocket} */
        socket = new WebSocket(url);
        /** @type {string} */
        socket.binaryType = "arraybuffer";
        /** @type {function (): undefined} */
        socket.onopen = socketOpen;
        /** @type {function (MessageEvent): undefined} */
        socket.onmessage = socketMessage;
        /** @type {function (): undefined} */
        socket.onclose = socketClose;
        /**
         * @return {undefined}
         */
        socket.onerror = function() {
            console.log("PetriDish.pw report: socket error");
        };
    }
    /**
     * @param {number} bytes
     * @return {?}
     */
    function createBuffer(bytes) {
        return new DataView(new ArrayBuffer(bytes));
    }
    /**
     * @param {?} array
     * @return {undefined}
     */
    function socketWrite(array) {
        socket.send(array.buffer);
    }
    /**
     * @return {undefined}
     */
    function socketOpen() {
        /** @type {number} */
        backoff = 500;
	socketState = 1;
        $("#connecting").hide();
		jQuery("#playBtn").removeAttr("disabled").removeAttr("alt").removeAttr("title");
		jQuery("#overlays").css("background","");
		jQuery("#overlays").css("background-color","rgba(0, 0, 0, 0.5)");

		jQuery("#playBtn").css("float","left").css("width","255px");
		jQuery("#spectateBtn").show();

        console.log("PetriDish.pw report: socket open");
        var buffer = createBuffer(5);
        buffer.setUint8(0, 254);
        buffer.setUint32(1, 4, true);
        socketWrite(buffer);
        buffer = createBuffer(5);
        buffer.setUint8(0, 255);
        buffer.setUint32(1, 673720361, true);
        socketWrite(buffer);
        sendNick();
        sendPass();
	sendChat("***playerenter***");
	sendChat("***playerenter***");
    }
    /**
     * @return {undefined}
     */
    function socketClose() {
	socketState = 0;
	socketaddr = '';
        console.log("PetriDish.pw report: socket close");
        setTimeout(connect, backoff);
        backoff *= 1.5;
    }
    /**
     * @param {MessageEvent} a
     * @return {undefined}
     */
    function socketMessage(a) {
        parse(new DataView(a.data));
    }
    /**
     * @param {DataView} reader
     * @return {undefined}
     */
    function parse(reader) {
        /**
         * @return {?}
         */
        function encode() {
            /** @type {string} */
            var str = "";
            for (;;) {
                var b = reader.getUint16(offset, true);
                offset += 2;
                if (0 == b) {
                    break;
                }
                str += String.fromCharCode(b);
            }
            return str;
        }
        /** @type {number} */
        var offset = 0;
        if (240 == reader.getUint8(offset)) {
            offset += 5;
        }
        switch (reader.getUint8(offset++)) {
            case 16:
                qweR(reader, offset);
                break;
            case 17:
                middleX = reader.getFloat32(offset, true);
                offset += 4;
                middleY = reader.getFloat32(offset, true);
                offset += 4;
                chunk = reader.getFloat32(offset, true);
                offset += 4;
                break;
            case 20:
                /** @type {Array} */
                playerGroup = [];
                /** @type {Array} */
                ids = [];
                break;
            case 21:
                targetX = reader.getInt16(offset, true);
                offset += 2;
                targetY = reader.getInt16(offset, true);
                offset += 2;
                if (!isTargeting) {
                    /** @type {boolean} */
                    isTargeting = true;
                    targetBufferX = targetX;
                    targetBufferY = targetY;
                }
                break;
            case 32:
                ids.push(reader.getUint32(offset, true));
                offset += 4;
                break;
            case 49:
                if (null != angles) {
                    break;
                }
                var b = reader.getUint32(offset, true);
                offset = offset + 4;
                /** @type {Array} */
                users = [];
                /** @type {number} */
                var a = 0;
                for (; a < b; ++a) {
                    var token = reader.getUint32(offset, true);
                    offset = offset + 4;
                    users.push({
                        id: token,
                        name: encode()
                    });
                }
                render();
                break;
            case 50:
                /** @type {Array} */
                angles = [];
                b = reader.getUint32(offset, true);
                offset += 4;
                /** @type {number} */
                a = 0;
                for (; a < b; ++a) {
                    angles.push(reader.getFloat32(offset, true));
                    offset += 4;
                }
                render();
                break;

            case 64:
                minX = reader.getFloat64(offset, true);
                offset += 8;
                minY = reader.getFloat64(offset, true);
                offset += 8;
                maxX = reader.getFloat64(offset, true);
                offset += 8;
                maxY = reader.getFloat64(offset, true);
                offset += 8;

                mapmaxX = maxX;
                mapmaxY = maxY;

                /** @type {number} */
                middleX = (maxX + minX) / 2;
                /** @type {number} */
                middleY = (maxY + minY) / 2;
                /** @type {number} */
                chunk = 1;
                if (0 == playerGroup.length) {
                    /** @type {number} */
                    offsetX = middleX;
                    /** @type {number} */
                    offsetY = middleY;
                    /** @type {number} */
                    ratio = chunk;
                }

              break;

            case 78:
                wrongpass = reader.getUint8(offset, true);
                offset += 1;
                jQuery("#servermsg").html("<div style='width: 350px; background-color: red; margin: 100px auto; border-radius: 15px; padding: 5px 15px 5px 15px;'><h2>Wrong server password</h2><h2>Неправильный пароль к серверу.</h2></div>");
                jQuery("#servermsg").show().hide(3000);



                break;


            case 90:
                uptime = reader.getFloat64(offset, true);
                offset += 8;
                uptime = (~~(uptime / 60) + 1);
                jQuery("#uptime").html("uptime: " + uptime + " minutes");
                onlinestat = reader.getFloat64(offset, true);
                offset += 8;
                jQuery("#onlinestat").html(onlinestat);   
                break;

            case 91:
                ban = reader.getUint8(offset, true);
                offset += 1;
                jQuery("#servermsg").html("<div style='width: 350px; background-color: red; margin: 100px auto; border-radius: 15px; padding: 5px 15px 5px 15px;'><h2>You have been banned</h2><h2>Вас забанили</h2>Как получить разбан? - <br/><a href='http://vk.com/topic-93436967_32600634'>http://vk.com/topic-93436967_32600634</a></div>");
                jQuery("#servermsg").show().hide(3000);



                break;

            case 92:
                connlimit = reader.getUint8(offset, true);
                offset += 1;
                jQuery("#servermsg").html("<div style='width: 350px; background-color: red; margin: 100px auto; border-radius: 15px; padding: 5px 15px 5px 15px;'><h2>Too many connections from your IP</h2><h2>Слишком много соединений с одного IP</h2></div>");
                jQuery("#servermsg").show().hide(3000);


                break;

            case 93:
                slotslimit = reader.getUint8(offset, true);
                offset += 1;
                jQuery("#servermsg").html("<div style='width: 350px; background-color: red; margin: 100px auto; border-radius: 15px; padding: 5px 15px 5px 15px;'><h2>No more slots</h2><h2>Слотов нет</h2></div>");
                jQuery("#servermsg").show().hide(3000);

                break;

            case 94:
                nickslimit = reader.getUint8(offset, true);
                offset += 1;
                jQuery("#servermsg").html("<div style='width: 350px; background-color: red; margin: 100px auto; border-radius: 15px; padding: 5px 15px 5px 15px;'><h2>Too many nicks</h2><h2>Слишком часто меняешь имя</h2></div>");
                jQuery("#servermsg").show().hide(3000);

                break;

            case 95:
                gotospec = reader.getUint8(offset, true);
                offset += 1;
                setTimeout("jQuery('#specbutton').show();setUnlimitedZoom(false);connnspec($('#region').val(),$('#region option:selected').html()); startthegame();", 2000);
                break;

            case 99:
                addChat(reader, offset);
                break;
        }
    }








    function addChat(view, offset) {
        function getString() {
            var text = '',
                char;
            while ((char = view.getUint16(offset, true)) != 0) {
                offset += 2;
                text += String.fromCharCode(char);
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
        if (chatBoard.length >= 1)
            lasttime = chatBoard[chatBoard.length - 1].time;
        else return;
        var deltat = nowtime - lasttime;


        var len = chatBoard.length;

	if(isDarkTheme) { $("#chatlog").css("color","white"); $("#chat_textbox").css("color","white").css("background","rgba(255, 255, 255, 0.2) none repeat scroll 0 0"); }
	if(!isDarkTheme) { $("#chatlog").css("color","black"); $("#chat_textbox").css("color","black").css("background","rgba(0, 0, 0, 0.2) none repeat scroll 0 0");}

var chatnick = chatBoard[len - 1].name;
var stringlang;
stringlang = '';
var iddlina = chatnick.indexOf(")") - 1;
var chatid = chatnick.substr(1,iddlina);
var chatnicknoid = chatnick.substr(iddlina+2,30);
var state;
var mod;
var verif = '';
mod = '';
var escnick = htmlspecialchars(chatnicknoid);

if ((supernames.indexOf(escnick.toLowerCase()) != -1) && (escnick.toLowerCase() != 'wrong password')) { verif = '<span class="verified"></span>'; }

var gamelang = readCookie("lang");
if (gamelang == null) { gamelang = 'en'; }

	var chatenter = readCookie("chatenter");
	if (chatenter == null) {
		state = ' style="display:none;" ';
	}
	if (chatenter == 'true') {
		state = '';
	}

	if (chatenter == 'false') {
		state = ' style="display:none;" ';
	}




var chattt = htmlspecialchars(chatBoard[len - 1].message);




if (chatBoard[len - 1].message == '***playerenter***') {
dop = dop+20;
		if (gamelang == 'ru') { chattt = ' вошёл в игру. '; }
		if (gamelang == 'fr') { chattt = ' entre dans le chat. '; }
		if (gamelang == 'en') { chattt = ' enters the game. '; }

        var mg = "<div " + state + " class='chatenter'>" + verif + "<small><strong onclick='mZeEngine.to(\""  + escnick + "\");' title='" + chatid + "'  style='color:" + chatBoard[len - 1].color + "'>" + escnick + ":</strong> " + chattt + "</small></div>";

}

if (chatBoard[len - 1].message != '***playerenter***') {

//chattt = makeItCultural(chattt);
chattt = mZeEngine.addSmiles(chattt);

dop = 0;
stringlang = chattt.substr(-3,3);
state = '';
	var checkchat = readCookie("ruschat");
	if ((checkchat == 'false') && (stringlang.substr(1,2) == 'ru') ) {
		state = ' style="display:none;" ';
	}
	var checkchat1 = readCookie("engchat");
	if ((checkchat1 == 'false') && (stringlang.substr(1,2) == 'en') ) {
		state = ' style="display:none;" ';
	}
	var checkchat2 = readCookie("frchat");
	if ((checkchat2 == 'false') && (stringlang.substr(1,2) == 'fr') ) {
		state = ' style="display:none;" ';
	}


	if (supermods.indexOf(chatnicknoid.toLowerCase()) != -1) {
		mod = "style='color:white;background-color:red;padding:0px 5px;'";
	}


  var selectedRegion = socketaddr.substr(5,socketaddr.length);
  var mg = "<div " + state + " class='" + stringlang.substr(1,2) +  "' " + mod + ">" + verif + "<strong onclick='mZeEngine.to(\""  + escnick + "\");' title='" + chatid + "' style='color:" + chatBoard[len - 1].color + "'>" + escnick + ":</strong> " + mZeEngine.addSmiles(chattt.substr(0,chattt.length-4)) + "</div>";

}







	





	$("#chatlog").append(mg);
	if (jQuery('#chatlog div').length > chathistory) { jQuery('#chatlog div').eq(0).remove(); }


var chatWindow = document.getElementById("chatlog");
dif = chatWindow.scrollHeight - chatWindow.scrollTop - dop;

var scrollchats = readCookie("scrollchat");



if (scrollchats == null) { dif = 0; }
if (scrollchats == false) { dif = 0; }


if (dif < 530) {
	$("#chatlog").scrollTop(500000);
}



        var from = len - 15;
        if (from < 0) from = 0;


    }

    /**
     * @param {DataView} reader
     * @param {number} offset
     * @return {undefined}
     */
    function qweR(reader, offset) {
        /** @type {number} */
        timestampLastDraw = +new Date;
        /** @type {number} */
        var rand = Math.random();
        /** @type {boolean} */
        qweA = false;
        var qweS = reader.getUint16(offset, true);
        offset += 2;
        /** @type {number} */
        var i = 0;
        for (; i < qweS; ++i) {
            var blob1 = blobs[reader.getUint32(offset, true)];
            var blob2 = blobs[reader.getUint32(offset + 4, true)];
            offset += 8;
            if (blob1) {
                if (blob2) {

			OnCellEaten(blob1, blob2);

                    blob2.destroy();
                    blob2.ox = blob2.x;
                    blob2.oy = blob2.y;
                    blob2.oSize = blob2.size;
                    blob2.nx = blob1.x;
                    blob2.ny = blob1.y;
                    blob2.nSize = blob2.size;
                    /** @type {number} */
                    blob2.updateTime = timestampLastDraw;
                }
            }


	if (blob1) {
		if (playerGroup[0]) {
			myx = ~~(playerGroup[0].x);
			myy = ~~(playerGroup[0].y);
		}
	}


        }



        /** @type {number} */
        i = 0;
        for (;;) {
            var id = reader.getUint32(offset, true);
            offset += 4;
            if (0 == id) {
                break;
            }
            ++i;
            var x = reader.getInt16(offset, true);
            offset += 2;
            var y = reader.getInt16(offset, true);
            offset += 2;
            var size = reader.getInt16(offset, true);
            offset += 2;
            var color = reader.getUint8(offset++);
            var flags = reader.getUint8(offset++);
            var isVirus = reader.getUint8(offset++);
            /** @type {string} */
            color = (color << 16 | flags << 8 | isVirus).toString(16);
            for (; 6 > color.length;) {
                /** @type {string} */
                color = "0" + color;
            }
            /** @type {string} */
            color = "#" + color;
            flags = reader.getUint8(offset++);
            /** @type {boolean} */
            isVirus = !!(flags & 1);
            /** @type {boolean} */
            var isAgitated = !!(flags & 16);
            if (flags & 2) {
                offset += 4;
            }
            if (flags & 4) {
                offset += 8;
            }
            if (flags & 8) {
                offset += 16;
            }
            var readChar;
            /** @type {string} */
            var name = "";
            for (;;) {
                readChar = reader.getUint16(offset, true);
                offset += 2;
                if (0 == readChar) {
                    break;
                }
                name += String.fromCharCode(readChar);
            }

            /** @type {null} */
            var blob = null;
            if (blobs.hasOwnProperty(id)) {
                blob = blobs[id];
                blob.updatePos();
                blob.ox = blob.x;
                blob.oy = blob.y;
                blob.oSize = blob.size;
                blob.color = color;
		if (playerGroup[0]) {
			if (blob.id == playerGroup[0].id) {
				//if (window.selmode == "ARENA") { blob.color = "#eb4b00"; }
				//if (window.selmode == "FATBOY-ARENA") { blob.color = "#eb4b00"; }
			}


			for (var i = 0, leng = playerGroup.length; i < leng; i++) {
    				if (i in playerGroup) {
      					if (blob.id == playerGroup[i].id) {
						if (window.selmode == "ARENA") { blob.color = "#eb4b00"; }
						if (window.selmode == "FATBOY-ARENA") { blob.color = "#eb4b00"; }
					}
    				}
			}

		}
		if (playerGroup[0]) {
			myx = ~~(playerGroup[0].x);
			myy = ~~(playerGroup[0].y);
			mycolo = playerGroup[0].color;
		}

            } else {
                blob = new Blob(id, x, y, size, color, name);
                list.push(blob);
                blobs[id] = blob;
                blob.pX = x;
                blob.pY = y;
            }
            /** @type {boolean} */
            blob.isVirus = isVirus;
            /** @type {boolean} */
            blob.isAgitated = isAgitated;
            blob.nx = x;
            blob.ny = y;
            blob.nSize = size;
            /** @type {number} */
            blob.updateCode = rand;
            /** @type {number} */
            blob.updateTime = timestampLastDraw;
            blob.flags = flags;
            if (name) {
                blob.setName(name);

	//	if (playerGroup[0]) {
		//	if (blob.id == playerGroup[0].id) {
		//		var numa = document.getElementById('nick').value;
		//		if (window.selmode == "ARENA") { blob.setName(numa); }
		//		if (window.selmode == "FATBOY-ARENA") { blob.setName(numa); }
		//	}

		//	for (var i = 0, leng = playerGroup.length; i < leng; i++) {
    			//	if (i in playerGroup) {
      			//		if (blob.id == playerGroup[i].id) {
				//		if (window.selmode == "ARENA") { blob.setName(numa); }
				//		if (window.selmode == "FATBOY-ARENA") { blob.setName(numa); }
				//	}
    			//	}
		//	}


	//	}

            }
	    var uuy = window.selmode;
            if ((blob.size == 708) && !(name) && (uuy == "BLACKHOLE") && (blob.id < 5000)) {blob.setName("Black Hole");}

//	    if (blob.isVirus) { blob.setName("Virus"); }

            if (-1 != ids.indexOf(id)) {
                if (-1 == playerGroup.indexOf(blob)) {
                    /** @type {string} */
                    document.getElementById("overlays").style.display = "none";

                    playerGroup.push(blob);
                    if (1 == playerGroup.length) {
                        offsetX = blob.x;
                        offsetY = blob.y;
			//ResetChart();
			OnGameStart(playerGroup);
			settednick = playerGroup[0].name;
			//console.log(playerGroup[0].color);
			//if (uuy == "ARENA") { playerGroup[0].color = "#eb4b00";  }
			//if (uuy == "FATBOY-ARENA") { playerGroup[0].color = "#eb4b00";  }
			//console.log(playerGroup[0].color);

                    }
                }
            }
        }
        var qweT = reader.getUint32(offset, true);
        offset += 4;
        /** @type {number} */
        i = 0;
        for (; i < qweT; i++) {
            id = reader.getUint32(offset, true);
            offset += 4;
            blob = blobs[id];
            if (null != blob) {
                blob.destroy();
            }
        }
        if (qweA) {
            if (0 == playerGroup.length) {
                showOverlays(false);
            }
        }
    }
    /**
     * @return {undefined}
     */
    function updateMousePosition() {
     if ((!isSpectating) || (isSpectating && (spectclick == true))) {
        if (isSocketOpen()) {
            /** @type {number} */
            var normalizeX = mouseX - width / 2;
            /** @type {number} */
            var normalizeY = mouseY - height / 2;
            if (!(64 > normalizeX * normalizeX + normalizeY * normalizeY)) {
                if (!(0.01 > Math.abs(aimXOld - aimX) && 0.01 > Math.abs(aimYOld - aimY))) {
                    aimXOld = aimX;
                    aimYOld = aimY;
if ((!isSpectating) && (freeze == true)) {
 aimX = myx;
 aimY = myy;
}
                    var output = createBuffer(21);
                    output.setUint8(0, 16);
                    output.setFloat64(1, Math.floor(aimX), true);
                    output.setFloat64(9, Math.floor(aimY), true);
                    output.setUint32(17, 0, true);
                    socketWrite(output);
		    spectclick == false;
//console.log("upd");
                }
            }
        }
      }
    }
    /**
     * @return {undefined}
     */
    function sendNick() {
        if (isSocketOpen() && null != nick) {
		myprevnick = nick;
            var ret = createBuffer(1 + 2 * nick.length);
            ret.setUint8(0, 0);
            /** @type {number} */
            var i = 0;
            for (; i < nick.length; ++i) {
                ret.setUint16(1 + 2 * i, nick.charCodeAt(i), true);
            }
            socketWrite(ret);
        }
    }

    function sendPass() {
        if (isSocketOpen() && null != pass) {
            var ret = createBuffer(1 + 2 * pass.length);
            ret.setUint8(0, 77);
            /** @type {number} */
            var i = 0;
            for (; i < pass.length; ++i) {
                ret.setUint16(1 + 2 * i, pass.charCodeAt(i), true);
            }
            socketWrite(ret);
        }
    }




    function sendChat(str) {
	var nni = htmlspecialchars($('#nick').val()).toLowerCase(); 
 	if (supermods.indexOf(nni) == -1) {
	if ((myla == str) && (str.substr(0,1) != '/')) {
		if (str != '***playerenter***') {


var verif = '';
mod = '';
var escnik = htmlspecialchars($('#nick').val());

if (supernames.indexOf(escnik.toLowerCase()) != -1) { verif = '<span class="verified"></span>'; }


        var mg = "<div>" + verif + "<strong style='color:" + mycolo + "' >" + $('#nick').val() + ":</strong> " + str.substr(0,str.length-4) + "</div>";
	$("#chatlog").append(mg);
	if (jQuery('#chatlog div').length > chathistory) { jQuery('#chatlog div').eq(0).remove(); }
	$("#chatlog").scrollTop(500000);

//			 $("#chat_textbox").attr("disabled","disabled").hide();
//			 setTimeout('$("#chat_textbox").show(100).removeAttr("disabled")', 3000);
			 return;
		}
	}
	}


	var ctime = readCookie("lastchat");
	if (ctime == '0') {
		var ctime = new Date().getTime();
	}
	var nowtime = new Date().getTime();
	var ago = nowtime - ctime;
        if (isSocketOpen() && (str.length < 200) && (str.length > 0) && ((ago > 5000) || (supermods.indexOf(nni) != -1)) ) {
	 myla = str;
         var msg = createBuffer(2 + 2 * str.length);
         var offset = 0;
         msg.setUint8(offset++, 99);
         msg.setUint8(offset++, 0); // flags (0 for now)
         for (var i = 0; i < str.length; ++i) {
          msg.setUint16(offset, str.charCodeAt(i), true);
          offset += 2;
         }
         socketWrite(msg);
	 createCookie('lastchat',new Date().getTime(),999);
	 if (supermods.indexOf(nni) == -1) {
		 $("#chat_textbox").attr("disabled","disabled").hide();
		 setTimeout('$("#chat_textbox").show(100).removeAttr("disabled")', 3000);
		}
        }
    }


    window.sendChat = sendChat;


    /**
     * @return {?}
     */
    function isSocketOpen() {
        return null != socket && socket.readyState == socket.OPEN;
    }
    /**
     * @param {number} id
     * @return {undefined}
     */
    function sendPacket(id) {
        if (isSocketOpen()) {
            var ret = createBuffer(1);
            ret.setUint8(0, id);
            socketWrite(ret);
        }
    }
    /**
     * @return {undefined}
     */
    function tick() {
        draw();
        win.requestAnimationFrame(tick);
    }
    /**
     * @return {undefined}
     */
    function onResize() {
        /** @type {number} */
        width = win.innerWidth;
        /** @type {number} */
        height = win.innerHeight;
        /** @type {number} */
        cv.width = canvas.width = width;
        /** @type {number} */
        cv.height = canvas.height = height;
        draw();
    }
    /**
     * @return {?}
     */
    function unitRatio() {
        return Math.max(height / 1080, width / 1920) * zoom;
    }
    /**
     * @return {undefined}
     */
    function updateRatio() {
        if (0 != playerGroup.length) {
            /** @type {number} */
            var size = 0;
            /** @type {number} */
            var i = 0;
            for (; i < playerGroup.length; i++) {
                size += playerGroup[i].size;
            }
            /** @type {number} */
            size = Math.pow(Math.min(64 / size, 1), 0.4) * unitRatio();
            /** @type {number} */
            ratio = (9 * ratio + size) / 10;
        }
    }
    /**
     * @return {undefined}
     */
    function draw() {
        var playerHeight;
        /** @type {number} */
        var timestamp = Date.now();
        ++qweB;
        /** @type {number} */
        timestampLastDraw = timestamp;
        if (0 < playerGroup.length) {
            updateRatio();
            /** @type {number} */
            var playerWidth = playerHeight = 0;
            /** @type {number} */
            var i = 0;
            for (; i < playerGroup.length; i++) {
                playerGroup[i].updatePos();
                playerHeight += playerGroup[i].x / playerGroup.length;
                playerWidth += playerGroup[i].y / playerGroup.length;
            }
            /** @type {number} */
            middleX = playerHeight;
            /** @type {number} */
            middleY = playerWidth;
            chunk = ratio;
            /** @type {number} */
            offsetX = (offsetX + playerHeight) / 2;
            /** @type {number} */
            offsetY = (offsetY + playerWidth) / 2;
        } else {
            /** @type {number} */
            offsetX = (29 * offsetX + middleX) / 30;
            /** @type {number} */
            offsetY = (29 * offsetY + middleY) / 30;
            /** @type {number} */
            ratio = (9 * ratio + chunk * unitRatio()) / 10;
        }
        update();
	if (!isSpectating) {
          updateMouseAim();
	}
        if (!isAcidMode) {
            ctx.clearRect(0, 0, width, height);
        }
        if (isAcidMode) {
            /** @type {string} */
            ctx.fillStyle = isDarkTheme ? "#111111" : "#F2FBFF";
            /** @type {number} */
            ctx.globalAlpha = 0.05;
            ctx.fillRect(0, 0, width, height);
            /** @type {number} */
            ctx.globalAlpha = 1;
        } else {
            drawGrid();
        }
        list.sort(function(a, b) {
            return a.size == b.size ? a.id - b.id : a.size - b.size;
        });
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.scale(ratio, ratio);
        ctx.translate(-offsetX, -offsetY);

            drawBorders(ctx);

        /** @type {number} */
        myMass = Math.min.apply(null, playerGroup.map(function(r) { //XXX
            return r.getMass();
        }));
        /** @type {number} */
        i = 0;
        for (; i < sprites.length; i++) {
            sprites[i].draw(ctx);
        }
        /** @type {number} */
        i = 0;
        for (; i < list.length; i++) {
            list[i].draw(ctx);
        }
        if (isTargeting) {
            /** @type {number} */

//console.log("1", targetBufferX,targetBufferY);

//            targetBufferX = (3 * targetBufferX + targetX) / 4;
            /** @type {number} */
 //           targetBufferY = (3 * targetBufferY + targetY) / 4;
            ctx.save();

//console.log("2", targetBufferX,targetBufferY);

            /** @type {string} */
            ctx.strokeStyle = "#FFAAAA";
            /** @type {number} */
            ctx.lineWidth = 10;
            /** @type {string} */
            ctx.lineCap = "round";
            /** @type {string} */
            ctx.lineJoin = "round";
            /** @type {number} */
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            /** @type {number} */
            i = 0;
            for (; i < playerGroup.length; i++) {
                ctx.moveTo(playerGroup[i].x, playerGroup[i].y);
                ctx.lineTo(targetBufferX, targetBufferY);
            }
            ctx.stroke();
            ctx.restore();
        }
        ctx.restore();
        if (img) {
            if (img.width) {
                ctx.drawImage(img, width - img.width - 10, 10);
            }
        }
        OnDraw(ctx);
        /** @type {number} */
        score = Math.max(score, getScore());
        if (0 != score) {
            if (null == button) {
                button = new SVGPlotFunction(20, "#FFFFFF");
            }
            button.setValue("x:" + myx + " y:" + myy + ". Максимум: " + ~~(score / 100) + ". Сейчас: " + ~~(getScore() / 100));

            playerWidth = button.render();
            playerHeight = playerWidth.width;
            /** @type {number} */
            ctx.globalAlpha = 0.5;
            /** @type {string} */
            ctx.fillStyle = "#2a6496";
            ctx.fillRect(10, height - 10 - 22 - 10, playerHeight + 10, 34);
            /** @type {number} */
            ctx.globalAlpha = 1;
            ctx.drawImage(playerWidth, 15, height - 10 - 20 - 5);

		if ((playerGroup) && playerGroup[0]) {
		OnUpdateMass(getScore());
		//UpdateChart(~~(getScore() / 100), GetRgba(playerGroup[0].color, 0.4));
		}

        }


        if (isSpectating) {
            if (null == button) {
                button = new SVGPlotFunction(20, "#FFFFFF");
            }
            button.setValue("*** Наблюдение:  *** x:" + ~~(middleX) + " y:" + ~~(middleY));

            playerWidth = button.render();
            playerHeight = playerWidth.width;
            /** @type {number} */
            ctx.globalAlpha = 0.5;
            /** @type {string} */
            ctx.fillStyle = "#2a6496";
            ctx.fillRect(10, height - 10 - 22 - 10, playerHeight + 10, 34);
            /** @type {number} */
            ctx.globalAlpha = 1;
            ctx.drawImage(playerWidth, 15, height - 10 - 20 - 5);
        }


        drawSplitButton();
        /** @type {number} */
        timestamp = Date.now() - timestamp;
        if (timestamp > 1E3 / 60) {
            renderDetail -= 0.01;
        } else {
            if (timestamp < 1E3 / 65) {
                renderDetail += 0.01;
            }
        }
        if (0.4 > renderDetail) {
            /** @type {number} */
            renderDetail = 0.4;
        }
        if (1 < renderDetail) {
            /** @type {number} */
            renderDetail = 1;
        }
    }
    /**
     * @return {undefined}
     */
    function drawGrid() {



        /** @type {string} */
        ctx.fillStyle = isDarkTheme ? "#111111" : "#F2FBFF";
        ctx.fillRect(0, 0, width, height);
        ctx.save();
	if (!isHideGrid) {
	        /** @type {string} */
	        ctx.strokeStyle = isDarkTheme ? "#AAAAAA" : "#000000";
	        /** @type {number} */
	        ctx.globalAlpha = 0.2;
	        ctx.scale(ratio, ratio);
	        /** @type {number} */
	        var gridOffsetX = width / ratio;
	        /** @type {number} */
 	       var gridOffsetY = height / ratio;
 	       /** @type {number} */
	       ctx.beginPath(); // фикс1
 	       var y = -0.5 + (-offsetX + gridOffsetX / 2) % 50;
 	       for (; y < gridOffsetX; y += 50) {
	            //ctx.beginPath();
        	    ctx.moveTo(y, 0);
	            ctx.lineTo(y, gridOffsetY);
        	    //ctx.stroke();
	        }
        	/** @type {number} */
	        y = -0.5 + (-offsetY + gridOffsetY / 2) % 50;
	        for (; y < gridOffsetY; y += 50) {
	            //ctx.beginPath();
	            ctx.moveTo(0, y);
	            ctx.lineTo(gridOffsetX, y);
	            //ctx.stroke();
	        }
		ctx.stroke();//фикс2
	}
        ctx.restore();


    }
    /**
     * @return {undefined}
     */
    function drawSplitButton() {
        if (isMobile && imageSplitButton.width) {
            /** @type {number} */
            var dim = width / 5;
            ctx.drawImage(imageSplitButton, 5, 5, dim, dim);
        }
    }
    /**
     * @return {?}
     */
    function getScore() {
        /** @type {number} */
        var value = 0;
        /** @type {number} */
        var i = 0;
        for (; i < playerGroup.length; i++) {
            value += playerGroup[i].nSize * playerGroup[i].nSize;
        }
        return value;
    }
    /**
     * @return {undefined}
     */
    function render() {
        /** @type {null} */
        img = null;
        if (null != angles || 0 != users.length) {
            if (null != angles || isRatings) {
                /** @type {Element} */
                img = document.createElement("canvas");
                var ctx = img.getContext("2d");
                var i = 60;
                i = null == angles ? i + 24 * users.length : i + 180;
               // var qweU = Math.min(200, 0.3 * width) / 200;

		var hty = window.selmode;
		var lbwidth = 200;
		if (hty == "BLACKHOLE") { lbwidth = 260; } 
		if (hty == "ARENA") { lbwidth = 220; } 
		if (hty == "FATBOY-ARENA") { lbwidth = 220; } 
		if (hty == "DEATHMATCH") { lbwidth = 250; } 
		var qweU = Math.min(lbwidth, 0.3 * width) / lbwidth;
		img.width = lbwidth * qweU;
                img.height = i * qweU;
                ctx.scale(qweU, qweU);
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = "#2a6496";
                ctx.fillRect(0, 0, lbwidth, i);
                ctx.globalAlpha = 1;
                ctx.fillStyle = "#FFFFFF";
                var qweV = "Top bitches";
                if (settedlang != 'en') { var qweV = "Топ чашки"; }

                if ((hty == "ARENA") || (hty == "FATBOY-ARENA") || (hty == "ZOMBIE-FFA")) {
                  var qweV = "Game status";
                  if (settedlang != 'en') { var qweV = "Статус матча"; }
                }

                if (hty == "TEAM") {
                  var qweV = "Top teams";
                  if (settedlang != 'en') { var qweV = "Топ команд"; }
                }

                if (hty == "DEATHMATCH") {
                  var qweV = "Top frags";
                  if (settedlang != 'en') { var qweV = "Топ фрагов"; }
                }

                if (hty == "BLACKHOLE") {
                  var qweV = "Black Mass Top";
                  if (settedlang != 'en') { var qweV = "Топ чёрной дыры"; }
                }


                // my fix 
                if ((hty == "ARENA") || (hty == "FATBOY-ARENA")) { 
                  if (users[0]) {
                    if ((users[0].name != "Waiting for") && (!isSpectating) && (playerGroup.length == 0)) { 
                      setSpectate(false);
                                  sendPacket(1);
                      setSpectate(true);
                      jQuery("#playBtn").css("float","left").css("width","255px");
                      jQuery("#spectateBtn").show();
                      jQuery("#specbutton").show();
                      setNick(document.getElementById('nick').value + ":::::" + document.getElementById('password').value + ":::::" + document.getElementById('color').value); 
                                  sendPacket(1);
                    }
                  }
                }

                /** @type {string} */
                ctx.font = "30px Ubuntu";
                ctx.fillText(qweV, lbwidth/2 - ctx.measureText(qweV).width / 2, 40);
                if (null == angles) {
                    /** @type {string} */
                    ctx.font = "20px Ubuntu";
                    /** @type {number} */
                    i = 0;
                    for (; i < users.length; ++i) {
                        qweV = users[i].name || "An unnamed cell";

                        if ((hty == "ARENA") || (hty == "FATBOY-ARENA")) {
                          if (settedlang != 'en') {
                           if (users[i].name == 'Waiting for') { qweV = 'Идёт набор'; }
                           if (users[i].name == 'players: ') { qweV = 'игроков:'; }
                           if (users[i].name.substr(0,10) == 'Human mini') { 
                            var spfsp = users[i].name.split(" ");
                            qweV = 'Минимум людей: ' + spfsp[2]; 
                            }
                           if (users[i].name == 'Human minimum: ok!') { qweV = 'Минимум набран!'; }
                           if (users[i].name == 'Bots will be added') { qweV = 'Боты войдут в игру'; }
                           if (users[i].name.substr(0,3) == 'in ') { 
                              var spfsp = users[i].name.split(" ");
                              qweV = 'через  ' + spfsp[1] + ' сек.';
                           }
                           if (users[i].name == 'Game in progress!') { qweV = 'Идёт матч!'; }
                           if (users[i].name == 'Players remaining') { qweV = 'Осталось игроков:'; }
                           if (users[i].name == 'Game starting in') { qweV = 'Игра начнется через'; }
                           if (users[i].name == 'Good luck!') { qweV = 'Удачи игрокам!'; }
                           if (users[i].name == 'Congratulations') { qweV = 'Поздравляем'; }
                           if (users[i].name == 'for winning!') { qweV = 'с победой!'; }
                           if (users[i].name.substr(0,8) == '(Started') { 
                              var spfsp = users[i].name.split(" ");
                              qweV = '(' + spfsp[2] + '  ботов на старте)';
                           }
                           if (users[i].name == 'Final battle!') { qweV = 'Финальная битва!'; }
                           if (users[i].name == 'vs.') { qweV = 'против'; }
                           if (users[i].name == 'Time left:') { qweV = 'Осталось времени:'; }
                           if (users[i].name == 'Next game in') { qweV = 'Рестарт через'; }
                           if (users[i].name == '10 seconds') { qweV = '10 секунд'; }
                           if (users[i].name == '9 seconds') { qweV = '9 секунд'; }
                           if (users[i].name == '8 seconds') { qweV = '8 секунд'; }
                           if (users[i].name == '7 seconds') { qweV = '7 секунд'; }
                           if (users[i].name == '6 seconds') { qweV = '6 секунд'; }
                           if (users[i].name == '5 seconds') { qweV = '5 секунд'; }
                           if (users[i].name == '4 seconds') { qweV = '4 секунды'; }
                           if (users[i].name == '3 seconds') { qweV = '3 секунды'; }
                           if (users[i].name == '2 seconds') { qweV = '2 секунды'; }
                           if (users[i].name == '1 seconds') { qweV = '1 секунду'; }
                           if (users[i].name == '0 seconds') { qweV = '0 секунд'; }
                           if (users[i].name == 'The fattest will win!') {qweV = 'Победа будет по массе';}
                          }
                        }

                        if (hty == "ZOMBIE-FFA") {
                          if (settedlang != 'en') {
                           if (i == 0) {qweV = "Осталось: " + qweV; }
                           if (users[i].name == 'WAITING FOR') { qweV = 'Идёт набор'; }
                           if (users[i].name == 'PLAYERS...') { qweV = 'игроков...'; }
                           if (users[i].name == 'HUMAN WINS') { qweV = 'Победа людей!'; }
                           if (users[i].name == 'ZOMBIE WINS') { qweV = 'Победа зомби!'; }
                           if (users[i].name == 'GAME STARTS IN:') { qweV = 'Рестарт через:'; }
                           if (users[i].name.substr(0,6) == 'HUMAN:') { 
                            var spfsp = users[i].name.split(" ");
                            qweV = 'ЛЮДЕЙ: ' + spfsp[1];
                            }
                           if (users[i].name.substr(0,7) == 'ZOMBIE:') { 
                            var spfsp = users[i].name.split(" ");
                            qweV = 'ЗОМБИ: ' + spfsp[1];
                            }
                           if (users[i].name == 'Human minimum: ok!') { qweV = 'Минимум набран!'; }
                          }
                        }

                        if (-1 != ids.indexOf(users[i].id)) {
                            if (playerGroup[0].name) {
                            }
                            ctx.fillStyle = "#FFAAAA";
                            OnLeaderboard(i + 1);
                        } else {
                            ctx.fillStyle = "#FFFFFF";
                        }

                    // my fix #2
                    if ((hty != "ARENA") && (hty != "FATBOY-ARENA") && (hty != "ZOMBIE-FFA")) { 
                              qweV = i + 1 + ". " + qweV;
                        ctx.fillText(qweV, 5, 70 + 24 * i);
                    } else {
                        ctx.fillText(qweV, lbwidth/2 - ctx.measureText(qweV).width / 2, 70 + 24 * i); }
                    }

                } else {
                    /** @type {number} */
                    var qweW = 0;
                    /** @type {number} */
                    i = 0;
                    for (; i < angles.length; ++i) {
                        /** @type {number} */
                        var qweX = qweW + angles[i] * Math.PI * 2;
                        ctx.fillStyle = qweH[i + 1];
                        ctx.beginPath();
                        ctx.moveTo(100, 140);
                        ctx.arc(100, 140, 80, qweW, qweX, false);
                        ctx.fill();
                        /** @type {number} */
                        qweW = qweX;
                    }
                }
            }
        }
    }
    /**
     * @param {Function} id
     * @param {number} x
     * @param {number} y
     * @param {number} size
     * @param {string} color
     * @param {string} name
     * @return {undefined}
     */
    function Blob(id, x, y, size, color, name) {
        /** @type {Function} */
        this.id = id;
        this.ox = this.x = x;
        this.oy = this.y = y;
        this.oSize = this.size = size;
        /** @type {string} */
        this.color = color;
        /** @type {Array} */
        this.points = [];
        /** @type {Array} */
        this.pointsAcc = [];
        this.createPoints();
        this.setName(name);
    }
    /**
     * @param {number} size
     * @param {string} color
     * @param {?} stroke
     * @param {string} strokeColor
     * @return {undefined}
     */
    function SVGPlotFunction(size, color, stroke, strokeColor) {
        if (size) {
            /** @type {number} */
            this._size = size;
        }
        if (color) {
            /** @type {string} */
            this._color = color;
        }
        /** @type {boolean} */
        this._stroke = !!stroke;
        if (strokeColor) {
            /** @type {string} */
            this._strokeColor = strokeColor;
        }
    }


    var bordersImagesCached = {};
    var bordersImages = {};


    /**
     * @param {(Object|null)} ctx
     * @return {undefined}
     */
    function drawBorders(ctx) { //XXX
        var selectedRegion = socketaddr.substr(5,socketaddr.length),
            logoimage;
        if(bordersImagesCached[selectedRegion]) {
            logoimage = bordersImagesCached[selectedRegion];
        } else {
            bordersImagesCached[selectedRegion] = logoimage = new Image;
            logoimage.src = bordersImages[selectedRegion] || "https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/PetriModsLogo.png";
        }



        var dim = width / 2;
        ctx.drawImage(logoimage, maxX/2-dim/2, maxX/2-dim/2, dim, dim);

    }
    /** @type {string} */
    var protocol = win.location.protocol;
    /** @type {boolean} */
    var isSecure = "https:" == protocol;
    if (1 == 2) {

    } else {
        var cv;
        var ctx;
        var canvas;
        var width;
        var height;
        /** @type {null} */
        var context = null;
        /** @type {null} */
        var socket = null;
        /** @type {number} */
        var offsetX = 0;
        /** @type {number} */
        var offsetY = 0;
        /** @type {Array} */
        var ids = [];
        /** @type {Array} */
        //var playerGroup = [];

        var chatBoard = [];

        var blobs = {};
        /** @type {Array} */
        var list = [];
        /** @type {Array} */
        var sprites = [];
        /** @type {Array} */
        var users = [];
        /** @type {number} */
        var mouseX = 0;
        /** @type {number} */
        var mouseY = 0;
        /** @type {number} */
        var aimX = -1;
        /** @type {number} */
        var aimY = -1;
        /** @type {number} */
        var qweB = 0;
        /** @type {number} */
        var timestampLastDraw = 0;
        /** @type {null} */
        var nick = null;
        var pass = null;
        /** @type {number} */
        var minX = 0;
        /** @type {number} */
        var minY = 0;
        /** @type {number} */
        var maxX = 1E4;
        /** @type {number} */
        var maxY = 1E4;
        /** @type {number} */
        var ratio = 1;
        /** @type {null} */
        var region = null;
        /** @type {boolean} */
        var isSkins = true;
        /** @type {boolean} */
        var isNames = true;
        /** @type {boolean} */
        var isColorsOff = false;
        /** @type {boolean} */
        var qweA = false;
        /** @type {number} */
        var score = 0;
        /** @type {boolean} */
        var isDarkTheme = true;
        /** @type {boolean} */
        var isShowMass = true; //XXX
        /** @type {number} */
        var middleX = offsetX = ~~((minX + maxX) / 2);
        /** @type {number} */
        var middleY = offsetY = ~~((minY + maxY) / 2);
        /** @type {number} */
        var chunk = 1;
        var hasOverlay = true;
        /** @type {string} */
        var gameMode = "";
        /** @type {null} */
        var angles = null;
        /** @type {boolean} */
        var initialized = false;
        /** @type {boolean} */
//        var isTargeting = false;
        /** @type {number} */
        var targetX = 0;
        /** @type {number} */
        var targetY = 0;
        /** @type {number} */
        //var targetBufferX = 0;
        /** @type {number} */
        //var targetBufferY = 0;
        /** @type {number} */
        var previousKey = 0;
        /** @type {Array} */
        var qweH = ["#333333", "#FF3333", "#33FF33", "#3333FF"];
        /** @type {boolean} */
        var isAcidMode = false;
        /** @type {number} */
        var zoom = (isSpectating ? 1 : 0.3);
        /** @type {boolean} */
        var isMobile = "ontouchstart" in win && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        /** @type {Image} */
        var imageSplitButton = new Image;
        /** @type {string} */
        imageSplitButton.src = "/engine/img/split.png";
        /** @type {Element} */
        var test_canvas = document.createElement("canvas");
        // New Elements
        /** @type {boolean} */
        var isRatings = true;
        
        
        // Stop New Elements
        if ("undefined" == typeof console || ("undefined" == typeof DataView || ("undefined" == typeof WebSocket || (null == test_canvas || (null == test_canvas.getContext || null == win.localStorage))))) {
            alert("You browser does not support this game, we recommend you to use Firefox to play this");
        } else {
            /** @type {null} */
            var regions = null;
            /**
             * @param {Function} input
             * @return {undefined}
             */
            win.setNick = function(input) {
                if (isSpectating) { //XXX
                    spectate();
                } else {
                    hide();
                    /** @type {Function} */
                    nick = input;
                }
                sendNick();
                /** @type {number} */
                score = 0;
//console.log(input);
            };
            win.setPass = function(input) {
                if (isSpectating) { //XXX
                    spectate();
                } else {
                    hide();
                    /** @type {Function} */
                    pass = input;
                }
                sendPass();
                /** @type {number} */
                score = 0;
//console.log(input);
            };
            /**
             * @param {boolean} input
             * @return {undefined}
             */
            win.setSkins = function(input) {
                /** @type {boolean} */
                isSkins = input;
            };
            /**
             * @param {string} input
             * @return {undefined}
             */
            win.setNames = function(input) {
                /** @type {string} */
                isNames = input;
            };
            /**
             * @param {string} input
             * @return {undefined}
             */
            win.setRatings = function(input) {
                /** @type {string} */
                isRatings = input;
            };
            /**
             * @param {boolean} input
             * @return {undefined}
             */
                win.setDarkTheme = function(input) {
                /** @type {boolean} */
                isDarkTheme = input;
                if (input == true) { $("#chatlog").removeClass("whitechat").addClass("blackchat"); }
                if (input == false) { $("#chatlog").removeClass("blackchat").addClass("whitechat"); }
            };
            /**
             * @param {boolean} input
             * @return {undefined}
             */
            win.setColorsOff = function(input) {
                /** @type {boolean} */
                isColorsOff = input;
            };
            /**
             * @param {boolean} input
             * @return {undefined}
             */
            win.setShowMass = function(input) {
                /** @type {boolean} */
                isShowMass = input;
            };
            /**
             * @return {undefined}
             */
            win.spectate = function() {
                /** @type {null} */
                nick = null;
                sendPacket(1);
                hide();
            };
            /**
             * @param {string} input
             * @return {undefined}
             */
            win.setGameMode = function(input) {
                if (input != gameMode) {
                    /** @type {string} */
                    gameMode = input;
                    connect();
                }
            };
            /**
             * @param {boolean} input
             * @return {undefined}
             */
            win.setAcid = function(input) {
                /** @type {boolean} */
                isAcidMode = input;
            };
            if (null != win.localStorage) {
                if (null == win.localStorage.AB8) {
                    /** @type {number} */
                    win.localStorage.AB8 = 0 + ~~(100 * Math.random());
                }
                /** @type {number} */
                previousKey = +win.localStorage.AB8;
                /** @type {number} */
                win.ABGroup = previousKey;
            }
            /** @type {function (string): undefined} */
            win.connect = open;
            /** @type {number} */
            var backoff = 500;
            /** @type {number} */
            var aimXOld = -1;
            /** @type {number} */
            var aimYOld = -1;
            /** @type {null} */
            var img = null;
            /** @type {number} */
            var renderDetail = 1;
            /** @type {null} */
            var button = null;
            var images = {};
            /** @type {Array.<string>} */

            var skins = "12345678908c94135e847aa7a4f09f068017412acd;123456789032dd9089eb37b629ef741aec5b6b6ce1;123456789050f0344f16c57b5523130c285f07cc45;1234567890738415db40d2a40b9bb433a7bc49d53e;1234567890e400472ecb00b285b9ab457a58f268ef;123456789085e5cdcff8a9ce7347503e884755458b;123456789081647c607bfe4428aaccefc714a2019c;12345678903eb5fb2db1e1b7a0b4bc56cc9d32d29d;1234567890874e8fbfa79fda9d36a59059886477ba;12345678903490555c703ab23bfe9b3f503cb0a34b;123456789049bad36af7418193c535b68f5bee666d;1234567890f47f8eae70e45791efc8c4be55fad8a2;1234567890aac783d3b158b02a85d2eee814073afd;1234567890990e048d0d41549394f5ea7293187ffa;12345678908acea13446b8f1aebf7449ba7593e714;12345678903ce4ed88e83871f4c4bc064042c9c08a;12345678904c68cd3d01a8f9f6bdfa722e9c70cbf4;12345678908a74a57bda2918682a3a780af38d7a91;12345678900fc9c6b4d2c5912f9ff4e94931d6da2d;12345678905a7853b7aa2e33f4b0a85ccd80967637;1234567890d1fb776b8324239a267e6556229b7408;12345678905ddbffa27aa546af97a35fed7e26c5ea;1234567890962fbd7cfbead8be526775bae5118946;1234567890d9f8c6d67d5cf6013271d53ec31c18f6;1234567890108c0a20e5be38b17238555120ad11bd;1234567890d9bb29390792bef44a11f473ab44ed81;123456789030b5b0ea4644961e0370c64901ee6d96;123456789004ba081dd31058fc1a526d0f220887fa;1234567890d7dd2f572e2c01cc8adb10d2b71eb47b;1234567890770d782441f2892074419cb8d5952df7;1234567890cec4f951ec0aeeffa43d70bd92593ce2;1234567890c12d0796e888d69c1348fc5c5b786f26;123456789081604e5fa46b9d3cc441286963b1d32a;1234567890c9d05d47ae8c5a31abd7d3e9c6b5ac45;1234567890b8ce8f43ac0861d54c85b0af8c0baa34;12345678903be2b625e68e12f977d7ab23425e2756;1234567890e652f6abb0148fc5c3bfa4896fc23a8d;1234567890bbddebcbfb2f93aa724506fd36e2a1c1;12345678901782a84773b99ce9ad1d6a34025a4a76;1234567890703f9ff0da876c2d4afe4f6966e6c060;1234567890a66200d3d4cf55a903851ac180b685dc;1234567890048788a98a720d08065ed0db190319e5;12345678901ba2c43eab6ce551dcb3aabf51fce7ab;1234567890ae82e733022bebcc780922ca787d08b5;1234567890df3b279aeae365975cc8be1a13bd6ac3;1234567890e4ab3c8d0682a1419ebe74e5e8e3db3d;123456789010b1e981ccf23967afb5f3a273e70b43;12345678903e8fe1551d01ebfc17a4140136b32d2c;1234567890d0894d5eacfd4d2e3c4c17263026678a;1234567890957c99a1372f71961b22a697d58009ae;1234567890206591262e1389c2b6a5405475dc06f8;1234567890fb436029a35a5e30327b95e43ebf5213;1234567890c42c3fa240cc1357d4520991a0d2ff34;12345678908dad1a392e947548ddc7bf600d616295;12345678908d1870ee6d202ae12f4c04ac8c4244e8;1234567890d908a8808173e4eb3df32a7c1ee098d2;1234567890a9c818dc3124b9e8c74b9323b74e617b;12345678907a70b28f65ff4299d9f14b819485ce1b;123456789020f15952f3ced8626520504e751ffb25;12345678902ddc3a31ab6ba8b772bd7aae85200162;12345678905d3d0631b68ccb2e5b042708589689eb;1234567890e55c5617cc04c86d07bd93f212c2f475;123456789035f9cd750d74cafb9ef02c3cf5674e4f;1234567890bedc4692399809f47b2f6e6d82914962;1234567890ec5312f23ae094d2593ae0c9a96b2b32;123456789013a339e4d9cfb76a7d71f8b831ff2fb4;1234567890a6f61d9e6bf2cc8d449462f05129e94c;12345678903aa2559f59af0c9b609e26f30c4df98a;123456789017427739d1330a7d8de633841a94b7e5;1234567890004f1c9362f0e6e15a14476356c2e344;1234567890706d36ef90a44e7a9766ea8416b06410;1234567890c88c431c9c4a706b448ee70a4a004a39;12345678900acf52500aeb63532d0d915773b7c85e;1234567890b2b8cf3ba04ffcc42275aaa60ad7d0ca;1234567890bcb21480cd24466445a0f5092f8c3289;1234567890457fad8511ad6a458f3c511dda7160aa;12345678907c092d6f61fb8eb8d380f938adc4d39d;1234567890d719a94be8d79adf69ec57064f00d1ac;1234567890b04ba0e30d144030c101a47a582d9e3c;123456789079fe1b7ac6cb6753bdf90d7449ba0551;12345678902e481161810ac356a9b0756399622cab;123456789026d411d8f249f49d683f25e5ef0a1f5f;1234567890da5d46117ebbd593ab1504a187fc4a30;1234567890a6d5ecc59317bff5ea637bc47138a4b8;1234567890c75001fe3179b88714bbdc0ed6cd83e2;12345678902f29cb31c7a33bc4c97ac16876bc9761;12345678901211802eb6af6492a894fdfcce8e9450;123456789014a85cac7b343a9c1db06d0ca550bcb3;1234567890da699606200db03dab704a6bf373c83e;1234567890e26a2cc37388c170262c18cee2858d6f;12345678907a346a1b8ee5b25b231c3f35731c63ca;12345678902b73495ff27647628d12744dca90badd;1234567890a0a3574448e9e297b8a868172079107f;1234567890eea40847e01f7b3029cfcad04d53d714;123456789035d679d4ba3893d9c4a3e4408e69b884;123456789041437debf3bb2eafd0bb70e0bcde1956;123456789071f981550d1e10ad90f5afe7510a92cb;1234567890b897d4ca528a44c2bdc1e24aa4d57d1e;123456789042b51c5bf6863056494c885efe123069;1234567890c8171d2854335432d823b15dafb691d7;12345678909a77e27e1e6675f68f11809f309b1a31;1234567890411d7fdad536181923e9a61ee5758c9e;12345678908de5b875086dc9ed21bc497f8751b68a;1234567890452328f6c6d19986db628e75d7ab80b9;12345678909262da4d44f7a4d6f45bf9c82b514d7e;1234567890918ac7b67fabad1173cb7ec8c2655c38;12345678901ae09d89da827699589906400edf34ce;12345678904969424b49a622ac288cb4d0836ca136;12345678908db6f338297c2cc794bbfa5a93fe89f4;12345678904f8180244397c7c87ceee0a2f11c46a5;1234567890a3b58bf1e59607cf934fcb580be0ae4e;1234567890c3aa638d1fcd40fb70a8611ec6a38e78;12345678903dd83ea35fad7264f06cb64ad49c9451;1234567890379f7ce4f9920cd355c48569cc63e893;12345678901cf7e5544a42b60ab37c0fad1c000c1d;12345678909bdef97002a8f9375628a358e0691d8c;1234567890d2ca2869c2011a4b7371056bb9271b8a;12345678906e6e71c1b119f3da3f0e5d143325b977;1234567890074fdaca9db1993bcea91073f0dc780f;123456789069d8346ea84a5cbbfa78eba7fe368e41;12345678905f56aa99e5f3600373c6094b4ca966aa;1234567890d027ba2ad9f0189d9cf3cc1e53c8547d;12345678901b7d915993232660aa07f2a04aaf661d;1234567890c197135addd8abcfddc05f2b4c9ffbd6;123456789090872b7166d20c6906c5f951884d555f;12345678902e6bcdac53b275e1d80ab5db60da65ce;1234567890583a948fe04329c707834f1150daf1ea;12345678905b4bd63cc7148b8b2c8b9b24fc633035;12345678905ea0341491da47e2ebf9af6d3ac872c0;123456789038dbc6fe7094ab7872b8da3ebdef6fdf;1234567890ccfdc6fda16141755f2938b2fe4c775e;123456789069ffffeab0740381cccc46ece6a6dff6;1234567890b3893c4b8029e77e8a47f147e5d80d1f;1234567890da2a4e3d25ef0ca8d33ff2b72dceb3c3;1234567890c40fba33b5e33481228ee0859d95547f;123456789012ef82c81f3f3cc668f6fd074e237023;123456789059a429e8232f87a5cf2e530588789ce0;12345678904d30d4a9b953f863c89849e6d1dc49a4;1234567890e2039754171b63062806934f6383e046;12345678900c6237d5169fb69706c4618d36edb20a;12345678907e67bbec080beca4bb276802cb880a0d;12345678903bf4dd015d037578b7a1e89ac4a4d964;123456789090fd4131e36ee63456539f289ed300e5;12345678904e3a48ee95b80db4c5e86e3289bca402;1234567890f222066c7287c0dcff8fe0f09daa7376;1234567890ac84547466e9ffe8444c92be65cc4ece;1234567890083924483e9a5ac8c772003ee86b16e8;12345678908b396c23f633604637cc60477713533c;12345678903e2737331bff2bf8fbd740583be6b4bd;1234567890a27da94b8d10b1719ae3eebb1ee0361d;12345678900441289e184ee5cba2ba7e3825d53665;123456789017d603f83361b0180809a30608c4f906;1234567890c05d27c3cf4c306b5c8f173182a00f6f;1234567890fdd33c98c146c33389d018e034ade994;1234567890dbe19c0d76129d13bf6c316a471f62e9;12345678902d1613b2819fc31a9ba80281b169264e;1234567890c2a2f49d145c0ee619597b73f27c222e;1234567890cecc8c4e5b3fedd75363733e48737524;12345678905be2bf1003470272cf0a60361cbc714f;1234567890424f3c89ae451f88a0c3ea31b726657d;12345678902de00c399a652ed8915553e1b1f2a724;12345678902a950a1ebc9a4f159f975c26e230c949;1234567890a4f70164c638b89cf22b6a4d7cdf942e;1234567890cdce03aef8605cd0733c76bcbd814dfe;1234567890b3947ac1c2e848183bcbd1dd19d3e798;12345678904b34913f519b767c67155a74e272b034;1234567890d2e2802244836b91711453b7aa7dae2e;123456789091d579dbb2f3e4fdaf0bc31eadd78127;123456789041a01ca4d3982b19affab38fe25c7a81;12345678900a4fb02c48ebc29fed8484c298f73a29;12345678906f3a6b2ee321548892ffcc95bc8f456d;1234567890608ed829bd6688ea7d72b11ffdea63b9;1234567890ef31a1d7d13421b1561abe40441b4905;12345678906d80176aa69a4a34023a8e43028e5f8a;123456789082087114ec12a69c3eb1d0eed69e7711;12345678909a1a4047c50c6ea52c34f81c571466e9;1234567890dca8077b63ba99d0443957d2aaf663d7;12345678904815772a912eec055926491bfb313c8c;1234567890d79833f3910975fb7260818caf47adef;12345678906aaa639da4e34a75c882ac28c20bfb23;123456789055cad28475f66c4892a1b49b1eab0432;12345678909b71b9f10bb1b4549c64b39f2e4c77c6;123456789047a384bbe55b505435a4dd703f152595;1234567890ee38e510bae260b0cf37e80dcd007f14;12345678902c776d797b98b0f4aaa981089488895a;1234567890ff95bb297fb8333ec10ecf633c7dd585;1234567890f41ad4279576d66e1ccd9afeabb1dcba;1234567890860ea390a052bb57256e1265dc7582d8;1234567890c65e81f87463b21a1ffb9c0fe186b01b;1234567890322bb124d3749b2435ae89b0307c126b;123456789039b6399656a10a7621463ff2a9857c84;1234567890bb80b85c012daa286326f5103b4f2533;123456789089f25d2b064e76951e25d450f54ceb7b;123456789090ae68a86dbe6c1de6bce103c3fae62a;1234567890d129c7878751198c212928c526fab250;1234567890ec1b4c6d3e4309a2fad46a0f20ed85a2;12345678901d766437c6b8fbed0bb2fc86165ac7db;1234567890eda3e9c1e7691e121f8472a7f2596ab9;1234567890edf4bb36c314b07d024a5f35873d9aaa;1234567890ca85c087b31de7d862bba1560225c0d4;1234567890914d848655b0964bf6a2d2061fad7749;123456789083b72a8a61a19e4be8a45b97fb77c682;1234567890fca146d3e0ec8b2856c86b71de0944e1;1234567890729f3b3294498ebc027e4339ebc044ea;12345678900d2607e200384850596c47fb8463a059;1234567890fc7612b966e29c9aaf09fed37dc7b337;1234567890798284d36d5d02a9ab08d40da2ad107f;123456789061ca8423c7d8fbe07302b59ed20eb165;1234567890bc5290930e8814eab21288c39d2695df;12345678905eb75d5656b3a324d1562811eb50d7e1;1234567890bac5161f499f212f9c55aaae9c3a40f6;12345678901e9b280c3e366376cd92ca2634f5bb25;1234567890c8dbcc1b95bc18a8c80aeef4c563e5f0;12345678901b629296234f519d4af9fe8eec02d23f;12345678903769448db8ca670621e74a9d8be6b1b5;1234567890b312df88a249f1acb957b59012b003cd;12345678908cccaccab7b4a3b2ca7f4127b3dc3e59;1234567890f2d4af5a38d2d42391a92c2e417ce656;1234567890f443985dc9e62c71dde29a1fca314242;1234567890ff0f1955c75591eac68c40eff805739c;123456789026bb5fc49361e40fa7b85756acc22787;123456789015a1f6e7ce82a8a695423b82c0d29aab;12345678903a6e2c9943649e50eb2e46027b5dd8d6;1234567890f0ddbf4498316ade318e4bf2eeeed426;1234567890789a69fae4402fb3317ff81c7a0e20fb;1234567890e84ffc9d70dd98d1839d54fc4edeedca;123456789027f5be2ceb63e6916e8038b5c1f7a7ab;1234567890c06b39462ecbbffcbbda52b0bc3a5eb8;12345678908cd3539cfbf586a5fd2bc9c7bbe755f5;1234567890996d13b58dbe68a19ffa7004c06bb81f;1234567890c02f952b14d552127054fe8fcfcc3195;1234567890c45bcb0b0b6bd8cb6abaafc435b7db27;123456789056bae22cbec16e9cbb5cb2528fe5144e;1234567890246a621a7f39c23612e5d079ab843ea0;123456789023c67de00aa4f8ad0ac468967766c146;1234567890a7baad167e015225d385e74c481eb0c8;12345678900694e0f09e4521d219e724244e7cca2a;1234567890a47243d34a2a8bf9ec9e844cee980256;12345678905c7ff4a7fb6af92770a8ebc9942e4977;123456789076bda655ce3e5a6f164a6964a9949d08;1234567890ea05ebce45ab9380c6b540dc8b5eebb6;12345678904f9798ee459570fd99c82cc1d8056987;12345678900de3eba7b040ec0943c2b91af85ff5d2;123456789017d33affd635a62b1ef3cfcfca23d1f4;12345678903dbb243fea4ba8152dbd18f514a881a3;123456789000f30cdf81bb0fc39b3df4e4f03c7f0b;12345678900d78736d656decba42c63a9d72c28897;123456789044ac9079ff45e0be9f3ed6602de05e7a;12345678902f426a6dbbc51795fa4ddde2ee72d36f;12345678904c2762c5a4a600c3d9834d2f2e3282a2;1234567890d08be56eb18fc041aeb57b1bdd8d57aa;1234567890f193089a8601578558476f1761b3225c;1234567890f30eb70d2d6b2d5a0a9d11f1cbcb40c2;123456789055ccd7c17c35e44ab95c51b32c3a66e1;1234567890f2a0884f39a1be3ae671fc4c916c3b0e;1234567890026c55ade179ee44e3bacaff9ef765c0;12345678900d0ddb5622ac23f7c8fb5d1d515c22bd;1234567890264488d0bd0996abd82bd825cef5d9d4;12345678906498c7ffd08590eaf8104c1d1b9fd45e;1234567890c8c916349b1c3da51af798b73b53501a;123456789078f646e6aa04b27bb42c6ddf79feeda6;1234567890f3135c5ae4361acd530199730cfc3e43;12345678905e1ee69f8b221737f0457f432a6c7289;123456789054a8578c0a5a5b5bdd534b737ac10b9a;123456789088acb4b66a2d70aa7113994892443b8f;1234567890179657b94148b4b736b448501b26b26f;12345678901151e489e817e51faa7a188f9322506c;1234567890b1aa4e34ab6ea9f3aeb78852f2cf1371;123456789048cba85bfc38f42f83d0d528006c387c;1234567890b3440f36fbf30e8076d18ffa22dfd014;1234567890960eff8959455df45812e917f0249f93;12345678909f7bf21db49aff2dff614ab767642333;123456789064b1a1d8ab6181d07aebb16644358bf0;12345678902ef8c4474dfb0ca9bbbfdc2571f9d1df;1234567890dfc97f280c8403b4a2a841f486195d3e;12345678902a2688e37159b3eb34eb2c27080f8512;12345678908ff1d33fe78a6353a92536492301982e;12345678904e184b36e079980698e167c8b5741700;1234567890e695bc3f38e2a06ad2443b8ed77255db;1234567890cd3b568b317607033ee1e2cf7ba540b7;1234567890ebf441e6fef9650ea301874141af26e0;1234567890e0a9cd1b6e9586cf631662c11eb9ec0b;12345678909ca3c1b20a601059c1c5994479fd5da8;12345678909ae96cd0f3eaf8ac9c272d6c2dbb79eb;12345678909a6a097d8e67a2df1cb399b2859be2ea;1234567890145cfbd0800d95c601b88dbd242bcca7;1234567890f807fe64cb8111f15d75dd9ea00c1a94;1234567890aa5b16092bb39a90907984a718743082;1234567890259c842943ab0988ed0e04ebd78a9391;1234567890bd8b605fe1092e4ffd80c6a74237772d;12345678901bcb8dac6e02269bdb2e7215c79bfbba;1234567890bb6dd5443b6c1082191071266a28ca33;12345678900b98e3236dc0b181c53a8bf09bb4a101;12345678909e42930d0be1ea877ba7db5f6d4e4321;12345678905a71734c60d5ecfab8b351f6f0a9b4c9;1234567890ce890d7306377fd39bd1ec034a45b796;123456789061b054f19f1422e95b107ed9d65f7c41;12345678902cf64700b492ab98ffff88bf32c28f24;12345678905eb74bd24d15595616e2661786ab3abb;1234567890d838ea9a1510ab37fc35e3dfa9801583;1234567890aa751456a62e2c7ad6ceac91f54ead64;1234567890c39789d76cb90c039ed32324d7cd4346;12345678902d6c76e3762ce74ed34b333af54ea794;1234567890607750b69ff460a63181a43c83e2a726;1234567890449c6edfde013c262327f82825233b57;1234567890137fda8298dd158e235efba756c2ee95;12345678905b239aeee6488754d290ee00e1809d86;12345678909f346a165c1eda8bceeb91ab29e1a17f;12345678905ea290354b85af6c2578b35c73fff900;1234567890f96eb73311208f18f2b558dc792a8209;123456789043cb422cfd35222d01d43b2a23292a21;12345678908cea493b9105aedfc915e7bae8df906d;1234567890f01f54bf3d020c2b6420a2dd7a794ba7;1234567890e9f561c7a11fad9b3e920ecf63ae5e90;12345678909d28cc8a7542e5b2e8ccd71b7dc65345;12345678904f40386d6df1a77d240631423540bc40;12345678902d2c867d3d6c6b03f03f1ef993b5b63e;123456789074679e8dcd9e7feae077a7234033985d;12345678907b70c93aae0ec7b0402a155bbb1a3c69;1234567890c1dbed12481a24a3f40e98ac9227b8fd;1234567890075560f3b9f57e4ea25600fe4d9f26da;12345678901a2df8ebc6227f36b157a96262a1cf94;1234567890467d2a582cdccafc0357b5e8e7bc4d4b;12345678907b2971fcad2fdf8fc98592c01dd4fbc8;1234567890dfd1ba136559aa7cdce98714339e73fa;1234567890afb6cc355533cf52d396e75573d29152;1234567890b70b6f0f44c006d08e4fd91d73661fd0;1234567890a08b2313944aec3cacab22021e6f9236;1234567890b071d006d8384a15749491c5d905e200;1234567890ced9527ecfc378a7c1e4abbbc5e62cc0;1234567890b9bcd05150de61268628ac3ebaade0ee;12345678903b8cd3831b68f4ba98470a0b7364a6fb;12345678903cec8ef7346de10e01fd71509c1a3657;12345678904d5438f620052398524dbf280894138f;1234567890aa4129ce8d774ed3d1fe2208a75e07e7;1234567890322f9f0f2bc58e08ca472bcccc537134;12345678905dd77f53a6cbe8e082d1ccf3790d84b5;1234567890049c8c4ac1e4977ff4f6f7da7e6bc1bc;1234567890a240108d1ada8fd1ce503426a2695347;1234567890ba20f0281f9571e5db66f5417f32857a;1234567890dd34b5f843c5721d32f97bfb52c8916e;123456789031e884b39192c38d02eab3815ff942d7;1234567890bed26def4c42d0194074154d3c257f4f;123456789075cbe440e99365b6066817c18c6f08eb;1234567890a076bba5c5f9fec5f387f0159af17aa2;123456789017076cd9f01bfef5fd129340a9149ca4;12345678909d9d8cab6251e1bf3e93305605d9c2b6;1234567890d49219e535cac575122348fe424cb9e6;123456789027a962e4225d0661e706d2bc1c13d4db;1234567890f719084e4f008c2ab217d5e3371761bb;12345678900cb639f2f17ab041a4f42e0424b0099e;12345678900a3ece20c79b8780fb6ab0aa6da0760f;1234567890111abfc8f5dab4ddd86cb7e10209ec3c;1234567890e6d7e02eaa88fc70f45aa794bbb200e3;12345678907802484ff22a4b3c2137cf406f4fbf74;1234567890fa0e4c7d378f113aa20d12b3bfaa6198;1234567890e2b07ae7f8adb9181bf8e37a2ed25093;1234567890f2c1d85c22e98836827c5d01a442250a;1234567890b59774430ead6bacc3e06b17ea878c9d;1234567890be1a186067369e155d6c9281868f01ef;1234567890f7f82f4e5c3a9c2a74779703dabce5d1;12345678905dc7b1cee6719ba08baed29826a1f7d7;12345678902ffe598029f76d2e231011a1b186ffac;12345678903eb54758df33229d64cdb46f9f3c3452;123456789084db362f07bbfad91b362d867fbd4883;1234567890a613aa36f46abf2686ba99149726dfc7;12345678906fec5a9c3a0d9b026207b2437d8c60fc;123456789098e14c7d1e5ab1746c29ce1dbc0c7190;12345678901248ecaa0659945796ee4f7a8fece80c;12345678902f4406b3b704411f2b30062d00f080e5;1234567890108436edc2b92b2708cfeb245f8398fc;1234567890a8f004375b518397b90c8d8a2b61a2ce;1234567890e500cb06bf1db4692c527ff50dab6200;1234567890e213229821b71e45032bfc552847022e;12345678907aa605e64ed15f4a8036d078696003b0;12345678906331ddb5d05a66cfd469f8bdeb75a118;12345678906331ddb5d05a66cfd469f8bdeb75a118;123456789049883b68d406fe425b84c32bfa36daf3;12345678908de2052bfa6c4520d13c55d219c594dd;1234567890ac1cdaf4c5ceefe536980f9478e260d8;12345678903fd4eaf9cd1c22a57b6c870e5de0d01d;12345678900b9f482ba0cf9ae7e2789edfce8ff74a;1234567890a9b059c02bca93f8e775bc676bcab1bc;1234567890b240f40985c12d4f7ea8cbcd5a7ad6b8;1234567890b8e927a17fed9fbbc357b684426f18bc;1234567890eca46aae6c19bd5ed6145671e0185243;123456789029209ca0609aa4a4f579fb328e17367e;12345678909f70b9002fc80c698167bc67f24d6e5a;1234567890ef42fbe6f0e8ac3e11aeb4705607e151;1234567890b0b86c3e76545012e068e4dfb3e935cc;1234567890b0b86c3e76545012e068e4dfb3e935cc;1234567890702f5d06db033ba06ba3559101ef2387;1234567890cb54209b33a1f897da4e602154a148e9;123456789080dea63e911a146fc7ed25fb4e27f414;12345678905b0dc4d79e03d7ec634c57ba5207b9e5;1234567890b1227821ff3177d63853f170f9fbb6fa;1234567890ba5393e1e5f66e57e754bff6513aed41;1234567890336b27d3894934be262984026cd89d92;123456789088cf8ae22acfeeb573816e0486a658a4;1234567890f5885fd3a21f1e6d18a3b240d10d2ca2;1234567890dc6b4464d39ee7c2d32c01cf5119a347;123456789044b2473c6bc0f6159065062d12509e18;12345678901bb154c760b1ab615422fe7fd16f51de;1234567890bd56cdf1883f4efad62978858ec2f96f;1234567890e44e0793b58838cecc47eed4b7677569;12345678907e85eabe43af6ebeeabb418181cf96a1;123456789075d0e759dd04a09c6a60423c4f88c5d6;1234567890a12b887b0ed31efb595879c9430b1477;12345678909aef9cbd674a7ee6642c0fed50475338;1234567890855d78208855817501d9772f96fd6fa0;1234567890be4ac62e24179add4bf689f9e20de125;1234567890be4ac62e24179add4bf689f9e20de125;123456789090b518cd9342d9d0e6e45965ab872f53;1234567890a6ea0be3c6a11f024b9438d66b2adc4e;123456789017790a52f53de8a924c5ed5903ba1812;1234567890b0ace2394b52af0136ce0b4b54f7c740;123456789004f0876a55a3be6ecb917923707a21d4;123456789059f96f3b0ea7adbb3f8b5cf8b76d7a68;123456789079fade93436fb889d40b097fe7ebea25;1234567890e1510cd9518daf94b5b05c85e9c27b80;1234567890466f33fe40279d18feb1a76a8d0f8380;123456789056429edc07705204f0f47ce27672143f;12345678905a05b9d0894b9f86863ca13d917770ab;12345678905d5627479ff6d6c4f7aaf19036115b07;12345678900f3cef6e5b07db3f7159a6cd9d7508ca;1234567890bef49f047257238d2a2114265b8ed0f3;1234567890fac6f14e8537616c77c7ecb57411b80b;12345678902dacffb1b1fb4da67050415329551574;123456789013a37c5027bcae84d6f63451b4309d95;123456789025512453fc039db2e1f421e4b8ae10b3;1234567890365c58ccc00878f1cfe7a768829ea5a0;1234567890290d3120324612301016947419556901;12345678903452145340d7a7203d9814a12d0cd4c5;1234567890e1e49fce04806e3b7e01810f8eedac37;1234567890ae861c8628cf9b5b5a07268b52ca94f6;123456789073ff282f0b9d070a1646092ae67e54da;12345678907178f330bab312a724c2d6e1c807cbb6;1234567890c4fc4158fa2c63b2b67d280b838eb752;1234567890aab9f4867ebeb1681994dbfc09a2e385;1234567890ba432fcec8ae606e527e338a57b773cd;1234567890b9a26864be3df25bed34e9268863b4d7;1234567890efa9f38f065c027176ffd4cbdb8ee02b;1234567890e7bf23eac9ad7d4faa7e98e8a421330d;12345678909eb72ede3d0f55d2b4d9dc5c914133e7;1234567890f60c8daf781db3c2f7c614750072f1db;1234567890d0bd7bfd94655c8cd81357fbe7d53e62;1234567890d447ef4a9431343f3f7d0ee4525ff799;12345678905067d10647af1a0ebc1ea8af99cdd61b;1234567890cd4812e77e509b8c3a917989443cd243;1234567890b88f48c8e978cc9619c938cfc03cf65c;1234567890f09ee9935f17c1eb5e57ceff3af952cc;1234567890118728ba1049781e5b3d09782274b4ff;1234567890cdbe5edca431a02bd023b0c83be26651;12345678903593ecab777fe8146bc655bd4a4d5662;1234567890063411ee43a84b74dc49c9b52d157745;12345678902fb3245b7aa3373b60e2146f72a5849c;12345678903e9a33774dbc1b6756541b0f3254f7b7;1234567890facc892889c97c463fac7613cb5e2987;12345678905dca40bc27caf0c087af0b660f781a17;12345678900289bb519d285e797828306a074bea2f;123456789079b5af615f824038e18ebfbea003b776;1234567890afc1e7fb738d87a71aa65090bf98b465;12345678906b7fb6d3e662282615914995378ad2f6;1234567890f11c577eb541a36efd88e2e12a49fa75;12345678904a6eef4f65e6e5b2bcc6a7eab064016a;12345678902781fc0d0001550a9510d13077c4a7d6;123456789029b9a2c0f3a03ba53331b54e6011bd89;123456789013180c3114a6dd46e1ee0d5cbf740081;1234567890e6fb7123149c381a46cc8ce33242a320;1234567890b46289288707ede96b7731cb5ce0189d;123456789062446d5e6ffd13e8ff1ada51866c37d6;123456789071e19bfd1f2297f1e2632422410f3eb0;1234567890d3e24c7d2ef4fd2576bb0f2cc8f91548;12345678906e263656472556f2fd60fdd6cac1bc6e;1234567890ddb0715c84601a8399338fc406ecf537;1234567890a950d64e462506b3f5e84a3400623a9e;123456789015df0a6ce799aa31ce13d8726846ac2b;1234567890881af29cacc7411019675fbbda21db68;123456789009aa83020b8e0f9f6e7c3d4786aef007;1234567890d5c6d54c8846e307dd45809ac9f73e82;1234567890a2998360643bd4b9f2ff546cfe8b26eb;1234567890e7e38b973f56314c9ccb0fbb52709af4;1234567890b5c49f7b50cfb3fe0b03a219f7f1b2ac;12345678903bacb8c2408208b2fc1ec18c1e3d0ba1;1234567890ac449d3a3a2131f7903ef706a5243459;123456789044cbccc90088ecf41ad8ecce659df49a;12345678908d78c7db48addca1abe699207aff2052;12345678900ecfd5a9bd84c9dad63c5af195e2d996;1234567890f4c8034ba8fe12f8f90caf11d917d523;12345678902af30b08e14137ed1f2b065e8acb69a7;12345678901ca76da7863dee3f23835aba99b7f8d9;1234567890b5450f1dcbe40205e9b793d68ec9b69a;12345678908913b04acb8d674aea14192e75668c3c;12345678902265b910ec061db906a628d2b0b0094d;12345678909006af01789de7f114e0ec894ad9f83c;1234567890add5fe2b488e0815419a31841f1340a1;12345678907806993d5118dcf69a4bc8b9631e021e;12345678909f245ed0c16eff5812cc3522d82c641a;12345678904f33c362c0ad8cec29981651139c8892;1234567890b65efb6ea24e6e7c897e168f8b41c89a;123456789042e59dce06c35446aa7603528a37ea0c;12345678901dc39ee5dc7276fc6996be7643ee1937;12345678905a795c0e01852008d0adceecb813311d;1234567890ef2f20984a77844226589b99e13ad876;12345678901ea5c1f9c57a4e173631900cbc1780cb;1234567890c90a09bf3cbcf3814c49da0d91a3a3d9;1234567890a70181d9c84b212afe731342a866d296;123456789085f2537c7716cac09dfa482a77ac8cb3;123456789000a5ad53b5e0a0e4a764eeb1e552f2fc;12345678909d2bcc14dd45e0be990adfc429503fc9;123456789059861dac98088f41134c1a8949fa1ddc;123456789030c7bb219ef105748376052ff116cba2;1234567890dd94183320728abad2b70edba6a8f03f;1234567890d20976a4a9506c6293a5ae8f01df6044;123456789020acfb49f97c6279dedba32c33d4c7b6;1234567890fd08c356e15ed6ba3b2b92ec5cc45418;1234567890f33f0a1e3e46d09d49d09e0343bbb0f8;1234567890b81091aa262e4524f16ab8f9100805a8;12345678901540a2af9fff1ea284d485a5c50ffd60;123456789076f21ee1808f4abe33a5c0b16e9bce5d;12345678903f4c5e566e65aefd86a396bf0e60e441;1234567890472423171e3d1eb7fb20a2a3f205ef78;1234567890ac65c6e2beb79fceacf2d97baa293030;1234567890c4b548c554772565c59415bb4b222550;1234567890cd1357730f3da216ee9323adffc4d1cb;12345678905cc0c87f2faf2e889b9a5e1e4bf416a8;1234567890df2ad921371359bf4fcb3b63f08a40b8;1234567890393de45ee77ae868ab6fdea5a76dedd3;123456789038c62007ae8b10aa106266794c4c383a;12345678906f5013ff890a5cc6abcd83cae83dabb0;123456789084a35fc9c9ca37203e753306d69816e7;12345678902f90ea901e1c832668b61b694434263a;1234567890cd7debc0fcea1584060c392a16a5d7b7;1234567890fdead6b7bcb5d708d8ec1144dd951889;12345678908b3b2d362e02c86503b426299812ea43;12345678908fab0f88899f21c40908895c88bca336;1234567890c70900243ca7ec491d425778bd9199c6;1234567890145631081b514d66e1efdf0eeed0ce62;12345678906c1dc56dbde18171d58d533603efdcb6;123456789015b38df097e22520ea877bddc3181a7a;1234567890a5dbaa678c0c5af3f4e73c7bd62f2a39;1234567890ea1465257cf7d8ebac666f28afc2c200;1234567890ac7cabb1d4c355d7500cb1beb60b1cae;1234567890a7c63c2096f5eb14beb08ef6e596d488;12345678901451b8919a609c0a49449384c6c67ffc;1234567890daa9440f5fe43fd18544e16be606650a;1234567890ae7522250062785d91ce2619d53d1dd5;12345678903aa4661aa11f2ba2d26cc994489185c9;123456789036b8145da8442721c4dd6a5719e07b9e;1234567890586ac1a7b3f12936950d97fc2ec4eebd;1234567890e4a10762d16d500c6f1259250830ecde;1234567890627b1cce904cfbc0093f9841858e9f6c;1234567890f71577b0ca481c7a5abd341bbed3d4ed;12345678909b441223d1195cab1aa692f58fc5b373;123456789003a7810cc48d2469a2dc79ab7c33dff0;12345678903eac7430941294ad8e18ae697d79160f;12345678901f310680576bb45ea190a6fbb3dc1dbd;1234567890278e56e029d227de99a3a3ff0522af5b;1234567890f35c814b67c394dab4d042efcefb820f;1234567890403aa568851ae948e910508f42426b9e;1234567890a9973b947d36a52813479f57154b6b74;123456789076119a7d504d7adb4abc630bdba3e660;12345678906168ec0e6e7ea5ddd38566e095a5f7a6;12345678907c35e14cb4ef7e7b69dd17b76f381ded;123456789059fdaf5b2e4742c483d4e48fae5a23fb;12345678908ca2657771fb29b7c3d4400f0d47dd8a;12345678906e28fdcff17cb53be8e468000f02513f;1234567890d2bf300dcbc94a976c8ed77b9e952693;1234567890db208a652a39a35efa881dcc0620d28a;123456789091c1d94da4376176078ed2edf3f258c6;1234567890af8eb6f841aa38ad6064c3bd9328b315;123456789054e232948009c097b6194f6a4d3ecefe;12345678904e7fd3177b506c2d2893c35074b7c803;1234567890f15f00c81a9054ae77d14c5af3230e86;123456789084df5a8ad7a3332ccfc166d5cb17ad67;123456789034683e1e4e37e49dabffbbb137fb0737;1234567890cdcf7cb673d9d67627a9226ad1601971;12345678904a5ab117390e7bc5ae22a6bd333eb00f;12345678900d7b6fb3e15a979467a44d0fca452f21;1234567890ab1b7e19e05d54a3cda4a93cb6ecbe17;1234567890924f485c8750c0066790c00149e8e329;1234567890735cefc92b2571eeee2f65725b0169e5;1234567890008152d2949f04f03614ec1b2414734c;123456789094f0741440c9d333d4b92714fef76ff5;12345678902abc1c788e8a6757d2260f8f51a9381c;123456789031e0325c64ded9f91849dd1dc5aad0f8;123456789094b0c9caeb7f2d19a8ff461aa5093b94;1234567890d80b8349e3a6efecd078cf3ecfd63d0c;12345678902741f501be95d5ccfaa82508560037f6;12345678900ef0db5670b7acd7a081af589d8ac5b7;1234567890998cb3f6a8996f75133ab9dc0a0c1b43;12345678905f5c1452f349cddcaf1d357ca003b825;1234567890ac34eb03ce50bec7a77373cd78ffaf09;12345678909f1ed29105081948b8e7b2d8ac5160c8;1234567890b05000c0871aa997af708564a170d1e9;123456789001c29a8cc1ddfeecf33bdff15e54e9c1;1234567890387d178f9612e3916b8cd6338f59055b;123456789093f72418bb53d72b863b00e781d873f1;1234567890d4090c20038d18e62ede8abbfb0276be;1234567890d2d292760fed525f63b5ec8576865c11;12345678909ba52730e323b0afe972a1d7559cddc3;1234567890b50613188343052e932743fc98b53f42;12345678901a26a55eed244d7ec6d59663fea1c9de;1234567890900ab1059a8471aad416aca31004a55f;123456789047ebd4b49104cee1d2a7737cb9d750bb;12345678901d4fb8735bd5b9f1af628af23ddbbd63;1234567890ea3065f3bc3dc3d94733d4455834a418;1234567890e359b708d14d19e3720af2a0dfba45c3;1234567890a62d5543d9b2226f5f2e944154d26c9f;12345678904b0573bef5314baf3181c763f27f1f96;1234567890b96c65259fd38e13e163708a199a22cd;123456789037e5df0c020ef0f2ba10327a3c0cf2cf;12345678906fcd7e2adbdfd19f0b1a5efbe8597246;12345678906b3fc59e093311cc90107f966e62de7c;1234567890fed4a005fef138ec65e2d9e2b38dd82b;12345678903f5c22b4efd7c82a12c961c819cfee5d;1234567890a3e9af599b0694d39a3db02b722c48cd;123456789014ba46e3d6b1ad96fc4db7928d7d677e;1234567890f487195fa747c82c5b67de61abbd69ae;12345678903a44733aaf770d45141cc4ef178d2daf;12345678907d22c547fe2f7bca55bd132b51d96d4c;1234567890698dd6dfde0a1e5b6d75182e7328a400;1234567890b959439de03bb9a4565fa4f02ad74414;12345678905bf4b4324cd0cdfc7e6294a56dafb237;12345678901d8896374b4cd612d50489673939713d;1234567890055f433efa4f9da9af60cd26991e8e01;1234567890da6cffe1f0e92a6861018579d9f06a28;1234567890ffbca125c4bdf63afee3d2a12b5fc782;1234567890e8f9db0fc1b1635aafe378015f47967e;1234567890a3edbe5a241c8c59431cd0f4992c26dd;1234567890f4f006b7cbd4d808212493ad38b4a7bf;1234567890730ae21daac0c47fac5f0ae3200891c7;1234567890938b6a858ca0b0ef7cc7f088cfefd0ca;12345678903f05e7fffd27b092da238f55888acd0c;1234567890e00e3fe1397b133ba80e4294e7fe9dfe;123456789040860b0cba1f75834346254cd50b6013;12345678900b3c324e07c568a6acb0f19af667847f;12345678903a92036732f208dc162bf4b43d2d378a;1234567890792173361d7afcc60afdd2ef9939bf47;123456789008111f01e3529771ab81e464bc3f8308;123456789051ab668f86e14576be6bdc18ca923e2b;123456789063945e2ece6e7cf89bf92952fb51c229;12345678900983d597101c70378837c849bc05491f;1234567890a936feb97fa31a08ddc3ca153578157e;12345678903f23e8b6952a875b970c45af94c3a905;123456789024cf3f652f64483fce095d675698d87d;12345678908f44eb56543a343287df5ee93ba66aa7;1234567890a4855eaa320d4a638cd55f81d5b346bb;12345678909ce019d69b8f64eeed13ae1112eb86be;123456789061a54740854b8c6ff57a5744c3290572;1234567890558179e395650f0f001ac8cde043880b;1234567890d328accf2d47068938fc503489b4f64a;1234567890a359abd396aad369216d5874e8753c3e;12345678902e1a30dccd060c599cff47ec1ae5c4c5;1234567890a0f408d16707758521bcd26732bfee37;12345678907cf906db93a2898915449ec0fc36c433;12345678905bed28a6599de90aaedc9d577f934feb;1234567890ed1f6540e50e64b4d428961ebc8e6914;123456789028a2dafc91078ef68228fdc53780cf1c;1234567890bfefa74f63c5960bc8db6709aa7b259d;12345678906c90a28be65a8e08cf0dd68b0c769b2b;12345678908557bb5b3fad9624224a39cf540aa246;123456789079a29a4c34eff46b412ec1e7dc2109f8;12345678901af0b4568088d8a516f9afa87661923f;1234567890b52aa206835ff569578908092e81ee24;1234567890ceec952779ca744a5194543015c54bc0;12345678907175f52ce12beef3058dc059cb4d529d;12345678902830cbaa463cce33357164573837a840;12345678902b297d667820770d4dc810055f430d1f;123456789006e8059ca44e4578afed7f77911f64f8;12345678903199fd662de6dd13c41e52440bc252eb;12345678900708bf48574948c5118d9877d2661bee;12345678901406aecfef22a4e5ce2be6fe64f6031d;12345678900f00eedf467b6d0885fc58a190bdd912;12345678903d2ab285cbf5177b3cc65d68f242306a;1234567890958063bb45d29ff3ba7437f6f1cc94e8;123456789070b6a3fcfe83041efe65def6ccc8b4da;123456789019a5bb64d833f052fdf0164628d1347e;1234567890971e40eac30fd8aa37bd516634d7f372;1234567890fefe90c87079aaac9888912f0c364eae;12345678900fb163ff5f426a18504f7591f5b9eb0a;1234567890dec5f53cf8962c5cc2077ebcc113bf46;12345678908a6b5f8d1ee635bf6c8ecfa9ec49766a;1234567890a2cf45bed97ed01756c21876193a09b1;123456789096561724b38dde576cfe8e50436bfa63;1234567890b1ba9b2d7da507fbc2d27d11a002b00f;123456789076897c9649c70fcee2eb8ef990df08a9;1234567890ecce94c20586cb1d379aa1d0f6c5910d;1234567890d91f503a11a3b61990f81a4c7bcbbe05;12345678909bceede05e64997db5f413eb50996cbf;1234567890ed700f30db45a3ea971c7d737e15bf19;1234567890d422e9ed7bf0c730efd83cf27ea85de3;12345678901562dfb260811ff0887eabe8ae6d7228;1234567890f562593aa1a5a7aa9de58211d2f1662a;1234567890c3c818fa33b662644a33264a3558eea6;1234567890aa10dc4b777f17bf15bddf2931f3e154;123456789062e4ab41fea4064750bdaf5bbeefa598;12345678907c2f9edbf078d1e1631faff4521b4077;12345678907db5c5ae1879af5994ee7ee79b803362;1234567890ddd925dfbf365901b27703894d573b92;123456789015178c084847af415530fbeef91818d3;1234567890009f7d881709c140b334b891dbba4e8f;12345678908b6ffaf5aa8bbec5989d18c1d341c9ec;1234567890f2cee2506cdd457b5f89983e947b3217;1234567890689d13e718801233b317f9ea0b708f01;1234567890ddb4e360cfc816f545cffbe09b6e1033;123456789079ffde5bb51d55ac80ecbdc8ac2c52cb;12345678904f825b683693cb594d85e7df2e9bac71;123456789078d851bd8c4ecf6adef2109c841e7399;12345678904295967d10705eaee9911efc912a1a60;1234567890a3351123bcfb7dc4c47948d088a275b8;12345678906124a4715dda525b9f8ca2e0e719f07c;1234567890be225737f4838853f5d8e4c12809a8dd;123456789045b80966ad6de93017eb999a5b1db4b3;12345678902890a540f076118c0bae20f407579461;12345678907f7b855aebc3e11088138afab00ec7d1;12345678909ddfd04ae930e2c76b89a2f340800149;12345678904da359152b61828e483a6da9879af146;123456789087742ec59911a776cb1db119e1eac730;1234567890e1f4c3988e66c51be8e5d19b1b6bf95d;1234567890b85f1d31b6c23887797caf374de1e8d7;1234567890b37119766a184b7edfcb174a0badd121;1234567890fe43135980b7304bd964d8fedac78303;1234567890194b90a94848dffd6bc684ef4d69dc0c;12345678907a9e4530b829afad6a76c0c4fb8baeff;1234567890acb076a5e111b5944836ac2729366834;1234567890bb0a0b736a70da1ab8c7c4063065dbe1;123456789056b88c51bc0a63f689e5e74bb3139a32;12345678900cf165df3f225f399f127292c20190a6;1234567890eb591b22f73842fa4f2af510efecf719;1234567890cad678e72720e87785992ea7bcf8986a;1234567890bed2910c7474ab871d8a231edb8fd2aa;123456789014e2855408d08c36da5acc452e32b151;1234567890e9e3ee27fc39a433e0b83163219a0690;123456789011d05eea5899ed6cecb0afca1fa5fd1f;123456789022b9f8bef8fb5b2f8eb60b151d605454;1234567890b027c49a885853771041af525bf307ae;123456789005657faf47b5a2b714b506a94a082f20;123456789079b86c5a018b35d48c102fd2bc3e0fc1;12345678905aab8bb660a4de7180ac4b868df825c6;1234567890e37238d067e57cdfa7ed20875f0884a4;12345678905bca7e3dbc32de3fdd01cc769fbf64a3;1234567890c4cc74a658e9c80e3274d50780d67580;1234567890bb224b25dfbe1fe08966d80ce17b45f0;1234567890fd629bd7c86280297006cd5730017eb2;1234567890fa6a861c5fa541f3e4f6731c08c48a6d;1234567890cfe6a4e6109fdba2c752c0cfd77fcc8f;1234567890aff502e2b3869f9e6db3b938df472878;123456789006bf45de0d1b0c990952aca6135c37e2;1234567890211fc77773fc43e2a7f593d92a94c4c5;12345678902b4f6a4774862b6b5567110057f01556;1234567890d25f254ce0ce0e4759aed60f36cb96e4;12345678901c8e0ea6d974601bbee33c648908ee51;12345678902c891db0dce91c73f70574f109df3469;1234567890084d9b9f98576b988f99210aaff31411;1234567890470b4476c8af7ad2489ef1a194f38e0d;123456789039aa366d60d5a3379fea445ab7e5cd73;123456789033e841a2c36bd6fb6f51f54838775df5;1234567890da74b9157ae83c6b8203246f66343645;1234567890379250e5546b20e52451323adf78bc86;12345678903370b8442bddefc15ab1570e4a729089;12345678901afe3e852741764b6c80b592c3fb31cd;1234567890370a66f178c7ab3ba6cb42d67e77b390;1234567890ca90a6600f0791ed23a59795e42baeae;123456789074f202857d9db17fc56a99850287769b;123456789053c9bb89ba50a8731774e783eb68c89c;1234567890fd882727461e31b3e9d20437f7e5ea85;1234567890a1d05b9d3aa4030ef74fcc3a09ce7088;1234567890217d87d8b74b88529764fe26767cffcf;1234567890bafbe22304fc3b38f05b649950c40525;1234567890a01877ab469e7da233571d00ea963eb9;12345678903544bd82e6f91fbd14a8078e5afc67ac;1234567890ed841d86de8b2b65cae8b44080ef22f7;1234567890625678559a177bf82abf266c18e4e1ac;123456789031a8208df2cefb933b452ab8811c65f8;1234567890745f868a34aec41e437d5dd97f16729b;1234567890b8c495cdd0032d3c24138b8fd38e0900;123456789073bbc7eb4348dc4daaf24dee6417798d;1234567890937223b7338ccb7f403f519f0d02a6cf;1234567890b861a68e88663361408a4cece7fbae51;1234567890a7b78ca2cbbdf30a15e836e15c666153;12345678900b24b21170253efb5b9bc1595691cefc;123456789044af556c4408030da6d31af785e56475;12345678907b3b592322aeccef700cc2f7e2ab727a;12345678901b03adcc9b3575a847f8e1c8161691a2;123456789057e5ec3bfc01947fe9963d04bf1a8b84;12345678908f656a80cbaa3db059fe9a96e3f6dc04;12345678903c14aec39b326c9aaa03a4198406d0b3;12345678907a1de1c7a5c7c8b5d45a97bf419753db;1234567890ca5af8a358b12833eb8f3e8d2eb01ed4;1234567890071323ecefd63a1f77cafd1d1af33b38;12345678907c5478ad0a879d7fb814b62957501220;12345678901863f088fa65b51a7345e27e32aec09a;1234567890817e6863def9631ef576b0741baac08d;1234567890acc77b29a80ba657b0a144e059f31359;1234567890f3ddcd1aff58a4639765a34e494a5ba8;1234567890e014d51345309274cb6e720a22930e18;12345678906a88459d6673acd2c999c54e03931cf6;12345678909869991172a9b0cc8bafafb8798938a7;1234567890e258fd883c28368c6a7bf3c7487450c2;12345678905d6565a5d3620e58cbf3b76514ec8bc1;1234567890c76fd44a872774f2fc6f79156e0b0743;12345678903d07d2cdfc30432afc3fb95a22ef451e;123456789031cf1f5dd8c6b6e7f88bcd3dcc129069;1234567890b93234df4bfd074665dbada9fc765e5c;1234567890d1a9907af660e364d267dc8a1977b0ce;1234567890992237a75f299dbcf1d42923419d28a8;1234567890fae11438010d3b894175fe17659ff000;123456789054c30645f47691d3552084cd761531a3;123456789069d0d5619fcf2e5a1ce63c8d0cbe32de;1234567890c8cd1ea249fc7797d05932b3c5bec6b6;12345678904fcd2bd550df1d9248c1710db1c22918;1234567890a8cdf7fc3161dc0f3a1d20f481a66246;1234567890733863ac81148e40e3d2e5e2a1446332;123456789047e2b62df4bfa81bf6d738894b57e81b;12345678908a77eb56a8b7a86a95df0a8714dd6a1a;1234567890f6a0f1265fdd6939461251bbb9f21e03;12345678907273fc717a54cf5e948af10c9b20431a;1234567890c96447776865b622f1739d79b2495cda;12345678906524650c5a295d38f98662c133d4d84c;12345678900402680f5c527acdbad371f119d048da;123456789012bca2ab9508cd7dc477d22be56229f6;123456789021f5e26bf8ef098b61baffc286e10662;123456789053a4dc8e6108c96d00d4cee6a2391d8c;1234567890a50e6cf8fa0483df1b9bd750ffd130f7;123456789090b022fd8969826f98669c58a1a9e52b;12345678900198b232aa6f9e8f379b0f2df065c639;1234567890ae28f3e5b9edf26568b261dc38f6951e;123456789053329ac059dd9888754d528a7f9c1366;1234567890b700469ab09adcc68a316bf91b08cfcb;1234567890878d7dee9ac8fffd6db48196fda1024f;1234567890052b8be40e56acc9f22e8c1f759eb3a1;1234567890f200bee1eaff0878882a87144850482c;12345678905a8db203787c5114779615ed863bd048;123456789023bc014840405a06fd5fd9b3b66b8398;1234567890b261e2aba38a6054c6cb481f5e4e3754;123456789080743167c7323508f8704eb32186a4f9;1234567890082f63b128a88809bb94f5c198e0142f;12345678901d4700e1747c1d12217db9fa4cad27f2;123456789091a29b9b82faf3281c29c20c303d672f;123456789019fd2711f4b1277eb308c6d846354667;1234567890c4143972e2618729dfc5c75cb2d8eb16;12345678900e93d1ea05d1849a482bf371e495ed13;1234567890a32ed4236b87e553c515317c71bc6cc4;123456789052154acb83b3e6d9449008d2260bdd89;12345678909fd63ed99212105c5854661526ed8748;123456789027b36e76cac07fd2760329cae41415f6;12345678903fb17e4822ef0182043567a72540ad59;1234567890545fbb7c2fcbe72b912bb77b67a8d29f;1234567890337098ad82dbea469f7a916dc2ae7a31;123456789027193c9eae538951fe138ac702c7e3f7;1234567890816ccc1c3d3657778494bdb56f749d61;12345678903acc03307ad8ee1d29043ea4e319360a;1234567890c39b9ee8f64d57392eb1931f6729fa58;1234567890bd834e113ee2d4d5351290f44ba101ef;123456789022ba1daf2170eb0da9dbc730e986117e;123456789076d3ee3f020bb54f782f71640f7474f2;1234567890b27e0d276748be9e6b87c4c6889fdcf2;1234567890e43c5a76852fbb02c92a9ef0fcfcc8d5;123456789020e5e316baf42b091fe19169d201b460;1234567890202209f08f09ab7efe64c5d526badefd;1234567890656d58376a0db81775304033df2adadf;1234567890e9106a52c900f6d588fbebc1264301b8;12345678908dbbc90e033be78e537cf49339f5d6f2;12345678902d29c45c84059d663381bbb58c72eef9;12345678904d251fcd0827e69f651e71ae71810942;12345678902632a812a4f34f8a9e310875fc2f70a8;12345678902fec36689ea2dd211a9697bce143e9bc;12345678901d70e91e06f5456b25243664f2754590;1234567890ef7faa909aeab5ecd4f1c6e294c4fba3;1234567890a2c48112ab23b3c5e83be7c264cb3a16;1234567890743c2055d553524c81b433e4853df76f;12345678907882ee9108b6b9fa12fac8b2b8647a0a;12345678907e8e52304a0a440792f42bb9ce767f69;1234567890c75ef0d8a719d64928afdb83bf9b60fd;123456789060cf6c7d2b32e5378741ad3ce52185c9;12345678901847a2042b00f4ab898eaef20ee06a59;12345678901b091ce00d80c479504060821897852f;12345678900cb63e0e30a644023c60d27ad27a1271;1234567890cbf0905ae4e86e307c433c82834f541b;12345678908c90ca903f9b432fb9e27223d303289c;123456789042f168850b20f26246dd3b66c6e2826c;1234567890c8cbfe00e6bc0d0a579aa07a4c4bc9f0;1234567890934db130836732d4ce9e9406ca651ae2;12345678902adf0604de3ad12c8f5064c65218428b;123456789073cb6e67210841a5181ee958708c624e;1234567890d76ad613b21a11726a3e9437047fa412;1234567890c01ec28fb15d82d2008985e0d5626569;123456789081fb91121ed1fb714770fb2f684cfe12;123456789029ff1f47ba9b93178f2942aa2a28051b;1234567890402f0c8c9f667be8881e88572b03e888;1234567890d0bf31299731316fc90e958324565a50;1234567890e43889eceedee71346d0c66081ef123e;12345678906cc03039fcf1ad10f00febb8946dfe36;1234567890aba96121447ae14b59b4c680185e0b52;123456789006756351c71f7b5e119618854550f31e;1234567890ed489d437c0e931f483dfe1a727124ff;12345678905ae923c78075f166a2b281d8939dab8a;123456789096ae63295016987ebe89e1da826fd8de;123456789033f036ee9afa0ed720bd1e23e2f7802a;1234567890474408ea66ddb18b225b22585a29156c;12345678905edc7b558c9d0f478fa8143a6ad6bc4e;1234567890e329f7ef59e6c032db0c7805b08cd1a6;1234567890ad7ba54a94f15cd4a5958a5499c02cea;1234567890a99d6f83d9f4208c9030700d7364bc66;123456789021ac85ea3a5c3102b9007fc305543d40;12345678909de6ef10fee26ae0f0355f9d64f477cb;1234567890f73d4fa2d07c0440f21c996bf7a7a8ca;12345678905b38b0446e88a50605f469b37fb0a48d;12345678901a201765db2ce73a422ae6db3d90aeca;12345678902a4c5d5630f30785ddd9b22479337522;123456789084d4ba3e77ebed417ccf61fd7a416786;1234567890a45c0d9368a38d74bd210c4fec4fb103;12345678906b6099c760d3f3cbe22c488e14cc6e96;12345678903ce4dfe82330d55f011094b4dc59ef19;1234567890fc756fca78df4c5f0ac75293b4748483;12345678908c54f927311473fc61d17d72e432165a;123456789095e2a24b82054c69693cb9974ae8477e;1234567890381379fbbf4bdd15d483f93a4898fe56;12345678903f3b19b15a11ecdf9942a28ff8225e98;12345678905af1a9581dc000ec61198f839854cfde;12345678908f29367b40d098eed400baa89377f6f2;1234567890e0d944611df84969eb07c2cb5c915880;123456789008085ef4d6c647c64c0740cf87552294;1234567890b6a3c29eeb38b14cf3130c5430e8487d;12345678909ceb78c607afcde60dac86cad84967a2;1234567890d3c59b322f37f6375341a4aaf5fb64d7;12345678901e18419a342e2ca1094f225873f59835;1234567890417551c1b80e926ea9edeea29c2c87a8;1234567890d7dbb7b856006744c214aef69e180ccb;1234567890f2031a8122be32dd6e18467c2dc35768;12345678905b37271ee297776e6ac236ed1bffacc4;123456789056312cae939fbc30e4c3cce16922bb4c;1234567890bcccf851d6015a2c698e057f214d241f;1234567890c90ffe4baca9487ad3ac82d9a17d763a;1234567890594e2c9a65a75e797cf3974bb87e7133;12345678901104e4d42e3d0cd58c784fdb672fa382;1234567890968b4367a94df255a6899f87c3d4f8ef;123456789078b872ff190299ac85df927c5d66a4d6;1234567890f8821676a8f18481b564debfffc1e0f9;1234567890ee0f126f89f92d471aa1ab9f1aa3237c;123456789008eb0be7e5af2496a9719f9ddd97df33;1234567890174d756f8e51efd159aa5017e6cd77d2;123456789046ce8f59b71695735d90068f4f04adf3;123456789078cacc8a79c097440e216a0333e89aa4;1234567890e19a6a3f9ace9b9b6679baa3a141de2b;1234567890b0dc595c5e33e60f2c339db204ced01f;1234567890c2531d6eb956e66b80d1168eff68af87;12345678908e473c5ac6ffff674db2c16a6374c8f5;123456789005c093e02fa51949188652245db61350;1234567890a22205d9271cb950414b1e9bb04bcb35;1234567890abec8d8fc509f391077e751d576d9c30;1234567890efb9fc44a487874d3f181fa5e32568cc;1234567890a1eee904c57fd04e769035d334b3e401;123456789095b248eeda65d24ca030e5ce0f3ed59c;123456789066260a56748667a6a8f112523622d542;12345678909e5cf1957f0cbc1d169282b8a76bdc2c;1234567890b564a750762cb91ca792c2cc5ce8568a;123456789025a81a7a0d4361987bbb7431f248da03;123456789084eb9f5b249755d6722d992fe2f030de;1234567890329bcec44970c391e4a3c8f91ef651cd;1234567890c781970d80c16bd1a2bd1679e719ae5f;12345678903c85ae542203819b791e3eedd4e28c68;123456789068615b2d5b70dc096d4f98f92310120c;12345678907b756908331713f61bea91cbc2dfab78;123456789036829b23ea71c11100e7678802575d04;12345678901a9e8bef087d132759e78ef836b03f6c;123456789091301419fcff73f3c570d5096b785160;123456789008e473406f723f30ea7bff568c05b704;1234567890c24e2873cfcf7dfb5db648d0d74a36b5;12345678906426d9995a5d323576050ec045347a05;12345678900cb6d12db97d542ec04f1fa537d9b92b;12345678902722b8ade8f031221fb43e537a74132c;123456789007e336747e9950ae1624fa54f49f5da2;1234567890eabda07579c6831ccb0ea02fa21611c7;12345678908edf6f86613f068a2a11315add829ed8;1234567890b4b1630011dea5760fae127abc8c94d3;12345678901ffa6159282281c4598f704a9b712bfe;1234567890b8a586a4215ec931fedb26f9eebcabb2;123456789005ded85dc141244a5914c89e3db8c4dd;1234567890c7d392ebf6863fb6bd95e5e7e6937dbe;12345678900c479ba31a412e62aa958b0fdeea0053;1234567890e5f305a1bf776ba4d6c5ea102cdb727b;12345678907004c9686ec6cbbe9b3ea52ed0c4e11d;1234567890051c58ba2ceddc4977135e31cfc17fcf;1234567890a5e8b61ebffdee9250c1e25220a82664;1234567890c11bf180b405859c23109c8e4db8390a;1234567890511c36dd29c46dd94c8f08a720988fd3;123456789055bded81ae4b474bd0d02f7ae2810647;1234567890bb966805247d90f59bd1ac557375437e;1234567890118bf787ce7b5f4e74a36dc180bc32f0;1234567890585467b19bab7edbd739eaead0c2cde5;12345678901f21c082fdff812d76110a1b56c415f5;1234567890c4941dde546c08bebcaf16b215b536b4;1234567890b424e3ed45857f2b7ced61bf3f6d778e;1234567890641520340688b4b522155d41d3b15d0d;1234567890116e9866dcde90390dedbf6b020c006e;123456789037a1603fab9c981ac51975a3185ff1ab;1234567890ae0f2d06eb47ea11bce01f4e03bf8a41;1234567890fdf01b5a68948a45fa2c09643c70b696;1234567890cbd73f3a84467ab86232f47faaa65787;123456789076c44c7d3b3fc2f6661241a540b0c9ee;12345678907ba28ad7b1c0e941696fc032f3d4d907;12345678906c4a42ef6193f585f3af5b9b942ce285;12345678903d15ecb10e10416b6ff58a82db81b001;12345678906ade3db3799b1fced5e5e7bed10e605b;12345678900f2bd1becd3c2a85ca4cd94ae569186e;12345678905c524ac0d0d4f5e1bde6a4133f390398;12345678909893e600515e287afaca1be1f9d0055d;12345678907227e15b0ad105278b80be810e3ba09b;1234567890bb978218802a3366e203c1b420e3cb6b;123456789025d37dac26d6f27c493168ef36f7f20e;1234567890b9921a2846934861b3a27b85b529dd04;1234567890c1e53d45f2b2d8833ffece8566256926;12345678908b832ed915f98d366e2a1daf659ec7a7;12345678902697297bb522b74dbe8150695b6ec483;1234567890f836bb2ec11c5a83f2da2b3a5a39b8a6;12345678903e3721399bacd1a4e04e252ad6438b84;1234567890ce3fb21b1ab32a5a97f27f02a8b1c423;1234567890355da9d009ac45b14f36dac5747a55a0;123456789075a9973d6b3b5f2b103b8de6b96aed3f;1234567890da6f85d3ca5abb8bfe03b7941c2a5cbb;1234567890fe907e1ced318a1fd211d7f4d41e0ea8;1234567890fff46ee238e5b79e896cde570f7f2fa4;1234567890afc91cccf607569690c8491bda0dbf42;12345678904299ee5cae90f81c261aef98c0ccea1a;1234567890a9f8609c8a2ba252cd9a53719ba14058;123456789031985875f0e1ef8da720a19b49167586;123456789046b05742528d13e39ec00b8aa1af439f;1234567890b8b863f9acef0711dd5d75bb259adb89;1234567890d83e1a03b1e20495a6a80628aa8a9ca4;12345678907b1a6aaac7e9655f6a67dd0afd3b16a2;1234567890334efbe0c5f32342b5fbdb71c72e3a5d;1234567890c37f22e5a312a8be50bb5147436dd749;12345678905eb1c3ba0de9cae11fb5a8b8dc412880;12345678904d85961a72b7d4894b6a5cab0c1db7a0;1234567890de36b5c52ab42fe7449d5b71b8b1f70d;12345678905343c0edc558003dd4641d1819972cb7;1234567890c74edbd23d498c2e2b7dfd3933907de2;12345678905cc1e986e9f3fa98ad9eef8c390b33d7;12345678903d2217569b1aa28b7fb56f5da746aca3;12345678907b969148842017394e8bfb36db43a5d9;123456789080d5909f864690a96ad5240494c37c5c;12345678908dddaae52a39ead9b2f33980ee0772dc;123456789008f9e4cdbcb3da2c96e4d2c32d0a2543;1234567890cea1eef59a489ca6163ce55a1c84d38e;1234567890be57f0c596e96f80d4393ebff87a2d84;123456789057b1797910c5102082f82f071cef0aa6;1234567890d7be11f3ea973d4e883bbe6a666e8b49;12345678905d37d39cb16abcdcfcda4925390ca753;12345678900e0f436a66c87511106275815654a239;12345678907e28abb682ad16dc8915f81415c38922;1234567890395e93878b9927c2ac20977cab765890;1234567890e8e47c24056c5a8d3eee9bdbfc74b3c3;123456789089d94eaae8a5c0b886a9f0c7843ac0f4;123456789073c6345a946ed45881ffb57c722b61c3;1234567890bb8c9c5b9f9df46ba09e8472f9b47a54;12345678901aa7c16bff5f60063c8fb48d9ab34355;12345678905d372fbd1f9cee2ae28ce9e9a296a087;123456789097bd28232107ba5ccd0ce75dbc042595;1234567890b053047883256d586532aa73583d5cbb;1234567890352ca237161cf0a9ba54566aff99ed6e;1234567890fd0d0c4a7220c4aef3dec68f676a4835;1234567890ded90eb933779985d772393c92f52e10;1234567890ee74265c5151dc94f3a08364ad2a236e;1234567890e419fdf97d80eb952840dfafb09b00b7;12345678900faf7ced0f2b37e359ad3e7b920ef6c9;1234567890090e7fa904091fff899f27d990dde1f8;123456789099e9d6c2ea5d826ec3df5e3732065cf8;12345678902bdebe40019102a8e2f9f0d70e0e4d19;123456789049add9bcf8732146870a982981f802c4;12345678907be658afd9af5dc71a4d575418e8aea4;123456789040cc0e02c0309ae98938428444d5ba89;12345678907f8ebce4799bd6c81ade493b5ac2e1d8;123456789019fe964b390b71feb119e6fcebdc1cc5;12345678909c1b04f7af54d7cbc2813b1ae5bdf075;12345678909fb5d6a5768136e979ddb0aafbddcd6e;1234567890c9ef6141541fef0ed105e94791c52f6f;123456789084b7bcfca808d98108931210c1a13951;12345678904e25bdeb75da0bc8200fc6c5a262c051;1234567890e9ce59d8021395764940823ccfb293a0;1234567890549aca5b116cc6214a0bfdcc749a93a2;12345678902c9ec33d16b9adc83a65dd7ef9ea6877;123456789051fdb9f19a3e2f25d23e60efac8acd94;1234567890964fbdbfa392b196c78fa6fb5d5037f1;1234567890d78a7151dc195e47461a1ea933051bc6;1234567890f745684fc3b5d216b2a247a34f81e8d9;1234567890c6540da474edffb94d6a4b399c582c1f;1234567890b20b930e7f7e4694636e55e0a2a5ac56;12345678901980eb34beb9f272c2736d37995f6715;12345678900e851cd505cadbb6034b627a0a73a355;123456789002ab5fe2d7902b214a4b7d029da2776c;1234567890d494b20a7dce1eb06f937a3c96c71133;1234567890454175b4a6c1fc1d925f689b70ffde75;1234567890adef60ee2cd006623a933563d0768306;12345678902df31d2fd0c1d64f86e389048e72ddf5;12345678908fddd7aab90afefb91fcce787c52856c;123456789034ed58efbb9ce43362f7fb98a5927033;123456789009b06d5a94fb5418eb5cd6f0ce3266c6;1234567890f7aca165996e614fa86065e8c399bac5;1234567890afcffd8b0aedeed54cd57dc0655bfe7c;1234567890c1ef6bd0411eb47ae2f9bd953dd36d3c;1234567890e1fab1632106297c892a4bee51189cbb;12345678907295fcb6c04bbce4e193fa1dee0984c8;1234567890863a719d18c3f7c7ee8e977785c18528;12345678904a29331511419bc210f0e1d53faea0c5;1234567890a286cdeb768ab7fffc7ca99667845b85;12345678902cab259516b7191d7b58e39f56181123;123456789058441e479f2b86913287d6e196798333;1234567890907a1ae0a6b8264b906b9d879ca38ae4;123456789057fc51bdc7b5ef75050e2954ef012d6c;12345678904186e3d22630bc241e769794ff48e7f9;123456789093cf6ead2b962f2b6470a276d7d4390b;123456789048b7f6b76c3d7f91cfcb058c82fc1aa3;12345678900c8ddeb648ba5c38c04b33844677e969;123456789094ee8460513925ea6c504f29b4af5189;1234567890b75520140190b244d94a49a56183640d;1234567890068b380d41f8d54fd611062aa5fdbdfd;12345678907302dc25047369200aff9b3ce60dfc0b;12345678903ddc465334bc5d650d74ff99e116a03a;1234567890efe99665e8f28d65e250a3eadb4fdc95;1234567890596eabde548e87e03f65db2019e80d1a;12345678905c48252cc976e7772d7631f1d18a9e0b;123456789061dd9b81c7fde5957fa6d2fa4282e3c1;1234567890ca61cf28c4dbd231e975663d19073cf5;1234567890b792cbee4fc7839a51262289a161e371;123456789075adac7a3e1a5ff6443b249472def25f;12345678907a7054b79457ab7bb27ae932de40a054;1234567890affd1d620f4ddd23ea826476dccd989f;12345678904068eff8c0aeee96d25e27efdd527d8c;1234567890be5a230d86a293ab8236391bc783b9d5;1234567890819e55ede22db1fd76ec1039e6b34bf3;12345678908d1557c07a45459f8d1c167baff4eaa5;12345678909dffbf2499efcf0ea908ca6ed4f9874c;1234567890810cee527f1dcb91247b63c58f58b592;1234567890c3396c4d45b0438e3fbb019e542830d5;12345678906e433d3cc081f2060824fc1b17bbd14b;1234567890321ee8e95ca9815990eef2a60e007ac6;12345678903ed6be22189acb17d909de0fcd0b6619;1234567890b4d6c3f5f7c5181e95f25c4c3253ca17;1234567890c575f0390a0a82a39ec1b71071d675cd;1234567890fa61c7ade5f635f6e27752bdc1fe5698;1234567890fa018fca3ba5e529d95596ace56de20b;12345678908630adff2c8cbdf950e41d8c99114caa;1234567890e823402c35859c78b4f4f2f6ce144b33;1234567890a022022a837aa9bd993036ac8711170a;123456789045acbe6152034d5321b863a1e1b1f225;12345678909da662126aba0a36edc5d96140e16e31;123456789087eb285b083de40a8af601452cec6dd9;1234567890aa2abca249d91b5dbc5b349d2365bdf0;1234567890cc69a728c640766a7dfaa7afd988dcdc;1234567890a885f3253e655d6a0494a0ee689cfc66;12345678907cb1412ded4cacf2cf143be53002f82d;12345678906264593d2abba90e1e61d21de742eff1;12345678906f66efd1106a6493d7690e9759c51ca6;123456789019f18c75d91706c4f4ed8d6f1b0647ed;1234567890bbe55ac9c3075d96ae72716f99c824f7;1234567890368f9688701f89b0531a970af7b30a7b;1234567890a4306f0529913491d5a7cfe1cb219cfb;12345678904a3e0df3946d86c7fa079f9423ac5675;1234567890d7be203a5a6ba5e4945f094b9c1eb14e;1234567890c334d5bb56bf77875f7130e0d253531a;1234567890b40ef6029f684977ccf7cd85a38aa64f;12345678902abf8af86ff6ed137486e562a839d698;123456789095033e5f471159dfcab19315214bec19;123456789023b0e7b73162b910af32e64928018288;12345678909da7d819cbae7e7a7b2f29fd37aa424e;12345678904226bd12b882d3750ab56222e84b372f;123456789038f68b1e8d15b26a615e253416e166dd;123456789074bd1dda60a80cbbaaf81e982bc6de65;123456789077d67d3587e4fb85353855ad27c4a470;1234567890a65fd7e8869ba72d7fa8ce8e246c3dc5;1234567890c14f442e993e645b73bbcd7fe87d4171;1234567890de8077d5d171b1fd4f7fee87b4a09f1f;1234567890fb606a4c29106eb79e9b1d069bc30f09;1234567890c76a93542a804209bd8a6f5159620143;12345678903db561f485d8e8348cad5f36c355d176;1234567890561807cfcb0ba9b8c0797585e9ddf8f3;12345678906c2c8d82687de2289da0635e42c60bb3;123456789057f6774b33394a2b82903cfebaa399b6;12345678909801c4070e249af4af58df9913ccd157;1234567890d2fa72b06afaf3b6530ee3493b2b89ac;123456789035d44732e7c4fb9620fed7868b0c92f0;1234567890397ccc7a1a00471276c5077d73f1bb72;12345678900e9e0a8ad9d8f898b535f7637642917e;1234567890ad5d3052c1f39cbe3c37d9a2eb4a1b75;12345678900726c1c0541d980defbaaf480a920ac5;12345678905c233e7e7fcead06d7b8ed51ce656c9b;123456789065777fa1d268065da6458503698871de;12345678909e043a7b711f958f68db1054bc8e5890;1234567890a443e31430a463cfce91eef79f00bef2;1234567890a48f7811bee8ac47b4acf2b30987993f;123456789078b7505afb5cdc794cb318e5404b9bde;1234567890862c4cb14b162d7acde325a4aa5f4234;1234567890baa900cadd710a3a91e519098c0338f8;1234567890f04e7152653f4f81ca355fd5945ea6fa;1234567890c00614f9e03e017d79770e0ce5c813f2;12345678905d6ac18da64c35491cbf8beeb7e32752;12345678905d6ac18da64c35491cbf8beeb7e32752;123456789044c63e68f25fb42e5e3c23a0bf57b5c5;12345678900cadaf73d1d6a737c8e16a900f499f88;12345678901dbbf450146ee0b2ea86850b8e15b861;1234567890eea903b3e03c1086f933e22dc6da3382;1234567890b02358173a023b4bad45089f979a7ab0;12345678900bbc780afb0e1f7c322f8b74b033d916;123456789023c1736a6a1584d27778914d9945bf30;12345678909408417302da6d3d9af2c52c17ed686c;12345678901168386206f950677aef07a1afaa4e79;123456789088448e644c88423dc51df3ce783d081d;12345678909fbf68cc5efc65d45c5be381eeba8e44;1234567890647d21b8fddf819e0a270721ce40d44e;12345678901f1ccd716f383d395f6b56decbf865a5;12345678900bd983ee01a7955a459a02eca3f685dd;123456789022037f28da6b3812d9c61c4454315160;1234567890489b602b5804f154ddd1e55286fca4bd;12345678907001f57596e86cc366e70a0ddbef6ad0;123456789057cb1c57d689f69c6bc1d24467ba801f;1234567890af5b8db8e104f266a0fec42915167a83;12345678906928cebeb60ed84148fd8f0482f56eda;1234567890c64c6d7e4badcd2c4eb800f24aaaf22d;1234567890b4bac60daf851ba75d34f073580157aa;1234567890ea6baffc71d93a4c36309a1fa14e2ddc;12345678908c5970afa148d1e1484216d4a8b890f9;12345678909d0e0cc19eef903a30555b97e06559a7;1234567890a61172bdd844be7c171d06efea41c878;12345678903116bf3c157957f7bc8e315ad6aff1dd;12345678901c31fa9fe8d727aa2b5538ba4e2c2dd2;123456789033ce46e13cec5388bd0d4e07164067bc;1234567890f6ea52d4c87c5c996500efdd16119778;1234567890ccb2cf52162f0b88719f19a28b695cc8;12345678907a3c41cf024eb1fe31dff2cd349abd84;1234567890a61e6db88cb8645212151b0710a72c66;1234567890d47f52f33cb70719055de2f36bfae3da;1234567890d5563f3f4d3af3dea9ad0c1034a2e096;123456789049009b4fbfffb98b8a8047ef969faf51;1234567890103be7fbcdb1326cc10032decc746742;123456789085f640fb435860527b132fefdfa1f49e;123456789041d3e100f02279f40aa88e8f931633fc;12345678904121a1a48b85e0421894f0ae455ced5a;1234567890fa7312b192c23b17b380cc384b2d1021;12345678901ec597dd8e41b10901e42f45157af4d5;12345678908868f987b559733ed448f0d9b4ecfea8;12345678905ddb221cc85fef6f374d0e7d5a405ca3;1234567890a43475540e881a4225d69da6800e0ba7;12345678905d96ee2c3f7cb6e90915732f1af3eab0;1234567890c5b3c3ba9015ee92e8bc4ab192370a0e;12345678905cdc6a5307c7f14fe0e5cdc66354b83a;1234567890e9b7305ec3bdacc000a77e2d7f3c1de7;123456789095bf1c5258dd80d6429335f7c3351af0;1234567890a0d2b20e10eae6f30b79eab4b29cae78;1234567890bd32285057f38cf666789da39128b9ec;12345678908e94ef22097665c27086778a66c27120;12345678901410b13c3bfb859398f37fa7c5031808;123456789073687d7f244efa3f443f89d0fc44b620;12345678907e59412c460773fa88cdb9be30902277;1234567890d1fcd364bb39acf39606b06f1691e71a;1234567890fbd1ca04e445b49d746c39d53b6f75fd;12345678908ee207fea167c0bbce50a56d485e1b06;1234567890c6fed8f0adf5dc7b332ea2a0e2ae7ac8;1234567890b60a2b9daca44de3ee0d5c57a2ffaef9;12345678900f3a06dcaf6d708516014eeb15428dc2;12345678908a0e46a637f55575005c1d358cba89de;1234567890bcb635c8959da6786488cd99617a6ac4;1234567890dd966259bf648de189e7586ab1b00e72;1234567890ed321bc29fbc3d5a77b67835763f6185;1234567890403eec4fbb2b1b9ceb706b51cf27ca0d;1234567890e4a3af6b7b2a70910e509a0a4693d63a;12345678907e231cb01f27d0e16d387116c5cb79d1;123456789073fc37ab90e1e1d04ca82eece63270fa;1234567890aaf5e146ef622408b3619367fe713b9f;1234567890aac70e592d4a3a023f1398582e122085;12345678907dbc582d370568d0751c96155837a5fc;12345678909aa0cad986266d5a5ebb10c9760dffc2;1234567890224441695f959e66cdcec13e35bb5cf1;1234567890f4e6bb02ead463d29c31b6212c5cbaac;123456789013655766552ee5a641356b21d60eb31e;1234567890e2dc2c7372dc7cdb2f552a1d0e1307da;12345678901499863652484e2bd87a9ef05f6cc54b;1234567890f6847869d2022561d9468a1afc68d339;123456789058ef2bb89c1fc63b152cbc6ddfbfeb1f;12345678901437efb9d3c5a9bf56582ae040638b03;123456789061b37591fba33b3dd2150fe64cdd7c55;1234567890e0ad40bbf9de2ad880c924d97d612d8a;1234567890bcce07fb4fd4908b454711cac77c9b52;12345678905a2182c278e93bdc2aab4a456c88f5be;12345678907c49fc8d9db0076784a446eba30468b9;123456789010ba2bcf50202672a10d2b29572ab340;1234567890f70cd140ae6a64ed7d19ed16b6d5f3f8;123456789049f9632722ce9676f6eb019b5792c3f2;1234567890a9a99bb0f3649c7356248428a4822464;123456789064240cca2cb45a3682aeb07235ec3332;12345678906c70eaccbb34a945db1b7e4a45a65c3c;1234567890a74d88ded25fc18bbdc22976cdf39886;12345678905cd5672006ca454ed4537fd69c1a5a48;1234567890c933a10a4f5f8497c1535f968a1bfa77;12345678901900ae8a72140197433ec459f7d6f888;1234567890d61b0258a28fe0ecb9c3ac0e5bf21e21;1234567890554bc511bbd123fee3a3e397636594a6;12345678901d557ac74c2624b7465bc593adc8f143;123456789023a68542f4727c5a47ae0e0d528ecdf8;123456789002410290641b7125204e1ec5be02bf86;1234567890968b31fdd8fe458833fedcc90a661221;1234567890035a97888ee31069237bb09c24cb4d48;123456789062da6f2f2299e74cdbdd729522c033fa;12345678903e3bee759fd81db68f8fd0aa6cc232aa;1234567890072e9ba4f5ad0d2221fd36d49b1e5dc3;1234567890dc1b2e1e591f857f2130b87f77f74200;12345678901df111b5a550a4470d2abe49253fa9b2;12345678905700ad2277a94c7f641dc06fe7ba584a;12345678906e77974c4a95fe4b14bb35f28890817b;12345678900a2b78632f2bf7ab78bee18ee7d29a20;1234567890d1d2cb009a5ac436b764f94824dd310f;123456789094849e736b31ef3084b4e5fe3b0d7342;1234567890d6bed7c11b712645529f41fa3958d49d;12345678908be6288df8a54f1ca04ddb3acc27c892;1234567890fc1c2b49a5d55dc799797e72a7931925;12345678901339f18a06c8afe66e33286d6aedfc76;123456789021446f682d0656e1dccc30606225d92b;1234567890a6216c234f95ebd15dae69dae2302df9;123456789054bfd3c439deaebfb0c54b0a16d2670b;1234567890520d4c7050a695c71cd94595742a8899;1234567890c8eab70c9f3d508b44d9fc248cbffda5;1234567890f8e62eaa818db938a168a40aa56e96f7;12345678908304ff82553c3af06c94284f7109a20d;12345678908bac3168ce42b89e5210e2bd116b14eb;12345678903122654cc661583b0236002e3bcf50de;1234567890844c4c6df171f011c52dd67a2ae1be0f;1234567890334a3f69c1ebee8ed2cb83294645627f;1234567890b23228048436e13de0f86f813377e3b0;123456789011b2531bb10361486a1695d8eb5bbbc1;12345678900da14ba7498583f3c338e21371dbc437;1234567890d52c7fe20361034326387c820ddf6b2c;1234567890e72f8f662aec9435f6df9f46ee71810f;12345678909dffa9fb026a721fc2b6d7529e7de362;1234567890e1b382c000b80b2cbac4dfe1536886bc;1234567890eb0ce99f86a47cd0126da6187fd09ede;1234567890300acd0c5f0326f48bdea4ae7bdbd561;1234567890618d0181de1756dc4039a9cca0891bae;1234567890f235110e162ae8c85e19facb044ab245;1234567890638eda531561976d9c7f65b9057e82e5;12345678905df9181bad9cf39c17fd627d4c132d3d;12345678908c82f99223d0dbb7573828c97e4cc77f;12345678908bdc6651db35cb24dda70c30c8e749f7;123456789034e5c1e35ed3af20478b462503f50eaf;1234567890fef45b31fd8e6b52439c4310e2d1f356;1234567890a4d18f4ad210555b7f645301b564cd2b;1234567890748a735f52c246a956d00572c26e2122;123456789053b3ac56fc2fee3e609028533f784b83;12345678907692b9794aac127ed270856d27084272;1234567890bf8801b19ddfc2cc0b7d5579dbaa5f3c;1234567890de19c7f3a4a95131c1d3ebdb81e10f6e;1234567890deb06ef6e97f3e6c949cec90428a0385;1234567890cd82b2226b810d1ae4be98af5117eba4;1234567890d03fe17b7255a94ad3468f067bed43da;1234567890ebd288ec609fd5c4df8a2d0874362503;1234567890bff0ec0054567d6c6adcb97041db7c17;1234567890745c3026283b144637dda2671d151bcb;1234567890d60735c034fe098c06191ae9962936f0;1234567890f1af41d146f52902752f39bfaddf0bfd;12345678905d4f084d0334b44886fe78df46376d20;1234567890b969ee40038b6eb4565babe15c8950ea;1234567890d79bda1c5a68f0e8d9001e4cf4e25776;12345678902b94dbd235d8bdb6d1ea746526096095;1234567890e98dd4f85636d975178b7606f8691245;123456789091eb3a7b5381507cd4c4ad806487b2fb;123456789086b54b8dec940c861aeba48fdc0c3a9f;1234567890f2a80562c528d7acf9b6245dd7422ad2;1234567890203ea8bacfb0fb0d89c38847a20fc8a1;1234567890dc1b8c421cb426bfa32cf4c44468b255;1234567890a19f918e4cf1f06153bb486b870b36bc;1234567890355a2ddd683ea552ea68e21138400544;1234567890b161753826edae5ce839e0a0f0182c44;12345678901d72c51c65f69d92885d8683cecb1ce7;1234567890738e8f4964275909d2a9c7e4a13c38f2;12345678906a0a3fc25f224ebe527214639ec4c082;12345678906b310bb5ac355a6a51c6b740ab86a925;1234567890b0621fc648a9cfb2c1e9d6f439767978;12345678906dd39e9bc6ea1b4cde589c83503408ba;12345678902b43f7864c289ced98fe24d3901bae16;12345678905907d8edabeb4cfba114c2e93ee80471;12345678909d8867c35aec15ecf5b14a06d589f895;1234567890c902ae33c37f7498118698769d07557f;1234567890b11bfb78cb5236d71ece2cfdf3f1030b;12345678900163e620858c831b4f1c2d855d89be8b;12345678905d64a267173a87de9ded1f8d6900751d;12345678902f5a03450db72fdebfefa517bd85a308;1234567890f5e783c0525a57fb3175fa2644f4f97d;1234567890db48610ed249a8510105eebdf0d2c2c0;1234567890ec5a698eb83bf89c5955192d3fb01a49;1234567890bd39b31a09301108db719bb288ed75dc;1234567890fd40f92589145a8d5b7f1d97b9eb726b;12345678902f617c1a6244ea615daff4370189b6ea;1234567890c6bd5773ed5ec68cca470cfc0fd0c2f6;1234567890a3fd5563a534db6bd56fe5a653d41002;12345678902cbb0a4af6f00f3632349e2b5bb3b3b7;12345678907de5d53b2461724f69afc4319c6d4e31;1234567890b14e5fd3c9192095aba7485e231474cb;1234567890372e011fea8e5b1601810d89ad243054;12345678902480c3384d0af26af5b9205ce316a217;1234567890d3cfbd267236ce218d8652b94151629c;12345678907d4bae43759d70b1b5ba2670472bf47a;123456789055524432efe39930365bf067abb78c52;1234567890166ffce7aec4ae222b4f2274629a42d3;12345678907a0704de2bc3c619fd960a85e515c4d2;1234567890d4dbb7815dfa6c3747301d4753963325;12345678903bb8c6a58c6ee011bac8d3efebed94a9;1234567890fd098a639044c60a91450180d2097568;123456789056083f65b5a307b331b169362ac01f2d;12345678903e77336da9a9b14b1b77b2fd2d7def75;1234567890b35492bf179f82434d3363de97914dcc;12345678906170b3488cb62c5f7007cba059fb3c47;123456789070cfc2027d6b1d1560e8af83049485e5;12345678901ab8f713f13dcd1caee23fdee416ef9b;1234567890d238b7701a73f7e6c769cee5ea1e8c78;12345678906a3337ec7ad3560936e9b015fc5e0617;1234567890fe1fff044834b0339b6953dcf4b99721;12345678906d35d3afc135ee4abf449635f1f2f068;1234567890682fce033542f16f2b3c0b72ed1cfe4c;1234567890a88b9787034ff43a54c28f7f09a210ff;123456789097108a65765b6d8a9dbbcfb3adc8d08f;12345678904bcef9ec5cd3eac34c786b175f57352f;1234567890cd5aecb5758dc3b33bf4bc5195345e02;12345678900f82eb5270386ddcf312b13e271b4452;1234567890de97b43fb6efefba7dee0dd05b264676;12345678902c162a9a7404d864eaf95c157d555e50;1234567890aa204c1ad2b0bd50b4c04ffb8ef9a8b4;1234567890d369387ebc1115b40f03ac53d499b7a7;12345678900c50ef044d834a22d4f6f71696b13a7a;1234567890989bb41fbec11fee02f377d3072d7540;1234567890f78c74a459b3f8e91cbb2757638c990c;1234567890df1c3180d5cf5b23ae481dc3c51f9e70;12345678908a154d8e725cc1d55a3885dea61cdcef;123456789040f6cb54e5d87043d5782a897d41e7d0;1234567890a5625ca5d0ffb32f27f81c76e88bdb6d;123456789000a668ec16b3b6cb021a5d766d682616;12345678903be13de185f467918ac641714da5b227;12345678903e23e24e01d3ed272800e56e291a76c8;12345678903feab114b879d200ec36e064b9d5c980;12345678904b9d36b49c6be80fd02519d8f787d411;1234567890ebeba878705aaff7acaf019df967f0d1;1234567890a8d732d47129f07f5cbc82dd5f084fa1;1234567890492d93143581c0f22f08daa4e0249dfb;12345678908d8cf07ffbe59e689b84bf3eba0231c5;12345678906e5fb60d53f1774088c84582d9d398b3;1234567890b5d98e0785c3c4764457db2e533a38c2;12345678909bb62a8dbb6717ae560ca51bd142c96d;123456789097f7fd007f1359ccc539eb6c2f6bedc6;1234567890d1a71762d2953bb4aa89bed2f953c37c;12345678901b253c93e5ad833a0a6e609e1c15d1a3;1234567890871433906bfc930ad105948a43c854c4;123456789027861737c46ea88e1933f1ae929e5ece;12345678903404240245e5b31993c79dd2e318f6ed;12345678907e12ffebda1386c9602c9c5de2b764ee;1234567890dd67fec8b6348a33749b57bd3be23c05;12345678901cad51355cc411530a3fd8f5de2b6206;1234567890176cb2a0a87cc12552c40a7e99ab596f;1234567890c342dc7db5259ee33562435a1a74bc2d;1234567890f01c397211471458866ea43d4adc358e;12345678907a02333cd7824665a616c88901f7a85b;1234567890ab386079e10e81dfdc924a7d0d88fcd6;1234567890a319b91defdde8d4fa9ecef5e3f100f4;1234567890678d8575261c831475662a8bc6725aad;123456789010cad4af069004d50d3accf1acb092c0;123456789084f80330e67473f5a92269b86a7d6b6c;1234567890ba4e9d5ce1de2e3a98c28aff648c2708;1234567890b35124eeb1846d97bfe367814a1ae352;1234567890c2b25d1e76cc6e55871dce9692c9843f;1234567890797503c2993eec10c88913606668c9b1;123456789096f24f76ae4ce0909ef0f52b64119dcc;1234567890cfa69d22360328dc7b8c2409caff6926;1234567890021bc9be223fb7f5218baefce8f75846;1234567890dcaf36d1de34a1d43c3f61deedd83d88;12345678903bceb8100d9a1c5f2a27b385820fa327;1234567890102d25ecd5e7d8dc1bd85c0db60a3248;12345678909bee021a9199f9d605e9d099b2106faf;12345678903bc568db4eed321066f2c6a41c7870c0;1234567890788eeaa62c64d37327c03a4e0697ed21;123456789049bfb8e49a3afd413ed2326186fd5f1a;1234567890b00bcd507d37c82ad19cca8bb92f12e9;1234567890ef7495278b239550bd742fe18975d0f6;1234567890f06c93d2a82eb56c30d7fdce007f43ae;1234567890cebbd495ec7ad94b4d39678187611f66;12345678909cd708b4abe794f1e3fc9b12ac026dab;12345678905130b0fac916dbb7d37ca001e016f81b;12345678901782caaf1f72aef8765a341c8432e4d4;12345678906b6678f7407b63799a228bd17e4c4f36;1234567890d0061099ed4e1afdf01d8a421bc28ee5;123456789026d83368f9352573afdb3ced82808068;1234567890ebefa13de298948894ee1aa78c45c2c2;1234567890580587cc923c03bcdc2c4061e65a3e38;1234567890b1dd00783ffe98a2d35938c4edd8400e;1234567890c08665b0e2563f834a9fdda22eb071aa;12345678909532c12e7236da8b40566f692824887b;1234567890fe88b668a7d6691569a72eef0476fc9e;1234567890a022e2381664127e708ec5822367fd6d;1234567890da1154593772aab775b9c5c68c329f8b;1234567890206e8b673a3fb4112cb792d1fef5c77b;123456789038a6ec3a79b77ea28264a318d6876096;1234567890308c732438138c69b3f064f82ff1ecc4;123456789069680a15ca67278f4f7e3678ce8fe166;1234567890e6e0cf5bd4d231a1fa5cf49d2f22cdc7;1234567890540948b74103dd81eccbc3fdc34c94cb;12345678909ad8ad14b8d5176bb49b67bdcf497c4f;12345678900d6a20fd35ce2dce3c6aab15c2bcad3b;1234567890e68197771b3fe56f9d1679ccd9fc3af0;12345678900ed7f616a9b7fd04d9cc8c9bcfbaa39d;1234567890804a7902d387fc99c59ba0f340e09401;123456789084f4ecc3fa99a3d6779ed30a6fb3fa11;1234567890f58753b9f23fbd4d190c54aaa3a51c6d;1234567890e7c20e943fdbc06be3f91dc600f0b586;123456789068d89d81f652f2c7421140551776beff;123456789022999b321d7f9ff9d6f5fa36c52700e1;12345678909464e4cd68df56dd5f9aec17a879fe3c;12345678904a23a8a143f6c948489c4ba174a5c534;12345678909c98c44a2d7d946bb587d5ce7157c629;12345678903c0d9dd29ecb6ff9f1333a23e5c6c7fd;123456789099ba3e3052b9cf137c83d2b891b226d5;12345678904c746d95513db58916b5d5cfef96dbb2;123456789076388dfe9d53e7923f4385c04d8723c7;123456789098b1ffb1ab9f716352c001c3b3682a0a;1234567890bd1390959eacd871a5fc42913b89402d;12345678907b9c6209a7b3409000c93a995973f328;123456789021580f4db98fbf9bfbe27ac236ea295a;123456789012ab39cfd23f2d186dde931058fac568;123456789012f1e6f24b8038332f89cee71d196323;12345678901280c52ca517c6587c70a7cca7cf942c;1234567890fb2b1815c3d64280975c0fcce76fb69e;12345678905118e28e8eb44ddce9492fb6a6e83250;1234567890438db72e399e9c314c7b09bcb6fc9df8;1234567890bd253ac61dccb681d821faddf1d25ed8;1234567890a31be2736ebde1c856d5106ad071e808;123456789092491e41eb14dfb5a6b82538e7f1ecd0;1234567890aab5b991aa3cec9c35536d4de19a70bd;1234567890fa7774ffab1877fac089bc53adff0246;1234567890b4dc8b507f1aebc0399364f2ed5981b1;123456789042ba4ef10b03152d9c4c6c1e221d5b79;1234567890fd81fcddcf1647b041ce9cc177a67fcd;1234567890cddca91fd802af8e8533842c844ba630;12345678906f2a7d67e3565d9ea0ecacdc678db19a;12345678900b807cc7afb3512acc0f737ae11d650c;1234567890a235fc16fb29c4e73d627fe6846d77d1;123456789004232c7be640c4f1b9bd3e05fba5cc8d;1234567890d47c617f7e5d6aa346cd77a9ef7f2cec;1234567890a626830d7f7629d0348f8196b03a3310;1234567890a6139949e75661b01a09b6dc0ecd1706;1234567890a38c7ad49bc3ea33d729fab33e755823;1234567890b2a5c47badf5f664c370f66794e24d12;1234567890920a160e6226d107424612fe0cf70eaf;1234567890b29b11ac7abee82e932216e0511f5b50;12345678901a4302cb1cfc192faef081ec9506c741;12345678901ad1627d39ccfb30a15f06ce86e12431;12345678904d07a1777f23dde46a9153d27ad546c6;1234567890154e4733afd7129d8ea9180f02d34e73;1234567890cc461d810b495cc904dd99b2d7e3fb39;1234567890d92fc3dad8607e99dfa368447c91d662;1234567890a271dbfdcb29f2ede0b71993076f24c3;123456789001fdf8af1428ba6960890d54f1f29237;1234567890d3647a354e406d221bdac0746f64c674;1234567890473c28d5493c3baed5e228bf4cc4570a;1234567890688944f8acffdca6c9c1e821465394dc;1234567890b5c642cb82a858ad8083c983c20caefb;123456789031c9ee66af2eaab87623f0a15313d2f9;12345678905e10deaa8a282c9c2c5bce8f9fa21481;12345678906811db7cd71ef5d8ed2c14f4faa8df92;12345678906bd8ec117d9b9c5111549ca9425f447f;12345678900e2b10e8cbe7b3129119e1ef12a23a19;1234567890aa54da1f9ae37f8d8d1043de8aa124d6;123456789023d9826a33a3a0a756f9237666c6d54f;123456789064bd6ef4520744c157bd6111bddf91ff;12345678907ca9c7fe0277cd5d4bd07d14d6709276;1234567890ca870322fee9192561475ab414f083c6;123456789007bf825e54f5d840998646761b3cab36;123456789064c2390126f562989035459da3da611e;123456789041fb600f7ed183f97a7544ae1736c2a4;12345678909392fa21ca3789a7db1a81ba31329274;1234567890139306d6407b0feb82a4c56805dece50;1234567890655643eeb7d755c5d10970434ff82e7b;12345678909c6090b6c92edb0495980d7e2ac4a194;12345678909e108dc3b3724ea5e98553ca78920741;12345678908c168264717a55b4c4a359b159bb51f1;1234567890b13f6f21a82e1c4f500c61eba9b09372;1234567890e1784c3db6882dcd7135a291c74d69aa;12345678908fa79ed59efef33174a65cbb590fc45d;1234567890dfc3b4da63cf96a47852010087c7fe01;123456789041afc458c6c6259dd309afe1bbd9c903;1234567890af1192ee4b41b85bda11e23b4fc9f76f;1234567890f4d5c852b9cd04e4eae5d2cce74aa35a;1234567890da0b2496c1b4f242aa930ae004c74973;12345678906a2e207a589db7114ea838469666760c;1234567890baef3f7d6fa041bd1424bf7ffdb2b7aa;12345678903ec1aeee04d677cd85ce735d95904c9f;1234567890fe782289b63aa676a153c8e1e0ff5f7a;123456789085c9ab4933bd1f5cba9e4cf6f20d55b9;12345678907b3ce0d4263201dc80064b475af1b387;1234567890a3e84c117172828ffdaebb0702e4dc4a;1234567890ba14869446ee37c2b7cf6d03edbb5bff;1234567890ea428b2e8a28a6a24965a69f5957bbd5;1234567890dc94bd5c97cf9a8b0eaa0fcea578bf25;1234567890ea200650b034c5edae295e8e84d225b3;123456789038977a74da1e5bff39dc04bc69e673dd;1234567890a78609b9f533185edafac1c294eab406;12345678908268a804f70b5ddbfe2b34242ff18cc1;1234567890bd718225a365ba4e95d1d1e70dcbbca1;1234567890a016c256baeb0133b427f34fbde1feaf;12345678900e70fe0f3955c9cfa936ef95708f122c;12345678907ddd078a386819b63ab07dbdd9c91575;1234567890647b05af68f232f0cf5442c6791b45ce;12345678908e3d849efaf9922cc8e8f2b64cd5d376;123456789084ccee96c3cbb686237dbcc8951a27ae;1234567890c87a2946a0c674762e4d1ceca9376cd2;123456789058e4d705b14e9b4990bc6e72396491a7;12345678906a8f6522611f5baf99880a5464977f2b;12345678900f926480ff8175f629318825275fa392;12345678900a7df8209b0ba60a1ca789253f7f2cd5;1234567890b177b248d45b40c8b44f0a03d1b23763;1234567890f1a8a087ae806969733a28bb066ebf8d;12345678900e32bd774d58e50df66bbe4850dc3432;1234567890b8c27bcf3330fae0f22e50c96bbca8ef;1234567890a8d37e53b4c8186da0ab38f3ed1d8226;12345678907ea56c8255d39879283800ffc54105c8;1234567890def4f0e223f77ce98135e56df83f906e;12345678904c0966de503c2b9c3aaaba39e33054e5;12345678900a058b63e59c7762dd708818ca11c9a1;1234567890098ec503c84da314aa7294789a1c014f;12345678903b73345d65681bbbbd2c37af9b9dde0b;12345678906ed195f163e124b03ae735440ebace13;12345678901e10a76b6d35a9208052d01cf771fc2a;1234567890364aa20369169d0f167512d7e92a5b9b;1234567890f1e27f8fa08549c931e0a8f8caac4fea;1234567890fe0108ae2311154b51080c66648c0931;12345678909f126b398a9982dd1452a822ad0fa525;1234567890447c973433cbc893e495a512f9ce1fa4;1234567890ceae2d92d7510d0f52dd4142e081d591;123456789086e5f7bf6538227a9a4fdd7c97af80f1;12345678909b77fb9766e3bad470933c09155ea421;1234567890e161fd76bc073b2f8f5874a7cb74c837;123456789033fb4d67efda93c02d9088630b6e59f1;12345678901872a3e4c0f4c2fecdf174f7e9fef31d;12345678906137f94019bc666e126fcf57c171d57d;12345678908174b5ec7b07ce7acbc6357b78a3c354;123456789035cf9986386b3e7c0c1a00929c482ff2;12345678903cd8c253cd5b7598ef85476746062cca;12345678900b2eabeaceb056b453d7a4d4d853257a;1234567890174b4ef28c92480dca82114551399ba4;1234567890b73cc2de3e68d436587343dcd4551070;12345678904a084a649fb9f4e6a048f3c90d3f0005;1234567890d8922b833c364c8c63990cc3235c83f9;12345678908ba094bf156e387c2df788bf61bcd628;1234567890e01c283d1922497766639617f6367433;12345678900bd057e31c963c54c80bf770f2c56b22;12345678902545081ae37ff255d40884cc2cc52820;1234567890c618bf23d9aa081dd4f7e1e574c65a19;1234567890f6728cc0dd8c68b98acaa33a474bdcd9;12345678908f43eb3b55f2031a97da9404b1c90cf1;12345678901cd9388bdb8bff607ad8f6304b2086fb;1234567890715e29ce0cff8ecd6737a758d2874719;1234567890ff3fffb95de9dd753eb607df6d9a350f;1234567890ed8a79bcfd7345d7be6890c5a7f14c8c;123456789040f46d35b2343bc6be4c71408ee38482;1234567890db50bc512f7465282d523e662a8a8e78;123456789028f97f34ce77558972224da915ea77ec;123456789016be22c7260bfbd4d59f974db421ef86;12345678906528fa2d45c5ed7653eb5bb866e206a1;1234567890c7043aeeb3308a70b837bccc070a3844;123456789084a9231757ec36b574b3ed06b66f0b50;12345678909f20b5fff144bd6df94603fd02b0cfa3;12345678901cc4d71b4c38f4545fe0c2589d5aafe6;1234567890402aca6c67457b39476fbb3f308fe769;1234567890af1a41bb5bf2a5508b818d7373f0acdc;1234567890db62b990dcdf12d499d0cc1a9362dd0f;1234567890cd405ecef66d724b682e6c2565b3c51c;1234567890af11de71832b6b879ca73d537d1eb1d8;12345678907c4ca2247e1bd1bccf76c2a8ce209a9c;12345678902fc3dba643b8565cbf6aeb35d2a63985;1234567890735c6cc917add3e8cf2911c2e7e502cd;1234567890feb537c16d4404ffe632ee384ecfc074;1234567890e4826747e6afc6681bf92bd2bef80f96;1234567890dd22bb85717f3f77150b3f01357c0ef4;12345678900e01de9c9bd61126b3fee5395d4433a9;12345678901b4cce59e5d11ca2cea7febd360db57b;1234567890a82f9080a406ccb062c622e42bc78831;12345678903c551b5e5f842225fd32ba8d93174061;1234567890a5f80dc079ec991561c4dc06d1341a8f;1234567890991f16b74afade943e0575e19db1461f;12345678900d94d0c9459eff02bb5bb00afe83f419;1234567890911d18744c15b5917b7f6ab0bf1ee012;1234567890f7ed12de2f258ce15f14e06c62913f49;12345678908f994da4f3e60412c44dcfadd8d98489;1234567890f310bb0970fee7778ecb14eeb441f1e6;1234567890bdb0dac0f808b38ee7eaaa324a0a96db;123456789065ae416295bdb639d45f536fadfdc8fd;123456789010cab7a3e466e6f549e4958982200e3d;1234567890ae0b4cc7d742d94dd976b49d31d56b97;12345678905a8e3af2ef67d4fb3ebafb50950d6dfa;12345678906051d0090b3be21e43c5661473af32d4;12345678906cfc71e66c6e6f8c37836c417672dfdb;12345678906f60ec89dbbe40906c14a226f1371438;12345678908b83ebc0312e492502e384dd35580114;1234567890d735f7a1c3ea84be624530e30f690ee5;123456789022dc00f8a766a5cbeb85ff3cbfcb4ae8;1234567890799ee745757c69523dedca26d18a0015;123456789016d3d923fd68d6c6419de5abf3cd8b03;1234567890203c397d6a7dd72d2e64524fd95e12bf;1234567890871a86583f04c9b98b02b0abba4a9942;12345678909b21018fb283b5c25549a26268048f02;1234567890bf5efc5b51faeb7257976fe64ce1d374;12345678903c6329087e514a6ba56b9d286cb7b35a;1234567890bc8de298d6597bac1c7c6e5b610ff388;1234567890adb52c82de910a0def607d715aa49b13;12345678902b3e186dd8302e165bdc486625d5a9ef;1234567890284bcd458e2170aff71bc5f2f9542c18;1234567890c64e79f068bddc951e045a62d0eb4fda;123456789051051a02ddb7798196d9f442cc5fc822;12345678908bd9a16188ee65c0d159e3967eaecc85;12345678907d4ee96621eb7225afb4c8a1a84357c5;1234567890e229ac31b134203734e0f4590daad334;12345678907192b0b1865eed106a6b9ac01279edaa;12345678902ff3e747c039f4c4924a2c79e9a2a55a;123456789077a16c0d5f562c19561de673ec589eaf;1234567890c12b904b3340c1d8ea8680569dab8a82;12345678907ceba6e375529a552d382db1d7f7bc4b;1234567890776efa7f54088f23bddff2b9ad8695bf;1234567890dcd4181c9506ace6f5cff2e15beec447;1234567890bd62439024924fa12fcc81bc5450049c;12345678902663d6a6d24eda51fac6c3e26a581c6b;1234567890084d8e43704ab471ba3fa41551fc7032;1234567890666e4b1e8f8fd5a37c12cc718dfc7849;123456789012c0c3e8d4c63a0ee4d69efb420c6327;12345678902a09947130a86f2e651d775073637b64;123456789022244ede2c86af27bc2e9d26fc6e03d6;1234567890647ccfcfee4920e0563bffbd9f87512c;1234567890d3f46a8d333a31f9b4a95c3eb50703f6;1234567890590917b2375ae1522ce55644517c65ea;1234567890d9b5c607adce18efaca6e1c08c461eab;1234567890ad213a84434c9c6b73e71f7608a8d6dc;1234567890a5ba0cca6726e2770b12c6cd83985031;1234567890486d08042c30b3c8c1d2a4102bb0972f;1234567890caa449504cf075545d8b6dc43a84e755;1234567890f6621bee8904445cea201081cde0de56;123456789034cb4e7ab5e36486a195b6127eac972c;1234567890139821affbe89308b55b2b1067943737;1234567890d3e2ff114450ee1cc874390baf4a966e;1234567890bbed81cd66c6317340652ba99f843a3d;123456789039daed1c5d91bafe95567d54c10c0c46;12345678903db77dffa7c5bd514f5cf58a1c36e901;123456789018099f6c2e90c7ae2e7da4ac9128323a;123456789091160df0a61bc15619f3607a12ad663d;1234567890c81409b7fc633408168854ed465199d4;1234567890156832717cf5bbcf80e4806bab7b1f71;123456789023c7738d0861db06d168338d44f88b21;1234567890b75d5386e692006bfbc7c106871d303d;123456789048400538226ae8ac0575289e32cd745d;123456789078a43a52ff2f7eedd5b29831dd1d8b1f;1234567890888751ba29b0347afa3682b157702cc9;123456789012d5de39a0a83f1dc02a03b303ed12be;1234567890c0310863de21d9ab81775f0971e1e966;123456789040add770f86901e688615f42dd7a40ad;123456789022b18a0ad66f15a64c28f42a02cec94a;1234567890957c0417d96f1c42853cf11e0582639b;12345678909a2a77d9065d8598e3246b776cc17c31;1234567890a0398e3b7c587484c35548788f130102;1234567890b332eea084feb370e055fd0a2ca27106;123456789003315a896ff08353a9927ac280f9dcc6;123456789067e14bf562a29239e6114eee7998c6fd;12345678907472423574ab146e52fa99ff5677b00d;12345678901e249f504d3acf8e404d5de0d72e4d85;1234567890f3ad0ddcc792ff2825d76f630df422a7;1234567890fc92fb6b4854ac839779a2acf26a3a1f;1234567890a52fb3e4ff4e9c0dd5d3e49870b82f9b;1234567890e932af8eff77fb2b5fdedb14c25fd339;1234567890a6a70b6d1a569ac28a5a4648c5ef1a94;123456789064cb01de015b60ae737e6bc4fe1e9679;1234567890fd2dc135f6d7f25631cb9eeb5440129e;1234567890407df0a695c6ac3e319e096d6a702a91;12345678903a2da2fbb3ca1e161483f1601f97ee5f;12345678900cf4aa5bec1540540d8b98fc87f36c4f;1234567890c118e644a28edb4611f081a6ed703cb0;12345678909928619d90c1e8e9373ccb268184b761;12345678907ee0ebb4d7b3ef5de28abc7783064eb8;1234567890c39000905e8afcd621c4f88727228fe5;1234567890a4a4c972e7f639534ab1c34826c5c3e7;123456789036e8b897844ffe84980a503ff202f2f2;12345678900783902b85a02ce88ad54f7db08be1d0;1234567890e36fada193d3809b459cee33494b2880;1234567890e36fada193d3809b459cee33494b2880;1234567890260bbc705731e095d3374feb9fc2d71f;1234567890f68b86ec00ecf69bceb37ddf34a4b55f;12345678904a90175d73a4e42473a7f9bde350f995;123456789096ec3d165a9fe2ecdfa38a591a95bd32;12345678904cf38b08795e4a2c851e885a5384b592;1234567890f06c4fa6d7cd16c7f48d67359178d660;1234567890965ce82fb8b3d954ceda17f66bfa42da;12345678906e210b4007a68540c7ae1442c12d7080;1234567890466dbc862a0f3237059429e0a0750412;12345678904465dc2e0a63e6983c4bef0b0fbc3264;12345678903ce117dbba40a73dc0683320e91f1602;1234567890d5a44c08a0dfafb7b0116ab39cc3f861;1234567890908d87aeb27790e316971675df8dd110;1234567890b96bfe71585bf1aef9b09b67e797dd3f;1234567890a69e6f667ac2cc735265fe9720451dff;12345678900ba68238aea7151fe26c345c2c7908d4;12345678909c4e0839e6a1f22949ede8e50bacc945;12345678903838d77ca760c6f95ce0dcccb7fe0ee0;123456789088957b9ad06bbe784a8362f116772588;1234567890093699f78dfcdb0b7edf666f32653189;1234567890ed0590b0c54069b34b0efe80b625b327;1234567890a9ac416bfd033a86c808bc77d220703e;1234567890ec952240372abb4b0263db638ad35e52;12345678906826c885fabf5b2670c36a6b4169fc41;12345678901e5ec5e9e1b50099ac96b3ddf89cf5a1;1234567890c5b38b899af4b58c8ed036a105ad8cf1;123456789019d18b25dbc732d0869743ee513a8ba7;1234567890c608a7718bca7aceb781f5c0d01a5186;12345678900a6d0ba93166e364ae6ce21fbf7b06af;12345678907da849f4d8e61284055e9c4c938e9bb5;12345678901cfe88229dad7f168e09dfbdd2b6718d;1234567890ea1907ed370345670b476dced75ea638;123456789008d0feb066e2299222ac5022e9434032;12345678908fa7430fb2511c0216e2ae21bfd7c384;1234567890a3c247d0ecb158f42be289ca925e66d0;1234567890bf655d16ff2c089744d768adbeeb9660;12345678905d18760f2f4a0e787c026a589e278663;123456789086407350b7499768dec1355feaab9cc2;123456789018aaeeaa5bc7d1edb752a0a84d57ba01;12345678900a0204fc2cafa38acc420ac3c5bbf991;12345678905a4edc23ef0a9aba3772b8c752e1f0cc;1234567890f58b3654c4b4c29b03a051de04bb9157;1234567890ddb87c8dd9d7b8e72784de349fde60b4;123456789064606af1c6c21cb7400eb6f475892a42;123456789087f772500748089934cb96e8bfbaca27;1234567890e58fa45239db3395c4ea121175b9d938;12345678902a8e167b78a7bc5ab68db219f35aad15;1234567890eef780b6d00ec47b4ade608fc2a3a58f;12345678902353ee87fcfccb8513a255692dda9d4a;1234567890acf59ec4c7c7d321a31810a8ad48bc31;12345678906e0068ea74e983e17bce6cd56785b717;1234567890d86ce8957bbaa388251e1220a51257aa;1234567890661aa87ea7c60515869a74ef8b8f5ed8;12345678901e46da643e7ff438bb6222538d0e7727;1234567890f8d70436fe2a2b968dfd821d2a7cd199;12345678908b5261943ee99619128cb5129b5e393f;123456789050b9bf42e80ef536ddee9f22672a8d10;12345678904e544833c808de5a98581dfc0b3b11c3;1234567890ffc9a3ee134a6514d4042bb48dc63227;1234567890532e5357078a7c2e4b130a4bb8c7b7ed;12345678903688b4394c91e9720b341cca68cfebec;123456789080c0db6dd414335446fc8b9d079f1708;1234567890de843215760b6e5f5ab847d0fec41dd6;123456789047ebfca5bfffd86928342ab28282f9ba;12345678906e1e469efdf92c6dcb0765be25230f7a;1234567890e58260181f79cf860499c1b95fba2846;12345678907d7d067862f738d4fa4f9f74bb8b97a8;12345678906ca492c21f3a9d2981610a3cbb00af7c;1234567890c4790e499d8b71da08eaca00081b7c9f;12345678908a1018a98a5427014aafaffa604b9837;123456789065eb7f8779a5ec50fdb7e0dba5dc6604;123456789062787431942b4294ff112ea761613213;12345678907228bb76090bd4086456cc3df3de7eef;1234567890752e72ddd72594f2926bfa06d605e9b3;123456789096e07c8da8de6b847d64eba8b46be4cf;123456789075adcbb396709224fb4cc141c71cf294;1234567890dd62caeee1a05f5a997aa64fab3dda8c;1234567890f92923a9d6596d541d410e684339bbf6;123456789088e4ba1206fdaad0c50e07b22a59b94d;12345678900501b5779250d129fa4c5c0b7192d164;1234567890ade7f53d5d31b95af1ff761c67fcadb4;1234567890155168e364454e154034cc7a9d3b544c;12345678903b0e6fea84d10695d12a06f018dfa8b3;1234567890ad7571a6a682ba14261a5679afe08ba9;12345678900d8b64b592ba5d6ceff67b911d8c0e9e;12345678909f8dd2d898798f2f793d0ef72f37f4b1;12345678908ce8b7122b3db9f2771ba643bc21c56e;1234567890227460e850c4ba25455d1c1245f760e0;1234567890b06f514df6ca268014300e447dcecd6d;1234567890a421db78eadde42417243677e5eb15d3;12345678906703a13120c1bc12b3fe8d550ddb91b5;12345678901a0ae14747b5ccc2f58fc42a0402f661;12345678909e6c2cc9e0ec6714046937dcd95b00cf;123456789047daac71f5ac7d9e52b4e3c711d16238;12345678902bed758e1e1cda6caa056da6c2c855ad;1234567890c7dbbf7ad0c366de3a418a5c12dffa89;12345678903cc82671e3f59e2f40ff46e0445a42f0;1234567890335ade1e529159e650b1ff06767a48fd;1234567890346da81b65b47f980970369e5eaa16cc;1234567890b00be593ecc1fc9487048d664e9e9ac0;1234567890e9d4786507b7a0e0ea96bb3d3e9f8d20;1234567890e0bf37f42ffb724a0d0faffcd7182ae9;1234567890cda2b4001ec320dea1aae5692d1d6cbf;1234567890164de5f8ef5727f45f13873d8c433b8b;1234567890d552288302207d6ed18212e130c6fcc2;1234567890a610d4036a7522c5bdc997541a77a102;12345678902b5687845ab7c1b2087d6fd5f24adf02;1234567890822564806483ff7ffa880e1bcc9c1dce;1234567890bbd808b90c8e34add01f3a65a297dada;1234567890e0ab108ff263b4414b090bc0a7ba9664;1234567890dd112fd3e0998bdad7ba6f601a810a31;123456789039cade23168561e2cfa33bad0d906d5e;12345678900cceb1bff92a0a5e1c1566aa8e61462d;1234567890e527260737f86dcce7b0facbef0648e6;12345678909bda254578cc2566fc9ec2bb5c4f98ef;1234567890e63bb309305d920271ef7b550f9d0f64;1234567890dfba87746d1f91af0cd43c0964981c8a;123456789085498174acd8fc17d28c4986e353832f;1234567890a1d2cb3e9d9783c517136ddf01643212;12345678909687331ded51188e96b05b2a572e14b4;123456789091e9daa2507aad579f8a02a6771bdaf3;123456789017945e6f45cd40a1448a7060ccbb45ea;1234567890cc15dfb9e6360cd72ef9e7a4783c5a33;12345678903b06d780d3e6af5cae2d42a84ff733d6;123456789078242673948c20bc1a0c73de3efc9df1;12345678904960c1a63f2b674b0dee5c6ee94c853f;12345678904bd957a72ec6b5f51fd8c8d2f4009b63;12345678907f6c28423f22290efe2a9456201a759f;12345678905b6a986b12e3db3db11812f3241dc2b7;1234567890a5f8d0601946c01ddcc4b5af7b3cd295;123456789098b81d70dc6d5fc724cb24517a37e47e;1234567890d7ba07d42344e25736c88b1bfb3c60d1;12345678900bd7bfe02a3d30588ae6c92124f34f41;12345678906cc06a1cdf80c23dceef92c179f64842;1234567890fe48d84ae39bb70075ae730c6141acba;1234567890cf54bf362e152f35a1a7d036a8a95426;12345678908ec9cbb163f30605868fe03b4dc8fbb7;12345678902654d763346c7deba274f44835172aa1;1234567890d3de5773f5480fd75372a339504e3077;123456789029a53023487af58f6d2f443b213c2a82;1234567890618f0791425e3d65f850308250fe66e1;1234567890685890da49e14d2a9626a6b9071c52f1;12345678906d2e8e0ca938a9774c9a900f9aaf12ee;1234567890762d49c65ed509ebcad7c5b976fedb07;1234567890cd1f28739f096d4fff37b51853545ce3;12345678905cfee49d38c4fcf8d02f07d0b5c31c3e;123456789024ead98c49994e65d1c6ba3aa106dc54;12345678902fa4dfdbf013c708ecf4a3f876d62e59;123456789019fd65908678ad618e8f2cb22b157e0f;12345678909d2fb0f185320437061660e701cd7470;1234567890f99303ff4589c7ce5b3751bdc84a87d0;1234567890a8e54b90e66045dde50d16a015149e49;12345678906eec34d0a4e985cff0964a15faa17edb;123456789018c6a39ffac0b03c5d7f779d15d00577;1234567890dc6c29ea4c15a600e8f00d4a264300b4;12345678909c0589ba21c17cab4155b7f55d6808b8;1234567890862c21d7371b621d52a29e48a55d9876;123456789083823acdae803f65cb992c9126daa77c;12345678902f4cbc9922ec41555e52fd6f34f67197;1234567890c4e83be8025bdf9f9df9344d0b567a67;123456789017a5cc1139f4c0f794209cae4ecd7245;12345678901b54370f5326a87d12ed2459cfd16b4d;1234567890933e410d5edef70470a2667ffc278321;1234567890af1cad817ee0557ddc5a00c8b803f550;12345678909c03b1d044550431f23bc713499755d8;12345678906cd4fb40ee544c3629ca567755220a66;1234567890a0721645a919f3886537c7166d7407fa;12345678907ae45bed81cec17ea96d9d490e257764;1234567890c65d169d3c811f50925e4dc188dd222a;12345678905b8604b220152b3b590e6b7540b4b5fc;12345678900e912c348905a24e446d0ec2e3fe7b4b;12345678905834809ef79f2a316a8a560f9273428f;1234567890a908ca0e7fee0e7da5c8f50ac2897ec7;1234567890430dee5e5ec4861bed8f22fe0bedc270;12345678902fe0121a1dc02f343d7b16370eda039a;123456789086c8e41eec9e8a97ef8602dff0042f4a;1234567890ed04d95e25c7443e65af251f22d3297b;12345678907a83bc1de0409eae0a38b369c61ca29a;123456789054f960ede50474b32340870f252c592a;12345678907c48573efca785a63bd7c11ddaba7f20;1234567890c601457735a7ab2f4fb99c3e758c6fff;12345678908ddb1cd5a4a73d06cf6eade01d553393;123456789099a267964e5f58805bbdb790cbd745ce;12345678909fa791009eb0dab931dda0161b801903;12345678905205c8a072d947c1346c49ea528e34e9;1234567890534359a238549b62ab1b586f83065dcd;1234567890805041dfef0993d559332e8375915ede;1234567890d3e3f5aec7590aeaf481c6bc278c3115;1234567890d1262bd2a1c349202748eed6d0732be2;12345678909dfb8ef0f695e72afb01e166d55527eb;12345678900b2f346beda845e62b7f486230b0154f;1234567890de5c634c15657572c685cea556027709;1234567890b24eb3cf057371852ca7b5da95d448a4;1234567890d0971bada5ae34bf9aeb3f61ffb49b9d;1234567890765a51c969779229b09574d22f81f794;12345678902a93db1e4b8218d78ee9c94011ddb2f7;12345678906a35176b78ba674dd23dcc42a28191ad;1234567890886c0b60f22394eb233422b183f5b191;1234567890c68bbe18e4657dc499c30c2031909d27;1234567890a98c37816ed251cbc7cdf51e808f0503;12345678909005ab2260ff3acc70b3f35d66e0b37a;1234567890ee0aaf83398b5d85ab2ba06c90d3862a;12345678902a8d897ceb6dd01c2674cd77504281cb;1234567890bc18525c48a7b9a88f2dcc2fb332a0e8;1234567890977c0b298a7b4b659d3d56dc33b26b44;12345678908c5d68cfb76292bb00202e2e359ec258;123456789015ae09ae800fad1090e132a610726292;123456789015df114cc34dc640f593256efd4bf5e4;12345678904f8f9e62e0d61f1f5b9b4c309ab81d00;12345678900d48fe740ae49a22063564910cc91384;12345678903f808899e9827ea05fcba067d2cdfa87;1234567890d7667dff341417bf707c305ec30af45a;1234567890be204ead33d06b26ef998dceb3e397cd;12345678909db9b35e7edb27ba0bebfc093a3c84c3;1234567890ad69486f5781ff2e1e7bfd359258a5d2;123456789095609d9d759c9e1110b0174df4b50da1;12345678902afbe4828f0af97b008a6a95145042cc;123456789023d1e90fecc14bc1427e45a34dfcda42;12345678908b4f5e23ff8e3b69a3c677c69c8b09c0;1234567890c608438cd528e016dfaa3d41730d7277;123456789004df4c234815613ae903e6e2e3056e48;1234567890fef59a4b4cb32911ad35048b97daa48c;1234567890513a5d3933ed26ce0fc6ef2c8cd4283b;1234567890f0876992eae3e039dc530e5ea0495817;1234567890d61b4e94f1346d40b57b7b7d9adda716;1234567890cfafb3c4bf3e61fa6119e01ca864d4a2;12345678908732525784e1a563589b9f411f7ad725;12345678903f1567387636c5e3f83f0a3395658f9f;1234567890175959721b452b43a0d444fc44a2d1ba;1234567890bc4db880f717e8c7d4c002d9831fdf74;1234567890e553e4cd253dae172641fe3b4a5a5ed5;123456789060cdb2ae8015feda181e529f52e5e568;1234567890aebfda7b257e7c7a4c2e57485def2a09;1234567890f7ea427f4b91ca2db53308ecec8695ca;12345678905deffce3fd2740bc3ac180c99b1531b8;12345678904dca10f12a5646b55bfece81dcffe404;1234567890bd57ac9355d79593560e447c6b113dc7;12345678905316e1eefca094a0d71feaabe58c52d7;1234567890a8ffedf27f805a2835b16bbd0b81042d;1234567890f6a52089811dd356415cd7181e504e58;1234567890a85e83744fc0b4f2754164ba9ce9330b;123456789057b148ec3c93e84fff92f09bde0c436a;12345678902c517b18c3aee06f9d66230dcb8e3cb9;1234567890588744ac6c67e446b60ccaf0441542b1;12345678908e9ec4bfe81383e78b1e1c8cbc68475b;12345678900c8c007c1e4190c325acdac57b497a0c;123456789009cf512afa390d59839f0d7a1ee7def5;12345678901be9f0aa6238f2760b5008295c81dead;12345678908441c037c179b012be491cf08bee95a9;1234567890362a3251bd20fa5f6b3939d5137436a2;1234567890231fe40c434727289c4c6763e1961634;1234567890133b7c0287c7be90c22dc8ce9b6fbb74;123456789081d2d9ea23dc12178c4071259eb19231;12345678908a5de2a2b820e2ef8ead8f021d047d48;1234567890a83b6ac82eb4436054bcbfe0b0217b2a;1234567890f812c9b43559be9a46579c8df6a44e32;1234567890f098add85c87a08285e4ece0a540bb4a;12345678903165ab7f5b6208ddb7fb45fe2a7a81e0;1234567890d4a69996cd33d4e978110c96b6834e99;1234567890ac7e78d1e98b04f29fe7b9967434db7a;1234567890711d86f09c6172fd7c2e4ec45b3c58ef;1234567890923730dab3d0d8894342db755099bf43;123456789018b6d3877db53395b2f1daa263011714;12345678904a972657b6eeac5df1961b72f8cf5262;1234567890c9e8d683aca90a93968fe06051148b81;12345678907977a728561579e5dea38691aec01f41;1234567890fd312817b1ba72bff826329c88a28a06;12345678905b237ee3e55d31409de4bccb3f645eac;123456789008ab0e55c52919d8e86851dc3ce4bb4a;12345678904d93c0a943d59d4cc4c149837f8a5a5c;123456789032b0379f731ba460540a4150b83d275b;123456789011d19fe380cccbb0bb0db588a4cf02d9;1234567890e794478c6be33a046d15c0d9fb936701;12345678905aaae255186f29a4b9ca505e6eb78d8b;1234567890164ae9a755f09cbdcf62b3ec1c3a949d;1234567890a6ca29f32d50923706a0aec37fac5db9;1234567890939a8f7030507a8523042912fab4110e;123456789071f1051f9ea17b618751757af7d732c7;1234567890bbf1178b214b8f7f659223976106d57c;1234567890e5e979caef7feb4516b21d42ba8d6422;1234567890d6e936e96850f83eae3e9df350a0d008;1234567890513fcd1d551d6ecf99cc0d4e97c16bba;12345678904ce5522462ba22c196a0292501b6922d;1234567890342ae68d6c698b7657194c8044c1d449;1234567890613c2fed5e5725a0388f766032bcd9be;1234567890b5b6b1a6e1d869181b6cc66ce066d9d9;1234567890558de856674abcf3215293e62478279b;1234567890f5518ecac3fcf00d03a84b38da56fe13;1234567890a2bae13027f82ad903d547c9a8281944;123456789093608bed83f12246e3ae7b87d7e0509a;1234567890a7dccfda2a1cbb006c104e7cdbe3128a;1234567890857ecb062722140af0e30ed32e1e4113;1234567890414e9125de9297270dc4ec8798d1d5e9;12345678902474ca0aee8b500082080c8fb3ba423c;12345678903916982d9b65962d406c0c2953024389;1234567890a59ed5c7d2b0f0687bb18c2e2c719afb;1234567890ffb7747b241e086d84f108ad0d0df12e;123456789078325881029269bcc431a624d399ce54;12345678904bd8a2e72166bb76a4dc7249bd56d14e;1234567890066193e08a22ffa1ed53cf1893211bf1;123456789034d8e25155db335629e319b371b79196;1234567890834f1286a1d3bb360b118f1e85450507;12345678903910247040cfcd836f91d17a6c716aff;12345678908e8c4771d81755b2671a9afb44d26a5c;1234567890002d1bafe5af3ce29ceb0b245e1970e8;123456789080dbf30f11036855dad1f7b57fd1295a;123456789026984ef15e725c7829d6608648336893;1234567890e22a245066e8df1fe0ea882ed20109d7;1234567890f3887bc7de992e12ea57b31b5da56b14;1234567890a58eff3792d33e6b168952c01527eb73;123456789034ef3b7218c091e7835830a7e5d2c38f;12345678909c5525443ccf8f920adcaa79c0ca344e;1234567890a9d482f40c95a5f94c77ea74ca1d370b;12345678906fc572f462ad18f045405f66ad187334;1234567890967fe780d92500627edfe7c701b1550f;1234567890000d54c57a981edf34138b6ea7cf5684;123456789052641c19ef0e6ad5ec2cb90f741a413c;12345678908cc72f2ac0db28dfcb1475cec6f6949c;123456789073d17601b1a57277831bd0af8d4a8838;1234567890132422a31a9e3fb94e07d7ae7501767a;12345678901d5e738ed2e058a4dad987334d67c2f6;123456789065f09fc51b5c17d8d78232abbaa16bbf;12345678900b340ca6883bb972fe61c18ae7c8695e;1234567890f59fdd71026b04b23694ebad9c1048b9;1234567890b73c5ce6c4e21aeffa656b668fedff42;123456789031a47a6a60d3062901ee92059464e877;12345678907aa813c233d8aaf26a03bb195c12f0aa;1234567890208d17c03a5020e723309a8f7fab76bf;1234567890c149027c419efe0b999aaab26cfa9f8a;12345678900a605a14bc8a87174721f3161bba0e9f;1234567890aac55afdb7c5660bc33750362b4fcc3b;1234567890aac55afdb7c5660bc33750362b4fcc3b;1234567890569842da527a646a2680049d5c80877b;12345678900c6d754cbf762cff732e85036ca918e5;1234567890a58760c27f6cdca6b66e9af30b58ce00;12345678903c636ef98286a42bc6431f83e29f8a33;1234567890cfbf5784c66cdd8df931fdbdb7f0b08c;1234567890146f331c955608bec5bf9bfc1e2f393c;1234567890a858737456341f05a650e5427d2a2e58;123456789007f10b3c4bd822147099dea2fa7c05c1;12345678905931346c9bf64d2f3c83cbb52d0bd338;1234567890a28a5ec7e3d842adce884dd6a50c1a32;123456789041a43fbaf74dcce98afe771df353670b;1234567890e3a232d7c03dec1ff6f04d349e72c226;1234567890dcab844d482f507ebf5ad39b0e8453bf;1234567890bb92ac5e8c2a804cba4a1f8edca0c7d4;1234567890bfb4197214a847bf11e0f0099deef258;12345678904e70eb84c6467ba642e5114a94437af1;12345678907b5fd61f95305279d892f77b839a1bec;1234567890e64b733efaf664fdad393b393d6ff663;123456789050ffed7145007d79089c58cda50d262e;1234567890c6b92b87664fd0e2b64384c5847183a3;1234567890c9786ef7a9d0a4ad43dbc72ae0a62d80;12345678908cfec576aa656efb2aceca15be238a6c;123456789032629bb1e174e20e348f475fdcfca632;1234567890b5e6f169d6fb3c07b65441a07cffccf5;123456789050ff46f2c711b84a0d6f7a73d67d5685;1234567890f1cc37a8cbdbc002ebd792dbe374fc06;1234567890edeea362191eec8e1780a31d3d0f0267;1234567890c39294f916c15fd48e5bba123d567247;1234567890abc4715843a55355047b0ac0d1676760;12345678902a4632d12b887d0edeb685f378bfb66a;12345678907628370d35ccc6079a6acf5f60ae5bbb;1234567890fe22fb5bd1a837510ed64f61e9715f86;12345678909e926dc4a21a9b2a039f36ec10d8cee9;1234567890063871e930ab0dd289a66b9a6a6ab795;1234567890fce063cbff8b2400e98d58c19c25f50c;1234567890a6e2e6812c04ee32d3a19210cf12d440;1234567890335336a32e329db720303b6ef5afe023;123456789071e24a26c76c25827aae436111a5edc7;1234567890ef21c44a43be0ef7b2b53cefcbb2610c;12345678904b759304157b8969018b82a102a4adab;123456789016155317a06c4490a9bbed12c13fc2d1;1234567890928fbab574ef85a8ad1f7c8771935bb2;1234567890b876eabce3c7812e8e1c8ff9029cae0a;123456789003b9488196263a7d90b4fad094a9d5b3;12345678906b61636c065ea3c92cc1adf0a6d2b8d3;12345678902b93fc514efeac2fb136ea78112172f1;1234567890a9ff13249827c1a6b72b0421166a7401;1234567890c1b0078adadfbc8f1255b65c8cbd5e9d;1234567890a68dcd18c55c88318f43f04fc31ee2a7;12345678903a4c7e4ba6c436bb67288117cd18e08a;12345678906e6f11176ea35eab292d85967aec55d2;1234567890ff878272940c22d1bf05e35e8c43ea0c;1234567890b6c9e891f88975354c61bf8afab278d9;12345678900da454ae5436a5cd67dbf4615a3750ef;1234567890aa53969016c4069dc42f0e9ce477c7d0;1234567890e3951328fc65bfedebb6cbf4b08ba4d5;123456789033e2d20c92ad230b7a83a02fd1649cb1;1234567890f48e041ef04d1277ee016df7e3075bed;123456789037f8780afd1c6c229818a4ba3bdcc532;1234567890226708abc949ad3413732a001f1a8261;1234567890d9afc489eaace5ab7e0a8a4cdaa57f27;1234567890510d71740a75092fa45dce6be30da6e0;1234567890e7335b2c81f57fddb88fe0557c9beea4;1234567890d159348019b96a85f9785105b24e5e50;123456789057e3225e68ce3877d5699bbccaeb43ed;1234567890249c95a70602fb6895d12676d51058ad;123456789030dba48fe5cfab2dac8f501306d90afd;123456789093e190629294478f81f1ef82874ffa96;1234567890efb78b5a14430950020e4505e154b6c9;12345678904c4cac42cbfcf593bd617a8891dc0195;123456789073d255e1ebc71436dfd0fbc9bc399234;1234567890418d099ab8e4ec1d70def955eaf1eed0;123456789063ce5eccc602c3e3acfa17aa09ed8719;123456789032b41a096dfb8bcf680ffc12284e08cb;1234567890358a4f6ab26b9ae4038cb4d66c4df504;1234567890b8bd54feffb2d338e8ebc6df15272e66;1234567890f73bd16a0cb86c44414d10f6067ef977;123456789094594721abc0ea9259d45f2e08ae0877;12345678909560c8299ce1718dc3510c0c1abf8d19;123456789083f35272c7f55a38450dd3af487a5565;1234567890c7cbbcfc22de4105bffa748b8441d859;123456789008766055c6cb2fd06fd281f11ffe438f;1234567890c40ef3717ecbfd15ceee45fecc8fd415;12345678905751932064bf473ffe671cccccdb152a;1234567890d1e3e6782c89c3eab75e4f332bfb5965;12345678904917c638c38e87f7aae629df7cdd5eb8;12345678906d2d2a13d46b8c643773994a73c889b7;1234567890db4413d4b0207d90e75aa942f82d2c7b;1234567890de94fee5f5cd80e2080fbde2bee6726b;1234567890657428f235c6041b46b4e6ed23b25c4a;12345678902c3e1580485a52129b374efa88463d63;1234567890a5fcb274ef61d31201f6968d60154827;1234567890a117de0b2d5c2c39f4973b2eb648f4ae;12345678906a780bd076a33fbb0ec5e77bdf2f76df;1234567890da7c3c20a6167ee395b0caf78679f93d;1234567890162ec74cb21a6b3d01e320b1344c1c94;1234567890d75e50cc1a4aabc207f94a59a1e6ca38;1234567890d5c0e339ff5114a1e5139b59e31e0ba2;1234567890fe18846fcdc96c2ad3a26e7695b28425;123456789030dc7c4564d5df199d16d7faea338468;1234567890611e6d42fbb588f195f7c22460f644ae;12345678908bd1bd6fb5e9f1a78fb758c39c297331;123456789007e058a7a09071b078f8042834b16246;1234567890c2735b32580c1c2e8e6e7bf9bfe759b5;1234567890b031d96f0278e3a388ef97642d1330b6;1234567890255ec259b17c64d0e7fecf3298de3e18;1234567890064cf3f54d36e8ebcdaba1c1e09909cb;1234567890b801c7edae4e6cf35dd6538eb1054737;123456789093141b03508dbbd9c1c809d60e414f25;1234567890c8f6e211bd373a27146f11697e84c946;12345678903d3978be6ce8758e71df57cf6309a3aa;12345678905094fc7041e9b746be244e4954bd351a;1234567890bb41b96a639deb4afab6daf4ab0dbbd8;123456789078934255c94568e43488b67e8fa96822;1234567890dddf2835a87d1bbe5cfe9d17fca64b96;12345678903d4ffb36d646075edb4f90362711d405;123456789040c6b958599396f8bf292e034a3d4ee8;12345678906c2d1406ecb182bb0d73eca7e8b090fa;123456789047a832c45e9d654d76157746ac95d2ad;1234567890218191bda652a0eb5fd5cf6359b8deae;123456789045222f7ccf298106c9aabb4877d0f529;12345678900b44cde40bbde25e7e9ec203e14a6cd5;12345678906c7419f7300651fc7fa0b2a2a1324372;1234567890ef3441bc548a43c32332826fddd750ec;1234567890466a9d77a8a50ba43d7067008c5ca7b6;1234567890f10ac7b863ba96f4d41cd6c563a085a0;1234567890bdee5df2e264f6c8c511444e6e383055;12345678906889d5d94fe9a59ba69607157139e848;12345678900382557b1dc5ec510755325aeb391d7f;12345678905ef6e07ee1a0c1c74a2a630b16d9ee60;1234567890d78ee1fc683de0dae45514bdeef0b696;12345678904c8fc8d9d790440a90827b6cd93fe77d;12345678902e00f8e1b73f5d83fc7dd0a890c7111c;1234567890e8de6b8dcf830e2ca576a62269137788;1234567890d36267253a9f0232474d9dadd3ee4459;12345678904100aa8c484deae9308355c97fea2257;12345678901ef215947b7db9ff0de9031401604207;1234567890eaa7b137b866cb2220c4a632c7b6eef4;1234567890d00282e5fe70e4a69a19ab1b20ebb9b3;12345678908d8fc8f6e498136e39c6fade2da40f1f;123456789077723e0431cf976260b9292509b690cf;123456789053770e216ce46b8fde2c46a23fdd6b19;1234567890e0010cf4fa72dfd888d3047a90229c3c;12345678906caa409273483c3b6ab2c3ef07c7c579;12345678908d6f9d65c5233d577496584420f55800;123456789070b60b7e38d3bfd02cbb72082e3baed7;1234567890bf922c9a7b104e74e7c312090bb07f1b;12345678900224a38c4bc8c564c0ef77c87d931e72;12345678908a2a1099fcca256345680e6881b0ea88;1234567890022d9053950c74e11033f8509a840ecd;12345678909127ae2ce4214838b6cf35735f0fe646;1234567890f502bca251855d82ef459141bb7507b5;123456789022920002e4832e9f403cab790c33005a;12345678900ea7a1b7bdf911b38d6d2d4041b2935a;123456789068b36a510da59217f1e52bf37774faeb;1234567890f00014d47d1af3f400a552393ac7c911;12345678905e2e5df4763c1a85e1c60f91b6d1d715;1234567890bd6b61179a45844c374a3ece585731df;1234567890ade30b0b915470c6cae012f628d19de5;1234567890d4a480a576ee17c9229a2a176cca0006;1234567890d772ea9b4087cbedd5c9a43dae448fbe;1234567890d70a4f8d4ac5807e102bbd42274ed066;1234567890f22c32dcf54162d6b16d4cc61c401216;1234567890f16b696f8ec1918fd0bb1aab86c6681d;12345678906e7758757d4508c0b5694d43fcb1500b;123456789058ef082eeb34ba925c48759a7ed5bd34;123456789043adb80bd081021117b3ff7c294a5522;123456789032208042b2e64ed5b2218694e67e303e;1234567890e97b8123235160c35a7b25b3531118b6;1234567890023693748ffa7f7f51d0df881428dfa2;12345678900a2ddce4a2a3c92a0d838589aebf0923;12345678905dc24e9000c06bf7ed467135e341791a;12345678908c387f344f45ff1204f89739a1fdcc44;1234567890dd4c690966766282304c36f8b6fb8e1d;1234567890c833d445f20d37a2a869567d42ef8bb7;123456789025a7668ee6508987bef803c6cda2e540;123456789089f3db835998c5dce6db5bf5b2d0830b;12345678904cd857d29e12bc34745a845597f8b2ef;123456789050826432abcf1a35c5ddf70517468270;1234567890453d1234c9286b7f3bb8c6d2cdf1e00e;12345678903102e3dbf53d1403c3af263f02b91a84;1234567890139c4c50855cc69151fcfe26f1cc9f30;123456789027b207a81cc80823cb3f323bb9a46001;1234567890176aaf35ff44a676b14a86a22ff659eb;12345678904e071cdabd6d2c0173ff4e4a8962479e;12345678909a21050f9179983a3bc7939f8641794f;12345678907f6e6d8392102309bf18a73fc429c6d7;1234567890413a11513b92c8be2ce5ac69e3780b76;123456789005e569568b7643f4b1e096d4cae382ff;1234567890758d74476f6522bb7e5dcc9b4eb7b9be;12345678906e85342ad80b11d50c5a3858e887b442;1234567890f09ec83e3561e82c420909a46d320b6f;123456789017f9fcb7db357b79f24f37dc5ecabc6f;1234567890730b57fefa9c30dcf94df5d342648852;1234567890429e7b091fc41d7a2a920e1f61df26f1;1234567890d8f1b9037782c1c9d0077ee92e66d98d;12345678904abd0f790afbf447d98e35b42d2151b6;1234567890255c4317a4d1537c70cd130143c26b88;12345678909fe461c5ec4b3ae9e4927d894627d467;12345678903955ab347beb268883cc30a9bb50987e;1234567890a68230298dc767266669a9af54ea8ee3;1234567890e2fa6bcac65ce893ba9148982e428114;123456789001609dce0ed6810fca1d104eee11a1fa;1234567890a044bb67341f01a2e695a665cdfc3543;1234567890d29f64c8f322b577e116ae9ee83a8c87;1234567890f9bb5c64ba193830cec31bb0b765ec3a;12345678908a4d7da5e14276118200a7d07bba848b;12345678903a83eee01bccaf7040ff5a4572a7a1da;12345678905633a36b15074902fdf89cde49fd7bcc;12345678907ac44e86623010b329af549ad848b260;12345678900b5c95f27f0dab14a603c038879cf583;123456789010d3523206617f97b48765d051df7eb5;12345678908209eb942c1dd242b257530afe4201ef;1234567890944f755002b2eb83ba1d6d3805d8896d;123456789024d8a98cb00cb05b1fca9c0726129861;12345678907bb78ea0dc47604f361e53b66387ea41;12345678909d4cf8aa23a29ed77f59f0aeca06a553;1234567890f01749ff1aec7ecf12036de7e7ee6bb6;12345678900ff9a7bb41110828bd18f02426eafa01;1234567890b0e90887e5da27edd4047d6d95888b37;1234567890bf674e26c7e7400c4c94a8aa6227f87b;1234567890be4b15023e3e7eca35ec632a252450bd;12345678901dcbbd8e7539fa8e4575dcecf7cf5cce;12345678904ebcda0a0304d031b894029398648759;1234567890cd0a966a919002d5cda51b32f395152f;123456789044dfd9b7fc7d4da7f4871bb51c08e537;1234567890e3f7206135462506417255bf1391e116;12345678902f61e6ab043b2864db710734536f51a9;123456789063d3b85a802f1ca2ac478320071c7ddf;12345678901d92182ec9e3b7f12edfcb51a28bd7f1;123456789040ad1b6d5388940650cb13dd7ccf42da;1234567890c9feb1ab57aa8ab5b742749ba3242eef;123456789088350db603cc61aeb33cd0197cceffff;1234567890f98fbcabb974b114b6509a502eef7a26;12345678905f80d478ef7b750382b386c87261e8b8;1234567890ae162dd8a9558363896ba4f5b5a00ca2;1234567890e88cd05cd93d45bec69d53357ddc9888;1234567890d605b714b59db7ffa2627fa5e9619c41;1234567890490e3b482229a315c8ccf044e737ce77;12345678902ecbe85aeab202b0d5bcd9b2a25ecb00;1234567890adb617a8427beaa4aa36831a42695499;123456789078bf5f5aace95dca7105f4d2541be38f;12345678901ea639de40f09a07a284e2ef5ee52976;1234567890af3b6eacb1e30f9c938e871b8cf9303c;1234567890d35620c9f0eb174ae5697c7ce8b59812;1234567890e6af89acee3834fca20793f857057551;1234567890d4123f10792e0521cb8420751b68b0c9;1234567890d663a2374b5fec547d896b6910736296;123456789080e2ae5edd84b8403b3e9ab4083cfc87;12345678908ce74bc12f9a92906589e99bbafbbd25;123456789039893228daf9b34847e28b4bb5517917;12345678905548caedbdf2060d70d89a8aabc9810f;1234567890bc4bb4e2b2ac161d1a899bf418ca2fd0;123456789060127341bec7d0f4f75c8a7831577a31;12345678907a5c1badaa8820ca2e68b410d12301b1;12345678900922fdd5c6f040f230d4a3d52a6952f4;12345678900f879d8a6b041a48fa8ebd160e0dffc3;123456789012bc0986c985e79a9f59e484cac74877;12345678903955318b1a6ccb9a143b12eb2edb8b0f;12345678904cf7b9bd25a57351e1d0524073c47ae2;123456789043a039c11a30582293b9fe6f24af7671;1234567890ecc1cb94dabee7c7c182cef16b485b75;123456789035c8661f6aed2958e1b025ea213d9c1c;12345678903bd273171fa49ee3ccb7c04bda0c746c;1234567890ef29b804cff3b254a961ad006308ea3c;1234567890bc236c5d5d98c27a794cf66b53d87126;1234567890b0b511cd9816e34e83ebbbe044bf9ac4;1234567890c38a66ca7b224c63aca35acb9f6ac828;12345678908722883ffef7d9f784da81c8c74309bf;1234567890ce3a0687b6a9ab8a0da5a4ebe5a744f8;123456789095dfb527e8679100d8df3f2d1d20c862;12345678904b42d023d9efa7c6cda5c3a754b43487;1234567890327178db66783f40d8e5168c7a1b540e;123456789083a44e4f50646f4aae1ef14375b08d52;1234567890b605631e9ede58c303eef60da5522144;123456789081442ef2b9c2701b6a01c01d1c877958;12345678907e7a365556f3b3f8005547d7a3a2f526;123456789020d5ba266d1b2b2252300f80ce9bd357;1234567890cf630fc9aa2f712f56acc343e40107d3;12345678906e01cb926532bdda5ba9a05c058115fd;12345678907ead99e985438c372c09805a35f31d47;12345678908d8fe2d0b502e1f25d7ee5bfaf673bcb;12345678906feeb465c36f18e2591cf79e85d44bea;1234567890ef37bb97a8c1e2a65d5d234392e92c33;12345678907cb74d80cf25368fcd989bc9c37ddc49;12345678907299a406aafddf1a76d090c7069f445b;1234567890e3afaa6858a70bfe122e41da3290b8b7;12345678900d7b33be5681303e129c11410df88646;123456789066442a5b9e28ec92305a65c230b20bfb;12345678907017350f4b2d2f194eab120bf4c757de;12345678902aa5a6625eaac90b73889db3ddd1aad9;1234567890f0eca928dd6d45844ea584022635045b;1234567890c9fe80c0538b141f6c2b4da3f2b4d5bb;1234567890639b6ea3d243954fb0d4c923f80f9061;123456789088d2475fa8bf94de9feb6f42e5618803;123456789026b91ea1f81c0f66d74a7866fea73a4b;1234567890db8fd589e84357e4d5adf40453713625;1234567890cb0280be7ae9137f4f89a2ff77fc594c;123456789022709fd8a77b3868062e8f04c5de5f5e;12345678903640e0299ddbd994ae275fbe8362066a;1234567890b1e1e37ecbe5c5b49c227a1a55cbc49f;1234567890c995df66c1c193853c1d113281979092;1234567890188cb6fff1d186ea845a44723241792d;1234567890b7149acfa00c35fb7734389655df6778;12345678907f468d0532dd48ae3bb45831ce550f8b;1234567890a69d43e1bf564a1c554028d641bd8f77;12345678900c8fbc8575d78cdafefe779657b884eb;1234567890122657d59d148bbd06c5a50697b3d880;1234567890d515d7244fcd12e45793fff1f799a658;123456789011af377c9eba20e74278ead3689d728b;123456789095f2b95d7a01b22cfa0c2573cafae721;123456789082923f146eb841cb5afe6460558c7462;1234567890adc3ccb590ca69b1b2ee4929c58470a5;12345678909fea4da7c92a52d81c74e2b67cc7de75;1234567890eafeeddce243580ce553d3e9b417048b;12345678905482d0b06dceeb3ebc60c543c31ef3df;123456789037d6471084e31e05a109a5cdef8f26a4;1234567890034126d377cdcbf56a6408e85737c232;1234567890b31efdc1ab5f2440f74933d029a2c75f;123456789090b68ef45e9a76adf5161dc05d8e8e25;1234567890a310da309b03dbe774deaba5c6e5b667;1234567890c6bd84094c0d877c59585cec8c343245;1234567890a32bf43abca1cbbaf881fcee9c0f1fb2;12345678901f2ecee6496a2f05c88364cc44a2795a;12345678900e93c17bf4b34dcaf8665fa0ba1b32a9;12345678908f704d18ea5ccfcb9ec80ebb8c2837b6;1234567890739913452238e4bb1fd5393634fba1e4;1234567890ef45726765f4ef9c34efa27fcc6f61d4;1234567890f972a6be6dd2b82ed29ac9084d37d345;1234567890c75a0f6ed7da470c3a803a5bcf229d4f;1234567890eec03ee6415a64b1f524564b1ff7fb4e;1234567890e6132290a83efecce1ea7b2416cc2fbe;123456789058b7227cfab6bd693faf0c01f1a99476;12345678904163581c30316cc5cf52d910df87cdee;1234567890316a38d11d06556ed9baaf14e7418f36;12345678904070506c710da437b9ec388a4d3f13bb;1234567890d7219f51b7650a81de2a2e043adad03e;123456789030c8101df8149a3149d5ce4e80e47184;123456789086ffcd8aa6101e482831a5f85c34c86f;1234567890c01a5a001ab8e32e60c408738dad6262;1234567890b0842b5850c3939d93569b26c3dd7c93;1234567890112f9ed7a6f8865841e5dad6cb8ba7dd;12345678901a04db1c97c63e982705af4655c663b0;1234567890fc1121610bef52eb0aa3ecc81941fe02;123456789034fc5044207b333166cab0de721fe9f8;1234567890b7cb975e6a2627ca6e49a7264c7cb751;1234567890fe3264937c079a53601942f2c1d7f4ee;12345678900dfd5819e0a3ae48f554a02bea7fce81;1234567890e598dde5a711dfa88596f0076a14a533;12345678905d20112208f0b6fdb5a8187d17b979fc;1234567890ec11abc330b1af1d79147f14007a79cd;12345678901c559d0d8db0199c00671b05c097b6a3;123456789092cc33756aa038306e359ce6d4d5e9e6;12345678908e3bd9bd5e36a8387ab6cf1f0b950c9b;1234567890b315e7560392387a7e929af006badb01;123456789078a8abdd4e5c16b044bbfbe551b464f1;12345678905371d32bf243d4388b351db9303c9d15;123456789037981ce9c2ca4709610df620fa4d2c2e;12345678903f15e36183bdb9dbea06ba392670aa86;1234567890aa36e11926239ae119752b4aba12c031;123456789071762f494d0bac2713b182da8dc6f3ad;1234567890c1aaa0e43fec2bd0a71edf6edfba3959;12345678904e939a2ba92cbbce0f5589c54b8edf46;123456789048b97051cf90d899cb0453379507038a;1234567890af01b0936a928e97c052a2998c7b5d39;12345678900c0b532e353d01a9ff13e90676fc9fdb;12345678904f5738f7952c4035592461a537e00a71;1234567890abf4014e5dbffcbdc1945d87f8309cc0;1234567890bd9190bdf96b066d39f6341f54d7a7d6;12345678901fdc32f73a9f9cf238674129d9c13f3a;12345678905b957adcc3b3cf497309f0fef2e273e4;1234567890104b96f956a6506a02718123c915fcbd;123456789022685aa3e1b303ef7bcc816ff748ccb8;1234567890f02799d00ad0dfa17583801c760aba3d;123456789000746f6ba868db84f706da648a3d1ae3;12345678907124a9b06916bac127abeb5d72e852b8;123456789076ef51402fbd8750a460f55330ddabaf;1234567890ddd870e647e564a5edc31027778f2eb9;123456789008028a33238943d4c4bfdd84ee178788;12345678907713127b8e9cd03fa7c3e2dfc05407fb;1234567890bbd58ea3975b6e13abbf994f04cdde3e;1234567890b9c07978bad76a472600a97c94b239c9;1234567890380146fd507e0d8392f41bed328a4efa;12345678900c2c9729fe4d24b0c40e515e0ce37b2c;1234567890623e5e6c480a7d155125e60323492bd4;123456789094a9fd1b430a757601f4de5a063059c6;12345678905c068ac972aef32f9fbb267220eccd66;123456789079849a8f2fbe7a33d322d7d80758fd6a;1234567890b1fdb3cc1266215f6279e9dc967964bc;1234567890790cf754ddf3c1213ae10ab2e375a5dd;1234567890913e83c78f8a5fad0d38ab6f7f9b3d6a;1234567890cff1ff5392c0383dc54797370e149ca3;1234567890a932d7660bef389427c96ff68002c796;1234567890bf716752b1c78048f65e15459e878c92;1234567890b4c70a2b426ded50d21e305b806c3def;12345678900172e97045b26c40d193390ff1faf3cc;1234567890e2b3d9778024e0a22d8776dd9b078bc4;123456789049d8b0864b5cc8f3343eb6e018023f98;123456789067efbf2b28a7e0ac11a23d542a09d0ac;1234567890f02210c3b2aebe44d70e724702db6813;1234567890d16e1977c6e936951f0c3fc9fcb140b7;1234567890cd82b951ae62ebb16f3395598b7483b1;123456789029d6f5a9cb9757311864285e1a85d55f;123456789044883fe4130c9c6aa7f5bdb51e8dd0c8;1234567890391720cef43d84cfd74cf9c7142c8cf4;1234567890338f94aac6a5f4f813ccc60ed55a538c;1234567890ba250c9c7ff7b2d11bd477572be9c7ad;1234567890dfcbf067b4c8ad02c5ff73d01a7d4005;12345678909ef8f532a27bad26a214424e46802a22;1234567890b1ca3a248711a770227c050c48f31fe0;12345678902dd4face17c5b60909af1553d8966a4f;123456789079ac1c4b1373da4f1e58ed7ed390b047;1234567890e3a58de44fe53237f293de1e3af5dc6c;12345678900c25b433977fc75d128d31f517d0c831;123456789018d4d445557b343b0eee42cb468f3e82;12345678901f25389f8bb2758aad0f35bb39b0dea1;12345678908035f473c4c45b390035475e2de54a1e;12345678908370fd15aec7a278f628667bfd072bf1;123456789046eab380ddb833b0be62f811c139868a;123456789000da7c2e339d4f0710c74124d946c912;12345678907253a3d6d253149f119cc59684401040;1234567890aefb43fb2cf4eb6edae1a96c9ef5a4f9;1234567890e92354f39ca2878fcfc1e8ecc30d3670;1234567890671d1bd0669c61ca94553da03015b871;1234567890bf5fb0b2f8c42ca42887648b2d6c8d00;1234567890414aa6bcfcdfd31f66e595956be1100b;1234567890aa62006a566147ebf78669e8e41e3d3f;1234567890568be8482eb27cafba8e2aa54af75cb1;1234567890a814574065155c3d8919046570005145;12345678901433c091239e017d630cb635cbf5018c;123456789075b26d300af5d234a052f7dba7d216be;1234567890e76071f27d479268a4c44073f44b28b4;12345678908b695e7fd86dbfe14b48257eef07b98f;1234567890672719a782893c3ea08848491dfda448;1234567890ed310d4eb695c6853b5bc2ff5b505f9b;12345678900128e28bc4b1f9d62c7de683a6cf8778;1234567890a5aa7c02eb9f1a23fcc09c8b6e99c31e;12345678904ac111b8db2c2826552708d7c1e63cea;12345678908e0387b056b6113401efd8baebffa918;1234567890f242443fcf8137c0a5d52c570a267668;123456789026812f93f3d652e454e9f42750e338e8;1234567890259a5019e41262e3c264c56c02053fb7;1234567890ac905605d70e7053adf3af43022552dc;1234567890a33eea4f07f006c86f83f490d3d6f419;12345678903794e1585069f9b65837d20e36cc8653;12345678901ac4ad0d2b3e1d3b9c52da396ecadca9;123456789054366ef5e642e5a580b5465654d49a9f;1234567890a177f487a4d889281e92bf25ff7ff0a6;123456789010f95e032595ea1bca50de10362a1ff1;12345678909657b54e5efba1b488a048740e22ff2c;1234567890c0be50209f0cd2780d06228aaf9f6b7b;12345678901e28a726beb2b64a944962e97aff5c89;12345678901d9e0841c96e546d04b9aed192b4221f;1234567890de514047d1d50ddc2861ec6aeb8daef0;1234567890148657467d748d0f590dac1ac4907b42;1234567890ff11afc4a2451381d2133707aa35afa5;12345678900ab11f2da34a87c5e370ef3fd05ff62d;1234567890e5716382bbd84900d93642152928f6ce;1234567890af774f189bacc53469c56a250e58d129;1234567890c43741b2b111dba20132961aba0fb1ec;12345678900013ef9086014dbaf98c12169cdd5edc;1234567890c1d02579ccddea67b6129596c5a90660;1234567890f1a9da77f4d02d0593eda0438ff600d7;1234567890aa1e6c2b0810b4570e7d17b82b76abd3;1234567890dbd70bdf78a0c0583138da9d14ab8842;12345678906530cdc7c235ba0c5fb78cde9b0f9131;12345678907b77e45e02b0a36c9dd2512b66f178d7;1234567890d6d2836a115238a7779d5f8b3d5f74ff;123456789096a8e7ef74f9dccb7dd174863d135d55;12345678903c4c1abc3045228c5fe05652cf64c51b;12345678904520ea983d9c663f6d83aabda25359cb;1234567890e0ffef1b3af5894f6342b480269aaf6f;12345678906708b791d65e40e515b2a9123be24626;12345678905fc312fd34711028583e58e3c2b2ca0a;12345678900918fd0bf91dcdddb48e068fd0845dd7;1234567890a475da016fb126debf6fd12d11a9cd4c;12345678901af11d82ca776aa0a7d6e3ad3dfe7fde;12345678903cfa8d1432551b6a125b91be5ed23cac;12345678903ba786f29a79d2c6bb53f3a027f76f04;1234567890a4bca20af2a00b761a99d913f753187a;1234567890a91d28ee5977c0bb4114ca6c9f8784f3;1234567890dfd7aa48cae494cd42ed3424ab13c22c;1234567890a767f478cfe5f138b73ddf9215669b6f;1234567890833525f1d643dcab5897e5035e7c8915;1234567890636f5fe0c723bbe4e6e610b3ef9d852d;1234567890bf9872d564a522259cf0739d3582c695;1234567890d8779958266a0748432f7baeb68d1c4c;123456789018d07a05000dd18ba42cddadf32a8f55;12345678909ffbe4a6ac215b62cd8787d53e28c565;1234567890271c88aa7ff7e409b2ec11e851accc97;1234567890a4cd1da7335c8a8a5267f32603bc3b27;123456789069847110c1a567c67c27768c4c962534;123456789010a2bf44029eeb7cec8f7a15f396f3ef;12345678900339d8c4ccbd001e1ebb4024b078f9e3;1234567890d70255f2d4c45f136ad28309579c76aa;1234567890ad8c054ae46376bd9a7b0d1bd22f5e4c;1234567890e709febff5d8ff028a310ebd54a0ab88;123456789039e9c8ab586b1349d6d2f95672605937;123456789031a51f0734adef2cbc88432c88022fd3;123456789096dbd03f7ef6ca9499929404d8c780c9;12345678903333d4cd38f7c497224952a2446955c4;1234567890d8d42a99cfe260c88e3b0e82e9b4fe4f;12345678900b5e0c790103b1244fca670fdb4664bd;12345678900902df47f0038b472f7f5b659f2d0b11;123456789077bc9a6b54835053f8376690a5d193da;1234567890882be92f84fe7ad39eef5757d76b58a3;123456789073e37cc70e60f027387aea8282d6f5be;1234567890e3c76ef3466bddfd873450d8fba9aa8b;12345678904fad7832bdc307a6e5b0b1ee2b5e2f95;123456789067c67c7d7c05503ffca508141b899f24;1234567890aff1b51d2f5599e7daf0e76097f4fb31;1234567890b8651b90d6efa1457956b6d6299f933b;1234567890a54efff6495a65a288a3cbe6f12e8484;12345678905ac40efc87a2daa04dd5d95d622b04d2;1234567890e7d5353dbec1b7aa14944beb308aaba8;12345678907cdc27192c47dcdc7bdbfde1a2f270c4;12345678905713d36dd378bb4f94e1aef7f235d09e;1234567890a6ef3ca8877b89a7165fe384c6bf2c06;1234567890b5048b30e4966dd327abf264e97fed69;12345678904675f29859d1bf24f414b87d985170c1;1234567890a5a8a551840bd162351cbec50a8da3ea;12345678907da65438cf7902032c01df76563e510e;1234567890c68fb78b24e09e7da93b46c348ad93fe;12345678905119a81e36f997e0c8857d2a5a0b6198;1234567890d78d49d19bd4fdd667dc1b9ae37d554c;12345678900642f8cc3a0ffddd2c689e1397be1963;1234567890b28ab82cf731bd4eeb0f99401c320597;1234567890a4025b66983981dbba40a54f5e27619c;1234567890f89f6eb88f353e00fe770fb396fd459c;12345678908643bdd8721ee1cfbbeb57efcee09a82;1234567890596a26f79cae72e4cb92325bc813891f;12345678905f7986a7286242eeeb049db1582eab0b;123456789037bcd5ddcc6994c39254c98aa5022e02;12345678904b505c41c35d4508d0ac785989673491;1234567890d0cb7598a5b1ddb1680b12b72b7aa75d;12345678902cdc90a46f67ea736fb2d6c2961b41f8;12345678904cd9a1160efe4834635ee31a0eca86e3;123456789000cbd1a6ef5afbd350833bf364dee704;1234567890d912f8aea6951c2b80771da17939d005;123456789096cc34805e4ac683033849e4808cf3ca;1234567890740716d72b076b3e7a9cc5207ac92693;1234567890246c86c727479549083fdb32fa59d174;123456789018ffbd6838c5f7efc26668a0447cb44a;123456789071928e5d9f398acb28525f06f376488f;1234567890f5df18e31ab05f8e539420188e8b2f25;12345678903f72e5c1a062f88ea8f8ca11d13d196b;12345678906a752fad9e8285e68fea7b43e9f46b7e;1234567890898556704318794b54879b2bd1bc3e70;1234567890db231ccf6e0ba1db22df5204c0fd4b84;1234567890601c3970c454409b6d83de071722daee;12345678903b407ebb2726c5f66d815b8d3f870606;12345678900c18226c822e234bc1221d693efc5a79;12345678908960e46617bdcaefa4c26126aeb0bac1;12345678906819c1ed5cdfae3fe09afe032d6c36dc;12345678906512e661e88f2f019099022902019808;1234567890754825680664cb725b5c020feeaa63c2;123456789013ba87ae1e304845cc08a4b871ecacbd;1234567890ae87a67d06cb663d389594ddef2e3c5c;1234567890021fd01f73bcc0323204f1b840c6456f;123456789075faada4e29d6f09c37110950bc6a00a;1234567890ca3d7417e37c6f2a8530fd09fc16f6c0;1234567890c055cd83d44b8484db82ddcf4a10fcc6;123456789069a0cbd928c06961b9c5ae6cd62d0afd;1234567890321ce21d2458387e9f6e644bfa6f950f;1234567890ebf885d51e0b6e79d1ea0e37069fd17d;1234567890a474da829f85cd03f23273ec05f1e390;1234567890074d919fc6cdec6f9a68c0891189fd39;123456789058c4d0c2ff442be0e0f3b279d2ce48ef;1234567890d1d96fbb62b8a5f06e6aef6985b1dc5e;123456789034ee62765e0e91b93a8d02620bbdf8ff;1234567890baa8fc57d30d30097e7f65647e8820d0;12345678909f2591ce36b6342fd9c21be23a950a4e;123456789041f1a8454f67384081798a8d39487aec;1234567890fbe18d064e2da4b8adcc36e5cc3f4a3d;12345678900d5913b864cdcf5c2c501bc9f894dd09;1234567890dac7474684b6893a18bf2b0ca686c99e;1234567890a3380123aa026dab9cf361b69ad26c46;1234567890f3b263a6be2f0b92a22ea1216b423c3a;1234567890eaedc8d03a4b7b0118fb9314622fcdc4;1234567890e2bf373d2f30803f1bde95abce8eeac2;1234567890f14cc3c67a351ed9bfe3c833f6b81b54;1234567890d6e5ba877d8203785485792f721290a4;1234567890f1e64fd1ae0b4b9bd1a233222300b997;1234567890c938db45180478258a2e7f025208dc22;1234567890f048d93fdc95636bf1e20983973e6c68;123456789035aa68164c1417e7bb40059d266bf7b7;1234567890e8c6c8aa460979bd379565e0dc769870;1234567890381ce82f7c55183971bf6cf7689c8e28;123456789057f7daf1fd1b6955a2827ed1f0cc8317;1234567890d849be2772a566c5bb7880e0846cd47c;1234567890c2990faa5575046ae7bc81b317891ba3;1234567890d254d8df147072e564bca2554569d5ff;123456789082b8d4cae66b1707f65f8febe004ae1f;1234567890e3069e9d91faa5c987b6d1791890e148;1234567890836971a3709c8954a639af3bc8cd3264;12345678902ab093b04e3d94eda999aacbd579ce76;1234567890445e5fe62097f296d14fd3a5b2628a27;1234567890946f8f5185bfdd89d5caa1c1224494dd;1234567890342de7234ae6f5dea00e8cebbca3ec16;123456789063f2f1318b19db29229efed99f1bbd93;1234567890b680c78f1596ff3c5093dcd0d4186aa1;12345678900f9078d0c2c4bccf056d21d8520b5cbb;123456789087728813bd9618cbc8c728d93f5e2b44;1234567890ab4fc7e29f2e96f28aae0fd6836bebd4;12345678906bff166092a79583e97fac6510541231;12345678906a4f537d54391017113ed58846d6f476;123456789088ba887891665a81ede8a122ad63f327;1234567890fdd13fdbff499c01c4f14693c6e06f1a;1234567890216623b43d3cbec05e0596889b68fee4;123456789083b721a70bae598938bd3bdd30fa1ff3;1234567890c94a118cb028c785ee4cf4980b962fb1;123456789021362e99d42f23343ad5d94ad1b4edf2;1234567890e3a9f8da408781a1b012d2b3db5003a3;1234567890017879b209ad43f0be92cfa2d16ddf05;1234567890aae1f0bc46631fe9b1aae15fc173a98f;1234567890f848d2b892d29b83447cb4544b51d3b1;1234567890f17c32e46fe6ae6159b076662f19d73d;1234567890cbaf581f8e8fcef7bd213170cf4b9bcb;1234567890e0a667696f238a689fc18271ae96a9d5;1234567890c523be4aed09c021b4ef8c771d701b0b;1234567890f8b0e63c3bbcd0ed86efc968508f0eb9;12345678909e69105272e36f24f692f2d55bb17111;123456789033e415a2ae34c5277eeaf9b42b1c6c8a;123456789097bc62f142ce36226c4c6b5da5eefe92;1234567890cf21c134a6085101f8b95a5d2c6c0219;12345678903d02acacbcb840bc105c0f06c436edf9;1234567890e8ae96e516597cc13bc0e49fab19a1c9;12345678901372873b14040c5122feedad37c6cb43;123456789075abcb81442116a7cfdcf93f1024b8f1;123456789093232b548680cfa2bda208c03e5a5993;12345678903b0a5816d38fa01ce94c7b8847590528;123456789081de9a9e23c774d9a8d5bb5ad0d5a1db;12345678904d45eecf9aabde29b26584b8e0914e7e;1234567890f599a55a046e0a216101d5760e2651bd;12345678905e8fe5016e6b7c2f85bf2849546f849d;1234567890687ef8f350831dd6a92dcd6f5b790542;12345678903f1b5d939342b2a59424c10bc4fde68c;1234567890d7563fe45133720d1bd2cb56c9cf2625;1234567890df617969001c6e14cfbc1d94b713c824;1234567890d3d230989ba03e1dfabb5f6290bb791f;123456789086fc7355c7c526d611f706429b2f11a2;12345678901583c5219afe7c16fe233efb8ef96c46;12345678901cdfc42d31ffe76aa65488e5c5a7c285;1234567890959e41c5e6bb475cbabf70007d6f07aa;12345678906f6c93574b5645d6ce188c24d08b623a;1234567890d6860a8696916b390f4544fb89e30f99;1234567890f24283dc178f18b671b414cd787f6b7b;12345678905110b8f30a060d5179ce06c636f2cc11;1234567890fea52f37b6a6de72734ced0e6cfe73bb;1234567890e6e0523d2362fb131cc51968cb49bb46;12345678901dc71bd3c2b3c92ee03f228578cd834c;12345678908dd5bad928611f9c45826a718bb8655d;1234567890b422023a49e95426b36cefbf7ef56575;1234567890d616e60d2f17665d5f38491b4ab815f9;12345678900b06ed62c4fcfdb24f28212347d4bc59;1234567890ee001d9a411d61e16200d95852dba6c8;12345678905f8dcb6ffa8127ca27b19365e78afab8;123456789098264bfa15d461062fb51c2d2a719aca;1234567890ea48ffc7dc62060dbd0ec845d1752892;1234567890fbca4e9da9265a618952449792dee77f;1234567890383c59c3ccba70a2d9f9f3712c621758;123456789080b2e07d8c4d0dab224886c0f0e6877b;12345678909f935e6b832b4d7fe641d20d95764320;123456789069439723bc34c54a9a2a1e5297e3803f;1234567890ce91b2bee305c7feaffd50e50439036b;12345678908ef19a2860dc67ac033ec8a5aae2bdea;12345678905e4475f9fdd07c276005b2525f4c652c;1234567890fa193a34fe9ab8315d29f1a968275272;12345678908d2ac0b1232ee0f3a93f047648590e91;123456789059561f3f2d3e948b8981ece9a5ffe070;123456789079579791a5472889fe633e3819ddf721;1234567890c383393f139c101489ae64987b855311;123456789033c1e5dbe96ec960d9a360ea094d115a;1234567890576485215e4b022a2c9e989e526b7496;1234567890aca785845c55416c3952809ae55d3d66;12345678902ede58783cc32896e75d3f6a6ebb4f1e;1234567890954304cd26906daa0e612a54c987f668;1234567890a447ccaaacad90243a3f199ae2c2c032;1234567890b534dc9ccb7318ae24dfff5c4a6bb3a8;123456789053899b13dfb9a17a6316739257a2037a;1234567890ef6b08f6c8478ad7fce919bf692eb89a;12345678905a1fc92d84b82b3433be8fe3d6fd7583;12345678904f3b20e346a51407e687f91cd014169d;1234567890a775fd6db3173f2f35ad269309d8454e;1234567890332a89ac56d481f8a237d680cc20c468;12345678906f5335a11c7cbf57c0a545651dd40135;123456789007e92b0b49d79ca628482451fb894318;1234567890c7c4510976d17ffeb61dd0b3d85f53bb;1234567890c8b178071ba35923a3d6f1a29f895aed;123456789036b8928e55d46b238de2fc54ec882bbf;12345678907259901c076548886757143164fa65f2;1234567890329c144abad737160ce201b1ecb919aa;123456789064602e40f1652052061a499f17ab199a;1234567890d59d0d3b823e5d26652dee7a3ba5b1e1;1234567890bb879ba130b8eddf457814ba85cb5163;1234567890b17a7ea9922956ae36d3a5a21bc973dc;123456789074221c807aefc7a65c4a5a379754df47;12345678900ffdcd82cf8da2d772c946fbf2ce7156;1234567890bab5278ba641af88cd9274257d42fc8d;12345678908038bc34e99540b9ce822a769cbf0276;12345678905d90443f2856346c1cffe041c66d0fa0;12345678908a58eec793d84a1617f85a5c4263536f;1234567890a638112ceca3b615c920694cd89c73a9;1234567890facc1bfb3d8a5d2d9b4e2215372ca736;123456789091616c50a3f6fa0edbaa8a1439c183b3;1234567890959a5732dc2b42ce73e443080ed7521b;1234567890e08e57462e0ea6ce0484e07a6f500b0f;12345678902098ffb9d7dfa199c2af378a13fbbf6f;1234567890af5a783437f92eab0901e6575b2ba2d0;12345678904160642d092de778abf3d03a36a01e84;12345678901a78f1861507a20a38aaa4e87b51a921;12345678904c77cd2de0412c62478a680951399807;12345678901ae25d21c4459014f1b318408f5cb556;1234567890f1e383710874c7d96be83285e6721ecb;123456789000b9c447d9554bc673160ecc08768513;12345678908913eb3097a157b0978d08da1f059261;1234567890c093c9fbb3fcbe9ca388b0660ebb5e05;1234567890791f82e8176030fcc63e8d050c546cae;12345678908e346281d05f9a0793fc30fad5d9cc38;1234567890ab5e16d410b1c00e4b198495d3faba5a;12345678904c2a494a5c8d781abd034f70c7c4b981;123456789059ac1eae71c16ac4b04dd277f8005bfa;1234567890e281a755b3977be68fd71bb899a8dcf5;1234567890334687e68a128266a5433dc545fdd1d0;1234567890cf078e076489a989ae99a17da8dbe2b6;1234567890569a7064b0e1e6dcd221eb204d190ca9;12345678905cdcd666edf74e81bf2c67f57e7c1e1a;12345678908622d9e89c9af2c6af91f0cdead1116d;1234567890cbbf353b6a6d39086787ec9a949b06a3;1234567890eae3812140448b5f2decc170a4d5329b;12345678903de6d0fb12c169a52ff52f1863425e16;1234567890ffff6ccad0cf57b674557681623aef69;1234567890e73027918fa79969cfd6ffad9211c44e;12345678904301ea00a77da3658cb0ca0b28d9ec44;1234567890f8377341614c4bcada26c88349cf2c21;12345678909aae92431ca68d7ccdf7213b3580bd38;123456789042112c7cb4c58f2be1a511d2b8f4d6f2;1234567890280c7fe4008454a82489602136abae5a;12345678909f9b314f0633a992046198bdb3f34fe1;12345678908a4522b1650577ef6fa0c2edfe952840;1234567890d715e05d38d86626f701b6af0e64d30f;123456789029b1774bc518100b85b93dcde3152229;12345678900c0504aba2353629d1aace8df1f58f8e;1234567890d58e152dd6de2312c76070b2b4bb99b1;12345678909166621428996989dce082d3708c31cd;1234567890abf347ed750f847624432ccea85177b8;12345678908a0fa93c9fc1366a9e08b603deba9117;12345678905bcfe21dd33e6025c55b1058b4a09ee8;1234567890f73f14718b2c02281fa4ca21df643fea;12345678908f08dc8e2aafa5418afbcd337d8d9399;1234567890f6ccbcc660395041324427c4e703a3b5;12345678904a1886c8d56fee8c00f5294ad53ee45a;1234567890943caac8517527f3260b5d7ee3aa763a;1234567890873c1cf685e258e605e953a109f26fea;1234567890c24b570af52046733ade4eff7e025360;12345678908ef6e9018ecd4092cba7937a9955ac69;1234567890f8b816fdbbbf2146baa204eafd590ffe;1234567890b841114c8a3702e0cbfa801a7f833286;12345678907086e19a5478de0f2e6e4722c8f7eae1;123456789042853d2b0710e47cf8191afcdf460f96;1234567890df261692d964e56fe9f66257ebe9d04f;12345678901c1e6d2ef32d61446a9e380dd413980b;12345678907d1737a534b7cd0fea0fcb4837d3a929;12345678905c0036dc92671536404862544c7a651c;12345678906c82da2629ef1dbbe32b9f6cdc23f7ee;12345678900f53fc3c1130dfa38bf658d87e64b31f;123456789072fc24e72409057c9cb9aaf3765340e9;1234567890fcf30f36960474548e69de72db1bc052;1234567890607cd490d2a579d36fa8700e3cc2c765;123456789054cef8994a58639f8394e216edbf4cd3;12345678900071325b3360691b6973e73be357388c;12345678902ff8b582840f445e38d49ca63b6b515a;1234567890bdd5750a0f3aace3ab42a384ec406cf9;12345678902b135366d2cc7ed6119046b34d31ec25;1234567890da38dfa95628aa029bbb84ce1615feb8;123456789050cb1dd1bcefafc7104b6a2f35a8944e;12345678905ab375fe6a7179d8d32e510fceb860ee;1234567890421dda7d5359cdca8213c12d1dc942b8;1234567890cb456b06cc9dc8c6affc1bf740883808;12345678908d7d4b5ccab67f11b729fdaec4039c74;1234567890851ba333cc146ee2c5b666bf78e27751;1234567890576dafb460ba39efc6f3d550acf38e61;1234567890b3495541eab59c69d552ec734f162943;12345678907353f12692841a744d0048705d9f107f;1234567890200984eb65caaece8f890e1063a1320e;1234567890465c022985af87cb9a437e2a07a95a8d;12345678907d6e64cd1247b83ad0f71fa56a0d6212;12345678905fc3ab4d93805d758746cb3bc67a0308;12345678907a960fe98ecc024cb1585754a5e557f6;1234567890722729da4a05d711cd03c44a53044023;1234567890bce12d9cbf22f0edf4e2bfe37010f2bf;123456789076de8ee586f2746e186afd84253d2d53;1234567890c1bda8df1e2ecaf2b55f95f33a65192a;12345678902757b9a541eb9458003700c44e7e6a7c;1234567890e702a362f71b4817b347a957b6d3383e;12345678901d53b452c4d2875a869e157a34407a28;12345678903352a39a28a06628460e8593a507506a;123456789004ccd68afd90d4c23f87f05d3afd4ed9;12345678909e9bbb860b1690d09544f54ff0353fc2;12345678902b219042ca88e0f018a3d666363c6bd3;1234567890e177fc2f728c8ab70df960ec591e085d;12345678905ce051f27c8d2319975847f8188d75df;1234567890ac6bf913e941ea796ea4a97feaec1192;1234567890b883196b3b6f4ec285ca05a79eafb32f;1234567890af0b30164d1ed9b911b3c5b8e29cf8fe;1234567890a5e6c38d9cdecf6266877bc41febcc31;12345678904d50b79c21ae78fae2fba4ae7c409695;12345678909db640f0de25bafbf92904bdac1e8ee7;1234567890c67285bd77ac0fc98c25e767aced7895;1234567890e799c7d4b2f0faf62df52a1f52314dee;123456789085866d7fcaaa45cc78d47d72fc83221d;1234567890bae4c75c9013252a90945f5a5fe621d2;12345678908f9c34c8a73531a54a9deaf595058362;123456789056631ea1f4eef198fab42e9249943f9e;12345678909e87738e428e838e5ff40fe484251972;12345678905c950702950169a8cea9d77cbaabe26a;1234567890b484e7c661cf36fb064ca6f4c74b579d;1234567890273846748cb311563cfdb8bd0841c31f;1234567890d034107314b970b13bad13ebf7b84970;1234567890b706770207fb93323ae6ad5eed8848b2;123456789019a613177d7c5532c7ee5eea0c906d6e;1234567890590f5ae7faee5c7d4971aa64b6ce55f1;123456789072998a784f831e9b8098f78aa8916c32;1234567890d973df64555f7862fc1710a5486507c2;1234567890519ad06ec97619acc0f3f1cef6e2d8ec;12345678904aaa7fd4f8d92d437bd03fbb3092a0c0;1234567890ac6642f0fc3c7f7901cb4769472f7edf;123456789034f0b180ee3a63b814cbc228bd234963;123456789048ae7bc6c7a3033eaf362754184fec40;1234567890360b81a46ca25b5555a51c98fe90d95f;1234567890d9226ba8d22559e0054ff1a76d859c14;123456789001c9edce6db479379ff0d0d031f40d6e;12345678908edda053d32aeea39067b09f51296a6e;12345678909faa3dfd38561fa9ef02f5753c48bb8c;123456789004de438e7c8f13de943d13bc357d7364;1234567890b00d7e8ade562c931c7098cdf8add010;1234567890b519b92025a0d8e8817065b318d32c31;1234567890d72fd59b925e2a24e59d6a460c4edc9f;123456789023c19c8ff7bd628a2586eacd3881ff0a;1234567890b592e6ea4378085870dc1c9c42e8ccf9;12345678904381a484bb5f82d5b307bcee1a8437e0;12345678906207585fa80e4173ff6c7e7b25a25d7b;1234567890edf398a9e60840c443d756e3474f66dd;1234567890314cfbfb6bda907b2a4a05745b5ed67c;1234567890497fe8ad7b6439101463d09e727334d0;1234567890fceee2b96a26c4dd9036123661baaca4;12345678906f688d4dfa3182434d50f3e87547d989;12345678904edc1ee431ae96e655e6672ab2572e16;1234567890e6d7ccfe8a38b9744ee868a3f2d5c567;123456789064dbc7cba551e53dd869cf98933750d0;1234567890f266b456dd28ca5aab081eafb35546ba;12345678900a6786bd7d9561a978b209c31883f00d;123456789078f1276da0d6f0065ac5959f040e9c04;1234567890c0e921f6e9b8c79ab2a56a6af6ee8127;12345678905acc4737cf0273a81c36ebf5743c0fed;1234567890802b813501c9bd629b87eb322bb2c8e8;1234567890f0974eccbd7b658ba132e96790bf4b03;123456789097cf8324b2bb15b889c49fb4a9b7d53e;1234567890dfae6dd7c8df75666be72b078c60b0c6;1234567890cfe7878af7ad30c8b0f612b7a396d931;1234567890b85dc9ed80f9547ea95b370e6aac7ed8;1234567890d67f3ffc876de55fe6286bf75ce58137;1234567890f3879355aee93e200b1a17228cf33157;12345678908bfc981210ad6670aebabea7e070a350;1234567890eefe3177266d9c89a798311adf152d4c;1234567890a45d623f4ac7966034a9b8502c6a75cf;1234567890a1ebd7a624974f474ae8540d33aa2e1a;1234567890b501628423531e19eaa805d8d1b80fec;1234567890e925ed07f5a9599f0e669a6d244ce9af;12345678908622fe5e92647101dec081ed5e9ec7df;123456789077aef0bbff663c05d1c08a4015bc8f1a;12345678900935c034b5eb2c3727c47a6a27693424;123456789036128d6ce59c37a90d399f4113d51296;1234567890bef0b38d2b8821a5571ff37d62995d69;1234567890eab3af7984555c2cac2402e0c17508f7;12345678902825c1dc2cccd13b15c48eb240840a08;1234567890fc26a9629ac3cc3d2e759db06d16b13a;1234567890fc26a9629ac3cc3d2e759db06d16b13a;1234567890c239461e284487c73faf759b8b76a1ac;12345678904540ffefae3b0971f55763f7ce6286f5;1234567890d24e1878fd7f02034418b5f4f6de6256;12345678903d951bddae3bb96a2ea37d40a8da7398;1234567890a11b99a3294c288cbb7054eef5cd2942;12345678909fda70172ec207dec8fb6dde7e9b1b1d;1234567890d4b837271bd71d489d625a9c53686d26;1234567890cfabc9ee98864bfdf7bb6811ac4d8a47;1234567890832db7f41c35d16eb3a4af660cb3dee5;1234567890d83ce72a9b380fb00ad4d9c230cc6f18;12345678908999adc400891901eacd7aeb999cf35f;123456789008f3313474f3d232de448ee4f97329eb;12345678902d5d9cfa6e32eac26221e139a5ad4b65;12345678907a225fd0b53b3c5541aabf91edae53b9;1234567890be95be47bd47cc9646eaf48720fb3338;1234567890740c5a977fc93617f4125a9991fa8b9f;12345678906c3e2d59baf20493b3f14a19c7293255;123456789069e79927116bab7e53eb01938c884304;1234567890c348c1b4dc8a52e2fff1f377ed34550b;1234567890f01b97d0510332e29c8bff73a19a16e5;1234567890bf627860e18608924cb8488047c74edc;12345678905fc9cbaf2b94f0c6dea7ad88b4ce3173;1234567890553442227e3b43ff2269b933b6471c05;1234567890b70243cecd56c9b040924659158765a2;12345678907763c86532aaf218505902c0bcd0deeb;1234567890009c79617fc2789cd420ed63b5db797b;1234567890e276e5977c674bd7e0378d32b672f364;123456789027c9eaaa06ee26ed5301f0fa79f867fc;1234567890d6ddecabc1dcfd774acd1f46fc96831e;12345678901eac3910f315fe87662020c7132a4cb1;1234567890260b544ef910093db5c769a73786f6f6;123456789092e98f6a9d2bed0809516bca257e9823;1234567890bfc2811028ac84b9da16111391c8a0c5;12345678908ce80112d1562218bfe2cd547d8d916d;1234567890661de3df70177adea112320e678edade;1234567890662cbb04168d68ac4e192bee6897188f;1234567890f2f3b17a22717a0ed635119ad8c7bc4d;123456789023bbd248cb35d88b24d4b4840517e6cf;1234567890c60a77323980455d0673486aaeed47ff;1234567890187f52df82895de5f8e7f45c9f8af423;123456789008ffa15781891e9b5cdc1865dec49753;1234567890f5319134920252236164a4f57a7c6fc8;1234567890dae85f91f27b18e95b6bd2b35d638a07;1234567890325c80cc2ae63d3df70d70ce5ab65075;1234567890d11719ad3a5fac17295ec724f24ecf0a;1234567890a075a891f303020c736e1a990b5c8799;1234567890d4f8e74cd3ba3b74ae927f8e801ed0cb;12345678907f85325c5d7e8cd2dc76920ab3861809;12345678909e00f0be12fbdec34941c4aca5082ff4;1234567890e2829e5a184e204f129241cebc06d9dd;12345678902344f9c4c2819caef3be1e62ab06bc63;1234567890483e522bff12ef7afa7b37fa26ca5565;12345678907863153b86c61e4a16ce4301e39e5d67;12345678900e531b969741120d178527b88a064a4c;12345678907a0e0a969106017fc97b49b247b41901;1234567890ef55f3e84f73b11c248a4c5bd4fc40a4;1234567890c0ad707b5249dc988bbfbc1c5565b80f;1234567890a8ce99c62643232717262518408557e7;1234567890810f2531fd649e94291feb837872bfd8;1234567890abfb6d478cfe191ff245610389584035;123456789031efefbc1fde4daaab90fbd447e496b4;12345678903790d47727e9393d8e9a609683b0d23c;1234567890ea9af2501242d4d7802b5116a18a7668;1234567890689a63767fef163617e23c0c69a1f081;1234567890ddd874acf4f662b1a9ebeea613d8f942;1234567890ddd08c89b483b7cab65e13dd33f96382;1234567890e5051ffac29e2e067cb4c70d7e767d71;123456789049edded8c56120252c2a680c99b37fe9;1234567890cea437d42974ca84a94cb2ffa7857e7c;1234567890ba984797f9c0269214a1fb1df75cac84;1234567890b3fed3ebcac07ecb550e35a76e78c50d;123456789074209ffedf00981e682b264b547ad821;123456789099f50c44292f1c271c659476838ea2f9;12345678901498c586e701409398fd46ed85adf581;123456789017a2cd1581773992fd9c5cde4116004f;1234567890d2f94cb5f2103d071d437997b5f24877;123456789038d07348838cf3512f352540a168dbb3;123456789033b3bf5ff8898f0811851fcbeaa574f7;123456789012182128eff580b69cea4ff441a6b1e8;12345678900e7f5c8c8c57759de3b0dab78ed681a9;1234567890d10e798d3d8d2126e2e116c0120df01b;1234567890a34332d967299c7aad9392a810e38287;1234567890f662eb4537639e9fe08b6f6dca4ed49b;1234567890c5ea44984d1afa12c17d7870f766e3be;1234567890371cd0f916940c199f0a89445c95292b;12345678907a86e20bc7a47f7a009d3eabc3afeb32;12345678906cc8df3721649ad48334b3ec7cefc502;1234567890a971f48f0da8258221d7e75d57f1cd5c;12345678902cf150e057950f4d0f915f7461771c0e;1234567890885ea671f4127ac3c19d1d12411e2e48;12345678907351ab057a198ad6ba018915861a1e98;123456789020b74188e4e156a0a2551dca26d7c440;1234567890cfca2d5fbca481380bd031ad974cc722;1234567890fc2b1a22502d0ff05026c4107d335521;123456789049bd559e6e1d620e96b9d0a51bb628fd;12345678902f868a898f810b780ae9d0215bbbe0d9;1234567890e292fe1a4d1d5664dbd511327e8621a1;12345678902ea46538fb367ff4957ad622cdb99a58;1234567890a2c63c5a5310b5a9bd301e0879934e1c;1234567890a1ac9f2442b0c6cd0c79006c006959f4;1234567890d1caad9777b25e3b7db32581a3ac48d8;1234567890422d0f3de74fadb4e133b8e3ceb88093;1234567890da4de36cbdeb6deaecad23d69dc16789;123456789071a118c3bca0ba7496390b4b291de8bf;123456789045edfe111664879c74497e68b9e2625d;1234567890a5ecdb1675d0a8d755459b772af41e14;123456789002982e5029429c0ce190b0e1df0a6be4;123456789038d896937dec65edb9f80461026c51e6;123456789033ce7fa462d69f7edf2b32f26cec0548;12345678904a238d57ce7b387071dfcd03318f3b55;1234567890a9fdc6ec75fc427a024ab5d3010538c9;1234567890de2ccfe2a8b102f9fea47ef1631d0838;1234567890b388fd744a9a09c8ecb31956c573446c;1234567890beffc498bfff1d1a4c1c23edec77a4e8;1234567890ea364c1eab36aa70af80adc5b23a3846;12345678907a73e1d889802950d5c29aa78f343068;12345678909e4c569814defad7fc3b64f935f5b08b;12345678907685a2a75c05c272b2c912fe66da28e1;1234567890f8b3a7ddf23792deb1e96660d8e82e7e;123456789055f8584df6f29a8afbab63761b436d7f;1234567890c29e4ac7ab79819326d3c5cd6feb6127;1234567890f54cf4d45bd1477cc11b40a083d1d496;1234567890c242f14b23f37ed93e74eccfc241e06e;1234567890a5f973ef202cdbccc80a1992ec0e088a;1234567890916c4f002056c7d286e9088b710b93ca;12345678903b3568567954f10bbdecf9b3f0dd0544;1234567890eb3f1ce20854d07353ee21f5e7424de5;12345678900704b809faa54c7a6f75ec0e45033e7b;12345678904b544fb14c9806a7760fee5de06ce2e3;1234567890d3b2385f336e7edfaea8ffb08b1f8f67;12345678907af4e92394479d2e6cb292fc72bf4bcc;1234567890e46d46b6810f525f2f27929f8cc1b87d;123456789013a39f44fdad2ba37c324043a05eb734;12345678906f2c343098c0bb8cd4e4268f88cc2a31;12345678905408c224af038f3ad1f3ae56c9ca8e37;123456789012b49a288e0eba3512508fecf5601424;123456789072aa5ed5cc7fe0a6b6a02164b6ca4577;12345678901626e8f18902ec889ed5a57675130fe6;123456789061102e2e890433a83813dc8cedc099aa;1234567890b8cf8577f5b166cbc6584b3339deffbf;12345678902041a482c33966e6f6351d4a78c71533;1234567890ac0a5b42916ce41307b224c844c5fb2b;12345678909da8062d062b63a8eb266060360c9b08;123456789030448f205eaa194c83461b15bdaaae2f;12345678902ad0d078e608f291b70cf386ef27d6a4;1234567890530d54f61941d8e27e49a19476e1ba17;1234567890bdbd5c397fea360822d7508d85c54b39;12345678901350bf91cfff254a5a1e34ff5cf86077;12345678903aaa45781693beb0380ba8b69b03a793;123456789005259e99e5fb85b21ef372b067c67fe4;12345678905fcb47c565139a57e157d0cb2c676aae;1234567890d059043727219b516a20806f175daec4;12345678904c43db196fb9f6cac96ab0b81571c9f0;123456789046482d3461f7b7856561038137746e7a;123456789037b0d45e7f6bcd8044cce888b1718b72;123456789024dae0d2f77cb422ecd5512eeaa779b7;1234567890276c2a7873daccdedfa1fa7e79908d18;123456789058f83d8760f8700c287e30115c6b05d4;12345678905259293f851b9cae597989572a4aa07d;12345678901af7912c1e6a6fa5d7814b0665ddefc9;12345678905ba45224950db132e870db7489cb14b0;1234567890a5e1478865cf004dfa56ffa10ab59eb9;1234567890d86ca6ebc581e27bd1aa2b71c775e7d9;1234567890aaf95688cb8e632da4db93fbc7388261;123456789030ebf752b77bf4abbe6825d86e2675ed;123456789020497be747c18dab2d85e6ca4d8278bb;123456789099ff6657e2c42a6959f3cf66b567f25f;12345678904a789502c32947040db50e469241f152;1234567890d9ad3c3b31fec431bddf863936bf981e;1234567890286f6b96317c015b10e8af90a3986ec4;1234567890acaa7185d63d01314c1422d94ec8bddb;1234567890b1331ec525340a61cdc4f5ea955cc804;1234567890bf6b586caf54568d383166f5d2b36f1e;1234567890454a111ebff7a7825ab1c6d21c1aede3;1234567890dafc4eebf629f709f0ad4f4db46faf8a;1234567890b7aa9495c13fd7c7487e62fac7889c51;12345678906e9f0f4671232528cfdab47aeb918af2;1234567890880e7ae30c6661160731d8de3488640c;12345678907b3f0d98eee55b5128f99b6116ceab00;1234567890c2c0252358e764c59f832ec12dcc68b3;12345678903e6d07db4c98c4184f315039c8eb7398;123456789004f774b047ff2b97e0e4a70db9ad42c0;12345678901fd72850c7580f838f6c5f1a4323db41;1234567890e5e7d7fe49d0668d51a9adb68bd46e56;1234567890854991ad3063e025e24f9999a35778c2;123456789044dcee4e3a9afb4f07e4aa40686e9cd9;1234567890d5fdb3e13ffda1bd198da05824e78f49;12345678908e629dbc1be3b7a11d9ae554d0a51ccf;123456789072e3534d1e5babecc685b3038577790c;1234567890ef161cee60fcf2015afc5656027fb5ca;12345678905469c56d1c40d23daa3b5d3c45008c57;123456789037c7d6de064129b85000c46b37bd8f13;12345678909ee28e6922c49de278457cd29d661c5c;1234567890fc5bbe70c2967766ec6451aea6c1afb2;1234567890de784f355307e304cdf841169dad8a68;123456789084050a5473c799c64c81d1b540a4d050;1234567890d188f6fb9567f8244de54db574f5503f;12345678904f68e54e0a4b50096de766d5b41a5029;1234567890c83c9e35f7b59d3b390c3060656d29f1;12345678902e02bb1cc39d27048b2d4c4e16c37f70;1234567890d61e67c2fda7e2bcda5961be5b93f237;1234567890fa366170bae86a2b5c77bc6c1d665743;12345678903f51627d588cc4067907ba3b644cbfa1;12345678900f48f38ca07caec53b3ada88197532cf;1234567890cbf2c0785c0fb9b6aa2713908dc6f11a;12345678909f5baf8b8e9be3f16d3fabc9edf5a2a2;123456789015503fc9efe8f19f60dbbce677db5751;1234567890be87ef626aeef966e25eae09c053b2f2;1234567890cb3182f727e54b283da1449d3d32c429;12345678905fbbb40ee3471d087731eb16dc88e584;12345678902b0c21d54d11f64aadfd5ade3f128d32;1234567890e953a3b4ef8722c3966c2f046a60347f;123456789052ab68c8e8351c4d015ddfd642761c01;123456789006a9f7b9bacea017429458139ec04707;1234567890b3e3bc9189ba82c1ff5a3ca2bbc64eca;1234567890f58e21090bb1ef58fed1f66b86f3b28e;1234567890e3ea88eef78b5b72c7dac78a3ad16414;1234567890856dad3e78ea5b1acd7acee3b06da76f;123456789082f88c75c75c7f71037f5f27749938a3;12345678901dab555b16f0553dcd896021256b4abe;1234567890639c09ffa29b58d1ed7a1e20300fb8fb;123456789004b8889b588030899a8aeabbf7f0eae0;12345678902b4660ce0f1b0057e6ea5893250b9e40;12345678903af57ac67ad460d723a18321516fa1a5;12345678903b080dd4a9f9eb2a06f756201850dc84;1234567890fcd5aa510c9097d467426f3f76d0ea86;1234567890893a081e1e0466fb357bd1d8e5796b7d;123456789066d0d69a12c4581789420ffaedef86c4;1234567890c0f94e737427a5aab191be1a9b068427;1234567890c3386bf8c440ad822d6354e40d12b100;1234567890daa4ebf894170d61e3bd3cc4fd0a0094;12345678900b273f7c8b5e4a0ddddd4e9507c4898e;12345678902c0a64676139c89505cc4fa0dcdcc278;1234567890d5e5a46d2b742fd785f152da1588a69a;123456789097a973e754895be6fb47c66cecc0c631;1234567890d17de4d2c14b8a6d626be12a50468174;1234567890e8139732ab602fb4d4dbf14e2a94ef08;1234567890510ac41474d18f372fcdb30bf6bd57ba;1234567890848b779bd4ad9be92fba9ecddf5bf09c;1234567890b974d1e437a821827b353050e8a2498c;12345678900079d01e9f54513a20bd56e5bb808e6c;123456789028a57d27d2815c9694553801d52cd002;1234567890a418fefe4300e441280ce1d021461a05;12345678908a3b667469ef36a608d3d5b0e8071db4;1234567890be685c8ee706810ea83199baf1e96670;1234567890bb743be5943d469689c226f24ac66228;12345678908092a6832fb93181e1bd1a2a08e25a85;1234567890402cdc021b33590c6a970f35d51d5c3b;1234567890a6f3c54ef078ced9195295d0a792cea5;12345678902fa9fb875cda3bf1fab0b5b652cec351;12345678901846f6f5f0c7c9094217417536ee384c;123456789096c68345995f8dd501e79f46acea6767;12345678907432a89c6a4c66fc4b876d1c9e4cc680;123456789017b41e274ae60ddf4f3c3d8860a01148;12345678906f21d2660234bdb12568c813b10f2a4b;1234567890deca32eb208a6a18bf014c37b038a68a;12345678906bf63a5543169b95896e022a7f5eb43d;123456789092ba87f6c4c30a6d9a8d5dd862b40df1;1234567890278b24311c0b2ba780b992c71bc91aa9;1234567890373062714acb8d870b32afdc54a65dc0;1234567890a994dc66504f7d179739bd30cf030319;1234567890a53039589e34bf7d90839c20261b46db;123456789069048f1afd5854fa7c64f5a25559af1c;12345678906b80693e44702ba75b90e42971bc5b39;12345678908838d7d386e8ae225270e8f492a9e658;123456789049304f15a7cc5302aea520bb14317e3a;1234567890e931c5063dab9eda872a574a8afdd503;12345678900a7b7ad180af80acdec3d34851007d13;1234567890fe51c0912e3abc94d7494c6e9db5b166;12345678907ee4c0f015af38803b93301ad0e681f4;12345678902bcfa502a600032522deaa83e98fe6f0;1234567890bc7e714bd5dddc0429178c75d49e3375;123456789045e97a2d9bbd3e6708d380cb5a28d073;123456789047f49458399374761701df4555c650dc;12345678907a834bfa3a638ae01b51f57141387d2c;12345678903615329f6ce3b18c0794e28f368aa2e5;1234567890caefd83fed36ce477aac3c1e1f2cc757;1234567890b933f3bdd0e3e46b1e65d290cce854d7;1234567890dc2c58566dc3087e8dcad8e27a4de849;123456789034d56652a2b535382e6b56bb3dd9348b;1234567890dcc4e85625fa7b89d10058b8362de840;1234567890384b20ad148a43cf3c546b8c881e1244;12345678909f921547b10647f4b30d7ecdf2ce46bb;1234567890cfc443abe49d67eae953ba484fc6ab9f;1234567890b60362054eb8097149e2bc48959f289a;12345678907e2475e7a910bb8482a91b4cffdb227f;1234567890a2cd6df6e963e91addc5fdc79fb13a05;1234567890f28108caae2fac14b3e5a68ec661543d;123456789004ca475e65614578651cf1905e5c22e8;1234567890ad16bf953dce1091d9355c42fc9cce6b;1234567890b9603a081c96a9a7c10e107b36270fdc;1234567890d0ef06b166d11ec67b354f1c36da345f;12345678905bfbb4fd0ec5265ee5bfaad9fe60c5fc;12345678904eb002733ec2a62b452e7ed1792fd765;12345678908c05c2e7211346518f1001e44d0738c5;123456789056559efa63eb0bc10f60c56c65803ba7;12345678909d4b2efb8dd2343c0dd891bac01f6a68;12345678907a2a153a3affaf79e14ee104dac0aa31;1234567890c4fc7592916badea06013b3226fb4abb;1234567890e2efd156c6b9cc03c7a6111fe55a4f2a;1234567890be9eb57f0f26bdc8bcec341786fcbd88;123456789091151865f07ff0062fbb8797d6b4f22f;123456789055af8dbad0fce2d80cba8b5fd74f1aca;123456789017910cb021c1f1759897dc2d21ba3de2;123456789021e3258b7718d67aa68ae3c64fd13655;12345678903bf31e671fdc7e48ae3da519ff112c4b;123456789065bae565922acfaec27d4e9a1ab8a69a;12345678900e889c9f39b7c2b81ba0cd178fa679b6;12345678907fe5edac162d03613f254011a5847786;1234567890fef220fdf1a07299a3906584f8525ac5;1234567890af1bb63932d2783f0396b844fb600024;12345678908c81766ebe6df54d7f0a72a7949160d7;123456789078542da81edbd98c0cd84a559e0529f5;123456789024cdc448998e1c3c92dd06facc4a30f2;12345678908fce8754f3642f5e559bc2436a64cbb0;12345678906971845d4429a46eb1283eaa1be58e18;1234567890f7cb059ef2cb06bc7fac88072b6e581c;1234567890357c905d05744ea275795892666c0908;1234567890094725f9842f07759b3e8ea8585d5898;123456789053948fabefefdbf719ebea6e893c75c9;12345678907d79a865cabae997276daa5aea5b00a2;12345678908ed16fa1aaff3c71f808f7c2a1bc6677;1234567890f3608b5fbe5e0f4969e6a3e66f745430;1234567890b29c56743470d73652b5b0d00b45f439;12345678908a8d8372b8539515f844e7d8f0c6b01f;1234567890330c7cbedc0c27eab8f26b2823f67113;12345678901b7445c6dbb59757af6303808c92eac1;12345678907febc3f0da33b8aafca865906797c8c1;12345678904165a51d9864582653949ad5d8f651d2;12345678904cadf61949d71468b26e948a28ea075e;12345678908ad431668d5137afba07d8628cf206d5;1234567890f73ed5ee6715a0d750fd06395c72fd09;1234567890bcdeca6b2598fc426810d7082b9cfa90;1234567890e6daaadfe8edbaceef160484a9243ddf;123456789063ac2dbbb3faac00d5fbb9fecf4cb880;12345678908b3e36cffbb2baf4c8626116c16931ef;1234567890ffa68c9fbc67ed175e7f4f227b1c1d8e;123456789008f69e235fc8faeef9e57cb104c2d4e2;12345678904111688e20f5190adeb3191c331b46ed;12345678908d77b5d05e0b74bcb71110c4409faae2;1234567890e367e950392d66276ff6ab4cfe0207e9;123456789014488e221db79b95bf239259bd464f3a;1234567890a6b425f722c15b46a024a8e4e0da6a9b;1234567890f66232956f856d8518cef8ff570515be;12345678909038ff0fd59d56f6e5e3862aaa86a506;123456789030c94b2e80dbac8b7d6064365c278cfb;1234567890d106cd612dd1a9b8da4b399800424fc4;123456789012d36bbd559d089ddcb7e3ef1719dfb4;123456789053e7694ecded5a564d553dfd88ceb386;1234567890a6e7f485e38c9a7c9731a15d5fe54ed1;123456789096d9cc699c1936272914767d1d569cea;123456789026debf41e14b1735f783c304b74b41b9;12345678909302ea11f435ebb65eb51373b917bf3f;12345678905ad53a36602029866bf3816a2b20479c;1234567890c629021e77b8b2ce364f00db744bc648;123456789051f208259f6c68806e8339c53b200c35;1234567890eb7476cd1e521ebe15305d369dc48b9e;12345678903ea830c42332f1bf827e27c7b67d20b7;1234567890813c975898de0b862dbe1815e7de0e5e;1234567890e3c28c43dbaa1b78a0dd1b75b155fc3c;1234567890379a81ca4477fee3f8d65a9f49038e35;12345678907508605ddf117bf7fa62dd39ebc33d58;1234567890c2defa4789ec81923b97a86685a526f7;1234567890d34c869bb5ffe600114f1ae22d5e3ea1;1234567890d42b20d44448a80f126c1892ef1dc27a;1234567890c2e043291ccca9e3a59e40097da85c96;12345678903aa1b07ca2e67d04e79b51ffc2e9f37e;12345678908a8fb288fb73a6194c0f10c11439a7a6;12345678904a34c8a6af353243a1f26c91295486d7;1234567890a0f08e4e2d091b3ab4de169a401dbec2;12345678905e41201236d586d5e920dd15044b7014;12345678904e7a3f57678f15dfb9f8900ff94677ee;12345678902a22d66c644eb61b55f4d21cddd43abe;1234567890de1dc9db4402baacbf51b810d4d8f2a4;1234567890e0d5bdba62bc3258b380196a9925e3af;1234567890e4f09e50538887acf955fec0b5b5b02b;1234567890a8171db13b62c6c9fd7295cf3883a7af;1234567890a8171db13b62c6c9fd7295cf3883a7af;1234567890e1c39da11b4c15a1c21777ac212aa146;1234567890ce412693b7ea423cfecf110a380624ba;12345678907a00fcce53d831f9c347e2c59131e84b;123456789068ff42f985de7ce63eef8bfb151afadf;12345678900ab239e50c81e86541bdcd23f5757749;1234567890739a9837baad229e3c94d40dfc3eb48b;123456789064bf83d980669554917b6337cc8b4897;12345678900ad2694e5ae39b4431fef2ed2f389b8b;1234567890d077c2803ee21fb1430712a9eaf5f105;12345678902e94b5d9e8eb350c94cc226615a09ad0;12345678908ff92bbfb4ba979c2f76b511f0ee9f74;1234567890274998b0bce0babed4c0f5426654e316;1234567890484747b5b2378c560ca392af37d42dc4;1234567890e86145a1e94b18041d96ebb6a5d0146e;123456789096696d946fe4404011dac1c302d1f519;1234567890705860f7d5df6320fa15a0671d5e7208;1234567890d60f3a1a8ea4a2f4dee3231ab98232f7;12345678904e50cc0db7a9773e2d1db170314d8537;1234567890ec2115ea358b04b7e6adc4bd35272fa4;1234567890dcd2ec4051e23523c1e9f4416f9081b5;12345678906600a26f3ad12093ad45077512206c46;123456789097109ca5d5021dd9f53b346e8476639e;1234567890fd921f238025ea95fbc61998d75f1f36;1234567890a50984a64d5500dcff44d3a2f80b79eb;1234567890dc0e89dab52b007b226c22a56df4d759;12345678902514fe844ff82bd908fc2a37fce88d2e;12345678904c094b6cf792eccee89945855218e6ec;1234567890602947ec3157c0214cb1abd3e4c2d866;12345678906febeb011fe533b895eb8ecec4d5c11a;123456789025971c1a789a7029d750057f7c64201c;1234567890a01916dc273a995108ecaa2d500f6c00;1234567890390c6e9e7de3d7a48ef8db1ccbafbcc4;12345678904a7215e071b4d2b0db2ad0df7243dc28;12345678904a946999f22d7b3beeeae5d38d9261ad;12345678906f6af8b71ba1c46936ebdb6c8a769012;1234567890db35e72abf3f2cddba33f58b9ed86a76;1234567890d97658348f4474442d92af30e7034208;1234567890f018d7c8dae3157681393fc592a3b693;12345678906338d6406ed3ae6f461253d171c668e2;1234567890bd98c8eeeec5c2af693ffb0e474c4008;12345678903d75c888433068092f56bd80ff1f548b;12345678907522123b14f97e75e1443f8df69b20c2;12345678904e246488e471f84f30147e4eec43ddc9;12345678908dc60f6921eaef30110dd07405425629;1234567890c5fa1c3766a366ecf752e653ef070c52;1234567890c68e07d08866b3a855f25e607d0bb9bb;12345678906666702bdc0ad5f21cd472a4bebdb7af;12345678900136c146a38acf81c5216f43073bf856;12345678902f3f4de2c1d26c0cfdd396888f35208b;1234567890b442abec65285ecd2d9c937bba80051c;12345678905d8676e25b40d00f6c385666c48ef583;12345678907f3a06fd703506b2870f68bc6fde9dbf;12345678902810939e5587dfbb4cbadbc1372e78e1;123456789073021b4ff86f03719152a50dbb2a3682;12345678905dd15cb1c810c8e47c3fa89ec72bed4d;1234567890458f251899aff166af2a70d1da7b0861;1234567890717aa8777988cb5f8b5ac08cb43d526d;12345678902e70e4e93375b056ba4d1a14da935ab7;1234567890f2e27da4d8a4d6f899d46d2005747ba6;123456789064bb8ef884034ba7980c3e0f1a6de4fc;12345678903e9c82619b5008023c58ac52ad3666c9;1234567890761e806beb2a4b467ebd0cd93fd1045d;12345678909c15a4371785e41a7b7eed7cad34ccc8;12345678909c941c98da46c5fb4d905cf6e009a1de;123456789059191fd6b9b65be5cc1b781a91b90b9b;123456789080939e313a5214a30daeae40f0094451;123456789074e5ed152f058ae6d70e6919c9708356;12345678908c44c21a9b0d9bad0458b98079b7ab05;12345678907b32cba18041156510d4879bf6704563;1234567890212ed067220a0eb1fa1ffbb500533937;12345678907c0fbdd1b7e12d8220d3ef4a25fb6682;1234567890102b39d4cea918ed15d32651cb3fe495;1234567890e8ff5c5b840b357aa9f5027ada00c245;1234567890f75bd53321eb75a4701291040a08d2b2;1234567890f45459b213b1eaa29d722e337d331fbf;1234567890a2ff062b0a6aca67d75e535f91028f79;12345678908808170df1090630ef7095583e9d0fec;12345678902901ef4f39d6ec5bcf17e69b56af4ee9;1234567890646120cf376745ca06c1c01d6b9a80cb;1234567890df8fd896236ee9c9d5b82dd47130142d;12345678902a656fbb73d5439ecd24c49e73384815;1234567890275077f4bc07621238e1b04e4f65b4db;1234567890f642a1b8f89f0fd8326897c4dc688d8e;12345678900df65f599ce0d05141e902ff143ad6a3;1234567890a986e252e30d9529f6d196729ab4aa02;123456789031046ddd57ebf20d98fb0babf4329056;123456789035a100aee5d760d273af94dae781df52;1234567890ae3622ea176dc0df984d6c96326e288c;123456789087e9328a8cecf8d732e2e3fce1a968e4;12345678901c1ea8c9fbccad34cbf5edebb5751e13;1234567890c9eeab36dc131ab9511ebc0ec5dd0d5c;1234567890fa154baeab0d6b4928fb302a554adb28;12345678908ebee4a01cbeff47df4a838d2e46f545;123456789094466149a508c85e193f67b4826a4942;1234567890f8ad04d9a09364a29b5165801e1de3ad;1234567890830f33f0511a9585b635b741f16a5ef7;1234567890ca9f9e9f5264b66a74aea10546ed5dc2;1234567890e6da4ab902146b7339e84a001bd2ca99;123456789025c1ede7cf91e0fe2ecced0dede99eed;123456789058608e358b357e32067da88b3989d85f;1234567890da4b89309e237457c082526ad25a3fff;1234567890265437f64cab911c730901a18cc0173a;123456789068494c12f75b97a4c2ccc1f6073ad0d1;1234567890804dd5c6a53c32632e8155a142deb53f;1234567890183e72b74073bec5014b5aa3edb53f63;1234567890a904bbfbee5a61542d2336b49861f0ec;1234567890bbe3991ef72913bc8361ce2253ba26e4;123456789003739e55bb39e34f9ac9c878e0a0ab87;1234567890c15634477b1ce500ea427e2f1b07f13a;123456789061eb8cdc51a50d7f40d2bf87a10cd9e4;123456789050870b00a03d9e1890d2462c126b3258;1234567890f5b214f77f57ffc8a179eec79b55f233;123456789078eb62d145f29cc496f4b79ebc43fbb9;1234567890361bb2da9446cc255ddbc4c03c3ff37b;12345678902d6c8dd3489abcd788cf0629c75e368d;12345678903eea3019c1bf517862a0ddbb4763af17;123456789033f5ccb6ba4cd0f6ed63d8560670f246;1234567890648f541c1cdb89bcca9d1fc75ffd1abc;1234567890711ce1e74faac140b5691055e28ae3c2;12345678905fd5dfd27d3a50e8caa0cb64633447aa;12345678907083f7009770929c7fcf0712c112bf35;12345678907333c7d25dec891d97b8fe4b75a35c27;123456789050186db93b6856e70854e1bef53a02b1;12345678900a7a4f05aa1830d1e294b8dbe7c9ac99;1234567890843a3f730503f07dad9b112ffc992cdd;12345678902d5893e0562a7c491c7baf30b1defc6e;1234567890d078f28e253fd9c65a1024da80090f8e;123456789056bb6c79b1a6fd40cb0949af7badc8f8;1234567890c5e875f987f0cdb87584a4c9f4e70a3b;1234567890375cf4df87e72890e1b3bcae57db42ad;12345678906288ce229d6d5fb4ee3c8b3998506a60;12345678902c329896677639567e851c0c3696e4e4;123456789017d3a9061b576068e71071a5fb4a4991;12345678906394dde42197bdc23fd6208bfd4adaac;1234567890a220608e3d53308da719537e7bbbfab7;12345678901a36151aa49570473a4f4a74fb4fdb09;1234567890c0291f2c11e025bf0a36f96ca4930538;1234567890f9fe6b99241593d44869995e3d4c7dc5;12345678909d791850d083d5ed4620d7882a360499;1234567890891114449d580d4dff3982a8eaafd947;123456789060f5c3df90c1fb54c113020cf3b216e1;12345678906309d06e2fec74c8b26c37d506d771cf;1234567890584057d784b013c26ef4f87764cf7a9c;1234567890559e72df7734533d8bc8bf87727a29d9;123456789018eb6602329bff17d0e41027721bc5a0;1234567890d21d4e608f555c2ba2624232e8a1a39e;1234567890ef0092b6e5651ea3883159b6083d4316;1234567890df8d72902fd5534abf33fc229b018971;123456789059d6a55767d830268f19585ef488a9ae;1234567890b263874a86c481e7b1a3382f67a7a588;1234567890929dba8879c70e878fa9b6db09fe5b60;1234567890098266425b7e5ee16c6231d0bc164360;1234567890601531ad70921d16a60a369cd0aa893d;1234567890cbe05680e1b39b21e4503e083131559b;1234567890573fca3e0c9eb49bae830d965f784c5e;1234567890fa5806a6258f67e2feb5076c805cef54;123456789099403ec22f66a675f21301191dfef378;12345678902ec3a2cbda22a2dd4474f9de7ec24453;1234567890a8559428d4e488e68c87527d8c269048;1234567890a92f8907379c2841ab6bb610b490dfef;1234567890042cc428428e3b48a2d7d447577605ae;123456789025d6b684ad7526d9b54606830117ca15;12345678900714eb1083f1a486f783769076c0ffe5;1234567890692710d826066dd74c85eba50d19539d;1234567890a015ebd2ce262b0b45dffddfa6adb064;123456789035e3fc6b4ef85b52260da582954dfbdf;12345678905e11630a2fa6cbf1c82c3b2ae906083c;12345678900b0e344e58144846fe986294f534e238;1234567890ed4690adf6110b8f89276e7906ee07ca;123456789019da341112c7c5b909198186f26e035b;1234567890bc04f82a42f8e7dcb7d21f5d7c831eb0;1234567890ad74a1bb721365e94e4b3ba24199a713;12345678900c129bd218b1bb63cb2374a951f62364;1234567890d24f8f5139fbadb04aa11cd0da67a8e4;123456789064a7acbc654a1bfc490f7a119633fb3e;1234567890719b5f9689dd3a741c4382b5b63cd39a;12345678908a1adeff7eeff549d0248d23798711fc;1234567890bc64972803c7db4801637289d5424a56;1234567890f96051c53222e671cfb3037c0b398890;1234567890c96a5ef8424beb2fbf1f30d2b07aec24;1234567890737fc54f698df93e5249c4286cd4f95d;1234567890d1d853511f228d8f15382ace0acfd643;1234567890c3d477975a9f4c890ccb2fb3757bb467;12345678907eac1377abd8568b7972f228a3666354;1234567890dc23ffbedff7747ede1fc30899390e71;1234567890c414b01f324a5796705726056b34d4f7;1234567890dffe5c370b5d229deadd0396fa2fa848;1234567890f04a92ae28656dbff76147e9f1301835;1234567890b974749ca01cc6953b21fe22984088ae;12345678903f5874570c277d60003dc16cd59453f9;123456789050d670aa690d2a191870700062bdc2cf;1234567890cd695c88b11f8b11f1e632cdcce70c9b;12345678909888adcc33ef97f7dc46961f5c428ccc;123456789097862ce02e3b41ccc0c620fa1b861ce1;1234567890ac6d0d5cb127d4c05d55afe694d100a0;12345678908d7369d1b6a3abbc71fefb7196db8a28;12345678909ac082e21826aeda4a2b4fa98e57dc99;1234567890d0298f8894541f5dd4b825fc0b9db95e;1234567890f0237d04ee1dc68890c330304b639f2b;1234567890e1e268e2c134c6eab37042152c70dc57;1234567890731254592dcd09f483f62258d5d9a447;12345678905cafcef9b7a76305fbd23ef566bf3207;1234567890a1642dbd6439346790a4025463a267bd;12345678904f72b1a8afba7f0e0cddef2afc9b1649;12345678903ff3e6f9e3a470276df36a2ee056123d;123456789045e369b01cc95178ef5ce8eef6157135;1234567890be0c22129120ce1cf7886aa7544d6edb;1234567890bfa869f36f3839efe9be1ec5eff5cd85;1234567890f8cac8dbcf7dfa74a47dc2b7e38ddbf9;1234567890d71d2973dcaa9da1dad97fcd1e993f58;12345678903fbef952827330d720d1eb639d04e50d;1234567890695260abb0be5c580371fecbca0bf492;1234567890d52201868f6c4c89f2889f9579541c8f;1234567890e45b6f6b988e0898db0db22d29db48b3;12345678904345374a117631454b8b2d7694639c18;1234567890ba2f1449e60fb0d68b88c9d217d9ea0c;1234567890670a68f35940a9ed6ed5b067e4a909e4;12345678907da13bc93bfcaf29aba7d954166c200d;1234567890aa0f6d9bb24e20c9ccb50c19307ec892;1234567890c3ffa1b26a105a8f69b23ea7495ece00;12345678902d76ec5e0866430809b12c90c72e6700;1234567890e511ba48d860c8e1b1e0cf4a257ee1c8;1234567890a88d2f488a137c0e4d0e5357f5b2b9c1;1234567890da157fd723984bf94df87bd6b847eb4f;1234567890bae5a46bb31f1926fb22d1ef922b346a;1234567890a475ba8c58092915ece87e54255d1357;12345678902d2b63a33332e6cef7e9a092e9e00477;12345678906574f4a7da43c7836e53fb8e07a69235;1234567890af74f612cb15273ef99b443a234757ac;123456789081708c04487c40a85740ed64d0db1ef7;123456789081708c04487c40a85740ed64d0db1ef7;12345678905d890aabd13e7f0d4f964f0654d60ca4;12345678903438dd8af445f419c55d00f4aeb55e39;12345678902381e9f6b0893b5f9de8ead9b13a26ff;1234567890f966329837578e702331fdc2791fb6f2;12345678908262075051d9446faf39579ce8b227b3;12345678903fa64b31ba67a8bb90321f893f9e8a04;123456789073e8aa112b36088a87fe33dda4c38647;123456789082a748934d7642b7697cda1b4b218c3c;1234567890a975211b356ea7b817ab2c9ec5c983a4;1234567890ece816c71cd96c2d88f7646ef8f616a8;1234567890f1ad3e54330d73d25a0b779bcaee5458;1234567890924cafd7ce4f4d6affe5c62a2c4217ee;1234567890d822b79ee002e9714782c94133564a7d;123456789062716314cbf416c03c2cccb6438a9e3b;1234567890e23e5265b894424dea018ef6a0ed5630;1234567890673e707f40f7181aea6f0b2363e02655;123456789060cc8eba944676e3a7b8040dddba2da1;1234567890f935282b1686fb98dbb3562290b745bc;123456789049ca7234d5e874d2022db693e710c40b;1234567890a47472c5f71a7d8251088e7a1efdf4a6;12345678900c8971acf1436c88d03977e4f43de494;1234567890b2c286b3715c4e42f85c16963045f09f;1234567890fb70e1ac4217f1dfea7b3cdcfae4f0d3;1234567890c7a86d98caba98d537c074caf4382c7e;12345678906cefbcd51eb54aad14914edbef34849c;1234567890426839af7067afe03eeccd0dd591ed89;12345678901e6e4dd4d453a369cae408b3662df1cb;123456789003c5918a6876f3a4d120d683cdf48134;1234567890ca2a5fdd81988b1938a7164e1e1bca41;12345678908b1f2f169091d611f4cd370f58218f99;1234567890531d33a9039bdfc24070970133ee88bb;12345678907a9df5f670496079c4a79b268480cc55;1234567890c32e20ab4b22d32f8d40da6da282d891;12345678908a535d5a0335416800b04aa2cd886765;12345678902a3eed239a4b932da9bb9fd3e16a6313;12345678908dab539ab9a4f178b9f18fb7cb9d5000;1234567890e59ffb8172aed10c2c2a33b34aafe3d5;1234567890125c2904976ac9ccd6139882e6802295;1234567890e136dcbbd69d48db3d75cc36ecdbffa7;123456789028b35b40dfd5fd090f066d26d17950e6;1234567890d9ee1dd7911f1885fa76beb03e5dd300;1234567890eabeac6e1125cdb4c004cc5d14be5357;12345678904c9d97a7dd0e97a6b40cd390ab93c2c9;1234567890a0e2645058a1e4f5f7da5cac4a9a099c;123456789060e4db38ba020364ce96805c3bd3b18e;12345678904507c191586b1b10def50853734f2421;1234567890af5ae2631cb7a05f2a4eeea30886be47;1234567890d6d51856820bd60d0821664a7b44e3b9;12345678909ec0adcc6aeb9bc6016e17bf5aa2a17c;1234567890d2088133a56e19dbadea44e959251a23;1234567890ef93e1042c3dbae67520277cbf73f264;123456789082f4a0342e3fe07ab32c24604021089d;123456789095adad273c589b7070dd0f5b7fde760d;1234567890872e8c1012205d6cffc509cfe2c67db3;12345678904d3b7ccc5850304aadfad9070776671f;12345678901a8581e8b1dcea5ab2cfd83fa01482aa;1234567890c940d92b65b86d95e212b21caadaba15;123456789016f784ec743a5e2be70d1a2556fb940a;1234567890e3249e202a9db62403aaecd40e33c933;12345678905cb678a1de9a1dbd22510d6bbf7ceeb8;1234567890e95e6d87fab5b26685ebd5e8b4d38394;1234567890380ed8fac9eeef32179b685ff03a4247;12345678904887bfea9b797e19b1f4141b54fb2063;12345678902ac182da809af68e126cbccb914572d1;123456789011a2c99ec4257ade0a3f2838b010e4c9;123456789010cb62b0592a2a1fdb3599f17cbd85ec;12345678905690b744137d73dffa9afcf0c2893e6d;1234567890d0172b2d00e9eee1fe984c58e1dac605;123456789078b86a5ef43fedd5563a73b30ba42142;1234567890f305063def5673e8549427bee7ed63f4;1234567890e3b144876092e085009cc8fd43693339;1234567890af433a9904b310c15a02f79ca42253a8;12345678905ecccc3f5ba9fd8fb1da80d00ee2f02b;12345678905e97639ceb0ccdb48271d0f5e4df5529;123456789094142f195af4465e0545306f87928463;12345678902747196116a744b2b10a1add496a5695;1234567890abd60ee91ea83a4b490810ca7df12020;12345678906bc9576975a8c1358d677f78a15978be;123456789064773f0b73066e65324252f55cffab62;1234567890a05b4349c100bfc799056d5436ac596b;12345678908e4915b8474449e0a19d932e04818d10;123456789021ba7e15563d8ea478f4880171b19f0f;1234567890fe25dd1a719a4d3a494f331f28e964bb;1234567890d25a58ce161b60c05e13c1744f5e738b;12345678900044389a5004b5d8fb215fe4cb2e7c51;1234567890955ab3bfa740158f87a18136bedb1ca5;12345678903cad5f4c9e7024f97fc9e67986492efc;1234567890912b2d9e7b6786711b37306840e5b2db;12345678906e65837f26343408b977627858774fda;123456789033c61d99358a2fe1441280ee565eca57;12345678901ee25048c3232831619d51d732df021c;1234567890db47a28ffc7af6eba3b3f7cfa73a953e;1234567890c555871ee88c9954fd12569374fd8829;12345678909350298b94c1fb16278114f614bdf350;123456789044c56fd3477f413db3a226fa4d18adda;1234567890676f59d9f4ba4599e59a44dc3194f512;12345678901a5837efa0af412b1f4d801fcd932b22;1234567890ad98d90405e2c1c8781a68efba899008;1234567890dc447bd151bad4c88a6904339a8d5941;123456789001b5da40bad93e71c337ebf1c4c49953;1234567890bfff23dbb46eaee281e3021445ab0b94;1234567890144eea136a7ca7f8df232c29d43193f9;123456789058cb58bfa5bfc433494740068706db53;12345678900cccf5c12d96e015d2224ec8c5cd3a97;1234567890b6a65b206effd66da2e2a28be6a48dfd;12345678902969e0f828b69334185b56fcd28c3d24;1234567890589e8d600c8dcd9dcc2071a80e917a8e;1234567890fea28f037ec5e208546edc9e57c979f9;123456789063a9eea5498ce301770f739158b3a9d5;12345678906726ec4dba1bdf614a9ad3cadb5a3819;1234567890db5c2b875da977cdd6460c4d2f90203e;123456789065032dc583d9f4078ea5d844ab342a67;1234567890fee20cc63099e2c66acd2b8b37e703b0;12345678909464651ec35f01d225ba108208398235;12345678906e8fa5870ed1ca0a09fdaba5f109a933;1234567890104fbf00f2dc47a972f52d4b4d087ef1;12345678901efe1a98ac13e911e32a83902a5abbdc;1234567890ae0c3ca875515de2f41ddccce70de229;123456789049fca31289c0e4e8f67a1c9ae574ee93;123456789010fb80b286d0727ac25cbb7f166b34ad;12345678908dd76632ce5a6e6e10ecb7ff41e2846d;1234567890bae46b9a4217752c46e2a121ced2b166;1234567890f45a7cbeeddf79c6ef706713411fa526;1234567890a1d81ad2462ad694ad3d9791ddc7447a;123456789099fd73ef2333795beb6992c481dd4daa;1234567890f5daa340d7710274a7ed0afe51b33d04;12345678903dec2eb63e2e3a97f0f2e284f3955d0a;1234567890a654b5c18c2047c6ae3cd98cb090b5c9;12345678904d78dea3a029291efcbe00dc7721433a;1234567890b4910ec18a6fb31166420fd939219082;12345678906f0fd3df8f4ad351768c4f929cd58ed2;123456789048b0b628fa5645046d63cdfa49baffcb;1234567890f3bead722475ef6521e2d2f6940f8979;12345678900c400e2ec36e6b17e82d55c675515098;123456789055244c63d54a97b3ead92cfd409749c5;123456789027c0ce283d9a00975a2ca1ef9da7aeee;1234567890988597b26c5a1d48428644c3d52088e5;12345678909ada42646064c7887cdf1910d1a34c35;1234567890eed5bcec801e116b1eaf731a57e5a02a;123456789028cffcc78df8853762e1c18b0ea720ff;123456789075d3cb01629a6c4ee3f24673ddf3584d;1234567890a65a23ffc5c0b48e8e81833ee84c96d5;12345678905ae418944adba2513d0a6260c0508f2f;12345678900029c097596d60777430a660e223d9bc;1234567890e4d3ed32a3ba766b7ba15821de959dcf;12345678908156511e010adc94aeb102ec1365cb13;1234567890f9042b3785fcc6eea109515ecca4b03d;1234567890c68fc14a80d530ccd0fff6d3a097a285;12345678903d5ea4e799905f2515020a8c1667184f;12345678905a0d7f49ceceb7437e642a068a9399a0;12345678903f44c4eebb560a9ffb824ed71d2b9650;12345678904be2418e44d04d3d189c2d9922c201ca;1234567890fe6d26998ede4163228f5f792b13446f;12345678904c3fa816eed0428a7d071d91b88c67ac;1234567890b49b0debbf2416fa56e3cf017c5d28fd;1234567890d935b5dfe05d15f91693d795de207282;12345678902d410580722220f7bfd66e5baa069078;12345678901174ba4ec04974339345d979f6f0b3b5;123456789014ad7d11f5764856ebeb95c2bbea94dd;123456789058a4d664067730c7b798442be422cec7;1234567890369c982e7ab6e8f6b49152237a30545b;12345678901096a0df03916e60e81fd0191226a5f7;1234567890f26007031c3c554a5dffd0d035444ec3;123456789049d8bd14d9ed6439d1aea4a4d12a91ce;1234567890b195b802c2d851bbbb82aa090c82593f;123456789099fe51bdbdf77e1a05fdbac7c1d784d7;12345678904fb729db249785b093c76b012c653294;1234567890ad990d1b1ed0fd8a1ffb6204f307ef9d;1234567890563117d0749dda418fb9ed0b2f717c08;123456789002920c1c0a975d89f5731ce0ce71451b;1234567890a4fbca178adc1ed472b4d5d70d40f631;1234567890ed8db2e5d90db6d77d22a10793b7a878;1234567890628796bcb6ba5ee3b3382f40216cc969;1234567890695da9e77d18bf0b7531f5c85ec550f0;12345678909aa6cd33569648f8e4492a3b392c0748;1234567890dbfcddf158e1b866c11e0f23a67ed864;1234567890525ebdf0abe9f637bb88a023da6ff354;123456789054a133c1e2602119ae66d87b825b8452;1234567890ba030f0b91615fcb3e9b95b7f01bac2a;12345678908e56d64307cca118857dfaf42e13c56f;12345678901c69b3f4fd8e73f26e7d067ef5d1e6d1;1234567890eb393763592668b5eeeab83736e3a4b9;1234567890fdc97fadc90ad59d7c608c0d5694a206;123456789070f49c9b482fb478f9e254cbc665e6d9;123456789017f3067374857cd761298e0b58ebe629;1234567890699382d94534a2a7abb2b19c2671c1d9;1234567890e835898d2f758daa51f5d382582e82a2;123456789007a7da912625e2a9ddcf2681ea3dce2a;12345678903644e7d4e4c130969fb47d9d76407b4f;1234567890c0c22f368e32b760277bed6f1fcee3af;1234567890e7c52b0cabea7f42c12a7e495012142e;1234567890469e98bd2a706b493b7d8974476f7e6b;123456789027f01acd44e95d1fb7f5009004d7611b;1234567890e046c7be1545faba2ef1b89ebfc7f1e4;1234567890a7f39964f7b069912b301875407f5e9e;1234567890bb5ffd4a2526ecdcff409521d8d04e6c;1234567890e8bf9843258d977798e418f0089d7e88;1234567890081d610dcaa5756430212f35e9dab988;12345678909db115217ea85ea68f2549c260304b54;12345678904dc0c7d642a02fcf1c281e0b65bde78e;123456789004552e803109d82983c293bcfa7c8bae;123456789040ab142d48a9771b029299ca2875c480;12345678905140be9b4dc7f93cef79ca67f89bfd4f;12345678901644352c99d0e63952a158e23d95014f;123456789041f55fcc3bffb8b22b18b66c46b03738;12345678903c18dc2ed09dab94e0ef50041ed85e11;1234567890144d8787c5fadcc706b21e1f64b26cb8;12345678908ab4f73f2b106c6b3174a09895807c13;1234567890fcc23b74c95005218f4727d72f515e15;123456789018abac985edd66dc77076e3818a2c82b;1234567890821016de087fc4378bf0ca12693fd500;1234567890c3be6ff70ec63827ca2d37804449c693;12345678909614e7b7a8adb9d2c6d5d96b377a8249;1234567890a1e9ed325e4e00c3f0425905691788fd;123456789011c0b96ce3335b134a250797de1d40dc;1234567890d7b1f4faa4ee6246ac3481af75dd3157;1234567890e4d18a6a25c62db866cf04ff234c2fd2;123456789075254088bf29fb055c8270aaaf452cda;123456789095ec0e5c2e468e27789bbc145c9554e3;12345678909a09ff6538567000d446a38abcd26c27;1234567890059d46c56d6bebafaa9f32252c92254b;123456789021c4c485ba90a7be24e30c58c053555e;12345678905d1060c2cd607d6ed0f11e5923442eb1;1234567890e88a5b6d657a8b0fa8122f7cb15fe904;123456789039d9b6d41879787189f69b0545d71c0b;1234567890f8596de426e88fcc50ffd74d0dce3a7f;12345678900d7e03e7a6b16d64fe65451ebe095f4f;12345678902f799eec625038f8dbb3244c97ddc84f;123456789012145eb15338961d812b6a20502573b7;12345678903406e9e4fecea0ea38c3a80643768a53;123456789041ef08d589e42d80469c0090579ab45c;12345678900d0564d1287aec75e7f461e235cac9f5;1234567890d0278868ac1845ca995160109cad86c0;12345678902602a38988718c95d6e9590fa30a05f8;123456789035cd7aec074aff4c7b933a5f286f0c49;1234567890157e116b3fcf7e6e25729b7a9aeb051f;1234567890eafeb6f64aea0eaef6e9a58c3b046a1d;1234567890c42300ba3342641b1e59d5910356b83d;12345678907f6b8746b5c1467ee18200b285403c1a;1234567890d9e07c9990c2951f0134892e288e47a6;12345678901368fcdcf686e4ee717ffc8d4624bb7c;1234567890c38be09335c1083b5aa7874bd2a3fdfe;12345678907141cd179637b83d962814c7280b72a7;123456789053e997c6c8e5c2c617ff62d4ae303712;12345678906d87727d413d5e7af05ae904ebda6eaa;1234567890b64b6756396eaed77c816b35b21ce8a0;1234567890163ea7dd14ef6abf3fc5f96c2f8bb065;123456789090874e52a592cd41ce32488314b5100a;1234567890fac166744f53082483bd2b06103f6119;123456789049bed5662d1239fd4566e7317edc2311;123456789095e2d7e9b047589ca6426da8523c5fbd;12345678903db7806107f227c434b52c95960adb3a;1234567890681200d14b7bf634193bd264045f7786;12345678908dd5ef15a6fb0512d7b86f231273fb11;1234567890ab1ee14993d0c22177fa118b5a23d572;1234567890827e019c656962d99178abc8d39154cc;1234567890e793d8cf88a4a831c16f3327519498a8;1234567890130651a847bc9210b67c4a2e339cb941;12345678908bf83e02d5b6b7b08cd144316a12fb71;1234567890fc1973391865e6c5590a0a640c9df23a;12345678908c7d1cb883180f319b6331728fc98a26;1234567890ad3bc1ed6980bab88abc05bf53e6953b;1234567890d5cbfc995134701fed2c277f330ace7f;1234567890380d17d0665bebf104d27aaa9b9f57ac;123456789072fdd0a6dab12a4956564ba6e99a3710;12345678903ea05c3914980e5712cadf075298ebb2;12345678905e4d56c05b6afaaca528441a58a9e25f;1234567890bff869270b089ff3a4f261f8a7cdd6e4;1234567890f02e9041bc0d969725379cd11364f90a;123456789002d989025c25481f86020dae5810037e;12345678901f8a3a9772d2cb0a570aa5a891e6e194;12345678908d7838d1f052f090849ddcceba097a7b;1234567890cacdf9bdea2c0a9ca44fa6ee1e43f086;123456789001087323d5b65a71492937030e250a0e;1234567890875c9e7c1e53af31a44b79f019db41fa;1234567890fcc5d1829fcd7cf863e5d964757f4bdc;12345678900cafd5aad69000d48f937e5e24beb45b;12345678907357706269f966ac60d4e3fe6cef46bf;123456789006d7f2212e64bcfd2b65b7bae311f236;1234567890ed860d883d3430cc591dbe513f308d3d;1234567890fe7587fc6f12a87da5cb846f88e03fd6;12345678909a8226fad19cf8ff2247f53811ddcc25;1234567890a87d772d4f3eaecf6362b689c1bb647c;1234567890f0866f610656073bddb80f75bfb55a75;1234567890461daaad0af9b26acaa3a2d645a44ff7;1234567890fd8b4e7e1f4c296e3867cfeb8ade7bf6;1234567890fc9b0a13645e43e523127259d5e3c829;123456789093a66aa22e536e6870ea5ce6fbb84056;1234567890b7328d41fe57b715e8fd9d5e4004d9cd;1234567890344f997328e4aa8855f653ff971d4b66;1234567890c301722061161fa41c4d9e4b9cd5f357;12345678908329ed2fce798ecfb9b25952152769f7;123456789096ce133f51de3ea49a1361c7988677a8;12345678905bb069b3011098011d4d548720e8f92c;1234567890f2668d93aeb9f671c3e73bbd3f869695;12345678907cd5420df813b862e69666a7a0f2887e;1234567890c129fc042f142058ef94a79564afa8c2;123456789003ff9ea12a13e7b1e98faf5ae3fc8931;1234567890291223332d9f397e849e9dd45b1a4b6a;123456789052b9a898f56c7880aab53bad808907d4;12345678904844bc2ef1d1d3d1ac8df76661e35a0d;1234567890de12313e95bcc96883dc3a75b91d13a5;1234567890f151bb832d8a2ccc881fe3e95ce946e5;12345678909074479b4c0d2cc96d0d8e4c036b67a6;123456789075004718cf14126d3dad899f5ac6557f;1234567890279f233ea8f28dba941e3ba87799ac96;12345678901bdac5b93f2d15fc58f349a1d2ebe902;123456789017a5c07f8244e6dbcc0643fa6accf2ae;12345678905a21c1c42b3d0e67c8e658197517cf97;1234567890f8945ee864ae1e5219ad697dcefa94f7;123456789078a705b3853b647bd6cec2f8c58b44f4;123456789021b25a0fb87ac352993d3545c87569ea;1234567890c5d8c0bc94a471041ad0bbd5ee5a337d;12345678908ae00c4cf69e1866f1ee8a87359216cf;12345678909b6dd6fdb6f17dc30788e2b19882b7f9;123456789053130da1457e0f8da5c9a3420ee400d4;1234567890cddd3cacd75634409d98f18dbc86b8dd;1234567890b18445de4e8d18106f00806e072d1f1a;1234567890334148307ed2aea91d8bed262970c475;12345678901ff97dff49b993d417a8bad658bdd582;1234567890296e2e2cb83a5c0e155445e464261d18;1234567890b1db06515b45c6d59eaa78a9796672aa;123456789034924836f86a1ab6dabd4c08209acfe0;12345678903a6128b8bc760d57134638ac7acd0b34;1234567890d639b97005609a9ddc1d3e58a0b559d1;1234567890ebb7eb6de78213011c2d7bbde5773766;1234567890b5eaeb74a5f68362c3be759cc3244fc2;12345678907b326c9f8bbe3e352930c1234436e637;12345678903577bea4dfc53f7c42aa3856b5ef371a;1234567890d0ba6bf3587ccfc7b7ec33217655009e;1234567890ce53872f44b71bc6a7a9bf984fec60ea;12345678903836f2bfebe632a830f1afc0102c6454;12345678902e07dbf91952747d9180e326ef8851cc;1234567890b03039a43591d23d8edab628135db30b;1234567890c8182b030d0cb6501adaee5fe1fd52fc;1234567890afcdc59289d1051f1e4154ec6a9974d4;1234567890f5d5f90e40cd0f4ea913f31748a87c8a;1234567890606929f37c64e665cd742fd2067388e1;1234567890675a8e4b4f55484781f05d8397269282;123456789014c4a9dbdcbeaeda87ccbef19532850f;1234567890d75e4f080bec38235c30acfd506776c4;123456789071e4bedd78155f1c47dcda269aad83cb;12345678902c87d1fe7f489affd4b0c85280df9c46;1234567890f00ab680c537fc68e43da964de31db91;1234567890729a77ffe8f52704c774f8c3397ed43a;12345678900d63134e87fb56e184060e16a2ba75ff;12345678901c62fa791ec9003390ef91d208fd0242;1234567890d088cf389ca9989e0dc024f13f014502;12345678902cc3f148d93989d514021f346049eed2;1234567890ee52d8fed69dbded1bbfd0defb906748;1234567890ee073141774b6735d9cdc8afa15d47ce;1234567890097e19e5c9ffdd09329fd5bf7ee2e8a5;12345678905fa6170f18580c986f6d6aaa9f716b78;123456789053614c67af93bb655f7ce4015a311f54;12345678905b691d791794a42cb7e03d11b4f33663;123456789065aa6e892a7738f68d86f3ae295ed640;1234567890221fcd2c2d9b7fc0a1ee17afb4d477a8;123456789065a1bf5053a39671eaa274c2c950b662;1234567890df4d672f66b076cbb8d9f29e40b05d36;1234567890518f499acd2e1ad67164f9bc27bb3117;123456789066c50209f2555463c4959d35f54bce82;123456789033bdb20cacf6a9c97b809a83bb8687e2;1234567890645b2289658269d100dac3c13c4d8872;12345678909f30c5fa61b895093c20efef7749f6af;12345678902ad8f02d5366995a485b844fe1f79a2e;12345678902e795d6378a2d4dede2a64eba94df168;1234567890f3a1bb934a3d59c5f0bd29864211d631;12345678906cd0bea01b09be1127c06a99099dd7b6;1234567890a24495d434845fad867cae3ff04a1089;1234567890eb7be9013a01028d15dcbe8326e0e6e4;123456789037af8544cee28e344b6566aa7c70e6d7;1234567890cf634fbf81e7f485b98260e4edcc9a4d;1234567890909c029a4b01da1c1da1f36c527171d4;12345678901a61898d50d412fd712bd1f0227f7caf;1234567890baa4158aead0bb7af4b43d471971d78d;123456789067d8129a7803d54b5164473c7ffcfb57;1234567890e8cec8025ac3c74dc6b133c4c9c4047e;1234567890b212391347527172e0699e9225104389;12345678905f8272ebaac30e206079b1e21cb53537;12345678906966c4b09f6606dcd4c8b964f2bd36ed;123456789018d1be316e0f9191c56e61cb58fa5634;12345678905918a4e4146ac9b31d7c7848d5a45e0e;123456789097056b521d4bc6fe0e3f1977cb116905;12345678908b5c2af9053dc9221f00e93ed5dc4340;1234567890a7afbfe7103830d11bc6e3f7e226f5fc;12345678908f7518defd1a830d12f49a21dedbc235;12345678909415e46024b06f71fecc25d643fed72d;12345678908d2414975c484f2654c73ac4b154a572;123456789036cd8ee4e3f419b124d5821e0df19df3;12345678900aae22e7b750b6f2971e0ea73488597c;1234567890b79f188b4b5615aba1ecfec4efcaffdb;12345678902ca6dd1d980fef7e307bfc0a76aa41e0;1234567890ee5ba05f9e1066092219c45fd56edf92;12345678908423960784a3f90d822317871966c14c;12345678909186d0c2faf4a52bb5aa548cd6976d89;123456789032e724741a2598d9a5bb6e023cf84ab4;1234567890b79f4ee434ce9d1c2d92e1323f26c683;12345678904883052213a9e38a7aa9ea8b265f5cba;1234567890cac4e66126261a0e77f413e535afa8ad;1234567890c3a9ee0b21f58bd1eada158b63c8f19a;1234567890483aada67ffb74be28d00879b11b1409;123456789045471b11f1d5c5668643f138aa93f657;1234567890427988f7bbd52a065ed69ebc3d4d47e5;12345678900551ac247802ea5e6454c4103296f7c6;123456789083f5fd2512aabe8747cc3e87761fd698;123456789039746335d5fb38da0be819f2f8f7cde7;1234567890f3e80c32388adaf5cb1e94c37127a066;1234567890c381860b6083ba5bebaedf4276a7a0ee;12345678906b820e1c631f8161a99db6af926b89b2;12345678900b8fbf7613fd585f2083c8bb2cea770c;123456789077b37df0071493a56be893de90a20613;12345678900f222534bd831f6826081ac473eb4786;12345678909a3d07d6b0fc2e0685c97afdce4012ef;123456789052e2a5ed0953887a679a6d1f26c20798;1234567890ac6f280d95ecffc312a11723df8f042b;123456789087afe8b3852f22417953912f73d29e71;1234567890c4eae3cda3501dbb3714ecea6e187d1a;1234567890a258592d889cf9ceff9b15d89f983e9b;1234567890b009de7ada2b3211a137a1c9be3996c7;123456789069f9860fe0bfab21a09645b2463c6a1e;12345678902f6dc94f505f6155080855322f33ca3d;1234567890c7a334cfbeb216b830eff759406556b3;1234567890a016a04c944ca8e74fe702d04b0fa2d4;12345678903f53b9d4f849fdadbad6098772254f20;12345678903d0dfbfcf3af827940c958670110428e;1234567890394f05111b86e1ef2fd0193072fda54a;1234567890fd75bfd9d8bd422e68a2d2af348f2b81;12345678906628ba143f5f3fee3c7d09d1d671d0da;123456789083fa8d8b7f1f0d75a0c4297e90e6cbf6;1234567890a0402fa930766dee050a08793d4e9820;12345678909a65366b8abe392ee52e58e578bd8861;12345678909685cefa2c98f8a08ca60b98f8e37fab;1234567890e57d20b94f05ccd350ef6bbd309254fd;123456789037a1c51bb90f05b9f6699a479a282e3e;1234567890a8f24d3ac604dac6b40f413b118a541d;123456789057929544393c03a7606c8119398fe747;12345678904e47b9d913124d6bcaca77109d9f4ece;123456789076cab334b2d006cf78d8b05b1e339529;1234567890eab93e3bdae93a532123bcf8e794d872;1234567890ef7012ca7d8a2a7c1a7e371c74b1a147;12345678909f8da4fa17cc773ab7eff6fb36306561;1234567890a0f62ee26ae19d01d47a3958e60198a5;123456789068a08b8e007800a514274c4d5cc5bfb8;12345678901c2990d1a1082009764fb9ff22b6840b;12345678904a0a9e6480389315f54398a957405e56;1234567890a898104c81a6bc07a8cfd581e79cbb27;1234567890baadf2c0d5a772c1fd7a2ae6107822ae;1234567890077a5f2434167b3cefa568464de5ce95;1234567890f8b1db34ccb799f73f0f578d98b47ec3;12345678906173da2544c6c022cf9c9b326c274bdc;1234567890c90b31f2f01d822900a317ae7111e0c4;12345678901962de1f2ee120bfbee05f7e1583aa6c;1234567890daa95ec43ef2160770c6fd2f68e6ddfb;1234567890e39975ef0f1876403661896a4c063767;12345678905e13d1abf55e381feb199c50cf67db8b;1234567890e334eb4d6317e3199f603a4b0b533146;1234567890d679f065ccc2b191fb229d1676f2ac0a;1234567890089ff76b4996a1b6c8b758daf4ec5e15;12345678907bbe98af9833ccb1d3425ed3c139b107;12345678909688d9c7288ac7b461a741e9511a4a5a;1234567890f690322c4d4c5a7dd1fe0134a52069b6;1234567890bd18be7cfc7c6d012a54e7ee702fda49;12345678901a98a1320d15968de56d970ac1cbd462;1234567890fb55b9e8a6f54744a67781760e67a560;12345678907bf58d4ec79dacf44e92b635e5399096;1234567890a0839ed975c7e674b7955619f6d58476;1234567890487351c7218abaccd99f77e7a159cf54;123456789016b6a94bd0fa1c0d9fa9683a4b764e99;1234567890a72b25dd2029cde7608e26e49c2d31ad;1234567890b11ed22f944af61d3c2d72ed1b33520e;12345678906915cba0d73c4ba6c8c747701ed1b614;12345678901728a9de37723d7c768b7c9b96148bf8;12345678902798943d471a78442414c6e766607fdd;1234567890873d4dc56465d50a812b0f40baf6beac;1234567890433c9f0735c3f03f103ce5933a8196de;1234567890a55f8981a22a30f22ce0884b9707a9ae;123456789095d5f525ff9505f72c91f420e4e47d10;1234567890f0e774f724bea25a4d36a3a409d48956;1234567890107ffed4fdce9bfa21edf5445b27ce79;1234567890fa7daecd2593233ecc63a176da168c0f;1234567890a0dc318ed35b4cd99ba3a5537cc0c5cd;123456789042a24096dfb4f63691bcca24b1279fdc;1234567890204d42ff8da1dab5005e40010354e973;12345678900ae9d3f7d060b13c76d337bf1fbcd9d2;123456789047e3c94970ee832ec8985ce46894ac93;1234567890a47451de3e92543add259a63555a4ad3;12345678904719d6dbc12aa928f61cdd4fa585c11f;1234567890cddeb6a4a3dffe3b4edc61e49c76edc2;1234567890d864fc32f3c7cb55132e3d09b4b709e3;1234567890287b97db3e0ca03e73bec16efc68aacd;1234567890eb3dea9f22db09697803b082db6234ab;1234567890c16036c28e2779ad2f3de0a01f74628f;1234567890a95516ac6e735cf1c608f8212ebacef2;1234567890ba9496313e9ae56af114e6789d2356ed;12345678904ef1c29121d48b886d3c6801553de4b3;123456789029edd1f97c17e8f5dc3bbb06029ee957;12345678909a793d235dc615d40c1561c967af5851;1234567890e6b6f172249f394c7d2337d20a01fffd;12345678908a7adfc6f71aa0397aae83dfe952c7a0;1234567890d7e586db947b283dc42bdfd0b50bc9c5;1234567890434139d77af3bbe57ee01d4048dbddb7;12345678902e052cc7818c8745e7ea0a0d093275f3;1234567890c045e260a57fbedd021e10337946ee30;12345678908f1b95ca75f242125a84416bcb600ee5;1234567890ae4f75cd7457ddd161f792d804b2dda0;123456789051eafa98e2285310c9f65b3d1d880a67;1234567890df8db0a731d7201e3f57148fe018aeb4;1234567890c690be11886c183165328e7843486d82;1234567890550d0717f8e8df048b1525a8c1e28b68;12345678905d16036854b992abd1387c4226755bd5;1234567890ac39d4934ad656d69c07180bd58260b2;123456789004ccae95ada40104a190b661aabe1435;1234567890a07fa484fd2b6fcba15b035296e9df50;123456789019c604457d8e6e1a5d3d16a8f394d1f7;123456789046169844f88b41edbb50bfcdf33dec4b;12345678901c63bf01da718af2e513ec3771e35c7e;1234567890c68ef3d053da4ffebab86337564d4a64;1234567890160004912276ffc8894b7fa59c60258c;12345678901186df86d23a052b9cbf5a3622b6412b;1234567890f8b6a726a1b237b4c231e54ce95aa2fb;123456789054e06fe1b7066566aed64443a73aed6e;12345678908b8e26ce384902846ec25fc026d00e10;12345678908617b37ffea8210d79176661d3724e6c;1234567890571ad376a3a0946bb541816db7476a52;1234567890a2c8f2d8ea03dabf356140701dfe865c;1234567890d6eb962cdc10f53717a7efcbf120d269;12345678908a856df337f818e7edf395d782fc4881;123456789038a0e6b399ec16d8c53cc8b2bfe1f23b;12345678900d636f750e2e60fb5321fdb64b379b78;12345678907e5d8fc8498817e17620bf217f446a51;1234567890ac0172f27ac6ad85632724e39903a1c0;123456789012450c9b7ab4b08bc2301a057f709e77;12345678903df51306a5b0f58c2b688ff970c25bc1;12345678908090261e03b797397d4ab564a226600e;12345678904561c05bd18d6c144d07efa5728a8809;1234567890565502b968f9723ad51f59aa0d017082;1234567890d27b5a9d7677b8f7550a859929c0c4f2;12345678902acee9d2b61e912bc02281f9def660fa;1234567890c59f1bc9039d4235648b562e2de6c17b;1234567890d578ac308cb3dd91747f7c1859604738;1234567890f9e4d97411cb852e7a4b49417ba709fd;12345678905d894656ab069c3f4d0296383884e535;1234567890c3ec776183ad9ce380b2cb5522460156;1234567890ce67a2796d0c1a7a868f2f150a9983f0;123456789085caf42777478f451e85a2b0d07ab6de;12345678907751b045af7f34c67403b5f3ce052e27;1234567890037a0c1932658f4be32b7f1a3d3b6cb1;1234567890d82f2f57cef849e73bb10994538d36ab;1234567890018f185543c8afafaee17f8b3155d900;123456789024c5072f96fc47516fae764d5d227b14;1234567890303daceea7c118248e248758cb8ffae5;1234567890139c6baad15a164301389ef5bfa380bf;123456789044b51aec16d9d80868c2b9ff8ec8d8a1;12345678908b378d259b3cf9c3781247ecc4754aed;1234567890411ea13161d0860b8148ec12c03920a6;123456789027e0feeeb6ae1130998ab9f708613bed;1234567890140227b139081888901018e0329d4d64;123456789077081c4863cce2c2dcc3f6a05336d8cf;12345678901a04599c7a0b05c1436dd5ac58d1e8dc;12345678903ba1dfc603bc55b15b29d35ee868bbb6;12345678903d7906399f3942a9eb2a585127d25f00;1234567890d524573c0b823c31ca18c58013358dc4;12345678903d05a3e83ada2a60290c68ab923b5492;123456789076920afead0c8d51a8b802491026b018;1234567890dafb697b980deb9588d0966f346050cd;1234567890babecad51598543c58b4113b1cd7d4af;123456789041169ba2d9ca6282dd0d58dbf1a13c25;1234567890d548ae402513248707145f6688f7f7ac;12345678905a24dba03a2b657f0e9ab43d9d716bc0;1234567890ac0d16e6ea27b434964a83fc94c0b183;1234567890ff9c527c4e188915ae1234e5982d1053;123456789050e9347677c04d85ea1185a98615aa54;12345678900c31ce92cde8d1eeca3f9939ac8810f0;123456789042516ba0a3c7aa8bd05acf271fae6b9f;1234567890996e19c2ea3635179e64ac75fea7686c;1234567890833145f4461b0f28115f0234c9101df4;1234567890326a49c4e2c32908b6af4b86980ce3a4;1234567890b466f6482a7b63e14343da157806842f;1234567890f5d8f6cba72163f6b954c7ed3fd96b07;12345678901b02e9b17e1d88567f53c052d2c56b3a;1234567890cd73729edaaa976651ba6fa76dfc60f1;123456789092714b68e296095814cafa4f2f5d9f7e;1234567890c00dfba0867c2d8fe3f8ee9e1982a578;1234567890f95a4b6ed0b6a6b1c382d7135b5667ba;1234567890805f2eb79cd1712a0dd6bc115376ae33;12345678902435fc00972e95c5a612bde1cfef2481;12345678900ccbfa2962ed9b2c9af59cebdfed2c16;12345678904399f5037044e385671fb6a2158c7219;1234567890aae806615782f9cd679513fd2fe6f453;1234567890911388721eddd94a6f29c30919b74fd8;12345678908e849e62ad7ee220028e35ca86e50a09;123456789040d0e13d29c1d567ab84d70aab355cd0;1234567890df04233c39192f71735f5fc3df884200;1234567890b17e21971e86c8d86289b3536b0d3f3d;123456789080724ada8b92c1844cc4fe25703fc73f;12345678904ff2fbd6fa00afdcea9d7fba83b3fd56;1234567890f2058eb137b8193c2e29e8e36d2c0a8f;1234567890c462f138817483c9b0b0489d9d06e4fc;1234567890e52a25de00317146783261e0cb89e45d;12345678907589ff79ba0dfdb717b46013e1566926;1234567890b95c47355ab7177ff6e4cf1699764f34;123456789096c8f1267f827a40c64c5dbb413cfa7c;123456789054944e5084305b8b06eb7d422d98b31e;12345678909c82931b05d0ff010067c359be692671;1234567890cde41ca23b2a59bfe0bbca44560d509f;1234567890893531a15c4f2f27795cfe444d8c3ab1;123456789041bc7fed1061d9fb1bb28882bfb59260;12345678904468f06a282e66485148777e0a23d003;12345678902683a2eac8af4acde967086b4b69df0c;1234567890638db32ff51c42150d1d67726461e8d4;12345678904d006e27d0aa81c4dcb3a84d37409fbd;123456789006321f2513c7b650311ee95242ba152b;12345678903d0de448e858af5fe154eb1a3cdea9d9;1234567890fbd47d836538cfbbac2d73532ac77186;1234567890305aeb7afd833d9356a2a077b19f9082;1234567890b1cd3fa343f347e61602e47072530193;12345678904773c30737924fc0fb8afd91a71131e0;1234567890999aaedc778b68b3bf37eeed4c6defc3;12345678901de7446f9f7f693c6d687049cc6fa977;1234567890180e3ebeebf825fc45ac80bba1baca22;12345678904181a228bba171a82bdb3ff23d197ce6;1234567890f075d9c9812ac6955a63d0e7f51f8a8c;123456789029a2d544cf4c25e608dd824353f315ca;1234567890eda4886e5c6adb7c863fcd357bab534d;1234567890983d75dcc70baa7e5528fc9fc6b092fe;1234567890104d9bc5ee23e4a1cb103eea45980203;1234567890f2e82d1651623b62257d27f5966b894d;123456789083ff74381bbc504661828b24fd2da960;1234567890320b9849860edd867e0bbb8ff7b15e9f;1234567890b0fd430cd262bf552ee47050806b70d2;1234567890393bde7068cb03ee94c6b67cf0d1c642;12345678907959ee1997197a2ae08d4e415af6ad6d;12345678909520acd17f9c99ba198adc65310c5058;12345678904ab0e02e897399bc26f24a079b42600b;1234567890bdc62161a2d023849972b7aaf2443eb7;1234567890a72805fb260c98fd892188bee9b31ce9;12345678902377f157e7ecc3f9dd7bea2ffcdddba3;1234567890e5413f2f42aecd770a2fb01e3b582307;1234567890233ee25ccd76457f6c3bdd76c9885476;12345678901cb94cdd9f98b1f2b52955ce2cec73a0;123456789000071b0cb8f590e91866cf53f6edf1bd;1234567890dd2082a9912df85fcb66c39fd8f98d82;123456789062837267cb91b642e6e699caa247d1ab;1234567890ba37b79dd7970c25e6d0c7a649f6867a;1234567890a6e1e0315d7b04362de713cf745c5961;1234567890506de9a2301bf94d48c94843f8346c1c;12345678901aff3e96648f5f344953833bea7b3f8b;12345678900e9d090fd18f47cef74073b2bb4e0959;12345678905f6f518ea9dd49dbf88bec0c4d91e1a0;1234567890efe0f7e308e3b066d46e69d4a8cc6f73;123456789044fca93e4460085d21b8d2e08bba39be;12345678908fef65bacf1cafa6acba7ba37ebd5863;12345678903e56745616c74778c9166b2f3314828c;1234567890241f9d87814a6f0daf631d71042348fb;123456789052824fad38d209c71e99eb6b236471dc;1234567890658b57bcf0f90e206cecdd239ac81cc6;1234567890be410fa83bbfe7ed4ebdef5381295b87;1234567890fbf6b3ee66b795812ec446ae0ab124c8;12345678906511095676fcefc74452ef5e889e69f7;1234567890cf2988c0e46d49b74b3f49c818604be9;12345678900f025d69df50074115712bd460c3eaf6;123456789078cd9053110c628483f4e2cfc41afde7;123456789037620f0c0007de7ccc66591701fde98a;1234567890a1162948785520bb36443f0287c86516;12345678902d8cced7eeb78b7b2d8aa284e447ae4e;1234567890f7cea8ee3da92614eae5987cf26324ed;1234567890afde62c3f1438a11a70f46d769348cbb;12345678902b92ad8f3ea7533862e4a6d5424f5aa8;123456789068ff86d24260180929907e99a0c4803e;1234567890089470d73bb3cffa1be48c5d74ac1cab;12345678902148dbb763e304ce49d3e1a3b4a9f5fa;123456789094368cb408418909ef011d68052e46b4;1234567890c39123997a6df1bf65eb5f59ae3e7347;12345678908e87fc0b190ee4f7722e1acc1841118b;12345678907c9a47d5f990de60ac84e4d5ad603ee9;1234567890d9929e8002e5e2acbb0f72bd3f69a17b;1234567890841c04e1427c48a5a041d6c195350dae;12345678902c7242f3c2ad038a6e23d625e93ab4e9;123456789043ed3b02021961121a1c6a7aedc07070;1234567890ae1a347e2230f884a3437bf069118881;12345678905ca6ea9529ba797014b5bfee83df4c78;1234567890f3e578646209250b17b1fe7c79953a9b;1234567890e42971744c0993e9bde4f964daf98ce4;1234567890c591f3d1e50e6c48d6b21fc37ff1372b;123456789074eabcbfe491290fa7f29b0b5cd1ca4e;1234567890bbc4f6c7c509caa8ab77665a158f1214;12345678903fc7c573546eefbcdb7fc60749bd490a;12345678909f9255a6fec2886cbddb775baf4504c9;12345678909599fde22f1b00b86fea10c70e210a0f;1234567890ca01b36b05533dd65215d18f250e44c3;1234567890a3b7af851220b30068080f310f4b8afb;123456789033b36150e5b94427ed46c7b65ec8447b;123456789018b03013d825001b1ba606fc6176983a;12345678901d16d5a0545731ff66b708b0187b946d;123456789022c7a0d4c25d1e3ac28cc37805796ff9;1234567890735535105f93283d99e1675e513ad44f;123456789094ed59016ee8ff7b0c1d0d4bf2b6c2a4;12345678902d0a4647b96e6558c49d27ea635a935e;1234567890242cd1e6d847f4a2da3bf4b66963af00;1234567890d375121a3a9bcab0af1be0d339b7af81;1234567890d1facadc18329d9c1d2fec9315083768;12345678902cff839bb601fca1af703cc06f14ed67;1234567890576361edc673431542d927c55ae94990;1234567890050ca83c64d0314a049582601c229dfe;12345678903b697dc17e717e69219fd6889772f0fc;123456789011525bf62935b425f19b3a7777d0bdf8;1234567890703fb7e5d383ba45cb136cd093ecca2e;1234567890a794ceb0b04a38684e406fa44df284f4;1234567890ca74c909804af29597510ea20d3dbbd3;123456789072be528eabed445368c34a5fc9b63e58;1234567890f20874e40c81f84b4315b65cfb6fec07;1234567890e436a548060cc911f2bd0dc7cdeab2bc;1234567890302bf8383c1469925526e925ae17d4c9;1234567890295f3472c6db342a17a9e1a53cb9ee88;123456789069001a2a562d8485bb19f54efa6c0b8c;12345678906dcc729905b8729562eacdc4eb293f30;1234567890182e362e144ef63f0957f0aabb559791;123456789031159561ea164edd2649f8d950c7dda5;123456789022257737a372c5b4dae2925278a628c9;123456789024c21c271f1c469e8478bfe1e677e0b1;123456789088f123cf99dc4a0345698b55a4bb9c61;12345678902da5444dad157eec56985bec4c08a3a3;123456789069293ae8395c8b1855c26f1535b3d192;1234567890593d280f7b3f17045a693b0f1828427a;123456789059dad68c3410d2d6a6bed644a3fa62d1;1234567890299432d33f6c48509bcfbed91704f353;12345678905b9703803083b01ae803a0604121b7d2;12345678908a4f59177e5fcc9ea0987786bd68b7f8;1234567890c4a606e2a7629173cf6ee47894107b44;1234567890dfebbc513fca232e1f18ee0e169c1bf4;12345678905eb6613a9921c5575827d85df7aa241c;1234567890c58ef6856e42335c99793a0757aab885;12345678907936963dceb660a8018d2b34648fd09e;1234567890e416acc9eec412ca9a8f2d83144ceb29;1234567890cf0981d68021577e322231b35b56231d;1234567890947246e33600fe259eec6a1758a30b96;1234567890b744b7fe897a3e932272bf7d8774edc4;12345678907fb1c779602dd10ff60c2a9517b074ef;123456789029fb5a53ac320f83bbb175bdecfe2df1;123456789032675bf6e79251b3795c36f0102ddc94;1234567890c1c02dbfc1ad57777d2a1c26fc8f4ea0;12345678905edf9251794804937eb91610032b8fe5;12345678903f305f2478342e5e2e41bf2d01d3eb8d;1234567890056e1d8abdfb9e32015a7cb0c7eb02d9;12345678907e9c86640fad3f8b37ae5ea92e4dd447;1234567890988e7c0f01733aa8ca04d42f4e39da69;12345678900adf8aaf68947c86693854b7c838627d;12345678901498258195389ebccd0e367413a49866;1234567890c07c14c530a870dc5c897dba366022df;12345678908df2e87e860db24d2d2ac1002f3d24ca;1234567890b6162985faac0f77f7f53dafcafd6c11;1234567890bebcd3865df4cbaec8200a094e5aad05;12345678905517d6d541a3b6ae8ddbdb6bc193c47c;123456789039fb361da10d4bf0a741ddab623f29a0;1234567890e594e9f3fc2efd180dce118f59c60674;1234567890dedf7fed61fbb9894944cbc0ae7838bc;1234567890540018d240f58034316a125715103792;1234567890d00ecaa2bbdb891f7274da16cadab745;123456789087d18c760d36a28f000fdc4e3b8f2607;1234567890cf81d662214ad4e8d337b470f7390b64;12345678906141bb384890e5b87e71a0a5ff2f9306;12345678905dbba49b0c89f47f93278eb513591f6b;123456789056292fb0d7cdb04e6ea8bbf536e11076;123456789034ec172fa8861eda58c7e03fa5be53be;123456789016c8a95c8ec11f110ff16d506e69f74b;1234567890adde6c6acfed40cdf9bac07c14b2c957;12345678903d7d0b291d439cc4062a166c9978505c;1234567890a1eca158733827ee27ea91303e1aa616;1234567890a77eb92b5021bfa5b6e8ee90153d58b4;1234567890b3b6f84f72dde85d1d9d86be5eceb99b;1234567890dd4df84dc05aef5e2ccb2ba9d5017839;1234567890bf983badf30142cedd3628b998145ed8;123456789014397ed21dfac67a171afa252cac8a56;123456789021a0805f672f0bbc34388a926cd441b8;123456789041788c8c2036200714592095dac19985;1234567890ad31ee8135ccf3748e1761664fcb448b;1234567890d30a138026acdf7317b1e8e1f4002f2b;1234567890f8a9f2edf24cf9ce8fe9dd7642169495;1234567890ec1b54010d86641c2ba5406796be58b5;12345678906024bf95d56c129138b8ebeca256039b;12345678909c20fdf2cc84295bc5a8e55cb12b2676;12345678907b018f8d87f978d8e42d72e25df2cc0d;123456789005745d9a1cd416b1d76263086734f868;1234567890fdca4faf0e6bb48cc10025018a4511a7;12345678900c21e9942cb56487997e87100ed83f23;1234567890fef04762457c139725750da2959014ac;12345678900bbbeede61ccdb79a0b77aeea144cbd7;123456789068b15e581a1c273a3d36dd402a7baf7f;123456789016e4f7a3fa2db33542232f9aa8b36a68;1234567890548ced6fd9b7778046bb257852554e0d;1234567890b55c732d401bfdbde96fef0eb3a628bf;1234567890c1a5aeaaa6655356f9be356adf181f19;1234567890112d4902f9cfc0fbed038f067a1f6478;1234567890a80a119faa7bff1e6289077f1d53bc95;1234567890afe7e449b2900a7ab2520d28627d0f7f;12345678908e063f9a328d3b57fbb49bb87caf7b9e;12345678901f44a5eff46d33286ead79dc535bc7f3;123456789075903f2f137a9df2603e4744a455865b;1234567890817b8a2a8ccf20ea63e1f6dfad66234f;1234567890669f614bf27fcb44a58ce2ca1944bd20;12345678901b244a939b4a9a4ba354a925eeafde22;1234567890c9f0698e44ca8a828e2ae0525cad7639;12345678900554d74376e567c8b057ec6c503b9dd5;123456789029a76c54f481cfa5a86df5639e4e71b6;1234567890851af1f597239164dda7eef0c1393f7c;1234567890223e3df9e50f829b07be44df4ab35d46;1234567890cf71ecd0067577de31caa7fef6440ae0;123456789006201086cfd3ad431396c6de1d46b560;1234567890e51684adfe0ad72e80cdad50f38187f0;1234567890444396d50bb6eb04053649796f2db33c;123456789059257a9f171dfe9054bfd66b11b1cd39;1234567890e6eb299c76a5f905c5d4bb4a24f4255e;123456789016b39ecb6ec9ae8405e39c4a30168b60;123456789011790e24ed434f7211d9d969733af908;1234567890a5fda93c082725c65b1cb32d259f19ab;12345678901d8cb577cc1f8dc0004f23d485e9f386;1234567890fb4299cd7bed2d572096c6a90f7a31aa;123456789012439734e94f8b4ade3e2314d1204844;123456789027c391cceb04a3fad8d072331ad3840a;1234567890a803d197eca53b619d57a8cf59caf0ea;123456789066a03caf3d822117609c566efcb21cd2;12345678905119fe426a2ade13124f7bf8275c4e6a;1234567890deef5b6e4b1c0f4a6c891a2e405a9c3a;12345678908c397a96e232671e1c3a63fa40fe376d;123456789047514b4608ef44b4debb892ddbaf4519;1234567890626dbfdf641fecabdb33035c5bf032f4;12345678905d4cb4ad27c0affba1b71a0e78ed1a6c;12345678907d6df7baffb834201ac2d944620fd56c;12345678906fe70716ca5e9c64b41518b0a188f9b2;1234567890029e62765be9ea4d78f12136632f05b2;1234567890e1a6a6b68af072171f9c5e57a1dc194d;1234567890f607674b03a2527c3e9dacab5e373d99;12345678903679e1d1b5426788e8952a840edfacec;1234567890bcdb363a8947407279d6259f99a663ee;1234567890a1976e65f76f623f952dd6402aa2cdf3;1234567890adb4d8da29592f6ee3bb572f4943d16c;123456789019964fb4b937aa39f069e54a5e4f8a21;12345678907f88f5276c1f5081b7ccc8b67d787818;1234567890b7090f9335b2abee06e66b5e8904b43d;1234567890b31ba97555ad8707b007f7005fad5162;123456789085d0a8d541a36f295d1b19dbbc4e9867;123456789000357d32a68c135d5caebe1fedd70fb1;12345678905e15989912857a89da0e6383675c016c;1234567890e7fdca1aea64c9212c2a3c6f78ca11fe;1234567890899f27f538ed975f44e6b85ded644ecb;1234567890acb49630f0ac9c476ff9a17d4936c2fd;12345678907b7b65de1b86d66b57ff60250b2e308a;12345678906f697c63522313ed0a8c084d9cac3360;12345678901f6b0a73f3b704466919966ffb1f00dc;1234567890c1d02358f16a5fa2bbcdec1cb7ae1f55;1234567890a92740df1e1904f5b6e6b8995e00115e;1234567890c1dbc747122e20dd328974e805b5482a;1234567890381005bc9bb1e527906156bedd0761d6;1234567890e445665134209fe1cea0e15b2cedf0c6;123456789012ba781c6eb9edf15ac8fb3a84dbaa8a;1234567890046ef9e4368b298748fc961ca75f9d81;123456789027bfc4a51f362497493654d8527c9165;1234567890d5e3fab0bba8949347a66b2b22148394;1234567890feb7644258a5f0bce2871e5295a6712d;1234567890c7753ea044247aa66dda4db5ed6ad779;1234567890184f97bb3307abcc5f60eeaed8f32077;1234567890c732f6ec8eed82ef20e2b8c4ac959fe6;12345678909b997db373a97a91a58cb68f3e0710bf;1234567890943b4193f58619bd39827f8996c9ff19;1234567890a51fa90bb6b659acb1ccf81ffe457836;12345678909e4e757bdbe92581833190b3fbd3a38b;12345678902ca8f42d031bef055216415a463dd0f4;1234567890be18c2204f64e7d2c8c87c2c15f53c40;12345678900b7beeae4e865655dab95ba5902bf4f3;1234567890a90ea691ffdd286c83294bd9f46efafc;1234567890b4fc304c9efc9bf3951a0febd76269a0;1234567890319b1974a10418a87fede74078fa6091;123456789026586a2a867cba790fe4af9ea88e971a;123456789077e4340d8d890d9cbd7c67165b639820;12345678902cadb844efff36ad1a7c3af054e36a4c;1234567890eabb70de617effb68a895c87b0d6e180;12345678901950fb9145fbf10f1b7de85ccb68e7b4;12345678905b3d7c655435d0d27308b1d12dc7d658;12345678903cf93a4f75bdf76e0ec993ba85c81d8a;1234567890af44594ba610944964a78410d7874f68;1234567890acdb6d0d1028558a64873e1bc7de22f8;1234567890605b7c220e6f018335ffa8762f85dd46;123456789036fc3f4ac761bac3bfee77223e2a0a54;1234567890852f66bbfe78aef27b11219a3c91b95b;123456789044849dbb646cc0bc28f4085d150a5566;1234567890135aadface263ced8b90c5edb86969b5;1234567890c00f6dc998c88b78f531b6efd89b1ba6;1234567890edcf6cea76f63fa91814e9ce9bb34b50;1234567890801abcae7d4fbb63469623005b779e39;12345678900a83dd470e2fa8ecd9e602475db73f64;123456789047cc1fc938cfd11a9f4b05d45298f8e8;1234567890304e44a15f9b77a9bc7ab2b7d3c6fdb1;1234567890b98f2419d1fc88084959dc80f88e1ef4;1234567890b1579712c8c68fbc98c0e35b2b238bb8;123456789038e8c4ee16c141e9849a08c3f826109d;12345678902525ca12ca9401f181f31df1ca56505f;1234567890ed6fda2f46bb25be287b5bef3fbe66af;12345678906d85e44b03b57b7dafc9b7b1b92235ab;12345678906124338a1b8b8db4cdf8cd4d4da11551;12345678905350217346f57630bc91eed416a6468d;1234567890a58c8fbcffe7fb76738ae107d8419fc1;1234567890df6e179ac3bb4dbf5df71b66445810a0;1234567890dca45167ba46e1687c25a42f6fcb4a1b;1234567890ba452f8f8d744de09748fac2601af77d;1234567890b0a7ecd4f24a7bd2103361e9b7e03642;1234567890d7198b74897819f8c40da195bb87a549;123456789028ae12120044d8ea6bd4a7ffdc342a5f;12345678900db3a4512fd469cd4619cd40e872377a;1234567890d2f2491ea8460bbc8de0eee9b82d6dac;123456789023ccd72bd40113b7d129e7846477da68;1234567890443b8a853d93d72ec65d2f15c5d5c5b3;12345678907f9c2c59954b981bc1d8eb428b33b35f;1234567890ab18df7d9da6806cfa5bbc494022c2f1;123456789050dc72eb56cae76d602edbdd6952df8c;12345678902a805ae8e203f4a03eb4b1105ed54329;1234567890bf19dae7478a4de50fe2bd35b3946eb9;1234567890598c22e9ffcdea758c9bb9b3c77c70f0;1234567890242e71dfd3743ce4f68d084ae7c03f48;1234567890e65392a2bf48080840a6ca863e87a420;123456789034ceb777801b45d0621b93580300ffbb;1234567890195681af2fe0fefb12d65d15bd9d77c4;12345678906fa592cbe6faa05b20d61ee0559b9060;123456789082324ffe9992de16e44150dcf98cbae0;1234567890083c7ac5203789a0b688504f86e0a2d3;123456789042377f1da277d3131efe3235ae591d31;1234567890955aa6c7e384111a76c3775907ed82c8;12345678907c06ddb68a39dee69c44ad3025400bcc;1234567890916db791c325d02a3edeeb7627dcb407;1234567890877e20c6d922dc6313196e64d75a3a22;12345678907f05e391ef92ae147a323dd8d144caf8;1234567890c9768422ea2e758457101afc4c473da7;12345678900f597c2c1c9da9dd936dcbf9beb6dfcc".split(";");

            var qweI = ['8','nasa','alexx876','ilitarium','васян','илитариум','wat','рубль','dollar','euro','евро','доллар','бакс','петри','petri','dish','чашка','helo kitty','шурик','будь мужиком!','кошка','ｅｌｉｔｅ','lemon 3/4','шурик','sad boys','eugenesagaz','боженька','gamer pro','4pda','mr.makintosh','joyeux noel','#imp bardak™','light of life.','vault 101','lain','umbrella','миф','крутышка я','супер пупер пц','anus','sanyakosmos','ďąᏉẏĵøȵêš','admin','nezox','edinorog1','djkopatыч','peugeot','memory ✔','wowwowwow','₱ἡὠ∑₦ψx™','death hand','клякса','b1ll c1ph3r','','kлякса','кляксa','сычуга','truebandit','monster energy','король и шут','βіkøċ','инсайдер','mŗ.ē√ϊł','torment','cøquille','homer','life.','xobbut','spaceman','сосед','ingenious','будь мужиком!','','poulou68','чупик','patяrick','v l a d','spécialvip','подрывник','jvroad','kraken','niggor233','король шутов','mazay','mangas','neznakomka','альфа','♤ɓḽẫḉҝĵẫḉҝ♤','yooxx27','obvmv','galacy','catwomen','galaxy','winchester','hуþer.','pitbull','гггг','thunderbird','guardian','xj500','mister_kayne','s3r3nity','nicodocktv','p e r f e c t','nicodocktv1','клякca','тяжело','2руки2клешни','сип','skreeper','stasplex','devianz','laracroft','celestial.','çŕàžý_ďàńťĭśť','black fuck','фанат dsm','kyrag','virus','mindanddream','егэ','jummu','๖ۣۣۜrio','chappie','...-','virus1','test123','s p a c e','۞ҳσŗ¥ą۞','adventypa','б ® δ †','daf','angeal2','welcome to hell','|ffff|блэкджек','snow','алан вей','fl1ke','cantstopme','†голенькая†','ᴇᴀsᴛ ᴡᴀvᴇ','doc tv','шура','s w e e t','°•☆★random★☆•°','šaρρhire','bean07','play for paris','mralexpro26099','tvplush','the оскар','стюардесса','пилот','s m i l e','спартакмосква','power','[kaio]','⋰ Ꮶ ⋱','štǿrm'];

﻿
            var skinsSpecial = ["m'blob"];
            Blob.prototype = {
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
                flags: 0,
                updateTime: 0,
                updateCode: 0,
                drawTime: 0,
                destroyed: false,
                isVirus: false,
                isAgitated: false,
                wasSimpleDrawing: true,
                /**
                 * @return {undefined}
                 */
                destroy: function() {
                    var i;
                    /** @type {number} */
                    i = 0;
                    for (; i < list.length; i++) {
                        if (list[i] == this) {
                            list.splice(i, 1);
                            break;
                        }
                    }
                    delete blobs[this.id];
                    i = playerGroup.indexOf(this);
                    if (-1 != i) {
                        /** @type {boolean} */
                        qweA = true;
                        playerGroup.splice(i, 1);
                    }
                    i = ids.indexOf(this.id);
                    if (-1 != i) {
                        ids.splice(i, 1);
                    }
                    /** @type {boolean} */
                    this.destroyed = true;
                    sprites.push(this);
                },
                /**
                 * @return {?}
                 */
                getNameSize: function() {
                    if (isLargeNames) { //XXX
                        return 50 + 0.3 * this.size;
                    } else {
                        return Math.max(~~(0.3 * this.size), 24);
                    }
                },
                /**
                 * @param {string} name
                 * @return {undefined}
                 */
                setName: function(name) {
                    if (this.name = name) {
                        if (null == this.nameCache) {
                            this.nameCache = new SVGPlotFunction(this.getNameSize(), "#FFFFFF", true, "#000000");
                        } else {
                            this.nameCache.setSize(this.getNameSize());
                        }
                        this.nameCache.setValue(this.name);
                    }
                },
                /**
                 * @return {undefined}
                 */
                createPoints: function() {
                    var max = this.getNumPoints();
                    for (; this.points.length > max;) {
                        /** @type {number} */
                        var i = ~~(Math.random() * this.points.length);
                        this.points.splice(i, 1);
                        this.pointsAcc.splice(i, 1);
                    }
                    if (0 == this.points.length) {
                        if (0 < max) {
                            this.points.push({
                                self: this,
                                size: this.size,
                                x: this.x,
                                y: this.y
                            });
                            this.pointsAcc.push(Math.random() - 0.5);
                        }
                    }
                    var point;
                    for (; this.points.length < max;) {
                        /** @type {number} */
                        i = ~~(Math.random() * this.points.length);
                        point = this.points[i];
                        this.points.splice(i, 0, {
                            self: this,
                            size: point.size,
                            x: point.x,
                            y: point.y
                        });
                        this.pointsAcc.splice(i, 0, this.pointsAcc[i]);
                    }
                },
                /**
                 * @return {?}
                 */
                getNumPoints: function() {
                    if (0 == this.id) {
                        return 16;
                    }
                    /** @type {number} */
                    var rh = 10;
                    if (20 > this.size) {
                        /** @type {number} */
                        rh = 0;
                    }
                    if (this.isVirus) {
                        /** @type {number} */
                        rh = 30;
                    }
                    /** @type {number} */
                    var w = this.size;
                    if (!this.isVirus) {
                        w *= ratio;
                    }
                    w *= renderDetail;
                    if (this.flags & 32) {
                        w *= 0.25;
                    }
                    return ~~Math.max(w, rh);
                },
                /**
                 * @return {undefined}
                 */
                movePoints: function() {
                    this.createPoints();
                    var points = this.points;
                    var pointsAcc = this.pointsAcc;
                    var numPoints = points.length;
                    /** @type {number} */
                    var i = 0;
                    for (; i < numPoints; ++i) {
                        var qweL = pointsAcc[(i - 1 + numPoints) % numPoints];
                        var qweM = pointsAcc[(i + 1) % numPoints];
                        pointsAcc[i] += (Math.random() - 0.5) * (this.isAgitated ? 3 : 1);
                        pointsAcc[i] *= 0.7;
                        if (10 < pointsAcc[i]) {
                            /** @type {number} */
                            pointsAcc[i] = 10;
                        }
                        if (-10 > pointsAcc[i]) {
                            /** @type {number} */
                            pointsAcc[i] = -10;
                        }
                        /** @type {number} */
                        pointsAcc[i] = (qweL + qweM + 8 * pointsAcc[i]) / 10;
                    }
                    /** @type {Blob} */
                    var qweK = this;
                    /** @type {number} */
                    var qweO = 0;
                    if (!this.isVirus) {
                        /** @type {number} */
                        qweO = (this.id / 1E3 + timestampLastDraw / 1E4) % (2 * Math.PI);
                    }
                    /** @type {number} */
                    i = 0;
                    for (; i < numPoints; ++i) {
                        var size = points[i].size;
                        qweL = points[(i - 1 + numPoints) % numPoints].size;
                        qweM = points[(i + 1) % numPoints].size;
                        if (15 < this.size && (null != context && (20 < this.size * ratio && 0 != this.id))) {
                            /** @type {boolean} */
                            var qweN = false;
                            var startX = points[i].x;
                            var startY = points[i].y;
                            context.retrieve2(startX - 5, startY - 5, 10, 10, function(data) {
                                if (data.self != qweK) {
                                    if (25 > (startX - data.x) * (startX - data.x) + (startY - data.y) * (startY - data.y)) {
                                        /** @type {boolean} */
                                        qweN = true;
                                    }
                                }
                            });
                            if (!qweN) {
                                if (points[i].x < minX || (points[i].y < minY || (points[i].x > maxX || points[i].y > maxY))) {
                                    /** @type {boolean} */
                                    qweN = true;
                                }
                            }
                            if (qweN) {
                                if (0 < pointsAcc[i]) {
                                    /** @type {number} */
                                    pointsAcc[i] = 0;
                                }
                                pointsAcc[i] -= 1;
                            }
                        }
                        size += pointsAcc[i];
                        if (0 > size) {
                            /** @type {number} */
                            size = 0;
                        }
                        /** @type {number} */
                        size = this.isAgitated ? (19 * size + this.size) / 20 : (12 * size + this.size) / 13;
                        /** @type {number} */
                        points[i].size = (qweL + qweM + 8 * size) / 10;
                        /** @type {number} */
                        qweL = 2 * Math.PI / numPoints;
                        qweM = this.points[i].size;
                        if (this.isVirus) {
                            if (0 == i % 2) {
                                qweM += 5;
                            }
                        }
                        points[i].x = this.x + Math.cos(qweL * i + qweO) * qweM;
                        points[i].y = this.y + Math.sin(qweL * i + qweO) * qweM;
                    }
                },
                /**
                 * @return {?}
                 */
                updatePos: function() {
                    if (0 == this.id) {
                        return 1;
                    }
                    /** @type {number} */
                    var ratio = (timestampLastDraw - this.updateTime) / 120;
                    if (0 > ratio) {
                        /** @type {number} */
                        ratio = 0;
                    } else {
                        if (1 < ratio) {
                            /** @type {number} */
                            ratio = 1;
                        }
                    }
                    this.getNameSize();
                    if (this.destroyed && 1 <= ratio) {
                        var index = sprites.indexOf(this);
                        if (-1 != index) {
                            sprites.splice(index, 1);
                        }
                    }
                    this.x = ratio * (this.nx - this.ox) + this.ox;
                    this.y = ratio * (this.ny - this.oy) + this.oy;
                    this.size = ratio * (this.nSize - this.oSize) + this.oSize;
                    return ratio;
                },
                /**
                 * @return {?}
                 */
                shouldRender: function() {
                    if (0 == this.id) {
                        return true;
                    }
                    if (this.x + this.size + 40 < offsetX - width / 2 / ratio || (this.y + this.size + 40 < offsetY - height / 2 / ratio || (this.x - this.size - 40 > offsetX + width / 2 / ratio || this.y - this.size - 40 > offsetY + height / 2 / ratio))) {
                        return false;
                    }
                    return true;
                },
                /**
                 * @return {?}
                 */
                getMass: function() {
                    return ~~(this.size * this.size / 100);
                },
                _cachedDifference: Math.log(1.01),
                _cachedFood: {},
                /**
                 * @param {CanvasRenderingContext2D} ctx
                 * @return {undefined}
                 */
                draw: function(ctx) {
                    var isFood = false,
                    x = this.x,
                    y = this.y;
                    if (this.shouldRender()) {

                        if (this.size < 24 && !this.destroyed/* && this.shouldRender()*/) {
                            var key = this.color + '_' + this.size;
                            if(this._cachedFood[key]) {//если в кэше есть картинка еды - используем ее
                                ctx.drawImage(this._cachedFood[key], this.x - this.size, this.y - this.size);
                                return;
                            } else {//если еды нету в кэше - подготавливаем отдельный контекст
                                var newCanvas = document.createElement('canvas'),
                                    prevCtx = ctx;
                                newCanvas.width = newCanvas.height = this.size * 2;
                                ctx = newCanvas.getContext('2d');
                                isFood = true;
                                x = this.size;
                                y = this.size;
                                this._cachedFood[key] = newCanvas;
                            }
                        }

                        var color = this.color; //XXX
                        if (isInteractiveColors && (!isSpectating && this.size > 24)) { //XXX
                            var thisMass = this.getMass();
                            if (playerGroup.length === 0) {
                            //    color = this.color;
                            } else if (this.isVirus) {
                                if (this.getMass() > 220) {
                                    /** @type {string} */
                             //       color = "#300A48";
                                } else {
                                    /** @type {string} */
                               //     color = "#A020F0";
                                }
                            } else if (~playerGroup.indexOf(this)) {
                                /** @type {string} */
                               // color = "#3371FF";
                            } else if (thisMass > 1.3 * myMass * 2) {
                                /** @type {string} */
                              //  color = "#FF3C3C";
                            } else if (thisMass > 1.3 * myMass) {
                                /** @type {string} */
                               // color = "#FFBF3D";
                            } else if (1.3 * thisMass * 2 < myMass) {
                                /** @type {string} */
                               // color = "#44F720";
                            } else if (1.3 * thisMass < myMass) {
                                /** @type {string} */
                                //color = "#00AA00";
                            } else {
                                /** @type {string} */
                                //color = "#FFFF00";
                            }
                        }
                        /** @type {boolean} */
                        var isSimpleDrawing = isSimpleMode || (this.size < 24 && !isColorsOff); //XXX
                        if (5 > this.getNumPoints()) {
                            /** @type {boolean} */
                            isSimpleDrawing = true;
                        }
                        if (this.wasSimpleDrawing && !isSimpleDrawing) {
                            /** @type {number} */
                            var i = 0;
                            for (; i < this.points.length; i++) {
                                /** @type {number} */
                                this.points[i].size = this.size;
                            }
                        }
                        /** @type {boolean} */
                        this.wasSimpleDrawing = isSimpleDrawing;
                        ctx.save();
                        this.drawTime = timestampLastDraw;
                        var updatePos = this.updatePos();
                        if (this.destroyed) {
                            ctx.globalAlpha *= 1 - updatePos;
                        }
                        /** @type {number} */
                        ctx.lineWidth = isLargeBlobBorders ? 30 : 10; //XXX
                        /** @type {string} */
                        ctx.lineCap = "round";
                        /** @type {string} */
                        ctx.lineJoin = this.isVirus ? "miter" : "round";
                        if (isColorsOff) {
                            /** @type {string} */
                            ctx.fillStyle = "#FFFFFF";
                            /** @type {string} */
                            ctx.strokeStyle = "#AAAAAA";
                        } else {
                            if (":teams" == gameMode && !this.isVirus) { //XXX
                                ctx.fillStyle = this.color;
                            } else {
                                ctx.fillStyle = color;
                            }
                            ctx.strokeStyle = color; //XXX
                        }
                        if (isVirusTransparent && this.isVirus) { //XXX
                           // ctx.globalAlpha = 0.6;
                        }
                        if (isSimpleDrawing) {
                            ctx.beginPath();
                            ctx.arc(isFood ? x : this.x, isFood ? y : this.y, this.size, 0, 2 * Math.PI, false);
                        } else {
                            this.movePoints();
                            ctx.beginPath();
                            var numPoints = this.getNumPoints();
                            ctx.moveTo(this.points[0].x, this.points[0].y);
                            /** @type {number} */
                            i = 1;
                            for (; i <= numPoints; ++i) {
                                /** @type {number} */
                                var j = i % numPoints;
                                ctx.lineTo(this.points[j].x, this.points[j].y);
                            }
                        }
                        ctx.closePath();
                        var name = this.name.toLowerCase();



                        (function injection() {
                            var subName;
                            for(var i = 1; i < name.length; i++) {
                                subName = name.substr(0, i);
                                if (clansSkinMap[subName]) {
                                    name = clansSkinMap[subName];
                                    break;
                                }
                            }
                            if (oneSkinMap[name]) {
                                name = oneSkinMap[name];
                            }
                        })();
                        /** @type {null} */
                        var nameImg = null;
                        if (!this.isAgitated && isSkins) { //XXX
                            if ("undefined" !== typeof  skins2[name]) {
                                if (!images.hasOwnProperty(name)) {
                                    /** @type {Image} */
                                    images[name] = new Image;
                                    /** @type {string} */
                                    images[name].src = "https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/skins/" + name + ".png";
                                }
                                if (0 != images[name].width && images[name].complete) {
                                    nameImg = images[name];
                                }
                            }
                        }
                        /** @type {boolean} */
                        var isSkinSpecial = -1 != skinsSpecial.indexOf(name);
                        if (!isSimpleDrawing) {
                            ctx.stroke();
                        }
                        ctx.fill();

                        if (!(null == nameImg)) {
                            if (!isSkinSpecial) {
                                ctx.save();
                                ctx.clip();
                                if (isTransparent || ":teams" == gameMode) { //XXX
                                    /** @type {number} */
                                    //  ctx.globalAlpha = 0.6;
                                }
                                ctx.drawImage(nameImg, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size);
                                ctx.restore();
                            }
                        }

                        if (isColorsOff || 15 < this.size) {
                            if (!isSimpleDrawing) {
                                /** @type {string} */
                                ctx.strokeStyle = "#000000";
                                ctx.globalAlpha *= 0.1;
                                ctx.stroke();
                            }
                        }
                        /** @type {number} */
                        ctx.globalAlpha = 1;


                        /** @type {number} */
                        ctx.globalAlpha = 1; //XXX
                        /** @type {boolean} */
                        var isPlayer = -1 != playerGroup.indexOf(this);
                        /** @type {number} */
                        if (0 != this.id) {
                            isSimpleDrawing = ~~this.y;
                            if ((isNames || isPlayer) && (this.name && (this.nameCache && (null == nameImg || -1 == qweI.indexOf(isPlayer))))) {
				
                                var nameonshar = this.name;

                                if (-1 != qweI.indexOf(this.name.toLowerCase())) { nameonshar = ' '; }

                                var namePlot = this.nameCache;
                                namePlot.setValue(nameonshar);
                                namePlot.setSize(this.getNameSize());
                                /** @type {number} */
                                var nameScale = Math.ceil(10 * ratio) / 10;
                                namePlot.setScale(nameScale);
                                var nameRender = namePlot.render();
                                /** @type {number} */
                                var qweY = ~~(nameRender.width / nameScale);
                                /** @type {number} */
                                var qweP = ~~(nameRender.height / nameScale);
                                ctx.drawImage(nameRender, ~~this.x - ~~(qweY / 2), isSimpleDrawing - ~~(qweP / 2), qweY, qweP);
                                isSimpleDrawing += nameRender.height / 2 / nameScale + 4;
                            }
                        }
                        if (isShowMass) {
                            if ((isPlayer || 23 < this.size) && (this.size != 708)) { //XXX
                                if (null == this.sizeCache) {
                                    this.sizeCache = new SVGPlotFunction(this.getNameSize() / 2, "#FFFFFF", true, "#000000");
                                }
                                var sizePlot = this.sizeCache;
                                sizePlot.setSize(this.getNameSize() / 2);
                                sizePlot.setValue(~~(this.size * this.size / 100));
                                /** @type {number} */
                                var sizeScale = Math.ceil(10 * ratio) / 10;
                                sizePlot.setScale(sizeScale);
                                var sizeRender = sizePlot.render();
                                /** @type {number} */
                                qweY = ~~(sizeRender.width / sizeScale);
                                /** @type {number} */
                                var qweQ = ~~(sizeRender.height / sizeScale);
                                ctx.drawImage(sizeRender, ~~this.x - ~~(qweY / 2), isSimpleDrawing - ~~(qweQ / 2), qweY, qweQ);
                            }
                        }
                        ctx.restore();

                        if(key && prevCtx) {// если мы в первый раз отрисовали еду, то мы ее отрисовывали в другой контекст - нужно отрисовать и в этом
                            prevCtx.drawImage(this._cachedFood[key], this.x - this.size, this.y - this.size);
                        }

                    }
                }
            };

            var clansSkinMap={};

            var oneSkinMap={};

            var skins2 = (function () {
                var skins2 = {},
                    i;
                for(i = 0; i < skins.length; i++) {
                    skins2[skins[i]] = true;
                }
                return skins2;
            })();

            SVGPlotFunction.prototype = {
                _value: "",
                _color: "#000000",
                _stroke: false,
                _strokeColor: "#000000",
                _size: 16,
                _canvas: null,
                _ctx: null,
                _dirty: false,
                _scale: 1,
                /**
                 * @param {number} size
                 * @return {undefined}
                 */
                setSize: function(size) {
                    if (this._size != size) {
                        /** @type {number} */
                        this._size = size;
                        /** @type {boolean} */
                        this._dirty = true;
                    }
                },
                /**
                 * @param {?} scale
                 * @return {undefined}
                 */
                setScale: function(scale) {
                    if (this._scale != scale) {
                        this._scale = scale;
                        /** @type {boolean} */
                        this._dirty = true;
                    }
                },
                /**
                 * @param {string} color
                 * @return {undefined}
                 */
                setStrokeColor: function(color) {
                    if (this._strokeColor != color) {
                        /** @type {string} */
                        this._strokeColor = color;
                        /** @type {boolean} */
                        this._dirty = true;
                    }
                },
                /**
                 * @param {string} value
                 * @return {undefined}
                 */
                setValue: function(value) {
                    if (value != this._value) {
                        /** @type {string} */
                        this._value = value;
                        /** @type {boolean} */
                        this._dirty = true;
                    }
                },
                /**
                 * @return {?}
                 */
                render: function() {
                    if (null == this._canvas) {
                        /** @type {Element} */
                        this._canvas = document.createElement("canvas");
                        this._ctx = this._canvas.getContext("2d");
                    }
                    if (this._dirty) {
                        /** @type {boolean} */
                        this._dirty = false;
                        var canvas = this._canvas;
                        var ctx = this._ctx;
                        var caracter = this._value;
                        var scale = this._scale;
                        var size = this._size;
                        /** @type {string} */
                        var text = size + "px Ubuntu";
                        /** @type {string} */
                        ctx.font = text;
                        /** @type {number} */
                        var height = ~~(0.2 * size);
                        /** @type {number} */
                        canvas.width = (ctx.measureText(caracter).width + 6) * scale;
                        /** @type {number} */
                        canvas.height = (size + height) * scale;
                        /** @type {string} */
                        ctx.font = text;
                        ctx.scale(scale, scale);
                        /** @type {number} */
                        ctx.globalAlpha = 1;
                        /** @type {number} */
                        ctx.lineWidth = 3;
                        ctx.strokeStyle = this._strokeColor;
                        ctx.fillStyle = this._color;
                        if (this._stroke) {
                            ctx.strokeText(caracter, 3, size - height / 2);
                        }
                        ctx.fillText(caracter, 3, size - height / 2);
                    }
                    return this._canvas;
                },
                getWidth: function () {
                    return (ctx.measureText(this._value).width + 6);
                }
            };
            if (!Date.now) {
                /**
                 * @return {number}
                 */
                Date.now = function() {
                    return (new Date).getTime();
                };
            }
            var path = {
                /**
                 * @param {?} args
                 * @return {?}
                 */
                init: function(args) {
                    /**
                     * @param {number} x
                     * @param {number} y
                     * @param {number} w
                     * @param {number} h
                     * @param {number} depth
                     * @return {undefined}
                     */
                    function Node(x, y, w, h, depth) {
                        /** @type {number} */
                        this.x = x;
                        /** @type {number} */
                        this.y = y;
                        /** @type {number} */
                        this.w = w;
                        /** @type {number} */
                        this.h = h;
                        /** @type {number} */
                        this.depth = depth;
                        /** @type {Array} */
                        this.items = [];
                        /** @type {Array} */
                        this.nodes = [];
                    }
                    /** @type {number} */
                    var TOP_LEFT = 0;
                    /** @type {number} */
                    var TOP_RIGHT = 1;
                    /** @type {number} */
                    var BOTTOM_LEFT = 2;
                    /** @type {number} */
                    var BOTTOM_RIGHT = 3;
                    var maxChildren = args.maxChildren || 2;
                    var maxDepth = args.maxDepth || 4;
                    Node.prototype = {
                        x: 0,
                        y: 0,
                        w: 0,
                        h: 0,
                        depth: 0,
                        items: null,
                        nodes: null,
                        /**
                         * @param {Object} selector
                         * @return {?}
                         */
                        exists: function(selector) {
                            /** @type {number} */
                            var i = 0;
                            for (; i < this.items.length; ++i) {
                                var item = this.items[i];
                                if (item.x >= selector.x && (item.y >= selector.y && (item.x < selector.x + selector.w && item.y < selector.y + selector.h))) {
                                    return true;
                                }
                            }
                            if (0 != this.nodes.length) {
                                /** @type {Node} */
                                var self = this;
                                return this.findOverlappingNodes(selector, function(dir) {
                                    return self.nodes[dir].exists(selector);
                                });
                            }
                            return false;
                        },
                        /**
                         * @param {?} item
                         * @param {?} callback
                         * @return {undefined}
                         */
                        retrieve: function(item, callback) {
                            /** @type {number} */
                            var i = 0;
                            for (; i < this.items.length; ++i) {
                                callback(this.items[i]);
                            }
                            if (0 != this.nodes.length) {
                                /** @type {Node} */
                                var self = this;
                                this.findOverlappingNodes(item, function(dir) {
                                    self.nodes[dir].retrieve(item, callback);
                                });
                            }
                        },
                        /**
                         * @param {?} item
                         * @return {undefined}
                         */
                        insert: function(item) {
                            if (0 != this.nodes.length) {
                                this.nodes[this.findInsertNode(item)].insert(item);
                            } else {
                                if (this.items.length >= maxChildren && this.depth < maxDepth) {
                                    this.divide();
                                    this.nodes[this.findInsertNode(item)].insert(item);
                                } else {
                                    this.items.push(item);
                                }
                            }
                        },
                        /**
                         * @param {?} item
                         * @return {?}
                         */
                        findInsertNode: function(item) {
                            if (item.x < this.x + this.w / 2) {
                                if (item.y < this.y + this.h / 2) {
                                    return TOP_LEFT;
                                }
                                return BOTTOM_LEFT;
                            }
                            if (item.y < this.y + this.h / 2) {
                                return TOP_RIGHT;
                            }
                            return BOTTOM_RIGHT;
                        },
                        /**
                         * @param {Object} item
                         * @param {Function} callback
                         * @return {?}
                         */
                        findOverlappingNodes: function(item, callback) {
                            if (item.x < this.x + this.w / 2) {
                                if (item.y < this.y + this.h / 2) {
                                    if (callback(TOP_LEFT)) {
                                        return true;
                                    }
                                }
                                if (item.y >= this.y + this.h / 2) {
                                    if (callback(BOTTOM_LEFT)) {
                                        return true;
                                    }
                                }
                            }
                            if (item.x >= this.x + this.w / 2) {
                                if (item.y < this.y + this.h / 2) {
                                    if (callback(TOP_RIGHT)) {
                                        return true;
                                    }
                                }
                                if (item.y >= this.y + this.h / 2) {
                                    if (callback(BOTTOM_RIGHT)) {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        },
                        /**
                         * @return {undefined}
                         */
                        divide: function() {
                            var childrenDepth = this.depth + 1;
                            /** @type {number} */
                            var width = this.w / 2;
                            /** @type {number} */
                            var height = this.h / 2;
                            this.nodes.push(new Node(this.x, this.y, width, height, childrenDepth));
                            this.nodes.push(new Node(this.x + width, this.y, width, height, childrenDepth));
                            this.nodes.push(new Node(this.x, this.y + height, width, height, childrenDepth));
                            this.nodes.push(new Node(this.x + width, this.y + height, width, height, childrenDepth));
                            var oldChildren = this.items;
                            /** @type {Array} */
                            this.items = [];
                            /** @type {number} */
                            var i = 0;
                            for (; i < oldChildren.length; i++) {
                                this.insert(oldChildren[i]);
                            }
                        },
                        /**
                         * @return {undefined}
                         */
                        clear: function() {
                            /** @type {number} */
                            var i = 0;
                            for (; i < this.nodes.length; i++) {
                                this.nodes[i].clear();
                            }
                            /** @type {number} */
                            this.items.length = 0;
                            /** @type {number} */
                            this.nodes.length = 0;
                        }
                    };
                    var internalSelector = {
                        x: 0,
                        y: 0,
                        w: 0,
                        h: 0
                    };
                    return {
                        root: function() {
                            return new Node(args.minX, args.minY, args.maxX - args.minX, args.maxY - args.minY, 0);
                        }(),
                        /**
                         * @param {?} item
                         * @return {undefined}
                         */
                        insert: function(item) {
                            this.root.insert(item);
                        },
                        /**
                         * @param {?} selector
                         * @param {?} callback
                         * @return {undefined}
                         */
                        retrieve: function(selector, callback) {
                            this.root.retrieve(selector, callback);
                        },
                        /**
                         * @param {number} x
                         * @param {number} y
                         * @param {number} w
                         * @param {number} h
                         * @param {?} callback
                         * @return {undefined}
                         */
                        retrieve2: function(x, y, w, h, callback) {
                            /** @type {number} */
                            internalSelector.x = x;
                            /** @type {number} */
                            internalSelector.y = y;
                            /** @type {number} */
                            internalSelector.w = w;
                            /** @type {number} */
                            internalSelector.h = h;
                            this.root.retrieve(internalSelector, callback);
                        },
                        /**
                         * @param {Object} x
                         * @return {?}
                         */
                        exists: function(x) {
                            return this.root.exists(x);
                        },
                        /**
                         * @return {undefined}
                         */
                        clear: function() {
                            this.root.clear();
                        }
                    };
                }
            };
            $(function() {
                /**
                 * @return {undefined}
                 */
                function draw() {
                    if (0 < playerGroup.length) {
                        self.color = playerGroup[0].color;
                        if (window.selmode == "ARENA") {
                          self.color = "#eb4b00";
                        }
                        if (window.selmode == "FATBOY-ARENA") {
                          self.color = "#eb4b00";
                        }
                        self.setName(playerGroup[0].name);
                    }
                    c.clearRect(0, 0, 32, 32);
                    c.save();
                    c.translate(16, 16);
                    c.scale(0.4, 0.4);
                    self.draw(c);
                    c.restore();
                    ++e;
                    e %= 10;
                    if (0 == e) {

                    }
                }
                var self = new Blob(0, 0, 0, 32, "#ED1C24", "");
                /** @type {Element} */
                var canvas = document.createElement("canvas");
                /** @type {number} */
                canvas.width = 32;
                /** @type {number} */
                canvas.height = 32;
                var c = canvas.getContext("2d");
                /** @type {number} */
                var e = 0;
                draw();
                setInterval(draw, 1E3 / 60);
            });
            /**
             * @param {boolean} input
             * @return {undefined}
             */
            self.setShowBorders = function(input) {
                /** @type {boolean} */
                isShowBorders = input;
            };
            /**
             * @param {boolean} input
             * @return {undefined}
             */
            self.setUnlimitedZoom = function(input) {
                /** @type {boolean} */
                isUnlimitedZoom = input;
            };
            /**
             * @param {boolean} input
             * @return {undefined}
             */
            self.setInteractiveColors = function(input) {
                /** @type {boolean} */
                isInteractiveColors = input;
            };
            /**
             * @param {boolean} input
             * @return {undefined}
             */
            self.setTransparent = function(input) {
                /** @type {boolean} */
                isTransparent = input;
            };
            /**
             * @param {boolean} input
             * @return {undefined}
             */
            self.setLargeNames = function(input) {
                /** @type {boolean} */
                isLargeNames = input;
            };
            /**
             * @param {boolean} input
             * @return {undefined}
             */
            self.setSpectate = function(input) {
                /** @type {boolean} */
                isSpectating = input;
                if (!isSpectating) {
                    $("#playBtn").addClass("btn-primary");
                    $("#playBtn").removeClass("btn-warning");
                }
            };
            /**
             * @param {boolean} input
             * @return {undefined}
             */
            self.setLargeBlobBorders = function(input) {
                /** @type {boolean} */
                isLargeBlobBorders = input;
            };
            /**
             * @param {boolean} input
             * @return {undefined}
             */
            self.setVirusTransparent = function(input) {
                /** @type {boolean} */
                isVirusTransparent = input;
            };
            /**
             * @param {boolean} input
             * @return {undefined}
             */
            self.setSimpleMode = function(input) {
                /** @type {boolean} */
                isSimpleMode = input;
            };

            self.setHideGrid = function(input) {
                /** @type {boolean} */
                isHideGrid = input;
            };

            /**
             * @return {undefined}
             */
            self.serverConnectBtn = function() {
                if ($("#server_ip").val()) {
                    open("ws://" + $("#server_ip").val());
                }
            };
            /**
             * @return {undefined}
             */
            self.nicksChange = function() {
                var name = $("#nicks").children("option").filter(":selected").text();
                $("#nick").val(name);
                if (-1 != skins.indexOf(name)) {
                    $("#preview").attr("src", "https://cdn.rawgit.com/mZer0ne/PetriDish.pw-mods/master/assets/skins/default/" + name + ".png");
                }
            };
            /** @type {function (): undefined} */
            win.onload = init;
        }
        /** @type {boolean} */
        var isShowBorders = true;
        /** @type {boolean} */
        var isUnlimitedZoom = true;
        /** @type {boolean} */
        var isInteractiveColors = true;
        /** @type {boolean} */
        var isSpectating = false;
        /** @type {boolean} */
        var isTransparent = false;
        /** @type {boolean} */
        var isLargeNames = false;
        /** @type {boolean} */
        var isLargeBlobBorders = false;
        /** @type {boolean} */
        var isVirusTransparent = true;
        /** @type {boolean} */
        var isSimpleMode = true;
        var isHideGrid = false;
        /** @type {number} */
        var myMass = 0;
    }
})(window, window.jQuery);

// Работаем после загрузки страницы
window.jQuery( window ).ready(function( $ ) {
  // Наше говно)
  $('body').append(
    "<style>" +
      "#minimap-frame{z-index:-999;width:300px;height:300px;}" +
      "#minimap-div{position:relative;left:0px;top:0px;}" +
      "#chatlog div strong{cursor: pointer;}" +
    "</style>" + 
    "<script>" + 
      "var mZeEngine = {" +
        "to: function( nick ){" + 
          "$('#chat_textbox').val(nick + ', ');" + 
          "$('body').trigger($.Event('keydown', { keyCode: 13}));" + 
          "$('body').trigger($.Event('keyup', { keyCode: 13}));" + 
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
        "}" +
      "};"+
    "</script>"
  );

  $("#setdark")
    .before('<input type="checkbox" id="setnames" onchange="createCookie(\'setratings\',!$(\'#setratings\').is(\':checked\'),999);setRatings(!$(this).is(\':checked\'));"><label> Без рейтингов</label><br/>');

    
  // Всякое говно от проекта)
  var hhh = screen.width;
  hhh = hhh/2-450;
  $("#settingsDialog").animate({ "left": hhh + "px" }, "1" );
  $("#donatewindow").remove();
  
  var ss = readCookie("simplerenderbutton");
	if (ss == null) {
		$("#simplerenderbutton").attr("checked","checked");
		setSimpleMode(true);
	}

	if (ss == 'true') {
		$("#simplerenderbutton").attr("checked","checked");
		setSimpleMode(true);
	}

	if (ss == 'false') {
		$("#simplerenderbutton").removeAttr("checked");
		setSimpleMode(false);
	}


	var gridss = readCookie("hidegrid");
	if (gridss == null) {
		$("#hidegrid").removeAttr("checked");
		setHideGrid(false);
	}

	if (gridss == 'true') {
		$("#hidegrid").attr("checked","checked");
		setHideGrid(true);
	}

	if (gridss == 'false') {
		$("#hidegrid").removeAttr("checked");
		setHideGrid(false);
	}


	var skinss = readCookie("setskins");
	if (skinss == 'true') {
		$("#setskins").removeAttr("checked");
		setSkins(true);
	}

	if (skinss == 'false') {
		$("#setskins").attr("checked","checked");
		setSkins(false);
	}

	var setnamess = readCookie("setnames");
	if (setnamess == 'true') {
		$("#setnames").removeAttr("checked");
		setNames(true);
	}

	if (setnamess == 'false') {
		$("#setnames").attr("checked","checked");
		setNames(false);
	}
  
  var setratingss = readCookie("setratings");
	if (setratingss == 'true') {
		$("#setratings").removeAttr("checked");
		setRatings(true);
	}

	if (setratingss == 'false') {
		$("#setratings").attr("checked","checked");
		setRatings(false);
	}

	var setdarks = readCookie("setdark");
	if (setdarks == 'true') {
		$("#setdark").attr("checked","checked");
		setDarkTheme(true);
	}

	if (setdarks == 'false') {
		$("#setdark").removeAttr("checked");
		setDarkTheme(false);
	}

	var setcolorss = readCookie("setcolors");
	if (setcolorss == 'true') {
		$("#setcolors").attr("checked","checked");
		setColorsOff(true);
	}

	if (setcolorss == 'false') {
		$("#setcolors").removeAttr("checked");
		setColorsOff(false);
	}

	var setmasss = readCookie("setmass");
	if (setmasss == 'true') {
		$("#setmass").attr("checked","checked");
		setShowMass(true);
	}

	if (setmasss == 'false') {
		$("#setmass").removeAttr("checked");
		setShowMass(false);
	}

	var largeborderss = readCookie("largeborders");
	if (largeborderss == 'true') {
		$("#largeborders").attr("checked","checked");
		setLargeBlobBorders(true);
	}

	if (largeborderss == 'false') {
		$("#largeborders").removeAttr("checked");
		setLargeBlobBorders(false);
	}

	var largenamess = readCookie("largenames");
	if (largenamess == 'true') {
		$("#largenames").attr("checked","checked");
		setLargeNames(true);
	}

	if (largenamess == 'false') {
		$("#largenames").removeAttr("checked");
		setLargeNames(false);
	}


	var setacids = readCookie("setacid");
	if (setacids == 'true') {
		$("#setacid").attr("checked","checked");
		setAcid(true);
	}

	if (setacids == 'false') {
		$("#setacid").removeAttr("checked");
		setAcid(false);
	}

	var setrealtimestatss = readCookie("setrealtimestats");
	if (setrealtimestatss == 'true') {
		$("#setrealtimestats").attr("checked","checked");
		OnChangeDisplayStats(true);
	}

	if (setrealtimestatss == 'false') {
		$("#setrealtimestats").removeAttr("checked");
		OnChangeDisplayStats(false);
	}
});
