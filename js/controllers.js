var MainCtrl = function($scope) {
	$scope.isShowMask = false;
	$scope.$on("showSigninEmit", function(event) {
		$scope.isShowMask = true;
		$scope.$broadcast("showSigninCast");
	});
};

var HomeCtrl = function($scope) {
	$scope.showSignin = function() {
		$scope.$emit("showSigninEmit");
	};
};

var SigninCtrl = function($scope) {
	$scope.isShowSignin = false;
	$scope.$on("showSigninCast", function(event) {
		$scope.isShowSignin = true;
	});
};