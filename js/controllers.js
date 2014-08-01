// Root View Controller
eReader.controller("MainCtrl", function($scope, $timeout, Cookie) {
	// constant
	$scope.eReaderAddress = "ereader://?";
	// $scope.serverAddress = "http://ereaderweb.williamoneil.com";
	$scope.serverAddress = "http://172.22.136.45";
	$scope.browser = navigator.userAgent.toLowerCase();
	$scope.isIOS = $scope.browser.indexOf("ipod") != -1 || $scope.browser.indexOf("ipad") != -1 || $scope.browser.indexOf("iphone") != -1;
	$scope.isMobileDevice = $scope.isIOS || $scope.browser.indexOf("android") != -1;

	// view display
	$scope.isShowMask = false;
	$scope.isShowLoading = false;
	$scope.isShowPDF = false;
	$scope.isShowList = false;
	$scope.isShowProduct = false;
	$scope.isShowSignin = false;
	$scope.isShowSetting = false;

	// login
	$scope.isLogin = false;

	// login & logout event
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
		$scope.$broadcast("bindPubLibrary");
	});

	// set loading view
	$scope.$on("showLoading", function(event) {
		$scope.isShowLoading = true;
	});
	$scope.$on("hideLoading", function(event) {
		var timer = $timeout(function() {
			$scope.isShowLoading = false;
			$timeout.cancel(timer);
		}, 500);
	});

	// set pdf view
	$scope.$on("showPDF", function(event, p) {
		$scope.isShowMask = true;
		$scope.isShowPDF = true;
		$scope.$broadcast("bindPDF", p);
	});
	$scope.$on("hidePDF", function(event, p) {
		$scope.isShowPDF = false;
		$scope.isShowMask = false;
	});

    // set list view
    $scope.$on("showList", function(event) {
		$scope.isShowMask = true;
        $scope.isShowList = true;
    });
    $scope.$on("hideList", function(event) {
        $scope.isShowList = false;
		$scope.isShowMask = false;
    });
    
	// set product view 
	$scope.$on("showProduct", function(event, p) {
		$scope.isShowMask = true;
		$scope.isShowProduct = true;
		$scope.$broadcast("bindProduct", p);
	});
	$scope.$on("hideProduct", function(event) {
		$scope.isShowProduct = false;
		$scope.isShowMask = false;
	});

	// set signin view
	$scope.$on("showSignin", function(event) {
		$scope.isShowMask = true;
		$scope.isShowSignin = true;
	});
	$scope.$on("hideSignin", function(event) {
		$scope.isShowSignin = false;
		$scope.isShowMask = false;
	});

	// set setting view
	$scope.$on("showSetting", function(event) {
		$scope.isShowMask = true;
		$scope.isShowSetting = true;
	});
	$scope.$on("hideSetting", function(event) {
		$scope.isShowSetting = false;
		$scope.isShowMask = false;
	});
});

