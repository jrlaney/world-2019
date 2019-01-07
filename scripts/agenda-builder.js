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
		return false;
	});
	$('.theme-tag').click(function () {
		tagFilterListItems($('#theme-filter'), $(this), '');
		return false;
	});
	$('.topic-tag').click(function () {
		tagFilterListItems($('#topic-filter'), $(this), '');
		return false;
	});
	$('.startDate-tag').click(function () {
		tagFilterListItems($('#date-filter'), $(this), '');
		return false;
	});
	$('.startTime-tag').click(function () {
		tagFilterListItems($('#time-filter'), $(this), $(this).text().replace(":", "").replace(" AM", "").replace(" PM", ""));
		return false;
	});
}

function dynamicSort(firstProperty, secondProperty) {
	var firstSortOrder = 1;
	if (firstProperty[0] === "-") {
		firstSortOrder = -1;
		firstProperty = firstProperty.substr(1);
	}

	var secondSortOrder = 1;
	if (secondProperty[0] === "-") {
		secondSortOrder = -1;
		secondProperty = secondProperty.substr(1);
	}

	return function (a, b) {
		var returnValue = 0;
		returnValue = sortComparision(a[firstProperty], b[firstProperty], firstSortOrder);

		if (returnValue === 0) {
			returnValue = sortComparision(a[secondProperty], b[secondProperty], secondSortOrder);
		}

		return returnValue;
	};
}

