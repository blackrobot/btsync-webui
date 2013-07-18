
function OnInit()
{
	utWebUI.needLicense(function(data)
	{
		$("#cancel").hide();
		if (data.agreed)
		{
			Init();
		}
		else
		{
			$("#license-dialog").modal({
			  backdrop: 'static',
			  keyboard: true
			});
		}
	});
}

function Init()
{
	timer = setInterval(Update, 1000);
	utWebUI.getOsType(function(f)
	{		
		if (f.os == "win32")
		{
			var ROOT_PATH = "c:";
			var DELIMITER = "\\";
		}
		else if (f.os == "linux" || f.os == "mac")
		{
			var ROOT_PATH = "";
			var DELIMITER = "/";
		}

		$(document).ready( function() {
			$('#filetree').fileTree({
				root: ROOT_PATH,
				delimiter: DELIMITER,
				expandSpeed: 1000,
				collapseSpeed: 1000,
				multiFolder: false,
				expandSpeed: 10,
				collapseSpeed: 10,
				folderEvent: 'click',
				onClick: function(t)
				{
					$("#add-directory").val(t);
				},
			}, function(file) {
				alert(file);
			});
		});
	});

	$("#generate-invite").click(function()
	{
		name = $('#folder-pref-dialog').data("name");
		secret = $('#folder-pref-dialog').data("secret");
		if ($("#optionsRadios1").is(':checked'))
		{
			utWebUI.generateInvite(name, secret, function(data)
			{
				$("#pref-onetimesecret").val(data.invite);
			});
		}
		else if ($("#optionsRadios2").is(':checked'))
		{
			utWebUI.generateROInvite(name, secret, function(data)
			{
				$("#pref-onetimesecret").val(data.invite);
			});
		}
	})

	$("#add-ok").click(function() 
	{
		utWebUI.addSyncFolder(document.getElementById("add-directory").value, document.getElementById("dialog-secret").value, addFolderCallback);
		return false; 
	});

	$('#add-dialog').on('show', function() {
		$('#dialog-secret').val('');
		$('#add-directory').val('');
	});

	$("#settings-button").click(function() 
	{
		getSettings();
		$('#settings-dialog').modal();
	});

	$('#settings-ok').click(function() 
	{

		$('#settings-dialog').modal('hide');
		setSettings();
		return false; 
	});

	$('#generate-secret').click(function()
	{
		utWebUI.generateSecret(function(c)
		{
			$('#dialog-secret').val(c.secret);
		});
	});

	$('#optionsRadios1').change(function() 
	{
	    $("#pref-onetimesecret").val("");
	});


	$('#optionsRadios2').change(function() 
	{
	    $("#pref-onetimesecret").val("");
	});

	$("#newsecret").click(function()
	{
		utWebUI.generateSecret(function(d)
		{
			var name = $("#folder-pref-dialog").data("name");
			var secret = $("#folder-pref-dialog").data("secret");
			utWebUI.updateSecret(name, secret, d.secret, function(data)
			{
				$("#pref-onetimesecret").val("");
				$("#secret-error").hide();
				if (typeof data.rosecret === "undefined")
				{
					$("#secret-error").show();
					$("#pref-secret").val($("#folder-pref-dialog").data("secret"));
				}
				else
				{
					if (typeof data.secret === "undefined")
					{
						$("#folder-pref-dialog").data("secret", "");
						$("#readonlymessage").show();
						$("#advanced").hide();
					}
					else
					{
						$("#folder-pref-dialog").data("secret", data.secret);
						$("#pref-secret").val(data.secret);
						$("#pref-rosecret").val(data.rosecret);
					}
				}
			})
		})
	})

	$("#pref-secret").blur(function()
	{
		var secret = $("#folder-pref-dialog").data("secret");
		var newSecret = $("#pref-secret").val();
		if ($("#folder-pref-dialog").data("secret") != newSecret)
		{
			utWebUI.updateSecret($("#folder-pref-dialog").data("name"), secret, newSecret, function(data)
			{
				$("#secret-error").hide();
				if (typeof data.rosecret === "undefined")
				{
					$("#secret-error").show();
					$("#pref-secret").val($("#folder-pref-dialog").data("secret"));
				}
				else
				{
					if (typeof data.secret === "undefined")
					{
						$("#folder-pref-dialog").data("secret", "");
						$("#readonlymessage").show();
						$("#advanced").hide();
					}
					else
					{
						$("#folder-pref-dialog").data("secret", data.secret);
						$("#pref-secret").val(data.secret);
						$("#pref-rosecret").val(data.rosecret);
					}
				}
			})
		}
	});

	getSettings();
	utWebUI.getVersion(function(f) { version = f.version; }, false);
	utWebUI.getOsType(function(f) { osType = f.os.toLowerCase(); }, false);

	currentVersion = makeVersion(version);
	$("#download_new").text("");
	$("#download_new").attr("href", "");
	$("#version_label").text( "Version " + currentVersion.ver );

	if (osType == "linux")
	{
		checkVersion();
	}
}

