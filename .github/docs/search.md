<p align="right">(<a href="../../README.md">go back</a>)</p>

# Search Videos

This API route returns information about videos based on the search query.

**URL** : `/api/search/`

**Method** : `GET`

**Auth required** : YES

**Query parameters**

- `auth` (string): Authentication key for the user.
- `query` (string): Search query for videos.
- `limit` (string): Limit the number of results (optional, default is 1).

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "videoID": "abc123",
        "title": "Example Video",
        "artist": "John Doe",
        "duration": 240, // duration in seconds
        "thumbnail": "https://example.com/thumbnail.jpg",
        "streamLink": "https://example.com/api/stream/?auth=yourAuthToken&videoId=abc123"
      }
      // Additional video items...
    ]
  }
}
```

## Error Responses

**Condition:** If authentication fails, required parameters are missing, or no results are found.

**Code:** 401 Unauthorized, 400 Bad Request

```json
{
  "error": "Unauthorized: auth is required"
}
```

```json
{
  "error": "query is required"
}
```

```json
{
  "error": "Unauthorized: key invalid or not active"
}
```

```json
{
  "error": "Method Not Allowed"
}
```

```json
{
  "error": "No results found"
}
```
