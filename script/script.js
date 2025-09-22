// Show/Hide Spinner
const showSpinner = () => document.getElementById("spinner").classList.remove("hidden");
const hideSpinner = () => document.getElementById("spinner").classList.add("hidden");

// Load all pets
const loadAllPets = async () => {
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/peddy/pets");
    const data = await res.json();
    console.log("All Pets:", data); 
      displayPets(data.pets); 
    } catch (err) {
    console.error(err);
  }
};

// Load categories
const loadCategories = async () => {
  const res = await fetch("https://openapi.programming-hero.com/api/peddy/categories");
  const data = await res.json();
  console.log("Categories:", data);
  displayCategories(data.categories);
};

// Display categories
const displayCategories = (categories) => {
  const container = document.getElementById("category-section");
  container.innerHTML = "";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.innerText = cat.category;
    btn.className = "px-8 py-4 border border-gray-200 rounded-xl flex justify-center gap-4 items-center";
    btn.innerHTML = `<img src="${cat.category_icon}" alt="" /> <span class="text-2xl font-bold">${cat.category}</span>`;
    btn.onclick = () => {
      // Remove active styles from all buttons
      document.querySelectorAll("#category-section button").forEach(b => {
        b.classList.remove("bg-[#0E7A81]/10", "border-teal-700", "rounded-full", "border-2");
        b.classList.add("border-gray-200", "rounded-xl");
      });

      // Apply active styles
      btn.classList.remove("border-gray-200", "rounded-xl");
      btn.classList.add("border-teal-700", "bg-[#0E7A81]/10", "rounded-full", "border-2");

      // Load pets
      loadPetsByCategory(cat.category);
    };
    container.appendChild(btn);
  });
};

// Load pets by category
const loadPetsByCategory = async (categoryName) => {
  showSpinner();
  const res = await fetch(`https://openapi.programming-hero.com/api/peddy/category/${categoryName}`);
  const data = await res.json();
 
    const cardContainer = document.getElementById("petCards");
    cardContainer.innerHTML ="";

    // Keep likedImage not visible during load
    document.getElementById("likedImage").hidden = true;

   setTimeout(() => {
    if (!data.data || data.data.length === 0) {
     cardContainer.classList.remove("grid");
     cardContainer.innerHTML = 
     `
        <div class=" bg-gray-100 rounded-lg p-12">
            <div class="text-center space-y-6">
                <img class="mx-auto" src="images/error.webp" alt="">
                <p class="font-bold text-4xl">No Information Available</p>
            </div>
        </div>
     `;
        document.getElementById("likedImage").hidden = false;
        hideSpinner();
        return; 
    } 
    
    else {
      cardContainer.classList.add("grid");
        displayPets(data.data);
        document.getElementById("likedImage").hidden = false;

    }

    hideSpinner();
  }, 2000);
};

// Display pets
let allPets = []; // keep for sorting
const displayPets = (pets) => {
  allPets = pets;
  const container = document.getElementById("petCards");
  container.innerHTML = "";

  pets.forEach(element => {
    const card = document.createElement("div");
    card.className = "border border-gray-200 p-3 rounded-lg";
    card.innerHTML = `
      <img src="${element.image}" class="w-full rounded mb-2">
      <div class="flex flex-col gap-1">
           <h2 class="my-2 font-bold text-2xl">${element.pet_name}</h2>
            <div class="text-secondaryTextColor flex items-center gap-1"><img class="w-4 h-4" src="/images/card.png" alt=""> Breed: <span>${element.breed ? element.breed : "Not Available"}</span></div>
            <div class="text-secondaryTextColor flex items-center gap-1"><img class="w-4 h-4" src="/images/calendar.png" alt=""> Birth: <span>${element.date_of_birth ? element.date_of_birth : "Not Mentioned"}</span></div>
            <div class="text-secondaryTextColor flex items-center gap-1"><img class="w-4 h-4" src="/images/gender-neutral.png" alt=""> Gender: <span>${element.gender ? element.gender : "Not Mentioned"}</span></div>
            <div class="text-secondaryTextColor flex items-center gap-1"><img class="w-4 h-4" src="/images/dollar-currency-symbol.png" alt=""> Price: <span>${element.price ? element.price + " $" : "Will be Announce"} </span></div>
       </div>
       <hr class="my-3 text-gray-200">
      <div class="flex gap-2 justify-between mt-3">
        <button onclick="likePet('${element.image}')" class="border px-5 py-2 rounded-lg border-teal-700 active:scale-95 active:bg-teal-700 hover:bg-teal-700 duration-300"><img class="w-5 h-5" src="/images/like.png" alt=""></button>
        <button onclick="adoptPet(this)" class="font-bold border px-5 py-2 rounded-lg text-teal-700 border-teal-700 hover:bg-teal-700 hover:text-white active:scale-95 active:bg-teal-700 duration-300">Adopt</button>
        <button onclick="loadPetDetails('${element.petId}')" class="font-bold border px-5 py-2 rounded-lg text-teal-700 border-teal-700 hover:bg-teal-700 hover:text-white active:scale-95 active:bg-teal-700 duration-300">Details</button>
      </div>
    `;
    container.appendChild(card);
  });
};

