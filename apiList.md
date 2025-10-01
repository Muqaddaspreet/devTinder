# DevTinder APIs

### authRouter

- POST /signup
- POST /login
- POST /logout

### profileRouter

- GET /profile
- PATCH /profile/edit
- PATCH /profilepassword

### connectionRequestRouter

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

### userRouter

- GET /user/connections
- GET /user/requests
- GET /user/feed - Gets you the profiles of other users on the platform

status: ignore, interested, accepted, rejected
