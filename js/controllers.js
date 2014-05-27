var MainCtrl = function($scope, $http) {
	$scope.serverAddress = "http://ereaderweb.williamoneil.com";

	$scope.isShowMask = false;
	$scope.isShowSignin = false;
	$scope.isShowSetting = false;

	$scope.mlBookList = [];
	$scope.srBookList = [];
	$scope.irBookList = [];
	$scope.mdBookList = [];

	$http({
		method: "GET",
		url: "js/json/booklist.json"
	})
	.success(function(data, status, headers, config) {
		var bookData = data["response"]["bkdata"];
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
	})
	.error(function(data, status, headers, config) {
		alert("load book error");
	});

	$scope.$on("showProduct", function(event, p) {
		$scope.isShowMask = true;
		$scope.isShowProduct = true;
		$scope.$broadcast("bindProduct", p);
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
	$scope.showProduct = function(c, i) {
		var product = getProduct(c, i);
		$scope.$emit("showProduct", product);
	};
	$scope.showSignin = function() {
		$scope.$emit("showSignin");
	};
	$scope.showSetting = function() {
		$scope.$emit("showSetting");
	};
	$scope.openPDF = function(c, i) {
		var product = getProduct(c, i);
		if (product.pdfname == "" || product.pdfname == null) {
			$scope.$emit("showProduct", product);
		} else {
			window.open($scope.serverAddress + product.pdfname);
		}
	};

	var getProduct = function(c, i) {
		switch (c) {
		case "ml":
			return $scope.mlBookList[i];
			break;
		case "sr":
			return $scope.srBookList[i];
			break;
		case "ir":
			return $scope.irBookList[i];
			break;
		case "md":
			return $scope.mdBookList[i];
			break;
		default:
			return null;
			break;
		}
	};
};

var ProductCtrl = function($scope, $http, $sce) {
	$scope.isShowNext = false;
	$scope.isShowRequest = false;
	$scope.isShowCarousel = false;

	$scope.hideProduct = function() {
		$scope.$emit("hideProduct");
		$scope.isShowNext = false;
		$scope.isShowRequest = false;
		$scope.isShowCarousel = false;
	};

	$scope.showRequest = function() {
		$scope.isShowNext = true;
		$scope.isShowRequest = true;
		$scope.isShowCarousel = false;
	};

	$scope.showCarousel = function(i) {
		$scope.isShowNext = true;
		$scope.isShowRequest = false;
		$scope.isShowCarousel = true;
		$scope.activeCarousel = i;
	};

	$scope.hideNext = function() {
		$scope.isShowNext = false;
	}

	$scope.showLeft = function() {
		if ($scope.activeCarousel - 1 >= 0) {
			$scope.activeCarousel--;
		}
	}

	$scope.showRight = function() {
		var count = $scope.product.imageData.length;
		if ($scope.activeCarousel + 1 < count) {
			$scope.activeCarousel++;
		}
	}

	$scope.$on("bindProduct", function(event, p) {
		$scope.productTitle = p.bookName;
		$http({
			method: "GET",
			url: "js/json/thumblist.json"
		})
		.success(function(data, status, headers, config) {
			var productData = data["response"]["productData"];
			$scope.product = productData;
			$scope.productHTML = $sce.trustAsResourceUrl($scope.serverAddress + $scope.product.textUrl);
		})
		.error(function(data, status, headers, config) {
			alert("load book error");
		});
	});
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