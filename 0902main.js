
DATE_FORMAT = 'DD-MM-YYYY'
EXPDATE_FORMAT = 'MM-YYYY'
TIME_FORMAT = 'HH:mm'
DAYTIME_FORMAT = 'hh:mm a'

DATE_MASK = '99/99/9999'
EXPDATE_MASK = '99/9999'
DATE_PLACEHOLDER = 'dd/mm/yyyy'
EXPDATE_PLACEHOLDER = 'mm/yyyy'

API_ROOT = '/api/v1/'
;
/**
 * Simple string formatting
 *
 * Usage: "Today we {verb}!".format({ verb: 'shop'});
 *
 * @param {object} obj - Source of values
 */
String.prototype.format = function (obj) {
    return this.replace(/\{(\w+)\}/, function (m, i) { return obj[i] || ''; });
}

/**
 * Smooth scroll an element into view.
 * @param {selector} el - target element to scroll into view
 */
function scroll_to(el) {
	var $el = $(el);
	var top = $el.position().top;

	// if we're in a modal, we need to scroll that element...
	var modal = $el.closest('.modal') || false;

    $( modal || 'html,body').animate({ scrollTop: top }, 1000);
};

function scroll_to_from_booking(el) {
	// grab the height of the .booking-info, and always leave space to show it
	var offset = $('.booking-info').parent().height();
    var top = $(el).offset().top - offset;
    $( 'html,body' ).animate({ scrollTop: top }, 1000);
};
;
/*
** Generic form validation
**
** Applies value filters and validators to fields on a form.
** Fields annotated with a data-validators will be tested.
**
** Decorate inputs using:
**      data-validators="list, of, validators"
**
** Returns:
**  Object with:
**    valid : bool that is True IFF no validator returned an error.
**    values: Object of values of all fields.
**    errors: Object of lists of field errors.
*/

function validate_form(form) {
    var $form = $(form);

    var errors = {};
    var values = {};

    $form.find('[data-validators], [required]').each(function() {
        var $field = $(this);
        var name = $field.attr('name');
        var value = $field.val();

        // turn the validators comma separateld string into an array:
        var validators = $field.data('validators') || '';
        validators = _.chain(validators.split(',')).map($.trim).compact();

        // var validators = $field.data('validators') || '';
        // validators = validators.split(/\s*,\s*/);

        // set required based on html5 data attribute
        if($field.attr('required')) {
            validators.push('required');
        }

        // save current input's values in the validation object
        values[name] = value;

        var error_list = validators
            .map(function (validatorName) {
                // run each validator
                var result = validate_form.validators[validatorName](value, $field);
                if(result) { return $field.data('message-' + validatorName) || result; }
            })
            .compact()
            .value();

        // save the errors in the validation object
        if(error_list.length) {
            errors[name] = error_list;
        }
    }, this);
    // TODO : form-level validation
    return {valid: _.isEmpty(errors), values: values, errors: errors};
}

