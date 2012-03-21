class MessageQueue
    constructor:(@always_display) ->
      @messages = [ ]

    add:(m) -> 
      @messages.push(m)

    can_display:(new_message) ->
      if @always_display 
        return true
      test = (m for m in @messages when m == new_message)
      console.log(test)
      return (test.length == 0)
        
message_queue = new MessageQueue(true)

initialize = ->
  $command = $('#command')
  $command.focus()
  $command.on 'keyup', (event) ->
    return if event.keyCode != 13  ## Magic number for Enter.
    $this = $(this)
    switch $this.val()
      when '' then return
      else 
        [command, content...] = $this.val().split(" ")
        # console.log("Splitted %s", command)
        switch (command)
          when "/filter" then message_queue.always_display = false
          when "/showall" then message_queue.always_display = true
        console.log(message_queue.always_display)
    socket.emit('command', $this.val())
    $this.val('')
    
socket = io.connect('http://#{window.location.host}')


socket.on 'init', (data) ->
  userName = data.self
  for user in data.users
    addUser(user)
  for message in data.messages
    addMessage(message.user, message.text)

socket.on 'add_user', (user) ->
  addUser(user)

socket.on 'remove_user', (user) ->
  $('#users #'+user).remove()

socket.on 'add_message', (message) ->
  addMessage(message.user, message.text)

addUser = (user) ->
  $user = $('<div />')
  $user.attr('id', user)
  $user.html(user)
  $('#users').append($user)

addMessage = (user, message) ->
  if (message_queue.can_display(message))
    message_queue.add(message)
    $msg = $('<tr />')
    $msg.html("<td class='username'>#{user}</td><td class='message'>#{message}</td>")
    $('#messages').append($msg)
  else
    console.log("Slienced %s", message)

$ -> initialize()