function addFolderCallback(data)
{
	if (data.error == 104)
	{
		if (confirm(data.message))
		{
			utWebUI.addForceSyncFolder(data.n, data.secret, addFolderCallback);
			return;
		}
	}

	if (data.error)
	{
		$("#add-error").removeClass("hide");
		$("#add-error").text(data.message);
	}
	else
	{
		$('#add-dialog').modal('hide');
		$("#add-error").text("");
		$("#add-error").addClass("hide");
		getFolders();
	}
}

function checkVersion()
{
	utWebUI.checkNewVersion(function(res)
	{
		currentVersion = makeVersion(version);
		if (version >= res.version.version)
		{
			$("#download_new").text("");
			$("#download_new").attr("href", "");
			$("#version_label").text( "Version " + currentVersion.ver + " ( up to date )" );
		}
		else
		{
			newVersion = makeVersion(res.version.version);
			$("#version_label").html( "Version " + currentVersion.ver 
				+ " ( new version " + newVersion.ver + " is avaliable - <a href=" + "\"" + res.version.url + "\"" + ">download</a> )" );
		}
	});
}

function makeVersion(version)
{
	var v = { };

	v.major = (version & 0xFF000000) >> 24;
	v.minor = (version & 0x00FF0000)  >> 16;
	v.tiny = (version & 0x0000FFFF);
	v.ver = v.major + "." + v.minor + "." + v.tiny;

	return v;
}

function jsonCallback(f)
{
	alert("Yahooo!");
}

function Update()
{
	getFolders();
}

function getSettings()
{	
	utWebUI.getSettings(function(c)
	{
		var elems = [ "listeningport", "dlrate", "ulrate", "portmapping", "devicename"];

		for(var e = 0; e < elems.length; ++e)
		{
			var elem = document.getElementById(elems[e]);
			if (elem.type == "checkbox")
			{
				elem.checked = c.settings[elems[e]];
			}
			else
			{
				elem.value = decodeURIComponent(escape(c.settings[elems[e]]));
			}
		}

	});
}

function setSettings()
{
	var elems = ["listeningport", "dlrate", "ulrate", "portmapping"];
	var query = ""

	for(var e = 0; e < elems.length; ++e)
	{
		var elem = document.getElementById(elems[e]);
		query += "&" + elems[e] + "=" + (+(elem.type == "checkbox" ? elem.checked : elem.value));
	}
	query += "&devicename=" + encodeURIComponent(document.getElementById("devicename").value);

	utWebUI.setSettings(query, function(c){ });
}

function img_create(src, alt, title) {
    var img= document.createElement('img');
    img.src= src;
    img.width = 20;
    img.height = 20;
    if (alt!=null) img.alt= alt;
    if (title!=null) img.title= title;
    return img;
}

