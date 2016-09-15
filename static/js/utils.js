
/**
* Simple string formatting
*
* Usage: "Today we {verb}!".format({ verb: 'shop'});
*
* @param {object} obj - Source of values
*/
String.prototype.format = function (obj) {
    return this.replace(/\{(\w+)\}/, function (m, i) { return obj[i] || ''; });
};


/**
* Smooth scroll an element into view.
* @param {selector} el - target element to scroll into view
*/
function scroll_to(el) {
    var $el = $(el);
    var top = $el.position().top;

    // if we're in a modal, we need to scroll that element...
    var modal = $el.closest('.modal') || false;

    $( modal || 'html,body').animate({ scrollTop: top }, 1000);
};


function scroll_to_from_booking(el) {
    // grab the height of the .booking-info, and always leave space to show it
    var offset = $('.booking-info').parent().height();
    var top = $(el).offset().top - offset;
    $( 'html,body' ).animate({ scrollTop: top }, 1000);
};

function scroll_to_top() {
    $( 'html,body' ).animate({ scrollTop: 0 }, 1000);
};


// global variable allowing us to prevent multiple throbs from firing simultaneously
var preventThrob = false;

function throb(element) {
    element
        .animate({opacity: 0.4}, 100).animate({opacity: 1.0}, 100)
        .animate({opacity: 0.4}, 100).animate({opacity: 1.0}, 100)
        .animate({opacity: 0.4}, 100).animate({opacity: 1.0}, 100);
}
