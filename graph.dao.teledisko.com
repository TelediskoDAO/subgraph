server {
    server_name graph.dao.teledisko.com;

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
}