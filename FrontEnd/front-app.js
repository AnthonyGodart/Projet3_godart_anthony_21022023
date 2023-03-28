// DECLARATION DES VARIABLES GLOBALES ------------------------------------------------------//
// Récupérer les données du Back-end OK
let workList = []
let userCredentialToken = sessionStorage.getItem('token')

// Récupérer les boutons de la filter-bar OK
let filterButtons = document.querySelectorAll(".filter")
let clickedButtonId = 0;
// Gérer la disparition de la barre de filtres si l'admin est connecté OK
let filterBar = document.querySelector('#filter-bar');
if(userCredentialToken){
        filterBar.style.display = "none";
}

// Récupérer les liens "projets", "contact" etc...
let linkers = [...document.querySelectorAll('li')]
// Ajouter un écouteur d'événements à chaque "lien"
linkers.forEach(link => {
    link.addEventListener('click', () => handleLinkClick(link))
})
// Affecter des ancres aux liens clicables
let linkerHref = ["#portfolio", "#contact", "", "#", "#"]
for (let i = 0; i< linkers.length; i ++){
    linkers[i].setAttribute("href", linkerHref[i]);
}

let editBar = document.querySelector('.edit-mode')
let modifierButtons = document.querySelectorAll('.modifier-button')
// Récupérer les éléments de la modale
let modalContainer = document.querySelector(".modal-container")
let modalTriggers = document.querySelectorAll(".modal-trigger")
let modaleAdminProjects = document.querySelector(".modal")
let modaleAddingNewProjects = document.querySelector(".modal2")
let returnArrow = document.querySelector('.return-arrow')
// Récupérer les élements du formulaire d'ajout de nouveau projet
let preview = document.querySelector('#preview');
function setInitialPreviewField(){
    let icon = document.createElement('label');
        icon.innerHTML = `<i class="fa-regular fa-image frame-picture"></i>`;
        icon.setAttribute('for', 'add-photo-field');
    let imageInputButton = document.createElement('label');
        imageInputButton.innerText = "+ Ajouter photo";
        imageInputButton.classList = "photo-input-button";
        imageInputButton.setAttribute('for', 'add-photo-field');
    let input = document.createElement('input');
        input.setAttribute('id', "add-photo-field");
        input.classList ="reset-input";
        input.setAttribute('type', "file");
        input.setAttribute('name', "add-photo-field");
        input.setAttribute('value', "");
        input.setAttribute('required', 'true');
        input.setAttribute('accept', ".jpg, .png");
        input.setAttribute('style', "opacity: 0;");
    let para = document.createElement('p');
        para.innerText = "jpg, png : 4Mo max";
    preview.appendChild(icon);
    preview.appendChild(imageInputButton);
    preview.appendChild(input);
    preview.appendChild(para);
}
//setInitialPreviewField();
// Écouter la sélection d'une image pour afficher sa miniature OK
let imageInputField = document.querySelector('#add-photo-field');
imageInputField.addEventListener('change', updateimageInputFieldDisplay);
let titleInputField = document.querySelector('#photo-title');
let categoryInputField = document.querySelector('#category-selector');
let validateNewProjectAddButton = document.querySelector('#add-project-button');

