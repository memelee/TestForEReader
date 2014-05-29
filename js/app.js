var eReader = angular.module("eReader", ["ngAnimate", "ngTouch"]);

eReader.directive('HomeCtrl', ['$swipe', function($swipe){
	return {
		restrict: "EA",
		link: function($scope, ele, attrs, ctrl) {
			var startX, pointX;
			$swipe.bind(ele, {
				"start": function(coords) {
					startX = coords.x;
					pointX = coords.x;
				},
				"move": function(coords) {
					var dt = coords.x - pointX;
					pointX = coords.x;
					alert(dt);
				}
			});
			
		}
	};
}]);