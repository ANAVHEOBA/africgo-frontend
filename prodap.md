a@a:~/logistics-backend$ curl -X POST \
  http://localhost:5000/acurl -X POST \eate \
  http://localhost:5000/api/products/create \iIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I1YjVhZjdkYmIzZGI3ZTQ1N2
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I1YjVhZjdkYmIzZGI3ZTQ1N2Q3ZDgiLCJlbWFpbCI6Implc3NpY2FhbmF2aGVvYmFAZ21haWwuY29tIiwiaWF0IjoxNzQzNjA4NDEwLCJleHAiOjE3NDM2OTQ4MTB9.EgaFedZ3ieWIoCuwn_MNTDeey_JVhuU3fjfc424u6xs" \
  -F "name=Test Product" \a test product description" \
  -F "description=This is a test product description" \
  -F "price=99.99" \ronics" \
  -F "category=Electronics" \
  -F "stock=100" \e/a/Pictures/Screenshots/Screenshot from 2025-04-02 11-27-18.png" \
  -F "images=@/home/a/Pictures/Screenshots/Screenshot from 2025-04-02 11-27-18.png" \
  -F "specifications[color]=Black"
{"success":true,"data":{"storeId":"67b7410f256d7687d08935fd","name":"Test Product","description":"This is a test product description","price":99.99,"category":"Electronics","images":[{"url":"https://res.cloudinary.com/duk2hhkns/image/upload/v1743609097/products/nadazl4bendsbolxixid.png","publicId":"products/nadazl4bendsbolxixid","_id":"67ed5d0b7ff2af31bc43782f"}],"stock":100,"specifications":{"color":"Black"},"status":"ACTIVE","isPublished":false,"guestOrderEnabled":true,"minOrderQuantity":1,"maxOrderQuantity":999,"_id":"67ed5d0a7ff2af31bc43782e","variants":[],"createdAt":"2025-04-02T15:51:39.029Z","updatedAt":"2025-04-02T15:51:39.029Z","__v":0}}a@a:~/logistics-backend$ 





















a@a:~/logistics-backend$ curl -X POST http://localhost:5000/api/products/create -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I1YjVhZjdkYmIzZGI3ZTQ1N2Q3ZDgiLCJlbWFpbCI6Implc3NpY2FhbmF2aGVvYmFAZ21haWwuY29tIiwiaWF0IjoxNzQzNjA4NDEwLCJleHAiOjE3NDM2OTQ4MTB9.EgaFedZ3ieWIoCuwn_MNTDeey_JVhuU3fjfc424u6xs" -F "name=Test Product" -F "description=This is a test product description" -F "price=99.99" -F "category=Electronics" -F "stock=100" -F "images=@/home/a/Pictures/Screenshots/Screenshot from 2025-04-02 11-27-18.png" -F "specifications[color]=Black" -F "specifications[brand]=Samsung" -F "specifications[model]=XYZ123" -F "variants[0][name]=Size" -F "variants[0][options][]=Small" -F "variants[0][options][]=Medium" -F "variants[0][options][]=Large" -F "variants[0][prices][]=89.99" -F "variants[0][prices][]=99.99" -F "variants[0][prices][]=109.99" -F "variants[1][name]=Color" -F "variants[1][options][]=Red" -F "variants[1][options][]=Blue" -F "variants[1][prices][]=99.99" -F "variants[1][prices][]=99.99" -F "isPublished=true" -F "guestOrderEnabled=true" -F "minOrderQuantity=1" -F "maxOrderQuantity=10" -F "shippingInfo[weight]=1.5" -F "shippingInfo[dimensions][length]=10" -F "shippingInfo[dimensions][width]=5" -F "shippingInfo[dimensions][height]=2" -F "shippingInfo[requiresSpecialHandling]=false"
{"success":true,"data":{"storeId":"67b7410f256d7687d08935fd","name":"Test Product","description":"This is a test product description","price":99.99,"category":"Electronics","images":[{"url":"https://res.cloudinary.com/duk2hhkns/image/upload/v1743609635/products/zmhp68ffgrq88bwvlxvh.png","publicId":"products/zmhp68ffgrq88bwvlxvh","_id":"67ed5f237ff2af31bc43783b"}],"stock":100,"specifications":{"color":"Black","brand":"Samsung","model":"XYZ123"},"variants":[{"name":"Size","options":["Small","Medium","Large"],"prices":[89.99,99.99,109.99],"_id":"67ed5f237ff2af31bc43783c"},{"name":"Color","options":["Red","Blue"],"prices":[99.99,99.99],"_id":"67ed5f237ff2af31bc43783d"}],"status":"ACTIVE","isPublished":true,"guestOrderEnabled":true,"minOrderQuantity":1,"maxOrderQuantity":10,"shippingInfo":{"weight":1.5,"dimensions":{"length":10,"width":5,"height":2},"requiresSpecialHandling":false},"_id":"67ed5f237ff2af31bc43783a","createdAt":"2025-04-02T16:00:35.986Z","updatedAt":"2025-04-02T16:00:35.986Z","__v":0}}a@a:~/logistics-backend$ 