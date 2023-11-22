<p align="right">(<a href="../../README.md">go back</a>)</p>

# Playlist Information

This API route returns information about the most up-to-date e2 build.

**URL** : `/api/playlist/`

**Method** : `GET`

**Auth required** : YES

**Query parameters**

- `auth` (string): Authentication key for the user.
- `playlistId` (string): The ID of the YouTube playlist.

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "videoID": "[YouTube video ID]",
        "title": "[Video Title]",
        "artist": "[Artist Name]",
        "duration": "[Video Duration in Seconds]",
        "thumbnail": "[Thumbnail URL]",
        "streamLink": "[Stream Link]"
      }
      // Additional items...
    ]
  }
}
```

## Error Responses

### Unauthorized Access

**Condition:** If authentication fails.

**Code:** 401 Unauthorized

**Content:**

```json
{
  "error": "Unauthorized: auth is required"
}
```

**Condition:** If the key is invalid or the user is not active.

**Code:** 401 Unauthorized

**Content:**

```json
{
  "error": "Unauthorized: key invalid or not active"
}
```

### Bad Request

**Condition:** If the request method is not GET, or if playlistId is missing or not a single value.

**Code:** 400 Bad Request

**Content:**

```json
{
  "success": false,
  "error": "Method Not Allowed" (or) "playlistId is required"
}
```

**Condition:** If no results are found for the provided playlistId.

**Code:** 400 Bad Request

**Content:**

```json
{
  "success": false,
  "error": "No results found"
}
```

### Internal Server Error

**Condition:** If there is an internal server error.

**Code:** 500 Internal Server Error

**Content:**

```json
{
  "success": false,
  "error": "Internal Server Error"
}
```
