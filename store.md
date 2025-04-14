a@a:~/logistics-backend$ # Basic store listing
curl -X GET "http://local# Basic store listinglist"
curl -X GET "http://localhost:5000/api/stores/list"
# With filters
# With filtersttp://localhost:5000/api/stores/list?page=1&limit=10&category=FASHION&city=Lagos&sortBy=c
curl -X GET "http://localhost:5000/api/stores/list?page=1&limit=10&category=FASHION&city=Lagos&sortBy=createdAt&sortOrder=desc&minRating=4"
# With search
# With searchhttp://localhost:5000/api/stores/list?search=fashion&page=1&limit=10"
curl -X GET "http://localhost:5000/api/stores/list?search=fashion&page=1&limit=10"
# Filter by location
# Filter by locationlocalhost:5000/api/stores/list?city=Lagos&state=Lagos&country=Nigeria"
curl -X GET "http://localhost:5000/api/stores/list?city=Lagos&state=Lagos&country=Nigeria"
{"success":true,"data":{"stores":[{"contactInfo":{"email":"michealanavheoba@gmail.com","phone":"07023904633","whatsapp":""},"address":{"street":"eosodn","city":"edo","state":"benn ","country":"Nigeria","postalCode":"34567"},"settings":{"isVerified":false,"isFeaturedStore":false,"allowRatings":false},"metrics":{"totalOrders":0,"totalRevenue":0,"totalProducts":1},"_id":"67b857e9c62a9612a91952ed","storeName":"Micheal store","description":"my store","category":"OTHER","status":"ACTIVE","createdAt":"2025-02-21T10:39:37.277Z","updatedAt":"2025-02-21T19:15:40.444Z","slug":"micheal-store","__v":0,"storeUrl":"http://localhost:5000/store/micheal-store"},{"contactInfo":{"email":"jessicaanavheoba@gmail.com","phone":"+2341234567890","whatsapp":"+2341234567890"},"address":{"street":"15 Victoria Island Road","city":"Lagos","state":"Lagos State","country":"Nigeria","postalCode":"101001"},"socialLinks":{"instagram":"https://instagram.com/jessicafashionhub","facebook":"https://facebook.com/jessicafashionhub"},"businessInfo":{"registrationNumber":"RC123456"},"settings":{"isVerified":false,"isFeaturedStore":false,"allowRatings":true},"metrics":{"totalOrders":0,"totalRevenue":0,"totalProducts":3},"_id":"67b7410f256d7687d08935fd","storeName":"Jessica Fashion Hub","description":"Updated description - Your premier fashion destination in Lagos","category":"FASHION","status":"ACTIVE","createdAt":"2025-02-20T14:49:51.447Z","updatedAt":"2025-02-21T19:04:42.021Z","slug":"jessica-fashion-hub","__v":0,"storeUrl":"http://localhost:5000/store/jessica-fashion-hub"}],"pagination":{"total":2,"page":1,"totalPages":1,"hasMore":false}}}{"success":true,"data":{"stores":[],"pagination":{"total":0,"page":1,"totalPages":0,"hasMore":false}}}{"success":true,"data":{"stores":[{"contactInfo":{"email":"jessicaanavheoba@gmail.com","phone":"+2341234567890","whatsapp":"+2341234567890"},"address":{"street":"15 Victoria Island Road","city":"Lagos","state":"Lagos State","country":"Nigeria","postalCode":"101001"},"socialLinks":{"instagram":"https://instagram.com/jessicafashionhub","facebook":"https://facebook.com/jessicafashionhub"},"businessInfo":{"registrationNumber":"RC123456"},"settings":{"isVerified":false,"isFeaturedStore":false,"allowRatings":true},"metrics":{"totalOrders":0,"totalRevenue":0,"totalProducts":3},"_id":"67b7410f256d7687d08935fd","storeName":"Jessica Fashion Hub","description":"Updated description - Your premier fashion destination in Lagos","category":"FASHION","status":"ACTIVE","createdAt":"2025-02-20T14:49:51.447Z","updatedAt":"2025-02-21T19:04:42.021Z","slug":"jessica-fashion-hub","__v":0,"storeUrl":"http://localhost:5000/store/jessica-fashion-hub"}],"pagination":{"total":1,"page":1,"totalPages":1,"hasMore":false}}}{"success":true,"data":{"stores":[{"contactInfo":{"email":"jessicaanavheoba@gmail.com","phone":"+2341234567890","whatsapp":"+2341234567890"},"address":{"street":"15 Victoria Island Road","city":"Lagos","state":"Lagos State","country":"Nigeria","postalCode":"101001"},"socialLinks":{"instagram":"https://instagram.com/jessicafashionhub","facebook":"https://facebook.com/jessicafashionhub"},"businessInfo":{"registrationNumber":"RC123456"},"settings":{"isVerified":false,"isFeaturedStore":false,"allowRatings":true},"metrics":{"totalOrders":0,"totalRevenue":0,"totalProducts":3},"_id":"67b7410f256d7687d08935fd","storeName":"Jessica Fashion Hub","description":"Updated description - Your premier fashion destination in Lagos","category":"FASHION","status":"ACTIVE","createdAt":"2025-02-20T14:49:51.447Z","updatedAt":"2025-02-21T19:04:42.021Z","slug":"jessica-fashion-hub","__v":0,"storeUrl":"http://localhost:5000/store/jessica-fashion-hub"}],"pagination":{"total":1,"page":1,"totalPages":1,"hasMore":false}}}a@a:~/logistics-backend$ 




