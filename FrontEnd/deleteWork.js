import { renderWorkList } from "./renderWork.js";

let workList = [];
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

export { deleteSelectedWork }