validate_form.validators = {
    required: function (val, $field) {
        var v = val.replace(/[\s]+/g, '');
        if (!v) {
            // if we've got nothing but spaces, clear the field
            $field.val('');
            return 'This value is required.';
        }
    },
    requires_checked: function(val, $field){
        if (!$field.prop('checked')) { return 'This value is required.'; }
    },
    email: function (val) {
        // bail early if blank
        if(!val) { return; }

        if(!/^.+@.+\..+$/.test(val)) {
            return 'Must be a valid email address.';
        }
    },
    match: function(val, $field){
        // bail early if blank
        if(!val) { return; }

        var matchField = $field.attr('data-validator-match');
        var matchTarget = $field.closest('form').find('[name=' + matchField + ']');
        var matchName = matchTarget.closest('[class^=col]').find('label').text();
        var matchVal = matchTarget.val();
        var isMatch = (val === matchVal);

        // console.log( 'this: ' + val, 'matchTarget: ' + matchVal, (!isMatch)?'mismatch':'match' );
        if(!isMatch) return "Must match " + matchName + '.';
    },
    past_date: function (val, $field) {
        // bail early if blank
        if(!val) { return; }

        var format = $field.data('datefmt');
        if(typeof format === 'undefined') {
            return 'Date format is not defined.';
        }

        // third arg sets strict to true
        var m = moment( val, format, true );
        if( !m.isValid() ) {
            return 'Date is invalid';
        }
        // and is in the future:
        if( m.isAfter( moment() )) {
            return 'Date must be in the past';
        }
    },
    future_date: function (val, $field) {
        // bail early if blank
        if(!val) { return; }

        var format = $field.data('datefmt');
        if(typeof format === 'undefined' ) {
            return 'Date format is not defined';
        }

        // third arg sets strict to true
        var m = moment( val, format, true );
        if( !m.isValid() ) {
            return 'Date is invalid';
        }
        // and is in the future:
        if( m.isBefore( moment() )) {
            return 'Date must be in the future';
        }
    },
    earliest_date_of_birth: function(val, $field) {

        if(!val) { return; }

        // dob before this date are invalid
        var format = $field.data('datefmt'),
            patients_dob = moment( val, format, true ),
            earliest_dob = moment().subtract(150, 'year');

        if( patients_dob.isBefore( earliest_dob )) {
            return 'Date of Birth is incorrect';
        }
    },
    medicare: function (val, $field) {

        // valid testing number: 2428778132

        // strip non-numeric, and update the field
        var val = val.replace(/\D/g,'');
        $field.val(val);

        // bail early if blank (may trigger required)
        if(!val) { return; }

        var blacklist = [
            '0000000000',
            '1231231231',
            '3146040468',
            '3449899112',
            '4249088814',
            '3168284042',
            '3288416428',
            '2064564387',
            '3183511221',
            '3146040468',
            '3449899112',
            '4249088814',
            '3168284042',
            '3288416428',
            '2064564387',
            '3183511221',
            '3365889132',
            '3286626587',
            '3269988016',
            '3387101368',
            '3123113849',
            '2693167712',
            '3110608699',
            '343318354', // This is not a valid medicare number
            '4224270309',
            '3327298775',
            '3403611173',
            '3329590812',
            '3382103539',
            '3374120958',
            '3361107496',
            '3212313746',
            '3272919477',
            '4283364489',
            '3340554175', // Originally 3340554175-1
            '3376211525', // Originally 3376211525-1
            '3327298775', // Originally 3327298775-1
            '3403611171',
            '3301061067', // Originally 3301061067-1
            '3331712975',
            '3116864383',
            '3384854146',
            '3368049388',
            '3321009717',
            '3418963485',
            '3265045121',
            '3158552899',
            '3321009717',
            '3326121595',
            '3346437979',
            '3331595188',
            '3212313748',
            '3460168022',
            '3411083974',
            '3376809791',
            '3361107497',
            '2517710435',
            '3221094702',
            '6006341112',
            '3421604484',
            '3260809113',
            '3382236456',
            '3274340453',
            '3388686025',
            '4224270309',
            '3286614247',
            '3444046943',
            '3223722528',
            '3174669714',
            '3260984397',
            '3374120958',
            '3184390446'

        ];

        if(_.contains(blacklist, val)) {
            console.warn( 'Medicare # blacklisted' );
            return 'Not a valid medicare number.';
        }

        // http://www.clearwater.com.au/code/medicare
        var M_WEIGHTS = [1, 3, 7, 9, 1, 3, 7, 9];

        if(val.length != 10) { return 'Must be 10 digits long.'; }

        var sum = 0;
        var checkDigit = parseInt(val[8], 10);
        for(var i=0; i<8; i++) {
            sum += M_WEIGHTS[i] * parseInt(val[i], 10);
        }
        if((sum % 10) !== checkDigit) {
            return 'Not a valid medicare number.';
        }
    },
    dva: function(val){
        var v = val.replace(/[\s\(\)]+/g, '');
        // bail early if blank
        if(!v) { return; }

        // http://meteor.aihw.gov.au/content/index.phtml/itemId/339127

        // 1st character is the state code (an alphabetic character) - N, V, Q, W, S or T for the appropriate state/territory.
        // Australian Capital Territory is included in New South Wales (N) and Northern Territory with South Australia (S).
        if(!v.match(/^[NVQWST]/i)) {
            return 'The first character must be the state code (a letter).';
        }

        // Next 7 characters are the file number, made up of:
        // War code + numeric digits, where:
        // if War code is 1 alphabetic character, add 6 numeric characters (ANNNNNN)
        // Where there is no war code as is the case with World War 1 veterans, insert a blank and add 6 numeric characters ( NNNNNN)
        // if War code is 2 alphabetic characters, add 5 numeric characters (AANNNNN)
        // if War code is 3 alphabetic characters, add 4 numeric characters (AAANNNN)

        // The 9th character is the segment link. For dependents of veterans, the 9th character is always an alphabetic character.
        // The alphabetic code is generated in the order by which the cards are issued. For example A, B, C, D etc.
        // CAUTIONARY NOTE: For veterans the 9th character is left blank

        if(!v.match(/^([NVQWST])([a-z]\d{2}|[a-z]{2}\d|[a-z]{3})(\d{4})([a-z]?)$/i)) {
            return 'Please check the card number.';
        }
    },
    phone_number: function (val, $field) {
        // ignore spaces, brackets
        var v = val.replace(/[\s\(\)]+/g, '');
        // bail early if blank
        if(!v) { return; }

        if(v.match(/^\+/)) {
            return 'Please enter the area code without the internation prefix (eg 03 xxxx xxxx).';
        }
        if(v.match(/^\d{8}$/)) {
            return 'Please include your area code.';
        }
        if(!v.match(/^\d{10}$/)) {
            return 'Must be a valid phone number.';
        }
    },
    mobile_number: function (val, $field) {
        var v = val.replace(/\s+/g, '');
        // bail early if blank
        if(!v) { return; }

        if(v.match(/^\+/)) {
            return 'Please enter the number in local format (eg 04xx xxx xxx).';
        }
        if(!v.match(/^04\d{8}$/)) {
            return 'Must be a valid mobile phone number.';
        }
    },
    regex: function(val, $field){
        // ignore spaces
        var v = val.replace(/\s+/g, '');
        // bail early if blank
        if(!v) { return; }

        var re = new RegExp($field.attr('data-validator-regex'), '');

        if(!v.match(re)) {
            return 'There was a problem with this field.';
        }
    }
};

