<script type="text/javascript">
function classifyText(text)
{
	var returnValue = "";
	if ($.isArray(text))
	{
		$.each($.unique(text), function (key, value)
		{
			returnValue += " " + value.toLowerCase().replace(" ", "").replace(/[^a-z]+/g, '');
		});
	} else
	{
		returnValue = text.toLowerCase().replace(" ", "").replace(/[^a-z]+/g, '');
	}
	return returnValue;
}

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

$('document').ready(function ()
{
	//Grabbing API Information
	$.get("https://www.microstrategy.com/api/GetAirTableData", function (data)
	{
		//Creating empty array variables for each of the filtering options
		var role = [];
		//Looping through each data point from airtable and creating the cards
		$.each(data, function (key, value)
		{
			var tags = "";
			if (value.RolePersona != null)
			{
				$.each(value.RolePersona.toString().split(","), function (i, rolePersona)
				{
					var classRole = '';
					if (rolePersona.toLowerCase().indexOf('architect') >= 0)
						classRole = 'architect';
					else
						classRole = classifyText(rolePersona);
					tags += "<span class=\"text-block role-tag " + classRole + "\">" + rolePersona + "</span>";
				});
			}

			if (value.Title != null && value.Publish && value.Featured)
			{
				var description = ((value.MarCommReviewAbstract != null) ? ((value.MarCommReviewAbstract.length > 100) ? (value.MarCommReviewAbstract.substring(0, 1000) + "...") : value.MarCommReviewAbstract) : "");
				description = description.replace(/\n/g, '<br/>');

				$(".session-browse .row").append("" +
					"<article class=\"grid-item agenda-list\">" +
					"<h3 class=\"session-title\">" + value.Title + "</h3>" +
					"<h4 class=\"session-speaker hide\">" + ((value.Speaker != null) ? value.Speaker : "") + "</h4>" +
					"<p class=\"session-type hide\">" + value.SessionType + "</p>" +
					"<div class=\"session-details hide\">" +
					"<p class=\"session-description\">" + description + "</p>" +
					"</div>" +
					"<div class=\"text-block-group tiny tags\">" +
					"<span class=\"tag-heading\">Tags:</span>" +
					tags + "</div>" +
					"<div class='add-to-agenda hide'>+ to my agenda</div>" +
					"<span class=\"details-expand\">" + 'See Details' + "</span>" +
					"</article>");

				if (value.RolePersona != null)
				{
					$.each(value.RolePersona,
						function (k, v)
						{
							if (v.toLowerCase().indexOf('architect') >= 0)
								v = 'Architect';
							if (role.indexOf(v) === -1)
								role.push(v);
						});
				}
			}
		});//end snippet




		// Second snippet starts here
		//Sorting items
		role.sort();

		//Adding text dynamically from airtable to each of filter slots
		var r = $('#role-filter');
		$.each(role, function (key, value)
		{
			r.append($("<option></option>").attr("value", classifyText(value)).attr("data-path", "." + classifyText(value)).html(value));
		});

		$('#sessions-page').jplist({
			itemsBox: '#agendaCards',
			itemPath: '.grid-item',
			panelPath: '#filter-box',
			effect: 'fade',
			redrawCallback: function (collection, $dataview, statuses)
			{
				tagFilterInit();
				$("#currentRoleTxt").html(($("#role-filter option:selected").text() + "s").replace("All Roless","All Roles"));
			}
		});

		var roleQS = getQueryStringParamValue('role');
		if (roleQS != '')
		{
			roleQS = classifyText(roleQS);
			$("#role-filter option").filter(function ()
			{
				return $(this).val() == roleQS;
			}).prop('selected', true);

			$("#role-filter").change();
		}
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
			$(value).removeClass('agenda-card col lg-6 xl-4').addClass('agenda-list');
		});
		$(this).toggleClass('current');
		$('#grid-view-btn').removeClass('current');
	});
	$('#grid-view-btn').click(function (e)
	{
		e.preventDefault();
		$.each($('.session-browse .agenda-list'), function (key, value)
		{
			$(value).removeClass('agenda-list').addClass('agenda-card col lg-6 xl-4');
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

	$(document).on('click', '.agenda-grid', function ()
	{
		var details = $('#agenda-grid');
		$(details).removeClass('hide');
		$(details).prev('.tabs-menu').find('.agenda-grid').addClass('current');
		$('#sessions').addClass('hide');
		$('#sessions').prev('#hero-banner').find('.tabs-menu .sessions').removeClass('current');
	});

	$(document).on('click', '.sessions', function ()
	{
		var details = $('#agenda-grid');
		$(details).addClass('hide');
		$(details).prev('.tabs-menu').find('.agenda-grid').removeClass('current');
		$('#sessions').removeClass('hide');
		$('#sessions').prev('#hero-banner').find('.tabs-menu .sessions').addClass('current');
	});


}); //end document.ready
</script>
