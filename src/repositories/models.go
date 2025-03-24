package repositories

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type User struct {
	ID       bson.ObjectID `bson:"_id,omitempty"`
	Email    string        `bson:"email"`
	Password string        `bson:"password"`
}

func FindUser(filter bson.M) (User, error) {
	collection := Client.Database("auth-microservice").Collection("users")

	var user User

	err := collection.FindOne(context.Background(), filter).Decode(&user)

	if err != nil {
		fmt.Println("Error finding user:", err)
		return user, err
	}

	return user, nil
}
