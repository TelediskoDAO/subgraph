FROM ipfs/go-ipfs:v0.10.0

COPY ./bin/container_daemon /usr/local/bin/start_ipfs
RUN chmod 0755 /usr/local/bin/start_ipfs