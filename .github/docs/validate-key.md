<p align="right">(<a href="../../README.md">go back</a>)</p>

# validate-key

This API route validates a key and returns information about the associated user.

**URL** : `/api/validate-key/:key`

**Method** : `GET`

**Auth required** : NO

## Parameters

- `key` (string, required): The key to be validated.

**Success Response**

**Code** : `200 OK`

**Content example**

```json
{
  "success": true,
  "valid": true,
  "steamid": "76561198947030100"
}
```
