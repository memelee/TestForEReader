var MainCtrl = function($scope) {
	$scope.isShowMask = false;
	$scope.isShowSignin = false;

	$scope.$on("showSignin", function(event) {
		$scope.isShowMask = true;
		$scope.isShowSignin = true;
	});
	$scope.$on("hideSignin", function(event) {
		$scope.isShowSignin = false;
		$scope.isShowMask = false;
	});
};

var HomeCtrl = function($scope) {
	$scope.showSignin = function() {
		$scope.$emit("showSignin");
	};
};

var SigninCtrl = function($scope) {
	$scope.hideSignin = function() {
		$scope.$emit("hideSignin");
	};
};