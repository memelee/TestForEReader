eReader.factory("URL", function() {
    var base = qa ? "local/proxy.aspx?ts=" : "local/proxy.php?ts=";
    return {
        getSGI: function() {
            return base + (new Date).getTime() + (qa ?  "&uri=https://172.22.136.45/rb2/u/signin" : "&action=sgi");
        },
        getSGO: function() {
            return base + (new Date).getTime() + (qa ?  "&uri=http://172.22.136.45/rb2/u/signout" : "&action=sgo");
        },
        getPUB: function() {
            return base + (new Date).getTime() + (qa ?  "&uri=http://172.22.136.45/rb2/u/pub/list.json" : "&action=pub");
        },
        getMYL: function() {
            return base + (new Date).getTime() + (qa ?  "&uri=http://172.22.136.45/rb2/bk/list.json" : "&action=myl");
        },
        getPRO: function() {
            return base + (new Date).getTime() + (qa ?  "&uri=http://172.22.136.45/rb2/u/pub/detail.json" : "&action=pro");
        },
        getREQ: function() {
            return base + (new Date).getTime() + (qa ?  "&uri=http://172.22.136.45/rb2/u/pub/reqsvc.json" : "&action=req");
        }
    };
});

eReader.factory("Product", function($rootScope) {
	$rootScope.mlBookList = [];
	$rootScope.srBookList = [];
	$rootScope.irBookList = [];
	$rootScope.mdBookList = [];
	
	return {
		clear: function() {
			$rootScope.mlBookList = [];
			$rootScope.srBookList = [];
			$rootScope.irBookList = [];
			$rootScope.mdBookList = [];
		},
		getOne: function(c, i) {
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
		},
        getCount: function(c) {
            switch (c) {
			case "ml":
				return $rootScope.mlBookList.length;
			case "sr":
				return $rootScope.srBookList.length;
			case "ir":
				return $rootScope.irBookList.length;
			case "md":
				return $rootScope.mdBookList.length;
			}
        },
		addOne: function(c, p) {
			switch (c) {
			case "ml":
				return $rootScope.mlBookList.push(p);
			case "sr":
				return $rootScope.srBookList.push(p);
			case "ir":
				return $rootScope.irBookList.push(p);
			case "md":
				return $rootScope.mdBookList.push(p);
			}
		},
		move: function(target, left) {
			var i = 0;
			var step = left ? -3 : 3;
			var timer = setInterval(function() {
				target.scrollLeft += step;
				i += 3;
				if (i >= 240) {
					clearInterval(timer);
				}
			}, 1);
		}
	};
});

eReader.factory("Process", function($http, URL) {
	return {
		login: function(u) {
			var auth = "Basic " + btoa(u.email + ":" + u.password);
			return $http.get(URL.getSGI(), {
				headers: {
					"Authorization": auth
				}
			}).then(function(result) {
				return result.data;
			});
		},
		logout: function() {
			return $http.get(URL.getSGO()).then(function(result) {
				return result.data;
			});
		},
		request: function(u) {
			return $http.post(URL.getREQ() + "?book=" + u.book + "&email=" + u.email + "&company=" + u.company + "&name=" + u.name + "&phone=" + u.phone).then(function(result) {
				return result.data;
			});
		},
		getMyList: function() {
			return $http.get(URL.getMYL()).then(function(result) {
				return result.data;
			});
		},
		getPubList: function() {
			return $http.get(URL.getPUB()).then(function(result) {
				return result.data;
			});
		},
		getProDetail: function(id) {
			return $http.get(URL.getPRO() + "?book=" + id).then(function(result) {
				return result.data;
			});
		},
	};
});

eReader.factory("Cookie", function() {
	return {
		setCookie: function(k, v) {
			var exp = new Date();
			exp.setTime(exp.getTime() + 1 * 60 * 60 * 1000);
			document.cookie = k + "=" + v + ";path=/;expires=" + exp.toGMTString();
		},
		getCookie: function(k) {
			var arr = document.cookie.split("; ");
			for (var i = 0; i < arr.length; i++) {
				var kv = arr[i].split("=");
				if (kv[0] == k) {
					return kv[1];
				}
			}
			return "";
		},
		delCookie: function(k) {
			document.cookie = k + "=;path=/;expires=-1";
		}
	};
});