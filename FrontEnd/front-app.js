// Déclaration des variables
// Récupérer les données du Back-end
const workList =
    await fetch("http://localhost:5678/api/works")
    .then(workList => workList.json());

// Récupérer les boutons de la filter-bar
const filterButtons = document.querySelectorAll(".filter")
let clickedButtonId = 0

// Créer les fonctions
// Générer l'affichage dynamique de fiches des travaux avec un data-id intégré: OK
async function generateWorkSheet(){
    const gallery = document.querySelector(".gallery")
    gallery.innerHTML = ''

    for ( let i = 0; i < workList.length; i ++){
        const workElement = document.createElement("figure")
        const imageElement = document.createElement("img")
        imageElement.src = workList[i].imageUrl
        workElement.appendChild(imageElement)
        const titleElement = document.createElement("figcaption")
        titleElement.innerText = workList[i].title
        workElement.appendChild(titleElement)
        workElement.classList.add("sheet")
        const workSheetId = workList[i].categoryId
        workElement.dataset.id = workSheetId
        gallery.appendChild(workElement)
    }
}
// J'adapte generateWorkSheet() pour qu'il n'affiche que les fiches triées : OK
async function filterSheet() {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = '';
    const filteredWorkList = workList.filter(workSheet => workSheet.categoryId == clickedButtonId);

    for (let i = 0; i < filteredWorkList.length; i++) {
        const workElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = filteredWorkList[i].imageUrl;
        workElement.appendChild(imageElement);
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = filteredWorkList[i].title;
        workElement.appendChild(titleElement);
        workElement.classList.add("sheet");
        const workSheetId = filteredWorkList[i].categoryId;
        workElement.dataset.id = workSheetId;
        gallery.appendChild(workElement);
    }
}
// Je change les couleurs des boutons : OK
function changeFilterButtonStyle(button){
    if(button.classList.contains("active")){
        return
    } else {
        button.classList.add("active")
    }
    clickedButtonId = button.getAttribute('data-key')
    for ( const currentButton of filterButtons){
        if(currentButton.getAttribute('data-key') != clickedButtonId){
            currentButton.classList.remove("active")
        }
    }
}
// Créer le listener sur les boutons et afficher le 'data-key' du bouton cliqué OK
function onButtonFilterClick(){
    for(let button of filterButtons){
        button.addEventListener('click', () => {
            //Ici la fonction pour changer la couleur du bouton lors du click : OK
            changeFilterButtonStyle(button)
            //Ici la fonction pour filtrer les <figure> par catégorie (data-id)
            //en fonction du bouton cliqué (data-key)
            if(button.getAttribute('data-key') != 0){
                filterSheet()
            } else {
                generateWorkSheet()
            }
        });
    }
}

// Appel des fonctions
// A la première ouverture de la page web ou à son rechargement
generateWorkSheet()
// Au clic sur le bouton filtre
onButtonFilterClick()


const linkers = [...document.querySelectorAll('li')]
let clickedLink = 0
const linkerHref = ["#portfolio", "#contact", "", "#", "#"]
const windowUrl = window.location.href
for (let i = 0; i< linkers.length; i ++){
    linkers[i].setAttribute("href", linkerHref[i]) 
}

// Générer ma page de connexion en dynamique
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
            loginForm.addEventListener("submit", logUser)

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
        } 
            // Ou revenir au site
        else {
            document.addEventListener('click', (e) =>{
                if(e.target.innerText !== "login"){
                    regenerateMainPage()
                }
            })
        }
    })
}

// Au retour du clic sur le lien LogIn si on fait marche arrière
function regenerateMainPage(){
    window.location.href = windowUrl
}

// Gérer la fonction de connexion de l'utilisateur
async function logUser(event){
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email)
    console.log(password)
    const userLogin = {
        'email': email,
        'password': password
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
        })
    const authorizedLog = await authorizeLog.json()
    localStorage.setItem('userId', authorizedLog.userId)
    localStorage.setItem('token', authorizedLog.token)
        if (authorizedLog != null && 
            authorizedLog.userId == localStorage.getItem('userId') && 
            authorizedLog.token == localStorage.getItem('token')){
            regenerateMainPage()
            // Ici viendra la fonction générant la page d'un utilisateur connecté
        } else {
            alert('Email ou mot de passe incorrect.')
        }
}