function Form (el, extras) {
    this.$el = $(el);
    $.extend(this, extras || {});
    if(this.$el[0].nodeName !== 'FORM') {
        this.$form = this.$el.find('form').first();
    } else {
        this.$form = this.$el;
    }
    this.mark_required_fields();
}

Form.prototype = {
    clear: function () {
        if($.isFunction(this.beforeClear)) { this.beforeClear.call(this); }
        this.$form[0].reset();
        this.clear_errors();
        if($.isFunction(this.afterClear)) { this.afterClear.call(this); }
        placeholder_freshen();
    },
    load_record: function (obj) {
        var $fields = this.$el.find('[name]');
        if($.isFunction(this.beforeLoadRecord)) { this.beforeLoadRecord.call(this, obj, $fields); }
        $fields.each(function () {
            var val = _.result(obj, this.name),
                fmt = $(this).data('datefmt');
            if(fmt !== undefined) {
                val = moment(val).format(fmt);
            }
            $(this).val(val === undefined ? '' : val);
        });
        if($.isFunction(this.afterLoadRecord)) { this.afterLoadRecord.call(this, obj, $fields); }
        placeholder_freshen();
    },
    clear_errors: function () {
        if($.isFunction(this.beforeClearErrors)) { this.beforeClearErrors.call(this); }
        this.$el.find('.has-error .help-block').remove();
        this.$el.find('.has-error').removeClass('has-error');
        if($.isFunction(this.afterClearErrors)) { this.afterClearErrors.call(this); }
    },
    set_errors: function (errors) {
        this.clear_errors();
        if($.isFunction(this.beforeSetErrors)) { this.beforeSetErrors.call(this, errors); }
        _.each(errors, function (value, key) {
            var $input = this.$el.find('[name=' + key +']');
            $input.closest('[class^=col-]').addClass('has-error');
            _.each(value, function (val) {
                // if we're inside an ie9 placeholder shim, insert after that
                var $placeholder = $input.closest('.placeholder__wrapper');
                if($placeholder.length > 0) {
                    $placeholder.after('<div class="help-block">' + val + '</div>');
                }
                else {
                    $input.after('<div class="help-block">' + val + '</div>');
                }
            });
        }, this);
        if($.isFunction(this.afterSetErrors)) { this.afterSetErrors.call(this, errors); }
    },
    validate: function () {
        this.clear_errors();
        if($.isFunction(this.beforeValidate)) { this.beforeValidate.call(this); }
        var result = validate_form(this.$el);
        if($.isFunction(this.afterValidate)) { this.afterValidate.call(this, result); }
        return result;
    },
    focus: function () {
        this.$el.find('[name]').first().focus();
    },
    mark_required_fields: function(){
        // add a splot to all required fields
        this.$el.find('[required]').each(function(){
            var $this = $(this);

            if($this[0].type === 'select-one') {
                var $firstOption = $this.children().first();
                var oldText = $firstOption.text();
                $firstOption.text( oldText + ' *');
            }
            else {
                var placeholder = $this.attr('placeholder');
                $this.attr( 'placeholder', placeholder + ' *');
            }
        });
    }
};


/*
** Generic input keypress handler for forms
**
** $(myform).on('keypress', 'input', form_keys);
**
** Pressing <enter> in any field clicks the button with "action" class.
** Pressing <esc> in any field clicks the button with "cancel" class.
*/
function form_keys (ev) {
    if(ev.which == 13) {
        // console.log( 'enter' );
        $(ev.target).closest('form').find('[data-action=submit]').click();
    } else if(ev.which == 27) {
        // console.log( 'escape' );
        $(ev.target).closest('form').find('[data-action=cancel]').click();
    }
}


/*
** Show the first step in a wizard that has an error.
*/
function show_first_error(target) {
    $target = $(target);
    var pane = $target.find('.has-error').first().closest('.step-pane');
    $target.wizard('selectedItem', { step: $target.find('.step-pane').index(pane) + 1 });
}
;
var Messages = function (selector) {
    this.$container = $(selector);
    this.dismissButton = '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
};

Messages.prototype.addMessage = function (message, mclass) {
    this.clear();
    if (message) {
        var $messageEl = $('<div></div>').html(message);
        var $message = $('<div></div>').addClass('alert alert-' + mclass + ' alert-dismissable').append($(this.dismissButton)).append($messageEl);
        $message.appendTo(this.$container);
    }
    return this;
};

Messages.prototype.success = function (message) {
    return this.addMessage(message, 'success');
};

Messages.prototype.failure = function (message) {
    return this.addMessage(message, 'danger');
};

Messages.prototype.clear = function () {
    this.$container.html('');
    return this;
};
;
/*
* Container for a SPA Page view
*/

var Page = function (root) {
    this.root = root;
};

Page.prototype = {
    // Called when this page is activated
    onSelect: function () {},
    // Called after template has rendered
    onRender: function () {},
};

;
var Account = function () {
    Page.apply(this, arguments);
    this.tmpl = 'accountTmpl';

};
Account.prototype = Object.create(Page.prototype);
Account.prototype.constructor = Account;
;
Appointments = function () {
    Page.apply(this, arguments);
    this.tmpl = 'appointmentsTmpl';
};

