const linkers = [...document.querySelectorAll('li')]
const linkerHref = ["#portfolio", "#contact", "", "#", "#"]
const windowUrl = window.location.href
for (let i = 0; i< linkers.length; i ++){
    linkers[i].setAttribute("href", linkerHref[i]) 
}

for (let link of linkers){
    link.addEventListener('click', () => {
        if (link.innerText == "login"){
            const main = document.querySelector('main')
            main.innerHTML=""

            // Créer le HTML de ma page de connexion
            const loginPage = document.createElement('div')
            loginPage.classList.add("login-page")

            const loginTitle = document.createElement('h2')
            loginTitle.classList.add("login-title")
            loginTitle.innerText = "Log In"

            const loginForm = document.createElement('form')
            loginForm.action = ""
            loginForm.method = "post"
            loginForm.classList.add("login-form")

            const emailInputDiv = document.createElement('div')
            emailInputDiv.classList.add("form-field-div")
            const emailInputLabel = document.createElement('label')
            emailInputLabel.for = "email"
            emailInputLabel.innerText = "E-mail"
                const emailInput = document.createElement('input')
                emailInput.required = true
                emailInput.id = "email"
                emailInput.name = "email"
                emailInput.type = "email"
                emailInput.classList.add("form-field")
                emailInputDiv.appendChild(emailInputLabel)
                emailInputDiv.appendChild(emailInput)
            loginForm.appendChild(emailInputDiv)

            const passwordInputDiv = document.createElement('div')
            passwordInputDiv.classList.add("form-field-div")    
            const passwordInputLabel = document.createElement('label')
            passwordInputLabel.for = "password"
            passwordInputLabel.innerText = "Mot de passe"
                const passwordInput = document.createElement('input')
                passwordInput.required = true
                passwordInput.id = "password"
                passwordInput.name = "password"
                passwordInput.type = "password"
                passwordInput.classList.add("form-field")
                passwordInputDiv.appendChild(passwordInputLabel)
                passwordInputDiv.appendChild(passwordInput)
            loginForm.appendChild(passwordInputDiv)

            const connectInputDiv = document.createElement('div')
            connectInputDiv.classList.add("form-field-div")    

                const connectInput = document.createElement('input')
                connectInput.type = "submit"
                connectInput.value = "Se connecter"
                connectInput.setAttribute("onclick", "logUser")
                connectInput.classList.add("form-button")
                loginForm.appendChild(connectInput)

            const forgottenPasswordLink = document.createElement('a')
            forgottenPasswordLink.classList.add("forgottenPasswordLink")
            forgottenPasswordLink.innerText = "Mot de passe oublié"


            // Passer le HTML de la page de connexion à mon site
            loginPage.appendChild(loginTitle)
            loginPage.appendChild(loginForm)
            loginPage.appendChild(forgottenPasswordLink)
            main.appendChild(loginPage)
        } else {
            document.addEventListener('click', (e) =>{
                if(e.target.innerText !== "login"){
                    window.location.href = windowUrl
                } else {
                    if(e.target.innerText == "projets"){
                        document.location.hash = "portfolio"
                    } else if (e.target.innerText == "contact"){
                        document.location.hash = "contact"
                    }
                }
            })
        }
    })
}

async function logUser(){

let userEmail = document.getElementById('email')
let userPassword = document.getElementById('password')
const userLogin = {
    email: userEmail,
    password: userPassword
}
const authorizeLog = 
    await fetch("http://localhost:5678/api/users/login",
    {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(userLogin)
    }).then(authorizeLog => authorizeLog.json())

console.log(authorizeLog)
}
