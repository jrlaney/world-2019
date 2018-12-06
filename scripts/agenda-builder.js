var allSessions = [];

function getQueryStringParamValue(key) {
	var url = document.location.href;
	var value = "";

	if (url.indexOf('?') !== -1) {
		var queryStrings = url.substr(url.indexOf('?') + 1);

		if (queryStrings.toLowerCase().indexOf(key.toLowerCase() + "=") !== -1) {
			var queryString = queryStrings.split("&").find(function (element) {
				return element.toLowerCase().split("=")[0] === key.toLowerCase();
			});
			if (typeof queryString !== "undefined")
				value = queryString.substr(queryString.indexOf('=') + 1);
		}
	}
	return value;
}

function classifyText(text) {
	var returnValue = "";
	if ($.isArray(text)) {
		$.each($.unique(text), function (key, value) {
			returnValue += " " + value.toLowerCase().replace(" ", "").replace(/[^a-z]+/g, '');
		});
	} else {
		returnValue = text.toLowerCase().replace(" ", "").replace(/[^a-z]+/g, '');
	}
	return returnValue;
}

function tagFilterListItems($filter, $tag, dataPathId) {
	var dataPath = dataPathId + classifyText($tag.text());
	// update value and trigger change in field
	$filter.find('#' + dataPath).trigger('click');
	$filter.find('jplist-checkbox-path-filter').addClass('changed');

	// move window to focus on field changed
	$('html, body').animate({
		scrollTop: $('#filter-box').offset().top // - $(window).height() / 2
	}, 50);
	// select first pagination page
	$('.pagination').find('button[data-number="0"]').trigger('click');
	// remove changed style after a second
	setTimeout(function () {
		$filter.find('jplist-checkbox-path-filter').removeClass('changed');
	}, 1000);
}

function tagFilterInit() {
	$('.role-tag').click(function () {
		tagFilterListItems($('#role-filter'), $(this), '');
	});
	$('.theme-tag').click(function ()
	{
		tagFilterListItems($('#theme-filter'), $(this), '');
	});
	$('.topic-tag').click(function () {
		tagFilterListItems($('#topic-filter'), $(this), '');
	});
}

function GetSessionsFromCookie() {
	var myAgenda = $.cookie("myAgenda");
	var myArticles = [];
	if (myAgenda !== undefined) {
		myArticles = JSON.parse(myAgenda);
		if (typeof myArticles === "string")
			myArticles = JSON.parse(myArticles);
	}
	return myArticles;
}
//end first snippet