Appointments.prototype = Object.create(Page.prototype);
Appointments.prototype.constructor = Appointments;

Appointments.prototype.onSelect = function () {
    this.root.user.fetchBookings();
};
;

var Appt = function (data) {
    $.extend(this, data);
    this.when = this.date;
    this.m = moment(this.date);
    this.date = this.m.format(DATE_FORMAT);
    this.time = this.m.format(DAYTIME_FORMAT);
};


var Calendar = function () {
    var self = this;

    this.$confirm = $('#confirm');

    Page.apply(this, arguments);
    this.tmpl = 'calendarTmpl';

    this.selectedDoctorCode = ko.observable();
    this.selectedDate = ko.observable();
    this.displayDate = ko.computed(function(){
        return moment(this.selectedDate(), DATE_FORMAT).format('D MMM');
    }, this);
    this.selectedTime = ko.observable();

    this.selectedDoctor = ko.computed(function () {
        return this.root.doctor_map()[this.selectedDoctorCode()];
    }, this);
    this.doctorShortName = ko.computed(function () {
        if(this.selectedDoctor() === undefined) { return undefined; }
        return this.selectedDoctor().name.split(' ').slice(1).join(' ');
    }, this);

    this.bookingComplete = ko.computed(function () {
        return this.selectedDoctorCode() !== undefined && this.selectedDate() !== undefined && this.selectedTime() !== undefined;
    }, this);
    this.bookingConfirmed = ko.observable(false);

    this.setSelectedDoctor = function (appt) {
        if(!_.contains(self.filteredDoctors(), appt.doctor_code)) { return; }
        self.selectedDoctorCode(self.selectedDoctorCode() == appt.doctor_code ? undefined : appt.doctor_code);
    };
    this.setSelectedDate = function (ctx, ev) {
        var date = $(ev.target).data('date');
        if(!$(ev.target).hasClass('available')) { return; }
        if (self.selectedDate() == date) {
            self.selectedDate(undefined);
            self.selectedTime(undefined);
        } else {
            self.selectedDate(date);
        }
    };
    this.setSelectedTime = function (time) {
        if(!_.contains(self.filteredTimes(), time)) { return; }
        self.selectedTime(self.selectedTime() == time ? undefined : time);
    };

    this.appointmentList = ko.observableArray([]);
    this.filteredDoctors = ko.computed(function () {
        return _.chain(this.appointmentList())
            .map(function(appt) {
                if(root.selectedClinic() != appt.clinic_id) { return; }
                if(this.selectedDate() && this.selectedDate() != appt.date) { return; }
                if(this.selectedTime() && this.selectedTime() != appt.time) { return; }
                return appt.doctor;
            }, this)
            .compact()
            .sort()
            .uniq(true)
            .value();
    }, this);
    this.filteredDates = ko.computed(function () {
        return _.chain(this.appointmentList())
            .map(function(appt) {
                if(root.selectedClinic() != appt.clinic_id) { return; }
                if(this.selectedTime() && this.selectedTime() != appt.time) { return; }
                if(this.selectedDoctorCode() && this.selectedDoctorCode() != appt.doctor) { return; }
                return appt.date;
            }, this)
            .compact()
            .sort()
            .uniq(true)
            .value();
    }, this);
    this.filteredTimes = ko.computed(function () {
        return _.chain(this.appointmentList())
            .map(function(appt) {
                if(root.selectedClinic() != appt.clinic_id) { return; }
                if(this.selectedDate() && this.selectedDate() != appt.date) { return; }
                if(this.selectedDoctorCode() && this.selectedDoctorCode() != appt.doctor) { return; }
                return appt.time;
            }, this)
            .compact()
            .sortBy(function (t) { return moment(t, DAYTIME_FORMAT); })
            .uniq(true)
            .value();
    }, this);

    this.filteredAppts = ko.computed(function  () {
        return _.chain(this.appointmentList())
            .map(function (appt) {
                if(root.selectedClinic() != appt.clinic_id) { return; }
                if(this.selectedDoctorCode() && this.selectedDoctorCode() != appt.doctor) { return; }
                if(this.selectedDate() && this.selectedDate() != appt.date) { return; }
                if(this.selectedTime() && this.selectedTime() != appt.time) { return; }
                return appt;
            }, this)
            .compact()
            .sortBy(function (appt) { return appt.when; })
            .uniq(true)
            .value();
    }, this);

    this.filteredAppts.subscribe(function () {
        // Find the first un-selected button and throb it
        var el;
        if(this.selectedDate() === undefined) { el = $('.booking-info button[name=date]'); }
        else if(this.selectedTime() === undefined) { el = $('.booking-info button[name=time]'); }
        else if(this.selectedDoctorCode() === undefined) { el = $('.booking-info button[name=doctor]'); }
        else { el = $('.booking-info button[name=confirm]'); }

        el.animate({opacity: 0.4}, 100).animate({opacity: 1.0}, 100)
          .animate({opacity: 0.4}, 100).animate({opacity: 1.0}, 100)
          .animate({opacity: 0.4}, 100).animate({opacity: 1.0}, 100);

        // Work around display issue with buttons not reverting, which we can no longer replicate
            // this attempted fix for an issue which can't be replicated causes stickyjs to rewrap itself
            // recursively with the <div id="undefined-sticky-wrapper"> each time a date, doctor, time is clicked
        // $('.booking-info').sticky('update');
    }, this);

    this.selectFirstAvailable = function () {
        var rec = self.filteredAppts()[0];
        if(rec === undefined) { return; }
        self.selectedDoctorCode(rec.doctor);
        self.selectedDate(rec.date);
        self.selectedTime(rec.time);
    };

    this.clearBooking = function () {
        self.resetBooking();
        self.$confirm.modal('hide');
    };
};

