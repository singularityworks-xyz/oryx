# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier is sufficient)
4. Create a database user with password
5. Get your connection string
6. Update your `.env.local` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/oryx-ecommerce?retryWrites=true&w=majority
```

## Option 2: Local MongoDB Installation

### Windows
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install MongoDB as a service
3. MongoDB will run on `mongodb://localhost:27017`

### macOS (using Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

### Linux (Ubuntu)
```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## Option 3: Docker (Alternative)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Testing the Connection

1. Make sure your `.env.local` file has the correct MongoDB URI
2. Run the seed script to test the connection:
   ```bash
   npm run seed
   ```
3. If successful, you should see "Connected to MongoDB successfully"

## Troubleshooting

- **Connection refused**: MongoDB is not running
- **Authentication failed**: Check username/password in connection string
- **Network timeout**: Check firewall settings or use MongoDB Atlas

## Next Steps

Once MongoDB is connected:
1. Run `npm run seed` to populate the database
2. Start the development server: `npm run dev`
3. Visit `http://localhost:3000` to see your application 