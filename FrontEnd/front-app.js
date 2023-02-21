// Générer la liste des travaux de façon dynamique

const workList = await fetch("http://localhost:5678/api/works")
    .then(workList => workList.json());

async function generateWorkSheet(workList){

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

        gallery.appendChild(workElement)
    }
}

generateWorkSheet(workList);

// Créer les filtres en fonction de la catégorie
function changeButtonStyle(button){
    if(button.classList.contains("active")){
        return
    } else {
        button.classList.add("active")
    }
    clickedButtonId = button.getAttribute('data-id')
    for ( let i = 0; i < filterButtons.length; i++){
        if(filterButtons[i].getAttribute('data-id') != clickedButtonId){
            filterButtons[i].classList.remove("active")
        }
    }
}

const filterButtons = document.querySelectorAll(".filter")
const workIds = workList.map(id => id.category.id)
let clickedButtonId = 0

for(let button of filterButtons){
    button.addEventListener('click', () => {
        changeButtonStyle(button)
        //Ici le code pour filtrer les <figure> par catégorie (data-id)

        for ( let i = workIds.length - 1; i >= 0; i--){
            console.log(clickedButtonId)
            if(workIds[i] !== clickedButtonId){
                workIds.splice(i, 1)
            }
        console.log(workIds)
        }
    });
}
