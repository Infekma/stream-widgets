// Events will be sent when someone followers
// Please use event listeners to run functions.
// NOTE: this does not include GIF - see original documentation
function isVideoFile(src) {
	return src.endsWith(".webm") || src.endsWith(".mp4") || src.endsWith(".ogg");
}

function setElementSource(elem, src) {
	var imgElem = elem + "-img";
	var vidElem = elem + "-vid";

	var isVideoSrc = isVideoFile(src);
	if (isVideoSrc) {
		$(vidElem).attr("src", src); 
		// hide the other child since we're showing an vid instead of img
		$(imgElem).css("display", "none");
	} else {
		$(imgElem).css("background-image", "url("+src+")");  
		// hide the other child since we're showing an image instead of vid
		$(vidElem).css("display", "none");
	}
}

function hasSpecifiedSrc(value) {
  return value !== undefined;
}

var hasTickEffect = false;
var hasFinishEffect = false;
function initProgressBar(obj) {
	setElementSource("#goal-background", obj.detail.settings.custom_json.customField1.value);
	setElementSource("#goal-progress", obj.detail.settings.custom_json.customField2.value);
	var tickEffectSrc = obj.detail.settings.custom_json.customField7.value;
  hasTickEffect = hasSpecifiedSrc(finishEffectSrc);
	setElementSource("#goal-tick", tickEffectSrc);
  var finishEffectSrc = obj.detail.settings.custom_json.customField8.value;
  hasFinishEffect = hasSpecifiedSrc(finishEffectSrc);
	setElementSource("#goal-finished", finishEffectSrc);

	// if the goal tick is a video, retrieve the video lenth to use as the uptime for the visibility
	if (isVideoFile(tickEffectSrc) && hasTickEffect) {
		$("#goal-tick-vid").on('loadedmetadata', function(){
			tickDurationInSeconds = this.duration;
		});
	}

	updateGoalFollowers(obj, false);
}

function goalFinished() {
	$("#goal-finished").removeClass("hidden");
}

var tickDurationInSeconds = 5.0;
var tickStartTime;
var isTickEffectVisible = false; // specifies whether the tick effect is visible
function goalTick() {
	tickStartTime = new Date();
	isTickEffectVisible = true;
	$("#goal-tick").removeClass("hidden");
}

var firstTime = true; // used to specify first time execution
var updateRate = 10000; // the update rate to interpolate currentFollowersUpdate
var currentFollowersUpdate = 0.0; // this value is interpolated towards currentFollowers
var currentFollowers = 0;
var targetFollowers = 0;
function updateGoalFollowers(obj, setUpdatePoint) {
	// check if the follower has changed, if so show the follower tick effect
	if (currentFollowers != obj.detail.amount.current && !firstTime && hasTickEffect) {
		goalTick();
	}

	currentFollowers = obj.detail.amount.current;
	targetFollowers = obj.detail.amount.target;
	if (setUpdatePoint) {
		currentFollowersUpdate = obj.detail.amount.current; 
	}

	// check if the goal is finished, if true make the effect visible
	if (currentFollowers >= targetFollowers && hasFinishEffect) {
		goalFinished();
	}
}

function updateLoop() {
	if (isTickEffectVisible && hasTickEffect) {
		// check if the time has elapsed that the tick should be visible for
		if ( (new Date() - tickStartTime) >= (tickDurationInSeconds * 1000)) {
			$("#goal-tick").addClass("hidden");
			isTickEffectVisible = false;
		}
	}

	if (currentFollowersUpdate >= currentFollowers && !firstTime) {
		return;
	}
	firstTime = false;
	currentFollowersUpdate += currentFollowers / updateRate;

	// the progress bar update uses the container, this is
	// because we want to crop the contents rather then
	// scale them.
	var progressBar = $("#goal-progress-cont");
	var percentProgress = currentFollowersUpdate / targetFollowers * 100;
	progressBar.css("width", percentProgress+"%");
}

document.addEventListener('goalLoad', function(obj) {
	// obj.detail will contain information about the current goal
	// this will fire only once when the widget loads
	console.log(obj.detail);
	$('#title').html(obj.detail.title);
	$('#goal-current').text(obj.detail.amount.current);
	$('#goal-total').text(obj.detail.amount.target);
	$('#goal-end-date').text(obj.detail.to_go.ends_at);
	initProgressBar(obj);

	// for every element in this array, set the width/height
  // to that of the window
  var elementsToSetHeightAndWidthFor = [
    $("#goal-progress-img"),
    $("#goal-progress-vid"),
    $("#goal-background-img"),
    $("#goal-background-vid"),
    $("#goal-tick-vid"),
    $("#goal-tick-img"),
    $("#goal-finished-vid"),
    $("#goal-finished-img"),
  ];

  elementsToSetHeightAndWidthFor.forEach(element => {
    element.css("height", window.innerHeight);
    element.css("width", window.innerWidth);
  });

	$("#title").text(obj.detail.settings.custom_json.customField3.value);
	$("#info-cont").css("transform", "translate(0, "+obj.detail.settings.custom_json.customField6.value+"px");

	// set text-related styling
	$(".text").css("color", obj.detail.settings.custom_json.customField4.value);
	var textOutlineColour = obj.detail.settings.custom_json.customField5.value;
	$(".text").css("text-shadow", "-1px -1px 0 "+textOutlineColour+", 1px -1px 0 "+textOutlineColour+", -1px 1px 0 "+textOutlineColour+", 1px 1px 0 "+textOutlineColour+"");
	$(".text").css("font-family", obj.detail.settings.font);

	updateGoalFollowers(obj, true);

	// start the update loop
	setInterval(updateLoop, 1 / 60);
});

document.addEventListener('goalEvent', function(obj) {
	// obj.detail will contain information about the goal
	console.log(obj.detail);
	$('#goal-current').text(obj.detail.amount.current);
	updateGoalFollowers(obj, false);
});