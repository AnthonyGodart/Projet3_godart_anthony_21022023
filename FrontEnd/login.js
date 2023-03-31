// Récupérer les liens "projets", "contact" etc... OK
let linkers = [...document.querySelectorAll('li')];
// Ajouter un écouteur d'événements à chaque "lien" OK
linkers.forEach(link => {
    link.addEventListener('click', () => handleLinkClick(link));
})
// Affecter des ancres aux liens clicables OK
let linkerHref = ["#portfolio", "#contact", "", "#", "#"];
let filterBar = document.querySelector('#filter-bar');
let userCredentialToken = sessionStorage.getItem('token');
let modifierButtons = document.querySelectorAll('.modifier-button');
let editBar = document.querySelector('.edit-mode');
for (let i = 0; i< linkers.length; i ++){
    linkers[i].setAttribute("href", linkerHref[i]);
}
if(userCredentialToken){
    filterBar.style.display = "none";
}
// Gestion de la connexion de l'utilisateur OK -----------------------------------//
// Afficher ma page de connexion en dynamique OK
function handleLinkClick(link){
    if (link.innerText == "login") {
        // Cacher toutes les sections sauf la page de connexion
        let loginPage = document.getElementById("login-page");
        let sections = document.querySelectorAll('section:not(#login-page)');
        sections.forEach(section => section.style.display = "none");
        loginPage.style.display = "";
        // Ajouter un événement de soumission du formulaire de connexion
        let loginForm = document.getElementById('login-form');
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            logUser();
        });
    } else if (link.innerText == 'logout') {
        // Réinitialiser le lien de connexion et supprimer le token de session
        link.setAttribute('data-key', 'login');
        link.innerText = "login";
        window.sessionStorage.removeItem('token');
        modifierButtons.forEach(modifierButton =>
            modifierButton.style.display = "none");
        editBar.style.display = "none";
        filterBar.style.display = "";
    } else {
        // Rediriger vers la page d'accueil si un autre lien est cliqué
        document.addEventListener('click', (e) =>{
            if(e.target.innerText !== "login"){
                window.location.href = "index.html";
            };
        });
    }
}
// Connexion de l'utilisateur OK
async function logUser(){
    let userLogin = {
        'email': document.getElementById('emailUser').value,
        'password': document.getElementById('passwordUser').value
    };
    let authorizeLog = 
        await fetch("http://localhost:5678/api/users/login",
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(userLogin)
        });
    let authorizedLog = await authorizeLog.json();
        if (authorizedLog != null && 
            authorizedLog.userId !=0 && 
            authorizedLog.token != null){
                window.sessionStorage.setItem('token', authorizedLog.token);
                window.location.href = "index.html";
        } else {
            alert('Email ou mot de passe incorrect.');
            if(userCredentialToken != null){
                window.sessionStorage.removeItem('token');
            };
        };
}
// Modifier login=>logout et afficher le bouton "modifier" OK
for (let link of linkers){
    let logButton = link.getAttribute('data-key');
    if (logButton == 'login' && userCredentialToken !=null){
        link.setAttribute('data-key', 'logout');
        link.innerText = 'logout';
        modifierButtons.forEach(modifierButton =>
            modifierButton.style.display = "");
        editBar.style.display = "";
    };
}

export {handleLinkClick, logUser, userCredentialToken, modifierButtons, editBar};