Calendar.prototype = Object.create(Page.prototype);
Calendar.prototype.constructor = Calendar;

Calendar.prototype.onSelect = function () {
    this.fetchData();
    this.resetBooking();
};
Calendar.prototype.onRender = function () {
    $('.booking-info').sticky({topSpacing: 10});
};

Calendar.prototype.fetchData = function () {
    $.ajax({
        url: '/api/v1/appointment/',
        type: 'GET',
        cache: false,
        success: $.proxy(function (response) {
            this.appointmentList(_.map(response.objects, function(rec) { return new Appt(rec); }));
        }, this),
        error: function (jqXHR) { console.log('Calendar update failed', jqXHR); }
    });
};

Calendar.prototype.confirmBooking = function () {
    if(!this.root.user.isAuthenticated()) {
        root.user.showLogin();
        root.user.$login.one('hide.bs.modal', function () {
            if(this.root.user.isAuthenticated()) { this.confirmBooking(); }
        }.bind(this));
        return;
    }
    this.$confirm.modal('show');
    this.$confirm.one('hide.bs.modal', $.proxy(function () {
        if(this.bookingConfirmed()) {
            this.resetBooking();
        }
    }, this));
};

Calendar.prototype.makeBooking = function () {
    var appt = this.filteredAppts()[0];

    $.ajax({
        url: '/api/v1/appointment/object/' + appt.id + '/',
        type: 'POST',
        data: {
            patient: $('#patient').val()
        },
        success: $.proxy(function() { this.bookingConfirmed(true); }, this),
        error: function() { console.log('failure', this, arguments); }
    });
};

Calendar.prototype.cancelConfirm = function () {
    this.$confirm.modal('hide');
};

Calendar.prototype.resetBooking = function () {
    this.selectedDoctorCode(undefined);
    this.selectedDate(undefined);
    this.selectedTime(undefined);
    this.bookingConfirmed(false);
};
;
var PasswordReset = function () {
    var self = this;

    Page.apply(this, arguments);
    this.tmpl = 'resetPasswordTmpl';
    this.$modal = $('#forgot-password');

    this.form = new Form('#forgot-password');

    this.onRender = function () {
        self.setContent('show-form');

        // Because ie9
        placeholder_ie9();
    };
};

PasswordReset.prototype = Object.create(Page.prototype);
PasswordReset.prototype.constructor = PasswordReset;

PasswordReset.prototype.setContent = function (mode) {
    var view = $('#reset-password'); // dynamically rendered
    view.find('.show-form')[mode == 'show-form' ? 'show' : 'hide']();
    view.find('.success')[mode == 'success' ? 'show' : 'hide']();
    view.find('.bad-token')[mode == 'bad-token' ? 'show' : 'hide']();
};

PasswordReset.prototype.setToken = function (uid, token) {
    this.uid = uid;
    this.token = token;
    $.ajax({
        url: '/accounts/reset/' + uid + '/' + token + '/',
        type: 'GET',
        complete: $.proxy(function (xhr) {
            if(xhr.status == 200) { return; }
            // Tell them the token is invalid
            this.setContent('bad-token');
        }, this)
    });
};

PasswordReset.prototype.resetPassword = function () {
    var reset_form = new Form('#reset_password');
    var results = reset_form.validate();
    if( !results.valid ) {
        reset_form.set_errors(results.errors);
        return;
    }

    $.ajax({
        url: '/accounts/reset/' + this.uid + '/' + this.token + '/',
        type: 'POST',
        data: $('#reset_password').serialize(),
        success: $.proxy(function () {
            this.setContent('success');

            this.uid = undefined;
            this.token = undefined;
        }, this),
        error: $.proxy(function (xhr) {
            reset_form.set_errors(xhr.responseJSON);
        }, this)
    });
};

// Request password reset modal
PasswordReset.prototype.forgotPassword = function () {
    var result = this.form.validate();
    if(!result.valid) {
        this.form.set_errors(result.errors);
        return;
    }

    $.ajax({
        url: '/accounts/forgot/',
        type: 'POST',
        data: {
            'email': result.values.email
        },
        success: $.proxy(function () {
            this.$modal.find('.before').hide();
            this.$modal.find('.after').show();
        }, this),
        error: $.proxy(function (xhr) {
            this.form.set_errors(xhr.responseJSON);
        }, this)
    });
};

