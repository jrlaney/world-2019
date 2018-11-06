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

function tagCheckboxDropdownFilter($filter, $tag, dataPathId) {
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
	setTimeout(function () {
		$filter.find('.jplist-dd-panel').removeClass('changed');
	}, 1000);
}

function tagFilterInit() {

	$('.program-tag').click(function () {
		tagCheckboxDropdownFilter($('#program-filter'), $(this), '');
	});
	$('.role-tag').click(function () {
		tagCheckboxDropdownFilter($('#role-filter'), $(this), '');
	});
	$('.topic-tag').click(function () {
		tagCheckboxDropdownFilter($('#topic-filter'), $(this), '');
	});
}
//http://dev.microstrategy.com/api/GetAirTableData
//https://www.microstrategy.com/api/GetAirTableData
$('document').ready(function () {
	//Grabbing API Information
	$.get("https://www.microstrategy.com/api/GetAirTableData", function (data) {
		//Creating empty array variables for each of the filtering options
		var program = [];
		var role = [];
		var topic = [];
		//Looping through each data point from airtable and creating the cards
		$.each(data, function (key, value) {
			var tags = "";
			if (value.Program != null) {
				$.each(value.Program.toString().split(","), function (i, program) {
					tags += "<span class=\"text-block program-tag " + classifyText(program) + "\">" + program + "</span>"
				});
			}
			if (value.RolePersona != null) {
				$.each(value.RolePersona.toString().split(","), function (i, rolePersona) {
					tags += "<span class=\"text-block role-tag " + classifyText(rolePersona) + "\">" + rolePersona + "</span>"
				});
			}
			if (value.Topic != null) {
				$.each(value.Topic.toString().split(","), function (i, topic) {
					tags += "<span class=\"text-block topic-tag " + classifyText(topic) + "\">" + topic + "</span>"
				});
			}
			if (value.Title != null && value.Publish)
			{
				$(".session-browse .row").append("" +
					"<article class=\"grid-item agenda-list\">" +
					"<h3 class=\"session-title\">" + value.Title + "</h3>" +
					"<h4 class=\"session-speaker hide\">" + ((value.Speaker != null) ? value.Speaker : "") + "</h4>" +
					"<p class=\"session-type hide\">" + value.SessionType + "</p>" +
					"<div class=\"session-details hide\">" +
					"<p class=\"session-description\">" + ((value.MarCommReviewAbstract != null) ? ((value.MarCommReviewAbstract.length > 100) ? (value.MarCommReviewAbstract.substring(0, 1000) + "...") : value.MarCommReviewAbstract) : "") + "</p>" +
					"</div>" +
					"<div class=\"text-block-group tiny tags\">" +
					"<span class=\"tag-heading\">Tags:</span>" +
					tags + "</div>" +
					"<div class='add-to-agenda hide'>+ to my agenda</div>" +
					"<span class=\"details-expand\">" + 'See Details' + "</span>" +
					"</article>");

				if (value.Program != null) {
					$.each(value.Program,
						function (k, v) {
							if (program.indexOf(v) === -1)
								program.push(v);
						});
				}
				if (value.RolePersona != null) {
					$.each(value.RolePersona,
						function (k, v) {
							if (role.indexOf(v) === -1)
								role.push(v);
						});
				}
				if (value.Topic != null) {
					$.each(value.Topic,
						function (k, v) {
							if (topic.indexOf(v) === -1)
								topic.push(v);
						});
				}

			}
		});

		// Second snippet starts here
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
			panelPath: '#filter-box',
			effect: 'fade',
			redrawCallback: function () {
				tagFilterInit();
			}
		});
	}); //end of api pull
	
	$('#filter-btn').click(function (event) {
		event.preventDefault();
		$('#filter-box').slideToggle('slow');
	});
	$('#list-view-btn').click(function (e) {
		e.preventDefault();
		$.each($('.session-browse .grid-item'), function (key, value) {
			$(value).removeClass('agenda-card col lg-3').addClass('agenda-list');
		});
		$(this).toggleClass('current');
		$('#grid-view-btn').removeClass('current');
	});
	$('#grid-view-btn').click(function (e) {
		e.preventDefault();
		$.each($('.session-browse .agenda-list'), function (key, value) {
			$(value).removeClass('agenda-list').addClass('agenda-card col lg-3');
		});
		$(this).toggleClass('current');
		$('#list-view-btn').removeClass('current');
	});

	// $.each($('.session-details'), function(key, value){
	// 	$(value).addClass('hide');
	// });
	$(document).on('click', '.details-expand', function () {
		var details = $('.session-details');
		$(this).parent('.grid-item').find(details).slideToggle('fast');
		$(this).parent('.grid-item').find(details).toggleClass('hide');
		$(this).text($(this).text() === 'See Details' ? 'Hide Details' : 'See Details');
	});

	$(document).on('click', '.agenda-grid', function () {
		var details = $('#agenda-grid');
		$(details).toggleClass('hide');
		$('#sessions').addClass('hide');
	});

	$(document).on('click', '.sessions', function () {
		var details = $('#agenda-grid');
		$(details).toggleClass('hide');
		$('#sessions').removeClass('hide');
	});
}); //end document.ready