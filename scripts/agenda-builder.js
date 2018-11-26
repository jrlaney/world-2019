<script type="text/javascript">
var allSessions = [];

function getQueryStringParamValue(key)
{
	var url = document.location.href;
	var value = "";

	if (url.indexOf('?') !== -1)
	{
		var queryStrings = url.substr(url.indexOf('?') + 1);

		if (queryStrings.toLowerCase().indexOf(key.toLowerCase() + "=") !== -1)
		{
			var queryString = queryStrings.split("&").find(function (element)
			{
				return element.toLowerCase().split("=")[0] === key.toLowerCase();
			});
			if (typeof queryString !== "undefined")
				value = queryString.substr(queryString.indexOf('=') + 1);
		}
	}
	return value;
}

function classifyText(text)
{
	var returnValue = "";
	if ($.isArray(text))
	{
		$.each($.unique(text), function (key, value)
		{
			returnValue += " " + value.toLowerCase().replace(" ", "").replace(/[^a-z]+/g, '');
		});
	}
	else
	{
		returnValue = text.toLowerCase().replace(" ", "").replace(/[^a-z]+/g, '');
	}
	return returnValue;
}

function tagCheckboxDropdownFilter($filter, $tag, dataPathId)
{
	var dataPath = dataPathId + classifyText($tag.text());
	// update value and trigger change in field
	$filter.find('#' + dataPath).trigger('click');
	$filter.find('.jplist-dd-panel').addClass('changed');

	// move window to focus on field changed
	$('html, body').animate({
		scrollTop: $('#filter-box').offset().top // - $(window).height() / 2
	}, 50);
	// select first pagination page
	$('.pagination').find('button[data-number="0"]').trigger('click');
	// remove changed style after a second
	setTimeout(function ()
	{
		$filter.find('.jplist-dd-panel').removeClass('changed');
	}, 1000);
}

function tagFilterInit()
{
	$('.program-tag').click(function ()
	{
		tagCheckboxDropdownFilter($('#program-filter'), $(this), '');
	});
	$('.role-tag').click(function ()
	{
		tagCheckboxDropdownFilter($('#role-filter'), $(this), '');
	});
	$('.topic-tag').click(function ()
	{
		tagCheckboxDropdownFilter($('#topic-filter'), $(this), '');
	});
}

function GetSessionsFromCookie()
{
	var myAgenda = $.cookie("myAgenda");
	var myArticles = [];
	if (myAgenda !== undefined)
	{
		myArticles = JSON.parse(myAgenda);
		if (typeof myArticles === "string")
			myArticles = JSON.parse(myArticles);
	}
	return myArticles;
}

function populateMyAgendaSessions()
{
	var myArticles = GetSessionsFromCookie();
	$("#my-agenda-list").html("");

	//Looping through each data point from airtable and creating the cards
	$.each(allSessions, function (key, value)
	{
		if (value.Title != null && value.Publish && myArticles.indexOf(value.Id) > -1)
		{
			var tags = "";
			if (value.Program != null)
			{
				$.each(value.Program,
					function (k, v)
					{
						tags += "<span class=\"text-label program-tag " + classifyText(v) + "\">" + v + "</span>";
					});
			}

			if (value.RolePersona != null)
			{
				$.each(value.RolePersona,
					function (k, v)
					{
						tags += "<span class=\"text-label role-tag " + classifyText(v) + "\">" + v + "</span>";
					});
			}
			if (value.Topic != null)
			{
				$.each(value.Topic,
					function (k, v)
					{
						tags += "<span class=\"text-label topic-tag " + classifyText(v) + "\">" + v + "</span>";
					});
			}
			var description = ((value.MarCommReviewAbstract != null) ? ((value.MarCommReviewAbstract.length > 100) ? (value.MarCommReviewAbstract.substring(0, 1000) + "...") : value.MarCommReviewAbstract) : "");
			description = description.replace(/\n/g, '<br />');
			$("#my-agenda-list").append("" +
				"<article class=\"grid-item agenda-list\" id=\"myAgenda-" + value.Id + "\">" +
				"<h3 class=\"session-title\">" + value.Title + "</h3>" +
				"<h4 class=\"session-speaker hide\">" + ((value.Speaker != null) ? value.Speaker : "") + "</h4>" +
				"<p class=\"session-type hide\">" + value.SessionType + "</p>" +
				"<div class=\"session-details hide\">" +
				"<p class=\"session-description\">" + description + "</p>" +
				"</div>" +
				"<div class=\"text-label-group tags\">" +
				"<span class=\"tag-heading\">Tags:</span>" + tags + "</div>" +
				"<div class='add-to-agenda added'><span class=\"plus-icon\"></span><span class=\"txt-add\">Add to</span><span class=\"txt-remove\">Remove from</span> my agenda</div>" +
				"<span class=\"details-expand\">" + 'See Details' + "</span>" +
				"</article>");
		}
	});
}

