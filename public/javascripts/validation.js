
$(document).ready(function() {
    //check password strength
$('#password').keyup(function() {
$('#result').html(checkStrength($('#password').val()))
});
//check email
$('#email').keyup(function() {
    var email = $('#email').val();
    var email_regex = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
// Validating Email Field.
    if (!email.match(email_regex) || email.length == 0) {
        $('#errorEmail').text("Please enter a valid email address "); 
        $('#errorEmail').addClass('error')
        //$("#email").focus();
        $('#errorEmail').show();
}
    else {
        $('#errorEmail').removeClass();
        $('#errorEmail').hide();
        }
});
//check first name 
$('#firstname').keyup(function() {
    var firstname = $('#firstname').val();
    var name_regex = /^[a-zA-Z]+$/;

    if (!firstname.match(name_regex) || firstname.length == 0) {
        $('#errorFirstname').text("Please enter a valid first name "); 
        $('#errorFirstname').addClass('error');
        //$("#firstname").focus();
        $('#errorFirstname').show(); 
    }
    else {
        $('#errorFirstname').hide();  
        }
});
$('#lastname').keyup(function() {
    var lastname = $('#lastname').val();
    var name_regex = /^[a-zA-Z]+$/;
// Validating 
    if (!lastname.match(name_regex) || lastname.length == 0) {
        $('#errorLastname').text("Please enter a valid last name ");
        $('#errorLastname').addClass('error');
        //$("#lastname").focus();
        $('#errorLastname').show();
    }
    else {
        $('#errorLastname').hide();  
        }
});
$('#phone').keyup(function() {
    var phone = $('#phone').val();
    var phone_regex = /^\d{10}$/;
// Validating 
    if (!phone.match(phone_regex) || phone.length == 0) {
        $('#errorPhone').text("Please enter a valid phone number "); 
        $('#errorPhone').addClass('error')
        //$("#phone").focus();
        $('#errorPhone').show();  
    }
    else {
        $('#errorPhone').hide();  
        }
});

$('#confirmPassword').keyup(function() {
    var confirmPassword = $('#confirmPassword').val();

    if (confirmPassword !== $('#password').val()) {
        $('#errorPassward').text("password doesn't match "); 
        $('#errorPassward').addClass('error');
        //$("#confirmPassword").focus();
        $('#errorPassward').show();
    }
    else {
        $('#errorPassward').hide();  
        }
});
$('#year').keyup(function() {
    var year = $('#year').val();
    //var year_regex = /^(190[0-9]|19[0-9]\d|200\d|201[0-7])$/;
    var year_regex = /^(0?[1-9]|1[0-2])\/((0?[1-9])|((1|2)[0-9])|30|31)\/(190[0-9]|19[0-9]\d|200\d|201[0-7])/
// Validating 
    if (!year.match(year_regex) || year.length == 0) {
        $('#errorYear').text("Please enter a valid year number "); 
        $('#errorYear').addClass('error');
        //$("#year").focus();
        $('#errorYear').show(); 
    }
    else {
        $('#errorYear').hide();  
        }
});

function checkStrength(password) {
var strength = 0
if (password.length < 6) {
$('#result').removeClass();
$('#result').addClass('short');
return 'Too short'
}
if (password.length > 7) strength += 1
// If password contains both lower and uppercase characters, increase strength value.
if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1
// If it has numbers and characters, increase strength value.
if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) strength += 1
// If it has one special character, increase strength value.
if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
// If it has two special characters, increase strength value.
if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
// Calculated strength value, we can return messages
// If value is less than 2
if (strength < 2) {
$('#result').removeClass();
$('#result').addClass('weak');
return 'Weak'
} else if (strength == 2) {
$('#result').removeClass();
$('#result').addClass('good');
return 'Good'
} else {
$('#result').removeClass();
$('#result').addClass('strong');
return 'Strong'
}
}
});