// CREATIONS DES FONCTIONS --------------------------------------------------------------------//
// Fonction principale : Afficher en dynamique les fiches des travaux avec un data-id intégré: OK
// Dans la page principale et dans la modale OK
async function renderWorkList(){
    workList = await fetch("http://localhost:5678/api/works")
        .then(workList => workList.json());

    let gallery = document.querySelector(".gallery");
    gallery.innerHTML = '';

    for ( let i = 0; i < workList.length; i ++){
        let workElement = document.createElement("figure");
        let imageElement = document.createElement("img");
        imageElement.src = workList[i].imageUrl;
        workElement.appendChild(imageElement);
        let titleElement = document.createElement("figcaption");
        titleElement.innerText = workList[i].title;
        workElement.appendChild(titleElement);
        workElement.classList.add("sheet");
        let workSheetId = workList[i].categoryId;
        workElement.dataset.id = workSheetId;
        gallery.appendChild(workElement);
    };

    let galleryModal = document.querySelector(".gallery-modal");
    galleryModal.innerHTML = '';
    for ( let j = 0; j < workList.length; j ++){
        let workElement = document.createElement("figure");
            let trashCan = document.createElement('i');
                    trashCan.classList = "fa-sharp fa-solid fa-trash-can delete-button";
                    trashCan.style.fontSize = "9em";
                    trashCan.style.position = "fixed";
                    trashCan.style.top = "30px";
                    trashCan.style.right = "20px";
                    trashCan.style.color = "white";
                    trashCan.style.background = "black";
                    trashCan.style.cursor = "pointer";
                    trashCan.setAttribute('data-id', workList[j].id);
            workElement.appendChild(trashCan);
            let dragCross = document.createElement('i');
            workElement.addEventListener('mouseover', () => {                
                    dragCross.classList = "fa-solid fa-arrows-up-down-left-right";
                    dragCross.style.fontSize = "9em";
                    dragCross.style.position = "fixed";
                    dragCross.style.top = "30px";
                    dragCross.style.right = "150px";
                    dragCross.style.color = "white";
                    dragCross.style.background = "black";
                    dragCross.style.display = "";
                workElement.appendChild(dragCross);
            })
            workElement.addEventListener('mouseout', () => {
                dragCross.style.display = "none";
            })
            let imageElement = document.createElement("img");
                imageElement.src = workList[j].imageUrl;
            workElement.appendChild(imageElement);
            let titleElement = document.createElement("figcaption");
                titleElement.innerText = "éditer";
                titleElement.dataset.id = workList[j].id;
                titleElement.style.fontSize = "9em";
                titleElement.style.cursor = "pointer";
            workElement.appendChild(titleElement);
            workElement.classList.add("sheet");
            let workSheetId = workList[j].id;
                workElement.dataset.id = workSheetId;
        workElement.style.transform = 'scale(0.12)';
        galleryModal.appendChild(workElement);
        let deleteButtons = document.querySelectorAll('.delete-button');
        for ( let deleteButton of deleteButtons){
            deleteButton.addEventListener('click', () => {
                let id = deleteButton.getAttribute('data-id');
                let bearer = sessionStorage.getItem('token');
                deleteSelectedWork(id, bearer);
            });
        };
    };
    // Au clic sur le bouton filtre
    onButtonFilterClick()
}
// Filtrer les projets et modifier l'affichage des boutons de filtre: OK
async function filterSheet() {
    let gallery = document.querySelector(".gallery");
    gallery.innerHTML = '';
    let filteredWorkList = workList.filter(workSheet => workSheet.categoryId == clickedButtonId);
    for (let i = 0; i < filteredWorkList.length; i++) {
        let workElement = document.createElement("figure");
        let imageElement = document.createElement("img");
        imageElement.src = filteredWorkList[i].imageUrl;
        workElement.appendChild(imageElement);
        let titleElement = document.createElement("figcaption");
        titleElement.innerText = filteredWorkList[i].title;
        workElement.appendChild(titleElement);
        workElement.classList.add("sheet");
        let workSheetId = filteredWorkList[i].categoryId;
        workElement.dataset.id = workSheetId;
        gallery.appendChild(workElement);
    };
}
// Je change les couleurs des boutons de la barre de filtres en fonction de celui sélectionné: OK
function changeFilterButtonStyle(button){
    if(button.classList.contains("active")){
        return;
    } else {
        button.classList.add("active");
    }
    clickedButtonId = button.getAttribute('data-key');
    for ( let currentButton of filterButtons){
        if(currentButton.getAttribute('data-key') != clickedButtonId){
            currentButton.classList.remove("active");
        };
    };
}
// Créer le listener sur les boutons et afficher le 'data-key' du bouton cliqué OK
function onButtonFilterClick(){
    for(let button of filterButtons){
        button.addEventListener('click', () => {
            //Ici la fonction pour changer la couleur du bouton lors du click : OK
            changeFilterButtonStyle(button);
            //Ici la fonction pour filtrer les projets par catégorie (data-id) en fonction du bouton cliqué (data-key)
            if(button.getAttribute('data-key') != 0){
                filterSheet();
            } else {
                renderWorkList();
            };
        });
    };
}
// APPEL DE LA FONCTION :
// A la première ouverture de la page web ou à son rechargement
renderWorkList();

