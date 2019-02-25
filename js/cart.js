'use strict';

fetch('https://neto-api.herokuapp.com/cart/colors')
  .then(res => { return res.json() })
  .then(data => {
    let colorData = data;
    let colorHTML = document.getElementById('colorSwatch');
    colorData.forEach(el => {
      let available;
      let check;

      if (el.isAvailable) available = 'available', check = 'checked';
      if (!el.isAvailable) available = 'soldout', check = 'disabled';

      colorHTML.innerHTML +=
        `<div data-value=${el.type} class="swatch-element color ${el.type} ${available}">
          <div class="tooltip">${el.title}</div>
          <input quickbeam="color" id="swatch-1-${el.type}" type="radio" name="color" value=${el.type} ${check}>
            <label for="swatch-1-${el.type}" style="border-color: red;">
              <span style="background-color: ${el.code};"></span>
              <img class="crossed-out" src="https://neto-api.herokuapp.com/hj/3.3/cart/soldout.png?10994296540668815886">
               </label>
                 </div>`
    });

    let currentColor = document.querySelectorAll('#colorSwatch input');
    Array.from(currentColor).forEach(function (el, i) {
      el.addEventListener('click', function (event) {
        localStorage.setItem('color', i);
      })
    });

    if (localStorage.color) currentColor[localStorage.color].checked = true;
  })


fetch('https://neto-api.herokuapp.com/cart/sizes')
  .then(res => { return res.json() })
  .then(data => {
    let sizeData = data;
    let sizeHTML = document.getElementById('sizeSwatch');
    sizeData.forEach(el => {
      let available;
      let check;

      if (el.isAvailable) available = 'available', check = 'checked';
      if (!el.isAvailable) available = 'soldout', check = 'disabled';

      sizeHTML.innerHTML +=
        `<div data-value=${el.type} class="swatch-element plain ${el.type} ${available}">
          <input id="swatch-0-${el.type}" type="radio" name="size" value="${el.type}" ${check}>
            <label for="swatch-0-${el.type}">
            ${el.title}
             <img class="crossed-out" src="https://neto-api.herokuapp.com/hj/3.3/cart/soldout.png?10994296540668815886">
              </label>
               </div>`

    })

    let currentSize = document.querySelectorAll('#sizeSwatch input');

    Array.from(currentSize).forEach(function (el, i) {
      el.addEventListener('click', function (event) {
        localStorage.setItem('size', i);
      })
    })

    if (localStorage.size) currentSize[localStorage.size].checked = true;
  })


fetch('https://neto-api.herokuapp.com/cart')
  .then(res => { return res.json() })
  .then(data => { if (data.length > 0) updateChipBasket(data) })


function updateChipBasket(data) {
  let quickCart = document.getElementById('quick-cart');
  data.forEach(el => {
    quickCart.innerHTML =
      `<div class="quick-cart-product quick-cart-product-static" id="quick-cart-product-${el.id}" style="opacity: 1;">
        <div class="quick-cart-product-wrap">
          <img src="${el.pic}" title="${el.title}">
            <span class="s1" style="background-color: #000; opacity: .5">$${el.price}</span>
            <span class="s2"></span>
        </div>
          <span class="count hide fadeUp" id="quick-cart-product-count-${el.id}">${el.quantity}</span>
          <span class="quick-cart-product-remove remove" data-id="${el.id}"></span>
        </div>`

    quickCart.innerHTML +=
      `<a id="quick-cart-pay" quickbeam="cart-pay" class="cart-ico open">
          <span>
           <strong class="quick-cart-text">Оформить заказ<br></strong>
          <span id="quick-cart-price">$${el.price * el.quantity}</span>
          </span>
        </a>`

  })

  const removeButton = document.querySelector('.remove');

  removeButton.addEventListener('click', function () {
    let formData = new FormData();
    formData.append('productId', event.target.dataset.id)
    fetch('https://neto-api.herokuapp.com/cart/remove', {
      method: 'POST',
      body: formData
    }).then(res => { return res.json() })
      .then(data => data.length > 0 ? updateChipBasket(data) : quickCart.innerHTML = '')
  })
}

const buyButton = document.getElementById('AddToCart');
buyButton.addEventListener('click', update)

function update() {
  event.preventDefault()
  let form = document.getElementById('AddToCartForm');
  let formData = new FormData(form);
  formData.append('productId', form.dataset.productId)

  fetch('https://neto-api.herokuapp.com/cart', {
    method: 'POST',
    body: formData
  }).then(res => { return res.json() })
    .then(data => updateChipBasket(data))
}