PasswordReset.prototype.showForgotPassword = function () {
    this.form.clear();
    this.$modal.find('.before').show();
    this.$modal.find('.after').hide();
};
;
var User = function () {
    var self = this;

    // useful elements
    this.$login = $('#loginregister');
    this.$user_form = $('#user-form');
    this.$patient_form = $('#patient-form');

    this.forms = {
        login: new Form('#loginForm'),
        register: new Form('#register'),
        user: new Form(this.$user_form),
        patient: new Form(this.$patient_form)
    };

    // observables
    this.name = ko.observable();
    this.email = ko.observable();
    this.phone = ko.observable();

    this.patients = ko.observableArray([]);
    this.bookings = ko.observableArray([]);

    this.isAuthenticated = ko.observable(false);
    this.isAuthenticated.subscribe(function (newValue) {
        if(newValue) {
            GlobalMessages.success('Please make sure your details are kept up to date!');
        }
    });

    // callbacks
    this.addPatient = function () {
        self.$patient_form.data('patient', '0');
        self.forms.patient.clear();
        self.$patient_form.find('h2').text('Add family member');

        self.$patient_form.one('shown.bs.modal', function () {
            self.forms.patient.focus();
            $('#patient_form [name=dob]').mask(DATE_MASK, { placeholder: DATE_PLACEHOLDER });
            $('#patient_form [name=medicare_exp], #editPatient [name=pension_exp]').mask(DATE_MASK, { placeholder: EXPDATE_PLACEHOLDER });
        }).modal('show');
    };

    this.editPatient = function () {
        var form = self.$patient_form;
        form.data('patient', this.id);
        self.forms.patient.load_record(this);
        form.find('h2').text('Edit family member');

        form.one('shown.bs.modal', function () {
            self.forms.patient.focus();
            $('#patient_form [name=dob]').mask(DATE_MASK, { placeholder: DATE_PLACEHOLDER });
            $('#patient_form [name=medicare_exp], #editPatient [name=pension_exp]').mask(DATE_MASK, { placeholder: EXPDATE_PLACEHOLDER });
        }).modal('show');
    };

    this.editPatientCancel = function () {
        self.$patient_form.modal('hide');
    };

    this.editUser = function () {
        self.forms.user.load_record(this);
        self.$user_form.one('shown.bs.modal', function () { self.forms.user.focus(); }).modal({});
    };

    this.editUserCancel = function () {
        self.$user_form.modal('hide');
    };

    this.logout = function () {
        $.ajax({
            'url': '/accounts/logout/',
            'type': 'GET',
            'success': function () {
                self.isAuthenticated(false);
                GlobalMessages.clear().success('You have successfully logged out.');
            },
            'error': function () {
                GlobalMessages.clear().failure('There was a problem logging you out, please try again.');
            }
        });
    };

    this.cancelBooking = function () {
        $.ajax({
            url: '/api/v1/booking/object/' + this.id + '/cancel/',
            type: 'POST',
            success: self.fetchBookings.bind(self),
            error: self.fetchBookings.bind(self)
        });
    };

    this.showLogin = function () {
        self.forms.login.clear();

        // sorry.. this looks super dirty.. but it works for now!
        $('#loginregister')
            .one({
                'show.bs.modal': function () {
                    $('.nav-tabs [href=#login]').tab('show');
                },
                'shown.bs.modal': function () { // trigger first time..
                    self.forms.login.focus();
                },
                'shown.bs.tab': function () { // and subsequent times..
                    self.forms.login.focus();
                }
            })
            .modal('show');
    };

    this.showRegister = function () {
        self.forms.register.clear();

        // sorry.. this looks super dirty.. but it works for now!
        $('#loginregister')
            .one({
                'show.bs.modal': function () {
                    $('.nav-tabs [href=#register]').tab('show');
                },
                'shown.bs.modal': function () {
                    self.forms.register.focus(); // trigger first time..
                },
                'shown.bs.tab': function () {
                    self.forms.register.focus(); // and subsequent times..
                    // would rather not do this every time... (brutal, says Curtis)
                    $('#registerForm [name=dob]').mask(DATE_MASK, { placeholder: DATE_PLACEHOLDER });
                    $('#registerForm [name=medicare_exp], #registerWizard [name=pension_exp]').mask(EXPDATE_MASK, { placeholder: EXPDATE_PLACEHOLDER });
                }
            })
            .modal('show');
    };
};

User.prototype.login = function () {
    $('.login-alert').addClass('hide');
    if (this.isAuthenticated()) return;

    var result = this.forms.login.validate();
    if(!result.valid) {
        this.forms.login.set_errors(result.errors);
        return;
    }

    $.ajax({
        url: '/accounts/login/',
        type: 'POST',
        data: {
            username: this.email(),
            password: $('#password').val()
        },
        success: function (response) {
            GlobalMessages.success('You have successfully logged in.');
            this.loginSuccessHandler(response);
            this.fetchPatients();
        }.bind(this),
        error: this.loginFailureHandler.bind(this)
    });
};

User.prototype.register = function () {
    if (this.isAuthenticated()) return;
    var result = this.forms.register.validate();
    if(!result.valid) {
        this.forms.register.set_errors(result.errors);
        return;
    }

    $.ajax({
        url: '/accounts/register/',
        type: 'POST',
        data: $('#registerForm').serialize(),
        success: function () {
            GlobalMessages.success('You have successfully registered.');
            this.isAuthenticated(true);
            $('#loginregister').modal('hide');
            this.fetchDetails();
            this.fetchPatients();
        }.bind(this),
        error: function (xhr) {
            this.forms.register.set_errors(xhr.responseJSON);
        }.bind(this)
    });
};

