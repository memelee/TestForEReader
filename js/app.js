var url = window.location.host;
var qa = url.indexOf("wonqaweb") != -1;

var sgi = qa?"local/proxy.aspx?uri=https://ereaderweb.williamoneil.com/rb2/u/signin":"local/proxy.php?action=sgi";
var sgo = qa?"local/proxy.aspx?uri=http://ereaderweb.williamoneil.com/rb2/u/signout":"local/proxy.php?action=sgo";
var myl = qa?"local/proxy.aspx?uri=http://ereaderweb.williamoneil.com/rb2/bk/list.json":"local/proxy.php?action=myl";
var pub = qa?"local/proxy.aspx?uri=http://ereaderweb.williamoneil.com/rb2/u/pub/list.json":"local/proxy.php?action=pub";
var pro = qa?"local/proxy.aspx?uri=http://ereaderweb.williamoneil.com/rb2/u/pub/detail.json":"local/proxy.php?action=pro";
var req = qa?"local/proxy.aspx?uri=http://ereaderweb.williamoneil.com/rb2/u/pub/reqsvc.json":"local/proxy.php?action=req";

var eReader = angular.module("eReader", ["ngAnimate", "ngTouch", "angular-gestures"]);

