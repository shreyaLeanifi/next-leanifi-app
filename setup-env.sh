#!/bin/bash

# Create .env.local file with required environment variables
cat > .env.local << EOF
MONGODB_URI=mongodb+srv://sully_db_user:9NwIWAGTUxpeO2GZ@leanify.bbaudrh.mongodb.net/?retryWrites=true&w=majority&appName=leanify
JWT_SECRET=leanifi-super-secret-jwt-key-2024
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=leanifi-nextauth-secret-2024
EOF

echo "Environment variables created in .env.local"
echo "You can now run: npm run dev"
