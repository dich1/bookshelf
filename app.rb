require 'sinatra/base'
require 'sinatra/param'
require 'sinatra/cross_origin'
require 'mysql2-cs-bind'
require 'json'
require 'yaml'
require 'carrierwave'
require 'carrierwave/storage/fog'
require 'aws-sdk'
require 'fileutils'

$filename

class ImageUploader < CarrierWave::Uploader::Base
  permissions 0666
  directory_permissions 0777
  storage :fog

  def extension_whitelist
    %w(jpg jpeg gif png)
  end

  def filename
    $filename = "#{SecureRandom.uuid}.#{file.extension}" if original_filename.present?
  end
end

CarrierWave.configure do |config|
  config.storage         = :fog
  config.fog_provider    = 'fog/aws'
  config.fog_credentials = {
    provider:              'AWS',
    aws_access_key_id:     ENV['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
    region:                'ap-northeast-1'
  }
  config.fog_directory  = ENV['S3_BUCKET_NAME']
  config.fog_public = true
end

class Bookshelf < Sinatra::Application
  enable :method_override
  set :show_exceptions, false
  helpers Sinatra::Param

  # UNREAD   = 0
  PETITION         = 0
  READING          = 1
  # FINISHED = 2
  SAFEKEEPING      = 2

  PER_PAGE_LIMIT   = 20

  url = ENV['APP_ENV']
  if url.nil?
    url = 'http://localhost:4567'
  end

  # configure :production do
  # end

  # configure :development do
  # end
  
  configure do
    enable :cross_origin
    register Sinatra::CrossOrigin
    set :allow_methods, [:get, :post, :options, :put, :delete]
    set :public_folder, 'public'

    db_url = ENV['CLEARDB_DATABASE_URL']
    set :mysql_config, if db_url.nil?
        YAML.load_file('database.yml')  
    else
        require 'uri'
        uri = URI.parse(db_url)
        ui  = uri.userinfo.split(':')
        { 
          'host'      => uri.host,
          'port'      => uri.port || 3306,
          'database'  => uri.path[1..-1],
          'username'  => ui.first,
          'password'  => ui.last,
          'reconnect' => true
        }
    end
  end

  before do
    cross_origin
    @client = Mysql2::Client.new(settings.mysql_config)
    # @client = Mysql2::Client.new(YAML.load_file('database.yml'))[:development]
    @ary = Array.new
    @hash = Hash.new { |h, k| h[k] = [] }
    content_type :json
  end

  after do
    @client.close
  end

  options "*" do
    response.headers["Access-Control-Allow-Methods"] = "HEAD,GET,PUT,POST,DELETE,OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept"
    "ok"
  end

### Route ###
  get '/' do
    redirect to('index.html')
  end

  get '/api/books/' do
    param :status, Integer, required: false
    param :page  , Integer, required: false
    get_books_action
  end

  # get '/api/books/count/unread/' do
  #   get_count_unread
  # end 

  get '/api/books/count/petition/' do
    get_count_petition
  end 

  get '/api/books/count/reading/' do
    get_count_reading
  end 

  # get '/api/books/count/finished/' do
  #   get_count_finished
  # end

  get '/api/books/count/safekeeping/' do
    get_count_safekeeping
  end

  get '/api/book/detail/' do
    param :id    , Integer, required: true
    if get_book_detail.nil?
      status 404
    else
      get_book_detail
    end
  end

  post '/api/book/' do
    # パラメータ不正：status 400
    param :title , String , required: true
    param :image , Hash   , required: true
    param :status, Integer, required: true
    register_book
    status 201
    {}.to_json
    # status 409
  end

  put '/api/book/' do
    param :id    , Integer, required: true
    param :title , String , required: true
    param :image , String , required: true
    param :status, Integer, required: true
    if get_book.nil?
      status 404
    else
      update_book
      status 204
    end
    # status 409
  end

  # put '/api/book/unread/' do
  #   param :id    , Integer, required: true
  #   if get_book.count.zero?
  #     status 404
  #   else
  #     update_unread
  #     status 204
  #   end
  #   # status 409
  # end

  put '/api/book/petition/' do
    param :id    , Integer, required: true
    if get_book.nil?
      status 404
    else
      update_petition
      status 204
    end
    # status 409
  end

  put '/api/book/reading/' do
    param :id    , Integer, required: true
    if get_book.nil?
      status 404
    else
      update_reading
      status 204
    end
    # status 409
  end

  # put '/api/book/finished/' do
  #   param :id    , Integer, required: true
  #   if get_book.count.zero?
  #     status 404
  #   else
  #     update_finished
  #     status 204
  #   end
  #   # status 409
  # end

  put '/api/book/safekeeping/' do
    param :id    , Integer, required: true
    if get_book.nil?
      status 404
    else
      update_safekeeping
      status 204
    end
    # status 409
  end

  put '/api/book/return-date/' do
    param :id          , Integer, required: true
    param :returnDate  , String , required: true
    if get_book.nil?
      status 404
    else
      update_return_date
      status 204
    end
    # status 409
  end

  put '/api/book/detail/' do
    param :id          , Integer, required: true
    param :memo        , String , required: false
    if get_book.nil?
      status 404
    else
      update_book_detail
      status 204
    end
    # status 409
  end

  delete '/api/book/' do
    param :id    , Integer, required: true
    if get_book.nil?
      status 404
    else
      delete_book
      status 204
    end
    # status 409
  end

  not_found do
    '404 not found'
  end

  error do
    '500 server error'
  end
### Route ###

### Controller ###
  def get_books_action
    if params[:page].nil?
      offset = 0
    else
      prev_page = params[:page] - 1
      if params[:page] === 1
        offset = params[:page] - 1
      else
        offset = prev_page * PER_PAGE_LIMIT
      end
    end
    get_books(offset)
  end
### Controller ###

### Model ###
  def get_books(offset)
    sql          = "SELECT * FROM books "
    count_sql    = "SELECT COUNT(*) AS count FROM books "
    unless params[:status].nil?
      sql       << "WHERE status = " + params[:status].to_s
      count_sql << "WHERE status = " + params[:status].to_s
    end
    sql         << " ORDER BY created_at DESC LIMIT "
    sql         << offset.to_s + ', '
    sql         << PER_PAGE_LIMIT.to_s
    puts sql
    puts count_sql
    @client.xquery(sql).each {|row| @ary << row}
    @hash["books"]   = @ary
    @hash["records"] = @client.xquery(count_sql).first["count"];
    return @hash.to_json
  end

  # def get_count_unread
  #   sql = "SELECT COUNT(*) as count 
  #            FROM books 
  #           WHERE status = ?"
  #   @hash = @client.xquery(sql, UNREAD).first
  #   return @hash.to_json
  # end

  def get_count_petition
    sql = "SELECT COUNT(*) as count 
             FROM books 
            WHERE status = ?"
    @hash = @client.xquery(sql, PETITION).first
    return @hash.to_json
  end

  def get_count_reading
    sql = "SELECT COUNT(*) as count 
             FROM books 
            WHERE status = ?"
    @hash = @client.xquery(sql, READING).first
    return @hash.to_json
  end

  # def get_count_finished
  #   sql = "SELECT COUNT(*) as count 
  #            FROM books 
  #           WHERE status = ?"
  #   @hash = @client.xquery(sql, FINISHED).first
  #   return @hash.to_json
  # end

  def get_count_safekeeping
    sql = "SELECT COUNT(*) as count 
             FROM books 
            WHERE status = ?"
    @hash = @client.xquery(sql, SAFEKEEPING).first
    return @hash.to_json
  end

  def get_book_detail
    sql = "SELECT memo 
             FROM book_details 
            WHERE id = ?"
    @hash = @client.xquery(sql, params[:id]).first
    if @hash.nil?
      return @hash
    end 
    return @hash.to_json
  end

  def register_book
    uploader = ImageUploader.new
    uploader.store!(params[:image])

    sql = "INSERT INTO books
             (title, image, status)
           VALUES 
             (?, ?, ?)"
    @client.xquery(sql, params[:title], $filename, params[:status])
    return 
  end

  def update_book
    sql = "UPDATE books 
              SET title = ?
                , image = ?
                , status = ? 
            WHERE id = ?"
    @client.xquery(sql, params[:title], params[:image], params[:status], params[:id])
    return 
  end

  # def update_unread
  #   sql = "UPDATE books 
  #             SET status = ? 
  #           WHERE id = ?"
  #   @client.xquery(sql, UNREAD, params[:id])
  #   return 
  # end

  def update_petition
    sql = "UPDATE books 
              SET status = ? 
            WHERE id = ?"
    @client.xquery(sql, PETITION, params[:id])
    return 
  end

  def update_reading
    sql = "UPDATE books 
              SET status = ? 
            WHERE id = ?"
    @client.xquery(sql, READING, params[:id])
    return 
  end

  # def update_finished
  #   sql = "UPDATE books 
  #             SET status = ? 
  #           WHERE id = ?"
  #   @client.xquery(sql, FINISHED, params[:id])
  #   return 
  # end

  def update_safekeeping
    sql = "UPDATE books 
              SET status = ? 
            WHERE id     = ?"
    @client.xquery(sql, SAFEKEEPING, params[:id])
    return 
  end

  def update_return_date
    sql = "UPDATE books 
              SET return_date = ? 
            WHERE id = ?"
    @client.xquery(sql, params[:returnDate], params[:id])
    return 
  end

  def update_book_detail
    sql = "INSERT INTO book_details
             (id, memo)
           VALUES 
             (?, ?)
           ON DUPLICATE KEY UPDATE
             memo = VALUES(memo)"
    @client.xquery(sql, params[:id], params[:memo])
    return 
  end

  def delete_book
    bucket = Aws::S3::Resource.new(
        :region            => 'ap-northeast-1',
        :access_key_id     => 'AKIAJ4DA6R6MQ4L4QSIA',
        :secret_access_key => '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',
    ).bucket('bookshelf-image')

    target_book = get_book

    if bucket.object('uploads/' + target_book['image']).exists?
      bucket.object('uploads/' + target_book['image']).delete
    end
    
    sql = "DELETE 
             FROM books 
            WHERE id = ?"
    @client.xquery(sql, params[:id])
    return 
  end

  def get_book
    sql = "SELECT * 
             FROM books 
            WHERE id = ?"
    @hash = @client.xquery(sql, params[:id]).first
    return @hash
  end
### Model ###
end
