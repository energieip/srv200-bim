$("#loginForm").submit(function( event ) {
    // Stop form from submitting normally
    event.preventDefault();

    var $form = $(this);
    var username = $form.find("input[name='uname']").val();
    var pwd = $form.find("input[name='pwd']").val();

    var userKey = SHA256(username + pwd);
    var data = {
        "userKey": userKey
    };
    
    $.ajax({
		type: "POST",
		url: energieip.weblink + "user/login",
        cache: false,
        dataType: 'json',
        credentials: 'include',
        crossDomain: true,
        xhrFields: {
            withCredentials: true
       },
		data: JSON.stringify(data),
        statusCode: {
            200: function (response) {
                window.location.href = 'dashboard.html';
            },
            500: function (response) {
               alert('500');
            },
            401: function (response) {
               alert('Invalid Username/Password');
            }
        }
	});
});
