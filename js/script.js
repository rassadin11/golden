// ===== Animation on scroll ========================================================================================================================================================

/* @@include('animation-on-scroll.js */

// ===== Burger ========================================================================================================================================================

const burger = document.querySelector('.icon-menu');

burger.addEventListener('click', () => {
	const menuList = document.querySelector('.menu__list');
	const sliderSwiper = document.querySelector('.slider');

	document.body.classList.toggle('hidden');
	menuList.classList.toggle('active');
	burger.classList.toggle('active');

	setTimeout(() => {
		sliderSwiper.classList.toggle('none');
	}, 100)
}); 

// ===== Dinamic adaptive ========================================================================================================================================================

// Dynamic Adapt v. 1.1
// HTML data-da="where(uniq class name),position(digi),when(breakpoint)"
// e.x. data-da="item,2,992"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle
// copy from github 02.06.2020

// ===== recoding ========================================================================================================================================================

// Dynamic Adapt v. 1.2
// HTML data-da="where(uniq class name), position(digi), when(breakpoint), mobile first or computer first('min' or 'max'), when back (second breakpoint)"
// e.x. data-da="item, 2, 992, max, 768"
// Artyom Rassadin 2021
// My brains
// copy from my head 22.02.2021

// ===== /recoding ========================================================================================================================================================

"use strict";

(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];

	// Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');

			if (daMove != '') {
				const daArray = daMove.split(','); // разбиваем массив
				const daPlace = daArray[1] ? daArray[1].trim() : 'last'; // место в какое по счету перемещаем
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767'; // на каком разрешении перемещаем
				const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
				const daSecondBreakpoint = daArray[4] ? daArray[4].trim() : '';

				const daDestination = document.querySelector('.' + daArray[0].trim()) // место куда перемещаем ( элемент в DOM-дереве )

				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);

					// Заполняем массив первоначальных позиций

					originalPositions[number] = {
						"parent": daElement.parentNode, // получаем родителя
						"index": indexInParent(daElement) // получаем индекс ЭТОГО элемента в элементе РОДИТЕЛЯ
					};

					// Заполняем массив элементов

					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType,
						"secondBreakpoint": daSecondBreakpoint,
					}

					number++;
				}
			}
		}

		console.log(daElementsArray)
		dynamicAdaptSort(daElementsArray);

		// Создаем события в точке брейкпоинта

		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;
			const daSecondBreakpoint = el.secondBreakpoint;
				
			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px) and (min-width: " + daSecondBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}

	// Основная функция
	
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element; // сам элемент
			const daDestination = el.destination; // то куда перебрасываем элемент
			const daPlace = el.place; // место в какое по счету перемещаем
			const daBreakpoint = el.breakpoint; // на каком брейкпоинте перемещаем элемент
			const daSecondBreakpoint = el.secondBreakpoint;

			const daClassname = "_dynamic_adapt_" + daBreakpoint; // создание нейминга класса

			if (daMatchMedia[index].matches) {
				// Перебрасываем элементы
				if (!daElement.classList.contains(daClassname) && document.body.clientWidth > daSecondBreakpoint) {
					let actualIndex = indexOfElements(daDestination)[daPlace];

					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}

					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				// Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}

				if (document.body.clientWidth <= daSecondBreakpoint || document.body.clientWidth > daBreakpoint) {
					dynamicAdaptBack(daElement);
				}
			}
		}

		customAdapt();
	}

	// Вызов основной функции

	dynamicAdapt();

	// Функция возврата на место

	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex]; // получаем расположение элемента 
		const parentPlace = originalPlace['parent']; // получаем родителя элемента
		const indexPlace = originalPlace['index']; // получаем индекс этого элемента в элементе родителя
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace]; // определенный элемент из функции получения массива индексов элементов внутри родителя
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]); // создаем новый элемент с каким-либо HTML-кодом
	}

	// Функция получения индекса внутри родителя

	function indexInParent(el) {
		let children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}

	// Функция получения массива индексов элементов внутри родителя 

	function indexOfElements(parent, back) {
		const children = parent.children; // получение всех детей в виде коллекции
		const childrenArray = []; 

		for (let i = 0; i < children.length; i++) { // перебираем каждый из детей
			const childrenElement = children[i]; // получаем одного из детей из коллекции

			if (back) {
				childrenArray.push(i);
			} else {
				// Исключая перенесенный элемент

				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}

		return childrenArray;
	}

	// Сортировка объекта

	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) { return 1 } else { return -1 }
		});
	}

	// Дополнительные сценарии адаптации

	function customAdapt() {
		// const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
}());; 

// ===== noUiSlider ===========================================================================================================================================================

