var express = require("express"),
	//morgan is for logging
	morgan = require("morgan"),
    bodyParser = require("body-parser"),
    todo_handler = require("./handlers/todoList.js"),
	path = require('path'),
    db = require("./data/db.js")
	async = require("async");

var _port = 3000;

var app = express();


app.use(morgan('dev'));
app.use(bodyParser.json());
//dirname is folder
//go up one folder and fine static whenever some1 asks for static file
//app.use(express.static(path.join(__dirname, '/../static')));
//express.static(__dirname + "../static")

app.use(express.static(__dirname + "/../static"));
//app.get('/', function(req, res){
    //res.sendFile(__dirname + '/../static/index.html');
//});



/*This is the old method
app.get("/v1/todoList.json", function (req, res) {
    return send_success_resp(res, todoList);
});
*/
app.get("/v1/todoList.json", function (req, res) {
    // note query paramets like in:
    //part19.html?autoStart=True&start=49
    //you collect them off request object in req.query
    //these are to make sure I dont query entire db if too big
    var start = req.query.start ? parseInt(req.query.start) : 0;
    var pageSize = req.query.pageSize ? parseInt(req.query.pageSize) :  100;

    //note async
    //note we are using data handler(not provider) here
    todo_handler.get_todoList(start, pageSize, function(err, todoList) {
        if (err) {
            return send_error_resp(res, err);
        } else {
            return send_success_resp(res, todoList);
        }
    });
});

//note paramaterization of of roots(:todoid)
app.get("/v1/todoList/:todo_id.json", function (req, res) {
    console.log("do I ever get here?");
    //note paramaterization of of roots(:todoid)
    console.log(req.params.todo_id);

    todo_handler.get_todo_by_id(req.params.todo_id, function(err, todo) {
        if(err) {
            return send_error_resp(res,err);
        } else if(!todo) {
            return send_error_resp(res, 400, "no_such_todo",
                                   "That does not appear to be a valid todo.");
        } else {
            send_success_resp(res,todo);
        }

    });
});

//to add a todo is still v1/todoList.json(put)
//body is post body that comes along with put req
//  contains recipe you want to add
app.put("/v1/todoList.json", function (req, res) {
    todo_handler.add_todo(req.body, function(err, todo) {
        if (err) {
            return send_error_resp(res,err);
        } else {
            return send_success_resp(res,todo);
        }
    });
});


//so that you dont start before db is loaded which would be empty list...
db.init_db(function (err) {
    if (err) {
        console.log("Error initialising DB, aborting: " + JSON.stringify(err, 0, 2));
        exit(-1);
    } else {
        console.error("Starting Server.");
        app.listen(_port);
    }
});






/**
 * res, http_status, code, message
 * res, http_status, err obj
 * res, err obj
 */
function send_error_resp() {
    var res, http_status, code, message;
    if (arguments.length == 4) {
        res = arguments[0];
        http_status = arguments[1];
        code = arguments[2];
        message = arguments[3];
    } else if (arguments.length == 3) {
        res = arguments[0];
        http_status = arguments[1];
        code = arguments[2].error;
        message = arguments[2].message;
    } else if (arguments.length == 2) {
        res = arguments[0];
        http_status = _http_code_from_error(arguments[1].error);
        code = arguments[1].error;
        message = arguments[1].message;
    } else {
        console.error("send_error_resp: YOU'RE DOING IT WRONG");
        throw new Error("send_error_resp called wrong-est-ly");
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(http_status).send(JSON.stringify({ error: code, message: message }));
    res.end();
};

function send_success_resp(res, obj) {
    if (arguments.length != 2) {
        console.error("send_success_resp: YOU'RE DOING IT WRONG");
        throw new Error();
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(obj));
    res.end();
};


function _http_code_from_error (error_code) {
    switch (error_code) {
      // add other messages here when they're not server problems.
      default:
        return 503;
    }
};
