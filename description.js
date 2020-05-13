function iOSVersion() {
	var match = (navigator.appVersion).split('OS ');
	if (match.length > 1) {
		return match[1].split(' ')[0].split('_').join('.');
	}
	return false;
}
var theme = localStorage.Theme;
if(!theme) {
	theme = "ios7.min";
	localStorage.setItem('Theme', theme);
}
$('head').append('<link rel="stylesheet" href="'+theme+'.css?_=f" type="text/css" />');
function toogleTheme()
{
	var themeNew = "ios7.min";
	if(localStorage.Theme === themeNew) {
		themeNew = "ios7dark";
	}
	localStorage.setItem('Theme', themeNew);
	window.location.reload(false);
}
$(function() {
  $("li").on("click",function() {
	  if(this.id=="dnt") {
		  $("#dnt_txt").html("You can donate USD via PayPal mail: julioverne"+"@"+"icloud.com");
	  }
  });
});
function loadPackageInfo() {
	var urlSelfParts = window.location.href.split('description.html?id=');
	var current_url_path = window.location.href.slice(0, window.location.href.lastIndexOf('/'));
	var form_url = current_url_path+"/packageInfo/"+urlSelfParts[1];
	if (navigator.userAgent.search(/Cydia/) == -1) {
		$("#showAddRepo_").show();
		$("#open_cydia").attr("href","cydia://url/https://cydia.saurik.com/api/share#?source=https://julioverne.github.io/&package="+urlSelfParts[1]);
	}
	$.ajax({
		url: form_url,
		type: "GET",
		cache: false,
		crossDomain: true,
		success: function (returnhtml) {
			$("#tweakStatusInfo").hide();
			var decodeResp = eval('('+returnhtml+')');
			if(decodeResp.name) {
				document.title = decodeResp.name;
				$("#name").html(decodeResp.name);
				$("#name").show();
			}
			if(decodeResp.desc_short) {
				$("#desc_short").html(decodeResp.desc_short);
				$("#desc_short_").show();
			}
			if(decodeResp.warning) {
				$("#warning").html(decodeResp.warning);
				$("#warning_").show();
			}
			if(decodeResp.desc_long) {
				$("#desc_long").html(decodeResp.desc_long);
				$("#desc_long_").show();
			}
			if(decodeResp.compatitle) {
				$("#compatitle_").show();
				$("#compatitle").html(decodeResp.compatitle);
				var ios_ver = iOSVersion();
				if(ios_ver) {
					$(".cur_ios").html("Current iOS: "+ios_ver);
				}
			}
			if(decodeResp.changelog) {
				$("#changelog").html(decodeResp.changelog);
				$("#changelog_").show();
			}
			if(decodeResp.screenshot) {
				$("#screenshot").html(decodeResp.screenshot);
				$("#screenshot_").show();
			}
			if(decodeResp.open == true) {
				$("#is_open_source_").show();
			}
			
        },
		error: function (err) {
			$("#errorInfo").html("Description unavailable for "+urlSelfParts[1]);
		}
	});
}

				
var allPackages = null;
var packagesSection = {};
function openSection(sectionName)
{
	var sectionContent = "";
	sectionContent += "<li class=\"has-icon\"><a onclick=\"loadMainSection()\" role=\"button\"><img style=\"border-radius: 20%;\" href=\"back.png\" alt=\"\" srcset=\"back.png 2x, back.png 3x\" class=\"icon\"/><label><< Back</label></a></li>";
	for (var keyNow in packagesSection[sectionName]) {
		var dicNow = packagesSection[sectionName][keyNow];
		var urlOpen = "cydia://package/"+dicNow.package;
		if (navigator.userAgent.search(/Cydia/) == -1) {
			var current_url_path = window.location.href.slice(0, window.location.href.lastIndexOf('/'));
			urlOpen = current_url_path+"/description.html?id="+dicNow.package;
		}		
		sectionContent +=  "<li class=\"has-icon\"><a href='"+urlOpen+"' target='_blank' role=\"button\"><img style=\"border-radius: 20%;\" href=\""+encodeURI(sectionName)+".png\" alt=\"\" srcset=\""+encodeURI(sectionName)+".png 2x, "+encodeURI(sectionName)+".png 3x\" class=\"icon\"/><label>"+dicNow.name+" v"+dicNow.version+"</label></a></li>";
	}
	
	$("#browser").html(sectionContent);
}
function loadMainSection()
{
	var sectionContent = "";
	for (var section in packagesSection) {		
		sectionContent += "<li class=\"has-icon\"><a onclick=\"openSection('"+section+"')\" role=\"button\"><img style=\"border-radius: 20%;\" href=\""+encodeURI(section)+".png\" alt=\"\" srcset=\""+encodeURI(section)+".png 2x, "+encodeURI(section)+".png 3x\" class=\"icon\"/><label>"+section+" ("+packagesSection[section].length+")</label></a></li>";
	}
	$("#browser").html(sectionContent);
}
function getPackageWithID(pkg_id)
{
	for (var dicNow in allPackages) {
		if(allPackages[dicNow].package == pkg_id) {
			return allPackages[dicNow];
		}
	}
	return null;
}
function loadPackageDetail()
{
	var packageID = window.location.href.split('description.html?id=')[1];
	var packageInfo = getPackageWithID(packageID);
	if(packageInfo!=null) {
		$("#pkg_").show();
		$("#pkg_name").html(packageInfo.name);
		$("#pkg_id").html(packageInfo.package);
		$("#pkg_section").html(packageInfo.section);
		$("#pkg_version").html(packageInfo.version);
		$("#pkg_size").html(filesize(packageInfo.size));
		$("#pkg_time").html(timeago.format(packageInfo.time*1000));
	}
}
function loadRecentUpdates()
{
	var htmlnews = "";
	var count = 0;
	for (var dicNow in allPackages) {
		count++;
		if(count > 5) {
			break;
		}
		var urlOpen = "cydia://package/"+allPackages[dicNow].package;
		if (navigator.userAgent.search(/Cydia/) == -1) {
			var current_url_path = window.location.href.slice(0, window.location.href.lastIndexOf('/'));
			urlOpen = current_url_path+"/description.html?id="+allPackages[dicNow].package;
		}				
		htmlnews +=  "<li class=\"has-icon\"><a href='"+urlOpen+"' target='_blank' role=\"button\"><img style=\"border-radius: 20%;\" href=\""+encodeURI(allPackages[dicNow].section)+".png\" alt=\"\" srcset=\""+encodeURI(allPackages[dicNow].section)+".png 2x, "+encodeURI(allPackages[dicNow].section)+".png 3x\" class=\"icon\"/><label>"+allPackages[dicNow].name+" v"+allPackages[dicNow].version+"</label></a></li>";
	}
	$("#updates").html(htmlnews);
}
function loadPackages() {
	var current_url_path = window.location.href.slice(0, window.location.href.lastIndexOf('/'));
	var form_url = current_url_path+"/all.packages";
	$.ajax({
		url: form_url,
		type: "GET",
		cache: false,
		crossDomain: true,
		success: function (returnhtml) {
			allPackages = eval('('+returnhtml+')');
			var htmlnews = "";
			for (var dicNow in allPackages) {
				
				var section = allPackages[dicNow].section;
				if(section==null) {
					section = "Unknown";
				}
				if(packagesSection[section] == null) {
					packagesSection[section] = [];
				}
				packagesSection[section].push(allPackages[dicNow]);
			}
			loadMainSection();
			loadRecentUpdates();
			$("#browser_").show();
			$("#updates_").show();
			
			loadPackageDetail();
        },
		error: function (err) {
			$("#browser_").hide();	
			$("#updates_").hide();
		}
	});
}

