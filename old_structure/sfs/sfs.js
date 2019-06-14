//	sfs.js
//
//	Holds all the javascript relevant to the sleep furiously studios
//	family of websites.
//
//		ease_scroll_to (eID, duration, power)
//				The function you'll be most interested in.  Makes an
//				animated scroll with easing in and out from the current
//				location to the element with eID.
//
//		jump_to (eID)
//				Immediately scrolls to an element with eID.
//
//		ease_in_out_xy (power, x1, x2, y1, y2, duration, elapsed)
//				This is the function that actually scrolls the
//				view!  It calls ease_in_out() twice--once for the
//				x and once for the y portion of the scroll.
//
//		ease_in_out (power, x1, x2, duration, elapsed)
//				Helper for ease_scroll_to() above.  Use this as
//				a general easing function from one value to another.
//
//		parameterized_ease_in_out (x, power)
//				Easing function returning values from [0..1] by
//				range [0..1].  Just supply the range and the exponent
//				to use.  VERY general.
//
//		get_elem_pos(elem)
//				Finds the top, left offsets of a specified element's
//				bounding rectangle.  The coordinates are absolute
//				positions on the document.
//
//		get_scroll_top(), get_scroll_left()
//				Find out how much the page has been scrolled at the
//				moment.  This is another way of saying what pixel of
//				our page is displayed at the top left of the viewport.
//
//////////////////////////////////////

//====================================
//	Constants
//====================================

// The length of a frame in milliseconds.
var FRAME_TIME = 30;


//====================================
//	Use this when you just want to scroll directly (no animation)
//	to an element.
//
//	input
//		eID		The element id of the destination.  Does nothing
//				if eID is invalid.
//
function jump_to (eID) {
	var element = document.getElementById(eID);
	if (!!element && element.scrollIntoView)
		element.scrollIntoView();
}

//====================================
//	Call this to scroll to an element on the current web page.
//	A nice ease-in-out animation will scroll in the supplied
//	time.
//
//	input
//		eID		The ID of the element to go to.
//
//		duration	How many milliseconds for the entire
//					scroll animation to take place.
//
//		power		This describes the steepness of the
//					easing.  The higher the number the
//					steeper the easing curve.  Use 1
//					for a linear animation.  A value
//					of 2 or 3 should be sufficient.
//
function ease_scroll_to (eID, duration, power) {

	var curr_x = get_scroll_left();
	var curr_y = get_scroll_top();

	var elem = document.getElementById(eID);
	var rect = get_elem_pos (elem);
	var dest_x = rect.left;
	var dest_y = rect.top;

	// Start the recursive loop.
	ease_in_out_xy (power, curr_x, dest_x, curr_y, dest_y, duration, FRAME_TIME);

} // ease_scroll_to (eID, duration, power)


//====================================
//	This is what's called every frame.  It handles
//	the double call of ease_in_out() for the x and
//	y directions.
//
//	The actual scrolling call is done HERE (based
//	on results of ease_in_out() for x and y vars)!!
//
//	This is a recursive function that keeps going
//	until elapsed >= duration.
//
//	input
//		power	The exponent to use for the curve.
//
//		x1, x2	Start and stop values for x (horizontal
//				scroll).
//
//		y1, y2	Start and stop values for y (vertical).
//
//		duration	The entire time the animation should
//					take place.
//
//		elapsed		The time that has elapsed.  A value
//					of 0 yields a result of x1, whereas
//					a value of duration yields x2.
//					Values outside these are squashed.
//
function ease_in_out_xy (power,
						 x1, x2,
						 y1, y2,
						 duration, elapsed) {
	// Test to see if we're done.
	if (elapsed >= duration) {
		window.scrollTo(x2, y2);	// Make sure we finish
		return;
	}

	var x = ease_in_out (power, x1, x2, duration, elapsed);
	var y = ease_in_out (power, y1, y2, duration, elapsed);

	window.scrollTo(x, y);

	setTimeout (function() {
					ease_in_out_xy (power,
						x1, x2,
						y1, y2,
						duration, elapsed + FRAME_TIME);
				}, FRAME_TIME);
} // ease_in_out_xy (power, x1, x2, y1, y2, duration, elapsed)

