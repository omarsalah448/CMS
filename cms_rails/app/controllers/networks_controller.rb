class NetworksController < ApplicationController
  def index
    render json: { message: "any message for now" }
  end
end
