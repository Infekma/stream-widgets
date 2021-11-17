let currentImageId = 0;

// this function sets the slide animation for the given dom at the specified speed
function setSlideAnimation(callback = null) {
    var count = 0;
    listOfImageDoms.forEach(function(dom){
        let domQuery = $("#"+dom);
        domQuery.animate(
            {backgroundPositionX: "+=100%"},
            CONFIG.animationSpeed * 1000,
            "linear",
            function() { 
                if (count == 0) {
                    callback();
                };
                count+=1;
            }
        );
    });
};

// this function sets the image source for each image thats used for the infinite scroll
// currently there are 2 images on each side, totalling to 4 images
function setSlidingImage(image, firstTime = false) {
    listOfImageDoms.forEach(function(dom){
        let domQuery = $("#"+dom);

        if (firstTime) {
            domQuery.css("background-image", "url("+image+")")
        } else {
            // fade out the transition from current image src to the next
            domQuery.fadeOut({
                queue: false, 
                duration: CONFIG.fadeTransitionSpeed, 
                done: function() {
                    domQuery.css("background-image", "url("+image+")").fadeIn({queue: false, duration: CONFIG.fadeTransitionSpeed});
                }
            });
        }
    });
};

// list of the image doms used for slide animations
const listOfImageDoms = [
    "sliding-background-img-1-1",
    "sliding-background-img-1-2",
    "sliding-background-img-2-1",
    "sliding-background-img-2-2"
];

function setTitleAndDescriptionText() {
    $("#text-title").text(CONFIG.title);
    $("#text-description").text(CONFIG.description);
}

function update() {
    console.log("updating to next slide image");
    currentImageId+=1;
    if (currentImageId >= CONFIG.images.length) {
        currentImageId = 0;
    }
    setSlidingImage(CONFIG.images[currentImageId]);
    setSlideAnimation(update);
}

$(document).ready(function() {
    // set the text
    setTitleAndDescriptionText();

    // set the initial images
    setSlidingImage(CONFIG.images[currentImageId], true);

    // set the animations
    listOfImageDoms.forEach(function(dom){
        setSlideAnimation(update);
    });
});