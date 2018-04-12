task :default => 'serve'

task 'serve' do
  sh 'bundle exec rackup -p 4567'
end

task 'prod' do
  sh 'bundle exec unicorn -E production -c unicorn.rb -D'
end