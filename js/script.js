/*==========================================================================================================================================================================*/
/* Проверка устройства, на котором открыта страница */
const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows());
    }
};


function isIE() {
    ua = navigator.userAgent;
    var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
    return is_ie;
}
if (isIE()) {
    document.querySelector("body").classList.add("ie");
}
if (isMobile.any()) {
    document.querySelector("body").classList.add("_touch");
}


function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
    if (support == true) {
        document.querySelector("body").classList.add("_webp");
    } else {
        document.querySelector("body").classList.add("_no-webp");
    }
});



/*==================================================================================================================================================================*/
/* Глобальные переменные и константы */
let lockStatus = false;                                                     // Статус блокировки действий пользователя в body.



/*==========================================================================================================================================================================*/
/* Функции Анимации */
let _slideUp = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains("_slide")) {
        target.classList.add("_slide");
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = `${target.offsetHeight}px`;
        target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = showmore ? `${showmore}px` : `0px`;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
            target.hidden = !showmore ? true : false;
            !showmore ? target.style.removeProperty("height") : null;
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            !showmore ? target.style.removeProperty("overflow") : null;
            target.style.removeProperty("transition-duration");
            target.style.removeProperty("transition-property");
            target.classList.remove("_slide");
            document.dispatchEvent(new CustomEvent("slideUpDone", {
                detail: {
                    target: target
                }
            }));
        }, duration);
    }
}


let _slideDown = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains("_slide")) {
        target.classList.add("_slide");
        target.hidden = target.hidden ? false : null;
        showmore ? target.style.removeProperty("height") : null;
        let height = target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = showmore ? `${showmore}px` : `0px`;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = height + "px";
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        window.setTimeout(() => {
            target.style.removeProperty("height");
            target.style.removeProperty("overflow");
            target.style.removeProperty("transition-duration");
            target.style.removeProperty("transition-property");
            target.classList.remove("_slide");
            document.dispatchEvent(new CustomEvent("slideDownDone", {
                detail: {
                    target: target
                }
            }));
        }, duration);
    }
}


let _slideToggle = (target, duration = 500) => {
    if (target.hidden) {
        return _slideDown(target, duration);
    } else {
        return _slideUp(target, duration);
    }
}



/*==========================================================================================================================================================================*/
/* "Клик на документе" */
document.addEventListener("click", function(e) {
    const targetElement = e.target;
    if (!targetElement.closest(".menu-header") && !targetElement.classList.contains("header-burger__icon") && document.querySelector(".menu-header._active")) {
        document.body.classList.remove("_menu-open");
        document.querySelector(".menu-header").classList.remove("_active");
        document.querySelector(".header-burger__icon").classList.remove("_active");
        bodyLockToggle(true, false);
    }
})



/*==========================================================================================================================================================================*/
/* Menu Burger */
if (document.querySelector(".header-burger__icon")) {
    let delay = 500;
    let menuBody = document.querySelector(".menu-header");
    let iconOpenMenu = document.querySelector(".header-burger__icon");
    let iconCloseMenu = document.querySelector(".menu-header__close");
    iconOpenMenu.addEventListener("click", function (e) {
        bodyLockToggle(false, false, delay);
        menuOpen(menuBody, iconOpenMenu);
    });
    iconCloseMenu.addEventListener("click", function (e) {
        bodyLockToggle(true, false, delay);
        menuClose(menuBody, iconOpenMenu);
    });
}


function menuOpen(menuBody, iconOpenMenu) {
    document.body.classList.add("_menu-open");
    menuBody.classList.add("_active");
    iconOpenMenu.classList.add("_active");
}


function menuClose(menuBody, iconOpenMenu) {
    document.body.classList.remove("_menu-open");
    menuBody.classList.remove("_active");
    iconOpenMenu.classList.remove("_active");
}



/*==========================================================================================================================================================================*/
/* Плавная прокрутка к блоку */
const menuLinks = document.querySelectorAll("[data-goto]");
if (menuLinks) {
    menuLinks.forEach(elem => {
        elem.addEventListener("click", gotoBlock);
    });
} 


function gotoBlock(e) {
    const targetBlock = e.target.getAttribute("data-goto");
    const targetBlockElement = document.querySelector(targetBlock);
    removeActiveClasses(menuLinks, "_active");
    e.target.classList.add("_active");
    if (targetBlockElement) {
        // Закрытие открытого меню:
        document.documentElement.classList.contains("_menu-open") ? menuClose() : null;
        
        
        // Прокрутка:
        window.scrollTo({
            top: targetBlockElement.getBoundingClientRect().top + window.scrollY,
            behavior: "smooth",
        });
        e.preventDefault();  
    } else {
        console.log(`[gotoBlock]: Такого блока нет на странице: ${targetBlock}`);
    }
};


function removeActiveClasses(array, className) {
    for (let i = 0; i < array.length; i++) {
        array[i].classList.remove(className);
    }
}



