# MERN AUTH

Basic authentication system with Access Token + Refresh Token

## Configuration

> .env

```
MONGO_URI=mongodb+srv://<username>:<password>@<db_url>/<db>
SECRET_ACCESS=<SECRET_RANDOM_STR>
SECRET_REFRESH=<SECRET_RANDOM_STR>
PORT=<SERVER_PORT_NUMBER>
CLIENT_PORT=<CLIENT_PORT_NUMBER>
ACCESS_EXPIRES=15m
REFRESH_EXPIRES=30d
```