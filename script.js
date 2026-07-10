document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.querySelector('.header__dropdown-language');
    if (!dropdown) return;

    const btn = dropdown.querySelector('.header__dropdown-lang');
    const links = dropdown.querySelectorAll('.header__dropdown-link');

    // 1. Устанавливаем язык при загрузке (по умолчанию 'en')
    let currentLang = localStorage.getItem('lang') || 'en';
    btn.textContent = currentLang === 'ru' ? 'RUS' : 'ENG';

    // 2. Обработка клика
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const selectedText = link.textContent.trim(); // 'ENG' или 'RUS'
            const langKey = selectedText === 'RUS' ? 'ru' : 'en';

            // Сохраняем в память
            localStorage.setItem('lang', langKey);
            btn.textContent = selectedText;

            // Перезагружаем страницу, чтобы скрипт перевода сработал везде
            // Это самый надежный способ для твоего кода:
            location.reload(); 
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.offers__tab');
    const cards = document.querySelectorAll('.car-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 1. Управляем активным классом табов
            tabs.forEach(t => t.classList.remove('offers__tab--active'));
            tab.classList.add('offers__tab--active');

            const targetCategory = tab.dataset.target;

            cards.forEach(card => {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

                if (targetCategory === 'all' || card.dataset.category === targetCategory) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.opacity = '0';
                    card.style.display = 'none';
                }
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const statsContainer = document.querySelector('.about__stats');
    const counters = document.querySelectorAll('.stat-item__value');
    const duration = 1000; // Длительность анимации в миллисекундах (2 секунды)

    // Функция плавного замедления (Out-Quad Easing)
    const easeOutQuad = (t) => t * (2 - t);

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        let startTime = null;

        const updateCount = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = currentTime - startTime;

            // Вычисляем долю прошедшего времени (от 0 до 1)
            let timeFraction = progress / duration;
            if (timeFraction > 1) timeFraction = 1;

            // Применяем плавное замедление к прогрессу
            const easedProgress = easeOutQuad(timeFraction);

            // Считаем текущее значение
            const currentCount = Math.floor(easedProgress * target);
            counter.innerText = currentCount;

            // Если время не вышло, продолжаем на следующем кадре
            if (progress < duration) {
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target; // Жесткий финал для точности
            }
        };

        requestAnimationFrame(updateCount);
    };

    // Наблюдатель за скроллом
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => animateCounter(counter));
                observer.unobserve(entry.target); // Запускаем только 1 раз
            }
        });
    }, {
        threshold: 0.2
    });

    if (statsContainer) {
        observer.observe(statsContainer);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuLinks = document.querySelectorAll('.mobile-menu__link');

    // Функция переключения меню
    const toggleMenu = () => {
        burgerBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll'); // Запрещаем скролл body
    };

    if (burgerBtn && mobileMenu) {
        burgerBtn.addEventListener('click', toggleMenu);
    }

    // Закрываем меню при клике на любую ссылку навигации
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const rentButtons = document.querySelectorAll('.car-card__btn');
    const modal = document.getElementById('rentModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalCarName = document.getElementById('modalCarName');
    const formCarInput = document.getElementById('formCarInput');

    // Функция открытия модалки
    const openModal = (carName) => {
        modalCarName.innerText = carName; // Подставляем имя машины в заголовок окна
        formCarInput.value = carName;     // Записываем имя в скрытый инпут для отправки
        modal.classList.add('active');
        document.body.classList.add('no-scroll'); // Отключаем скролл страницы
    };

    // Функция закрытия модалки
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    };

    // Вешаем событие на все кнопки RENT в карточках
    rentButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Отменяем переход по ссылке #

            // Находим имя машины в текущей карточке
            const carCard = button.closest('.car-card');
            const carName = carCard.querySelector('.car-card__title').innerText;

            openModal(carName);
        });
    });

    // Закрытие по клику на крестик или фон
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Закрытие по кнопке Esc
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const rentForm = document.getElementById('rentForm');
    const modal = document.getElementById('rentModal');

    if (rentForm) {
        rentForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Отменяем перезагрузку страницы

            const submitBtn = rentForm.querySelector('.modal__btn-submit');

            submitBtn.classList.add('success');

            setTimeout(() => {
                modal.classList.remove('active');
                document.body.classList.remove('no-scroll');

                setTimeout(() => {
                    rentForm.reset();
                    submitBtn.classList.remove('success');
                }, 400);

            }, 2000);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = document.querySelectorAll('.header__dropdown');

    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.header__dropdown-btn');
        const links = dropdown.querySelectorAll('.header__dropdown-link');


        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                btn.innerText = link.innerText;

                dropdown.querySelectorAll('.header__dropdown-link').forEach(l => {
                    l.classList.remove('header__dropdown-link--active');
                });
                link.classList.add('header__dropdown-link--active');

                dropdown.classList.remove('active');
            });
        });
    });

    window.addEventListener('click', () => {
        dropdowns.forEach(d => d.classList.remove('active'));
    });
});

