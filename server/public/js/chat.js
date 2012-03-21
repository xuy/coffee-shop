(function() {
  var MessageQueue, addMessage, addUser, initialize, message_queue, socket,
    __slice = Array.prototype.slice;

  MessageQueue = (function() {

    function MessageQueue(always_display) {
      this.always_display = always_display;
      this.messages = [];
    }

    MessageQueue.prototype.add = function(m) {
      return this.messages.push(m);
    };

    MessageQueue.prototype.can_display = function(new_message) {
      var m, test;
      if (this.always_display) return true;
      test = (function() {
        var _i, _len, _ref, _results;
        _ref = this.messages;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          m = _ref[_i];
          if (m === new_message) _results.push(m);
        }
        return _results;
      }).call(this);
      console.log(test);
      return test.length === 0;
    };

    return MessageQueue;

  })();

  message_queue = new MessageQueue(true);

  initialize = function() {
    var $command;
    $command = $('#command');
    $command.focus();
    return $command.on('keyup', function(event) {
      var $this, command, content, _ref;
      if (event.keyCode !== 13) return;
      $this = $(this);
      switch ($this.val()) {
        case '':
          return;
        default:
          _ref = $this.val().split(" "), command = _ref[0], content = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
          switch (command) {
            case "/filter":
              message_queue.always_display = false;
              break;
            case "/showall":
              message_queue.always_display = true;
          }
          console.log(message_queue.always_display);
      }
      socket.emit('command', $this.val());
      return $this.val('');
    });
  };

  socket = io.connect('http://#{window.location.host}');

  socket.on('init', function(data) {
    var message, user, userName, _i, _j, _len, _len2, _ref, _ref2, _results;
    userName = data.self;
    _ref = data.users;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      user = _ref[_i];
      addUser(user);
    }
    _ref2 = data.messages;
    _results = [];
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      message = _ref2[_j];
      _results.push(addMessage(message.user, message.text));
    }
    return _results;
  });

  socket.on('add_user', function(user) {
    return addUser(user);
  });

  socket.on('remove_user', function(user) {
    return $('#users #' + user).remove();
  });

  socket.on('add_message', function(message) {
    return addMessage(message.user, message.text);
  });

  addUser = function(user) {
    var $user;
    $user = $('<div />');
    $user.attr('id', user);
    $user.html(user);
    return $('#users').append($user);
  };

  addMessage = function(user, message) {
    var $msg;
    if (message_queue.can_display(message)) {
      message_queue.add(message);
      $msg = $('<tr />');
      $msg.html("<td class='username'>" + user + "</td><td class='message'>" + message + "</td>");
      return $('#messages').append($msg);
    } else {
      return console.log("Slienced %s", message);
    }
  };

  $(function() {
    return initialize();
  });

}).call(this);
