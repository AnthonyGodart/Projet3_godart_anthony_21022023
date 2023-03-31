import { renderWorkList } from "./renderWork.js";

// Afficher la modale OK ---------------------------------------------------------//
// Récupérer les éléments de la modale OK
let modalContainer = document.querySelector(".modal-container");
let modalTriggers = document.querySelectorAll(".modal-trigger");
let modaleAdminProjects = document.querySelector(".modal");
let modaleAddingNewProjects = document.querySelector(".modal2");
let returnArrow = document.querySelector('.return-arrow');
// Ouvrir la modale OK
async function toggleModal(){
    modalContainer.classList.toggle("displayed");
    modaleAddingNewProjects.style.display = "none";
    modaleAdminProjects.style.display = "";
    renderWorkList();
}
modalTriggers.forEach(trigger => trigger.addEventListener('click', toggleModal));
// Créer la fonction pour ouvrir la modale d'ajout d'un nouveau projet OK
function openNewProjectModal(){
    modaleAdminProjects.style.display = "none";
    modaleAddingNewProjects.style.display = "";
    returnArrow.addEventListener('click', () =>{
        modaleAddingNewProjects.style.display = "none";
        modaleAdminProjects.style.display = "";
    });
}
let openModaleAddingNewProjectsButton = document.querySelector('.add-photo');
openModaleAddingNewProjectsButton.addEventListener('click', openNewProjectModal);

export {toggleModal, openNewProjectModal, returnArrow};
