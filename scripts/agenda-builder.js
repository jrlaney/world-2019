<script type="text/javascript" src="https://www.microstrategy.com/CMSTemplates/microstrategy/bower_components/jquery.cookie/jquery.cookie.js"></script>
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

function populateSessions(isMyAgenda)
{

	var myAgenda = $.cookie("myAgenda");
	var myArticles = [];
	if (myAgenda !== undefined)
		myArticles = JSON.parse(myAgenda);
	if (isMyAgenda)
		$("#my-agenda-list").html("");

	//Looping through each data point from airtable and creating the cards
	$.each(allSessions, function (key, value)
	{
		if (value.Title != null && value.Publish && (!isMyAgenda || myArticles.indexOf(value.Id) > -1))
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
			var index = myArticles.indexOf(value.Id);
			var sessionsHolder = (isMyAgenda ? $("#my-agenda-list") : $(".session-browse .row"));
			sessionsHolder.append("" +
				"<article class=\"grid-item agenda-list\" id=\"" + (isMyAgenda ? "myAgenda-" : "") + value.Id + "\">" +
				"<h3 class=\"session-title\">" + value.Title + "</h3>" +
				"<h4 class=\"session-speaker hide\">" + ((value.Speaker != null) ? value.Speaker : "") + "</h4>" +
				"<p class=\"session-type hide\">" + value.SessionType + "</p>" +
				"<div class=\"session-details hide\">" +
				"<p class=\"session-description\">" + description + "</p>" +
				"</div>" +
				"<div class=\"text-label-group tags\">" +
				"<span class=\"tag-heading\">Tags:</span>" + tags + "</div>" +
				"<div class='add-to-agenda " + ((index > -1) ? 'added' : '') + "'><span class=\"plus-icon\"></span><span class=\"txt-add\">Add to</span><span class=\"txt-remove\">Remove from</span> my agenda</div>" +
				"<span class=\"details-expand\">" + 'See Details' + "</span>" +
				"</article>");
		}
	});

}

$('document').ready(function ()
{
	//Grabbing API Information
	$.get("https://www.microstrategy.com/api/GetAirTableData", function (data)
	{
		allSessions = data;
		populateSessions(false);

		//Creating empty array variables for each of the filtering options
		var program = [];
		var role = [];
		var topic = [];

		$.each(allSessions, function (key, value)
		{
			if (value.Program != null)
			{
				$.each(value.Program,
					function (k, v)
					{
						if (program.indexOf(v) === -1)
							program.push(v);
					});
			}
			if (value.RolePersona != null)
			{
				$.each(value.RolePersona,
					function (k, v)
					{
						if (role.indexOf(v) === -1)
							role.push(v);
					});
			}
			if (value.Topic != null)
			{
				$.each(value.Topic,
					function (k, v)
					{
						if (topic.indexOf(v) === -1)
							topic.push(v);
					});
			}
		});
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

		//for the tab contents
		var tab = $(this).attr('href');
		//add the hiding animation for everything but the current tab
		$('.tab-content').not(tab).addClass('hide-tab');
		//delay the display setting till after the animation plays
		setTimeout(function ()
		{
			$('.tab-content').not(tab).css('display', 'none');
		}, 200);
		//remove the hiding class if its on the current tab
		$(tab).removeClass('hide-tab');
		populateSessions(true);
		//have the current tab display after the hiding animation plays for the previous tab
		setTimeout(function ()
		{
			$(tab).css('display', 'block');
		}, 400);
	});//tab toogle script
}); //end document.ready
</script >
