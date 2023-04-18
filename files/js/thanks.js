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
}