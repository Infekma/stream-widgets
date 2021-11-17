let currentImageId = 0;

// this function sets the slide animation for the given dom at the specified speed
function setSlideAnimation() {
    listOfImageDoms.forEach(function(dom){
        let domQuery = $("#"+dom);
        const cssVal = "slide "+CONFIG.animationSpeed+"s linear infinite reverse";
        const cssKey = "animation";
        // set the animation key and value for the given dom item
        domQuery.css(cssKey, cssVal);
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
            domQuery.fadeOut(CONFIG.fadeTransitionSpeed, function() {
                domQuery.css("background-image", "url("+image+")").fadeIn(CONFIG.fadeTransitionSpeed);
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

$(document).ready(function() {
    // set the text
    setTitleAndDescriptionText();

    // set the initial images
    setSlidingImage(CONFIG.images[currentImageId], true);

    // set the animations
    listOfImageDoms.forEach(function(dom){
        setSlideAnimation(dom, CONFIG.animationSpeed);
    });
    
    // start the update timer
    window.setInterval(function(){
        console.log("updating to next slide image");
        currentImageId+=1;
        if (currentImageId >= CONFIG.images.length) {
            currentImageId = 0;
        }
        setSlidingImage(CONFIG.images[currentImageId]);
    }, CONFIG.animationSpeed * 1000);
});