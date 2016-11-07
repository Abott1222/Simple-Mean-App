var express = require("express"),
	//morgan is for logging
	morgan = require("morgan"),
	path = require('path'),
	async = require("async");

var _port = 3000;

var app = express();


app.use(morgan('dev'));
//dirname is folder
//go up one folder and fine static whenever some1 asks for static file
//app.use(express.static(path.join(__dirname, '/../static')));
//express.static(__dirname + "../static")

app.use(express.static(__dirname + "/../static"));
//app.get('/', function(req, res){
    //res.sendFile(__dirname + '/../static/index.html');
//});





var todoList = [
            {id: "Get better at programming", done: false, category: "programming"},
            {id: "Get better at programming 2", done: false, category: "adv. programming"}
];

app.get("/v1/todoList.json", function (req, res) {
    return send_success_resp(res, todoList);
});

app.get("/v1/todoList/:todo_id.json", function (req, res) {
    console.log("WUT");
    for (var i = 0; i < todoList.length; i++) {
        if (todoList[i].d == req.params.recipe_id) {
            return send_success_resp(res, todoList[i]);
        }
    }

    // If we're still here, we failed to find it.
    return send_error_resp(res, 404, "no_such_todo",
                           "Couldn't find a todo with the given todo_id.");
});

app.put("/v1/todoList.json", function (req, res) {
});

console.error("starting server...");
app.listen(_port);

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
}

function send_success_resp(res, obj) {
    if (arguments.length != 2) {
        console.error("send_success_resp: YOU'RE DOING IT WRONG");
        throw new Error();
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(obj));
    res.end();
}


function _http_code_from_error (error_code) {
    switch (error_code) {
      // add other messages here when they're not server problems.
      default:
        return 503;
    }
}
