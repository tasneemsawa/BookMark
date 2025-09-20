const inputs = Array.from(document.querySelectorAll(".form-control"))
const bookMarkForm = document.querySelector(".bookmarkForm")
const removeAllBtn = document.querySelector(".removeAllBtn")
const searchInput = document.querySelector(".search-input")
const textDanger = document.querySelectorAll(".text-danger")
const addBtn = document.querySelector(".add-btn")
let sites = JSON.parse(localStorage.getItem("sites")) || []

let isUpdateMode = false
let updatedIndex = 0

const validateSiteName = () => {

   const regex = /^[A-Z][a-zA-Z]{2,}$/;

   if (!regex.test(inputs[0].value)) {
      inputs[0].classList.remove('is-valid');
      inputs[0].classList.add('is-invalid');
      textDanger[0].textContent = "Invalid! Name must start with a capital letter and have at least 3 letters in total."
      return false;
   } else {
      inputs[0].classList.remove('is-invalid');
      textDanger[0].textContent = ""

      inputs[0].classList.add('is-valid');
      return true;
   }
}
const validateEmail = () => {

   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   //[^\s@] prevent add space or @
   // \. must put a dot and the \ because it is a special character

   if (!regex.test(inputs[2].value)) {
      inputs[2].classList.remove('is-valid');
      inputs[2].classList.add('is-invalid');
      textDanger[2].textContent = "Invalid! Email must be in a valid format (example: user@example.com)"
      return false;
   } else {
      inputs[2].classList.remove('is-invalid');
      textDanger[2].textContent = ""
      inputs[2].classList.add('is-valid');
      return true;
   }
}
const removeBookMark = (index) => {
   sites.splice(index, 1)
   localStorage.setItem("sites", JSON.stringify(sites))
   displaySites()

}
const updateBookMark = (index) => {

   inputs[0].value = sites[index].siteName
   inputs[1].value = sites[index].siteUrl
   inputs[2].value = sites[index].siteEmail
   inputs[3].value = sites[index].sitePassword
   isUpdateMode = true
   addBtn.textContent = "Update"
   updatedIndex = index
}

inputs[0].addEventListener("input", validateSiteName)//inputs[0].addEventListener("blur",validateSiteName)// if press out the input
inputs[2].addEventListener("input", validateEmail)//inputs[0].addEventListener("blur",validateSiteName)// if press out the input


bookMarkForm.addEventListener("submit", (e) => {

   e.preventDefault()

   let isVaild = true

   if (!validateSiteName() || !validateEmail() || inputs[1].value == "") {
      isVaild = false
   }
   if (!isVaild) return

   if (isUpdateMode) {

      sites[updatedIndex].siteName = inputs[0].value
      sites[updatedIndex].siteUrl = inputs[1].value
      sites[updatedIndex].siteEmail = inputs[2].value
      sites[updatedIndex].sitePassword = inputs[3].value
      addBtn.textContent = "Add"
      updatedIndex = 0


   }
   else {
      sites.push({
         siteName: inputs[0].value,
         siteUrl: inputs[1].value,
         siteEmail: inputs[2].value,
         sitePassword: inputs[3].value,

      })
   }
   localStorage.setItem("sites", JSON.stringify(sites))
   Swal.fire({
      title: "Done!",
      icon: "success",
      draggable: true
   });

   displaySites()
   isUpdateMode = false
   bookMarkForm.reset()
   inputs[0].classList.remove('is-valid');
   inputs[2].classList.remove('is-valid');
   inputs[3].classList.remove('is-valid');

})

const displaySites = () => {
   let tableDate = JSON.parse(localStorage.getItem("sites")) || []

   let result = tableDate.map((data, index) =>
      `<tr>
     <th scope="row">${index + 1}</th>
     <td>${data.siteName}</td>
     <td>${data.siteUrl}</td>
     <td>${data.siteEmail}</td>
     <td>${data.sitePassword}</td>
     <td><button onclick="updateBookMark(${index})" type="button" class="btn btn-info  px-3 update-item">Update </button></td>
     <td><button onclick="removeBookMark(${index})" type="button" class="btn btn-danger  px-3 remove-item">Remove </button></td>
   </tr>`

   ).join(" ")

   document.querySelector(".sites-data").innerHTML = result
}
displaySites()

removeAllBtn.addEventListener("click", (e) => {
   localStorage.removeItem("sites")
   sites = []
   displaySites()
   isUpdateMode = false
   addBtn.textContent = "Add"
   updatedIndex = 0
   bookMarkForm.reset()


})
searchInput.addEventListener("input", (e) => {
   const filterText = searchInput.value.toLowerCase()

   let result = sites.filter((data) =>
      data.siteName.toLowerCase().includes(filterText)
   )

   let data = result.map((data, index) =>
      `<tr>
   <th scope="row">${index + 1}</th>
   <td>${data.siteName}</td>
   <td>${data.siteUrl}</td>
   <td>${data.siteEmail}</td>
   <td>${data.sitePassword}</td>
   <td><button onclick="updateBookMark(${index})" type="button" class="btn btn-info  px-3 update-item">Update </button></td>
   <td><button onclick="removeBookMark(${index})" type="button" class="btn btn-danger  px-3 remove-item">Remove </button>
   </td>
 </tr>`

   ).join(" ")

   document.querySelector(".sites-data").innerHTML = data

})