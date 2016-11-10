(function () {

    function todoProvider($http) {

        this._server_host = "";

        this.getAllTodos = function (callback) {
            $http.get(this._server_host + "/v1/todoList.json")
                .success(function (data, status, headers, conf) {
                    callback(null, data);
                })
                .error(function (data, status, headers, conf) {
                    callback(data);
                });
        };


        this.addTodo = function (todo_data, callback) {
            $http.put(this._server_host + "/v1/todoList.json", todo_data)
                .success(function(data, status, headers, conf) {
                    callback(null,data);
                })
                //in this case of error, the data is the error...
                .error(function(data, status, headers, conf) {
                    callback(data);
                })


        };

        this.getTodoById = function (todo_id, callback) {
            console.log("Made it to getTodoById");
            console.log("Todo id is: " + todo_id);
            $http.get(this._server_host + "/v1/todoList/" + todo_id + ".json")
                .success(function (data, status, headers, conf) {
                    callback(null, data);
                })
                .error(function (data, status, headers, conf) {
                    callback(data);
                });
        };
        /*
        this.getUniqueRecipeId = function(todo_data) {
            if (!todo_data.name) {
                return undefined;
            }
            
            var proposed_id = todo_data.id.split(" ").join("_")
                + "" + (new Date().getTime());
            var unique = false;
            while (!unique) {
                var i;
                for (i = 0; i < todoList.length; i++) {
                    if (todoList[i].id == proposed_id) {
                        break;
                    }
                }

                if (i == todoList.length) {
                    unique = true;
                } else {
                    proposed_id = proposed_id + "" + (new Date().getTime());
                }
            }

            return proposed_id;
        };
        */

    }

    todoApp.service("todoProvider", todoProvider);
}) ();
