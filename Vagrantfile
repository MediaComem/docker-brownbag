# -*- mode: ruby -*-
# vi: set ft=ruby :
Vagrant.configure('2') do |config|
  config.vm.box = 'ubuntu/xenial64'

  config.vm.provider 'virtualbox' do |vb|
    vb.cpus = 2
    vb.memory = 2048
  end

  config.vm.define 'vm1' do |vm1|
    vm1.vm.hostname = 'vm1'
    vm1.vm.network 'private_network', ip: '192.168.50.4'
    vm1.vm.provision 'shell', inline: PROVISION
  end

  config.vm.define 'vm2' do |vm2|
    vm2.vm.hostname = 'vm2'
    vm2.vm.network 'private_network', ip: '192.168.50.5'
    vm2.vm.provision 'shell', inline: PROVISION
  end

  config.vm.define 'vm3' do |vm2|
    vm2.vm.hostname = 'vm3'
    vm2.vm.network 'private_network', ip: '192.168.50.6'
    vm2.vm.provision 'shell', inline: PROVISION
  end
end

PROVISION = <<EOS

if command -v docker 1>/dev/null; then
  echo $(docker --version) is already installed
else
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
  add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
  apt-get update
  apt-get install -y docker-ce=18.03.0~ce-0~ubuntu
fi

if command -v docker-compose 1>/dev/null; then
  echo $(docker-compose --version) is already installed
else
  curl -L https://github.com/docker/compose/releases/download/1.21.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose
fi

if test -f /vagrant/tmp/domain.crt; then
  echo /vagrant/tmp/domain.crt already exists
else
  mkdir /vagrant/tmp
  cd /vagrant/tmp
  openssl req -newkey rsa:4096 -nodes -sha256 -keyout domain.key -x509 -days 365 -out domain.crt -subj "/C=US/ST=New York/L=New York City/O=Acme/OU=IT/CN=example.com" -reqexts SAN -extensions SAN -config <(cat /etc/ssl/openssl.cnf <(printf "\n[SAN]\nsubjectAltName=IP:192.168.50.4"))
fi

if test -f /etc/docker/certs.d/192.168.50.4:443/ca.crt; then
  echo /etc/docker/certs.d/192.168.50.4:443/ca.crt already exists
else
  mkdir -p /etc/docker/certs.d/192.168.50.4:443
  cp /vagrant/tmp/domain.crt /etc/docker/certs.d/192.168.50.4:443/ca.crt
fi

EOS
