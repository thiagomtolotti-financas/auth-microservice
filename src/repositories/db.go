package repositories

import (
	"context"
	"fmt"
	"os"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var Client *mongo.Client

func ConnectToDB() {
	uri := os.Getenv("DATABASE_URL")

	client, err := mongo.Connect(options.Client().ApplyURI(uri))

	if err != nil {
		panic(fmt.Sprintf("Error while connecting to database: %v", err))
	}

	err = client.Ping(context.Background(), nil)
	if err != nil {
		panic(fmt.Sprintf("Error while connecting to database: %v", err))
	}

	Client = client
	fmt.Println("Connected to Database successfully!")
}
