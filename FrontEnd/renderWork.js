import { deleteSelectedWork } from "./deleteWork.js";

let workList = [];
let filterButtons = document.querySelectorAll(".filter");
let clickedButtonId = 0;
// Fonction principale : Afficher en dynamique les fiches des travaux avec un data-id intégré: OK
// Dans la page principale et dans la modale OK
async function renderWorkList(){
    workList = await fetch("http://localhost:5678/api/works")
        .then(workList => workList.json());
    // Affichage des projets dans le portfolio
    let gallery = document.querySelector(".gallery");
    gallery.innerHTML = '';
    workList.forEach((workItem) => {
        const workElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = workItem.imageUrl;
        workElement.appendChild(imageElement);
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = workItem.title;
        workElement.appendChild(titleElement);
        workElement.classList.add("sheet");
        workElement.dataset.id = workItem.categoryId;
        gallery.appendChild(workElement);
    });      

    // Affichage des projets dans la modale
    let galleryModal = document.querySelector(".gallery-modal");
    galleryModal.innerHTML = '';
    workList.forEach((workItem) => {
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
                    trashCan.setAttribute('data-id', workItem.id);
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
                imageElement.src = workItem.imageUrl;
            workElement.appendChild(imageElement);
            let titleElement = document.createElement("figcaption");
                titleElement.innerText = "éditer";
                titleElement.dataset.id = workItem.id;
                titleElement.style.fontSize = "9em";
                titleElement.style.cursor = "pointer";
            workElement.appendChild(titleElement);
            workElement.classList.add("sheet");
            let workSheetId = workItem.id;
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
    });

    // Appeler la fonction pour filtrer les projets et modifier la couleur des boutons OK
    onButtonFilterClick();
}
// Filtrer les projets et modifier l'affichage des boutons de filtre OK
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
// Je change les couleurs des boutons de la barre de filtres en fonction de celui sélectionné OK
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
            // Changer la couleur du bouton lors du click OK
            changeFilterButtonStyle(button);
            //Appel de la fonction pour filtrer les projets par catégorie (data-id) en fonction du bouton cliqué (data-key) OK
            if(button.getAttribute('data-key') != 0){
                filterSheet();
            } else {
                renderWorkList();
            };
        });
    };
}

export {renderWorkList};