// Подключать непосредственно выше этого файла в основом проекте

// ===== Slider ========================================================================================================================================================

/*let swiper = new Swiper('.slider', {
	pagination: {
		el: '.swiper-pagination',
    	type: 'bullets',
    	clickable: true,
	},
    grabCursor: true,
})

let items = document.querySelectorAll('.flex__item');

let allProgressBar = document.querySelectorAll('.item__progressbar');
	progressBar = items[swiper.activeIndex].querySelector('.item__progressbar');

function animationUp(elem, value) {
	 if (value < 100) {
		setTimeout(() => {
			elem.value += 2;
			animationUp(elem, elem.value)
		}, 1);
	}
}

function animationDown(elem, value) {
	if (value > 0) {
		setTimeout(() => {
			elem.value -= 2;
			animationDown(elem, elem.value)
		}, 1);
	}
}

function activeSlides(num) {
	for (let elem of allProgressBar) {
		if (i <= num) {
			animationUp(elem, elem.value);
			i++;
		} else if (i > num) {
			animationDown(elem, elem.value);
			i++;
		}
	}
}

animationUp(progressBar, progressBar.value);

swiper.on('slideChange', () => {
	let itemCount = document.querySelectorAll('.item__count');
	let itemName = document.querySelectorAll(".item__name");

	for (let elem of allProgressBar) {
		if (elem.value > 0 && elem.value < 100) {
			animationDown(elem, elem.value);
		}
	}

	for (let elem of itemCount) {
		if (elem.classList.contains('active')) {
			elem.classList.remove('active');
		}
	}

	for (let elem of itemName) {
		if (elem.classList.contains('active')) {
			elem.classList.remove('active');
		}
	}

	let childrenFirst = items[swiper.activeIndex].querySelector('.item__count');
	let childrenSecond = items[swiper.activeIndex].querySelector('.item__name');

	childrenFirst.classList.add('active');
	childrenSecond.classList.add('active');

	let swiperSlide = document.querySelectorAll('.swiper-slide');
		activeSlide = swiper.activeIndex;
		progressBar = items[swiper.activeIndex].querySelector('.item__progressbar');
		i = 0;

	activeSlides(activeSlide)
})

// ===== feadback slider ========================================================================================================================================================


let feadbackSlider = new Swiper('.feadback-slider', {
	pagination: {
		el: '.swiper-pagination',
    	type: 'bullets',
    	clickable: true,
	},
	navigation: {
   	  nextEl: '.swiper-button-next',
   	  prevEl: '.swiper-button-prev',
   	},
    grabCursor: true,
});*/

// ===== Number animation with slow motion ========================================================================================================================================================

/* let animationTime = 1000; // ms
let numb = 150;
let step = 1;
let value = animationTime / numb / step;
let i = 0;
let number = 0;

function animation(num, elem) {
	let timeout = setTimeout(() => {
		if (num >= number) {
			if (i > numb / step - 15) { // замедление "15" нужно менять
				value += 10;
			}
			i++;

			elem.firstChild.innerHTML = number; // изменение числа
			number += step;
			animation(num, elem);
		} else if (num < number) {
			clearTimeout(timeout)
		}
	}, value)
}; */

// ===== Dropdown menu ========================================================================================================================================================

/* 
let isMobile = {
	Android: function() {return navigator.userAgent.match(/Android/i);},
	BlackBerry: function() {return navigator.userAgent.match(/BlackBerry/i);},
	iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},
	Opera: function() {return navigator.userAgent.match(/Opera Mini/i);},
	Windows: function() {return navigator.userAgent.match(/IEMobile/i);},
	any: function() {return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());}
};

let body = document.querySelector('body');

if (isMobile.any()) {
	
	body.classList.add('touch');
	let arrow=document.querySelectorAll('.arrow');

	for (i = 0; i < arrow.length; i++) {
		let thisLink=arrow[i].previousElementSibling;
		let subMenu=arrow[i].nextElementSibling;
		let thisArrow=arrow[i];

		thisLink.classList.add('parent');
		arrow[i].addEventListener('click', function(){
			subMenu.classList.toggle('open');
			thisArrow.classList.toggle('active');
		});
	}

} else {
	body.classList.add('mouse');
}; */;

let button = document.getElementById('heading-href');

button.addEventListener('click', () => {
	let inputName = document.getElementById('name')
	let inputEmail = document.getElementById('email')
	let inputSubject = document.getElementById('subject')
	let inputContact = document.getElementById('contact')

	inputName.value = '';
	inputEmail.value = '';
	inputSubject.value = '';
	inputContact.value = '';
})
