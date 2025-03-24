a@a:~/logistics-backend$ curl -X GET \
  http://localhost:5000/api/stores/customers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I1YjVhZjdkYmIzZGI3ZTQ1N2Q3ZDgiLCJlbWFpbCI6Implc3NpY2FhbmF2aGVvYmFAZ21haWwuY29tIiwiaWF0IjoxNzQyODI0MzM3LCJleHAiOjE3NDI5MTA3Mzd9.ECSND8RJglk7kOcKUKQcp5M6qomxYWRWpo1GUB1t49I"
{"success":true,"data":{"customers":[{"totalOrders":25,"totalSpent":31894.65,"lastOrderDate":"2025-03-21T02:28:13.422Z","consumerId":"67bdba50fcb27218d15deab7","name":"Updated Name Anavheoba","email":"anavheobawisdom@gmail.com"},{"totalOrders":4,"totalSpent":499.90000000000003,"lastOrderDate":"2025-02-25T15:39:52.777Z","consumerId":null,"name":null}],"pagination":{"total":2,"page":1,"limit":10,"totalPages":1}}}a@a:~/logistics-backend$ 
























a@a:~/logistics-backend$ curl -X GET \
  http://localhost:5000/api/addresses \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I1YjVhZjdkYmIzZGI3ZTQ1N2Q3ZDgiLCJlbWFpbCI6Implc3NpY2FhbmF2aGVvYmFAZ21haWwuY29tIiwiaWF0IjoxNzQyODI0MzM3LCJleHAiOjE3NDI5MTA3Mzd9.ECSND8RJglk7kOcKUKQcp5M6qomxYWRWpo1GUB1t49I"
{"success":true,"data":[{"_id":"67e16bac777ce163b8adcd52","userId":"67b5b5af7dbb3db7e457d7d8","street":"456 Updated Store Street","city":"New Store City","state":"New Store State","country":"New Store Country","postalCode":"54321","isDefault":true,"label":"Store Address","createdAt":"2025-03-24T14:26:52.365Z","updatedAt":"2025-03-24T14:27:14.732Z","__v":0},{"_id":"67b5ba23f6fbd5420ab073d3","userId":"67b5b5af7dbb3db7e457d7d8","street":"45 Park Avenue","city":"Lagos","state":"Lagos State","country":"Nigeria","postalCode":"100002","isDefault":false,"label":"Office","createdAt":"2025-02-19T11:01:55.273Z","updatedAt":"2025-03-24T14:26:52.373Z","__v":0},{"_id":"67d57408163127a9c2c06af5","userId":"67b5b5af7dbb3db7e457d7d8","street":"456 Fashion Avenue","city":"Lagos","state":"Lagos","country":"Nigeria","postalCode":"100002","isDefault":false,"label":"Store Address","createdAt":"2025-03-15T12:35:20.263Z","updatedAt":"2025-03-24T14:26:52.373Z","__v":0}]}a@a:~/logistics-backend$ 




















a@a:~/logistics-backend$ curl -X GET \
  http://localhost:5000/api/addresses/67e16bac777ce163b8adcd52 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I1YjVhZjdkYmIzZGI3ZTQ1N2Q3ZDgiLCJlbWFpbCI6Implc3NpY2FhbmF2aGVvYmFAZ21haWwuY29tIiwiaWF0IjoxNzQyODI0MzM3LCJleHAiOjE3NDI5MTA3Mzd9.ECSND8RJglk7kOcKUKQcp5M6qomxYWRWpo1GUB1t49I"
{"success":true,"data":{"_id":"67e16bac777ce163b8adcd52","userId":"67b5b5af7dbb3db7e457d7d8","street":"456 Updated Store Street","city":"New Store City","state":"New Store State","country":"New Store Country","postalCode":"54321","isDefault":true,"label":"Store Address","createdAt":"2025-03-24T14:26:52.365Z","updatedAt":"2025-03-24T14:27:14.732Z","__v":0}}a@a:~/logistics-backend$ 



















a@a:~/logistics-backend$ curl -X PUT \
  http://localhost:5000/api/addresses/67b5ba23f6fbd5420ab073d3 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I1YjVhZjdkYmIzZGI3ZTQ1N2Q3ZDgiLCJlbWFpbCI6Implc3NpY2FhbmF2aGVvYmFAZ21haWwuY29tIiwiaWF0IjoxNzQyODI0MzM3LCJleHAiOjE3NDI5MTA3Mzd9.ECSND8RJglk7kOcKUKQcp5M6qomxYWRWpo1GUB1t49I" \
  -d '{
    "street": "50 Updated Park Avenue",
    "city": "Lagos",
    "state": "Lagos State",
    "country": "Nigeria",
  }'"label": "Updated Office"
{"success":true,"data":{"_id":"67b5ba23f6fbd5420ab073d3","userId":"67b5b5af7dbb3db7e457d7d8","street":"50 Updated Park Avenue","city":"Lagos","state":"Lagos State","country":"Nigeria","postalCode":"100002","isDefault":false,"label":"Updated Office","createdAt":"2025-02-19T11:01:55.273Z","updatedAt":"2025-03-24T14:53:13.606Z","__v":0}}a@a:~/logistics-backend$ 






















a@a:~/logistics-backend$ curl -X POST \
  http://localhost:5000/api/addresses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I1YjVhZjdkYmIzZGI3ZTQ1N2Q3ZDgiLCJlbWFpbCI6Implc3NpY2FhbmF2aGVvYmFAZ21haWwuY29tIiwiaWF0IjoxNzQyODI0MzM3LCJleHAiOjE3NDI5MTA3Mzd9.ECSND8RJglk7kOcKUKQcp5M6qomxYWRWpo1GUB1t49I" \
  -d '{
    "street": "123 New Home Street",
    "city": "Lagos",
    "state": "Lagos State",
    "country": "Nigeria",
  }'"isDefault": false001",
{"success":true,"data":{"userId":"67b5b5af7dbb3db7e457d7d8","street":"123 New Home Street","city":"Lagos","state":"Lagos State","country":"Nigeria","postalCode":"100001","isDefault":false,"label":"Home","_id":"67e171f8163a71e4b9d91e90","createdAt":"2025-03-24T14:53:44.642Z","updatedAt":"2025-03-24T14:53:44.642Z","__v":0}}a@a:~/logistics-backend$ 
















a@a:~/logistics-backend$ curl -X DELETE \
  http://localhost:5000/api/addresses/67e171f8163a71e4b9d91e90 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I1YjVhZjdkYmIzZGI3ZTQ1N2Q3ZDgiLCJlbWFpbCI6Implc3NpY2FhbmF2aGVvYmFAZ21haWwuY29tIiwiaWF0IjoxNzQyODI0MzM3LCJleHAiOjE3NDI5MTA3Mzd9.ECSND8RJglk7kOcKUKQcp5M6qomxYWRWpo1GUB1t49I"
{"success":true,"message":"Address deleted successfully"}a@a:~/logistics-backend$ 