// Gestion de la connexion de l'utilisateur OK
// Afficher ma page de connexion en dynamique OK
function handleLinkClick(link){
    if (link.innerText == "login") {
        // Cacher toutes les sections sauf la page de connexion
        let loginPage = document.getElementById("login-page");
        let sections = document.querySelectorAll('section:not(#login-page)');
        sections.forEach(section => section.style.display = "none");
        loginPage.style.display = "";
        // Ajouter un événement de soumission du formulaire de connexion
        let loginForm = document.getElementById('login-form');
        loginForm.addEventListener("submit", logUser);
    } else if (link.innerText == 'logout') {
        // Réinitialiser le lien de connexion et supprimer le token de session
        link.setAttribute('data-key', 'login');
        link.innerText = "login";
        window.sessionStorage.removeItem('token');
        modifierButtons.forEach(modifierButton =>
            modifierButton.style.display = "none");
        editBar.style.display = "none";
        filterBar.style.display = "";
    } else {
        // Rediriger vers la page d'accueil si un autre lien est cliqué
        document.addEventListener('click', (e) =>{
            if(e.target.innerText !== "login"){
                window.location.href = "index.html";
            };
        });
    }
}
// Connexion de l'utilisateur OK
async function logUser(event){
    event.preventDefault();
    let userLogin = {
        'email': document.getElementById('emailUser').value,
        'password': document.getElementById('passwordUser').value
    };
    let authorizeLog = 
        await fetch("http://localhost:5678/api/users/login",
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(userLogin)
        });
    let authorizedLog = await authorizeLog.json()
        if (authorizedLog != null && 
            authorizedLog.userId !=0 && 
            authorizedLog.token != null){
                window.sessionStorage.setItem('token', authorizedLog.token);
                window.location.href = "index.html";
        } else {
            alert('Email ou mot de passe incorrect.');
            if(userCredentialToken != null){
                window.sessionStorage.removeItem('token');
            };
        };
}