// Home View Controller
eReader.controller("HomeCtrl", function($scope, $timeout, Product, Process, Cookie) {
	$scope.startLeft = 0;
	$scope.isDragging = false;
    $scope.isShowDownload = false;

	// init book
	$scope.initHome = function() {
		if (Cookie.getCookie("EMAIL") != "") {
			$scope.$emit("showLoading");
			$scope.$emit("login");
		} else {
			$scope.$emit("showLoading");
			$scope.$emit("logout");
		}
	};

    // set style
    $scope.setStyle = function(c) {
        return {
            width: 240 * Product.getCount(c) + "px"
        };
    };

	// open sginin & setting
	$scope.showSignin = function() {
		$scope.$emit("showSignin");
	};
	$scope.showSetting = function() {
		$scope.$emit("showSetting");
	};
    
	// left & right arrow
	$scope.showLeft = function(c) {
		var target = document.getElementById(c).parentNode;
		Product.move(target, true);
	};
	$scope.showRight = function(c) {
		var target = document.getElementById(c).parentNode;
		Product.move(target, false);
	};

	// drag book list
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
	$scope.dragEnd = function(c, event) {
		if (!$scope.isMobileDevice) {
            if ($scope.browser.indexOf("chrome") != -1) {
                $scope.isDragging  = false;
            }
            
            var target = document.getElementById(c).parentNode;
            var vx = event.gesture.velocityX * 2;
            var left = event.gesture.deltaX < 0;
            Product.slow(target, vx, left);
		}
	};

    $scope.showList = function() {
        $scope.$emit("showList");
    };
    
    $scope.download = function(product) {
        window.open("local/proxy.aspx?action=download&uri=" + $scope.serverAddress + product.pdfname);
    };
    
	// click non-request book
	$scope.showProduct = function(product) {
		if (!$scope.isMobileDevice && $scope.isDragging) {
			$scope.isDragging  = false;
		} else {
			$scope.$emit("showLoading");
			$scope.$emit("showProduct", product);
		}
	};
    
	// open pdf
	$scope.showPDF = function(product) {
		if (!$scope.isMobileDevice && $scope.isDragging) {
			$scope.isDragging  = false;
		} else {
			if (product.pdfname == "" || product.pdfname == null) {
                $scope.$emit("showLoading");
				$scope.$emit("showProduct", product);
			} else {
				if ($scope.isIOS) {
					var addr = $scope.eReaderAddress + product.bookName;
					if (product.volumeNumber) {
						addr += ":" + product.volumeNumber;
					}

					var app = document.createElement("iframe");
					app.style.display = "none";
					app.src = addr;
					document.body.appendChild(app);

					var old = (new Date()).getTime();
					var timer = $timeout(function() {
						document.body.removeChild(app);
						var now = (new Date()).getTime();
						if (now - old < 1500) {
							window.open("local/proxy.aspx?uri=" + $scope.serverAddress + product.pdfname);
						}
						$timeout.cancel(timer);
					}, 800);
				} else if ($scope.isMobileDevice) {
					window.open("local/proxy.aspx?uri=" + $scope.serverAddress + product.pdfname);
				} else {
					$scope.$emit("showPDF", product);
				}
			}
		}
	};

	// bind book event
	$scope.$on("bindPubLibrary", function(event) {
		Process.getPubList().then(function(data) {
			Product.clear();
            
			var bookData = data["response"]["bkdata"];
			for (var i in bookData) {
				var each = bookData[i];
				if (each.bookCategoryName == "Special Reports") {
					Product.addOne("sr", each);
				} else if (each.bookCategoryName == "Institutional Research") {
					Product.addOne("ir", each);
				} else if (each.bookCategoryName == "Market Data") {
					Product.addOne("md", each);
				}
			}
            Product.addToDate();

			$scope.$emit("hideLoading");
		}, function(data) {
            $scope.$emit("hideLoading");
            alert("Load public books error.");
        });
	});
	$scope.$on("bindMyLibrary", function(event) {
		Process.getMyList().then(function(data) {
			Product.clear();

			var userData = data["response"]["userData"];
			$scope.nickname = userData.userName;

			var bookData = data["response"]["bkdata"];
			for (var i in bookData) {
				var each = bookData[i];
				if (each.bookCategoryName == "My Library") {
					Product.addOne("ml", each);
				} else if (each.bookCategoryName == "Special Reports") {
					Product.addOne("sr", each);
				} else if (each.bookCategoryName == "Institutional Research") {
					Product.addOne("ir", each);
				} else if (each.bookCategoryName == "Market Data") {
					Product.addOne("md", each);
				}
			}
            Product.addToDate();

			$scope.$emit("hideLoading");
		}, function(data) {
            $scope.$emit("hideLoading");
            alert("Load my books error.");
        });
	});
});

// PDF View Controller
eReader.controller("PDFCtrl", function($scope, $sce, $timeout) {
    $scope.bookPDF = "view/null.html";
    
	$scope.hidePDF = function() {
		$scope.$emit("hidePDF");
		var timer = $timeout(function() {
			$scope.bookName = "";
			$scope.bookPDF = "view/null.html";
			$timeout.cancel(timer);
		}, 500);
	};

	$scope.$on("bindPDF", function(event, p) {
		$scope.bookName = p.bookName;
		$scope.bookPDF = $sce.trustAsResourceUrl("local/proxy.aspx?uri=" + $scope.serverAddress + p.pdfname);
	});
});

