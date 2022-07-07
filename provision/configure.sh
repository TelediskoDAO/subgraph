#!/usr/bin/env bash

apt update
apt upgrade
reboot

# Firewall

ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Add user worker
adduser worker
mkdir ~worker/.ssh
cp ~root/.ssh/authorized_keys ~worker/.ssh/
chmod 600 -R ~worker/.ssh/
chmod 700 ~worker/.ssh
chown worker:worker -R ~worker/.ssh

# Install docker and docker-compose
apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
# apt-cache policy docker-ce
apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin

## Add worker to docker users
usermod -aG docker worker


# Install zsh
apt install zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"


# Configure tmux
cat > .tmux.conf <<EOF
set -s escape-time 1
# set -g mouse on
# remap prefix from 'C-b' to 'C-a'
unbind C-b
set-option -g prefix C-a
bind-key C-a last-window
EOF


# install node 16
# https://github.com/nodesource/distributions#deb
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
apt-get install -y nodejs


# install pnpm
npm install -g pnpm



# install nginx
apt install nginx
# copy file
ln -s /etc/nginx/sites-available/graph.dao.teledisko.com /etc/nginx/sites-enabled


# install certbot
apt install snapd
snap install core
snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
certbot --nginx

# (optional) install IPFS

wget https://dist.ipfs.io/go-ipfs/v0.13.0/go-ipfs_v0.13.0_linux-amd64.tar.gz
tar -xvzf go-ipfs_v0.13.0_linux-amd64.tar.gz
cd go-ipfs
bash install.sh