/*==================================================================================================================================================================*/
/* Класс Popup */
class Popup {
    constructor(options) {
        // Classes:
        this.popupClasses = {
            // Body:
            classBodyPopupActive: "open-popup",                                     // Класс body при открытом popup.
            // Buttons:
            attributeOpenButton: "data-popup",                                      // Атрибут кнопки, вызывающей popup.
            attributeVideo: "data-video",                                           // Атрибут кнопки для popup-video.
            attributePosterVideo: "data-poster",                                    // Атрибут для постера popup-video.
            attributeVideoYoutube: "data-youtube",                                  // Атрибут для кода видео youtube.
            // Elements:
            attributeFixedElements: "data-fixed",                                   // Атрибут для элементов с position:fixed.
            // Popup:
            classPopup: "_popup",                                                   // Попап.
            classPopupActive: "popup-open",                                         // Класс открытого popup. 
            classPopupBody: "_popup-body",                                          // Тело попапа.
            classPopupContent: "_popup-content",                                    // Контент попапа.  
            classPopupCloseButton: "_popup-close",                                  // Кнопка, закрывающая popup. 
            classPopupVideo: "popup-video__item",                                   // Класс элемента для вставки видео.                      
        }

        // Options:
        this.startOptions = {
            logging: true,                                                          // Вывод информационных сообщений в консоль.
            init: true,                                                             // Инициализация попапов.
            bodyLock: true,                                                         // Блокировка скролла.
            closeEsc: true,                                                         // Закрытие по нажатии на клавишу "Esc".
            delay: 800,
            autoplayVideo: false,                                                   // Автовоспроизведение видео при открытии попапа.
            controlsVideo: true,                                                    // Стандартные элементы управления видео. 
            // Events:
            on: { 
                beforeOpen: function () {},
                afterOpen: function () {},
                beforeClose: function () {},
                afterClose: function () {},
            },
        }

        options ? this.popupOptions = {...this.startOptions, ...options} : this.popupOptions = this.startOptions;

        // Состояния:
        this.bodyLock = false;                                                      // Состояние блокировки скролла.
        this.isOpen = false;                                                        // Состояние попапа: открыт/закрыт.                                                   
        this.nextOpen = false;                                                      // Открытие следующего попапа и закрытие текущего.                                                   

        // Текущий открытый popup:
        this.openPopup = {
            selector: false,
            element: false,
        }

        // Предыдущий открытый popup:
        this.previousOpenPopup = {
            selector: false,
            element: false,
        }

        this.fixedElements = document.querySelectorAll(`[${this.popupClasses.attributeFixedElements}]`);
        this.popupOptions.init ? this.initPopup() : null;
    }


    /*=========================================================================*/
    /* Инициализация popup */
    initPopup() {
        const popupButtons = document.querySelectorAll("[data-popup]");
        if (popupButtons) {
            popupButtons.forEach(popupButton => {
                popupButton.addEventListener("click", function (e) {
                    e.preventDefault();
                    this.getOpenPopup(e.target);
                }.bind(this));
            });
        }
    }


    /*=========================================================================*/
    /* Обработчик событий, вызывающих открытие popup */
    getOpenPopup(targetElement) {
        this.popupButton = targetElement;
        const popupName = this.popupButton.getAttribute(this.popupClasses.attributeOpenButton);
        this.openPopup.selector = popupName;
        this.openPopup.element = document.querySelector(this.openPopup.selector);
        this.openPopup.element ? this.popupOpen() : null;
    }