// File Size Format
!function(e,i){"object"==typeof exports&&"undefined"!=typeof module?module.exports=i():"function"==typeof define&&define.amd?define(i):(e=e||self).filesize=i()}(this,(function(){"use strict";const e=/^(b|B)$/,i={iec:{bits:["b","Kib","Mib","Gib","Tib","Pib","Eib","Zib","Yib"],bytes:["B","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"]},jedec:{bits:["b","Kb","Mb","Gb","Tb","Pb","Eb","Zb","Yb"],bytes:["B","KB","MB","GB","TB","PB","EB","ZB","YB"]}},b={iec:["","kibi","mebi","gibi","tebi","pebi","exbi","zebi","yobi"],jedec:["","kilo","mega","giga","tera","peta","exa","zetta","yotta"]};function t(t,o={}){if(isNaN(t))throw new TypeError("Invalid number");let n=[],a=0,B=!0===o.bits,r=!0===o.unix,d=o.base||2,s=void 0!==o.round?o.round:r?1:2,c=void 0!==o.locale?o.locale:"",f=o.localeOptions||{},u=void 0!==o.separator?o.separator:"",y=void 0!==o.spacer?o.spacer:r?"":" ",M=o.symbols||{},h=2===d&&o.standard||"jedec",l=o.output||"string",m=!0===o.fullform,p=o.fullforms instanceof Array?o.fullforms:[],v=void 0!==o.exponent?o.exponent:-1,j=Number(t),N=j<0,g=d>2?1e3:1024;return N&&(j=-j),(-1===v||isNaN(v))&&(v=Math.floor(Math.log(j)/Math.log(g)))<0&&(v=0),v>8&&(v=8),"exponent"===l?v:(0===j?(n[0]=0,n[1]=r?"":i[h][B?"bits":"bytes"][v]):(a=j/(2===d?Math.pow(2,10*v):Math.pow(1e3,v)),B&&(a*=8)>=g&&v<8&&(a/=g,v++),n[0]=Number(a.toFixed(v>0?s:0)),n[0]===g&&v<8&&void 0===o.exponent&&(n[0]=1,v++),n[1]=10===d&&1===v?B?"kb":"kB":i[h][B?"bits":"bytes"][v],r&&(n[1]="jedec"===h?n[1].charAt(0):v>0?n[1].replace(/B$/,""):n[1],e.test(n[1])&&(n[0]=Math.floor(n[0]),n[1]=""))),N&&(n[0]=-n[0]),n[1]=M[n[1]]||n[1],!0===c?n[0]=n[0].toLocaleString():c.length>0?n[0]=n[0].toLocaleString(c,f):u.length>0&&(n[0]=n[0].toString().replace(".",u)),"array"===l?n:(m&&(n[1]=p[v]?p[v]:b[h][v]+(B?"bit":"byte")+(1===n[0]?"":"s")),"object"===l?{value:n[0],symbol:n[1]}:n.join(y)))}return t.partial=e=>i=>t(i,e),t}));

