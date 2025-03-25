package services

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/v2/bson"
)

func GenerateTokens(user_id bson.ObjectID) (string, string, error) {
	secret := os.Getenv("JWT_SECRET")

	// TODO: Run in parallel
	access_token, err1 := generateAccessToken(secret, user_id)
	refresh_token, err2 := generateRefreshToken(secret)

	if err1 != nil || err2 != nil {
		if err1 != nil {
			return "", "", err1
		}
		return "", "", err2
	}

	return access_token, refresh_token, nil
}

func generateAccessToken(secret string, user_id bson.ObjectID) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user_id.Hex(),
		"exp":     time.Now().Add(time.Hour * 12).Unix(),
	})
	access_token, err := token.SignedString([]byte(secret))

	if err != nil {
		fmt.Println("Error generating access_token:", err)
		return "", err
	}

	return access_token, nil
}

func generateRefreshToken(secret string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"exp": time.Now().Add(time.Hour * 12).Unix(),
	})

	refresh_token, err := token.SignedString([]byte(secret))

	if err != nil {
		fmt.Println("Error generating refresh_token:", err)
		return "", err
	}

	return refresh_token, nil
}