    /*=========================================================================*/
    /* Открытие popup */
    popupOpen() {
        if (!lockStatus) {
            // Присвоение значения состоянию "bodyLock" в зависимости от наличия класса "lock" у body: 
            this.bodyLock = document.body.classList.contains("_lock") ? true : false;

            // Если уже имеется открытый попап => ставим состояние "открытие следующего попапа" и закрываем текущий:
            if (this.isOpen) {
                this.nextOpen = true;
                this.popupClose();
            }

            // Создание собственного события перед открытием попапа:
            this.popupOptions.on.beforeOpen(this);
            document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                detail: {
                    popup: this
                }
            }));

            // Присвоение открываемому попапу класса "popup-open" и атрибуту "aria-hidden" значения false:
            this.openPopup.element.classList.add(this.popupClasses.classPopupActive);
            this.openPopup.element.setAttribute("aria-hidden", "false");

            // Присвоение текущего попапа объекту последнего открытого popup:
            this.previousOpenPopup.selector = this.openPopup.selector;
            this.previousOpenPopup.element = this.openPopup.element;
            
            // Вызов функции обработки блокировки/разблокировки скролла, указание значения попапу "открыт" и присвоение body значения "блокирован":
            !this.nextOpen ? bodyLockToggle(this.bodyLock, this.fixedElements, this.popupOptions.delay) : null;
            document.body.classList.add(this.popupClasses.classBodyPopupActive);
            this.isOpen = true;
            this.bodyLock = true;

            // Создание собственного события после открытия попапа:
            this.popupOptions.on.afterOpen(this);
            document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                detail: {
                    popup: this
                }
            }));

            // Если на странице имеется форма с обязательными полями => снимаем у всех полей класс "ошибка валидации": 
            if (document.querySelector("[data-required]")) {
                let formRequired = document.querySelectorAll("[data-required]");
                removeClassesName(formRequired, "_error");
            }

            // Запуск обработчика событий:
            this.popupEvents();
        }
    }


    /*=========================================================================*/
    /* Обработчик событий popup */
    popupEvents() {
        // "Клик" на области открытого попапа:
        this.openPopup.element.addEventListener("click", function (e) {
            // Если событие "клик" вызывается на области вне контента попапа или на кнопке "закрыть":
            if (e.target.classList.contains(`${this.popupClasses.classPopupCloseButton}`) || !e.target.closest(`.${this.popupClasses.classPopupContent}`)) {
                e.preventDefault();
                this.nextOpen = false;					
                this.isOpen ? this.popupClose() : null; 
            }
        }.bind(this));

        // Закрытие по "клику" на клавишу "Esc":
        document.addEventListener("keydown", function (e) {
            if (this.popupOptions.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
                e.preventDefault();
                this.nextOpen = false;
                this.popupClose();
            }
        }.bind(this));
    }


    /*=========================================================================*/
    /* Закрытие popup */
    popupClose() {
        if (!this.isOpen || lockStatus) {
            return;
        }

        // Создание собственного события перед закрытием попапа:
        this.popupOptions.on.beforeClose(this);
        document.dispatchEvent(new CustomEvent("beforePopupClose", {
            detail: {
                popup: this
            }
        }));

        // Очистка контента popup video:
        if (this.openPopup.element.querySelector(`.${this.popupClasses.classPopupVideo}`)) {
            this.openPopup.element.querySelector(`.${this.popupClasses.classPopupVideo}`).innerHTML = "";
        }

        // Удаление у открытого попапа класса "popup-open" и присвоение атрибуту "aria-hidden" значения true:
        this.previousOpenPopup.element.classList.remove(this.popupClasses.classPopupActive);
        this.previousOpenPopup.element.setAttribute("aria-hidden", "true");

        // Вызов функции обработки блокировки/разблокировки скролла:
        !this.nextOpen ? bodyLockToggle(this.bodyLock, this.fixedElements, this.popupOptions.delay) : null;

        // Присвоение body класса "open-popup" и состояниям "попап открыт" и блокировки скролла значения false:
        document.body.classList.remove(this.popupClasses.classBodyPopupActive);
        this.isOpen = false;
        this.bodyLock = false;

        // Создание собственного события после закрытия попапа:
        this.popupOptions.on.afterClose(this);
        document.dispatchEvent(new CustomEvent("afterPopupClose", {
            detail: {
                popup: this
            }
        }));

        // Если попап имеет форму с обязательными полями => снимаем у всех полей класс "ошибка валидации":
        if (document.querySelector("[data-required]")) {
            let formRequired = document.querySelectorAll("[data-required]");
            removeClassesName(formRequired, "_error");							
        } 
    }


    /*=========================================================================*/
    /* Вывод информационного сообщения */
    setLogging(message) {
        this.selectOptions.logging ? console.log(`[select]: ${message}`) : null;
    }
}
new Popup({});



/*==================================================================================================================================================================*/
/* Функции блокировки/разблокировки скролла */
function bodyLockToggle(lock, fixedElements, delay = 500) {
    lock ? bodyUnlock(fixedElements, delay) : bodyLock(fixedElements, delay);
}

// Функция блокировки скролла при открытии элемента:
function bodyLock(fixedElements, delay) {
    let body = document.querySelector("body");
    if (!lockStatus) {
        const scrollWidth = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
        if (fixedElements) {
            fixedElements.forEach(fixedElement => {
                fixedElement.style.marginRight = scrollWidth;
            });
        }
        body.style.paddingRight = scrollWidth;
        body.classList.add("_lock");
        lockStatus = true;
        setTimeout(function () {
            lockStatus = false;
        }, delay);
    }
}


// Функция разблокировки скролла при закрытии элемента:
function bodyUnlock(fixedElements, delay) {
    let body = document.querySelector("body");
    if (!lockStatus) {
        setTimeout(() => {
            if (fixedElements) {
                fixedElements.forEach(fixedElement => {
                    fixedElement.style.marginRight = "0px";
                });
            }
            body.style.paddingRight = "0px";
            body.classList.remove("_lock");
        }, delay);
        lockStatus = true;
        setTimeout(function () {
            lockStatus = false;
        }, delay);
    }
}



/*==========================================================================================================================================================================*/
/* Удаление класса у массива переданных элементов */
function removeClassesName(elements, className) {
    elements.forEach(elements => {
        elements.classList.remove(className);
    });		
}


/*==========================================================================================================================================================================*/
/* Динамический Адаптив */
function dynamicAdapt(type) {
	this.type = type;
}


// Функция адаптива:
dynamicAdapt.prototype.init = function () {
	const _this = this;		
	this.оbjects = [];																				// Массив объектов.
	this.daClassname = "_dynamic_adapt_";	
	this.nodes = document.querySelectorAll("[data-da]");											// Массив DOM-элементов.
	for (let i = 0; i < this.nodes.length; i++) {													// Наполнение оbjects объектами.
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}
	this.arraySort(this.оbjects);
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {					// Массив уникальных медиа-запросов.
		return "(" + this.type + "-width: " + item.breakpoint + "em)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});
	for (let i = 0; i < this.mediaQueries.length; i++) {											// Навешивание слушателя на медиа-запрос и вызов обработчика 
		const media = this.mediaQueries[i];															// при первом запуске.
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];			
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {			// Массив объектов с подходящим брейкпоинтом.
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};


// Функция перемещения:
dynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};


// Функция перемещения:
dynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === "last" || place >= destination.children.length) {
		destination.insertAdjacentElement("beforeend", element);
		return;
	}
	if (place === "first") {
		destination.insertAdjacentElement("afterbegin", element);
		return;
	}
	destination.children[place].insertAdjacentElement("beforebegin", element);
}


