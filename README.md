##### Personal Note: This repository is a fork of the origninal project developed during my time at Monash Univeristy. My contributions were made under my student GitHub account yche0323 (https://github.com/yche0323).

# Cardio Vision AI

Cardio Vision AI is a web application that utilizes a deep learning model for cardiovascular disease predictions.

## Backend

### Setup

1. Navigate to the backend directory:
    ```bash
    cd cardio-vision-ai/backend
    ```

2. Install the necessary dependencies:
    ```bash
    npm install
    
    *move tensorflow.dll from node_modules\@tensorflow\tfjs-node\lib\napi-v9 to napi-v8
    ```

3. Create a `.env` file with the following layout:
    ```plaintext
    MONGO_URI="your_mongo_atlas_uri"
    JWT_SECRET="your_jwt_secret_key"
    MODEL_PATH="path_to_your_trained_model"
    ```

### Running the Backend

To start the backend server, run:
```bash
npm start
```

## Frontend

### Setup

1. Navigate to the frontend directory:
    ```bash
    cd cardio-vision-ai/frontend
    ```

2. Install the necessary dependencies:
    ```bash
    npm install
    ```

### Running the Frontend

To start the frontend development server, run:
```bash
npm start
```

This will launch the web application in your default browser.

