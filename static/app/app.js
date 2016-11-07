//dependency injection!!!
var todoApp = angular.module("todoApp", [ "ngRoute"]);

//route provider comes with ngRoute
todoApp.config(function($routeProvider) {
	$routeProvider
			//note controller isnt a path, it is a name defined by function and is already included since bottom of html via js obj
		.when("/todos", {
			controller: "todoListController",
			templateUrl: "app/partials/todo_list.html" })
		.when("/todos/:todo_id", {
			controller: "todoController",
			templateUrl: "app/partials/view_todo.html"})
		.when("/", {redirectTo: "/todos"})
		.otherwise({redirectTo: "/404_page"});

});