// Afficher la modale OK
async function toggleModal(){
    modalContainer.classList.toggle("displayed");
    modaleAddingNewProjects.style.display = "none";
    modaleAdminProjects.style.display = "";
    renderWorkList();
    // Ecouter le click sur le bouton Ajouter une photo pour afficher le formulaire d'ajout de projet OK
    let openModaleAddingNewProjectsButton = document.querySelector('.add-photo')
    openModaleAddingNewProjectsButton.addEventListener('click', openNewProjectModal);
    // Ecouter le click sur le lien Supprimer la galerie
    let deleteAllProjectsLink = document.querySelector('.delete-link')
    deleteAllProjectsLink.addEventListener('click', deleteAllWorks);
}
// Créer la fonction de suppression d'un projet par Id OK
async function deleteSelectedWork(id, bearer){
    let deleteConfirmation = confirm("Êtes-vous sûre de vouloir supprimer ce projet ?");
    if (deleteConfirmation){
        await fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': '*/*',
            'Authorization': "Bearer " + bearer,
        }})
        .then(async response => {
            if (response.ok) {
                document.querySelector('.gallery-modal').innerHTML = '';
                document.querySelector('.gallery').innerHTML = '';
                workList =
                    await fetch("http://localhost:5678/api/works")
                    .then(workList => workList.json())
                    .then(renderWorkList())
                console.log('La ressource a été supprimée avec succès');
            } else {
                console.log('La suppression de la ressource a échoué');
            }
        })
        .catch(error => {
            console.log('Une erreur s\'est produite lors de la suppression de la ressource :', error);
        });
    };
}
// Créer la fonction pour supprimer tous les projets
function deleteAllWorks(){
    alert('Voulez-vous vraiment supprimer tous les projets ?');
}

// Créer la fonction pour ouvrir la modale d'ajout d'un nouveau projet OK
function openNewProjectModal(){
    modaleAdminProjects.style.display = "none";
    modaleAddingNewProjects.style.display = "";
    returnArrow.addEventListener('click', () =>{
        modaleAddingNewProjects.style.display = "none";
        modaleAdminProjects.style.display = "";
    });
}
// Afficher une miniature de l'image sélectionnée dans le formulaire d'ajout nouveau projet : half OK
function updateimageInputFieldDisplay() {
    while(preview.firstChild){
        preview.removeChild(preview.firstChild);
    };
    let curFiles = imageInputField.files;
    if(curFiles === 0){
        setInitialPreviewField();
    } else {
        for (let i = 0; i < curFiles.length; i++) {
            let image = document.createElement('img');
            image.src = window.URL.createObjectURL(curFiles[i]);
            image.style.maxHeight = '163px';
            image.style.maxWidth ='123px';
            preview.appendChild(image);
        };
    }
}
// Créer la fonction qui ajoute un nouveau projet
async function validateAddingNewProject(){
    await Promise.all([imageInputField, titleInputField, categoryInputField].map(field => field.updateComplete));
    // Créer le formData pour ajouter un nouveau projet
    const newProject = new FormData();
    newProject.append('image', imageInputField.files[0], imageInputField.files[0].name);
    newProject.append('title', titleInputField.value);
    newProject.append('category', categoryInputField.value);
    console.log('image : ', imageInputField.files[0], imageInputField.files[0].name);
    console.log('title : ', titleInputField.value, titleInputField.name);
    console.log('category : ', categoryInputField.value, categoryInputField.name);
    console.log('le form data', newProject);
    debugger
    let addConfirmation = confirm('Voulez-vous valider ce projet ?');
    console.log('voici la valeur de addConfirmation', addConfirmation);
    if(addConfirmation){
        await fetch('http://localhost:5678/api/works',{
            method: 'POST',
            headers: {
                'Authorization': "Bearer " + userCredentialToken,
                'Content-Type': 'multipart/form-data',
            },
            body: newProject,
        })
        .then(response => {
            if(response.ok){
                alert('Le projet a bien été ajouté');
            } else {
                alert('Il faut ajouter une photo pour pouvoir ajouter le projet');
            };
        })
        .catch(error => console.log('Il y a une erreur', error));
    };
}
validateNewProjectAddButton.addEventListener('click', validateAddingNewProject);

// FEATURES ---------------------------------------------------------------------------------------//
// Modifier login=>logout et afficher le bouton "modifier" OK
for (let link of linkers){
    let logButton = link.getAttribute('data-key');

    if (logButton == 'login' && userCredentialToken !=null){
        link.setAttribute('data-key', 'logout');
        link.innerText = 'logout';
        modifierButtons.forEach(modifierButton =>
            modifierButton.style.display = "");
        editBar.style.display = "";
    };
}

// Écouter les clics sur les activateurs/désactivateurs de la modale OK
modalTriggers.forEach(trigger => trigger.addEventListener('click', toggleModal));

// Vérifier que les champs soient correctement remplis pour activer le bouton de validation ------------------//
// Récupération du formulaire
let addNewProjectForm = document.querySelector('#add-photo-form');
// Ajout d'un gestionnaire d'événements pour écouter la soumission du formulaire
addNewProjectForm.addEventListener('submit', (e) => {
    // Empêcher la soumission du formulaire si le bouton est désactivé
    if (validateNewProjectAddButton.disabled) {
    e.preventDefault();
    return false;
    };
});
// Écouter la complétion des champs de formulaire pour activer le bouton de validation
addNewProjectForm.addEventListener('input', () => {
    // Vérification des champs de formulaire
    if (titleInputField.value && categoryInputField.value) {
        validateNewProjectAddButton.classList.remove('inactive');
        validateNewProjectAddButton.disabled = false;
    } else {
        validateNewProjectAddButton.classList.add('inactive');
        validateNewProjectAddButton.disabled = true;
    };
});
// Vérifier la taille du fichier 4Mo Max
function validateFile() {
    let fileInput = document.getElementById('add-photo-field');
    if (fileInput.files[0].size > 4000000) {
        alert('Le fichier ne doit pas dépasser 4Mo');
        return false;
    }
    return true;
}
addNewProjectForm.addEventListener('submit', (e) => {
    if (!validateFile()) {
      e.preventDefault();
    };
})

// Écouter les événements lorsqu'on sort de la modale -------------------------------------//
// Ajout des événements click pour le bouton de fermeture du modal et la flèche de retour
//modalTriggers.forEach(trigger => trigger.addEventListener('click', resetForm));
//returnArrow.addEventListener('click', resetForm);
// Réinitialiser le formulaire
//function resetForm() {
//    if (imageInputField.value != ''){
//    // Réinitialisation du champ d'entrée de l'image
//    imageInputField.value = '';
//    // Réinitialisation de la prévisualisation de l'image
//    preview.removeChild(preview.firstChild);
//    setInitialPreviewField();
//    }
//    // Réinitialisation du formulaire
//    addNewProjectForm.reset();
//}
