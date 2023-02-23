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
function filterSheet() {
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
    for ( let i = 0; i < filterButtons.length; i++){
        if(filterButtons[i].getAttribute('data-key') != clickedButtonId){
            filterButtons[i].classList.remove("active")
        }
    }
}
// Créer le listener sur les boutons et afficher le 'data-key' du bouton cliqué OK
function onClick(){
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
onClick()
