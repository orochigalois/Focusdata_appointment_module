
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
            '3184390446',
            '3372789764',
            '2504626987',
            '3370474597',
            '3408167875',
            '3275308026',
            '3334197336',
            '2504626987',
            '3461147264',
            '3415326714',
            '3269901994',
            '3273337516',
            '3388686022',
            '3329590814',
            '3314884323',
            '3274340453',
            '3384854147',
            '3433097906',
            '3111420664',
            '3388686022',
            '3376809791',
            '3139650728',
            '3212313746',
            '3403611172',
            '3380219887',
            '6007701675',
            '3315239627',
            '3299094533',
            '3077215787',
            '3207114042',
            '3382520521',
            '3185518658',
            '3282551371',
            '3295278516',
            '3029060791',
            '3340515036',
            '3103541167',
            '3435627844',
            '3191542631',
            '3373017286',
            '3409009274',
            '3322776314',
            '3348024332',
            '3278458412',
            '3218580437',
            '3278458412',
            '3341395316',
            '3358007175',
            '3298068808',
            '3425005544',
            '3173087507',
            '3900265962',
            '3012607589',
            '3356303233',
            '3025362347',
            '3447340012',
            '3171063588',
            '3468048702',
            '3112984022',
            '3287663859',
            '3287663859',
            '3287663859',
            '3287663859',
            '3275814668',
            '2573709123',
            '3239009593',
            '3178127671',
            '3214915181',
            '3132931911',
            '3432187803',
            '3364470784',
            '3424978384',
            '3017408679',
            '3311095555',
            '3181387704',
            '3147835457',
            '3138429208',
            '3225628067',
            '3265605252',
            '3210816364',
            '2463896006',
            '3149117177',
            '3165158967',
            '3165452243',
            '3349960626',
            '3009634618',
            '3196115571',
            '3352287644',
            '3171008739',
            '3334750748',
            '4199048636',
            '3460767291',
            '3221884843',
            '3278008155',
            '3006452468',
            '3296137698',
            '3262184486',
            '3205648538',
            '2460755766',
            '3370474591',
            '3456574532',
            '3901194326',
            '3323906134',
            '3452078232',
            '2537202987',
            '3409950373',
            '3316611188'
        ];

        if(_.contains(blacklist, val)) {
            // console.warn( 'Medicare # blacklisted' );
            return 'Not a valid medicare number.';
        }

        // valid test medicare number: 123 123 123 1 / 1
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
    postcode: function (val, $field) {

        // bail early if blank (may trigger required)
        if(!val) { return; }

        var pattern = /^\d{3,4}$/;
        if( !pattern.test(val) ) {
            return 'Must be a valid postcode.';
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
