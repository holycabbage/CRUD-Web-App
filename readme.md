Ways to test the function in MongoDB:

1. Start MongoDB
   code: brew services start mongodb/brew/mongodb-community

2. Start the server
    code: node server.js

3. Open another terminal and run the test

    (1) To save a record:
    code: curl -X POST -H "Content-Type: application/json" -d '{"name": "item1", "price": 100, "desc": "description", "color": "red", "url": "http://example.com", "isMarked": false}' http://localhost:3000/saveToDB

    (2) To get all records:
    code: curl -X GET http://localhost:3000/loadFromDB
