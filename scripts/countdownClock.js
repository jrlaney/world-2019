//Set a Valid Date
var keynoteSchedule = [
	[new Date(), new Date('February 5 2019 09:00:00')],
	[new Date('February 5 2019 11:00:00'), new Date('February 6 2019 10:00:00')],
];

//Calculate the time remaining
function getTimeRemaing(endtime) {
	var t = Date.parse(endtime) - Date.parse(new Date());

	//Convert the time to a usable format
	var seconds = Math.floor( (t/1000) % 60 );
	var minutes = Math.floor( (t/1000/60) % 60 );
	var hours = Math.floor( (t/(1000*60*60)) % 24 );
	var days = Math.floor( t/(1000*60*60*24) );

	//Output the clock data as a reusable object
	return {
		'total' : t,
		'days' : days,
		'hours' : hours,
		'minutes' : minutes,
		'seconds' : seconds
	};
}

//iterate over each element in the schedule
for(var i=0; i<keynoteSchedule.length; i++){
	var startDate = keynoteSchedule[i][0];
	var endDate = keynoteSchedule[i][1];

	//put dates in milliseconds for easy comparisons
	var startMs = Date.parse(startDate);
	var endMs = Date.parse(endDate);
	var currentMs = Date.parse(new Date());

	//if current date is between start and end dates, display clock
	if(endMs > currentMs && currentMs >= startMs) {
		initializeClock('countdownClock', endDate);
	}
}
function initializeClock(id, endtime) {
	var clock = document.getElementById(id);
	clock.style.display = 'block';
	var daysSpan = clock.querySelector('.days');
	var hoursSpan = clock.querySelector('.hours');
	var minutesSpan = clock.querySelector('.minutes');
	var secondsSpan = clock.querySelector('.seconds');

	function updateClock() {
		var t = getTimeRemaing(endtime);
		daysSpan.innerHTML = ('0' + t.days).slice(-2);
		hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
		minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
		secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

		if( t.total <= 0) {
			clearInterval(timeinterval);
		}
	}
	updateClock();
	var timeinterval = setInterval(updateClock, 1000);
}