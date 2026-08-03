FROM alpine:latest AS base

RUN apk add --no-cache bash libstdc++
RUN apk add --no-cache \
	--repository=http://dl-cdn.alpinelinux.org/alpine/edge/community \
	mise

WORKDIR /var/app/

ENV \
	MISE_ALL_COMPILE=false \
	MISE_NODE_MIRROR_URL=https://unofficial-builds.nodejs.org/download/release/
COPY --parents .config/mise.toml ./
RUN mise install

COPY --parents package.json aube-lock.yaml ./
COPY --parents apps/*/package.json ./
RUN mise exec -- aube ci --ignore-scripts

COPY --parents .env tsconfig.json ./
ENV PATH="/var/app/node_modules/.bin:$PATH"

FROM base AS api

COPY --parents apps/api/ ./

EXPOSE 3000
CMD [ "mise", "exec", "--", "aube", "--dir", "apps/api/", "run", "preview" ]

FROM base AS web

COPY --parents apps/web/ ./
RUN mise exec -- aube --dir apps/web/ run build

EXPOSE 5173
CMD [ "mise", "exec", "--", "aube", "--dir", "apps/web/", "run", "preview" ]
