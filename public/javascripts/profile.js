// Initiates an Ajax call to a POST endpoint for sign in
function sendReqForProfile() {
    $.ajax({
        url: '/profile',
        type: 'GET',
        headers: { 'x-auth': window.localStorage.getItem("token") },
        responseType: 'json',
        success: profileResponse,
        error: function(jqXHR, status, error) {
            if (status === 401) {
                window.localStorage.removeItem("token");
                window.location.href = "/";
            } else {
                $("#error").html("Error: " + error);

            }
        }
    });
}

// Process response from sign in attempt 
function profileResponse(data, status, xhr) {


    $("#email").html(data.email);
    $("#firstname").html(data.firstname);
    $("#lastname").html(data.lastname);
    $("#birthday").html(data.birthday);
    $("#gender").html(data.gender);
    $("#phone").html(data.phone);
    $("#lastAccess").html(data.lastAccess);
    
}

// Handle authentication on page load
document.addEventListener("DOMContentLoaded", function() {
    // Check if local storage has token
    if (window.localStorage.getItem("token")) {
        sendReqForProfile();
    }
    // add event listener to signin button 
    else {
        document.location.href = "/";
    }
});