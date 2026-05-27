async function registerUser(){

    const name =
    document.getElementById("name").value;

    const email =
    document.getElementById("email").value;

    const response = await fetch("/register",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify({
            name,
            email
        })

    });

    const data =
    await response.text();

    document.getElementById("output").innerHTML = data;
}

async function getUsers(){

    const response =
    await fetch("/users");

    const data =
    await response.text();

    document.getElementById("output").innerHTML = data;
}

async function getSupport(){

    const response =
    await fetch("/support");

    const data =
    await response.text();

    document.getElementById("output").innerHTML = data;
}

async function getAI(){

    const response =
    await fetch("/ai");

    const data =
    await response.text();

    document.getElementById("output").innerHTML = data;
}