// Функция возврата:
dynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement("beforebegin", element);
	} else {
		parent.insertAdjacentElement("beforeend", element);
	}
}


// Функция получения индекса внутри родителя:
dynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};


// Функция сортировки массива по breakpoint и place по возрастанию для this.type = min по убыванию для this.type = max:
dynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}
				if (a.place === "first" || b.place === "last") {
					return -1;
				}	
				if (a.place === "last" || b.place === "first") {
					return 1;
				}
				return a.place - b.place;
			}	
			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}	
				if (a.place === "first" || b.place === "last") {
					return 1;
				}
				if (a.place === "last" || b.place === "first") {
					return -1;
				}
				return b.place - a.place;
			}	
			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};
const da = new dynamicAdapt("max");
da.init();



/*==========================================================================================================================================================================*/
/* Quiz */
const quizTemplate = (data = [], dataLength, options) => {      // Функция формирования разметки HTML квиза на основе полученных данных из data.js.
    const answers = data.answers.map((item, i) => {
        if (item.type == "radio") {
            if (data.questionName === "type-site") {
                return `
                    <div class="options-quiz__item">
                        <input id="answer-${i}" type="${item.type}" name="${data.questionName}" data-type="${item.typeBathrobe}"
                         class="options-quiz__input" value="${item.answerTitle}">
                        <label for="answer-${i}" class="options-quiz__text">
                            <div class="options-quiz__image">
                                <img src="${item.image}" alt="${item.answerTitle}">
                                <span><img src="img/svg-icons/check-quiz.svg"></span>
                            </div>
                            <span>${item.answerTitle}</span>
                        </label>
                    </div>
                `;
            } 
            if (data.questionName === "start-time") {
                if (item.answerInput) {
                    return `
                    <div class="options-quiz__item">
                        <input id="answer-${i}" type="${item.type}" name="${data.questionName}" class="options-quiz__input _input-main" value="${item.answerTitle}">
                        <label for="answer-${i}" class="options-quiz__text">
                            <span>${item.answerTitle}</span>
                        </label>
                    </div>
                    <div class="options-quiz__item options-quiz__item_option">
                        <input type="text" name="${data.questionName}" placeholder="${item.answerInput}" class="_input">
                    </div>
                `;
                } else {
                    return `
                        <div class="options-quiz__item">
                            <input id="answer-${i}" type="${item.type}" name="${data.questionName}" class="options-quiz__input" value="${item.answerTitle}">
                            <label for="answer-${i}" class="options-quiz__text">
                                <span>${item.answerTitle}</span>
                            </label>
                        </div>
                    `;
                }
            }
        }
        if (item.type === "message") {
            return `
                <div class="options-quiz__item">
                    <textarea name="${data.questionName}" placeholder="${item.answerTitle}" class="_textarea"></textarea>
                </div>
            `;
        }
        if (item.type === "text") {
            return `
                <div class="options-quiz__item">
                    <input type="${item.type}" name="${data.questionName}" placeholder="${item.answerTitle}" data-required class="_input">
                </div>
            `;
        }
        if (item.type === "tel") {
            return `
                <div class="options-quiz__item">
                    <input type="${item.type}" name="${data.questionName}" placeholder="${item.answerTitle}" data-required class="_input _tel">
                </div>
            `;
        }
    });
    if (data.questionName !== "contacts") {
        return `
            <div class="question-quiz__main main-quiz">
                <div class="main-quiz__title">${data.title}</div>
                <div class="main-quiz__options options-quiz">
                    ${answers.join("")}
                </div>
            </div>
            <div class="main-quiz__action action-quiz">
                <button type="button" data-next-btn class="action-quiz__button _button">${options.nextButtonText} 
                    <img src="img/button/image.png" alt="кнопка">
                </button>
            </div>
        `;
    } else {
        return `
            <div class="question-quiz__main main-quiz">
                <div class="main-quiz__title">${data.title}</div>
                <div class="main-quiz__text">${data.text}</div>
                <div class="main-quiz__options options-quiz">
                    ${answers.join("")}
                </div>
            </div>
            <div class="main-quiz__action action-quiz">
                <button type="button" data-send class="action-quiz__button _button _disabled">${options.sendButtonText} 
                    <img src="img/button/image.png" alt="кнопка">
                </button>
            </div>
        `;
    }
};


class Quiz {                                                                           
    constructor(quiz, data, options) {
        this.quiz = document.querySelector(quiz);                              
        this.quizContent = document.querySelector(".question-quiz__content");                                               
        this.data = data;                                                                           // Данные квиза (из data.js).
        this.options = options;                                                                     // Опции.
        this.dataLength = this.data.length;                                                         // Длина массива quizData.
        this.subQuestion = 0;
        this.progress = 0;
        this.returnBack = false;
        this.counter = 0;
        this.valueInputPhone = 0;
        this.resultArray = [];                                                                      // Результирующий массив выбранных ответов.
        this.tempData = {};                                                                         // Временное хранилище каждого выбранного ответа.
        this.init();
        this.events();
    }


