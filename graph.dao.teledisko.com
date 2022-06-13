server {
    server_name graph.dao.teledisko.com;

    location /ipfs/ {
        if ($request_method ~* "(GET|POST)") {
            add_header "Access-Control-Allow-Origin"  *;
            add_header "Access-Control-Allow-Methods" "GET, POST, OPTIONS, HEAD";
            add_header "Access-Control-Allow-Headers" "Authorization, Origin, X-Requested-With, Content-Type, Accept";
        }

        # Preflighted requests
        if ($request_method = OPTIONS ) {
            add_header "Access-Control-Allow-Origin"  *;
            add_header "Access-Control-Allow-Methods" "GET, POST, OPTIONS, HEAD";
            add_header "Access-Control-Allow-Headers" "Authorization, Origin, X-Requested-With, Content-Type, Accept";
            return 200;
        }
        proxy_set_header User-Agent "";
        proxy_set_header Accept-Encoding "";
        proxy_set_header Accept-Language "";
        proxy_set_header Referer "";
        proxy_set_header Origin "";
        proxy_set_header Sec-Fetch-Dest "";
        proxy_set_header Sec-Fetch-Mode "";
        proxy_set_header Sec-Fetch-Site "";
        proxy_pass http://127.0.0.1:5001/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/graph.dao.teledisko.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/graph.dao.teledisko.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = graph.dao.teledisko.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    server_name graph.dao.teledisko.com;
    return 404; # managed by Certbot
}