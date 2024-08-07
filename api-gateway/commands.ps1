## Check jq installation is existed or not. If not, install it.
if (-not (Test-Path "C:\Program Files\jq\jq.exe")) {
    winget install jqlang.jq
}


## Export Default Configuration
mcurl -s localhost:8001 | jq '.configuration' > output/configuration-default.json

## Set Rate Limit Globbaly to 60 requests per minute.
mcurl -X POST http://localhost:8001/plugins --data name=rate-limiting --data config.minute=60 --data config.policy=local -o output/admin-api-rate-limit-global.json

## Set Default Proxy Cache to 30 seconds
mcurl -X POST http://localhost:8001/plugins --data "name=proxy-cache" --data "config.request_method=GET" --data "config.response_code=200" --data "config.content_type=application/json; charset=utf-8" --data "config.cache_ttl=30" --data "config.strategy=memory" -o output/admin-api-proxy-cache-global.json

## Creating Admin API Service
mcurl --request POST --url http://localhost:8001/services --data name=admin-api-service --data url='http://localhost:8001' -o output/admin-api-service.json

## Creating Admin API Route
mcurl --request POST --url http://localhost:8001/services/admin-api-service/routes --data 'paths[]=/admin-api' --data name=admin-api-route -o output/admin-api-route.json

## Enable Key Auth on Admin API Service
mcurl --request POST --url http://localhost:8001/services/admin-api-service/plugins --header 'Content-Type: application/json' --header 'accept: application/json' --data '{"name":"key-auth","config":{"key_names":["api-key"],"key_in_query":false}}' -o output/admin-api-key.json

## Create Admin API Consumer
mcurl --request POST --url http://localhost:8001/consumers --header 'Content-Type: application/json' --header 'accept: application/json' --data '{"username":"administrator","custom_id":"administrator"}' -o output/admin-api-consumer.json

## Creata Admin API Key
mcurl -X POST http://localhost:8001/consumers/administrator/key-auth -o output/admin-api-consumer-key.json