    // Инициализация квиза:
    init() {
        this.quizContent.innerHTML = quizTemplate(quizData[this.counter], this.dataLength, this.options);  // Вывод разметки первого вопроса.
        document.querySelector(".progress-quiz__text_progress").innerHTML = this.counter;
        document.querySelector(".progress-quiz__text_length").innerHTML = this.dataLength - 1;
        this.quiz.querySelector(".question-quiz__body").classList.add("_question-type");
    }

    
    // Обработка событий в квизе:
    events() {
        let validInputPhone = false;
        this.quiz.addEventListener("input", (e) => {
            if (e.target.tagName === "INPUT") {
                switch (this.counter) {
                    case 0:
                        this.tempData = this.serialize(this.quiz);
                        this.addToSend();
                        this.animation();  
                        setTimeout(() => {
                            this.nextQuestion();
                        }, 500); 
                        break;
                    case 3: 
                        e.target.value.length == 17 ? validInputPhone = true : validInputPhone = false;
                        validInputPhone ? document.querySelector("[data-send]").classList.remove("_disabled") 
                        : document.querySelector("[data-send]").classList.add("_disabled");
                        break;
                    default:
                        break;
                }  
            }
        });
        this.quiz.addEventListener("click", (e) => {
            if (e.target == document.querySelector("[data-next-btn]")) {
                this.animation();                                                              
                if (this.counter === 3) {
                    this.tempData = this.serialize(this.quiz);
                    this.addToSend();
                }
                this.nextQuestion();                                                // Вызов функции рендеринга следующего вопроса.
            }
            if (e.target == document.querySelector("[data-send]")) {                // Если "клик" по button с [data-send] (последний вопрос) ==>
                this.tempData = this.serialize(this.quiz);
                this.addToSend();             
                this.send();                                                        // Запустить метод отправки данных.
            }
        });
    }


    // Переключение вопросов вперед:
    nextQuestion() {
        if (this.counter + 1 < this.dataLength) {                                               
            this.counter++;
            document.querySelector(".progress-quiz__text_progress").innerHTML = this.counter;
            this.quizContent.innerHTML = quizTemplate(quizData[this.counter], this.dataLength, this.options);
            switch (this.counter) {
                case 1:
                    this.quiz.querySelector(".question-quiz__body").classList.remove("_question-type");
                    this.quiz.querySelector(".question-quiz__body").classList.add("_question-message");
                    break;
                case 2:
                    this.quiz.querySelector(".question-quiz__body").classList.remove("_question-message");
                    this.quiz.querySelector(".question-quiz__body").classList.add("_question-time");
                    const radioButtons = document.querySelectorAll("input[type='radio']");
                    radioButtons.forEach(radioButton => {
                        radioButton.addEventListener("change", function(e) {
                            if (e.target.classList.contains("_input-main")) {
                                e.target.closest(".options-quiz").classList.add("_main-option");
                            } else {
                                e.target.closest(".options-quiz").classList.contains("_main-option") 
                                    ? e.target.closest(".options-quiz").classList.remove("_main-option")
                                    : null;
                            }
                        });
                    });
                    break;
                case 3:
                    this.quiz.querySelector("[data-send]").classList.add("_disabled");
                    this.quiz.closest(".block-quiz").classList.add("_last-question");
                    this.quiz.closest(".block-quiz").querySelector(".line-quiz").classList.add("_active");
                    this.quiz.querySelector(".question-quiz__body").classList.remove("_question-time");
                    this.quiz.querySelector(".question-quiz__body").classList.add("_question-form");
                    inputMask();
                    break;
                default:
                    break;
            }
        }
    }


    // Функция анимации прогресс-бара:
    animation(back = false) {
        !back ? this.progress = ((this.counter + 1) / (this.data.length - 1)) * 100 : this.progress = ((this.counter - 1) / (this.data.length - 1)) * 100;
        document.querySelector(".progress-quiz__indicator").style.transform = `translateX(${this.progress}%)`;
    }


    // Функция добавления выбранного ответа в результирующий массив с ответами:
    addToSend() {
        this.resultArray.push(this.tempData);
    }


    // Отправка формы:
    send() {
        const formData = new FormData();
        for (let item of this.resultArray) {
            for (let obj in item) {
                formData.append(obj, item[obj].substring(0, item[obj].length - 1))              // Формируем объект formData на основе resultArray.
            }
        }
        const response = fetch("./../files/php/quiz.php", {
            method: "POST",
            body: formData
        });
    }


    // Функция записи временно-выбранного ответа (при каждом "change" на "input"):
    serialize(form) {
        let field, s = {};
        let valueString = "";
        if (typeof form == "object" && form.nodeName == "FORM") {
            for (let i = 0; i < form.elements.length; i++) {
                field = form.elements[i];
                if (field.name && !field.disabled && field.type != "file" && field.type != "reset" && field.type != "submit" && field.type != "button") {
                    if (field.type == "select-multiple") {
                        for (j = form.elements[i].options.length - 1; j >= 0; j--) {
                            if (field.options[j].selected) {
                                s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
                            }
                        }
                    } else if ((field.type != "checkbox" && field.type != "radio" && field.value) || field.checked) {
                        // this.resultArray = this.resultArray.filter(item => )
                        field.name === this.resultArray ? s[field.name] = 0 : null;
                        s[field.name] = field.value;
                    }
                }
            }
        }
        return s;
    }
}


window.quiz = new Quiz(".question-quiz", quizData, {                                                // Создание класса Quiz с передачей ему опций.
    nextButtonText: "Далее",
    sendButtonText: "Получить расчет"
});