//start second snippet
$('document').ready(function () {
	//Grabbing API Information
	$.get("https://www.microstrategy.com/api/GetAirTableData", function (data) {
		allSessions = data;

		//Creating empty array variables for each of the filtering options
		var role = [];
		var sessionType = [];
		var theme = [];
		var topic = [];
		$.each(allSessions, function (key, value) {
			if (value.Title != null && value.Publish) {
				var tags = "";
				if (value.RolePersona != null) {
					$.each(value.RolePersona,
						function (k, v) {
							tags += "<span class=\"text-label role-tag " + classifyText(v) + "\">" + v + "</span>";
							if (role.indexOf(v) === -1)
								role.push(v);
						});
				}
				if (value.SessionType != null) {
					tags += "<span class=\"text-label sessiontype-tag " + classifyText(value.SessionType) + "\">" + value.SessionType + "</span>";
					if (sessionType.indexOf(value.SessionType) === -1)
						sessionType.push(value.SessionType);
				}
				if (value.Themes != null)
				{
					$.each(value.Themes,
						function (k, v)
						{
							tags += "<span class=\"text-label theme-tag " + classifyText(v) + "\">" + v + "</span>";
							if (theme.indexOf(v) === -1)
								theme.push(v);
						});
				}
				if (value.Topic != null) {
					$.each(value.Topic,
						function (k, v) {
							tags += "<span class=\"text-label topic-tag " + classifyText(v) + "\">" + v + "</span>";
							if (topic.indexOf(v) === -1)
								topic.push(v);
						});
				}

				var description = ((value.MarCommReviewAbstract != null) ? ((value.MarCommReviewAbstract.length > 2000) ? (value.MarCommReviewAbstract.substring(0, 2000) + "...") : value.MarCommReviewAbstract) : "");
				description = description.replace(/\n/g, '<br />');

				var startTime = new Date(value.StartDateTime).toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' });
				var endTime = new Date(value.EndDateTime).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' });

				$("#agendaCards").append("" +
					"<article class=\"grid-item agenda-list\" id=\"" + value.Id + "\">" +
					"<h3 class=\"session-title\">" + value.Title + "</h3>" +
					"<h4 class=\"session-speaker hide\">" + ((value.Speaker != null) ? value.Speaker : "") + "</h4>" +
					"<p class=\"session-type hide\">" + value.SessionType + "</p>" +
					"<p class=\"session-start-time hide\">" + startTime + " - " + endTime + "</p>" +
					"<div class=\"session-details hide\">" +
					"<p class=\"session-description\">" + description + "</p>" +
					"</div>" +
					"<div class=\"text-label-group tags\">" +
					"<span class=\"tag-heading\">Tags:</span>" + tags + "</div>" +
					"<span class=\"details-expand\">" + 'See Details' + "</span>" +
					"</article>");
			}
		});

		//Sorting items
		role.sort();
		sessionType.sort();
		theme.sort();
		topic.sort();
		//Adding text dynamically from airtable to each of filter slots
		var r = $('#role-filter > ul');
		$.each(role, function (key, value) {
			r.append($("<li></li>").append($("<input>").attr("id", classifyText(value)).attr("data-path", "." + classifyText(value)).attr("type", "checkbox")).append($("<label></label>").attr("for", classifyText(value)).text(value)));
		});
		var s = $('#session-filter > ul');
		$.each(sessionType, function (key, value) {
			s.append($("<li></li>").append($("<input>").attr("id", classifyText(value)).attr("data-path", "." + classifyText(value)).attr("type", "checkbox")).append($("<label></label>").attr("for", classifyText(value)).text(value)));
		});
		// End of second snippet
		
		// Third snippet starts here
		var th = $('#theme-filter > ul');
		$.each(theme, function (key, value)
		{
			th.append($("<li></li>").append($("<input>").attr("id", classifyText(value)).attr("data-path", "." + classifyText(value)).attr("type", "checkbox")).append($("<label></label>").attr("for", classifyText(value)).text(value)));
		});
		var t = $('#topic-filter > ul');
		$.each(topic, function (key, value) {
			t.append($("<li></li>").append($("<input>").attr("id", classifyText(value)).attr("data-path", "." + classifyText(value)).attr("type", "checkbox")).append($("<label></label>").attr("for", classifyText(value)).text(value)));
		});

		$('#agenda-page').jplist({
			itemsBox: '#agendaCards',
			itemPath: '.grid-item',
			panelPath: '.jp-lists',
			effect: 'fade',
			redrawCallback: function () {
				tagFilterInit();
			}
		});
	}); //end of api pull

	$('#filter-btn').click(function (event) {
		event.preventDefault();
		$('#filter-box').animate({
			width: 'toggle'
		});
	});

	$('#role-filter > ul').hide();
	$('#session-filter > ul').hide();
	$('#theme-filter > ul').hide();
	$('#topic-filter > ul').hide();

	$('.role-label').click(function (event)
	{
		event.preventDefault();
		$(this).toggleClass('menu-open');
		$('#role-filter > ul').slideToggle('fast');
	});
	$('.session-label').click(function (event) {
		event.preventDefault();
		$(this).toggleClass('menu-open');
		$('#session-filter > ul').slideToggle('fast');
	});
	$('.theme-label').click(function (event) {
		event.preventDefault();
		$(this).toggleClass('menu-open');
		$('#theme-filter > ul').slideToggle('fast');
	});
	$('.topic-label').click(function (event)
	{
		event.preventDefault();
		$(this).toggleClass('menu-open');
		$('#topic-filter > ul').slideToggle('fast');
	});

	$("#filter-box").hide();

	$(document).on('click', '.details-expand', function () {
		var details = $('.session-details');
		$(this).parent('.grid-item').find(details).slideToggle('fast');
		$(this).parent('.grid-item').find(details).toggleClass('hide');
		$(this).parent('.grid-item').find('.session-speaker').toggleClass('hide');
		$(this).parent('.grid-item').find('.session-type').toggleClass('hide');
		$(this).parent('.grid-item').find('.session-start-time').toggleClass('hide');
		$(this).text($(this).text() === 'See Details' ? 'Hide Details' : 'See Details');
	});

	$('.tabs-menu .tab-toggle').click(function (event) {
		event.preventDefault();
		$(this).addClass('current');
		$(this).siblings().removeClass('current');

		var tab = $(this).attr('href');
		$('.tab-content').not(tab).addClass('hide-tab');
		setTimeout(function () {
			$('.tab-content').not(tab).css('display', 'none');
		}, 200);
		$(tab).removeClass('hide-tab');
		setTimeout(function () {
			$(tab).css('display', 'block');
		}, 400);
	}); //tab toogle script
});