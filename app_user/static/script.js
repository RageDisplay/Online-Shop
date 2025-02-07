let cartCount = 0;
let cartItems = [];
let totalPrice = 0;

document.querySelectorAll('.addToCart').forEach(button => {
    button.addEventListener('click', function() {
        const productName = this.parentElement.getAttribute('data-name');
        const productPrice = parseFloat(this.parentElement.getAttribute('data-price'));

        cartCount++;
        totalPrice += productPrice

        cartItems.push({ name: productName, price: productPrice});

        document.getElementById('cartCount').textContent = cartCount;

        const animationDiv = document.createElement('div');
        animationDiv.textContent = `${productName} добавлен в корзину !!`;
        animationDiv.className = `animation`;
        document.body.appendChild(animationDiv);

        setTimeout(() => {
            animationDiv.remove();
        }, 3000);
    });
});

document.getElementById('cartButton').addEventListener('click', function() {
    const modal = document.getElementById('cartModal');
    const cartItemsList = document.getElementById('cartItems');

    cartItemsList.innerHTML = '';

    cartItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.price} рублей`;
        cartItemsList.appendChild(li);
    });

    document.getElementById('totalPrice').textContent = `Итотовая цена корзины: ${totalPrice} рублей.`;

    modal.style.display = "block";
});

document.querySelector('.close').addEventListener('click', function() {
    const modal = document.getElementById('cartModal');
    modal.style.display = "none";
});

window.addEventListener('click', function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

document.getElementById('submitOrder').addEventListener('click', function() {
    if(cartItems.length === 0) {
        alert('Ваша корзина пуста');
        return;
    }

    fetch('/submit_order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cartItems, total: totalPrice}),
    })
    .then(response => {
        if(response.ok) {
            alert('Ваш заказ отправлен');
            cartItems = [];
            cartCount = 0;
            totalPrice = 0;
            document.getElementById('cartCount').textContent = cartCount
            document.getElementById('cartItems').innerHTML ='';
            document.getElementById('totalPrice').textContent= 'Итого: 0 руб.';
            document.getElementById('cartModal').style.display = "none";
        } else {
            console.error('Ошибка: ', error);
            alert('Произошла ошибка, отправьте снова');
        }
    })
    .catch(error => {
        console.error('Ошибка: ', error);
        alert('Произошла ошибка, отправьте снова');
    });
});