/*==========================================================================================================================================================================*/
/* Animation On Scroll & Lazy Loading */
window.addEventListener("DOMContentLoaded", function () {
    // Animation On Scroll:
    let thresholdValue;
    isMobile.any() ? thresholdValue = 0.05 : thresholdValue = 0.3;
    const optionsAnim = {
        root: null,
        threshold: thresholdValue,
	}


    // Анимация появления элементов: 
    if (!isMobile.any()) {
        const observerAnim = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("_show");
                    observer.unobserve(entry.target);
                }
            })
        }, optionsAnim);
        document.querySelectorAll("._animation").forEach(item => {
            observerAnim.observe(item);
        })
    }  


    // Lazy Loading:
    const optionsLazy = {
		root: null,
		rootMargin: "600px",
	}

    const observerLazy = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
                if (entry.target.querySelector("picture")) {
                    let pictureSource = entry.target.querySelector("source");
                    pictureSource.srcset = pictureSource.dataset.srcset;
                }
                let pictureImage = entry.target.querySelector("img");
                pictureImage.src = pictureImage.dataset.src;
				observer.unobserve(entry.target);
			}
		})
	}, optionsLazy);
	document.querySelectorAll("._lazy").forEach(item => {
		observerLazy.observe(item);
	})


    // Video:
    const optionsVideo = {
		root: null,
		rootMargin: "-10% 0% -20%",
	}

    let video = document.querySelector(".video");
    const observerVideo = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
                video.setAttribute("autoplay", "");
                video.play();
                observer.unobserve(entry.target);
			}
		})
	}, optionsVideo);
    observerVideo.observe(video);
})



/*==========================================================================================================================================================================*/
/* Маска для телефона */
if (document.querySelector("._tel")) {
    function inputMask() {
        let phoneInputs = document.querySelectorAll("._tel");

        let getInputNumbersValue = function (input) {
            return input.value.replace(/\D/g, "");
        }
    
        function onPhonePaste(e) {
            let input = e.target;
            let inputNumbersValue = getInputNumbersValue(input);
            let pasted = e.clipboardData || window.clipboardData;
            if (pasted) {
                let pastedText = pasted.getData("Text");
                if (/\D/g.test(pastedText)) {
                    // Attempt to paste non-numeric symbol — remove all non-numeric symbols,
                    // formatting will be in onPhoneInput handler
                    input.value = inputNumbersValue;
                    return;
                }
            }
        }
    
        function onPhoneInput(e) {
            let input = e.target;
            let inputNumbersValue = getInputNumbersValue(input);
            let selectionStart = input.selectionStart;
            console.log(input.selectionStart);
            let formattedInputValue = "";
            if (!inputNumbersValue) {
                return input.value = "";
            }
    
            if (input.value.length != selectionStart) {
                // Editing in the middle of input, not last symbol
                if (e.data && /\D/g.test(e.data)) {
                    // Attempt to input non-numeric symbol
                    input.value = inputNumbersValue;
                }
                return;
            }
    
            if (["7", "8"].indexOf(inputNumbersValue[0]) > -1) {
                let firstSymbols = (inputNumbersValue[0] == "8") ? "+8" : "+7";
                formattedInputValue = input.value = firstSymbols + " ";
                if (inputNumbersValue.length > 1) {
                    formattedInputValue += "(" + inputNumbersValue.substring(1, 4);
                }
                if (inputNumbersValue.length >= 5) {
                    formattedInputValue += ") " + inputNumbersValue.substring(4, 7);
                }
                if (inputNumbersValue.length >= 8) {
                    formattedInputValue += "-" + inputNumbersValue.substring(7, 9);
                }
                if (inputNumbersValue.length >= 10) {
                    formattedInputValue += "-" + inputNumbersValue.substring(9, 11);
                }
            } else {
                formattedInputValue = "";
            }
            input.value = formattedInputValue;
        }
    
        function onPhoneKeyDown(e) {
            // Clear input after remove last symbol
            let inputValue = e.target.value.replace(/\D/g, "");
            if (e.keyCode == 8 && inputValue.length == 1) {
                e.target.value = "";
            }
        }
    
        for (let phoneInput of phoneInputs) {
            phoneInput.addEventListener("keydown", function(e) {
                onPhoneKeyDown(e);
            });
            phoneInput.addEventListener("input", function(e) {
                onPhoneInput(e);
            });
            phoneInput.addEventListener("paste", function(e) {
                onPhonePaste(e);
            });
        }
    }
    inputMask();
}



/*==========================================================================================================================================================================*/
/* Валидация Формы */
let forms = document.querySelectorAll("._form");
let form;
for (let i = 0; i < forms.length; i++) {
    form = forms[i];
    form.addEventListener("submit", formSend);
}  


