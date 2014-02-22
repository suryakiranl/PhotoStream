/**
 * Owner: Surya Kiran
 */

// Global variables
var userPhotosResp;
var userAuthResp;
var userToken;
var imgIndex = 0;

$(document).ready(function() {
	console.log("Inside ready function");
});

$(document).keydown(function(e) {
	if (e.keyCode == 37) {
		previousImage();
	} else if (e.keyCode == 39) {
		nextImage();
	}
});

// Intialize on page load.
window.fbAsyncInit = function() {
	FB.init({
		appId : '290992264384747',
		status : true, // check login status
		cookie : true, // enable cookies to allow the server to access the
		// session
		xfbml : true
	});

	// Subscribe to login / logout changes
	FB.Event.subscribe('auth.authResponseChange', function(response) {
		if (response.status === 'connected') {
			userAuthResp = response.authResponse;
			userToken = userAuthResp.accessToken;

			sayHi();
		} else {
			$("#viewStreamBtnDiv").hide();
			$("#imgDiv").empty();
			clearGlobalVariables();
		}
	});
};

// Utility function to clear global variables.
function clearGlobalVariables() {
	userPhotosResp = null;
	userAuthResp = null;
	userToken = null;
	imgIndex = 0;
}

// Load the SDK asynchronously
(function(d) {
	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	if (d.getElementById(id)) {
		return;
	}
	js = d.createElement('script');
	js.id = id;
	js.async = true;
	js.src = "//connect.facebook.net/en_US/all.js";
	ref.parentNode.insertBefore(js, ref);
}(document));

// After successful login, say Hi to the user and load his photos
function sayHi() {
	$("#viewStreamBtnDiv").show();

	console.log('Welcome!  Fetching your information.... ');
	FB.api('/me', function(response) {
		console.log('Good to see you, ' + response.name + '.');
		blockUI('Welcome ' + response.name + ' !!');
		setTimeout(function() {
			unblockUI();
		}, 3000);
	});

	loadPhotos();
}

// Load user photos from Facebook
function loadPhotos() {
	FB.api('/me/photos?access_token=' + userToken, function(response) {
		console.log("Length of data array = " + response.data.length);
		userPhotosResp = response;
	});
}

function isModalVisible() {
	return $('#imgDiv').is(':visible');
}

// Wait for model dialog to be shown
function showModal() {
	if (userPhotosResp.data.length === 0) {
		blockUI('User has no photos to be displayed.');
		
		setTimeout(function() {
			unblockUI();
		}, 5000);
		
		setTimeout(function() {
			$("#closeModal").trigger("click");
		}, 500);
	} else {
		setTimeout(function() {
			showImage(imgIndex);	
		}, 500);
	}

	return false;
}

// Show the next image in the list
function nextImage() {
	if (isModalVisible()) {
		imgIndex++;
		if (imgIndex >= userPhotosResp.data.length) {
			imgIndex = 0;
		}
		showImage(imgIndex);
	}
}

// Show the previous image in the list
function previousImage() {
	if (isModalVisible()) {
		imgIndex--;
		if (imgIndex < 0) {
			imgIndex = userPhotosResp.data.length - 1;
		}
		showImage(imgIndex);
	}
}

// Function to display the image.
function showImage(imageIndex) {
	if(isModalVisible()) {
		var imgURL = userPhotosResp.data[imageIndex].source;
		console.log(imageIndex + " :: New Image URL = " + imgURL);

		$("#imgDiv").empty();
		var imgTag = "<img src='" + imgURL + "' />";
		$("#imgDiv").append(imgTag);	
	}
}

// Function to show a message on screen
function blockUI(messg) {
	$('#loadingDiv').html(messg);
	$('#loadingDiv').fadeIn(400);
}

// Hide the message displayed previously
function unblockUI() {
	$('#loadingDiv').fadeOut(900);
}