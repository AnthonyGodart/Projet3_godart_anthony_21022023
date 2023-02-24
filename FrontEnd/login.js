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
            loginForm.classList.add("login-form")

            const emailInput = document.createElement('input')
            emailInput.type = "email"
            emailInput.placeholder = "E-mail"
            emailInput.classList.add("form-field")
            loginForm.appendChild(emailInput)

            const passwordInput = document.createElement('input')
            passwordInput.type = "password"
            passwordInput.placeholder ="Mot de passe"
            passwordInput.classList.add("form-field")
            loginForm.appendChild(passwordInput)

            const connectInput = document.createElement('input')
            connectInput.type = "button"
            connectInput.value = "Se connecter"
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
                        window.location.hash = "#portfolio"
                    } else if (e.target.innerText = "contact"){
                        window.location.hash = "#contact"
                    }
                }
            })
        }
    })
}