eReader.controller("MainCtrl", function($scope, $http, Cookie) {
	$scope.serverAddress = "http://ereaderweb.williamoneil.com";
	$scope.browser = navigator.userAgent.toLowerCase();
	$scope.isMobileDevice = $scope.browser.indexOf("ipod") != -1 || $scope.browser.indexOf("ipad") != -1 || $scope.browser.indexOf("iphone") != -1 || $scope.browser.indexOf("android") != -1;

	$scope.isLogin = Cookie.getCookie("EMAIL") != "";

	$scope.isShowMask = false;
	$scope.isShowSignin = false;
	$scope.isShowSetting = false;

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

	$scope.$on("login", function(event) {
		$scope.isShowSignin = false;
		$scope.isShowMask = false;

		$scope.isLogin = true;
		$scope.$broadcast("bindMyLibrary");
	});
	$scope.$on("logout", function(event) {
		$scope.isShowSetting = false;
		$scope.isShowMask = false;

		$scope.isLogin = false;
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
});

eReader.controller("HomeCtrl", function($scope, Product) {
	$scope.startLeft = 0;
	$scope.isDragging = false;
	
	$scope.showProduct = function(c, i) {
		if (!$scope.isMobileDevice && $scope.isDragging) {
			$scope.isDragging  = false;
		} else {
			var product = Product.getProduct(c, i);
			$scope.$emit("showProduct", product);
		}
	};

	$scope.showSignin = function() {
		$scope.$emit("showSignin");
	};
	$scope.showSetting = function() {
		$scope.$emit("showSetting");
	};

	$scope.showLeft = function(c) {
		var target = document.getElementById(c).parentNode;
		var left = target.scrollLeft;

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
		var left = target.scrollLeft;

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
			$scope.startLeft = target.scrollLeft;
		}
	};
	$scope.dragging = function(c, event) {
		if (!$scope.isMobileDevice) {
			var dt = event.gesture.deltaX;
			var target = document.getElementById(c).parentNode;
			target.scrollLeft =  $scope.startLeft - dt;
		}
	};
	$scope.dragEnd = function(c) {
		if (!$scope.isMobileDevice && $scope.browser.indexOf("chrome") != -1) {
			$scope.isDragging  = false;
		}
	};

	$scope.openPDF = function(c, i) {
		if (!$scope.isMobileDevice && $scope.isDragging) {
			$scope.isDragging  = false;
		} else {
			var product = Product.getProduct(c, i);
			if (product.pdfname == "" || product.pdfname == null) {
				$scope.$emit("showProduct", product);
			} else {
				window.open($scope.serverAddress + product.pdfname);
			}
		}
	};

	$scope.$on("bindMyLibrary", function(event) {
		$scope.nickname = "call me nickname";
		// TODO bind my library
	});
});

eReader.controller("ProductCtrl", function($scope, $http, $sce, $swipe) {
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
});

eReader.controller("SigninCtrl", function($scope, Cookie) {
	$scope.hideSignin = function() {
		$scope.$emit("hideSignin");
	};

	$scope.login = function(u) {
		Cookie.setCookie("EMAIL", u.email);
		$scope.$emit("login");
	};
});

eReader.controller("SettingCtrl", function($scope, Cookie) {
	$scope.hideSetting = function() {
		$scope.$emit("hideSetting");
	};

	$scope.logout = function() {
		Cookie.delCookie("EMAIL");
		$scope.$emit("logout");
	};
});