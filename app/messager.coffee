{EventEmitter} = require('events')

class Messager extends EventEmitter
  constructor: ->
    @messages = []

  @toString: -> 'Messager'

  add: (message) ->
    console.log("add message with text %s", message.text)
    console.log("add message with user %s", message.user)
    test = (m.text for m in @messages when m.text == message.text)
    if (test.length > 0)
      message.text = "STFU"
      @messages.push(message)
      @emit('add', message)
    else 
      @messages.push(message)
      @emit('add', message)

  getMessages: ->
    @messages

exports.Messager = Messager