a@a:~/logistics-backend$ curl -X GET "http://localhost:5000/api/stores/jessica-fashion-hub"
{"success":true,"data":{"store":{"contactInfo":{"email":"jessicaanavheoba@gmail.com","phone":"+2341234567890","whatsapp":"+2341234567890"},"address":{"street":"15 Victoria Island Road","city":"Lagos","state":"Lagos State","country":"Nigeria","postalCode":"101001"},"socialLinks":{"instagram":"https://instagram.com/jessicafashionhub","facebook":"https://facebook.com/jessicafashionhub"},"_id":"67b7410f256d7687d08935fd","storeName":"Jessica Fashion Hub","description":"Updated description - Your premier fashion destination in Lagos","category":"FASHION","status":"ACTIVE","createdAt":"2025-02-20T14:49:51.447Z","updatedAt":"2025-02-21T19:04:42.021Z","slug":"jessica-fashion-hub","__v":0,"storeUrl":"http://localhost:5000/store/jessica-fashion-hub"},"isOpen":true}}a@a:~/logistics-backend$ # Get products from Jessica Fashion Hub                    # Get products from Jessica Fashion Hub
curl -X GET "http://localhost:5000/api/stores/jessica-fashion-hub/products"

# Get products with filters
curl -X GET "http://localhost:5000/api/stores/jessica-fashion-hub/products?page=1&limit=20&category=shirts"

# Get products with sorting
curl -X GET "http://localhost:5000/api/stores/jessica-fashion-hub/products?sortBy=price&sortOrder=asc"
{"success":true,"data":{"products":[{"_id":"67b8ce49a3244942fab4393e","storeId":"67b7410f256d7687d08935fd","name":"Floral Summer Dress","description":"Beautiful floral print summer dress, perfect for beach days and casual outings","price":59.99,"category":"FASHION","images":["https://example.com/dress1.jpg"],"stock":100,"specifications":{"material":"Cotton","size":"S,M,L","color":"Blue,White"},"status":"ACTIVE","isPublished":true,"guestOrderEnabled":true,"minOrderQuantity":1,"maxOrderQuantity":999,"variants":[],"createdAt":"2025-02-21T19:04:41.733Z","updatedAt":"2025-02-25T11:04:50.539Z","__v":0},{"shippingInfo":{"dimensions":{"length":30,"width":20,"height":5},"weight":0.5,"requiresSpecialHandling":false},"_id":"67b74d4bf9817c62508bee3a","storeId":"67b7410f256d7687d08935fd","name":"Summer Dress","description":"Beautiful summer dress perfect for any occasion","price":5999,"category":"Dresses","images":["https://example.com/dress1.jpg"],"stock":50,"status":"ACTIVE","isPublished":true,"guestOrderEnabled":true,"minOrderQuantity":1,"maxOrderQuantity":10,"variants":[],"createdAt":"2025-02-20T15:42:03.855Z","updatedAt":"2025-02-20T15:42:03.855Z","__v":0},{"_id":"67b74ce4f9817c62508bee36","storeId":"67b7410f256d7687d08935fd","name":"Summer Dress","description":"Beautiful summer dress perfect for any occasion","price":5999,"category":"Dresses","images":["https://example.com/dress1.jpg"],"stock":50,"status":"ACTIVE","isPublished":true,"guestOrderEnabled":true,"minOrderQuantity":1,"maxOrderQuantity":10,"variants":[],"createdAt":"2025-02-20T15:40:20.238Z","updatedAt":"2025-02-25T11:04:55.654Z","__v":0}],"total":3,"page":1,"totalPages":1}}{"success":true,"data":{"products":[],"total":0,"page":1,"totalPages":0}}{"success":true,"data":{"products":[{"_id":"67b8ce49a3244942fab4393e","storeId":"67b7410f256d7687d08935fd","name":"Floral Summer Dress","description":"Beautiful floral print summer dress, perfect for beach days and casual outings","price":59.99,"category":"FASHION","images":["https://example.com/dress1.jpg"],"stock":100,"specifications":{"material":"Cotton","size":"S,M,L","color":"Blue,White"},"status":"ACTIVE","isPublished":true,"guestOrderEnabled":true,"minOrderQuantity":1,"maxOrderQuantity":999,"variants":[],"createdAt":"2025-02-21T19:04:41.733Z","updatedAt":"2025-02-25T11:04:50.539Z","__v":0},{"shippingInfo":{"dimensions":{"length":30,"width":20,"height":5},"weight":0.5,"requiresSpecialHandling":false},"_id":"67b74d4bf9817c62508bee3a","storeId":"67b7410f256d7687d08935fd","name":"Summer Dress","description":"Beautiful summer dress perfect for any occasion","price":5999,"category":"Dresses","images":["https://example.com/dress1.jpg"],"stock":50,"status":"ACTIVE","isPublished":true,"guestOrderEnabled":true,"minOrderQuantity":1,"maxOrderQuantity":10,"variants":[],"createdAt":"2025-02-20T15:42:03.855Z","updatedAt":"2025-02-20T15:42:03.855Z","__v":0},{"_id":"67b74ce4f9817c62508bee36","storeId":"67b7410f256d7687d08935fd","name":"Summer Dress","description":"Beautiful summer dress perfect for any occasion","price":5999,"category":"Dresses","images":["https://example.com/dress1.jpg"],"stock":50,"status":"ACTIVE","isPublished":true,"guestOrderEnabled":true,"minOrderQuantity":1,"maxOrderQuantity":10,"variants":[],"createdAt":"2025-02-20T15:40:20.238Z","updatedAt":"2025-02-25T11:04:55.654Z","__v":0}],"total":3,"page":1,"totalPages":1}}a@a:~/logistics-backend$ 


