User.prototype.fetchDetails = function (callback) {
    $.ajax({
        url: '/accounts/login/',
        type: 'GET',
        success: function (response) {
            // If we're logged in.
            if (response) {
                this.loginSuccessHandler(response);
                this.fetchPatients();
                this.fetchBookings();
            }
            if (callback !== undefined){
                callback();
            }
        }.bind(this),
        error: this.loginFailureHandler.bind(this)
    })
        .always(function(){
            root.loading(false);
        });
};

User.prototype.loginSuccessHandler = function (response) {
    _(response).each(function(value, key) {
        try{
            this[key](value);
        } catch (x) {}
    }, this);
    this.isAuthenticated(true);
    $('#loginregister').modal('hide');
};

User.prototype.loginFailureHandler = function (xhr) {
    var message = 'Login attempt failed. Please try again.';

    if (xhr && xhr.responseJSON && xhr.responseJSON.__all__) {
        message = xhr.responseJSON.__all__[0];
    }

    $('.login-alert').removeClass('hide').html(message);
};

User.prototype.saveUser = function () {
    if (!this.isAuthenticated()) return;

    var results = this.forms.user.validate();
    if(!results.valid) {
        this.forms.user.set_errors(results.errors);
        return;
    }

    $.ajax({
        url: '/accounts/update/',
        type: 'POST',
        data: this.$user_form.find('form').serialize(),
        success: function (response) {
            this.loginSuccessHandler(response);
            this.$user_form.modal('hide');
        }.bind(this),
        error: function (xhr) {
            this.forms.user.set_errors(xhr.responseJSON);
        }.bind(this)
    });
};

User.prototype.fetchPatients = function () {
    $.ajax({
        url: '/api/v1/patient/',
        type: 'GET',
        success: function (response) { this.patients(response.objects); }.bind(this),
        error: function (xhr) { console.log(xhr, arguments); }
    });
};

User.prototype.savePatient = function () {
    var form = this.$patient_form;
    var result = this.forms.patient.validate();

    if(!result.valid) {
        this.forms.patient.set_errors(result.errors);
        return;
    }

    var id = form.data('patient');
    $.ajax({
        url: '/api/v1/patient/' + ((id == '0') ? '' : 'object/' + id + '/'),
        type: 'POST',
        data: form.find('form').serialize(),
        success: function () {
            this.fetchPatients();
            form.modal('hide');
        }.bind(this),
        error: function (xhr) {
            this.forms.patient.set_errors(xhr.responseJSON);
        }.bind(this)
    });
};

User.prototype.fetchBookings = function () {
    $.ajax({
        url: '/api/v1/booking/',
        type: 'GET',
        success: function (response) { this.bookings(response.objects); }.bind(this),
        error: function (xhr) { console.log(xhr, arguments); }
    });
};
;
// Fix HS-377 Safari 8 blocks cookies on iframes
// Also requires the iframe in the client site to have the attribute "allow-top-navigation"
// http://measurablewins.gregjxn.com/2014/02/safari-setting-third-party-iframe.html
if(navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1){
    var cookies=document.cookie;

    if(top.location!=document.location){
        // we're in an iframe
        if(!cookies){
            // we have no cookies
            href = document.location.href;
            href = (href.indexOf('?')==-1) ? href+'?' : href+'&';
            // break out of the iframe, saving the referrer in the query string
            // http://iframe.com?reref=referrer.com
            top.location.href = href+'reref='+encodeURIComponent(document.referrer);
        }
    }
    else {
        // we're not in an iframe
        ts = new Date().getTime();
        document.cookie = 'ts='+ts;
        // check to see whether we've previously set the reref querystring
        rerefidx = document.location.href.indexOf('reref=');
        // if so, return to the original referrer
        if(rerefidx != -1){
            href = decodeURIComponent(document.location.href.substr(rerefidx+6));
            window.location.replace(href);
        }
    }
}

function sameOrigin(url) {
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}
function safeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$(document).ajaxSend(function(event, xhr, settings) {
    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        var token = $.cookie('csrftoken');
        xhr.setRequestHeader("X-CSRFToken", token);
    }
});


var GlobalMessages = new Messages('.global-messages');

/**
* Make a dummy console object for browsers that don't have one so we don't throw errors.
*/
try{
    console.log();
}
catch(err){
    console = {};
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
}

