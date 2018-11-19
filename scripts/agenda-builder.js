<script type="text/javascript">
var allSessions = [];
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

function populateMyAgendaSessions()
{
	var myAgenda = $.cookie("myAgenda");
	var myArticles = [];
	if (myAgenda !== undefined)
		myArticles = JSON.parse(myAgenda);
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
	var myAgenda = $.cookie("myAgenda");
	var myArticles = [];
	if (myAgenda !== undefined)
	{
		myArticles = JSON.parse(myAgenda);
		if (typeof myArticles === "string")
			myArticles = JSON.parse(myArticles);
	}
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

$('document').ready(function ()
{
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

		// End of first snippet






		// Second snippet starts here
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
			panelPath: '#filter-box',
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
		//var myAgendaArticle = id.indexOf("myAgenda-") > -1;
		id = id.replace("myAgenda-", "");
		var myAgenda = $.cookie("myAgenda");
		var myArticles = [];

		if (myAgenda !== undefined)
		{
			myArticles = JSON.parse(myAgenda);
			if (typeof myArticles === "string")
				myArticles = JSON.parse(myArticles);
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
			populateMyAgendaSessions();
		else if (tab.indexOf("#sessions") > -1)
			updateAddtoMyAgendaButtons();
	});//tab toogle script

	$("#print-agenda").click(function ()
	{
		var html = "<html>";
		html += "<head>";
		html += "<style type='text/css'>#content div.ads, #content img {display:none}</style>";
		html += "<link rel='Stylesheet' type='text/css' href='css/print.css' media='print' />";
		html += "</head>";
		html += "<body>";
		html += $("#my-agenda-list").html();
		html += "</body>";
		html += "</html>";

		var printWin = window.open('', '', 'left=0,top=0,toolbar=0,scrollbars=0,status  =0');
		printWin.document.write(html);
		printWin.document.close();
		printWin.focus();
		printWin.print();
		printWin.close();
	});
});
</script >
