


function login() {
    console.log("Login function called");
/   event.preventDefault();*/

    const userInput = document.getElementById("form_name1");
    const passwordInput = document.getElementById("form_name2");

    console.log("userInput:", userInput);
    console.log("passwordInput:", passwordInput);


    if (userInput.value == "") {
        alert("Username is empty");
        return;
    }
    else if (passwordInput.value === "") {
        alert("Password is empty");
        return;
    }
    else if (userInput.value != "" && passwordInput.value != "") {

            var UserDetails = { UserName: userInput.value, Password: passwordInput.value };

            $.ajax({
                url: '/Login/UserCheck',
                type: "Post",
                dataType: "json",
                data: JSON.stringify(UserDetails),
                contentType: "application/json",
                cache: false,
                success: function (response) {
                    if (response.result == 'Redirect')
                        window.location = response.url;
                    else {
                        alert(response.result);
                        return;
                    }
                },
            })
        }
        else {
            alert("Invalid User creds");
        }

    }

