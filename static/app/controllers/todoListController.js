(function () {

    function todoListController($scope, todoProvider) {

        $scope.new_recipe = { };
        $scope.add_recipe_error = "";

        $scope.page_load_error = null;
        $scope.finished_loading = false;
        $scope.totalTodos = 0;

        //old non-async call
        //$scope.todoList = todoProvider.getAllTodos();

        $scope.todoList = todoProvider.getAllTodos(function(err, todos) {
            $scope.finished_loading = true;
            if(err) {
                $scope.page_load_error = err.message;
            } else {
                $scope.todoList = todos;
                //$scope.totalTodos = todos.length;
            }

        });

        /*
        Old non-sync add
         $scope.addTodo = function (new_todo_data) {
            $scope.todoList.push({id:new_todo_data.id, done:false});
            $scope.formTodoText = " ";

        };
        */



        $scope.addTodo = function (todo_data) {
            try {
                recipeProvider.addRecipe(todo_data);
            } catch (e) {
                $scope.add_recipe_error = e.message;
            }

            // be sure to update our list of recipes.
            $scope.todos = todoProvider.getAllTodos();
        };


        /*
        //Hmm how can I add the asnyc version?
        //only deletes on at a time, how to get total nubmer of checked boxes?
        $scope.clearCompleted = function() {
            angular.forEach($scope.todoList, function(value,index) {
                if(value.done== true) {
                    $scope.todoList.splice(index, 1);
                }
            });
        };
        */
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