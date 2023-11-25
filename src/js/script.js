'use strict';

window.addEventListener('DOMContentLoaded', () => {

    const inclusionRulesArray = [];
    const exclusionRulesArray = [];

    class Rule {
        constructor(wrapperSelector, arrayOfRules, { page = 'All Pages', word = 'Contains' }) {
            this.wrapperElemetn = document.querySelector(wrapperSelector);
            this.arrayOfRules = arrayOfRules;

            this.ruleSettings = {
                page: page,
                word: word,
                url: null,
            };

            this.deleteRuleButton = this.createDeleteRuleButton();
            this.customSelect = this.createCustomRuleElements().select;
            this.customInput = this.createCustomRuleElements().input;
            this.ruleElement = this.createRuleElement();

            this.deleteRuleElement();
            this.changePageHandler();
            this.changeWordHandler();
            this.inputHandler();

            this.customRuleRender();

            this.renderRule();
        }

        createRuleElement() {
            const page = this.ruleSettings.page;

            const ruleElement = document.createElement('div');
            ruleElement.classList.add('rule-form');
            ruleElement.innerHTML = `
                <select class="rules__select rule-form__pages" name="page">
                    <option selected value="All Pages">All Pages</option>
                    <option value="Home Page">Home Page</option>
                    <option value="Product Pages">Product Pages</option>
                    <option value="Password Page">Password Page</option>
                    <option value="Custom">Custom</option>
                </select>`;

            ruleElement.append(this.deleteRuleButton);

            const options = ruleElement.querySelectorAll('.rule-form__pages > option');
            options.forEach((option, index) => {
                if (option.value == page) {
                    option.selected = true
                }
            })

            return ruleElement;
        }

        createDeleteRuleButton() {
            const deleteRuleButton = document.createElement('button');
            deleteRuleButton.classList.add('rules__close-button');
            deleteRuleButton.dataset.ruleButton = 'delete';
            deleteRuleButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="12" height="12" viewBox="0 0 24 24">
                    <path fill="black" d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z"></path>
                </svg> `;
            return deleteRuleButton;
        }

        createCustomRuleElements() {
            const word = this.ruleSettings.word;

            const select = document.createElement('select');
            select.classList.add('rules__select', 'rule-form__word');
            select.innerHTML = `
                <option selected value="Contains">Contains</option>
                <option value="Exact Match">Exact Match</option> `;

            const options = select.querySelectorAll('.rule-form__word > option');
            options.forEach((option) => {
                if (option.value == word) {
                    option.selected = true
                }
            })

            const input = document.createElement('div');
            input.innerHTML = `
                <input type="text" class="rules__input" placeholder="Type a full or partial URL">
                <div class="rules__input-error">URL is Missing</div>`;

            input.classList.add('rules__input-wrapper');

            return {
                select,
                input,
            }
        }

        renderRule() {
            this.wrapperElemetn.append(this.ruleElement);
            this.addOrElement();
        }

        deleteRuleElement() {
            this.deleteRuleButton.addEventListener('click', () => {
                this.arrayOfRules.forEach((rule, index) => {
                    if (this == rule && this.arrayOfRules.length > 1) {
                        this.arrayOfRules.splice(index, 1);
                        this.ruleElement.remove();
                    }
                })

                this.addOrElement();
            });
        }

        customRuleRender() {
            if (this.ruleSettings.page == 'Custom') {
                this.ruleElement.append(this.customSelect)
                this.ruleElement.append(this.customInput)
            }

            if (this.ruleSettings.page != 'Custom') {
                this.customSelect.remove();
                this.customInput.remove();
            }
        }

        changePageHandler() {
            const pageSelector = this.ruleElement.querySelector('.rule-form__pages');
            pageSelector.addEventListener('input', ({ target }) => {
                this.ruleSettings.page = target.value

                this.customRuleRender();
            });

        }

        changeWordHandler() {
            this.customSelect.addEventListener('input', ({ target }) => {
                this.ruleSettings.word = target.value;
                console.log(this.ruleSettings);
            })
        }

        inputHandler() {
            const input = this.customInput.querySelector('.rules__input');

            input.addEventListener('blur', ({ target }) => {
                console.log(1);
                if (!target.value.length) {
                    this.customInput.querySelector('.rules__input-error').style.display = 'block'
                }

                if (target.value.length) {
                    this.customInput.querySelector('.rules__input-error').style.display = 'none'
                }
            })
        }

        addOrElement() {
            const arrayOfRulesElements = this.wrapperElemetn.querySelectorAll('.rule-form');
            const arrayOfOrElements = this.wrapperElemetn.querySelectorAll('.rules__or');

            arrayOfOrElements.forEach(element => {
                element.remove();
            })

            arrayOfRulesElements.forEach((ruleElement, index) => {
                if (index > 0) {
                    const ruleOr = document.createElement('div');
                    ruleOr.classList.add('rules__or');
                    ruleOr.textContent = 'OR';

                    ruleElement.before(ruleOr);
                }
            })
        }
    }



    inclusionRulesArray.push(new Rule('.inclusion-rules .rules__wrapper', inclusionRulesArray, {}));

    const addInclusionRuleButton = document.querySelector('[data-inclusion-rule-button="add"]');

    addInclusionRuleButton.addEventListener('click', () => {

        inclusionRulesArray.push(new Rule(
            '.inclusion-rules .rules__wrapper',
            inclusionRulesArray,
            {
                page: inclusionRulesArray[inclusionRulesArray.length - 1].ruleSettings.page,
                word: inclusionRulesArray[inclusionRulesArray.length - 1].ruleSettings.word,
            }));
    });


    exclusionRulesArray.push(new Rule('.exclusion-rules .rules__wrapper', exclusionRulesArray, {}));

    const addExclusionRuleButton = document.querySelector('[data-exclusion-rule-button="add"]');

    addExclusionRuleButton.addEventListener('click', () => {
        exclusionRulesArray.push(new Rule(
            '.exclusion-rules .rules__wrapper',
            exclusionRulesArray,
            {
                page: exclusionRulesArray[exclusionRulesArray.length - 1].ruleSettings.page,
                word: exclusionRulesArray[exclusionRulesArray.length - 1].ruleSettings.word,
            }));
    });











})