var ViewModel = function () {
    var self = this;

    this.user = new User();

    // set up a loading variable, to be toggled when fetchDetails() has finished
    this.loading = ko.observable(true);

    this.genderChoices = [
        {value: '', display: 'Unknown'},
        {value: 'M', display: 'Male'},
        {value: 'F', display: 'Female'}
    ];

    /*
    ** Clinic lists
    */

    this.clinics = ko.observableArray([]);
    this.clinic_map = ko.computed(function () {
        var map = {};
        _.each(this.clinics(), function (clinic) { map[clinic.id] = clinic; });
        return map;
    }, this);
    this.selectedClinic = ko.observable();
    this.currentClinic = ko.computed(function () {
        return this.clinic_map()[this.selectedClinic()];
    }, this);

    /*
    ** Doctor lists
    */

    this.doctors = ko.observableArray([]);
    // Map of doctor_code to doctor
    this.doctor_map = ko.computed(function () {
        var doc_map = {};
        _.each(this.doctors(), function (doc) { doc_map[doc.doctor_code] = doc; });
        return doc_map;
    }, this);

    this.fetchDoctorData = function () {
        $.ajax({
            url: '/api/v1/doctor/',
            type: 'GET',
            data: {'clinic': self.selectedClinic()},
            success: function (response) { self.doctors(response.objects); },
            error: function (jqXHR) { console.log('Doctor requeset failed', jqXHR); }
        });
    };
    this.selectedClinic.subscribe(function () {
        this.fetchDoctorData();
    }, this);

    this.fetchClinicData = function () {
        $.ajax({
            url: '/api/v1/clinic/',
            type: 'GET',
            success: function (response) {
                self.clinics(_.sortBy(response.objects, 'order'));
                if(self.selectedClinic() === undefined) { self.selectedClinic(self.clinics()[0].id); }
            },
            error: function (jqXHR) { console.log('Clinic request failed', jqXHR);}
        });
    };

    this.sam = Sammy(function () {
        // Dict of subscriptions which we will later call dispose() on to unsubscibe
        var temporarySubscriptions = {};

        this.mapRoutes([
            ['get', '/', function () {
                this.app.setLocation('#booking');
                GlobalMessages.failure('<i class="fa fa-exclamation-triangle"></i> Do not use this service in emergencies.  Call 000!');
            }],
            ['get', '#clinic/:id', function () {
                var val = parseInt(this.params['id']);
                self.selectedClinic(val || 1);
                this.app.setLocation('#booking');
            }],
            ['get', '#forgot-password', function () {
                $('#forgot-password .before').show();
                $('#forgot-password .after').hide();
                $('#forgot-password').modal('show');
            }],
            // url(r'^reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
            ['get', '#reset-password/:uid/:token', function (context) {
                if(self.user.isAuthenticated()) { this.app.setLocation('#booking'); return; }
                self.setCurrentView('reset_password');
                self.screens.reset_password.setToken(this.params['uid'], this.params['token']);
            }],
            // Calendar
            ['get', '#booking', function (context) {
                self.setCurrentView('calendar');
                //var cal = self.currentViewScreen();
                //cal.setSelectedDoctor(context.params['doctor']);
                //cal.setSelectedDate(context.params['date']);
                //cal.setSelectedTime(context.params['time']);
            }],
            // Appointments
            ['get', '#appointments', function () {
                if(!self.user.isAuthenticated()) { this.app.setLocation('#booking'); return; }
                self.setCurrentView('appointments');
            }],
            // Account
            ['get', '#account', function () {
                if(!self.user.isAuthenticated()) { this.app.setLocation('#booking'); return; }
                self.setCurrentView('account');
            }],
            // Login
            ['get', '#selfarrive', function () {
                self.setCurrentView('appointments');
                if(!root.user.isAuthenticated()) {
                    root.user.showLogin();
                    temporarySubscriptions.selfArriveAuth = root.user.isAuthenticated.subscribe( function (newValue){
                        if(newValue === true){
                            self.setCurrentView('appointments');
                        }
                    });
                }
            }],
        ]);
        this.raise_errors = true;
        this.notFound = function (verb, path) {
            console.error('Invalid route:', verb, path);
            this.setLocation('#booking');
        };
        // Ensure all modals close when routed
        this.before(/.*/, function () { $('.modal').modal('hide'); });
        // will run everywhere but #/selfarrive
        this.before({except: {path: '#/selfarrive'}}, function() {
            if(temporarySubscriptions.selfArriveAuth) {
                temporarySubscriptions.selfArriveAuth.dispose();
            }
        });
    });

    this.screens = {
        'calendar': new Calendar(this),
        'appointments': new Appointments(this),
        'account': new Account(this),
        'reset_password': new PasswordReset(this)
    };

    this.currentView = ko.observable('calendar');
    this.currentViewScreen = ko.computed(function () {
        return this.screens[this.currentView()];
    }, this);

    // Collapse the drop-down menu everythime the currentView changes
    this.currentView.subscribe(function () {
        $(".navbar-collapse.in").collapse('hide');
    });

    this.setCurrentView = function (name) {
        GlobalMessages.clear();
        this.currentView(name);
        this.currentViewScreen().onSelect();
    };

    // If they log out, boot them to the calendar
    this.user.isAuthenticated.subscribe(function (newValue) {
        if(newValue === false) {
            this.sam.setLocation('#booking');
        }
    }, this);

    // Make enter and esc work as we want in modal forms
    $('.modal').on('keyup', 'input', form_keys);

    // Activate popover help in form fields
    $('[data-toggle="popover"]').popover({
        container: "body",
        html: true,
        animated: "fade",
        show: true
    });

    $('[data-toggle="tooltip"]').tooltip();

    // Because ie9
    placeholder_ie9();

    this.fetchClinicData();

    this.user.fetchDetails(function () {
        self.sam.run();
    });
};


var root = new ViewModel();

ko.applyBindings(root);

