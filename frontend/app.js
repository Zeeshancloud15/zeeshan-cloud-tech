async function getUsers() {

    const response = await fetch('/users')

    const data = await response.text()

    document.getElementById('result').innerHTML = data
}

async function getSupport() {

    const response = await fetch('/support')

    const data = await response.text()

    document.getElementById('result').innerHTML = data
}

async function getAI() {

    const response = await fetch('/ai')

    const data = await response.text()

    document.getElementById('result').innerHTML = data
}
