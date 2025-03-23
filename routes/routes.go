package routes

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	api := router.Group("/")

	api.GET("/", Ping)
	api.POST("/login", Login)
}