function getFolders()
{
	utWebUI.getSyncFolders(function(c)
	{
		var nameIndex = 0;
		var sizeIndex = 1;
		var folders = c.folders;

		var elementIndex = 1;

		var table = $("#filetable tbody");

		$("#totalspeed").html(c.speed);

		$("#filetable tbody tr").each(function()
		{
			var exists = false;
			var row = $(this);
			$.each(folders, function(index, folder)
			{
				var folderName = decodeURIComponent(escape(folder.name));
				if (row.children('td').eq(nameIndex).text() == folderName)
				{
					row.data("secret", folder.secret);
					row.children('td').eq(sizeIndex).text(folder.size);
					folders.splice(index, 1);

					var peers = folder.peers;
					var contable =  document.createElement("table");
				    for (var i = 0; i < peers.length; i++) 
				    {
				    	var peer = peers[i];
				        var rowStatus = contable.insertRow(i);

			            var directCell = rowStatus.insertCell(0);
            			$(directCell).css("paddingTop", "12px").css("width", "20px");
			            if (peer.direct)
			            {
			            	var d = document.createElement('div');
			            	$(d).addClass("local");
			            	directCell.appendChild(d);
			            }
			            else
			            {
			            	var d = document.createElement('div');
			            	$(d).addClass("supernode");
			            	directCell.appendChild(d);
			            }

			            var nameCell = rowStatus.insertCell(1);
			            nameCell.appendChild(document.createTextNode(decodeURIComponent(escape(peer.name))));

			            var statusCell = rowStatus.insertCell(2);
			            var stat = document.createElement("div");
			            var statusText = peer.status;
			            $(stat).html(statusText);
			            statusCell.appendChild(stat);
				    }
				    row.children('td').eq(2).html(contable.outerHTML);


					exists = true;
					return false;
				}
			});

			if (!exists)
			{
				$(this).remove();
			}
		})

		$.each(folders, function(index, folder)
		{
			var row = $("<tr/>");
			row.data("secret", folder.secret);

			var folderName = decodeURIComponent(escape(folders[index].name));
			var removeButton = $("<a><img src='images/cross.png'/></a>").addClass("btn").addClass("removeButton");
			var removeFunction = (function(n)
			{
				return function()
				{
					if (confirm("This folder will be removed from BitTorrent Sync and no longer synced with other devices."))
					{
						var s = $(row).data("secret")
						utWebUI.removeSyncFolder(n,  s, (function()
						{
							getFolders();
						}).bind(this));
					}
				}
			})(folderName);
			$(removeButton).click(removeFunction);

			var secretButton = $("<a>Secret / QR</a>").addClass("btn");
			var secretFunction = (function(s, r, writable, f)
			{
				return function()
				{
					var devicename = encodeURIComponent(document.getElementById("devicename").value);
					if (writable)
					{
						$("#getsecret-radio").show()
					}
					else
					{
						$("#getsecret-radio").hide();
					}

					var splited = f.split("/");
					var name = splited[splited.length - 1];

					document.getElementById("optionsFull").checked = true;
					$("#getsecret").val(s);
					$("#secretqr").empty();
					$("#secretqr").qrcode({width: 256, height: 256, text: "btsync://" + s + "?n=" + name });
					$('#getsecret-dialog').modal();

					$("#optionsFull").click(function()
					{
						$("#getsecret").val(s);
						$("#secretqr").empty();
						$("#secretqr").qrcode({width: 256, height: 256, text: "btsync://" + s + "?n=" + name });
					});

					$("#optionsRO").click(function()
					{
						$("#getsecret").val(r);
						$("#secretqr").empty();
						$("#secretqr").qrcode({width: 256, height: 256, text: "btsync://" + r + "?n=" + name });
					});
				}
			})(folder.secret, folder.readonlysecret, folder.iswritable, folder.name);
			$(secretButton).click(secretFunction);

			var settingButton = $("<a><img src='images/pref.png' /></a>").addClass("btn").addClass("removeButton");
			var settingFunction = (function(n, s)
			{
				return function()
				{
					var s = $(row).data("secret")
					utWebUI.getFolderPreferences(n, s, function(pref)
					{
						$("#secret-error").hide();
						$('#folder-pref-dialog').data("name", n).data("secret", s);

						hostsList();

						document.getElementById("addhost").onclick = addHost;

						var elems = [ "relay", "usetracker", "searchlan", "searchdht", "deletetotrash", "usehosts"];

						for(var e = 0; e < elems.length; ++e)
						{
							var elem = document.getElementById(elems[e]);

							elem.checked = pref.folderpref[elems[e]];

							elem.onclick = savePref;
						}

						var isWritable = pref.folderpref.iswritable;
						if (isWritable)
						{
							$("#readonlymessage").hide();
							$("#advanced").show();
							$("#pref-secret").val(s);
							$("#pref-rosecret").val(pref.folderpref.readonlysecret);
						}
						else
						{
							$("#readonlymessage").show();
							$("#advanced").hide();
						}

						$('#folder-pref-dialog').modal();

						$("#btnconnect").click(function()
						{
							$('#folder-pref-dialog').modal('hide');
							secretFunction();
						});
					});
				}
			})(folderName);
			$(settingButton).click(settingFunction);

			var peers = folder.peers;
			var contable =  document.createElement("table");
		    for (var i = 0; i < peers.length; i++) 
		    {
		    	var peer = peers[i];
		        var conrow = contable.insertRow(i);

	            var directCell = conrow.insertCell(0);
	            $(directCell).css("paddingTop", "12px").css("width", "20px");
	            if (!peer.direct)
	            {
	            	directCell.appendChild(img_create("images/supernode.png"));
	            }

	            var nameCell = conrow.insertCell(1);
	            nameCell.appendChild(document.createTextNode(decodeURIComponent(escape(peer.name))));

	            var statusCell = conrow.insertCell(2);
	            var stat = document.createElement("div");
	            var statusText = peer.status;
	            $(stat).html(statusText);
	            statusCell.appendChild(stat);
		    }
		    $(contable).addClass("pull-right");

		    var readonly = "";// folder.secret[0] == "R" ? "<div class='readonly pull-right' />" : "";
			row.append($("<td>" + folderName + readonly + "</td>")).
			append($("<td>" + folder.size + "</td>")).
			append($("<td>" + contable.outerHTML + "</td>")).
			append($("<td/>").append($("<div  class='btn-toolbar' style='margin: 0px;'/>").append(secretButton).append(settingButton).append(removeButton)));
			row.data("secret", folder.secret);
			table.append(row);
		});
	});
}

