function Calculator() {
	var $screen = $('#screen'); 
	var $input = $('#input-box');
	//inputBox and screen intialisation (not 0 because of the global check, see below)
	$screen.val(0);
	$input.val(23);
	//method definitions
	this.add = function() {
		$screen.val(parseInt($screen.val()) + parseInt($input.val()));
	}
	this.mult = function() {
		$screen.val(parseInt($screen.val()) * parseInt($input.val()));
	}
	this.set = function() {
		$screen.val(prompt('Enter a value to be put on the screen', $screen.val()) || '0');
	}
	this.clear = function() {
		$screen.val(0);
		$input.val(0);
	}

}


$(document).ready(function() {
	var calc;
	var submitBtn = $('#submit-btn');
	var plusBtn = $('#plus');
	var multBtn = $('#mult');
	var clrBtn = $('#clear');
	var setBtn = $('#set');
	var inputBox = $('#input-box');

	submitBtn.click(validateAndOpenCalc);
	plusBtn.click(function() {calc.add()}); 
	multBtn.click(function() {calc.mult()});
	clrBtn.click(function() {calc.clear()});
	setBtn.click(function() {calc.set()});

	inputBox.mouseup(function() {
		if (parseInt(inputBox.val()) < 0) {
			alert("no negative values allowed");
		}
	});

	inputBox.keyup(function (event){
		if (!inputBox.val() && event.keyCode != 8) {
			alert("only positive numbers allowed");
		} else if (parseInt(inputBox.val()) < 0) {
			alert("no negative values allowed");
		}
	});


	function validateAndOpenCalc() {
		if ($('#name').val() === 'admin' && $('#password').val() === 'admin') {
			$('.ex1').hide();
			$('.calculator').show();
			//instantiatin a calculator
			calc = new Calculator();
			//making sure that the functions can be called globaly 
			//it's working.. I'm reseting the display so that's why you can't see it though..
			//comment out the reset part if you wan't to see it (you'll get 23)
			var m = calc.add;
			m();
			//reseting the display so the user can get a fresh start with the calculator
			calc.clear();
		}
	}
});
