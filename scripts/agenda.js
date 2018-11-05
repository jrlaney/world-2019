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
		if (value.Title != null && value.Publish) {
			$(".session-browse .row").append("" +
				"<article class=\"grid-item agenda-list\">" +
				"<span class=\"" + ((value.Program != null) ? classifyText(value.Program) : "") + "\">" + ((value.Program != null) ? classifyText(value.Program) : "") + "</span>" +
				"<h3 class=\"session-title\">" + value.Title + "</h3>" +
				"<h4 class=\"session-speaker hide\">" + ((value.Speaker != null) ? value.Speaker : "") + "</h4>" +
				"<p class=\"session-type\">" + value.SessionType + "</p>" +
				"<div class=\"session-details\">" + 
					"<p class=\"session-description\">" + ((value.MarCommReviewAbstract != null) ? ((value.MarCommReviewAbstract.length > 100) ? (value.MarCommReviewAbstract.substring(0, 180) + "...") : value.MarCommReviewAbstract) : "") + "</p>" +
				"</div>" + 
				"<div class=\"tags\">" +
					"<span class=\"" + ((value.RolePersona != null) ? classifyText(value.RolePersona) : "") + "\">" + ((value.RolePersona != null) ? classifyText(value.RolePersona) : "") + "</span>" +
					"<span class=\"" + ((value.Topic != null) ? classifyText(value.Topic) : "") + "\">" + ((value.Topic != null) ? classifyText(value.Topic) : "") + "</span>" +					
				"</div>" +
				"<span class=\"details-expand\">" + 'See Details' + "</span>" +				
				"</article>");

			if (value.Program != null) {
				$.each(value.Program, function (k, v) {
					if (program.indexOf(v) === -1)
						program.push(v);
				});
			}
			if (value.RolePersona != null) {
				$.each(value.RolePersona, function (k, v) {
					if (role.indexOf(v) === -1)
						role.push(v);
				});
			}
			if (value.Topic != null) {
				$.each(value.Topic, function (k, v) {
					if (topic.indexOf(v) === -1)
						topic.push(v);
				});
			}
		}

		
	});

	//Sorting items
	program.sort();
	role.sort();
	topic.sort();
	//Adding text dynamically from airtable to each of filter slots
	var p = $('#program');
	p.append($("<option></option>").attr("value", "").attr("data-path", "default").text("Select Program"));
	$.each(program, function (key, value) {
		p.append($("<option></option>").attr("value", key).attr("data-path", "." + classifyText(value)).text(value));
	});
	var r = $('#role');
	r.append($("<option></option>").attr("value", "").attr("data-path", "default").text("Select Role"));
	$.each(role, function (key, value) {
		r.append($("<option></option>").attr("value", key).attr("data-path", "." + classifyText(value)).text(value));
	});
	var t = $('#topic');
	t.append($("<option></option>").attr("value", "").attr("data-path", "default").text("Select Topic"));
	$.each(topic, function (key, value) {
		t.append($("<option></option>").attr("value", key).attr("data-path", "." + classifyText(value)).text(value));
	});
	$("#agenda-page").jplist({
		itemsBox: "#agendaCards",
		itemPath: '.grid-item',
		panelPath: "#filter-box",
		effect: "fade"

	});
	$.each($('.session-details'), function(key, value){
		$(value).addClass('hide');
	});

	$(document).on('click', ".details-expand", function (){
		var details = $(this).prev();
		details.slideToggle('fast');
		details.removeClass('hide');
		$(this).text($(this).text() === 'See Details' ? 'Hide Details' : 'See Details');
	});
});//end of api pull
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

}); //end document.ready