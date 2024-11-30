import express from "express";

const port = 3000;
const app = express();

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

app.post("/login");
app.post("/refresh_token");

app.post("/create_password_email");
app.post("/forgot_password_email");

app.post("/password");
app.post("/change_password");

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