// Time Ago Format
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e=e||self).timeago={})}(this,function(e){"use strict";var c=[60,60,24,7,365/7/12,12];function n(e){return e instanceof Date?e:!isNaN(e)||/^\d+$/.test(e)?new Date(parseInt(e)):(e=(e||"").trim().replace(/\.\d+/,"").replace(/-/,"/").replace(/-/,"/").replace(/(\d)T(\d)/,"$1 $2").replace(/Z/," UTC").replace(/([+-]\d\d):?(\d\d)/," $1$2"),new Date(e))}function f(e,t){for(var n=e<0?1:0,r=e=Math.abs(e),a=0;e>=c[a]&&a<c.length;a++)e/=c[a];return(0===(a*=2)?9:1)<(e=~~e)&&(a+=1),t(e,a,r)[n].replace("%s",e)}function d(e,t){return(+(t=t?n(t):new Date)-+n(e))/1e3}var r=["second","minute","hour","day","week","month","year"];function t(e,t){if(0===t)return["just now","right now"];var n=r[~~(t/2)];return 1<e&&(n+="s"),[e+" "+n+" ago","in "+e+" "+n]}var a=["秒","分钟","小时","天","周","个月","年"];function i(e){return o[e]||t}var o={en_US:t,zh_CN:function(e,t){if(0===t)return["刚刚","片刻后"];var n=a[~~(t/2)];return[e+" "+n+"前",e+" "+n+"后"]}},s="timeago-id";function l(e){return parseInt(e.getAttribute(s))}var p={},v=function(e){clearTimeout(e),delete p[e]};function h(e,t,n,r){v(l(e));var a=r.relativeDate,i=r.minInterval,o=d(t,a);e.innerText=f(o,n);var u=setTimeout(function(){h(e,t,n,r)},Math.min(1e3*Math.max(function(e){for(var t=1,n=0,r=Math.abs(e);e>=c[n]&&n<c.length;n++)e/=c[n],t*=c[n];return r=(r%=t)?t-r:t,Math.ceil(r)}(o),i||1),2147483647));p[u]=0,function(e,t){e.setAttribute(s,t)}(e,u)}e.cancel=function(e){e?v(l(e)):Object.keys(p).forEach(v)},e.format=function(e,t,n){return f(d(e,n&&n.relativeDate),i(t))},e.register=function(e,t){o[e]=t},e.render=function(e,t,n){var r=e.length?e:[e];return r.forEach(function(e){h(e,function(e){return e.getAttribute("datetime")}(e),i(t),n||{})}),r},Object.defineProperty(e,"__esModule",{value:!0})});