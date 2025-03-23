package routes

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(c *gin.Context) {
	var requestBody LoginRequest

	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(400, gin.H{"error": "Invalid parameters"})
		return
	}

	fmt.Println(requestBody.Email, requestBody.Password)
}
