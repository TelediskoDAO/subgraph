server {
    server_name graph.dao-staging.teledisko.com;

    location /ipfs/api/v0/add {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://127.0.0.1:5001/api/v0/add;
    }

    location /ipfs/api/v0/pin/add {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://127.0.0.1:5001/api/v0/pin/add;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/graph.dao-staging.teledisko.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/graph.dao-staging.teledisko.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = graph.dao-staging.teledisko.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    server_name graph.dao-staging.teledisko.com;
    return 404; # managed by Certbot
}