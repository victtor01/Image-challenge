# Image Manipulation REST API

Develop a simple REST API capable of receiving an image encoded in base64, decoding this image to its original format, applying a watermark, and returning the resulting image.

## Programming Challenge
Create a REST API using ASP.NET Core that meets the following requirements:

- Receive an image encoded in base64.
- Decode the image to its original format.
- Apply a watermark to the image.
- Return the resulting image.

## Technologies Used
C# / ASP.NET Core
Swagger

## Prerequisites
.NET SDK

## Run the Application
```bash 
> dotnet run
```

## API Endpoints
`POST /images`
Endpoint to send an image encoded in base64 to the API.

Request Parameters
- imageBase64: String (required) - Image encoded in base64.