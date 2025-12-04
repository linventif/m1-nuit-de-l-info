# API Documentation

## Base URL
`http://localhost:3001`

## Endpoints

### Health Check
- **GET** `/health`
  - Returns API and database health status

### Users

#### Get All Users
- **GET** `/api/users`
  - Returns array of all users
  
**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get User by ID
- **GET** `/api/users/:id`
  - Returns a single user

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Create User
- **POST** `/api/users`
  
**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "user"
}
```

**Response:** `201 Created`

#### Update User
- **PUT** `/api/users/:id`
  
**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "role": "admin"
}
```

**Response:** `200 OK`

#### Delete User
- **DELETE** `/api/users/:id`
  
**Response:** `204 No Content`

## Error Responses

All endpoints may return the following error responses:

- `400 Bad Request` - Invalid input
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

**Error Format:**
```json
{
  "error": "Error message description"
}
```
