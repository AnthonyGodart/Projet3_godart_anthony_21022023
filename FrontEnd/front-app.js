import { renderWorkList } from "./renderWork.js";
import { handleLinkClick, logUser, userCredentialToken, modifierButtons, editBar } from "./login.js";
import { toggleModal, openNewProjectModal, returnArrow } from "./modal.js";

// A la première ouverture de la page web ou à son rechargement OK
renderWorkList();

// Gestion de l"ajout d"un nouveau projet ----------------------------------------//
// Récupérer le champ de prévisualisation OK
let preview = document.querySelector("#preview");
// Re-créer l'aspect initial du champ de prévisualisation OK
function setInitialPreviewField(){
    let icon = document.createElement("label");
        icon.innerHTML = `<i class="fa-regular fa-image frame-picture"></i>`;
        icon.setAttribute("for", "add-photo-field");
    let imageInputButton = document.createElement("label");
        imageInputButton.innerText = "+ Ajouter photo";
        imageInputButton.classList = "photo-input-button";
        imageInputButton.setAttribute("for", "add-photo-field");
    let input = document.createElement("input");
        input.setAttribute("id", "add-photo-field");
        input.classList ="reset-input";
        input.setAttribute("type", "file");
        input.setAttribute("name", "add-photo-field");
        input.setAttribute("value", "");
        input.setAttribute("required", "true");
        input.setAttribute("accept", ".jpg, .png");
        input.setAttribute("style", "opacity: 0;");
    let para = document.createElement("p");
        para.innerText = "jpg, png : 4Mo max";
    preview.appendChild(icon);
    preview.appendChild(imageInputButton);
    preview.appendChild(input);
    preview.appendChild(para);
}

// Écouter la sélection d"une image pour afficher sa miniature OK
let imageInputField = document.querySelector("#add-photo-field");
imageInputField.addEventListener("change", updateImageInputFieldDisplay);

// Récupérer les champs du formulaire OK
let titleInputField = document.querySelector("#photo-title");
let categoryInputField = document.querySelector("#category-selector");
let validateNewProjectAddButton = document.querySelector("#add-project-button");

// Vérifier que les champs soient correctement remplis pour activer le bouton de validation ------------------//
// Récupération du formulaire OK
let addNewProjectForm = document.querySelector("#add-photo-form");
// Ajout d"un gestionnaire d"événements pour écouter la soumission du formulaire OK
addNewProjectForm.addEventListener("submit", (e) => {
    e.preventDefault();    
    validateAddingNewProject();
});
// Écouter la complétion des champs de formulaire pour activer le bouton de validation OK
addNewProjectForm.addEventListener("input", () => {
    // Vérification des champs de formulaire
    if (titleInputField.value && categoryInputField.value) {
        validateNewProjectAddButton.classList.remove("inactive");
        validateNewProjectAddButton.disabled = false;
    } else {
        validateNewProjectAddButton.classList.add("inactive");
        validateNewProjectAddButton.disabled = true;
    };
});
// Vérifier la taille du fichier 4Mo Max OK
function validateFile(){
    if (imageInputField.files[0].size > 4000000) {
        alert("Le fichier ne doit pas dépasser 4Mo");
        return false;
    }
    return true;
}
addNewProjectForm.addEventListener("submit", (e) => {
    if (!validateFile()) {
      e.preventDefault();
    };
})

// Créer la fonction qui ajoute un nouveau projet OK
async function validateAddingNewProject(){
    // Créer le formData pour ajouter un nouveau projet OK
    const newProject = new FormData();
    newProject.append("image", imageInputField.files[0]);
    newProject.append("title", titleInputField.value);
    newProject.append("category", categoryInputField.value);

    let addConfirmation = confirm("Voulez-vous valider ce projet ?");
    if(addConfirmation){
        await fetch("http://localhost:5678/api/works",{
            method: "POST",
            headers: {
                "Authorization": "Bearer " + userCredentialToken,
            },
            body: newProject,
        })
        .then(response => {
            if(response.ok){               
                console.log('le projet a bien été ajouté');
                window.location.href = "index.html";
            } else {
                alert("Il faut ajouter une photo pour pouvoir ajouter le projet");
            };
        })
        .catch(error => console.log("Il y a une erreur", error));
    };    
}

// Afficher une miniature de l"image sélectionnée dans le formulaire d"ajout nouveau projet : half-OK
function updateImageInputFieldDisplay() {
    while(preview.firstChild){
        preview.removeChild(preview.firstChild);
    };
    let curFiles = imageInputField.files;
    if(curFiles.length === 0){
        setInitialPreviewField();
    } else {
        for (let i = 0; i < curFiles.length; i++) {
            let image = document.createElement("img");
            image.src = window.URL.createObjectURL(curFiles[i]);
            image.style.maxHeight = "170px";
            image.style.maxWidth ="129px";
            preview.appendChild(image);
        };
    }
}
returnArrow.addEventListener("click", () => {
    imageInputField.value = "";
    preview.innerHTML = "";
    setInitialPreviewField();
});

// Unused features -----------------------------------------------//
// Créer la fonction pour supprimer tous les projets
let deleteAllProjectsLink = document.querySelector(".delete-link")
function deleteAllWorks(){
    alert("Voulez-vous vraiment supprimer tous les projets ?");
}
deleteAllProjectsLink.addEventListener("click", deleteAllWorks);

// Test de rafraîchissement de la page

if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
    console.log("La page a été rafraîchie");
  } else {
    console.log("La page n'a pas été rafraîchie");
  }