function updateAddtoMyAgendaButtons()
{
	var myArticles = GetSessionsFromCookie();

	$.each($("#agendaCards article"), function (key, article)
	{
		var id = $(article).attr('id');
		var index = myArticles.indexOf(id);
		if (index === -1)
			$(article).children(".add-to-agenda").removeClass("added");
		else
			$(article).children(".add-to-agenda").addClass("added");
	});
}

function copyURL()
{
	var copyText = document.getElementById("inputURL");
	copyText.select();
	document.execCommand("copy");
}
//end first snippet









//start second snippet

$('document').ready(function ()
{
	var sessions = getQueryStringParamValue("sessions");
	if (sessions.length > 0)
	{
		var myArticles = sessions.replace("[", "").replace("]", "").split("%22").join("").split(",");
		$.cookie("myAgenda", JSON.stringify(myArticles), { path: '/', expires: 7 });
	}
	//Grabbing API Information
	$.get("https://www.microstrategy.com/api/GetAirTableData", function (data)
	{
		allSessions = data;

		//Creating empty array variables for each of the filtering options
		var program = [];
		var role = [];
		var topic = [];
		$.each(allSessions, function (key, value)
		{
			if (value.Title != null && value.Publish)
			{
				var tags = "";
				if (value.Program != null)
				{
					$.each(value.Program,
						function (k, v)
						{
							tags += "<span class=\"text-label program-tag " + classifyText(v) + "\">" + v + "</span>";
							if (program.indexOf(v) === -1)
								program.push(v);
						});
				}
				if (value.RolePersona != null)
				{
					$.each(value.RolePersona,
						function (k, v)
						{
							tags += "<span class=\"text-label role-tag " + classifyText(v) + "\">" + v + "</span>";
							if (role.indexOf(v) === -1)
								role.push(v);
						});
				}
				if (value.Topic != null)
				{
					$.each(value.Topic,
						function (k, v)
						{
							tags += "<span class=\"text-label topic-tag " + classifyText(v) + "\">" + v + "</span>";
							if (topic.indexOf(v) === -1)
								topic.push(v);
						});
				}

				var description = ((value.MarCommReviewAbstract != null) ? ((value.MarCommReviewAbstract.length > 100) ? (value.MarCommReviewAbstract.substring(0, 1000) + "...") : value.MarCommReviewAbstract) : "");
				description = description.replace(/\n/g, '<br />');
				$("#agendaCards").append("" +
					"<article class=\"grid-item agenda-list\" id=\"" + value.Id + "\">" +
					"<h3 class=\"session-title\">" + value.Title + "</h3>" +
					"<h4 class=\"session-speaker hide\">" + ((value.Speaker != null) ? value.Speaker : "") + "</h4>" +
					"<p class=\"session-type hide\">" + value.SessionType + "</p>" +
					"<div class=\"session-details hide\">" +
					"<p class=\"session-description\">" + description + "</p>" +
					"</div>" +
					"<div class=\"text-label-group tags\">" +
					"<span class=\"tag-heading\">Tags:</span>" + tags + "</div>" +
					"<div class='add-to-agenda'><span class=\"plus-icon\"></span><span class=\"txt-add\">Add to</span><span class=\"txt-remove\">Remove from</span> my agenda</div>" +
					"<span class=\"details-expand\">" + 'See Details' + "</span>" +
					"</article>");
			}
		});
		updateAddtoMyAgendaButtons();

		//Sorting items
		program.sort();
		role.sort();
		topic.sort();
		//Adding text dynamically from airtable to each of filter slots
		var p = $('#program-filter > ul');
		$.each(program, function (key, value)
		{
			p.append($("<li></li>").append($("<input>").attr("id", classifyText(value)).attr("data-path", "." + classifyText(value)).attr("type", "checkbox")).append($("<label></label>").attr("for", classifyText(value)).text(value)));
		});
		var r = $('#role-filter > ul');
		$.each(role, function (key, value)
		{
			r.append($("<li></li>").append($("<input>").attr("id", classifyText(value)).attr("data-path", "." + classifyText(value)).attr("type", "checkbox")).append($("<label></label>").attr("for", classifyText(value)).text(value)));
		});
		var t = $('#topic-filter > ul');
		$.each(topic, function (key, value)
		{
			t.append($("<li></li>").append($("<input>").attr("id", classifyText(value)).attr("data-path", "." + classifyText(value)).attr("type", "checkbox")).append($("<label></label>").attr("for", classifyText(value)).text(value)));
		});

		$('#agenda-page').jplist({
			itemsBox: '#agendaCards',
			itemPath: '.grid-item',
			panelPath: '.jp-lists',
			effect: 'fade',
			redrawCallback: function ()
			{
				tagFilterInit();
			}
		});
	}); //end of api pull

	$('#filter-btn').click(function (event)
	{
		event.preventDefault();
		$('#filter-box').slideToggle('slow');
	});

	$('#list-view-btn').click(function (e)
	{
		e.preventDefault();
		$.each($('.session-browse .grid-item'), function (key, value)
		{
			$(value).removeClass('agenda-card col lg-4 xl-3').addClass('agenda-list');
		});
		$(this).toggleClass('current');
		$('#grid-view-btn').removeClass('current');
	});

	$(document).on('click', '.add-to-agenda', function ()
	{
		var classes = $(this).attr("class");
		var article = $(this).parent();
		var id = article.attr('id');
		var myAgendaArticle = id.indexOf("myAgenda-") > -1;
		id = id.replace("myAgenda-", "");
		var myAgenda = $.cookie("myAgenda");
		var myArticles = GetSessionsFromCookie();
		// End of second snippet






		// Third snippet starts here
		if (myAgenda !== undefined)
		{
			var index = myArticles.indexOf(id);
			if (classes.indexOf("added") === -1)
			{
				if (index === -1)
					myArticles.push(id);
				$(this).addClass("added");
			}
			else
			{
				if (index > -1)
					myArticles.splice(index, 1);
				$(this).removeClass("added");
			}
		}
		else
		{
			if (classes.indexOf("added") === -1)
			{
				myArticles.push(id);
				$(this).addClass("added");
			}
			else
				$(this).removeClass("added");
		}
		$.cookie("myAgenda", JSON.stringify(myArticles), { path: '/', expires: 7 });

		if (myAgendaArticle)
			article.fadeOut(1000, function () { $(this).remove(); });
	});


	$('#grid-view-btn').click(function (e)
	{
		e.preventDefault();
		$.each($('.session-browse .agenda-list'), function (key, value)
		{
			$(value).removeClass('agenda-list').addClass('agenda-card col lg-4 xl-3');
		});
		$(this).toggleClass('current');
		$('#list-view-btn').removeClass('current');
	});

	$(document).on('click', '.details-expand', function ()
	{
		var details = $('.session-details');
		$(this).parent('.grid-item').find(details).slideToggle('fast');
		$(this).parent('.grid-item').find(details).toggleClass('hide');
		$(this).text($(this).text() === 'See Details' ? 'Hide Details' : 'See Details');
	});

	$('.tabs-menu .tab-toggle').click(function (event)
	{
		event.preventDefault();
		$(this).addClass('current');
		$(this).siblings().removeClass('current');

		var tab = $(this).attr('href');
		$('.tab-content').not(tab).addClass('hide-tab');
		setTimeout(function ()
		{
			$('.tab-content').not(tab).css('display', 'none');
		}, 200);
		$(tab).removeClass('hide-tab');
		setTimeout(function ()
		{
			$(tab).css('display', 'block');
		}, 400);
		if (tab.indexOf("#my-agenda") > -1)
		{
			populateMyAgendaSessions();
			$("#shareURL").hide();
		}
		else if (tab.indexOf("#sessions") > -1)
			updateAddtoMyAgendaButtons();
	});//tab toogle script

	$("#print-agenda").click(function ()
	{
		var html = "<html>";
		html += "<head>";
		html += "<link rel='Stylesheet' type='text/css' href='http://www.microstrategy.com/Strategy/media/external-assets/events-support/world-2019/world2019-print-agenda-sheet.css' />";
		html += "</head>";
		html += "<body>";
		html += "<div class='logo-zone'><img class='logo-img' src='https://www.microstrategy.com/Strategy/media/external-assets/events-support/world-2019/world2019-logo.svg'><h2>MicroStrategy World 2019<span>February 4-6 2019</span><span>Phoenix, Arizona</span></h2><h3>http://events.microstrategy.com/world2019</h3></div>";
		html += "<h1 class='agenda-headline'>My Agenda</h1><div class='agenda-body'><h5 class='text-uppercase text-bold program-label'>Theme</h5><h5 class='text-uppercase text-bold topic-label'>Topic</h5><h5 class='text-uppercase text-bold role-label'>Role</h5>";
		html += $("#my-agenda-list").html();
		html += "</div>";
		html += "</body>";
		html += "</html>";

		var printWin = window.open('', '', 'left=0,top=0,toolbar=0,scrollbars=0,status=0');
		printWin.document.write(html);
		printWin.document.close();
		printWin.focus();
		setTimeout(function ()
		{
			printWin.print();
		}, 500);
		setTimeout(function ()
		{
			printWin.close();
		}, 500);
	});

	$("#share-agenda").click(function ()
	{
		var shareURL = window.location.href;
		var cookieValue = $.cookie("myAgenda").replace("[", "").replace("]", "").split("%22").join("").split("\"").join("");
		if (shareURL.indexOf("?") > -1)
			shareURL = shareURL + "&sessions=" + cookieValue;
		else
			shareURL = shareURL + "?sessions=" + cookieValue;

		$("#inputURL").val(shareURL);
		$("#shareURL").show();
	});

	$("#buttonCopy").click(function ()
	{
		$(this).text("Copied!");

		setTimeout(function ()
		{
			$("#buttonCopy").text("Copy");
		}, 5000);
	});
});
</script>