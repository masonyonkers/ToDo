# ToDo App

This guide will walk you through setting up the project, configuring MongoDB locally, and testing the connection. If you are not hosting MongoDB locally, skip to **8** after installing MongoDB on your machine.

---

## **1️. Setup MongoDB Locally**

### **Step 1: Install MongoDB**
- **Windows**: Download and install MongoDB Community Edition from [MongoDB Download Center](https://www.mongodb.com/try/download/community). (I have not used windows since 2017 so this part could use some expansion if there is more to it than this.)
- **Mac (Homebrew)**:
  ```sh
  brew tap mongodb/brew
  brew install mongodb-community
  ```
- **Linux (Ubuntu/Debian)**:
  ```sh
  sudo apt update
  sudo apt install -y mongodb
  ```
- **Linux (Arch)**:
  ```
  yay -S mongodb-bin
  ```

### **Step 2: Create the Database Directory**
MongoDB stores its data in `/data/db` by default. Create the directory if it does not exist:
```
sudo mkdir -p /data/db
```

### **Step 3: Start MongoDB**
To run MongoDB locally:
```
mongod --dbpath /data/db --auth
```
If MongoDB is running correctly, you should see a message saying `Waiting for connections` or it will just output log information to ``stdout``.

---

## **2️. Create an Admin User**

### **Step 1: Open the Mongo Shell**
```
mongosh
```
(If `mongosh` does not work, try `mongo` instead.)

### **Step 2: Switch to the Admin Database**
```sh
use admin
```

### **Step 3: Create an Admin User**
```sh
db.createUser({
  user: "adminUser",
  pwd: "adminPassword",
  roles: [{ role: "root", db: "admin" }]
})
```
Replace `adminPassword` with a strong password.

### **Step 4: Restart MongoDB with Authentication**
If MongoDB was running, stop it (`Ctrl+C`) and restart it:
```sh
mongod --auth --dbpath /data/db
```

---

## **3️. Create a Database User for the ToDo App**
### **Step 1: Login as Admin**
```sh
mongosh -u "adminUser" -p "adminPassword" --authenticationDatabase "admin"
```

### **Step 2: Switch to the ToDo Database**
```sh
use toDo
```

### **Step 3: Create a User for the App**
```sh
db.createUser({
  user: "yourName",
  pwd: "yourSecurePassword",
  roles: [{ role: "readWrite", db: "toDo" }]
})
```
Replace``'yourName'`` and ```yourSecurePassword``` with your name and a strong password.

---

## **4️. Setting Up the .env File**

### **Get the MongoDO URL**
  ```sh
  mongodb://yourName:yourSecurePassword@localhost:27017/ToDo?authSource=ToDo
  ```

### **Generate a JWT secret**
```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Create a `.env` file inside the `server/` directory and add the above like so:
```env
MONGO_URI=mongodb://yourName:yourSecurePassword@localhost:27017/ToDo?authSource=ToDo
JWT_SECRET=a7c99f0c9e6d46f9e0f2b4f5b5e21f98de4e69c7d0b6a3ef40b109c6a6de6a8e
PORT=5000
```
### **DO NOT COMMIT THIS INFORMATION**
Ensure that your .env file is in your .gitignore
```
.env
```

---

## **5️. Testing the Connection**
### **Test MongoDB Connection**
To verify that MongoDB is running and accessible:
```sh
mongosh -u "yourName" -p "yourSecurePassword" --authenticationDatabase "toDo"
```
If it connects successfully, run:
```sh
db.stats()
```

If it fails to connect, ensure you are using ``'yourName' and 'yourSecurePassword'`` instead of ``'adminUser' and 'adminPassword'``

### **Test the Server Connection**
Run the backend:
```sh
cd server
node server.js
```
Then, open a browser and go to:
```sh
http://localhost:5000/
```
Expected output:
```
API is running...
```

---

## **6️. Seeding Data**
### **Seed the Database**
```sh
node server/database/seed.js
```

---

## **7️. Running the App**
### **Start the Backend**
```sh
cd server
node server.js
```
### **Start the Frontend**
```sh
cd client
npm install
npm run dev
```

---

## **8. Connecting to Remote DB**
```
mongosh -u "username" -p "password" --authenticationDatabase "db_name" url/db_name
```

## **You're All Set!**
You have successfully:
- set up MongoDB.
- Created an admin user.
- Configured environment variables.
- Tested connecting to the db.

