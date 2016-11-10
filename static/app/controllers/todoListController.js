(function () {

    function todoListController($scope, todoProvider) {

        $scope.new_recipe = { };
        $scope.add_recipe_error = "";

        $scope.page_load_error = null;
        $scope.finished_loading = false;
        $scope.totalTodos = 0;

        //old non-async call
        //$scope.todoList = todoProvider.getAllTodos();
        function get_Todos() {
            $scope.todoList = todoProvider.getAllTodos(function(err, todos) {
                $scope.finished_loading = true;
                if(err) {
                    $scope.page_load_error = err.message;
                } else {
                    $scope.todoList = todos;
                    //$scope.totalTodos = todos.length;
                }

            });
        }

        /*
        Old non-sync add
         $scope.addTodo = function (new_todo_data) {
            $scope.todoList.push({id:new_todo_data.id, done:false});
            $scope.formTodoText = " ";

        };
        */



        $scope.addTodo = function (todo_data) {
            todoProvider.addTodo(todo_data, function(err, recipe) {
                if(err) {
                    $scope.add_recipe_error = "(" + err.error + ")" + err.message;
                } else {
                    $scope.add_recipe_error = null;
                    get_Todos();
                }


            });
        };


        get_Todos();
    };

        todoApp.controller("todoListController", ["$scope", "todoProvider", todoListController]);

}) ();

/*
todoApp.controller("todoListController", ["$scope", function($scope) {
    $scope.todoList = [
        {id: "Get better at programming", done: false},
        {id: "Get better at programming 2", done: false}
    ];

    $scope.getTotalTodos = function() {
        return $scope.todoList.length;
    };

     $scope.addTodo = function (new_todo_data) {
        $scope.todoList.push({id:new_todo_data.id, done:false});
        $scope.formTodoText = " ";

    };

    $scope.temp = {}

    $scope.returnTodos = function() {
        return $scope.todoList.length;
    };

    //if you delete this function it works...

    $scope.clearCompleted = function() {
        angular.forEach($scope.todoList, function(value,index) {
            if(value.done== true) {
                $scope.todoList.splice(index, 1);
            }
        });
    };



}]);

*/