// List View Controller
eReader.controller("ListCtrl", function($scope, $timeout, Product) {
    $scope.activeSegment = 0;
    
    $scope.hideList = function() {
        $scope.$emit("hideList");
        var timer = $timeout(function() {
            $scope.search = "";
            $scope.activeSegment = 0;
			$timeout.cancel(timer);
		}, 500);
    };
    
    $scope.showThis = function(i) {
        $scope.activeSegment = i;
    };
    
    // open pdf
	$scope.showPDF = function(product) {
        $scope.hideList();
        if (product.pdfname == "" || product.pdfname == null) {
            var timer = $timeout(function() {
                $scope.$emit("showLoading");
                $scope.$emit("showProduct", product);
                $timeout.cancel(timer);
            }, 500);
        } else {
            if ($scope.isIOS) {
                var addr = $scope.eReaderAddress + product.bookName;
                if (product.volumeNumber) {
                    addr += ":" + product.volumeNumber;
                }

                var app = document.createElement("iframe");
                app.style.display = "none";
                app.src = addr;
                document.body.appendChild(app);

                var old = (new Date()).getTime();
                var timer = $timeout(function() {
                    document.body.removeChild(app);
                    var now = (new Date()).getTime();
                    if (now - old < 1500) {
                        window.open("local/proxy.aspx?uri=" + $scope.serverAddress + product.pdfname);
                    }
                    $timeout.cancel(timer);
                }, 800);
            }
            else if ($scope.isMobileDevice) {
                window.open("local/proxy.aspx?uri=" + $scope.serverAddress + product.pdfname);
            } else {
                var timer = $timeout(function() {
                    $scope.$emit("showPDF", product);
                    $timeout.cancel(timer);
                }, 500);
            }
        }
	};
});

// Product View Controller
eReader.controller("ProductCtrl", function($scope, $sce, $swipe, $timeout, Process) {
	$scope.isShowNext = false;
	$scope.isShowRequest = false;
	$scope.isShowCarousel = false;
	$scope.activeCarousel = 0;

    $scope.setStyle = function() {
        return {
            width: 640 * $scope.product.imageData.length + "px", 
            left: -640 * $scope.activeCarousel + "px"
        };
    };
    
	$scope.hideProduct = function() {
		$scope.$emit("hideProduct");
		var timer = $timeout(function() {
			$scope.isShowNext = false;
			$scope.isShowRequest = false;
			$scope.isShowCarousel = false;
			$timeout.cancel(timer);
		}, 500);
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

	$scope.request = function(u) {
		$scope.$emit("showLoading");
		u.book = $scope.bookID;
		Process.request(u).then(function(data) {
			alert("Thank you for requesting service. We will contact you within 1-2 business days.");
			$scope.isShowNext = false;
			$scope.$emit("hideLoading");
		}, function(data) {
            $scope.isShowNext = false;
            $scope.$emit("hideLoading");
            alert("Request book error.");
        });
	};

	$scope.$on("bindProduct", function(event, p) {
		$scope.bookID = p.bookID;
		$scope.productTitle = p.bookName;
		Process.getProDetail(p.bookID).then(function(data) {
			var productData = data["response"]["productData"];
			$scope.product = productData;
			$scope.productHTML = $sce.trustAsResourceUrl($scope.serverAddress + productData.textUrl);
			$scope.$emit("hideLoading");
		}, function(data) {
            $scope.hideProduct();
            $scope.$emit("hideLoading");
            alert("Load book infomation error.");
        });
	});
});

// Signin View Controller
eReader.controller("SigninCtrl", function($scope, Cookie, Process) {
	$scope.hideSignin = function() {
		$scope.$emit("hideSignin");
	};

	$scope.login = function(u) {
        if (typeof(u) == "undefined" || typeof(u.email) == "undefined" || u.email == "") {
            alert("Please enter a valid email address.");
            return;
        }
        if (typeof(u.password) == "undefined" || u.password == "") {
            alert("Please enter a valid password.");
            return;
        }
        
		$scope.$emit("showLoading");
		Process.login(u).then(function(data) {
			Cookie.setCookie("RAY_SESSION_ID", "\"" + data + "\"");
			Cookie.setCookie("EMAIL", u.email);
			$scope.$emit("login");
		}, function(data) {
            $scope.$emit("hideLoading");
            alert("Please check your address and password and try again.");
        });
	};
});

// Setting View Controller
eReader.controller("SettingCtrl", function($scope, Cookie, Process) {
	$scope.hideSetting = function() {
		$scope.$emit("hideSetting");
	};

	$scope.logout = function() {
		$scope.$emit("showLoading");
		Process.logout().then(function(data) {
			Cookie.delCookie("RAY_SESSION_ID");
			Cookie.delCookie("EMAIL");
			$scope.$emit("logout");
		}, function(data) {
            $scope.$emit("hideLoading");
            alert("Unknown error.");
        });
	};
});