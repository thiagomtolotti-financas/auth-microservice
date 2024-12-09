import { UserNotFoundError } from "@/errors";
import handleError from "@/errors/handleError";
import { Response } from "express";

const mockedResponse = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
} as unknown as Response;

describe("handleError function", () => {
  it("Should return with status 400 and the error message if the error is known", () => {
    handleError(new UserNotFoundError(), mockedResponse);

    expect(mockedResponse.status).toHaveBeenCalledWith(400);
    expect(mockedResponse.send).toHaveBeenCalledWith(
      new UserNotFoundError().message
    );
  });

  it("Should log the error and return with status 500 if the error is unknown", () => {
    jest.spyOn(console, "error");

    handleError(new Error("Test Error"), mockedResponse);

    expect(console.error).toHaveBeenCalledWith(new Error("Test Error"));
    expect(mockedResponse.status).toHaveBeenCalledWith(500);
    expect(mockedResponse.send).toHaveBeenCalledWith("Internal Server Error");
  });
});
