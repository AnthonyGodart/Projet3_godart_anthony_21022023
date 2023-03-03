// Déclaration des variables globales
// Initialiser des listeners
let clickedButtonId = 0
let clickedLink = 0
// Récupérer le token
let loggedUserToken = sessionStorage.getItem('token')
// Récupérer les boutons de la filter-bar
const filterButtons = document.querySelectorAll(".filter")
// Récupérer les liens "projets", "contact" etc...
const linkers = [...document.querySelectorAll('li')]
// Récupérer le bouton modifier
let modifierButton = document.getElementById('modifier-button')
// Pour leur attribuer des ancres plus tard
const linkerHref = ["#portfolio", "#contact", "", "#", "#"]
// Récupérer les données du Back-end
const workList =
    await fetch("http://localhost:5678/api/works")
    .then(workList => workList.json());

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
// Gérer la fonction de connexion de l'utilisateur
async function logUser(event){
    event.preventDefault();
    const userLogin = {
        'email': document.getElementById('emailUser').value,
        'password': document.getElementById('passwordUser').value
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
        if (authorizedLog != null && 
            authorizedLog.userId !=0 && 
            authorizedLog.token != null){
                window.sessionStorage.setItem('token', authorizedLog.token)
                window.location.href = "index.html"
        } else {
            alert('Email ou mot de passe incorrect.')
            if(loggedUserToken != null){
                window.sessionStorage.removeItem('token')
            }
        }
}

// Appel des fonctions
// A la première ouverture de la page web ou à son rechargement
generateWorkSheet()
// Au clic sur le bouton filtre
onButtonFilterClick()

// Affecter des ancres aux liens clicables
for (let i = 0; i< linkers.length; i ++){
    linkers[i].setAttribute("href", linkerHref[i]) 
}
// Générer ma page de connexion en dynamique
for (let link of linkers){
    link.addEventListener('click', () => {
        if (link.innerText == "login"){
            const sections = document.querySelectorAll('section')
            for (let section of sections){
                const loginPage = document.getElementById("login-page")
                const sectionId = section.getAttribute('id')
                if(!section.style.display && sectionId != loginPage.id){
                    section.style.display = "none"
                }
                loginPage.style.display = ""
            }            
            const loginForm = document.getElementById('login-form')
            loginForm.addEventListener("submit", logUser)
        } else if(link.innerText == 'logout'){
            link.setAttribute('data-key', 'login')
            link.innerText = "login"
            window.sessionStorage.removeItem('token')
            modifierButton.style.display = "none"
        } else {
            document.addEventListener('click', (e) =>{
                if(e.target.innerText !== "login"){
                    window.location.href = "index.html"
                }
            })
        }
    })
}
// Modifier login=>logout et afficher le bouton "modifier"
for (let link of linkers){
    let logButton = link.getAttribute('data-key')
    if (logButton == 'login' && loggedUserToken !=null){
        link.setAttribute('data-key', 'logout')
        link.innerText = 'logout'
        modifierButton.style.display = ""
    }
}

let modal = null
const modalOpenner = document.querySelector('.js-modal-openner')
//modalOpenner.addEventListener('click', openModal)

function openModal(e){
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute('href')) 
    target.style.display = ""
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal, true')
    modal = target
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-close-modal').addEventListener('click', closeModal)
}

function closeModal(e){
    if (modal == null) return
    e.preventDefault() 
    modal.style.display = "none"
    modal.setAttribute('aria-hidden', true)
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-close-modal').removeEventListener('click', closeModal)
    modal = null
}

modalOpenner.addEventListener('click', openModal)