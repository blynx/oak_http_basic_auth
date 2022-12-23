# Simple Basic Auth Middleware for Oak

Just a simple basic auth middleware package for Deno.

⚠️ Not published on Deno.land. Use on your own risk, I might move or delete this repo.

## Usage

```
import basicAuth from "https://raw.githubusercontent.com/blynx/oak_http_basic_auth/0.1.0/mod.ts"

app.use(basicAuth({
  alex: "letmein"
}))
```