// Функция проверки и обработки результатов валидации формы:
async function formSend(e) {
    e.preventDefault();
    let error = formValidate(form);
    let formData = new FormData(form);
    if (error === 0) {
        inputRemoveError();
        let response = await fetch("form.php", {
            method: "POST",
            body: formData
        });
        if (response.ok) {
            let result = await response.json();
            alert(result.message);
            formPreview.innerHTML = "";
            form.reset();
        } else {
            alert("Ошибка отправки");
        }
    } else {
        alert("Заполните обязательные поля");
    }
}
            
            
// Функция валидации формы:
function formValidate(form) {
    let error = 0;
    let formReq = document.querySelectorAll("[data-required]");
    for (let index = 0; index < formReq.length; index++) {
        const input = formReq[index];
        formRemoveError(input);
        if (input.classList.contains("_email")) {
            if (emailTest(input)) {
                formAddError(input);
                error++;
            }
        }
        if (input.classList.contains("_tel")) {
            if (input.value.length !== 18) {
                formAddError(input);
                error++;
            }
        } 
        if (input.value === "") {
            formAddError(input);
            error++;
        }
        if (input.getAttribute("type") === "checkbox" && input.checked === false) {
            formAddError(input);
            error++;
        }
    }
    return error;
}
            
            
// Функция добавления полю ввода и его родителю класса "_error" (ошибка):
function formAddError(input) {
    input.parentElement.classList.add("_error");
    input.classList.add("_error");
}
           
             
// Функция удаления у поля ввода и его родителя класса "_error" (ошибка):
function formRemoveError(input) {
    input.parentElement.classList.remove("_error");
    input.classList.remove("_error");
}


// Функция проверки email-адреса:
function emailTest(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}



/*==========================================================================================================================================================================*/
/* Parallax Mousemove */
class MouseParallax {
	constructor(props, data = null) {
		let defaultConfig = {
			init: true,
		}
		this.config = Object.assign(defaultConfig, props);
		if (this.config.init) {
			const parallaxMouse = document.querySelectorAll("[data-parallax-mouse]");
			parallaxMouse.length ? this.paralaxMouseInit(parallaxMouse) : null;
		}
	}

	paralaxMouseInit(parallaxMouse) {
		parallaxMouse.forEach(el => {
			const parallaxMouseWrapper = el.closest("[data-parallax-wrapper]");
			// Коэффициент X: 
			const paramСoefficientX = el.hasAttribute("data-parallax-cx") ? +el.getAttribute("data-parallax-cy") : 100;
			// Коэффициент Y: 
			const paramСoefficientY = el.hasAttribute("data-parallax-cy") ? +el.getAttribute("data-parallax-cy") : 100;
			// Направление по оси Х:
			const directionX = el.hasAttribute("data-parallax-dxr") ? -1 : 1;
			// Направление по оси Y:
			const directionY = el.hasAttribute("data-parallax-dyr") ? -1 : 1;
			// Скорость анимации:
			const paramAnimation = el.hasAttribute("data-parallax-speed") ? +el.getAttribute("data-parallax-speed") : 50;

			// Объявление переменных:
			let positionX = 0, positionY = 0;
			let coordXprocent = 0, coordYprocent = 0;
			setMouseParallaxStyle();

			// Проверка на наличие родителя, в котором будет считываться положение мыши:
			if (parallaxMouseWrapper) {
				mouseMoveParallax(parallaxMouseWrapper);
			} else {
				mouseMoveParallax();
			}

			function setMouseParallaxStyle() {
				const distX = coordXprocent - positionX;
				const distY = coordYprocent - positionY;
				positionX = positionX + (distX * paramAnimation / 1000);
				positionY = positionY + (distY * paramAnimation / 1000);
				el.style.cssText = `transform: translate3D(${directionX * positionX / (paramСoefficientX / 10)}%,${directionY * positionY / (paramСoefficientY / 10)}%,0);`;
				requestAnimationFrame(setMouseParallaxStyle);
			}

			function mouseMoveParallax(wrapper = window) {
				wrapper.addEventListener("mousemove", function (e) {
					const offsetTop = el.getBoundingClientRect().top + window.scrollY;
					if (offsetTop >= window.scrollY || (offsetTop + el.offsetHeight) >= window.scrollY) {
						const parallaxWidth = window.innerWidth;
						const parallaxHeight = window.innerHeight;
						const coordX = e.clientX - parallaxWidth / 2;
						const coordY = e.clientY - parallaxHeight / 2;
						coordXprocent = coordX / parallaxWidth * 100;
						coordYprocent = coordY / parallaxHeight * 100;
					}
				});
			}
		});
	}
}
if (!document.body.classList.contains("_touch")) {
    new MouseParallax({});
} 



/*======================================================================================================================================================================*/
/* Учет плавающей панели на мобильных устройствах */
function fullScreenFix() {
	const fullScreenElements = document.querySelectorAll("[data-fullscreen]");
	if (fullScreenElements && isMobile.any()) {
		window.addEventListener("resize", fixHeight);

		function fixHeight() {
			let height = window.innerHeight * 0.01;
			document.documentElement.style.setProperty("--vh", `${height}px`);
		}
		fixHeight();
	}
}
fullScreenFix();



