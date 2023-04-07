let shop = document.getElementById('shop');
let basket = JSON.parse(localStorage.getItem("data")) || [];

let populateShop = () => {
    return (shop.innerHTML = shopItemsDatabase.map((item) => {
        let { id, name, desc, price, image } = item;
        let search = basket.find((x) => x.id === id) || [];
        return `
        <div id=product-id-${id} class="item">
                <img  src="${image}" alt="${name}">
                <div class="details">
                    <h3>${name}</h3>
                    <p>${desc}</p>
                    <div class="price-quantity">
                        <h2>R$ ${price}</h2>
                        <div class="buttons">
                            <i onclick="decrement(${id})" class="bi bi-dash-circle"></i>
                            <div id=${id} class="quantity">
                            ${search.item === undefined ? 0 : search.item}
                            </div>
                            <i onclick="increment(${id})" class="bi bi-plus-circle"></i>
                        </div>
                    </div>
                </div>
            </div>
       `
    }).join("")); // to exclude the "," between the items
};

populateShop();


let increment = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem.id);
    if (search === undefined) {
        basket.push({
            id: selectedItem.id,
            item: 1,
        });
    } else {
        search.item += 1;
    }
    
    update(selectedItem.id);
    localStorage.setItem("data", JSON.stringify(basket));
};

let decrement = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem.id);

    if (search === undefined)  return; //Check if basket is empty
    else if (search.item === 0) return; //Check if  selected item is zero
    else {
        search.item -= 1;
    }
    update(selectedItem.id);
    basket = basket.filter((x) => x.item !== 0);
    localStorage.setItem("data", JSON.stringify(basket));
};

let update = (id) => {
    let search = basket.find((x) => x.id === id);
    if (search === undefined) {
        document.getElementById(id).innerText = 0;
    } //Check if basket is empty
    else{
    document.getElementById(id).innerText = search.item;
    calculation();      //sum the quantity of each item and update the cartAmount
    showBadge();    //Check if cart is empty. If it is no badge is shown
}};


//Function to calculate the total quantity of items to put in the cart
let calculation = () => {
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerText = basket.map((x) => x.item).reduce((sum, item) => sum + item, 0)  
};


//Function to check if cart badge must be shownd or not
function showBadge() {
    let cartIcon = document.getElementById("cartAmount");
    if (cartIcon.innerText === "0") {
        cartIcon.classList.remove("shown");
    } else {
        cartIcon.classList.add("shown");
    }
};
let stateCheck = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(stateCheck);
      showBadge();
    }
  }, 500);
//Call the cart check and calculation on page load

calculation();