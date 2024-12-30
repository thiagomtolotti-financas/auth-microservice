import express from "express";
import login from "./routes/login";
import refresh_token from "./routes/refresh_token";
import create_user from "./routes/create_user";
import forgot_password_email from "./routes/forgot_password_email";
import password from "./routes/password";
import change_password from "./routes/change_password";
import mongoose from "mongoose";
import dotenv from "dotenv";
import sendgrid from "@sendgrid/mail";
import validate_token from "./routes/validate-token";

const port = 3000;
const app = express();

app.use(express.json());

dotenv.config();

// Initializes the database
mongoose.connect(process.env.DATABASE_URL!);
const db = mongoose.connection;

db.on("error", (err) => {
  console.error(`Error connecting to database`, err);
});

sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

// Endpoints
/*
	- Heartbeat

	- Login (email, password) -> token
	- Refresh token (old_token) -> token // With auth header
	- Validate token () -> user_id // With auth header

	- Send Email to create password (email) -> code
	- Send Forgot Password Email (email) -> code

	- Set/Reset password (code, password)
	- Change password (new_password) // With auth header

*/

app.get("/", (req, res) => {
  res.send("Authentication microservice is online");
});

app.post("/login", login);
app.post("/refresh_token", refresh_token);
app.get("/validate-token", validate_token);

app.post("/create_user", create_user);
app.post("/forgot_password_email", forgot_password_email);

app.post("/password", password);
app.post("/change_password", change_password);

app.listen(port, () => {
  console.clear();
  console.log(`Server listening on port ${port}`);
});
