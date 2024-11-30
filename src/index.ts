import express from "express";
import login from "./routes/login";

const port = 3000;
const app = express();

app.use(express.json());

// Endpoints
/*
	- Heartbeat

	- Login (email, password) -> token
	- Refresh token (old_token) -> token // With auth header

	- Send Email to create password (email) -> code

	- Send Forgot Password Email (email) -> code

	- Set/Reset password (code, password)
	- Change password (new_password) // With auth header
*/

app.get("/", (req, res) => {
  res.send("Microservice is online");
});

app.post("/login", login);
app.post("/refresh_token");

app.post("/create_password_email");
app.post("/forgot_password_email");

app.post("/password");
app.post("/change_password");

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});