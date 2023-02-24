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
/** // Je tente de créer la filter-bar en dynamique
const categoryId = Array.from(new Set(workList.map(work => work.categoryId)))
categoryId.push(0)
function generateFilterBar(){
    const filterBar = document.querySelector(".filter-bar");
 
    for (let i = 0; i < categoryId.length; i++) {
        const category = categoryId[i];
        const button = document.createElement("button");
        button.innerText = categoryId[i];
        button.setAttribute("data-key", category);
        button.setAttribute("type", "button")
        button.classList.add("filter");
        filterBar.appendChild(button);
    }
}**/
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
function onButtonFilterClick(){
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
onButtonFilterClick()
// Au retour du clic sur le lien LogIn si on fait marche arrière
function regenerateMainPage(){
const main = document.querySelector("main")
if ( main.innerHTML == null){
    const introduction = document.createElement('section')
        introduction.setAttribute("id", "introduction")
        const introductionImgHolder = document.createElement('figure')
            const introductionImg = document.createElement('img')
                introductionImg.src ="./assets/images/sophie-bluel.png"
        introductionImgHolder.appendChild(introductionImg)
        const introductionArticle = document.createElement('article')
            const introductionArticleTitle = document.createElement('h2')
                introductionArticleTitle.innerText = "Designer d'espace"
            const introductionArticlePOne = document.createElement('p')
                introductionArticlePOne.innerText = "Je raconte votre histoire, je valorise vos idées. Je vous accompagne de la conception à la livraison finale du chantier."
            const introductionArticlePTwo = document.createElement('p')
                introductionArticlePTwo.innerText = "Chaque projet sera étudié en commun, de façon à mettre en valeur les volumes, les matières et les couleurs dans le respect de l’esprit des lieux et le choix adapté des matériaux. Le suivi du chantier sera assuré dans le souci du détail, le respect du planning et du budget."
            const introductionArticlePThree = document.createElement('p')
                introductionArticlePThree.innerText = "En cas de besoin, une équipe pluridisciplinaire peut-être constituée : architecte DPLG, décorateur(trice)"
        introductionArticle.appendChild(introductionArticleTitle)
        introductionArticle.appendChild(introductionArticlePOne)
        introductionArticle.appendChild(introductionArticlePTwo)
        introductionArticle.appendChild(introductionArticlePThree)
    const portfolio = document.createElement('section')
        portfolio.setAttribute("id", "portfolio")
        const portfolioTitle = document.createElement('h2')
            portfolioTitle.innerText = "Mes Projets"
        const portfolioFilterBar = document.createElement('nav')
            portfolioFilterBar.classList.add("filter-bar")
            const buttonZero = document.createElement('button')
                buttonZero.classList.add("filter active")
                buttonZero.setAttribute("type", "button")
                buttonZero.setAttribute("data-key", "0")
                buttonZero.innerText = "Tous"
            const buttonOne = document.createElement('button')
                buttonOne.classList.add("filter")
                buttonOne.setAttribute("type", "button")
                buttonOne.setAttribute("data-key", "1")
                buttonOne.innerText = "Objets"
            const buttonTwo = document.createElement('button')
                buttonTwo.classList.add("filter")
                buttonTwo.setAttribute("type", "button")
                buttonTwo.setAttribute("data-key", "2")
                buttonTwo.innerText = "Appartements"
            const buttonThree = document.createElement('button')
                buttonThree.classList.add("filter")
                buttonThree.setAttribute("type", "button")
                buttonThree.setAttribute("data-key", "3")
                buttonThree.innerText = "Hôtels et restaurants"
            portfolioFilterBar.appendChild(buttonZero)
            portfolioFilterBar.appendChild(buttonOne)
            portfolioFilterBar.appendChild(buttonTwo)
            portfolioFilterBar.appendChild(buttonThree)
        const portfolioGallery = document.createElement('div')
            portfolioGallery.classList.add("gallery")
        portfolio.appendChild(portfolioTitle)
        portfolio.appendChild(portfolioFilterBar)
        portfolio.appendChild(portfolioGallery)
    generateWorkSheet()
    const contact = document.createElement('section')
    main.appendChild(introduction)
    main.appendChild(portfolio)
    main.appendChild(contact)
}
}

const linkers = [...document.querySelectorAll('li')]
let clickedLink = 0
function boldifyCurrentLinker(link){
    if(link.classList.contains("current")){
        return
    } else {
        link.classList.add("current")
    }
    clickedLink = link.getAttribute('data-key')
    for ( let i = 0; i < linkers.length; i++){
        if(linkers[i].getAttribute('data-key') != clickedLink){
            linkers[i].classList.remove("current")
        }
    }
}
for (let link of linkers){
    link.addEventListener('click', () => {
        boldifyCurrentLinker(link)
        switch(link.innerText){
            case "projets" :
                regenerateMainPage()
                console.log("On veut descendre aux projets")
                break;
            case "contact" :
                regenerateMainPage()
                console.log("On veut aller à la partie contact")
                break;
            case "login":
                console.log("On affiche la page de LogIn en dynamique")
                break;
            case "Mentions Légales":
                console.log("On veut ouvrir la page des mentions légales")
                break;
            default : regenerateMainPage();
        }
    })
}