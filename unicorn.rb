worker_processes 2
preload_app true

after_fork do |server, worker|
  UUID.generator.next_sequence
end

@dir = "./"
#
#  worker_processes 1 # CPUのコア数に揃える
#  working_directory @dir
#
#  timeout 300
#  listen 80
#
# pid "#{@dir}tmp/pids/unicorn.pid" #pidを保存
#
# unicornは標準出力には何も吐かないのでログ出力をする
stderr_path "#{@dir}log/unicorn.stderr.log"
stdout_path "#{@dir}log/unicorn.stdout.log"
