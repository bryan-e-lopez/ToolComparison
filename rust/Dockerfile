# Build: docker build -t rust/webservice:1.0 .
# Run: docker run -p 8080:8080 rust/webservice:1.0

# FROM rust:1.70.0 AS build
ARG RUST_VERSION=1.70.0
ARG APP_NAME=webservice
FROM --platform=linux/arm64 rust:${RUST_VERSION}-slim-bullseye AS build
WORKDIR /usr/src/
RUN apt update && apt-get install -y musl-tools && rm -rf /var/lib/apt/lists/*
# RUN rustup target add x86_64-unknown-linux-musl
# RUN rustup target add aarch64-apple-darwin

RUN USER=root cargo new webservice
WORKDIR /usr/src/webservice
COPY src ./src
COPY Cargo.toml Cargo.lock ./
RUN cargo build --release

# RUN cargo install --target aarch64-apple-darwin --path .
# RUN cargo install --target x86_64-unknown-linux-musl --path .
# RUN cargo install 

# FROM scratch
# WORKDIR /app/
# COPY --from=build /usr/local/cargo/bin/restapiwebserver /app/
EXPOSE 7000
USER 1000
ENTRYPOINT ["./target/release/webservice"]