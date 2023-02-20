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

        console.log(workElement)

        gallery.appendChild(workElement)
    }
}

generateWorkSheet(workList);
