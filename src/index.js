const spicesUrl = 'http://localhost:3000/spiceblends'
const ingrUrl = 'http://localhost:3000/ingredients'
const updateForm = document.querySelector("form#update-form")
const ingredientsForm = document.querySelector("form#ingredient-form")
const spiceBlendIngredients = document.querySelector("ul.ingredients-list")
const menuDiv = document.querySelector("div#spice-images")

document.addEventListener("DOMContentLoaded", ()=> {

  fetchSpiceBlendsAndRenderMenu()
  fetchFirstSpiceBlendAndRender()
  
  menuDiv.addEventListener("click", renderClickedSpiceBlend)
  updateForm.addEventListener("submit", updateSpiceBlendTitle)
  ingredientsForm.addEventListener("submit", addSpiceBlendIngredient)
})

const fetchSpiceBlendsAndRenderMenu = () => {
  fetch(spicesUrl)
  .then(resp => resp.json())
  .then(arrOfSpiceBlends => arrOfSpiceBlends.forEach(renderSpiceBlendInMenu))
}

const fetchFirstSpiceBlendAndRender = () => {
  fetch(spicesUrl)
  .then(resp => resp.json())
  .then(arrOfSpiceBlends => fetchASpiceBlendAndRender(arrOfSpiceBlends[0].id))
}

const renderSpiceBlendInMenu = spiceBlendObj => {
  const spiceBlendImg = document.createElement("img")
  spiceBlendImg.src = spiceBlendObj.image
  spiceBlendImg.dataset.id = spiceBlendObj.id

  menuDiv.append(spiceBlendImg)
}

const fetchASpiceBlendAndRender = (id) => {
  fetch(spicesUrl + `/${id}`)
  .then(resp => resp.json())
  .then(renderSpiceBlend)
}

const renderClickedSpiceBlend = event => {
  if (event.target.tagName === "IMG") {
    fetchASpiceBlendAndRender(event.target.dataset.id)
  }
}

const renderSpiceBlend = spiceBlendObj => {
  const spiceBlendImg = document.querySelector("img.detail-image")
  spiceBlendImg.src = spiceBlendObj.image
  
  const spiceBlendTitle = document.querySelector("h2.title")
  spiceBlendTitle.textContent = spiceBlendObj.title

  spiceBlendIngredients.innerHTML = ""
  for (ingr of spiceBlendObj.ingredients) {
    ingrLineItem = document.createElement("li")
    ingrLineItem.textContent = ingr.name
    spiceBlendIngredients.append(ingrLineItem)
  }

  updateForm.title.value = spiceBlendObj.title
  updateForm.dataset.id = spiceBlendObj.id
  ingredientsForm.dataset.id = spiceBlendObj.id
}

const updateSpiceBlendTitle = event => {
  event.preventDefault()
  const title = event.target.title.value
  const updateTitleData = {
    title
  }
  
  fetch(spicesUrl + `/${event.target.dataset.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(updateTitleData)
  })
  .then( () => {
    fetchASpiceBlendAndRender(event.target.dataset.id)
  })
}

const addSpiceBlendIngredient = event => {
  event.preventDefault()
  const newIngrName = event.target.name.value

  addIngrData = {
    spiceblendId: parseInt(event.target.dataset.id),
    name: newIngrName
  }

  fetch(ingrUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(addIngrData) 
  })
  .then( () => {
    fetchASpiceBlendAndRender(event.target.dataset.id)
    event.target.reset()
  })

}

