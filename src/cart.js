let basket = JSON.parse(localStorage.getItem("data")) || [];
let resume = document.getElementById("resume");
let shoppingCart = document.getElementById("shopping-cart");
let shopContainer = document.getElementById("shop-container");

let calculation = () => {
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerText = basket.map((x) => x.item).reduce((sum, item) => sum + item, 0)  
};

function showBadge() {
    let cartIcon = document.getElementById("cartAmount");
    if (cartIcon.innerText === "0") {
        cartIcon.classList.remove("shown");
    } else {
        cartIcon.classList.add("shown");
    }
};
//Function to check the state of the page, if completely loaded
//start other function to refresh the state of the cart badge
let stateCheck = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(stateCheck);
      showBadge();
    }
  }, 100);

calculation();

let populateCartItems = () => {
    if (basket.length !== 0) {
        return (shoppingCart.innerHTML = basket.map((x) => {
            let {id, item} = x;
            let search = shopItemsDatabase.find((data)=>data.id === id) || []
            return `
            <div class="cart-item">
                <img src="${search.image}" alt="${search.name}">
                <div class="cart-item-info">
                  <div class="name-x">
                    <h3>${search.name}</h3>
                    <p class="singlePrice">R$ ${search.price}</p>
                    <i onclick="remove(${search.id})" class="bi bi-x-lg"></i>
                </div>
                    <div class="selectedItems">
                        <h3>R$ ${search.price*item  }</h3>
                        <div class="buttons-cart">
                            <i onclick="decrement(${id})" class="bi bi-dash-circle"></i>
                            <div id=${id} class="quantity">
                            ${x.item === undefined ? 0 : x.item}
                            </div>
                            <i onclick="increment(${id})" class="bi bi-plus-circle"></i>
                        </div>
                    </div>
                </div>
            </div>
                    `;}).join(""));

    }
    else {
        shoppingCart.innerHTML =  ``;
        shopContainer.classList.add("layout");
        resume.innerHTML = `
        <h2>Seu carrinho està vazio</h2>
        <a href="index.html"><button class="btn-home">Volte à loja</button></a>
        `;
    }
};

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
    populateCartItems();
    TotalAmount();
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
    populateCartItems();
    TotalAmount();
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


let remove = (id) => {
    let selectedItem = id;
    basket = basket.filter ((x)=>x.id !== selectedItem.id);
    
    localStorage.setItem("data", JSON.stringify(basket));
    populateCartItems();
    calculation();
    showBadge();
    TotalAmount();
}

populateCartItems();

let ClearCart = () => {
    basket = [];
    localStorage.setItem("data", JSON.stringify(basket));
    populateCartItems();
    calculation();
    showBadge();
    TotalAmount();
}

let TotalAmount = () => {
    if (basket.length !== 0) {
        let amount = basket.map((x) => {
            let {id, item} = x;
            let search = shopItemsDatabase.find((data)=>data.id === id) || [];
            return item * search.price;
        }).reduce((x,y)=>x+y,0);
        /* console.log(amount) */
        resume.innerHTML = `
        <h2 class="total">Total: R$ <span>${amount}</span></h2>
        <div class="opt-btn">
        <a href="index.html"><button class="btn-home">Checkout</button></a>
        <button onclick="ClearCart()" class="btn-home btn-red">Limpar carrinho</button>
        `;
    }else return
};

TotalAmount();