/*======================================================================================================================================================================*/
/* Cursor */
if (!isMobile.any()) {
    let visibleCursor = false;
    let scrollTop = false;
    let mouseCoordX, mouseCoordY, lastCoordY = 0;
    let cursor = document.querySelector(".cursor");
    let links = document.querySelectorAll("a,button");
    window.addEventListener("mousemove", e => {
        !visibleCursor ? showCursor() : null;
        getMouseCoords(e);
        animationCursor();
    })

    // Функция показа курсора при первом наведении мыши на экран страницы:
    function showCursor() {
        document.documentElement.classList.add("load");
        visibleCursor = true;
    }

    // Функция расчета позиции курсора:
    function getMouseCoords(e, scroll = false) {
        if (!scroll) {                                                                  // Если срабатывает событие "mousemove" на window. 
            mouseCoordX = e.pageX;                                                      // Положение курсора мыши по оси X.                                               
            !scrollTop ? mouseCoordY = e.pageY : mouseCoordY = e.pageY + scrollTop;     // Положение курсора мыши по оси Y.
            lastCoordY = e.pageY;
        } else {                                                                        // Если срабатывает событие "scroll". 
            mouseCoordX = e.pageX;                                                      // Положение курсора мыши по оси X.                                               
            mouseCoordY =  scrollTop + lastCoordY;                                      // Положение курсора мыши по оси Y.
        }                                                            
    }
    
    // Анимация движения курсора при движении мыши:
    function animationCursor() {
        gsap.to(window, {
            duration: 0.01,                                                             // Продолжительность анимации.
            repeat: -1,                                                                 // Бесконечная анимация.
            onRepeat: () => { 
                gsap.set(cursor, { 
                    css: {
                        left: mouseCoordX - 21,
                        top: mouseCoordY - 21
                    }
                });
            }
        });
    }
    
    // Анимация курсора при наведении на элементы ссылок и кнопок:
    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener("mouseover", function() {
            cursor.classList.add("_active");
        });
        links[i].addEventListener("mouseout", function() {
            cursor.classList.remove("_active");
        });
    }
    
    // Спрятать курсор при потере наведения и показать его при наведении мыши на экран страницы:
    document.documentElement.addEventListener("mouseout", function(e) {
        cursor.classList.add("_hidden");
    });       
    document.documentElement.addEventListener("mouseover", function(e) {
        cursor.classList.remove("_hidden");
    });



    /*==================================================================================================================================================================*/
    /* Scrollbar */
    gsap.registerPlugin(ScrollTrigger);

    // window.addEventListener("resize", function() {
    //     if (wi) {
    //         scrollbarInit();
    //         animationOnScroll()
    //     }
    // })

    function scrollbarInit() {
        let bodyScrollBar = Scrollbar.init( document.body, { damping: 0.1, delegateTo: document } );
        bodyScrollBar.setPosition(0, 0);
        bodyScrollBar.track.xAxis.element.remove();
    
        ScrollTrigger.scrollerProxy(document.body, {
            scrollTop(value) {
                if (arguments.length) {
                    bodyScrollBar.scrollTop = value;
                }
                return bodyScrollBar.scrollTop;
            }
        });
        bodyScrollBar.addListener(ScrollTrigger.update);
        bodyScrollBar.addListener(function(e) {
            scrollTop = bodyScrollBar.scrollTop;
            getMouseCoords(e, true); 
        });
    }
    scrollbarInit();



    /*==================================================================================================================================================================*/
    /* Animation */
    function animationOnScroll() {
        const examplesBlock = document.querySelector(".examples");
        const examplesBlockCoord = examplesBlock.getBoundingClientRect();
        const exampleItems = document.querySelectorAll(".item-examples");
        let examplesHeight = 0;
        exampleItems.forEach(exampleItem => {
            examplesHeight += exampleItem.clientHeight;
        }); 
        examplesBlock.style.height = examplesHeight * 2.2 + "px";
        ScrollTrigger.create({
            trigger: ".examples",
            scroller: document.body,    
            pinType: "transform",                                                                                       
            start: "top top",
            pin: ".examples",
            pinSpacing: false
        });
    
        gsap.to(".examples__background", {
            ease: "ease-in-out",    
            x: (i, target) => ScrollTrigger.maxScroll(window) * target.dataset.speedHorizontal * 1.2, 
            y: (i, target) => ScrollTrigger.maxScroll(window) * target.dataset.speedVertical * 1.1,                                                           
            scrollTrigger: {
                trigger: ".examples",
                scroller: document.body,    
                pinType: "transform",                                           
                start: "top bottom",
                end: "100% top",
                scrub: 1,
            } 
        });
    
        let title = gsap.timeline();
        ScrollTrigger.create({
            animation: title,
            trigger: ".examples",
            scroller: document.body,    
            pinType: "transform",                                            
            start: "top 50%",
            end: "+=1800",
            scrub: 1,
        });
        title.from(".examples__title", { ease: "power-out", opacity: 0, scale: 0.5 })
        title.to(".examples__title", { ease: "power-out", opacity: 1, scale: 1 })
        title.to(".examples__title", { ease: "power-out", opacity: 0, scale: 0.5 })
    
        gsap.utils.toArray(".item-examples").forEach((item, i) => {
            let examples = gsap.timeline();
            ScrollTrigger.create({
                animation: examples,
                trigger: ".wrapper",
                scroller: document.body,    
                pinType: "transform",                                            
                start: () => examplesBlockCoord.top + ((examplesBlockCoord.height * 1.35) * (i + 1)),
                end: () => examplesBlockCoord.top + ((examplesBlockCoord.height * 1.35) * (i + 2)),
                scrub: 2,
            }),
            examples.from(item, { ease: "power-out", opacity: 0, scale: 0.5 })
            examples.to(item, { ease: "power-out", opacity: 1, scale: 1 })
            examples.to(item, { ease: "power-out", opacity: 0, scale: 0.5 })
        })
    }
    animationOnScroll();
}; 



/*==========================================================================================================================================================================*/
/* Полифилы */
if (!Element.prototype.closest) {
    Element.prototype.closest = function (css) {
        var node = this;
        while (node) {
            if (node.matches(css)) return node;
            else node = node.parentElement;
        }
        return null;
    };
}


if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.matchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector;
}