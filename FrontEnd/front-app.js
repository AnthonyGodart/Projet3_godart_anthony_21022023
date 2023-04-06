import { renderWorkList } from "./renderWork.js";
import { handleLinkClick, logUser, userCredentialToken, modifierButtons, editBar } from "./login.js";
import { toggleModal, openNewProjectModal, returnArrow } from "./modal.js";
import { setInitialPreviewField, updateImageInputFieldDisplay } from "./preview.js"
// A la première ouverture de la page web ou à son rechargement OK
renderWorkList();

// Gestion de l"ajout d"un nouveau projet ----------------------------------------//
// Récupérer du formulaire et des champs OK
let addNewProjectForm = document.querySelector("#add-photo-form");
let imageInputField = document.querySelector("#add-photo-field");
let titleInputField = document.querySelector("#photo-title");
let categoryInputField = document.querySelector("#category-selector");
let validateNewProjectAddButton = document.querySelector("#add-project-button");
// Vérifier que les champs soient correctement remplis ------------------//
// Vérifier la complétion des champs titre et catégorie pour activer le bouton Valider OK
addNewProjectForm.addEventListener("input", () => {
    if ( imageInputField.files[0] && titleInputField.value && categoryInputField.value) {
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
                alert("L\'ajout de projet n'a pas abouti");
            };
        })
        .catch(error => console.log("Il y a une erreur", error));
    };    
}
// Écouter la soumission du formulaire OK
addNewProjectForm.addEventListener("submit", (e) => {
    if (!validateFile()) {
        e.preventDefault();
    } else {
        e.preventDefault();    
        validateAddingNewProject();
    }
});

// Écouter les événements relatifs à la prévisualisation half-OK
imageInputField.addEventListener("change", updateImageInputFieldDisplay);
returnArrow.addEventListener("click", () => {
    imageInputField.value = "";
    preview.innerHTML = "";
    setInitialPreviewField();
});

// Unused feature -----------------------------------------------//
// Créer la fonction pour supprimer tous les projets
let deleteAllProjectsLink = document.querySelector(".delete-link")
function deleteAllWorks(){
    alert("Voulez-vous vraiment supprimer tous les projets ?");
}
deleteAllProjectsLink.addEventListener("click", deleteAllWorks);

// Test de rafraîchissement de la page
if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
    console.log("La page a été (re)-chargée");
  } else {
    console.log("La page n'a pas été rechargée");
  }
