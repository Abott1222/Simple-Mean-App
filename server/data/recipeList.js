var db = require("./db.js"),
	async = require("async");

exports.get_todoList = function() {
    var start, number, callback, ordervals, filterfieldvals;

    switch (arguments.length) {
      case 3:
        start = arguments[0];
        number = arguments[1];
        callback = arguments[2];
        break;
      case 4:
        start = arguments[0];
        number = arguments[1];
        ordervals = arguments[2];
        callback = arguments[3];
        break;
      case 5:
        filterfieldvals = arguments[0];
        start = arguments[1];
        number = arguments[2];
        ordervals = arguments[3];
        callback = arguments[4];
        break;
      default:
        throw new Error("This is not a valid use");
    }

    var filter = filterfieldvals ? filterfieldvals : {};
    var output = [];
    var orderby = ordervals ? ordervals : { id : 1 };

    var cursor = db.todoList.find(filter)
    	.sort(orderby)
    	.skip(start)
    	.limit(number);

    cursor.on("data", function(todo) {
    	output.push(todo);
    });

    cursor.once("end", function() {
    	callback(null, output);
    });

};

exports.add_todo = function (todo_data, callback) {

    try {
        if (!todo_data.id) throw new Error("missing_name");
    } catch (e) {
        callback({ error: e.message, message: "This is not a valid todo."});
    }

    async.waterfall([
    	function (cb) {
            get_unique_todo_id(todo_data, cb);
        },
        // pass it on to the database.
        function (tooo_id, cb) {
    		console.log("did i get a todoid?" + todo_data.id);
            todo_data = JSON.parse(JSON.stringify(todo_data));
 			todo_data.todo_id = todo_id;
            db.todoList.insertOne(todo_data, { w: 1 }, cb);            
        }
    ], function(err,results) {
    	callback(err, results);
    });
};


exports.get_todo_by_id = function (todo_id, callback) {
    var found_recipe = null;
    
    //we are searching bu id though...
    var cursor = db.todoList.find({ todo_id: todo_id }).limit(1);
    cursor.on("data", function (todo) {
        found_todo = todo;
    });
    cursor.on("end", function () {
        console.log(JSON.stringify(found_todo, null, 3));
        callback(null, found_todo);
    });


    function get_unique_todo_id (todo_data, callback) {
    if (!todo_data.id) {
        return undefined;
    }

    var ok = false;

    var proposed_id = todo_data.id.split(" ").join("_");

    async.doUntil(
        function (cb) {
            proposed_id += "" + (new Date().getTime());

            // only set this to true if we see a recipe!
            ok = true;
            var cursor = db.todoList.find({ todo_id: proposed_id }).limit(1);
            cursor.on("data", function (todo) {
                console.log("I got a todo....");
                if (todo) {
                    ok = false;
                }
            });
            cursor.once("end", function () {
                console.log("Im done.....");
                cb(null);
            });
        },
        function () {
            console.log("QUeried about OK: " + ok);
            return ok;
        },
        function (err, results) {
            callback(err, proposed_id);
        });
    
};



