#!/bin/bash

# Check if jq is installed, if not, install it
if ! command -v jq &> /dev/null
then
    echo "jq could not be found, installing..."
    if command -v apt-get &> /dev/null
    then
        sudo apt-get update
        sudo apt-get install -y jq
    elif command -v yum &> /dev/null
    then
        sudo yum install -y jq
    elif command -v brew &> /dev/null
    then
        brew install jq
    else
        echo "Package manager not found. Please install jq manually."
        exit 1
    fi
fi

# Export Default Configuration
curl -s http://localhost:8001 | jq '.configuration' > output/configuration-default.json

# Set Rate Limit Globally to 60 requests per minute
curl -X POST http://localhost:8001/plugins --data "name=rate-limiting" --data "config.minute=60" --data "config.policy=local" -o output/admin-api-rate-limit-global.json

# Set Default Proxy Cache to 30 seconds
curl -X POST http://localhost:8001/plugins --data "name=proxy-cache" --data "config.request_method=GET" --data "config.response_code=200" --data "config.content_type=application/json; charset=utf-8" --data "config.cache_ttl=30" --data "config.strategy=memory" -o output/admin-api-proxy-cache-global.json

# Creating Admin API Service
curl --request POST --url http://localhost:8001/services --data "name=admin-api-service" --data "url=http://localhost:8001" -o output/admin-api-service.json

# Creating Admin API Route
curl --request POST --url http://localhost:8001/services/admin-api-service/routes --data "paths[]=/admin-api" --data "name=admin-api-route" -o output/admin-api-route.json

# Enable Key Auth on Admin API Service
curl --request POST --url http://localhost:8001/services/admin-api-service/plugins --header 'Content-Type: application/json' --header 'accept: application/json' --data '{"name":"key-auth","config":{"key_names":["api-key"],"key_in_query":false}}' -o output/admin-api-key.json

# Create Admin API Consumer
curl --request POST --url http://localhost:8001/consumers --header 'Content-Type: application/json' --header 'accept: application/json' --data '{"username":"administrator","custom_id":"administrator"}' -o output/admin-api-consumer.json

# Create Admin API Key
curl -X POST http://localhost:8001/consumers/administrator/key-auth -o output/admin-api-consumer-key.json