function sortComparision(aProperty, bProperty, sortOrder) {
	if (aProperty != null && bProperty != null) {
		if (sortOrder === -1) {
			return bProperty.localeCompare(aProperty, undefined, {
				numeric: true,
				sensitivity: 'base'
			});
		} else {
			return aProperty.localeCompare(bProperty, undefined, {
				numeric: true,
				sensitivity: 'base'
			});
		}
	} else if (aProperty != null && bProperty == null) {
		return sortOrder * -1;
	} else if (aProperty == null && bProperty != null) {
		return sortOrder;
	} else
		return 0;
}
$('document').ready(function () {
	//Grabbing API Information
	$.get("https://www.microstrategy.com/api/GetAirTableData", function (data) {
		allSessions = data;
		allSessions.sort(dynamicSort("StartDateTime", "Title"));
		var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

		//Creating empty array variables for each of the filtering options
		var role = [];
		var sessionType = [];
		var theme = [];
		var topic = [];
		var date = [];
		var time = [];
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
				if (value.Themes != null) {
					$.each(value.Themes,
						function (k, v) {
							tags += "<span class=\"text-label theme-tag " + classifyText(v) + "\">" + v + "</span>";
							if (theme.indexOf(v) === -1)
								theme.push(v);
						});
				}
				//end first snippet

				//start second snippet
				if (value.Topic != null) {
					$.each(value.Topic,
						function (k, v) {
							tags += "<span class=\"text-label topic-tag " + classifyText(v) + "\">" + v + "</span>";
							if (topic.indexOf(v) === -1)
								topic.push(v);
						});
				}
				if (value.StartDateTime != null) {
					var startDateTime = new Date(value.StartDateTime);
					tags += "<span class=\"text-label startDate-tag " + classifyText(days[startDateTime.getDay()]) + "\">" + days[startDateTime.getDay()] + "</span>";
					if (date.indexOf(days[startDateTime.getDay()]) === -1)
						date.push(days[startDateTime.getDay()]);

					tags += "<span class=\"text-label startTime-tag " + startDateTime.getHours() + startDateTime.getMinutes() + "\">" + startDateTime.toLocaleString('en-US', {
						hour: 'numeric',
						minute: 'numeric',
						hour12: true
					}).replace(/[^a-zA-Z0-9: ]+/g, '') + "</span>";
					if (time.indexOf(startDateTime.toLocaleString('en-US', {
							hour: 'numeric',
							minute: 'numeric',
							hour12: true
						})) === -1)
						time.push(startDateTime.toLocaleString('en-US', {
							hour: 'numeric',
							minute: 'numeric',
							hour12: true
						}));
				}

				var description = ((value.MarCommReviewAbstract != null) ? ((value.MarCommReviewAbstract.length > 2000) ? (value.MarCommReviewAbstract.substring(0, 2000) + "...") : value.MarCommReviewAbstract) : "");
				description = description.replace(/\n/g, '<br />');

				var startTime = "TBD";
				if (value.StartDateTime != null)
					startTime = new Date(value.StartDateTime).toLocaleDateString("en-US", {
						weekday: 'long',
						month: 'long',
						day: 'numeric',
						hour: 'numeric',
						minute: '2-digit'
					});
				var endTime = "TBD";
				if (value.EndDateTime != null)
					endTime = new Date(value.EndDateTime).toLocaleTimeString("en-US", {
						hour: 'numeric',
						minute: '2-digit'
					});

				$("#agendaCards").append("" +
					"<article class=\"grid-item agenda-list\" id=\"" + value.Id + "\">" +
					"<h3 class=\"session-title\">" + value.Title + "</h3>" +
					"<h4 class=\"session-speaker hide\">" + ((value.Speaker != null) ? value.Speaker : "") + "</h4>" +
					"<p class=\"session-type hide\">" + value.SessionType + "</p>" +
					"<p class=\"session-start-time\">" + startTime + " - " + endTime + "</p>" +
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
		time.sort();
		sessionType.sort();
		theme.sort();
		topic.sort();
		role.sort();

		var distinctTimes = [];
		$.each(time, function (key, value) {
			distinctTimes.push({
				ampm: value.split(" ")[1],
				hrmin: value.split(" ")[0]
			});
		});
		distinctTimes.sort(dynamicSort("ampm", "hrmin"));
		//Adding text dynamically from airtable to each of filter slots
		var d = $('#date-filter > ul');
		$.each(date, function (key, value) {
			d.append($("<li></li>").append($("<input>").attr("id", classifyText(value)).attr("data-path", "." + classifyText(value)).attr("type", "checkbox")).append($("<label></label>").attr("for", classifyText(value)).text(value)));
		});
		var tm = $('#time-filter > ul');
		$.each(distinctTimes, function (key, value) {
			var temptime = new Date();
			temptime.setHours(((value.hrmin.split(":")[0]).split('').filter(function (v) {
				return !isNaN(v);
			})).join(''), ((value.hrmin.split(":")[1]).split('').filter(function (v) {
				return !isNaN(v);
			})).join(''), "0");
			if (value.ampm.indexOf("PM") > -1)
				temptime.setHours(temptime.getHours() + 12);

			var timeString = temptime.toLocaleString('en-US', {
				hour: 'numeric',
				minute: 'numeric',
				hour12: true
			});
			tm.append($("<li></li>").append($("<input>").attr("id", timeString.replace(/[^a-zA-Z0-9]+/g, '').toLowerCase()).attr("data-path", "." + temptime.getHours() + temptime.getMinutes()).attr("type", "checkbox")).append($("<label></label>").attr("for", temptime.getHours()).text(timeString)));
		});

		var s = $('#session-filter > ul');
		$.each(sessionType, function (key, value) {
			s.append($("<li></li>").append($("<input>").attr("id", classifyText(value)).attr("data-path", "." + classifyText(value)).attr("type", "checkbox")).append($("<label></label>").attr("for", classifyText(value)).text(value)));
		});
		var th = $('#theme-filter > ul');
		$.each(theme, function (key, value) {
			th.append($("<li></li>").append($("<input>").attr("id", classifyText(value)).attr("data-path", "." + classifyText(value)).attr("type", "checkbox")).append($("<label></label>").attr("for", classifyText(value)).text(value)));
		});
		// End of second snippet

		// Third snippet starts here
		var t = $('#topic-filter > ul');
		$.each(topic, function (key, value) {
			t.append($("<li></li>").append($("<input>").attr("id", classifyText(value)).attr("data-path", "." + classifyText(value)).attr("type", "checkbox")).append($("<label></label>").attr("for", classifyText(value)).text(value)));
		});
		var r = $('#role-filter > ul');
		$.each(role, function (key, value) {
			r.append($("<li></li>").append($("<input>").attr("id", classifyText(value)).attr("data-path", "." + classifyText(value)).attr("type", "checkbox")).append($("<label></label>").attr("for", classifyText(value)).text(value)));
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

	$("#filter-box").hide();
	$('#date-filter > ul').hide();
	$('#time-filter > ul').hide();
	$('#session-filter > ul').hide();
	$('#theme-filter > ul').hide();
	$('#topic-filter > ul').hide();
	$('#role-filter > ul').hide();

	$('.date-label').click(function (event) {
		event.preventDefault();
		$(this).toggleClass('menu-open');
		$('#filter-box #date-filter > ul').slideToggle('fast');
	});
	$('.time-label').click(function (event) {
		event.preventDefault();
		$(this).toggleClass('menu-open');
		$('#time-filter > ul').slideToggle('fast');
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
	$('.topic-label').click(function (event) {
		event.preventDefault();
		$(this).toggleClass('menu-open');
		$('#topic-filter > ul').slideToggle('fast');
	});
	$('.role-label').click(function (event) {
		event.preventDefault();
		$(this).toggleClass('menu-open');
		$('#role-filter > ul').slideToggle('fast');
	});

	$(document).on('click', '.grid-item', function () {
		$(this).find('.session-details').slideToggle('fast');
		$(this).find('.session-details').toggleClass('hide');
		$(this).find('.session-speaker').toggleClass('hide');
		$(this).find('.session-type').toggleClass('hide');
		var details = $(this).find('.details-expand').text();
		$(this).find('.details-expand').text(details === 'See Details' ? 'Hide Details' : 'See Details');
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