function addHost()
{
	name = $('#folder-pref-dialog').data("name");
	secret = $('#folder-pref-dialog').data("secret");
	utWebUI.addHost(name, secret, $("#address").val(), $("#port").val(), function() { });
	hostsList();
}

function savePref()
{
	var elems = ["relay", "usetracker", "searchlan", "searchdht", "deletetotrash", "usehosts"];
	var query = ""

	for(var e = 0; e < elems.length; ++e)
	{
		var elem = document.getElementById(elems[e]);
		query += "&" + elems[e] + "=" + (+elem.checked);
	}
	name = $('#folder-pref-dialog').data("name");
	secret = $('#folder-pref-dialog').data("secret");

	utWebUI.setFolderPreferences(name, secret, query, function(c){ });
}

function onAddClick()
{
	utWebUI.addSyncFolder( document.getElementById("folder").value.replace("/", "\\").replace("/", ""),  document.getElementById("secret").value, (function()
	{
		OnInit();
	}).bind(this));

}

function hostsList()
{
	name = $('#folder-pref-dialog').data("name");
	secret = $('#folder-pref-dialog').data("secret");

	utWebUI.getHosts(name, secret, function(data)
	{
		var hosts = data.hosts;
		var hostList = $("#hostlist");
		hostList.empty();

		for(var i = 0; i < hosts.length; ++i)
		{
			var deleteButton = $("<a class='close pull-left'> ×   </a>");
			deleteButton.click( (function(i) { return function() 
				{ 
					n = $('#folder-pref-dialog').data("name");
					s = $('#folder-pref-dialog').data("secret");
					utWebUI.removeHost(n, s, i, function(){}); hostsList(n, s); 
				}  })(name, secret, hosts[i].index));
			hostList.append($("<li/>").append(deleteButton).append($("<span>" + hosts[i].peer + "</span>")));
		}
	})
}

function OnAccept()
{
	utWebUI.licenseAccept(function()
		{
			Init();
		}
	);
}

function OnCancel()
{
	utWebUI.licenseCancel(function()
		{
			$("#license").hide();
			$("#license-button").hide();
			$("div.modal-backdrop").fadeTo(0, 1);
			$("#cancel").show();
		}
	);
}

var timer;
var errorCount = 0;
var urlBase = window.location.pathname.split("/gui", 1)[0].replace(/\/+$/, "");
var guiBase = urlBase + "/gui/";
var proxyBase = urlBase + "/proxy";
var version = 0;
var osType;

