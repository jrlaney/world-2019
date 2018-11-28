<script type="text/javascript">
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
	$('.program-tag').click(function () {
		tagFilterListItems($('#program-filter'), $(this), '');
	});
	$('.role-tag').click(function () {
		tagFilterListItems($('#role-filter'), $(this), '');
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

function populateMyAgendaSessions() {
	var myArticles = GetSessionsFromCookie();
	$("#my-agenda-list").html("");

	//Looping through each data point from airtable and creating the cards
	$.each(allSessions, function (key, value) {
		if (value.Title != null && value.Publish && myArticles.indexOf(value.Id) > -1) {
			var tags = "";
			if (value.Program != null) {
				$.each(value.Program,
					function (k, v) {
						tags += "<span class=\"text-label program-tag " + classifyText(v) + "\">" + v + "</span>";
					});
			}

			if (value.RolePersona != null) {
				$.each(value.RolePersona,
					function (k, v) {
						tags += "<span class=\"text-label role-tag " + classifyText(v) + "\">" + v + "</span>";
					});
			}
			if (value.Topic != null) {
				$.each(value.Topic,
					function (k, v) {
						tags += "<span class=\"text-label topic-tag " + classifyText(v) + "\">" + v + "</span>";
					});
			}
			var description = ((value.MarCommReviewAbstract != null) ? ((value.MarCommReviewAbstract.length > 1000) ? (value.MarCommReviewAbstract.substring(0, 1000) + "...") : value.MarCommReviewAbstract) : "");
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
//end first snippet

//start second snippet
$('document').ready(function () {
	var sessions = getQueryStringParamValue("sessions");
	if (sessions.length > 0) {
		var myArticles = sessions.replace("[", "").replace("]", "").split("%22").join("").split(",");
		$.cookie("myAgenda", JSON.stringify(myArticles), {
			path: '/',
			expires: 7
		});
	}
	//Grabbing API Information
	$.get("https://www.microstrategy.com/api/GetAirTableData", function (data) {
		allSessions = data;

		//Creating empty array variables for each of the filtering options
		var program = [];
		var role = [];
		var topic = [];
		$.each(allSessions, function (key, value) {
			if (value.Title != null && value.Publish) {
				var tags = "";
				if (value.Program != null) {
					$.each(value.Program,
						function (k, v) {
							tags += "<span class=\"text-label program-tag " + classifyText(v) + "\">" + v + "</span>";
							if (program.indexOf(v) === -1)
								program.push(v);
						});
				}
				if (value.RolePersona != null) {
					$.each(value.RolePersona,
						function (k, v) {
							tags += "<span class=\"text-label role-tag " + classifyText(v) + "\">" + v + "</span>";
							if (role.indexOf(v) === -1)
								role.push(v);
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

				var description = ((value.MarCommReviewAbstract != null) ? ((value.MarCommReviewAbstract.length > 1000) ? (value.MarCommReviewAbstract.substring(0, 1000) + "...") : value.MarCommReviewAbstract) : "");
				description = description.replace(/\n/g, '<br />');
				$("#agendaCards").append("" +
					"<article class=\"grid-item agenda-list\" id=\"" + value.Id + "\">" +
					"<h3 class=\"session-title\">" + value.Title + "</h3>" +
					"<h4 class=\"session-speaker hide\">" + ((value.Speaker != null) ? value.Speaker : "") + "</h4>" +
					"<p class=\"session-type hide\">" + value.SessionType + "</p>" +
					"<p class=\"session-start-time hide\">" + value.SessionStartDateTime + "</p>" +
					"<div class=\"session-details hide\">" +
					"<p class=\"session-description\">" + description + "</p>" +
					"</div>" +
					"<div class=\"text-label-group tags\">" +
					"<span class=\"tag-heading\">Tags:</span>" + tags + "</div>" +
					//"<div class='add-to-agenda'><span class=\"plus-icon\"></span><span class=\"txt-add\">Add to</span><span class=\"txt-remove\">Remove from</span> my agenda</div>" +
					"<span class=\"details-expand\">" + 'See Details' + "</span>" +
					"</article>");
			}
		});

		//Sorting items
		program.sort();
		role.sort();
		topic.sort();
		//Adding text dynamically from airtable to each of filter slots
		var p = $('#program-filter > ul');
		$.each(program, function (key, value) {
			p.append($("<li></li>").append($("<input>").attr("id", classifyText(value)).attr("data-path", "." + classifyText(value)).attr("type", "checkbox")).append($("<label></label>").attr("for", classifyText(value)).text(value)));
		});
		var r = $('#role-filter > ul');
		$.each(role, function (key, value) {
			r.append($("<li></li>").append($("<input>").attr("id", classifyText(value)).attr("data-path", "." + classifyText(value)).attr("type", "checkbox")).append($("<label></label>").attr("for", classifyText(value)).text(value)));
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

	$(function () {

		var $sidebar = $("#filter-box"),
			$window = $(window),
			offset = $sidebar.offset(),
			topPadding = 0;

		$window.scroll(function () {
			if ($window.scrollTop() > offset.top) {
				$sidebar.stop().animate({
					marginTop: $window.scrollTop() - offset.top
				});
			} else {
				$sidebar.stop().animate({
					marginTop: 0
				});
			}
		});
	});
// End of second snippet

// Third snippet starts here
	$(document).on('click', '.details-expand', function () {
		var details = $('.session-details');
		$(this).parent('.grid-item').find(details).slideToggle('fast');
		$(this).parent('.grid-item').find(details).toggleClass('hide');
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
</script>