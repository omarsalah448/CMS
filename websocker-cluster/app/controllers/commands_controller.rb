class CommandsController < ApplicationController
  def hello
    ActionCable.server.broadcast 'CommandsChannel', "Hello from the Rails app."
  end
end
