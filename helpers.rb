module Util
  class Mysql_wrapper
    def xquery(query, *params)
      $mysql.with do |conn|
        conn.xquery(query, *params)
      end
    end
    def xquery_insert(query, *params)
      $mysql.with do |conn|
        conn.xquery(query, *params)
        conn.last_id
      end
    end
    def xquery_transaction(&block)
      raise ArgumentError, "No block was given" unless block_given?
      $mysql.with do |conn|
        begin
          conn.xquery("BEGIN")
          yield
          conn.xquery("COMMIT")
        rescue Mysql2::Error => e
          conn.xquery("ROLLBACK")
          p e
          p "ERROR_NUMBER: #{e.errno}"
          e
        end
      end
    end
  end

  def connection
    return $mysql_wrapper if $mysql_wrapper
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
    $mysql = ConnectionPool.new(size: 5, timeout: 5) {
      Mysql2::Client.new(settings.mysql_config)
    }
    return $mysql_wrapper = Mysql_wrapper.new
  end
end