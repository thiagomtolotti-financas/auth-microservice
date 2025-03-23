package main

import (
	"auth-microservice/routes"
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

const PORT = "3000"

func main() {
	loadEnv()
	port := getPort()

	router := gin.Default()

	routes.RegisterRoutes(router)

	fmt.Println("Server is running on port", port)
	router.Run(":" + port)
}

func loadEnv() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
		fmt.Println(err)

		os.Exit(1)
	}
}

func getPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		port = PORT
	}

	return port
}
