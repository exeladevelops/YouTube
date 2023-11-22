# exeladevelops/YouTube 🎧

This project is a FFmpeg based tool for Wire Mod's expression2 stream.

# Expression 2 (E2)

You can download the E2 [here (.github/e2.txt)](/.github/e2.txt)

# Documentation

Where full URLs are provided in responses they will be rendered as if service
is running on 'https://youtube.exeladevelops.com/'.

## Open Endpoints

Open endpoints require no Authentication.

- [E2](/.github/docs/e2.md) : `GET /api/e2/`
- [Validate Key](/.github/docs/validate-key.md) : `GET /api/validate-key/:key/`

## Endpoints that require Authentication

Closed endpoints require a valid Key to be included in the query of the
A Key can be acquired from the Login view.

### Stream related

Endpoints for streaming or searching music on YouTube.

- [Stream](/.github/docs/stream.md) : `GET /api/stream/?auth=:string&videoId=:string`
- [Search](/.github/docs/search.md) : `GET /api/search/?auth=:string&query=:string&limit=:number`
- [Playlist](.github/docs/playlist.md) : `GET /api/playlist/?auth=:string&playlistId=:string`

# Roadmap

- [ ] Save Videos
- [ ] Create Playlists
