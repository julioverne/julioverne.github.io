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


var allPackages = null;
var packagesSection = {};
function openSection(sectionName)
{
	var sectionContent = "";
	sectionContent += "<li><a onclick=\"loadMainSection()\"><img class='icon' src='./back.png'/><label><< Back</label></a></li>";
	for (var keyNow in packagesSection[sectionName]) {
		var dicNow = packagesSection[sectionName][keyNow];
		var urlOpen = "cydia://package/"+dicNow.package;
		if (navigator.userAgent.search(/Cydia/) == -1) {
			urlOpen = window.location.protocol+"//"+window.location.hostname+"/description.html?id="+dicNow.package;
		}
		sectionContent +=  "<li><a href='"+urlOpen+"' target='_blank'><img class='icon' src='./"+sectionName+".png'/><label>"+dicNow.name+" v"+dicNow.version+"</label></a></li>";
	}
	
	$("#browser").html(sectionContent);
}
function loadMainSection()
{
	var sectionContent = "";
	for (var section in packagesSection) {
		sectionContent += "<li><a onclick=\"openSection('"+section+"')\"><img class='icon' src='./"+section+".png'/><label>"+section+"</label></a></li>";
	}
	$("#browser").html(sectionContent);
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
			urlOpen = window.location.protocol+"//"+window.location.hostname+"/description.html?id="+allPackages[dicNow].package;
		}
		htmlnews +=  "<li><a href='"+urlOpen+"' target='_blank'><img class='icon' src='./"+allPackages[dicNow].section+".png'/><label>"+allPackages[dicNow].name+" v"+allPackages[dicNow].version+"</label></a></li>";
	}
	$("#updates").html(htmlnews);
}
function loadPackages() {
	var form_url = window.location.protocol+"//"+window.location.hostname+"/all.packages";
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
        },
		error: function (err) {
			$("#browser_").hide();	
			$("#updates_").hide();
		}
	});
}