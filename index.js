// Import necessary modules
const express = require("express");
const fs = require("fs").promises;
const path = require('path');
const productList = require("./sampleData");

// Define the path for the log file
const filePath = path.join(__dirname, "access.json");

// Create an Express application
const app = express();

// Define a function to write log entries to a file
const writeFiles = async (logObject) => {
    try {
        try {
            // Check if the file exists
            await fs.access(filePath);

            // File exists, read its content
            const fileContent = await fs.readFile(filePath, "utf8");

            // Parse JSON data from the file
            const logArray = JSON.parse(fileContent);

            // Write the task accordingly
            await fs.writeFile(filePath, JSON.stringify([...logArray, logObject]));
        } catch (notFoundError) {
            // File does not exist, create it and write the task
            await fs.writeFile(filePath, JSON.stringify([logObject]));
        }
    } catch (error) {
        // Handle any errors that occur during file operations
        console.error(`Error adding task: ${error.message}`);
    }
};

// Middleware to log information about each incoming request
app.use((req, res, next) => {
    const url = req.url,
        method = req.method,
        ip = req.ip;

    // Call the function to write log entries
    writeFiles({"Request_URL": url, "Method": method, "Time": new Date().toString(), "IP": ip});
    
    // Allow the request to proceed to the next middleware or route handler
    next();
});

// Define a route to get a list of products
app.get("/products", (req, res) => {
    console.log(req.url);
    res.json({
        success: true,
        results: productList
    });
});

// Define another route to get all products
app.get("/products/all", (req, res) => {
    console.log(req.url);
    res.json(productList);
});

// Middleware to handle incorrect routes
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Incorrect routes"
    });
});

// Start the server and listen on port 5000
app.listen(5000, () => {
    console.log("Server is running on port: 5000");
});
