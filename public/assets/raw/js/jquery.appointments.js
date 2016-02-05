/**
 * An ajax contact form for appointment scheduling requests
 *
 * @license MIT
 * @copyright Tyson Steele Associates
 */

(function( $, window, document, undefined) {
    'use strict';

    var $form = $("#schedule-form form");

    $form.submit(function (e) {

        // remove all errors
        $('.has-error')
            .removeClass('has-error');

        $('.help-block')
            .remove();

        // get our form data
        var formData = {
              person:       $('input[name="person"]').val()
            , respond:      $('input[name="respond"]').val()
            , honeypot:     $('input[name="email"]').val()
            , phone:        $('input[name="phone"]').val()
            , comments:     $('textarea[name="comments"]').val()
        };

        $.ajax({
              type:     'POST'
            , url:      'schedule.php'
            , data:     formData
            , dataType: 'json'
            , encode:   true
        })
        .done(function (data) {

            // if we have errors for...
            if (!data.success) {

                // the name field
                if (data.errors.person) {
                    $('#person-field')
                        .addClass('has-error');
                    
                    $('#person-field')
                        .find('.field')
                        .append('<span class="help-block">' + data.errors.person + '</span>');
                }

                // the respond field
                if (data.errors.respond) {
                    $('#respond-field')
                        .addClass('has-error');

                    $('#respond-field')
                        .find('.field')
                        .append('<span class="help-block">' + data.errors.respond + '</span>');
                }

                // the phone field
                if (data.errors.phone) {
                    $('#phone-field')
                        .addClass('has-error');

                    $('#phone-field')
                        .find('.field')
                        .append('<span class="help-block">' + data.errors.phone + '</span>');
                }

            } else {
                // check for google analytics, save form submission event if possible
                if(window.ga && ga.create) {
                    ga('send', 'event', 'scheduling', 'submitted', 'form submission', formData.email);
                }
                // display our success message
                $form.html('<div class="alert alert-success"><p>' + data.message + '</p></div>');
            }

        }).fail(function (data) {

            // console.log for now
            console.log(data);
        });

        e.preventDefault();
    });
    
}(jQuery, window, document));