// Events will be sent when someone followers
// Please use event listeners to run functions.

function initProgressBar(obj) {
  var backgroundImg = obj.detail.settings.custom_json.customField1.value;
  $("#goal-background").css("background-image", "url("+backgroundImg+")");
  
  var foregroundImg = obj.detail.settings.custom_json.customField2.value;
  $("#goal-progress-img").css("background-image", "url("+foregroundImg+")");

  updateProgressBar(obj);
}

function updateProgressBar(obj)
{
  var progressBar = $("#goal-progress");
  var percentProgress = obj.detail.amount.current / obj.detail.amount.target * 100;
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
  
  $(".goal-cont").css("width", window.innerWidth);
  $(".goal-cont").css("height", window.innerHeight);
  $("#goal-progress-img").css("width", window.innerWidth);
 $("#goal-progress-img").css("height", window.innerHeight);
  
  // set text colours
  $("#title").text(obj.detail.settings.custom_json.customField3.value);
  $("*").css("color", obj.detail.settings.custom_json.customField4.value);
  
  var textOutlineColour = obj.detail.settings.custom_json.customField5.value;
  $("*").css("text-shadow", "-1px -1px 0 "+textOutlineColour+", 1px -1px 0 "+textOutlineColour+", -1px 1px 0 "+textOutlineColour+", 1px 1px 0 "+textOutlineColour+"");
  $("#info-cont").css("transform", "translate(0, "+obj.detail.settings.custom_json.customField6.value+"px");
});

document.addEventListener('goalEvent', function(obj) {
  // obj.detail will contain information about the goal
  console.log(obj.detail);
  $('#goal-current').text(obj.detail.amount.current);
	updateProgressBar(obj);
});