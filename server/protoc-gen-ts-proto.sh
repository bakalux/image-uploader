#!/bin/bash

PROTO_DIR=./proto
OUT_DIR=./libs/protos

mkdir -p $OUT_DIR

# Используем системный protoc и node_modules плагин
protoc \
  --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_out=./libs/protos \
  --proto_path=./proto \
  ./proto/*.proto

