# execute_academy API (rustdoc)

Base URL: `http://127.0.0.1:8080` (override with `API_HOST` and `API_PORT`).

This crate integrates developer-facing API docs via Rust's built-in documentation system.

## Building Docs

```bash
cargo doc --no-deps --open
```

See the rustdoc book for background: [What is rustdoc?](https://doc.rust-lang.org/rustdoc/what-is-rustdoc.html)

## API Categories

- [Auth](crate::api_docs::auth)
- [Users](crate::api_docs::users)
- [Courses](./courses.md)
- [Modules](./modules.md)
- [Lessons](./lessons.md)
- [Health](crate::api_docs::health)
- [Error Model](crate::api_docs::errors)

## Environment Variables

Set the following to enable video uploads to Vimeo:

- `VIMEO_TOKEN`: Vimeo API access token with scopes `video_files` and `private`.
- `VIMEO_PRIVACY_VIEW` (optional): default privacy for new uploads (e.g., `unlisted`, `anybody`, `nobody`).

Videos uploaded to Vimeo are not deleted when a course or lesson is deleted in this system.
