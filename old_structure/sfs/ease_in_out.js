//	ease_in_out.js
//
//	This file holds a suite of functions useful for anything that may
//	want an ease-in-out function.
//
//	Like what?  The main thing: animated scrolling.  These functions
//	can make scrolling smoothly start and stop, providing that nice
//	professional look.
//
//	The math is based on a parametric equation found here:
//		https://math.stackexchange.com/questions/121720/ease-in-out-function?newreg=d60121b80fb7446895187195a830e1a9
//


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
