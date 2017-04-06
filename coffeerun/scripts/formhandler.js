(function(window) {
    'use strict';
    var App = window.App || {};
    var $ = window.jQuery;

    function FormHandler(selector) {
        if (!selector) {
            throw new Error('No selector provided');
        }
        this.$formElement = $(selector);
        if (this.$formElement.length === 0) {
            throw new Error('Could not find element with selector: ' + selector);
        }
    }

    FormHandler.prototype.addSubmitHandler = function(fn) {
        this.$formElement.on('submit', function(event) {
            event.preventDefault();

            var data = {};
            $(this).serializeArray().forEach(function(item) {
                data[item.name] = item.value;
                console.log(item.name + ' is ' + item.value);
            });
            console.log(data);
            fn(data)
                .then(function() {
                    this.reset();
                    this.elements[0].focus();
                }.bind(this));
        });
    };

    FormHandler.prototype.addInputHandler = function(fn) {
        this.$formElement.on('input', '[name="emailAddress"]', function(event) {
            var emailAddress = event.target.value;
            var message = '';
            if (fn(emailAddress)) {
                event.target.setCustomValidity('');
                //Email Validation
                var SERVER_URL = 'http://localhost:3002/coffeeorders';
                $.get(SERVER_URL, function(serverResponse) {
                    var emails = [];
                    for (var i in serverResponse) {
                        emails.push(serverResponse[i].emailAddress);
                    }
                    if (emails.indexOf(emailAddress) != -1) {
                        message = 'This email has already been registered!';
                        event.target.setCustomValidity(message);
                    } else {
                        event.target.setCustomValidity('');
                    }
                });
            } else {
                message = emailAddress + ' is not an authorized email address!';
                event.target.setCustomValidity(message);
            }
        });
    };

    //Silver Challenge - Check Decaf & Caffeine Strength
    FormHandler.prototype.decafInputHandler = function(fn) {
        var coffee;
        this.$formElement.on('input', '[name="coffee"]', function(event) {
            coffee = event.target;
            var data = {};
            this.$formElement.serializeArray().forEach(function(item) {
                if (item.name === 'coffee' || item.name === 'strength') {
                    data[item.name] = item.value;
                }
            });
            if (fn(data.coffee, data.strength)) {
                event.target.setCustomValidity('');
            } else {
                var message = 'Decaf drinks must have a Caffeine level under 20';
                event.target.setCustomValidity(message);
            }
        }.bind(this));
        this.$formElement.on('change', '[name="strength"]', function(event) {
            var data = {};
            this.$formElement.serializeArray().forEach(function(item) {
                if (item.name === 'coffee' || item.name === 'strength') {
                    data[item.name] = item.value;
                }
            });
            if (fn(data.coffee, data.strength)) {
                if (coffee) {
                    coffee.setCustomValidity('');
                }
                event.target.setCustomValidity('');
            } else {
                var message = 'Decaf drinks must have a Caffeine level under 20';
                event.target.setCustomValidity(message);
            }
        }.bind(this));
    };

    App.FormHandler = FormHandler;
    window.App = App;
})(window);