// Liked pet and image in the box
const likePet = (img) => {
  const box = document.getElementById("likedImage");
  const liked = document.createElement("img");
  liked.src = img;
  liked.className = "rounded";
  box.appendChild(liked);
};

// Modal details
const loadPetDetails = async (id) => {
  const res = await fetch(`https://openapi.programming-hero.com/api/peddy/pet/${id}`);
  const data = await res.json();
  console.log("Pet Details:", data); 

  const pet = data.petData;

  // image
  document.getElementById("modalImg").src = pet.image;

  // Full details info
  document.getElementById("modalInfo").innerHTML = `
    <h2 class="text-2xl font-bold my-3">${pet.pet_name}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2  gap-2">
        <div class="text-secondaryTextColor flex items-center gap-1"><img class="w-4 h-4" src="/images/card.png" alt=""> Breed: <span>${pet.breed ? pet.breed : "Not Available"}</span></div>
        <div class="text-secondaryTextColor flex items-center gap-1"><img class="w-4 h-4" src="/images/calendar.png" alt="">Birth: <span>${pet.date_of_birth ? pet.date_of_birth : "Not Mentioned"}</span></div>
        <div class="text-secondaryTextColor flex items-center gap-1"><img class="w-4 h-4" src="/images/gender-neutral.png" alt=""> Gender: <span>${pet.gender ? pet.gender : "Not Mentioned"}</span></div>
        <div class="text-secondaryTextColor flex items-center gap-1"><img class="w-4 h-4" src="/images/dollar-currency-symbol.png" alt="">Price: <span>${pet.price ? pet.price + " $" : "Will be Announce"} </span></div>
        <div class="text-secondaryTextColor flex items-center gap-1"><img class="w-4 h-4" src="/images/gender-neutral.png" alt=""> Vaccinated status: <span>${pet.vaccinated_status ? pet.vaccinated_status : "Not Mentioned"}</span></div>
    </div>
    <hr class="my-3 border-gray-200">
    <p><strong>Details Information</strong></p>
    <p>${pet.pet_details || "No description available"}</p>
  `;

  // Show modal
  const modal = document.getElementById("modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
};

const closeModal = () => {
  const modal = document.getElementById("modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
};


//adopt button modal code
const adoptPet = (btn) => {
  let count = 3;

  // Disable button immediately
  btn.disabled = true;

  // modal content container
  const modalContent = document.getElementById("modalContent");

  // Fill modal dynamically
  modalContent.innerHTML = `
    <img class="w-32 mx-auto" src="./images/handshake.gif" alt="">
    <span class="text-4xl font-bold text-center">Congrats</span>
    <span class="text-lg text-center">Adoption process is starting for your pet</span>
    <span class="text-7xl font-bold counterSpan text-center">${count}</span>
  `;

  // Show modal for adopt
  const modal = document.getElementById("modal_adopt");
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  const counterSpan = modalContent.querySelector(".counterSpan");

  // Countdown
  const timer = setInterval(() => {
    count--;
    if (count >= 0) {
      counterSpan.innerText = count;
    } else {
      clearInterval(timer);
      modal.classList.add("hidden");
      modal.classList.remove("flex");

      // Update button after countdown
      btn.innerText = "Adopted";
      btn.classList.remove("text-teal-700", "hover:bg-teal-700", "active:bg-teal-700", "duration-300", "hover:text-white");
      btn.classList.add("border-none","bg-gray-300", "text-gray-400", "cursor-not-allowed");
    }
  }, 1000);
};



// Sort by price
document.getElementById("sortBtn").addEventListener("click", () => {
  const sorted = [...allPets].sort((a, b) => (b.price || 0) - (a.price || 0));
  displayPets(sorted);
});

// Init
loadCategories();
loadAllPets();