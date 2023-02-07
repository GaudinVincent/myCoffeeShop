//récupération du formulaire et des inputs
let mainForm = document.querySelector("#mainForm");
let chooseProduct = document.querySelector("#chooseProduct");
let ba = document.querySelector("#ba");
let degreAlcool = document.querySelector("#degreAlcool");
let autre = document.querySelector("#autre");
let productContainer = document.querySelector("#productContainer");
let inputContainer = document.querySelector(".inputContainer");

//création tableau vide
let productList = [];
//événement au changement de la valeur de l'input "select"

if (chooseProduct.value == "default") {
  inputContainer.style.display = "none";
}

function changeProduct() {
  inputContainer.style.display = "";
  if (chooseProduct.value == "ba") {
    degreAlcool.style.display = "";
  } else {
    degreAlcool.style.display = "none";
  }
}

//on ajoute un événement submit au formulaire

mainForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let formContent = new FormData(mainForm);
  // calcul de la marge
  function calcMarge(prixVente, prixAchat) {
    let marge = prixVente - prixAchat;
    return marge;
  }

  //calcul prix TTC
  function calcPrixTTC(prixVente) {
    let prixTTC = Math.floor(prixVente * 1.2);
    return prixTTC;
  }
  //prototype boisson alcoolisée
  function BoissonAlcool(
    nom,
    quantity,
    prixAchat,
    prixVente,
    marge,
    prixTTC,
    degreAlcool
  ) {
    this.nom = nom;
    this.quantity = quantity;
    this.prixAchat = prixAchat;
    this.prixVente = prixVente;
    this.marge = marge;
    this.prixTTC = prixTTC;
    this.degreAlcool = degreAlcool;
  }
  //prototype autre produit
  function AutreProduit(nom, quantity, prixAchat, prixVente, marge, prixTTC) {
    this.nom = nom;
    this.quantity = quantity;
    this.prixAchat = prixAchat;
    this.prixVente = prixVente;
    this.marge = marge;
    this.prixTTC = prixTTC;
  }

  //selon la valeur de "chooseProduct", on envoie un prototype différent dans le tableau
  if (chooseProduct.value == "ba") {
    //création d'une nouvelle boisson alcoolisée
    let createBoissonAlcoolisee = new BoissonAlcool(
      formContent.get("productName"),
      formContent.get("productQty"),
      formContent.get("prixAchat"),
      formContent.get("prixVente"),
      calcMarge(
        Number(formContent.get("prixVente")),
        Number(formContent.get("prixAchat"))
      ),
      calcPrixTTC(Number(formContent.get("prixVente"))),
      formContent.get("degreAlcool")
    );
    productList.push(createBoissonAlcoolisee);
  } else if (chooseProduct.value == "autre") {
    //création d'un produit différent de la boisson alcoolisée
    let createProduit = new AutreProduit(
      formContent.get("productName"),
      formContent.get("productQty"),
      formContent.get("prixAchat"),
      formContent.get("prixVente"),
      calcMarge(
        Number(formContent.get("prixVente")),
        Number(formContent.get("prixAchat"))
      ),
      calcPrixTTC(Number(formContent.get("prixVente")))
    );
    productList.push(createProduit);
  } else {
    alert("Veuillez sélectionner un type de produit");
  }
  console.log(productList);

  //on sauvegarde le tableau dans le local storage
  localStorage.setItem("@productList", JSON.stringify(productList));
  //on vide les inputs
  e.target.reset();

  afficherProduct();
  //afficher contenu du tableau js dans le tableau HTML
  function afficherProduct() {
    let productDetail = "";

    productList.forEach((element) => {
      productDetail += `<tr><td>${element.nom}</td> <td>${
        element.quantity
      }</td> <td>${element.prixAchat}</td> <td>${element.prixVente}</td> <td>${
        element.marge
      }</td> <td>${element.prixTTC}</td> <td>${
        element.degreAlcool ? element.degreAlcool : ""
      }</td> <td><button class= "modifButton"> Modifier </button> <button class="deleteButton">X</button></td></tr>`;
      productContainer.innerHTML = productDetail;
    });
    // on récupère tous les boutons "supprimer"
    let deleteButton = document.querySelectorAll(".deleteButton");
    deleteButton.forEach((element, index) => {
      element.addEventListener("click", () => {
        if (confirm("Supprimer le produit ?")) {
          deleteDetail(index);
          localStorage.getItem("@productList");
        }
      });
    });
    //on récupère tous les boutons "modifier"
    let modifButton = document.querySelectorAll(".modifButton");
    modifButton.forEach((element, index) => {
      element.addEventListener("click", () => {
        //on change le contenu du tableau en input
        productContainer.innerHTML = `<tr> <td><input class= "inputModif"  value = ${productList[index].nom}
        ></td> <td> <input class= "inputModif" min="1" value = ${productList[index].quantity}></td><td><input class= "inputModif" value = ${productList[index].prixAchat}></td><td ><input class= "inputModif"  value = ${productList[index].prixVente}></td><td>${productList[index].marge}</td> <td>${productList[index].prixTTC}</td><td ><input class= "inputModif" value = ${productList[index].degreAlcool}></td></tr> `;

        //récupération des inputs modifiés
        let inputModif = document.querySelectorAll(".inputModif");

        inputModif.forEach((element, index) => {
          element.addEventListener("keydown", (e) => {
            //après validation de la modification, on fait apparaître les nouvelles valeurs
            console.log(inputModif);
            if (e.key == "Enter") {
              productContainer.innerHTML = `<tr> <td>${
                inputModif[index].value
              }</td> <td>${inputModif[index].value}</td> <td>${
                inputModif[index].value
              }</td> <td>${inputModif[index].prixVente}</td> <td>${calcMarge(
                inputModif[index].prixVente,
                inputModif[index].prixAchat
              )}</td> <td>${calcPrixTTC(
                inputModif[index].prixVente
              )}</td> <td>${inputModif[index].degreAlcool}</td>`;
            }
          });
        });
      });
    });
  }
  function deleteDetail(elem) {
    // Va me supprimer l'element du tableau sur lequel j'ai cliqué
    productList.splice(elem, 1);

    //Si Tableau vide = Reinit des champs
    if (productList.length == 0) {
      //if (productList.length != true) {
      productContainer.innerHTML = "";
    }
    afficherProduct();
  }
});
