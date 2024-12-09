# Authentication - Microservice

This is a microservice designed to handle authentication (initially in my finances project), it should contain all the business logic and provide an API for user authentication.

## Technologies

| **Technology** | **Use case**                                  |
|----------------|-----------------------------------------------|
| Typescript     | Language in which the microservice is written |
| Express        | Framework for creating the API                |
| Mongoose       | ODM library for creating schemas for the DB   |
| MongoDB        | Database                                      |
| Jest           | Unit testing                                  |

## Endpoints

| **Endpoint**             | **Method** | **Description**                                              |
|--------------------------|------------|--------------------------------------------------------------|
| "/"                      | GET        | Heartbeat to check if the service is on.                     |
| "/login"                 | POST       | Logs in a user and return an access and a refresh token.     |
| "/refresh_token"         | POST       | Refreshes the user access token providing its refresh token. |
| "/create_user"           | POST       | Creates a user and sends an email to register it's password. |
| "/forgot_password_email" | POST       | Sends the user an email for recovering the password.         |
| "/password"              | POST       | Sets or resets the user password.                            |
| "/change_password"       | POST       | Resets the user password providing its access_token.         |

## How to Install and Run the Project

1. Clone the repository
2. Install dependencies
   * Run 'npm install' in the project folder to install it's dependencies.
4. Set environment variables
   * Create a '.env' file in your local environment and set the variables according to the '.env.example' file in the project root.
6. Run the project in development mode
   * Run 'npm run dev' in the project folder to run in development mode. Here you can make any changes that seem suitable.
8. Build the project for production
   * Run 'npm run build' for building the project, the end result should appear on a 'dist' folder in the projects root.
10. Run the built project
    * Finally run 'npm run start' to test the project in a production environment.

## License

This project is licensed under the MIT License.

## Credits

This project was created and is maintained by Thiago M. Tolotti.


GitHub: [github.com/thiagomtolotti](https://www.github.com/thiagomtolotti.com)

LinkedIn: [linkedin.com/in/thiago-tolotti](https://www.linkedin.com/in/thiago-tolotti/)

Feel free to contribute or provide feedback to improve this project.
