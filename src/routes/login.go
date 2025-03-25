package routes

import (
	"auth-microservice/src/repositories"
	"auth-microservice/src/services"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(c *gin.Context) {
	// Ckecks if the request body is valid
	var requestBody LoginRequest
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.IndentedJSON(400, gin.H{"error": "Invalid parameters"})
		return
	}

	// Finds the user in the database
	user, err := repositories.FindUser(bson.M{"email": requestBody.Email})
	if err != nil {
		c.IndentedJSON(401, gin.H{"error": "User not found"})
		return
	}

	// Verifies if the try password is correct
	if !services.VerifyPassword(user.Password, requestBody.Password) {
		c.IndentedJSON(401, gin.H{"error": "Invalid password"})
		return
	}

	// Generates tokens
	access_token, refresh_token, err := services.GenerateTokens(user.ID)
	if err != nil {
		c.IndentedJSON(500, gin.H{"error": "Error generating tokens"})
		return
	}

	c.JSON(200, gin.H{
		"email":         user.Email,
		"access_token":  access_token,
		"refresh_token": refresh_token,
	})
}
