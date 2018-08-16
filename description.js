function iOSVersion() {
	var match = (navigator.appVersion).split('OS ');
	if (match.length > 1) {
		return match[1].split(' ')[0].split('_').join('.');
	}
	return false;
}
$(function() {
  $("li").on("click",function() {
	  if(this.id=="dnt") {
		  $("#dnt_txt").html("You can donate USD via PayPal mail: julioverne"+"@"+"icloud.com");
	  }
  });
});
function loadPackageInfo() {
	if (navigator.userAgent.search(/Cydia/) == -1) {
		$("#showAddRepo_").show();
		$("#showAddRepoUrl_").show();
	}
	var urlSelfParts = window.location.href.split('description.html?id=');
	var form_url = urlSelfParts[0]+"packageInfo/"+urlSelfParts[1];
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
				$("#compatitle").html(decodeResp.compatitle);
				$("#compatitle_").show();
				var ios_ver = iOSVersion();
				if(ios_ver) {
					$("#your_ios").show();
					$("#your_ios").html("Current iOS: "+ios_ver);
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
function loadRecentUpdates() {
	var form_url = window.location.protocol+"//"+window.location.hostname+"/last.updates";
	$.ajax({
		url: form_url,
		type: "GET",
		cache: false,
		crossDomain: true,
		success: function (returnhtml) {
			var decodeResp = eval('('+returnhtml+')');
			var htmlnews = "";
			for (var dicNow in decodeResp) {
				var urlOpen = "cydia://package/"+decodeResp[dicNow].package;
				if (navigator.userAgent.search(/Cydia/) == -1) {
					urlOpen = window.location.protocol+"//"+window.location.hostname+"/description.html?id="+decodeResp[dicNow].package;
				}
				htmlnews +=  "<li><a href='"+urlOpen+"' target='_blank'><img class='icon' src='tweak.png'/><label>"+decodeResp[dicNow].name+" v"+decodeResp[dicNow].version+"</label></a></li>";
			}
			$("#updates").html(htmlnews);
			$("#updates_").show();			
        },
		error: function (err) {
			$("#updates_").hide();	
		}
	});
}