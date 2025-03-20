POST /consumer/mark-payment/:orderId (Consumer endpoint to mark order payment)


// Request
// Headers:
{
  "Authorization": "Bearer <consumer_token>"
}

// URL Parameters:
{
  "orderId": "order123"
}

// Request Body:
{
  "paymentMethod": "BANK_TRANSFER", // or other payment methods
  "amount": 5000
}

// Response (200 OK)
{
  "success": true,
  "data": {
    "message": "Payment marked successfully",
    "order": {
      "_id": "order123",
      "trackingNumber": "ORD-123456",
      "paymentStatus": "PENDING",
      "paymentMethod": "BANK_TRANSFER",
      "paymentReference": "PAY-123456",
      "paymentAmount": 5000,
      "paymentDate": "2024-03-20T10:30:00Z",
      // ... other order details
    }
  }
}

// Error Responses
// 404 Not Found
{
  "success": false,
  "message": "Order not found or unauthorized"
}

// 500 Internal Server Error
{
  "success": false,
  "message": "Failed to mark payment"
}