var utWebUI = {
	request: function(a, e, d, b) 
	{
		if(typeof(b) != "array") 
		{
			b = [0]
		}
		var c = this;
		var f = function() 
		{
			$.ajax(
			{
				url: guiBase + "?token=" + c.TOKEN + "&" + a + "&t=" + Date.now(),
				method: "get",
				async: typeof(d) === "undefined" || !! d,
				dataType: "json",
				error: function (xhr, ajaxOptions, thrownError) 
				{
					errorCount++;
					if (errorCount > 10)
					{
						clearInterval(timer);
						timer = setInterval(Update, 5000);
					}
				}
			}).done(function(f)
			{
				if (errorCount > 0)
				{
					errorCount = 0;
					clearInterval(timer);
					timer = setInterval(Update, 1000);
				}
				e(f);
			});		
		}
		if(!c.TOKEN) 
		{
			c.requestToken(f, true)
		} 

		f()

	},
	requestToken: function(c, b) 
	{
		var a = this;
		$.ajax({
			type: "POST",
			url: guiBase + "token.html?t=" + Date.now(),
			async: false,
		}).done(function( f ) 
		{
			var e = f.match(/>([^<]+)</);
			if(e) {
				a.TOKEN = e[e.length - 1]
			}
		});
	},
	getOsType: function(b, c) 
	{
		this.request("action=getostype", b, c);
	},
	getVersion: function(b, c) 
	{
		this.request("action=getversion", b, c);
	},
	addSyncFolder: function(n, s, f) 
	{
		var name = encodeURIComponent(n);
		var secret = encodeURIComponent(s);

		this.request("action=addsyncfolder&name=" + name + "&secret=" + secret, f);
	},
	addForceSyncFolder: function(name, secret, f) 
	{
		this.request("action=addsyncfolder&name=" + name + "&secret=" + encodeURIComponent(secret) + "&force=1", f);
	},
	removeSyncFolder: function(n, s, f) 
	{
		var name = encodeURIComponent(n);
		var secret = encodeURIComponent(s);

		this.request("action=removefolder&name=" + name + "&secret=" + secret, f);
	},
	generateSecret: function(f) 
	{
		this.request("action=generatesecret", f);
	},
	getSettings: function(b) 
	{
		this.request("action=getsettings", b);
	},
	setSettings: function(a, b) 
	{
		this.request("action=setsettings" + a, b);
	},
	getSyncFolders: function(b) 
	{
		this.request("action=getsyncfolders", b)
	},
	checkNewVersion: function(b) 
	{
		this.request("action=checknewversion", b)
	},
	getFolderPreferences: function(n, s, f) 
	{
		var name = encodeURIComponent(n);
		var secret = encodeURIComponent(s);

		this.request("action=getfolderpref&name=" + name + "&secret=" + secret, f);
	},
	setFolderPreferences: function(name, secret, a, b) 
	{
		this.request("action=setfolderpref&name=" + name + "&secret=" + secret + a, b);
	},
	getHosts: function(n, s, f) 
	{
		var name = encodeURIComponent(n);
		var secret = encodeURIComponent(s);

		this.request("action=getknownhosts&name=" + name + "&secret=" + secret, f);
	},
	addHost: function(n, s, addr, port, f)
	{
		var name = encodeURIComponent(n);
		var secret = encodeURIComponent(s);

		this.request("action=addknownhosts&name=" + name + "&secret=" + secret + "&addr=" + addr + "&port=" + port, f);
	},
	removeHost: function(n, s, index, f)
	{
		var name = encodeURIComponent(n);
		var secret = encodeURIComponent(s);

		this.request("action=removeknownhosts&name=" + name + "&secret=" + secret + "&index=" + index, f);
	},
	updateSecret: function(n, s, newsecret, f)
	{
		var name = encodeURIComponent(n);
		var secret = encodeURIComponent(s);

		this.request("action=updatesecret&name=" + name + "&secret=" + secret + "&newsecret=" + newsecret, f);
	},
	generateInvite: function(n, s, f)
	{
		var name = encodeURIComponent(n);
		var secret = encodeURIComponent(s);

		this.request("action=generateinvite&name=" + name + "&secret=" + secret, f);
	},
	generateROInvite: function(n, s, f)
	{
		var name = encodeURIComponent(n);
		var secret = encodeURIComponent(s);

		this.request("action=generateroinvite&name=" + name + "&secret=" + secret, f);
	},
	licenseAccept: function(f) 
	{
		this.request("action=accept", f);
	},
	licenseCancel: function(f) 
	{
		this.request("action=cancel", f);
	},
	needLicense: function(f) 
	{
		this.request("action=license", f);
	},
};
