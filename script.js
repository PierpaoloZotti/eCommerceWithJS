let shop = document.getElementById('shop');

let shopItemsDatabase = [
    {
        id: "item1",
        name: "sapato 1",
        desc: "decricao do produto 1",
        price: 55,
        image: "img/p2.jpg"
    },
    {
        id: "item2",
        name: "sapato 2",
        desc: "decricao do produto 2",
        price: 255,
        image: "img/p3.jpg"
    },
    {
        id: "item3",
        name: "sapato 3",
        desc: "decricao do produto 3",
        price: 155,
        image: "img/p7.jpg"
    },
    {
        id: "item4",
        name: "sapato 4",
        desc: "decricao do produto 4",
        price: 85,
        image: "img/p5.jpg"
    }
]

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
    }).join(""));
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
    localStorage.setItem("data", JSON.stringify(basket));
/*     console.log(basket);
 */    update(selectedItem.id);
};

let decrement = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem.id);
    if (search.item === 0)
        return;
    else {
        search.item -= 1;
    }
    localStorage.setItem("data", JSON.stringify(basket));
    /*     console.log(basket);
     */
    update(selectedItem.id);
};

let update = (id) => {
    let search = basket.find((x) => x.id === id);

    document.getElementById(id).innerText = search.item;
    calculation();      //sum the quantity of each item and update the cartAmount
    showBadge();    //Check if cart is empty. If it is no badge is shown
};


//Function to calculate the total quantity of items to put in the cart
let calculation = () => {
    let cartIcon = document.getElementById("cartAmount");
    let total = 0;
    total = basket.map((x) => x.item).reduce((sum, item) => sum + item)
    cartIcon.innerText = total;
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

//Call the cart check and calculation on page load
showBadge();
calculation();