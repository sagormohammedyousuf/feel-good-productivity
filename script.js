
//KEYSTROKE SHORTCUT
$(document).keydown(function(e) {
    switch (e.which) {
    case 66:
        // left
        var href = $('#buy').attr('href');
        window.open('https://go.feelgoodproductivity.com/amazon');
        break;
    }
});

//TRAILING DOTS
const dotSize = 2.5
const spacing = dotSize * 8
const areaOfEffect = 64

let dots = []

function setup() {
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent('canvas-container');
    for (let i = 0; i < width; i += spacing) {
        for (let j = 0; j < height; j += spacing) {
            dots.push(new Dot(i + spacing / 2,j + spacing / 2,dotSize))
        }
    }
    noStroke()
}

function draw() {
    background(255, 255, 255);
    dots.forEach(dot=>{
        dot.update()
        dot.render()
    }
    )
}

let mouseIsMoving = false;

function mouseMoved() {
    mouseIsMoving = true
    setTimeout(()=>mouseIsMoving = false, 100)
}

class Dot {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.transparency = 40
    }

    update() {
        let distance = dist(mouseX, mouseY, this.x, this.y)
        if (mouseIsMoving && distance < areaOfEffect) {
            this.transparency = 255
        } else {
            this.transparency = max(40, this.transparency - 10)
        }
    }

    render() {
        fill(138, 138, 138, this.transparency)

        ellipse(this.x, this.y, this.size)
    }
}

//WHITTLING WORDS
function init() {
    gsap.registerPlugin(ScrollTrigger);

    // select static and aniamted elements
    const imagineAnimated = document.querySelector("#imagine-animated");
    const imagineStatic = document.querySelector("#imagine-static");
    const buildAnimated = document.querySelector("#build-animated");
    const buildStatic = document.querySelector("#build-static");
    const tellAnimated = document.querySelector("#tell-animated");
    const tellStatic = document.querySelector("#tell-static");

    // splite the text into words as spans
    const splitType = new SplitType("#words-to-split",{
        types: "words"
    });

    // set positions
    matchLocation(imagineStatic, imagineAnimated);
    matchLocation(buildStatic, buildAnimated);
    matchLocation(tellStatic, tellAnimated);

    // hide static elments, make animated elements visible.
    // avoids flashing of content
    gsap.set(imagineAnimated, {
        visibility: "visible"
    });
    gsap.set(buildAnimated, {
        visibility: "visible"
    });
    gsap.set(tellAnimated, {
        visibility: "visible"
    });
    gsap.set(imagineStatic, {
        visibility: "hidden"
    });
    gsap.set(buildStatic, {
        visibility: "hidden"
    });
    gsap.set(tellStatic, {
        visibility: "hidden"
    });

    // declare a timeline outside createTimeline scope
    // so we can access it in our resize function
    let tl;

    function createTimeline() {
        // if a timeline exists, save its progress and kill it
        let progress = tl ? tl.progress() : 0;
        tl && tl.progress(0).kill();

        // create our timeline
        tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".scroll-track",
                start: "top top",
                // when top of trigger div is at top of viewport
                end: "bottom bottom",
                // when bottom of trigger div is at bottom of viewport
                scrub: 1 // link to scroll
            }
        });

        // create the timeline
        tl.to(splitType.words, {
            // whooshing words
            opacity: 0,
            rotationZ: 30,
            rotationX: 40,
            yPercent: -300,
            xPercent: 100,
            stagger: 0.05
        })// start sending animated text to its original position in x direction
        .to([imagineAnimated, buildAnimated, tellAnimated], {
            x: 0,
            duration: 2
        })// start aniamting in the y direction
        // adding ease to this creates nice curved motion.
        // https://codepen.io/snorkltv/pen/dyoxXaQ
        .to([imagineAnimated, buildAnimated, tellAnimated], {
            y: 0,
            ease: "sine.in",
            duration: 1
        }, ">-1"// 1 second from end of previous to
        )// finish off with punctuation
        .to(".is-punctuation", {
            autoAlpha: 1,
            stagger: 0.5
        });

        // new tween created with updated location, set progress.
        tl.progress(progress);
    }
    // create timeline on initial load.
    createTimeline();

    function handleResize() {
        // set positions
        matchLocation(imagineStatic, imagineAnimated);
        matchLocation(buildStatic, buildAnimated);
        matchLocation(tellStatic, tellAnimated);

        // recreate the timeline so it "knows" where the new element positions are
        createTimeline();
    }

    // set the elements that will animate positions to same location as
    // their static partners
    function matchLocation(staticElement, animatedEl) {
        let boundsRel = staticElement.getBoundingClientRect();
        let boundsAbs = animatedEl.getBoundingClientRect();

        gsap.set(animatedEl, {
            x: "+=" + (boundsRel.left - boundsAbs.left),
            y: "+=" + (boundsRel.top - boundsAbs.top)
        });
    }

    window.addEventListener("resize", handleResize);
}

window.addEventListener("load", init);

//OPACITY FADE
$(window).scroll(function() {
    var enterHeight = $(window).height() / 2;
    var exitHeight = enterHeight + enterHeight / 1.3;
    var elements = $(".features-div");

    if (window.innerWidth <= 767) {
        elements.each(function() {
            var distanceFromBottom = $(window).scrollTop() + $(window).height() - $(this).offset().top;
            if (distanceFromBottom >= enterHeight && distanceFromBottom < exitHeight) {
                //elements.removeClass("active");
                $(this).addClass("active");
            } else {
                $(this).removeClass("active");
            }
        });
    } else {
        elements.each(function() {
            var distanceFromBottom = $(window).scrollTop() + $(window).height() - $(this).offset().top;
            if (distanceFromBottom >= enterHeight && distanceFromBottom < exitHeight) {
                elements.removeClass("active");
                $(this).addClass("active");
            } else {
                $(this).removeClass("active");
            }
        });
    }
});
