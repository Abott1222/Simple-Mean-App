(function () {

    function todoController($scope, $routeParams, todoProvider) {
        window.alert("routeParams is " + $routeParams.todo_id);

        $scope.finished_loading = false;
        $scope.page_load_error = null;

        todoProvider.getRecipeById($routeParams.todo_id, function (err, todo) {
            $scope.finished_loading = true;
            if (err) {
                $scope.page_load_error = "Unable to load recipe: " + JSON.stringify(err);
            } else {
                $scope.todo = todo;
            }
        });
    };

    todoApp.controller("todoController", ["$scope", "$routeParams", "todoProvider", todoController]);

}) ();
