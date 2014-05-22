var MainCtrl = function($scope, $http) {
	$scope.serverAddress = "http://ereaderweb.williamoneil.com";

	$scope.isShowMask = false;
	$scope.isShowSignin = false;
	$scope.isShowSetting = false;

	$http({
		method: "GET",
		url: "js/json/booklist.json"
	})
	.success(function(data, status, headers, config) {
		var bookData = data["response"]["bkdata"];
		$scope.$broadcast("bindBookList", bookData);
	})
	.error(function(data, status, headers, config) {
		alert("load book error");
	});

	$scope.$on("showProduct", function(event, c, i) {
		$scope.isShowMask = true;
		$scope.isShowProduct = true;
	});
	$scope.$on("hideProduct", function(event) {
		$scope.isShowProduct = false;
		$scope.isShowMask = false;
	});

	$scope.$on("showSignin", function(event) {
		$scope.isShowMask = true;
		$scope.isShowSignin = true;
	});
	$scope.$on("hideSignin", function(event) {
		$scope.isShowSignin = false;
		$scope.isShowMask = false;
	});

	$scope.$on("showSetting", function(event) {
		$scope.isShowMask = true;
		$scope.isShowSetting = true;
	});
	$scope.$on("hideSetting", function(event) {
		$scope.isShowSetting = false;
		$scope.isShowMask = false;
	});
};

var HomeCtrl = function($scope) {
	$scope.mlBookList = [];
	$scope.srBookList = [];
	$scope.irBookList = [];
	$scope.mdBookList = [];

	$scope.showProduct = function(c, i) {
		$scope.$emit("showProduct", c, i);
	};
	$scope.showSignin = function() {
		$scope.$emit("showSignin");
	};
	$scope.showSetting = function() {
		$scope.$emit("showSetting");
	};
	$scope.openPDF = function(c, i) {
		var addr = "";
		if (c == "ml") {
			addr = $scope.mlBookList[i].pdfname;
		} else if (c == "sr") {
			addr = $scope.srBookList[i].pdfname;
		}

		if (addr == "" || addr == null) {
			$scope.showProduct(c, i);
		} else {
			window.open($scope.serverAddress + addr);
		}
	};

	$scope.$on("bindBookList", function(event, bookData) {
		for (var i in bookData) {
			var each = bookData[i];
			if (each.bookCategoryName == "Special Reports") {
				$scope.srBookList.push(each);
			} else if (each.bookCategoryName == "Institutional Research") {
				$scope.irBookList.push(each);			
			} else if (each.bookCategoryName == "Market Data") {
				$scope.mdBookList.push(each);
			}
		}
	});
};

var ProductCtrl = function($scope) {
	$scope.hideProduct = function() {
		$scope.$emit("hideProduct");
	};
};

var SigninCtrl = function($scope) {
	$scope.hideSignin = function() {
		$scope.$emit("hideSignin");
	};
};

var SettingCtrl = function($scope) {
	$scope.hideSetting = function() {
		$scope.$emit("hideSetting");
	};
}