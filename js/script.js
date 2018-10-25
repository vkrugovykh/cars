window.addEventListener('DOMContentLoaded', function() {
    'use strict';

    let productsBlock = document.querySelector('.products'),
        filters = document.querySelector('.filters'),
        checkbox = filters.querySelectorAll('.checkbox'),
        arrCat = [],
        overlay = document.querySelector('.overlay'),
        close = document.querySelector('.popup-close'),
        popupImg = document.querySelector('.popup-img');

    function getProducts() {
        arrCat = []; //Массив активных фильтров
        checkbox.forEach(function(elem) {
            if (elem.checked) {
                arrCat.push(elem.id); 
            }
        });

        let request = new XMLHttpRequest();

        request.open('GET', 'cars.json');
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request.send();

        request.addEventListener('readystatechange', function() {
            if (request.readyState < 4) {
                productsBlock.textContent = "Обработка";
            }else if (request.readyState === 4 && request.status == 200) {
                productsBlock.textContent = "";
                let data = JSON.parse(request.response);
                productsList(data.cars, productsBlock, arrCat);
            } else {
                productsBlock.textContent = "Что-то пошло не так!";
            }
        });

        function productsList(items, block, category) { //Заполняем страницу товарами
            for (let i = 0; i < items.length; i++) {
                if (!category || category == '') {
                    productCard(items[i], block);
                } else if (category.indexOf(items[i].category) > -1) {
                    productCard(items[i], block);
                }
                
            }
        }

        function productCard(items, block) { //Одна карточка товара
            block.innerHTML += `<div class="product-wrapper">
                                    <div class="product">
                                        <div class="product-img">
                                            <img src="${items.img}" alt="${items.name}" class="product-img__img">
                                        </div>
                                        <h2 class="product-name">${items.name}</h2>
                                        <div class="product-description">
                                            ${items.description}
                                        </div>
                                        <div class="product-price">
                                            <a href="#" class="button">${items.price} &euro;</a>
                                        </div>
                                        <div class="product-category">${items.category}</div>
                                    </div>
                                </div>`;
        }

    }

    getProducts(); // Первоначальное заполнение страницы при открытии

    filters.addEventListener('click', function(event) { //Обработка фильтров категорий
        let target = event.target;
        if (target && target.classList.contains('checkbox')) {
            getProducts();
        }
    });

    productsBlock.addEventListener('click', function(event) {
        let target = event.target;
        
        if (target && target.classList.contains('product-category')) { //Фильтруем по категории из карточки
            
            checkbox.forEach(function(event) {
                if (event.id == target.textContent) {
                    event.checked = true;
                } else {
                    event.checked = false;
                }
            });

            getProducts();

        } else if (target && target.classList.contains('product-img__img')) {//Модальное окно при клике на картинку
            modalOn(target.src, target.alt);
        } else if (target && target.classList.contains('button')) {
            event.preventDefault(); //На данный момент отменим действие при клике на кнопку купить
        }
    });

    function modalOn(src, alt) {//открываем модальное окно
        overlay.style.display = 'block';
        popupImg.innerHTML = `<img src="${src}" alt="${alt}" class="popup-img__img">`;
        document.body.style.overflow = 'hidden';
    }

    function modalOff() {//Закрываем модальное окно
        overlay.style.display = 'none';
        document.body.style.overflow = '';
        popupImg.innerHTML = '';
    }

    close.addEventListener('click', modalOff); //Выкл модальное окно при клике на крестике

    overlay.addEventListener('click', modalOff); //Выкл модальное окно при клике в любом месте страницы
});