//====================================
//	A helper function for using the parameterized function
//	above.  This is the thing that you'll most likely
//	actually use.  It has easy inputs to do what you want.
//
//	input
//		power	The exponent to use.  1 makes a linear
//				function, 2 quadratic, etc.  The higher
//				the number, the steeper the curve.
//
//		x1, x2		The start and stop values.
//
//		duration	The entire time the animation should
//					take place.
//
//		elapsed		The time that has elapsed.  A value
//					of 0 yields a result of x1, whereas
//					a value of duration yields x2.
//					Values outside these are squashed.
//
//	return
//		A value in the range [x1..x2] that depends
//		on the ratio of elapsed / duration as modified
//		by the power.
//
function ease_in_out (power, x1, x2, duration, elapsed) {
	//	Test for the out-of-bounds first.
	if (elapsed <= 0)
		return x1;
	if (elapsed >= duration)
		return x2;

	// The elapsed time / duration is the ratio of how
	// far along we are in the function.  This will be
	// the x input for the parameterized function.
	var x = elapsed / duration;
	var result = parameterized_ease_in_out (x, power);

	// Scale the result to fit our starting and ending
	// values.
	result = result * (x2 - x1) + x1;
	return result;
} // ease_in_out (power, x1, x2, duration, elapsed)


//====================================
//	This is the meat of the action, where the actual math
//	happens.  Since the input/output is rather abstract,
//	it's suitable for a wide array of uses.
//
//	The function goes like this:
//
//	For x in range [0..1], returns y in range [0..1],
//	but with easing (depending on p, the exponent or power).
//
//					 x^p
//		f(x) = ---------------
//			   x^p + (1 - x)^p
//
//		where p is the power (p = 1 is linear, p = 2 is quadratic)
//
//	input
//		power	The exponent to be used.  The higher the
//				exponent, the steeper the curve.  A p = 1
//				results in a linear function.
//
//		x 		The value of x for the function.  Should
//				be in the range [0..1].
//
//	returns
//		A number [0..1], in a ease-in-out curve appropriate
//		to the power.
//
function parameterized_ease_in_out (x, power) {
	var numerator = Math.pow(x, power);
	var denominator = Math.pow ((1 - x), power);
	denominator += numerator;
	return numerator / denominator;
} // parameterized_ease_in_out (x, power)


//====================================
//	Find the top and left (in document coordinates) of
//	a given element.
//	From this website:
//		http://javascript.info/tutorial/coordinates
//
//	input
//		element		This is the ELEMENT, not the ID!
//
//	To use the return data:
//
//		var rect = get_elem_pos(my_div);
//		var top = rect().top,
//			left = rect().left;
//
//	returns
//		A data structure with top and left filled in
//		with the position of the element in the document
//		(absolute position).
//
//	NOTE:
//		This does not give the ABSOLUTE position in the
//		web page.  It gives the current OFFSET!!!
//
function get_elem_pos (elem) {
    // Get the enclosing rectangle for this element.  The
	// coords are relative to the viewport.
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docElem = document.documentElement;

    // Calculate the page scroll.
    var scrollTop = get_scroll_top();
    var scrollLeft = get_scroll_left();

    // IE can shift the document (html or body).  Get that offset.
    var clientTop = docElem.clientTop || body.clientTop || 0;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;

    // Add scrolls to the window-relative coordinates and subtract
	// the IE shift.  This gives the absolute coordinates.
    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

	// Firefox sometimes needs rounding.
//    return { top: Math.round(top), left: Math.round(left) };
	return { top: top, left: left };	// No rounding.  Let's see if it works.


} // get_elem_pos(elem)

//====================================
//	These two functions figure out how much the page is
//	currently scrolled.  If the page is in its top-most
//	and left-most position, then you should get zeroes.
//	Works on all modern browsers.
//
function get_scroll_top() {
	var scroll = window.pageYOffset ||
			document.documentElement.scrollTop ||
			document.body.scrollTop;
	return scroll;
}
function get_scroll_left() {
	var scroll = window.pageXOffset ||
			document.documentElement.scrollLeft ||
			document.body.scrollLeft;
	return scroll;
}