a@a:~/Downloads/logistics-backend$ curl -X POST https://logistics-backend-1-s91j.onrender.com/api/stores/upload-image \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I1YjVhZjdkYmIzZGI3ZTQ1N2Q3ZDgiLCJlbWFpbCI6Implc3NpY2FhbmF2aGVvYmFAZ21haWwuY29tIiwiaWF0IjoxNzQ0NjE4NjE3LCJleHAiOjE3NDQ3MDUwMTd9.QVfZGIAI54mHObrAo5d8OrCZkj_mKTpHvbo7Ublw-UA" \
  -F "image=@/home/a/Pictures/Screenshots/Screenshot from 2025-04-11 07-47-51.png"
{"success":true,"data":{"image":{"url":"https://res.cloudinary.com/duk2hhkns/image/upload/v1744634548/stores/gjhgalyskmpebnekeeyp.png","publicId":"stores/gjhgalyskmpebnekeeyp"}}}a@a:~/Downloads/logistics-backend$ 
















a@a:~/Downloads/logistics-backend$ curl -X GET https://logistics-backend-1-s91j.onrender.com/api/stores/my-store \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I1YjVhZjdkYmIzZGI3ZTQ1N2Q3ZDgiLCJlbWFpbCI6Implc3NpY2FhbmF2aGVvYmFAZ21haWwuY29tIiwiaWF0IjoxNzQ0NjE4NjE3LCJleHAiOjE3NDQ3MDUwMTd9.QVfZGIAI54mHObrAo5d8OrCZkj_mKTpHvbo7Ublw-UA"
{"success":true,"data":{"contactInfo":{"email":"jessicaanavheoba@gmail.com","phone":"+2341234567890","whatsapp":"+2341234567890"},"address":{"street":"15 Victoria Island Road","city":"Lagos","state":"Lagos State","country":"Nigeria","postalCode":"101001"},"image":{"url":"https://res.cloudinary.com/duk2hhkns/image/upload/v1744634548/stores/gjhgalyskmpebnekeeyp.png","publicId":"stores/gjhgalyskmpebnekeeyp"},"socialLinks":{"instagram":"https://instagram.com/jessicafashionhub","facebook":"https://facebook.com/jessicafashionhub"},"businessInfo":{"registrationNumber":"RC123456"},"settings":{"isVerified":false,"isFeaturedStore":false,"allowRatings":true},"metrics":{"totalOrders":0,"totalRevenue":0,"totalProducts":4},"_id":"67b7410f256d7687d08935fd","userId":"67b5b5af7dbb3db7e457d7d8","storeName":"Jessica Fashion Hub","description":"Updated description - Your premier fashion destination in Lagos","category":"FASHION","status":"ACTIVE","createdAt":"2025-02-20T14:49:51.447Z","updatedAt":"2025-04-14T12:42:29.325Z","slug":"jessica-fashion-hub","__v":0,"storeUrl":"http://localhost:5000/store/jessica-fashion-hub"}}a@a:~/Downloads/logistics-backend$ 