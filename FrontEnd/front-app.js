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

const filterButtons = document.querySelectorAll(".filter")
const workIds = workList.map(id => id.category.id)



for(let button of filterButtons){
    button.addEventListener('click', () => {
        //Ici le code pour filtrer les <figure> par catégorie (data-id)
        let clickedButtonId = button.dataset.id
        for ( let i = workIds.length - 1; i >= 0; i--){
            if(workIds[i].id !== clickedButtonId){
                workIds.splice(i, 1)
            }

        console.log(workIds)
        }
    });
}
