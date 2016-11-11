var todo_data = require("../data/todoList.js");

/**
 *  start, number, callback 
 *  start, number, ordervals, callback 
 *  filterfieldvals, start, number, ordervals, callback 
 */

//NOTE WE ARE JUST PASSING THIS TO BACKEND: data/db.js
 exports.get_todoList = function() {
 	todo_data.get_todoList.apply(this, arguments);
 };

 exports.add_todo = function(todo, callback) {
 	todo_data.add_todo(todo, callback);
 };

 exports.get_todo_by_id = function(todo_id, callback) {
 	todo_data.get_todo_by_id(todo_id, callback);
 };