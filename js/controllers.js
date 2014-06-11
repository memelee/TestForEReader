var MainCtrl = function($scope, $http) {
	$scope.serverAddress = "http://ereaderweb.williamoneil.com";
	$scope.browser = navigator.userAgent.toLowerCase();
	$scope.isMobileDevice = $scope.browser.indexOf("ipod") != -1 || $scope.browser.indexOf("ipad") != -1 || $scope.browser.indexOf("iphone") != -1 || $scope.browser.indexOf("android") != -1;

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

	$scope.screenWidth = function() {
		// alert(document.body.scrollWidth);
		return document.body.scrollWidth;
	};
	$scope.screenHeight = function() {
		// return window.screen.height;
		return document.body.scrollHeight;
	};

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
	// $scope.startX = 0;
	$scope.startLeft = 0;
	$scope.isDragging = false;
	
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

	$scope.showLeft = function(c) {
		var target = document.getElementById(c).parentNode;
		// var target = document.getElementById(c);
		var left = target.scrollLeft;
		// var left = target.offsetLeft;
		// if (target.className.indexOf("animate") < 0) {
		// 	target.className = target.className + " animate";
		// }
		// if (left < 0) {
		// 	if (left + 240 < 0) {
				// target.scrollLeft = left + 240 + "px";
			// } else {
				// target.scrollLeft = 0 + "px";
		// 	}
		// }
		var i = 0;
		var time = setInterval(function() {
			target.scrollLeft -= 3;
			i += 3;
			if (i >= 240) {
				clearInterval(time);
			}
		}, 1);
	};
	$scope.showRight = function(c) {
		var target = document.getElementById(c).parentNode;
		// var target = document.getElementById(c);
		var left = target.scrollLeft;
		// var left = target.offsetLeft;
		// var width = target.offsetWidth;
		// var tail = target.parentNode.offsetWidth;
		// if (target.className.indexOf("animate") < 0) {
		// 	target.className = target.className + " animate";
		// }
		// if (left > -width + tail) {
		// 	if (left - 240 > -width + tail) {
		// 		target.scrollLeft = left - 240 + "px";
		// 	} else {
		// 		target.scrollLeft = -width + tail + "px";
		// 	}
		// }
		var i = 0;
		var time = setInterval(function() {
			target.scrollLeft += 3;
			i += 3;
			if (i >= 240) {
				clearInterval(time);
			}
		}, 1);
	};

	$scope.dragStart = function(c) {
		if (!$scope.isMobileDevice) {
			$scope.isDragging  = true;
			var target = document.getElementById(c).parentNode;
		// var target = document.getElementById(c);
		// target.className = target.className.replace(" animate", "");
		// $scope.startX = target.offsetLeft;
			$scope.startLeft = target.scrollLeft;
		}
	};
	$scope.dragging = function(c, event) {
		var target = document.getElementById(c).parentNode;
		// var target = document.getElementById(c);
		// var left = $scope.startX;
		if (!$scope.isMobileDevice) {
			var left = $scope.startLeft;
		// var width = target.offsetWidth;
		// var tail = target.parentNode.offsetWidth;
			var dt = event.gesture.deltaX;
		// if (left + dt <= 0 && left + dt >= -width + tail) {
		// 	target.style.left =  $scope.startX + dt + "px";
			target.scrollLeft =  $scope.startLeft - dt;
		// }
		}
	};
	$scope.dragEnd = function(c) {
		if ($scope.browser.indexOf("chrome") != -1) {
			$scope.isDragging = false;
		}
	};

	$scope.openPDF = function(c, i) {
		// if ($scope.isDragging) {
		if (!$scope.isMobileDevice && $scope.isDragging) {
			$scope.isDragging  = false;
		} else {
			var product = getProduct(c, i);
			if (product.pdfname == "" || product.pdfname == null) {
				$scope.$emit("showProduct", product);
			} else {
				window.open($scope.serverAddress + product.pdfname);
			}
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
		}
	};
};

var ProductCtrl = function($scope, $http, $sce, $swipe) {
	$scope.isShowNext = false;
	$scope.isShowRequest = false;
	$scope.isShowCarousel = false;
	$scope.activeCarousel = 0;

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
	};

	$scope.showLeft = function() {
		if ($scope.activeCarousel - 1 >= 0) {
			$scope.activeCarousel--;
		}
	};
	$scope.showRight = function() {
		var count = $scope.product.imageData.length;
		if ($scope.activeCarousel + 1 < count) {
			$scope.activeCarousel++;
		}
	};
	$scope.showThis = function(i) {
		$scope.activeCarousel = i;
	};

	$scope.swipeLeft = function() {
		var count = $scope.product.imageData.length;
		if ($scope.activeCarousel + 1 < count) {
			$scope.activeCarousel++;
		}
	};
	$scope.swipeRight = function() {
		if ($scope.activeCarousel - 1 >= 0) {
			$scope.activeCarousel--;
		}
	};

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