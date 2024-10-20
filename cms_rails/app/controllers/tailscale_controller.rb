class TailscaleController < ApplicationController
  before_action :get_api_access_token
  def create_key
    response = TailscaleService.new(@access_token).create_key
    render json: response
  end
  def edit_acl
    response = TailscaleService.new(@access_token).edit_acl
    render json: response
  end

  def share_device
    response = TailscaleService.new(@access_token).share_device(params[:device_id])
    render json: response
  end

  private
  def get_api_access_token
    # should be something like this:
    # current_user.access_token
    @access_token = "tskey-api-kLxD11sXH311CNTRL-LyqPCXc2Khg66ohKHCK6hgv4i6FESNEx"
  end
end
