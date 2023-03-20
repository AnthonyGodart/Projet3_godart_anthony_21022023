// Récupérer les données du Back-end OK
const workList =
    await fetch("http://localhost:5678/api/works")
    .then(workList => workList.json())

// Déclaration des variables globales
// Initialiser des listeners
let clickedButtonId = 0
let clickedLink = 0

// Récupérer les boutons de la filter-bar
const filterButtons = document.querySelectorAll(".filter")
// Récupérer les liens "projets", "contact" etc...
const linkers = [...document.querySelectorAll('li')]
// Ajouter un écouteur d'événements à chaque "lien"
linkers.forEach(link => {
    link.addEventListener('click', () => handleLinkClick(link))
})
// Pour leur attribuer des ancres plus tard
const linkerHref = ["#portfolio", "#contact", "", "#", "#"]

// Récupérer le token
const loggedUserToken = sessionStorage.getItem('token')
// Récupérer la barre du mode "édition"
const editBar = document.querySelector('.edit-mode')
// Récupérer le bouton modifier
const modifierButtons = document.querySelectorAll('.modifier-button')
// Récupérer le bouton pour ajouter un projet
const projectAdder = document.querySelector('.add-photo')
// Récupérer le lien pour supprimer toute la galerie
const deleteAllLink = document.querySelector('.delete-link')
// Récupérer la flèche de retour
const returnArrow = document.querySelector('.return-arrow')
// Récupérer le bouton pour ajouter un nouveau projet
const addNewWorkButton = document.querySelector('#add-work-button')

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
// Adapter generateWorkSheet() pour qu'il n'affiche que les fiches triées : OK
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
// Je change les couleurs des boutons de la barre de filtres: OK
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
// Générer ma page de connexion en dynamique OK
function handleLinkClick(link){
    if (link.innerText == "login") {
        // Cacher toutes les sections sauf la page de connexion
        const loginPage = document.getElementById("login-page")
        const sections = document.querySelectorAll('section:not(#login-page)')
        sections.forEach(section => section.style.display = "none")
        loginPage.style.display = ""
        // Ajouter un événement de soumission du formulaire de connexion
        const loginForm = document.getElementById('login-form')
        loginForm.addEventListener("submit", logUser)
    } else if (link.innerText == 'logout') {
        // Réinitialiser le lien de connexion et supprimer le token de session
        link.setAttribute('data-key', 'login')
        link.innerText = "login"
        window.sessionStorage.removeItem('token')
        modifierButtons.forEach(modifierButton =>
            modifierButton.style.display = "none")
        editBar.style.display = "none"
    } else {
        // Rediriger vers la page d'accueil si un autre lien est cliqué
        document.addEventListener('click', (e) =>{
            if(e.target.innerText !== "login"){
                window.location.href = "index.html"
            }
        })
    }
}
// Gérer la fonction de connexion de l'utilisateur OK
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
// Gérer le fonctionnement de la modale OK
async function toggleModal(){
    modalContainer.classList.toggle("displayed")
    modalBox2.style.display = "none"
    modalBox.style.display = ""
    generateModifiableWorkList()
    const deleteButtons = document.querySelectorAll('.delete-button')
for ( let deleteButton of deleteButtons){
    deleteButton.addEventListener('click', () => {
        let id = deleteButton.getAttribute('data-id')
        const bearer = sessionStorage.getItem('token')
        deleteSelectedWork(id, bearer)
    })
}
}
// Gérer l'affichage des projets dans la modale
function generateModifiableWorkList(){
    const galleryModal = document.querySelector(".gallery-modal")
    galleryModal.innerHTML = ''
    for ( let i = 0; i < workList.length; i ++){
        const workElement = document.createElement("figure")
            const trashCan = document.createElement('i')
                    trashCan.classList = "fa-sharp fa-solid fa-trash-can delete-button"
                    trashCan.style.fontSize = "9em"
                    trashCan.style.position = "fixed"
                    trashCan.style.top = "30px"
                    trashCan.style.right = "20px"
                    trashCan.style.color = "white"
                    trashCan.style.background = "black"
                    trashCan.style.cursor = "pointer"
                    trashCan.setAttribute('data-id', workList[i].id)
            workElement.appendChild(trashCan)
            const dragCross = document.createElement('i')
            workElement.addEventListener('mouseover', () => {                
                    dragCross.classList = "fa-solid fa-arrows-up-down-left-right"
                    dragCross.style.fontSize = "9em"
                    dragCross.style.position = "fixed"
                    dragCross.style.top = "30px"
                    dragCross.style.right = "150px"
                    dragCross.style.color = "white"
                    dragCross.style.background = "black"
                    dragCross.style.display = ""
                workElement.appendChild(dragCross)
            })
            workElement.addEventListener('mouseout', () => {
                dragCross.style.display = "none"
            })
            const imageElement = document.createElement("img")
                imageElement.src = workList[i].imageUrl
            workElement.appendChild(imageElement)
            const titleElement = document.createElement("figcaption")
                titleElement.innerText = "éditer"
                titleElement.dataset.id = workList[i].id
                titleElement.style.fontSize = "9em"
                titleElement.style.cursor = "pointer"
            workElement.appendChild(titleElement)
            workElement.classList.add("sheet")
            const workSheetId = workList[i].id
                workElement.dataset.id = workSheetId
        workElement.style.transform = 'scale(0.12)'
        galleryModal.appendChild(workElement)
        }
}
// Créer la fonction de suppression d'un projet par Id
async function deleteSelectedWork(id, bearer){
    const deleteConfirmation = confirm( "Êtes-vous sûre de vouloir supprimer ce projet ?")
    if (deleteConfirmation){
        await fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': '*/*',
            'Authorization': "Bearer " + bearer,
        }})
        .then(response => {
            if (response.ok) {
                console.log('La ressource a été supprimée avec succès');
            } else {
                console.log('La suppression de la ressource a échoué');
            }
        })
        .catch(error => {
            console.log('Une erreur s\'est produite lors de la suppression de la ressource :', error);
        });
    }
    location.reload()
}
// Créer la fonction pour supprimer tous les projets
function deleteAllWorks(){
    alert('Voulez-vous vraiment supprimer tous les projets ?')
}
// Créer la fonction pour ouvrir la modale d'ajout d'un nouveau projet OK
function openNewProjectModal(){
    modalBox.style.display = "none"
    modalBox2.style.display = ""
    returnArrow.addEventListener('click', () =>{
        modalBox2.style.display = "none"
        modalBox.style.display = ""
    })
}
// Afficher une miniature de l'image sélectionnée pour un nouveau projet OK
function updateImageFieldDisplay() {
    while(preview.firstChild) {
      preview.removeChild(preview.firstChild);
    }
    let curFiles = imageField.files;
    if(curFiles.length === 0) {
        let para = document.createElement('p');
        para.textContent = 'No files currently selected for upload';
        preview.appendChild(para);
    } else {
        for (let i = 0; i < curFiles.length; i++) {
            let image = document.createElement('img');
            image.src = window.URL.createObjectURL(curFiles[i]);
            image.style.transform = 'scale(0.15)'
  
            preview.appendChild(image);
        }
    }
}
// Créer la fonction qui ajoute un nouveau projet
function validateNewWork(e){
    e.preventDefault()
    const project = new FormData()
        project.append("image", imageField.files[0])
        project.append("title", titleField.innerText)
        project.append("category", categoryField.value)
        
    const addConfirmation = confirm('Voulez-vous valider ce projet ?')

    if(addConfirmation){
        fetch('http://localhost:5678/api/works',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'multipart/form-data',
                'Authorization': "Bearer " + loggedUserToken,
            },
            body: JSON.stringify(project),
        })
        .then(response => {
            if(response.ok){
                alert('Le projet a bien été ajouté')
                window.location.reload()
            } else {
                alert('Vous n\'avez pas ajouté ce projet')
                window.location.href = 'index.html'
            }
        })
        .catch(error => console.log('Il y a une erreur', error))
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

// Modifier login=>logout et afficher le bouton "modifier" OK
for (let link of linkers){
    const logButton = link.getAttribute('data-key')

    if (logButton == 'login' && loggedUserToken !=null){
        link.setAttribute('data-key', 'logout')
        link.innerText = 'logout'
        modifierButtons.forEach(modifierButton =>
            modifierButton.style.display = "")
        editBar.style.display = ""
    }
}

// Gérer la modale
const modalContainer = document.querySelector(".modal-container")
const modalTriggers = document.querySelectorAll(".modal-trigger")
const modalBox = document.querySelector(".modal")
const modalBox2 = document.querySelector(".modal2")

// Écouter les clics sur les activateurs/désactivateurs de la modale OK
modalTriggers.forEach(trigger => trigger.addEventListener('click', toggleModal))

// Ecouter le click sur le bouton Ajouter une photo OK
projectAdder.addEventListener('click', openNewProjectModal)

// Ecouter le click sur le lien Supprimer la galerie
deleteAllLink.addEventListener('click', deleteAllWorks)

// Gérer l'affichage du bouton valider et en écouter le click
const imageField = document.getElementById('photo-add-field')
const titleField = document.getElementById('photo-title')
const categoryField = document.getElementById('category-selector')
const preview = document.querySelector('.preview')
imageField.addEventListener('change', console.log(imageField.files))
titleField.addEventListener('change', console.log(titleField.innerText))
categoryField.addEventListener('change', console.log(categoryField.value))
// Ecouter l'ajout d'une image pour afficher sa miniature OK
imageField.addEventListener('change', updateImageFieldDisplay)

// Modifier l'affichage du bouton de validation
if( !imageField || !titleField || !categoryField){
    addNewWorkButton.classList.add("inactive")
} else {
    addNewWorkButton.classList.remove("inactive")
    addNewWorkButton.addEventListener('submit', validateNewWork)
}

// Sécuriser le user input du titre pour éviter l'injection html
//titleField.addEventListener('input', () => {
//    if (regex.test(this.value)) {
//        alert('Veuillez ne pas entrer de code HTML dans ce champ')
//        this.value = ''
//    }
//})
