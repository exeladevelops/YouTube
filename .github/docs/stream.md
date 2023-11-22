<p align="right">(<a href="../../README.md">go back</a>)</p>

# Get Video Information and Stream

This API route returns information about a video and provides a streaming link for the audio.

**URL** : `/api/video/`

**Method** : `GET`

**Auth required** : YES

**Query Parameters**

- `auth`: Authentication token for the registered user.
- `videoId`: ID of the video for which information and stream are requested.
- `extended` (optional): If set to `true`, returns detailed JSON information about the video.

**Headers**

- `Content-Type: audio/mpeg`
- `Content-Disposition: inline; filename="[videoId].mp3"`

## Success Response

**Code** : `200 OK`

_Audio stream as mp3_

## Error Responses

**Authentication Failure**

**Code** : `401 Unauthorized`

**Content** :

```json
{
  "success": false,
  "error": "Unauthorized: auth is required or invalid"
}
```

**Bad Request**

**Code** : `400 Bad Request`

**Content** :

```json
{
  "success": false,
  "error": "[Error message]"
}
```

## Extended Information

To retrieve detailed JSON information about the video, add `?extended=true` to the request.

**URL** : `/api/video/?auth=[auth]&videoId=[videoId]&extended=true`

**Method** : `GET`

**Auth required** : YES

**Query Parameters**

- `auth`: Authentication token for the registered user.
- `videoId`: ID of the video for which extended information is requested.
- `extended`: Set to `true` to enable extended information.

**Success Response**

**Code** : `200 OK`

**Content example**

```json
{
  "success": true,
  "data": {
    "title": "Video Title",
    "artist": "Video Author",
    "duration": 300, // duration in seconds
    "thumbnail": "https://example.com/thumbnail.jpg",
    "streamLink": "https://example.com/api/stream/?auth=[auth]&videoId=[videoId]"
  }
}
```
