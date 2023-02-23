// Déclaration des variables
// Récupérer les données du Back-end
const workList = await fetch("http://localhost:5678/api/works")
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
generateWorkSheet(workList)
// Changer les couleurs des boutons : OK
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
// Créer le listener sur les boutons
function onClick(){
    for(let button of filterButtons){
        button.addEventListener('click', () => {
            //Ici la fonction pour changer la couleur du bouton lors du click : OK
            changeFilterButtonStyle(button)
            //Ici la fonction pour filtrer les <figure> par catégorie (data-id)
            //en fonction du bouton cliqué (data-key)
            const buttonKey = button.getAttribute('data-key')
            console.log(buttonKey)
        });
    }
}
onClick()

// Générer les Ids des fiches
/**function generateWorkSheetId(){
    const workSheetList = new Set(workList)
    const workSheetListData = workSheetList.entries()
    for ( const data of workSheetListData ){
        const sheetId = data[0].categoryId
        console.log(sheetId)
    }
}
generateWorkSheetId()**/

// Filtrer les fiches de travail par catégorie au click sur les boutons filtres
//const sheetList = document.querySelectorAll(".sheet")


