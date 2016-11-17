validador = {
    fields: [
        {
            name: 'texto',
            validators: ['notEmpty','stringLength', 'digits'],
            events: 'blur',
            stringLength: {
                min: 5,
                max: 5
            },
            messages: {
                default: 'Please enter a valid number.',
                append: true,
                notEmpty: 'Please enter a valid number.',
                digits: ' Only numbers allowed.',
                stringLength: ' Must be 5 digits long.'
            }
        }
    ],
    init: function(){
        validador.initialiseHandlers(validador.fields);
    },

    /**
     * Initialise handlers for events for every field
     * 
     * @param {array<objects>} fields
     */
    initialiseHandlers: function() {
        validador.fields.forEach(function(el){
            var name = el.name;
            console.log(name);
            var elem = jQuery('#' + name);
            elem.bind(el.events, function() {
                validador.evaluate(el, elem.val());
            });
        });

    },

    /**
     * Test every rule for the field, if a rule fails it shows an error
     *
     * @param {object} el field info
     * @param {string} value Field value
     * @return {boolean} true|false True if all the tests pass, false otherwise
     */
    evaluate: function(el, value) {
        var res = true;
        var errorMsg = '';
        error = jQuery('#' + el.name + "_error");
        el.validators.forEach(function(val){
            if (validador.validator.hasOwnProperty(val)) {
                var resAux;
                if (el.hasOwnProperty(val)) {
                    resAux = validador.validator[val](el[val], value);
                } else {
                    resAux = validador.validator[val](value);
                }
                if (!resAux && el.hasOwnProperty('messages') && el.messages.hasOwnProperty(val)) {
                    if (el.messages.hasOwnProperty('append') && el.messages.append && errorMsg.indexOf(el.messages[val]) < 0) {
                        errorMsg += el.messages[val];
                    } else {
                        errorMsg = el.messages[val];
                    }
                }
                res = res && resAux;
            } else {
                console.error(val + " function not found. Check the validator properties!");
            }
        });
        if (res) {
            error.hide();
        } else {
            if (errorMsg == '') {
                if (el.hasOwnProperty('messages') && el.messages.hasOwnProperty('default')) {
                    errorMsg = el.messages.default;
                } else {
                    errorMsg + 'Please enter a valid value.';
                }
            }
            error.text(errorMsg);
            error.show();
        }
        
    },

    /* 
     * Rules for the fields
     */
    validator: {
        /**
         * Checks if the field is empty
         *
         * @param {string} value Field value
         * @return {boolean} true|false True if the fields is not empty false otherwise
         */
        notEmpty: function(value) {
            var res = true;
            if (value == '' || value === null) {
                res = false;
            }
            return res;
        },

        /**
         * Checks if the email is valid
         *
         * @param {string} value Field value
         * @return {boolean} true|false True if the email is valid false otherwise
         */
        validEmail: function(value) {
            regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regex.test(value);
        },

        /**
         * Checks if the value is between the bounds
         *
         * @param {object} obj
         * @param {string} value Field value
         * @return {boolean} true|false True if the value is between the bounds false otherwise
         */
        stringLength: function(obj, value) {
            var res = true;
            min = obj.hasOwnProperty('min') ? obj.min : 0;
            max = obj.hasOwnProperty('max') ? obj.max : Infinity;
            if (value.length < min || value.length > max) {
                res = false;
            }
            return res;
        },

        /**
         * Checks if there are only digits
         *
         * @param {string} value Field value
         * @return {boolean} true|false True if if there are only digits false otherwise
         */
        digits: function(value) {
            regex = /^\d+$/;
            return regex.test(value);
        }
    }
};


jQuery(document).ready(function(e) {
    
    validador.init();
    
});

