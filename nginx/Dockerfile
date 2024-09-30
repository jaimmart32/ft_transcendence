FROM nginx:latest

# Install OpenSSL to generate certificates
RUN apt-get update && apt-get install -y openssl && apt-get clean

# Create directory for SSL certificates
RUN mkdir -p /etc/nginx/certs

# Generate auto-signed SSL certificate and private key
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/certs/cert.key \
    -out /etc/nginx/certs/cert.pem \
    -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=localhost"

# Copiar custom nginx.conf
COPY nginx.conf /etc/nginx/conf.d/nginx.conf
