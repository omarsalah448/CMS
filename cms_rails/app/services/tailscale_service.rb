require 'uri'
require 'net/http'

class TailscaleService
  def initialize(secret_token)
    @secret_token = secret_token
    @base_url = "https://api.tailscale.com/api/v2/"
  end

  def create_key
    url = URI.join(@base_url, "tailnet/-/keys")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(url)
    request["Content-Type"] = 'application/json'
    request["Authorization"] = "Bearer #{@secret_token}"
    request.body = {
      capabilities: {
              devices: {
                  create: {
                      reusable: false,
                      ephemeral: false,
                      preauthorized: true
                  }
              }
      },
      expirySeconds: 86400,
    }.to_json

    response = http.request(request)
    JSON.parse(response.body)["key"]
  end

  # this method should be called as soon as the
  # user inputs their key
  def edit_acl
    url = URI.join(@base_url, "tailnet/-/acl")
    
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    
    request = Net::HTTP::Post.new(url)
    request["Authorization"] = "Bearer #{@secret_token}"
    request.body = {
      acls: [
       {
           action: "accept",
           src: [],
           dst: []
       }
      ]
    }.to_json
          
    response = http.request(request)
    JSON.parse(response.body)
  end

  def create_invitation_url(device_id)
    url = URI.join(@base_url, "device/#{device_id}/device-invites")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(url)
    request["Content-Type"] = 'application/json'
    request["Authorization"] = "Bearer #{ENV['OUR_API_TOKEN']}"
    request.body = [
      {
          "multiUse": false
      }
    ].to_json

    response = http.request(request)
    JSON.parse(response.body)[0]["inviteUrl"]
  end

  def accept_invitation(invitation_url)
    url = URI.join(@base_url, "device-invites/-/accept")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    
    request = Net::HTTP::Post.new(url)
    request["Authorization"] = "Bearer #{@secret_token}"
    request.body = {
      "invite": invitation_url
      }.to_json
    
    response = http.request(request)
    JSON.parse(response.body)
  end

  def share_device(device_id)
    ActiveRecord::Base.transaction do
      invitation_url = create_invitation_url(device_id)
      accept_invitation(invitation_url)
    end
  end
end