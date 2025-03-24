package services

import (
	"golang.org/x/crypto/bcrypt"
)

func VerifyPassword(hashedPass, tryPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPass), []byte(tryPassword))

	return err == nil
}
