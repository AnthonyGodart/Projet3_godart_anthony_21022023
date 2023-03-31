// Afficher une miniature de l"image sélectionnée dans le formulaire d"ajout nouveau projet : half-OK
// Récupérer le champ de prévisualisation OK
let preview = document.querySelector("#preview");
let imageInputField = document.querySelector("#add-photo-field");
// Re-créer l'aspect initial du champ de prévisualisation OK
function setInitialPreviewField(){
    let icon = document.createElement("label");
        icon.innerHTML = `<i class="fa-regular fa-image frame-picture"></i>`;
        icon.setAttribute("for", "add-photo-field");
    let imageInputButton = document.createElement("label");
        imageInputButton.innerText = "+ Ajouter photo";
        imageInputButton.classList = "photo-input-button";
        imageInputButton.setAttribute("for", "add-photo-field");
    let input = document.createElement("input");
        input.setAttribute("id", "add-photo-field");
        input.classList ="reset-input";
        input.setAttribute("type", "file");
        input.setAttribute("name", "add-photo-field");
        input.setAttribute("value", "");
        input.setAttribute("required", "true");
        input.setAttribute("accept", ".jpg, .png");
        input.setAttribute("style", "opacity: 0;");
    let para = document.createElement("p");
        para.innerText = "jpg, png : 4Mo max";
    preview.appendChild(icon);
    preview.appendChild(imageInputButton);
    preview.appendChild(input);
    preview.appendChild(para);
}
function updateImageInputFieldDisplay() {
    while(preview.firstChild){
        preview.removeChild(preview.firstChild);
    };
    let curFiles = imageInputField.files;
    if(curFiles.length === 0){
        setInitialPreviewField();
    } else {
        for (let i = 0; i < curFiles.length; i++) {
            let image = document.createElement("img");
            image.src = window.URL.createObjectURL(curFiles[i]);
            image.style.maxHeight = "170px";
            image.style.maxWidth ="129px";
            preview.appendChild(image);
        };
    }
}

export { setInitialPreviewField, updateImageInputFieldDisplay };
