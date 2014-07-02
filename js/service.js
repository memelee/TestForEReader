eReader.factory("Product", function($rootScope) {
	$rootScope.mlBookList = [];
	$rootScope.srBookList = [];
	$rootScope.irBookList = [];
	$rootScope.mdBookList = [];
	
	return {
		getProduct: function(c, i) {
			switch (c) {
			case "ml":
				return $rootScope.mlBookList[i];
			case "sr":
				return $rootScope.srBookList[i];
			case "ir":
				return $rootScope.irBookList[i];
			case "md":
				return $rootScope.mdBookList[i];
			}
		}
	};
});

eReader.factory("Cookie", function() {
	return {
		setCookie: function(k, v) {
			var exp = new Date();
			exp.setTime(exp.getTime() + 1 * 60 * 60 * 1000);
			document.cookie = k + "=" + escape(v) + ";path=/;expires=" + exp.toGMTString();
		},
		getCookie: function(k) {
			var arr = document.cookie.split("; ");
			for (var i = 0; i < arr.length; i++) {
				var kv = arr[i].split("=");
				if (kv[0] == k) {
					return unescape(kv[1]);
				}
			}
			return "";
		},
		delCookie: function(k) {
			document.cookie = k + "=;path=/;expires=-1";
		}
	};
});