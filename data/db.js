var MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectId,
    async = require('async'),
    assert = require('assert');


var url = "mongodb://localhost:27017/todoListApp";

var _db;

//connects and collects the collection named todoList
exports.init_db = function (callback) {
	MongoClient.connect(url, function(err,db) {
		assert.equal(null, err);
		console.log("Connected correctly to MongoDB server.");
		_db = db;

		exports.todoList = _db.collection("todoList");
		callback(null);
	});
}

// Anybody can just grab this and start making queries on it if they want.
//hang collection off export
//
exports.todoList = null;