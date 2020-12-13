document.addEventListener("DOMContentLoaded", function () {
    /**
     * HomePage - Help section
     */
    class Help {
        constructor($el) {
            this.$el = $el;
            this.$buttonsContainer = $el.querySelector(".help--buttons");
            this.$slidesContainers = $el.querySelectorAll(".help--slides");
            this.currentSlide = this.$buttonsContainer.querySelector(".active").parentElement.dataset.id;
            this.init();
        }

        init() {
            this.events();
        }

        events() {
            /**
             * Slide buttons
             */
            this.$buttonsContainer.addEventListener("click", e => {
                if (e.target.classList.contains("btn")) {
                    this.changeSlide(e);
                }
            });

            /**
             * Pagination buttons
             */
            this.$el.addEventListener("click", e => {
                if (e.target.classList.contains("btn") && e.target.parentElement.parentElement.classList.contains("help--slides-pagination")) {
                    this.changePage(e);
                }
            });
        }

        changeSlide(e) {
            e.preventDefault();
            const $btn = e.target;

            // Buttons Active class change
            [...this.$buttonsContainer.children].forEach(btn => btn.firstElementChild.classList.remove("active"));
            $btn.classList.add("active");

            // Current slide
            this.currentSlide = $btn.parentElement.dataset.id;

            // Slides active class change
            this.$slidesContainers.forEach(el => {
                el.classList.remove("active");

                if (el.dataset.id === this.currentSlide) {
                    el.classList.add("active");
                }
            });
        }

        /**
         * TODO: callback to page change event
         */
        changePage(e) {
            e.preventDefault();
            const page = e.target.dataset.page;

            console.log(page);
        }
    }

    const helpSection = document.querySelector(".help");
    if (helpSection !== null) {
        new Help(helpSection);
    }

    /**
     * Form Select
     */
    class FormSelect {
        constructor($el) {
            this.$el = $el;
            this.options = [...$el.children];
            this.init();
        }

        init() {
            this.createElements();
            this.addEvents();
            this.$el.parentElement.removeChild(this.$el);
        }

        createElements() {
            // Input for value
            this.valueInput = document.createElement("input");
            this.valueInput.type = "text";
            this.valueInput.name = this.$el.name;

            // Dropdown container
            this.dropdown = document.createElement("div");
            this.dropdown.classList.add("dropdown");

            // List container
            this.ul = document.createElement("ul");

            // All list options
            this.options.forEach((el, i) => {
                const li = document.createElement("li");
                li.dataset.value = el.value;
                li.innerText = el.innerText;

                if (i === 0) {
                    // First clickable option
                    this.current = document.createElement("div");
                    this.current.innerText = el.innerText;
                    this.dropdown.appendChild(this.current);
                    this.valueInput.value = el.value;
                    li.classList.add("selected");
                }

                this.ul.appendChild(li);
            });

            this.dropdown.appendChild(this.ul);
            this.dropdown.appendChild(this.valueInput);
            this.$el.parentElement.appendChild(this.dropdown);
        }

        addEvents() {
            this.dropdown.addEventListener("click", e => {
                const target = e.target;
                this.dropdown.classList.toggle("selecting");

                // Save new value only when clicked on li
                if (target.tagName === "LI") {
                    this.valueInput.value = target.dataset.value;
                    this.current.innerText = target.innerText;
                }
            });
        }
    }

    document.querySelectorAll(".form-group--dropdown select").forEach(el => {
        new FormSelect(el);
    });

    /**
     * Hide elements when clicked on document
     */
    document.addEventListener("click", function (e) {
        const target = e.target;
        const tagName = target.tagName;

        if (target.classList.contains("dropdown")) return false;

        if (tagName === "LI" && target.parentElement.parentElement.classList.contains("dropdown")) {
            return false;
        }

        if (tagName === "DIV" && target.parentElement.classList.contains("dropdown")) {
            return false;
        }

        document.querySelectorAll(".form-group--dropdown .dropdown").forEach(el => {
            el.classList.remove("selecting");
        });
    });

    /**
     * Switching between form steps
     */
    class FormSteps {
        constructor(form) {
            this.$form = form;
            this.$next = form.querySelectorAll(".next-step");
            this.$prev = form.querySelectorAll(".prev-step");
            this.$step = form.querySelector(".form--steps-counter span");
            this.currentStep = 1;

            this.$stepInstructions = form.querySelectorAll(".form--steps-instructions p");
            const $stepForms = form.querySelectorAll("form > div");
            this.slides = [...this.$stepInstructions, ...$stepForms];

            this.init();
        }

        /**
         * Init all methods
         */
        init() {
            this.events();
            this.updateForm();
        }

        /**
         * All events that are happening in form
         */
        events() {
            // Next step
            this.$next.forEach(btn => {
                btn.addEventListener("click", e => {
                    e.preventDefault();
                    this.currentStep++;
                    if (this.currentStep === 2) {
                        let categories = getCheckedCategories()
                        let institution = getInstitution(categories)
                        displayInstitution(institution)
                    }
                    this.updateForm();
                });
            });

            // Previous step
            this.$prev.forEach(btn => {
                btn.addEventListener("click", e => {
                    e.preventDefault();
                    this.currentStep--;
                    this.updateForm();
                });
            });

            // Form submit
            this.$form.querySelector("form").addEventListener("submit", e => this.submit(e));
        }

        /**
         * Update form front-end
         * Show next or previous section etc.
         */
        updateForm() {
            this.$step.innerText = this.currentStep;

            // TODO: Validation

            this.slides.forEach(slide => {
                slide.classList.remove("active");

                if (slide.dataset.step == this.currentStep) {
                    slide.classList.add("active");
                }
            });

            if (this.currentStep === 5) {
//step4
                const categories = document.getElementsByName('categories');
                const checkedCategories = [];
                for (let i = 0; i < categories.length; i++)
                    if (categories[i].checked === true) {
                        checkedCategories.push(categories[i].dataset.name);
                    }

                const bags = document.getElementsByName('bags')[0].value;

                const organization = document.getElementsByName('organization');
                const checkedOrganization = [];
                for (let i = 0; i < organization.length; i++) {
                    if (organization[i].checked === true) {
                        checkedOrganization.push(organization[i].dataset.name);
                    }
                }

                const address = document.getElementsByName('address')[0].value;
                const city = document.getElementsByName('city')[0].value;
                const postcode = document.getElementsByName('postcode')[0].value;
                const phone = document.getElementsByName('phone')[0].value;
                const date = document.getElementsByName('date')[0].value;
                const time = document.getElementsByName('time')[0].value;
                const more_info = document.getElementsByName('more_info')[0].value;

//step5
                const bags_donation = document.getElementById('bag_donation');
                const organization_name = document.getElementById('organization');
                const address_phone = document.getElementById('address_phone');
                const date_time = document.getElementById('date_time');

                bags_donation.innerText = `${bags} worków ${checkedCategories},`;

                organization_name.innerText = `Dla ${checkedOrganization}`;

                address_phone.children[0].innerHTML = address;
                address_phone.children[1].innerHTML = city;
                address_phone.children[2].innerHTML = postcode;
                address_phone.children[3].innerHTML = phone;

                date_time.children[0].innerHTML = date;
                date_time.children[1].innerHTML = time;
                date_time.children[2].innerHTML = more_info;
            }
            this.$stepInstructions[0].parentElement.parentElement.hidden = this.currentStep >= 6;
            this.$step.parentElement.hidden = this.currentStep >= 6;

            // TODO: get data from inputs and show them in summary
        }

        /**
         * Submit form
         *
         * TODO: validation, send data to server
         */
        submit(e) {
            e.preventDefault();
            this.currentStep++;
            this.updateForm();
            document.getElementById('form_donation').submit();
        }
    }

    const form = document.querySelector(".form--steps");
    if (form !== null) {
        new FormSteps(form);
    }
});

function getCheckedCategories() {
    const categories = document.querySelectorAll('input[name=categories]');
    let checkboxesChecked = [];
    let categoriesLen = categories.length;
    for (let i = 0; i < categoriesLen; i++) {
        if (categories[i].checked) {
            checkboxesChecked.push(categories[i].value);
        }
    }
    return checkboxesChecked.length > 0 ? checkboxesChecked : null;
}

function getInstitution() {
    const institution = document.querySelectorAll('.institution');
    const categoriesChecked = getCheckedCategories();
    let institutionList = [];
    for (let i = 0; i < institution.length; i++) {
        for (let j = 0; j < categoriesChecked.length; j++) {
            if (institution[i].getAttribute('data-categories').split(',').includes(categoriesChecked[j])) {
                institutionList.push(institution[i].dataset.id);
            }
        }
    }
    return institutionList;
}

function displayInstitution() {
    const institutionCats = getInstitution();
    const institutions = Array.from(document.querySelectorAll('.institution'));
    institutions.forEach(function (item) {
        if (institutionCats.includes(item.dataset.id)) {
            item.style.display = 'block'
        } else {
            item.style.display = 'none'
        }
    });
}

