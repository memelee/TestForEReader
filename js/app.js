var url = window.location.host;
var qa = url.indexOf("wonqaweb") != -1;

var sgi = "local/proxy.php?action=sgi";
var sgo = "local/proxy.php?action=sgo";
var myl = "local/proxy.php?action=myl";
var pub = "local/proxy.php?action=pub";
var pro = "local/proxy.php?action=pro";
var req = "local/proxy.php?action=req"

// var pub = qa?"/rb2/u/pub/list.json":"local/proxy.php?action=pub";
// var pro = qa?"/rb2/u/pub/detail":"local/proxy.php?action=pro&book=";

var eReader = angular.module("eReader", ["ngAnimate", "ngTouch", "angular-gestures"]);