const translations = {
    en: {
        nav_about: "About Us",
        nav_offers: "Offers",
        nav_reviews: "Reviews",
        nav_contacts: "Contacts",
        nav_cars: "Car List",
        hero_title: "Dubai",
        hero_subtitle: "luxury car rental",
        popular_title: "Most Popular",
        popular_card_title: "Rent Car",
        popular_price_from: "Rent is from aed",
        popular_price_day: "per day",
        popular_search_placeholder: "Car search",
        btn_view_all: "VIEW ALL",
        tab_all: "All",
        tab_special: "Special Offer",
        tab_new: "New car",
        tab_popular: "Most popular",
        tab_daily: "Daily",
        btn_rent: "RENT",
        about_title: "About Us",
        stat_year: "year",
        stat_cars: "cars",
        stat_people: "people",
        stat_desc_1: "We've come a long way from a 2-people company to winning at Webby's.",
        stat_desc_2: "We've come a long way from a 2-people company to winning at Webby's.",
        stat_desc_3: "We've come a long way from a 2-people company to winning at Webby's.",
        about_quote_text: "I'm with cars for over 18 years. My auto passion and attention to details will make your experience with us second to none. Guaranteed.",
        about_author_name: "Aldiyar, CEO",
        about_author_role: "CEO Trinity car rental boutique",
        reviews_title: "Reviews",
        advantages_title: "Advantages",
        advantage_text_1: "40+ unique cars for<br>rent from our fleet",
        advantage_text_2: "Delivery and return<br>of cars in Dubai 24/7",
        advantage_text_3: "Insurance without a<br>deductible for each car",
        advantage_text_4: "No video or audio<br>recording in the car",
        advantage_text_5: "24/7 technical support",
        advantage_text_6: "All models have a premium package",
        contacts_title: "Ask us anything",
        form_placeholder_name: "Name",
        form_placeholder_email: "E-mail",
        form_placeholder_phone: "+7 (999) 999 - 99 - 99",
        form_placeholder_message: "Message",
        btn_submit_request: "SEND THE REQUEST",
        discount_title: "Get a discount of up to <span>60%</span>",
        discount_subtitle: "Get the latest articles and business updates that you need to know, you'll even get special recommendations weekly.",
        discount_placeholder_email: "Your email",
        btn_receive: "RECEIVE",
        footer_col_title_1: "For Customers",
        footer_col_title_2: "Car brand",
        footer_link_conditions: "Conditions",
        footer_link_testimonials: "Testimonials",
        footer_link_articles: "Articles",
        footer_car_suvs: "SUVs",
        footer_car_convertibles: "Convertibles",
        footer_car_sports: "Sports Cars",
        footer_car_coupe: "Coupe",
        btn_callback: "REQUEST A CALLBACK",
        footer_address: "24 4th St - Al Quoz - Al Quoz Industrial Area 3 - Dubai",
        footer_placeholder_subscribe: "Write your E-mail",
        btn_submit: "SUBMIT",
        footer_privacy: "Privacy Policy",
        footer_copyright: "©2023 TRINITY. All rights reserved",
        modal_title_rent: "Rent",
        modal_subtitle: "Leave your details, and our manager will contact you within 5 minutes.",
        modal_placeholder_name: "Your Name",
        modal_placeholder_phone: "Phone Number",
        modal_btn_submit: "SEND REQUEST",
        sending: 'Sending..',
        sendingUpperCase: 'SENDING..'
    },
    ru: {
        nav_about: "О нас",
        nav_offers: "Предложения",
        nav_reviews: "Отзывы",
        nav_contacts: "Контакты",
        nav_cars: "Автопарк",
        hero_title: "Дубай",
        hero_subtitle: "аренда люксовых авто",
        popular_title: "Самые популярные",
        popular_card_title: "Арендуйте машину",
        popular_price_from: "Аренда от AED",
        popular_price_day: "в день",
        popular_search_placeholder: "Поиск машины",
        btn_view_all: "СМОТРЕТЬ ВСЕ",
        tab_all: "Все",
        tab_special: "Спецпредложение",
        tab_new: "Новые авто",
        tab_popular: "Популярные",
        tab_daily: "На каждый день",
        btn_rent: "АРЕНДОВАТЬ",
        about_title: "О нас",
        stat_year: "лет",
        stat_cars: "авто",
        stat_people: "клиентов",
        stat_desc_1: "Мы прошли долгий путь от компании из двух человек до победы на Webby's.",
        stat_desc_2: "Мы прошли долгий путь от компании из двух человек до победы на Webby's.",
        stat_desc_3: "Мы прошли долгий путь от компании из двух человек до победы на Webby's.",
        about_quote_text: "Я работаю с автомобилями более 18 лет. Моя страсть к машинам и внимание к деталям сделают ваш опыт работы с нами непревзойденным. Гарантирую.",
        about_author_name: "Алдияр, СЕО",
        about_author_role: "СЕО Trinity car rental boutique",
        reviews_title: "Отзывы",
        advantages_title: "Преимущества",
        advantage_text_1: "Более 40 уникальных авто<br>для аренды в нашем парке",
        advantage_text_2: "Доставка и возврат<br>автомобилей в Дубае 24/7",
        advantage_text_3: "Страховка без франшизы<br>для каждого автомобиля",
        advantage_text_4: "Никакой видео- или аудио-<br>записи в салоне автомобиля",
        advantage_text_5: "Круглосуточная техническая поддержка 24/7",
        advantage_text_6: "Все модели имеют премиальную комплектацию",
        contacts_title: "Задайте нам любой вопрос",
        form_placeholder_name: "Имя",
        form_placeholder_email: "E-mail",
        form_placeholder_phone: "+7 (999) 999 - 99 - 99",
        form_placeholder_message: "Сообщение",
        btn_submit_request: "ОТПРАВИТЬ ЗАПРОС",
        discount_title: "Получите скидку до <span>60%</span>",
        discount_subtitle: "Получайте свежие статьи и обновления бизнеса, которые вам необходимо знать. Вы даже будете получать специальные рекомендации еженедельно.",
        discount_placeholder_email: "Ваш email",
        btn_receive: "ПОЛУЧИТЬ",
        footer_col_title_1: "Клиентам",
        footer_col_title_2: "Марки авто",
        footer_link_conditions: "Условия",
        footer_link_testimonials: "Отзывы",
        footer_link_articles: "Статьи",
        footer_car_suvs: "Внедорожники",
        footer_car_convertibles: "Кабриолеты",
        footer_car_sports: "Спорткары",
        footer_car_coupe: "Купе",
        btn_callback: "ЗАКАЗАТЬ ОБРАТНЫЙ ЗВОНОК",
        footer_address: "24 4th St - Al Quoz - Al Quoz Industrial Area 3 - Дубай",
        footer_placeholder_subscribe: "Напишите ваш E-mail",
        btn_submit: "ОТПРАВИТЬ",
        footer_privacy: "Политика конфиденциальности",
        footer_copyright: "©2023 TRINITY. Все права защищены",
        modal_title_rent: "Аренда",
        modal_subtitle: "Оставьте свои данные, и наш менеджер свяжется с вами в течение 5 минут.",
        modal_placeholder_name: "Ваше имя",
        modal_placeholder_phone: "Номер телефона",
        modal_btn_submit: "ОТПРАВИТЬ ЗАЯВКУ",
        sending: 'Отправка..',
        sendingUpperCase: 'ОТПРАВКА..'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Словарь переводов


    // Находим наш дропдаун переключения языков
    const langDropdown = document.querySelector('.header__dropdown:not(.header__dropdown-town)');

    if (langDropdown) {
        const langLinks = langDropdown.querySelectorAll('.header__dropdown-link');

        langLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                const selectedLang = link.innerText.trim().toLowerCase();

                const langKey = selectedLang === 'rus' ? 'ru' : 'en';

                changeLanguage(langKey);
            });
        });
    }

    // 2. Функция, которая проходит по всему сайту и меняет текст
    const changeLanguage = (lang) => {
        const elementsToTranslate = document.querySelectorAll('[data-key]');
        localStorage.setItem("lang", lang)
        const language = localStorage.getItem('lang');

        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-key');
            const translationText = translations[language]?.[key];

            if (translationText) {
                // Если это текстовое поле ввода или текстовая область, переводим плейсхолдер
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.setAttribute('placeholder', translationText);
                } else {
                    // Для обычных тегов меняем внутренний HTML/текст
                    element.innerHTML = translationText;
                }
            }
        });
    };

    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
        changeLanguage(savedLang);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const sliderWrapper = document.querySelector('.popular__list-wrapper');
    const sliderList = document.querySelector('.popular__list');
    const arrowUp = document.querySelector('.popular__arrow--up');
    const arrowDown = document.querySelector('.popular__arrow--down');

    if (!sliderList || !sliderWrapper) return;

    const originalItems = sliderList.querySelectorAll('.popular__item');
    const totalOriginal = originalItems.length;

    // Клонируем массив дважды, чтобы создать огромный запас для бесшовности
    for (let i = 0; i < totalOriginal; i++) {
        sliderList.appendChild(originalItems[i].cloneNode(true));
    }
    for (let i = totalOriginal - 1; i >= 0; i--) {
        sliderList.insertBefore(originalItems[i].cloneNode(true), sliderList.firstChild);
    }

    let sliderItems = sliderList.querySelectorAll('.popular__item');
    // В новой логике тройного списка «безопасный буфер» равен длине исходного списка (totalOriginal)
    const bufferCount = totalOriginal;

    let activeIndex = 2 + bufferCount;
    let isTransitioning = false;

    const updateSlider = (smooth = true) => {
        if (!smooth) {
            sliderList.classList.remove('popular__list--animated');
        } else {
            sliderList.classList.add('popular__list--animated');
        }

        const activeItem = sliderItems[activeIndex];
        if (!activeItem) return;

        const wrapperHeight = sliderWrapper.clientHeight;
        const itemHeight = activeItem.offsetHeight;
        const itemOffsetTop = activeItem.offsetTop;

        const translateValue = (wrapperHeight / 2) - (itemOffsetTop + itemHeight / 2);
        sliderList.style.transform = `translateY(${translateValue}px)`;

        // Смещение дуги (лесенка)
        sliderItems.forEach((item, index) => {
            item.classList.remove('popular__item--active');
            const distance = Math.abs(index - activeIndex);

            if (distance === 0) {
                item.classList.add('popular__item--active');
                item.style.marginLeft = "58px";
                item.style.opacity = "1";
            } else if (distance === 1) {
                item.style.marginLeft = "99px";
                item.style.opacity = "0.8";
            } else {
                item.style.marginLeft = "118px";
                item.style.opacity = "0.6";
            }
        });

        // Если перенос был мгновенным, фиксируем его через Reflow
        if (!smooth) {
            sliderList.offsetHeight; // Принудительный перерасчет стилей браузером
            sliderList.classList.add('popular__list--animated'); // Возвращаем плавность
        }
    };

    // Находим элементы поиска
    const searchInput = document.querySelector('.popular__search-input');
    const searchBtn = document.querySelector('.popular__search-btn');

    // Функция поиска и переключения слайдера
    const performSearch = () => {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;

        let foundIndex = -1;

        // Исправлено: ищем внутри центрального (настоящего) блока элементов
        for (let i = bufferCount; i < sliderItems.length - bufferCount; i++) {
            const brand = sliderItems[i].querySelector('.popular__item-brand').textContent.toLowerCase();
            const model = sliderItems[i].querySelector('.popular__item-model').textContent.toLowerCase();

            if (brand.includes(query) || model.includes(query)) {
                foundIndex = i;
                break;
            }
        }

        if (foundIndex !== -1) {
            activeIndex = foundIndex;
            updateSlider(true);
        } else {
            searchInput.style.borderColor = 'red';
            setTimeout(() => {
                searchInput.style.borderColor = 'var(--primary, #33B7BC)';
            }, 500);
        }
    };

    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            performSearch();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        searchInput.addEventListener('input', () => {
            searchInput.style.borderColor = '';
        });
    }

    // Слушатель окончания анимации перемещения
    sliderList.addEventListener('transitionend', (e) => {
        if (e.propertyName !== 'transform') return;

        isTransitioning = false; // Снимаем блокировку кликов

        // Бесшовный перенос на границах буферов
        if (activeIndex < bufferCount) {
            activeIndex += totalOriginal;
            updateSlider(false); // Мгновенный перенос без прыжков по горизонтали
        }
        else if (activeIndex >= totalOriginal * 2) {
            activeIndex -= totalOriginal;
            updateSlider(false); // Мгновенный перенос без прыжков по горизонтали
        }
    });

    // Клик на стрелку ВВЕРХ
    if (arrowUp) {
        arrowUp.addEventListener('click', () => {
            if (isTransitioning) return;
            isTransitioning = true;
            activeIndex--;
            updateSlider(true);
        });
    }

    // Клик на стрелку ВНИЗ
    if (arrowDown) {
        arrowDown.addEventListener('click', () => {
            if (isTransitioning) return;
            isTransitioning = true;
            activeIndex++;
            updateSlider(true);
        });
    }

    // Клик напрямую по элементам списка
    sliderList.addEventListener('click', (e) => {
        if (isTransitioning) return;
        const clickedItem = e.target.closest('.popular__item');
        if (!clickedItem) return;

        const index = Array.from(sliderItems).indexOf(clickedItem);
        if (index !== -1) {
            isTransitioning = true;
            activeIndex = index;
            updateSlider(true);
        }
    });

    // Первая инициализация
    updateSlider(true);
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.contacts__form');
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.innerHTML = `Отправка..`

        const formData = {
            name: document.getElementById('contacts-name').value,
            email: document.getElementById('contacts-email').value,
            phone: document.getElementById('contacts-tel').value,
            msg: document.getElementById('contacts-msg').value,
        }

        setTimeout(() => {
            submitBtn.innerHTML = ``
            submitBtn.classList.add('btn-submit--success')

            form.reset();

            setTimeout(() => {
                submitBtn.classList.remove('btn-submit--success')
                submitBtn.innerHTML = `SEND THE REQUEST`
                submitBtn.disabled = true;
            }, 2000);
        }, 1000);
    })
})

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.discount-card__form');
    const submitBtn = document.querySelector('.discount-card__btn');
    const originalText = submitBtn.innerHTML;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.innerHTML = `Sending..`

        setTimeout(() => {
            submitBtn.innerHTML = ``
            submitBtn.classList.add('btn-submit--success')

            form.reset();

            setTimeout(() => {
                submitBtn.classList.remove('btn-submit--success')
                submitBtn.innerHTML = `RECIEVE`
                submitBtn.disabled = true;
            }, 2000);
        }, 1000);
    })
})

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.footer__subscribe-form');
    const submitBtn = document.querySelector('.footer__subscribe-btn');

    if (!form || !submitBtn) return;

    // Сохраняем исходный HTML кнопки (например, "SUBMIT" или спан с data-key)
    const originalText = submitBtn.innerHTML;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        submitBtn.disabled = true;

        const lang = localStorage.getItem('lang');
        const sendingText = translations[lang]?.['sendingUpperCase'] || 'SENDING...';
        submitBtn.innerHTML = `${sendingText}`;

        setTimeout(() => {
            submitBtn.innerHTML = ``;
            submitBtn.classList.add('btn-submit--success');

            form.reset();

            setTimeout(() => {
                submitBtn.classList.remove('btn-submit--success');

                const key = submitBtn.getAttribute('data-key') || 'btn_submit';
                submitBtn.innerHTML = originalText;
                submitBtn.innerHTML = translations[lang]?.[key] || 'SUBMIT';

                submitBtn.disabled = false;
            }, 2000);
        }, 1000);
    });
});
// sending
// sendingUpperCase