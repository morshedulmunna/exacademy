FROM nginx:1.27-alpine

RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --retries=10 CMD wget -qO- http://localhost/ | cat >/dev/null 2>&1 || exit 1


