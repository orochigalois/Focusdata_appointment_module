
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

    //** start extended rego vars
    // these are only required if has_extended_registration is enabled,
    // but if they're guarded by an if(toggles().has_feature) then
    // they never get instantiated due to broken loading architecture
    this.phone_home = ko.observable();
    this.phone_work = ko.observable();

    this.address_building = ko.observable();
    this.address_street = ko.observable();
    this.address_suburb = ko.observable();
    this.address_postcode = ko.observable();

    this.hasPension = ko.observable(false);
    this.setPensionType = function(data, event){
        var val = this.$login.find('#pension_type').val();
        // set true if we have any value but the default "0"
        this.hasPension(val !== '0');
    };

    this.hasDVA = ko.observable(false);
    this.setDVAType = function(data, event){
        var val = this.$login.find('#dva_type').val();
        // set true if we have any value but the default "0"
        this.hasDVA(val !== '0');
    };

    this.hasMedicare = ko.observable(false);
    this.setHasMedicare = function(data, event){
        var val = this.$login.find('#medicare_no').val();
        this.hasMedicare(val !== '');
    };

    // FIX: for some reason, this value is not initially _displayed_ as default,
    // though the conditionals that rely on it are correct
    this.hasInsurance = ko.observable(false);
    //** end extended_registration vars

    this.position = ko.observable(null);
    this.geolocating = ko.observable(true);

    this.patients = ko.observableArray([]);
    this.bookings = ko.observableArray([]);

    this.isNewPatient = ko.observable(null);
    this.isNewPatient.subscribe(function (newValue) {
        if(toggles().has_long_appointment_new) {

            // always show the message if answering 'I'm new'
            if(newValue === true) {
                displayRequireLongApptMessage();

                if(self.isLongAppt() === false) {
                    self.isLongAppt(true);
                }
            }
            else {
                // revert to the default appt if we've switched back to existing patient
                if(toggles().has_appointment_types) {
                    var clinic = root.currentClinic();
                    var defaultApptType = _.findWhere(clinic.appointment_type, { is_preselected: true });
                    self.appointmentType(defaultApptType.id);
                }
            }
        }
    });
    this.declaredNewPatient = ko.observable(false);

    // show standard appointments initially
    this.isLongAppt = ko.observable(false);
    this.isLongAppt.subscribe(function (newValue) {
        // console.info('isLongAppt', newValue);

        if(newValue === true) {
            // Clear any previous selections only when changing from std to long
            // to prevent user confusion / UI glitches:
                // eg: when doctor-1 is selected, but has no long appts available,
                // the selection will remain, but the doctor is no longer clickable.

            // Allow selections to persist when going from long to std because
            // long appts are a subset of std, therefore, existing selections will be valid

            // ..but don't reset if the selected filters contain valid long appts!
            var cal = root.screens.calendar;
            if (!_.contains(filterValidLongAppts(cal.appointmentList()), cal.filteredAppts()[0])) {
                cal.resetBooking();
            }
        }

        if(toggles().has_long_appointment_new) {
            if( self.declaredNewPatient() === true      // user ansered
                && self.isNewPatient() === true) {      // user is new

                if (self.isLongAppt() === false ) {
                    displayRequireLongApptMessage();
                    self.isLongAppt(true);
                }

                if(toggles().has_appointment_types) {
                    var new_patient_default_appointment_type = root.currentClinic().new_patient_default_appointment_type;
                    if (!new_patient_default_appointment_type) throw new Error('No new_patient_default_appointment_type is set');
                    self.appointmentType(new_patient_default_appointment_type);
                }
            }
        }
    });

    // appointmentType is an ID / pk
    this.appointmentType = ko.observable(null);
    this.appointmentType.subscribe(function (newValue) {
        var apptType =_.findWhere(root.currentClinic().appointment_type, {id: newValue});
        if (apptType) {
            self.isLongAppt(apptType.length == 2);
        }
    });
    // disable the appoint type selector if the user declares that they're a new patient
    this.disableApptSelect = ko.computed(function() {
        if (!toggles().has_long_appointment_new ) {
            return false;
        }
        // avoid disabling the select if a default was not provided
        if (root && root.currentClinic() && !root.currentClinic().new_patient_default_appointment_type) {
            return false;
        }
        if (self.declaredNewPatient() && self.isNewPatient()) {
            return true;
        }
        return false;
    });

    this.extRegoFeedback = ko.observable('');

    this.isAuthenticated = ko.observable(false);
    this.isAuthenticated.subscribe(function (newValue) {
        if(newValue) {
            GlobalMessages.success('Please make sure your details are kept up to date!');
        }
    });

    //============================================================
    // Callbacks
    //============================================================

    // Update form handling and validation functions, depending on feature toggles
    // This needs to run after the toggles have been set, hence the computed.
    ko.computed(function() {
        self.addPatient   = (toggles().has_extended_registration) ? addPatientExtendedRego   : addPatientDefault;
        self.editPatient  = (toggles().has_extended_registration) ? editPatientExtendedRego  : editPatientDefault;
        self.editUser     = (toggles().has_extended_registration) ? editUserExtendedRego     : editUserDefault;
        self.showRegister = (toggles().has_extended_registration) ? showRegisterExtendedRego : showRegisterDefault;
    });

    function addPatientDefault() {
        self.$patient_form.data('patient', '0');
        self.forms.patient.clear();
        self.$patient_form.find('h2').text('Add family member');

        self.$patient_form.one('shown.bs.modal', function () {
            self.forms.patient.focus();
            $('#patient_form [name=dob]').mask(DATE_MASK, { placeholder: DATE_PLACEHOLDER });
            $('#patient_form [name=medicare_exp], #editPatient [name=pension_exp]').mask(DATE_MASK, { placeholder: EXPDATE_PLACEHOLDER });
        }).modal('show');
    };

    function addPatientExtendedRego() {
        self.$patient_form.data('patient', '0');
        self.forms.patient.clear();

        self.$patient_form.find('h2').text('Add family member');
        $('#editPatient').wizard('selectedItem', { step: 1 });

        self.$patient_form
            .one('shown.bs.modal', function () {
                self.forms.patient.focus();
                $('#editPatient [name=dob]').mask(DATE_MASK, { placeholder: DATE_PLACEHOLDER });
                $('#editPatient [name=medicare_exp], #editPatient [name=pension_exp]').mask(EXPDATE_MASK, { placeholder: EXPDATE_PLACEHOLDER });
            })
            .on('actionclicked.fu.wizard', $.proxy(function(e, data) {

                // only validate on next, don't block previous
                if(data.direction !== 'previous') {

                    // get the current step
                    var $currentStep = $(e.target).find('.step-content [data-step="'+ data.step+'"]');
                    // console.log( data, $currentStep );

                    var result = validate_form($currentStep);
                    if(!result.valid) {
                        // only preventDefault if there's an error
                        e.preventDefault();
                        self.forms.patient.set_errors( result.errors );
                        show_first_error( self.forms.patient );
                        $currentStep.find('.has-error [name]').first().focus();
                        return;
                    }
                    // remove errors so the previous step looks okay in case the user returns
                    self.forms.patient.clear_errors();
                }
                // all good! continue to next or previous step...

            }, self))
            .modal('show');

        $('#editPatient').on('finished.fu.wizard', self.savePatient.bind(self));
    };

    function editPatientDefault() {
        var form = self.$patient_form;
        form.data('patient', this.id);
        self.forms.patient.load_record(this);
        form.find('h2').text('Edit family member');

        form.one('shown.bs.modal', function () {
            self.forms.patient.focus();
            $('#patient_form [name=dob]').mask(DATE_MASK, { placeholder: DATE_PLACEHOLDER });
            $('#patient_form [name=medicare_exp], #editPatient [name=pension_exp]').mask(DATE_MASK, { placeholder: EXPDATE_PLACEHOLDER });
        }).modal('show');
    }

    function editPatientExtendedRego() {

        var form = self.$patient_form;
        // this is the click?
        var patient = this;
        form.data('patient', patient.id);
        self.forms.patient.load_record(patient);

        form.find('h2').text('Edit family member');
        $('#editPatient').wizard('selectedItem', { step: 1 });

        form
            .one('shown.bs.modal', function () {
                self.forms.patient.focus();
                $('#editPatient [name=dob]').mask(DATE_MASK, { placeholder: DATE_PLACEHOLDER });
                $('#editPatient [name=medicare_exp], #editPatient [name=pension_exp]').mask(EXPDATE_MASK, { placeholder: EXPDATE_PLACEHOLDER });
                editPatientHacks(self, patient);
            })
            .on('actionclicked.fu.wizard', $.proxy(function(e, data) {

                // only validate on next, don't block previous
                if(data.direction !== 'previous') {

                    // get the current step
                    var $currentStep = $(e.target).find('.step-content [data-step="'+ data.step+'"]');
                    // console.log( data, $currentStep );

                    var result = validate_form($currentStep);
                    if(!result.valid) {
                        // only preventDefault if there's an error
                        e.preventDefault();
                        self.forms.patient.set_errors( result.errors );
                        show_first_error( self.forms.patient );
                        $currentStep.find('.has-error [name]').first().focus();
                        return;
                    }
                    // remove errors so the previous step looks okay in case the user returns
                    self.forms.patient.clear_errors();
                }
                // all good! continue to next or previous step...

            }, self))
            .modal('show');

        $('#editPatient').on('finished.fu.wizard', self.savePatient.bind(self));
    };

    this.editPatientCancel = function () {
        self.$patient_form.modal('hide');
    };

    function editUserDefault() {
        self.forms.user.load_record(this);
        self.$user_form.one('shown.bs.modal', function () { self.forms.user.focus(); }).modal({});
    };

    function editUserExtendedRego() {
        self.forms.user.load_record(this);
        self.$user_form
            .one('shown.bs.modal', function () {
                self.forms.user.focus();
            })
            .modal({});
    };

    this.editUserCancel = function () {
        self.$user_form.modal('hide');
    };

    //============================================================
    // Long Appointments logic
    //============================================================
    // - long appointments should be available by toggling an 'Appointments Duration' button
    // - if has_long_appointments_new is true, new patients must always have a long appointment

    this.setNewPatientTrue = function () {
        self.declaredNewPatient(true);
        self.isNewPatient(true);
    };

    this.setNewPatientFalse = function () {
        self.declaredNewPatient(true);
        self.isNewPatient(false);
        GlobalMessages.clear();
    };

    this.toggleNewPatient = function () {
        var newState = !self.isNewPatient();
        if(newState === false) {
            // clear warnings if switching to 'existing patient'
            GlobalMessages.clear();
        }
        self.isNewPatient(newState);
    };

    this.setShortAppt = function() {
        self.isLongAppt(false);
    };

    this.setLongAppt = function() {
        self.isLongAppt(true);
    };


    //============================================================
    // Log in, log out
    //============================================================

    this.logout = function () {
        $.ajax({
            'url': 'classes/class.sign_out.php',
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
            url: 'classes/class.booking_cancel.php',
            type: 'POST',
            data: {ID:this.id},
            success: self.fetchBookings.bind(self),
            error: self.fetchBookings.bind(self)
        });
    };

    this.showLogin = function() {
        self.forms.login.clear();
        $('.login-alert').addClass('hide'); // quick patch: this error was implemented in a non-standard way

        // fixes HS-346 Date masks do not show in registration form
        // sorry.. this looks super dirty.. but it works for now!
        $('#loginregister')
            .one({
                'show.bs.modal': function () {
                    $('.nav-tabs [href="#login"]').tab('show');
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

    function showRegisterDefault() {
        self.forms.register.clear();

        // sorry.. this looks super dirty.. but it works for now!
        $('#loginregister')
            .one({
                'show.bs.modal': function () {
                    $('.nav-tabs [href="#register"]').tab('show');
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

    function showRegisterExtendedRego() {
        self.forms.register.clear();
        // reset the open Pension cared fields. Adding here because it only applies to showRegister
        self.hasPension(false);
        self.hasDVA(false);
        self.hasInsurance(false);

        if(!self.extRegoStep2Label) {
            // on first display, cache steps 2,3 to allow toggling 3/5 step form triggered by
            // "Are you an existing Patient?"
            // HS-34: wait until these exist on the page before attempting to cache
            self.extRegoStep2Label = self.$login.find('.steps [data-step="2"] .title').html();
            self.extRegoStep2      = self.$login.find('.step-content [data-step="2"]').html();
            self.extRegoStep3Label = self.$login.find('.steps [data-step="3"] .title').html();
            self.extRegoStep3      = self.$login.find('.step-content [data-step="3"]').html();
        }

        // fixes HS-346 Date masks do not show in registration form
        // sorry.. this looks super dirty.. but it works for now!
        $('#loginregister')
            .one({
                'show.bs.modal': function () {
                    $('.nav-tabs [href="#register"]').tab('show');
                    $('#registerWizard').wizard('selectedItem', { step: 1 });
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
            // validate the register form per step rather than on finish
            .on({
                'actionclicked.fu.wizard': function(e, data) {

                    // only validate on next, don't block previous
                    if(data.direction !== 'previous') {

                        // get the current step
                        var $currentStep = $(e.target).find('.step-content [data-step="'+ data.step+'"]');
                        // console.log( data, $currentStep );

                        var result = validate_form($currentStep);
                        if(!result.valid) {
                            // only preventDefault if there's an error
                            e.preventDefault();
                            self.forms.register.set_errors( result.errors );
                            show_first_error( self.forms.register );
                            $currentStep.find('.has-error [name]').first().focus();
                            return;
                        }
                        // remove errors so the previous step looks okay in case the user returns
                        self.forms.register.clear_errors();
                    }
                    // all good! continue to next or previous step...

                }.bind(self)
            })
            .modal('show');

            $('#registerWizard').on('finished.fu.wizard', self.register.bind(self));
            $('#editPatient').on('finished.fu.wizard', self.savePatient.bind(self));
    };

    // TODO: this looks like orphaned code from feature/extended-rego: cleanup
    // probaby only required if we're planning to switch between extd/default rego on the fly
    function removeExtendedRegoHandlers() {
        $('#registerWizard [name=dob]').unmask();
        $('#registerWizard [name=medicare_exp], #registerWizard [name=pension_exp]').unmask();

        $('#registerWizard').off('finished.fu.wizard');
        $('#editPatient').off('finished.fu.wizard');
    }

};

User.prototype.removeNewPatientFields = function (mode) {
    var self = this.user;

    // only do this once!
    if( self.isNewPatient() === false ) {
        return;
    }
    self.isNewPatient(false);

    // give the user some feedback��
    self.extRegoFeedback('Thanks, that simplifies things!');

    self.$login
        .toggleClass('existing-patient', true)
        // index (from, 1-indexed), howMany
        .wizard('removeSteps', 2, 2);
    scroll_to('#registerForm .actions');
};

User.prototype.resetNewPatientFields = function (mode) {
    var self = this.user;

    // give the user some feedback (on first click, even if the default is set)
    self.extRegoFeedback('Thanks, please continue through the form');
    scroll_to('#registerForm .actions');

    // all fields are displayed initially, and isNewPatient is intialized as null,
    // so set the state to true, but don't add duplicate fields
    if (self.isNewPatient() === null) {
        self.isNewPatient(true);
        return;
    }

    // 'No' was clicked a second time, so abort: don't display duplicate fields
    if (self.isNewPatient() === true ) {
        return;
    }

    // we're changing from 'Yes' (fields were previously removed) to 'No'
    // go ahead and add back the extra fields
    self.isNewPatient(true);

    self.$login
        .toggleClass('existing-patient', false)
        .wizard('addSteps', 2, [
            {
                badge: '',
                label: self.extRegoStep2Label,
                pane: self.extRegoStep2
            },
            {
                badge: '',
                label: self.extRegoStep3Label,
                pane: self.extRegoStep3
            }
        ]);
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
        url: 'classes/class.sign_in.php',
        type: 'POST',
        dataType: "json",
        data: {
            username: this.email(),
            password: $('#password').val()
        },
        success: function (response) {
        	
        	if(response.success){
        		GlobalMessages.success('You have successfully logged in.');
                this.loginSuccessHandler(response);
                this.fetchPatients();
        	}
        	else
        		this.loginFailureHandler();
        		
                
            
        }.bind(this),
        error: this.loginFailureHandler.bind(this)
    });
};

User.prototype.register = function () {
    if (this.isAuthenticated()) return;

    // validate
    var result = this.forms.register.validate();
    if(!result.valid) {
        this.forms.register.set_errors(result.errors);
        show_first_error('#registerWizard');
        return;
    }

    // add this to the data: in the ajax call below...
    var extraData = {'new_patient': this.isNewPatient };

    $.ajax({
        url: 'classes/class.register.php',
        type: 'POST',
        data: {form: $('#registerForm').serializeObject(), extra : $.param(extraData)},
        success: function (response) {
        	
        	if(response.success){
        		GlobalMessages.success('You have successfully registered.');
                this.isAuthenticated(true);
                $('#loginregister').modal('hide');
                this.fetchDetails();
                this.fetchPatients();
        	}
        	else{
        		//alert('This mail has been used');
        		var message = 'This mail has been used';

//        	    if (xhr && xhr.responseJSON && xhr.responseJSON.__all__) {
//        	        message = xhr.responseJSON.__all__[0];
//        	    }

        	    $('.register-alert').removeClass('hide').html(message);
        	}
            
        }.bind(this),
        error: function (xhr) {
            this.forms.register.set_errors(xhr.responseJSON);
            show_first_error('#registerWizard');
        }.bind(this)
    });
};

User.prototype.fetchDetails = function () {
    return $.ajax({
        url: 'classes/class.sign_in_yes_or_no.php',
        type: 'GET',
    })
        .then(function (response) {


            if (response.success) {
            	this.fetchPatients();
                this.fetchBookings();
                return $.when([
                    this.loginSuccessHandler(response),
                ]);
            }
            else {
                console.warn('Not logged in');
                // Fixme: apparently I should throw prepare to throw here...
                // throw new Error('Not logged in');
            }
        }.bind(this))
        .fail(
            this.loginFailureHandler.bind(this)
        )
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

    return $.ajax({
        url: 'classes/class.account_update.php',
        type: 'POST',
        dataType: "json",
        data: this.$user_form.find('form').serializeObject()
    })
        .then(function (response) {
            this.loginSuccessHandler(response);
            this.$user_form.modal('hide');
        }.bind(this))
        .fail(function (xhr) {
            this.forms.user.set_errors(xhr.responseJSON);
        });
};

User.prototype.fetchPatients = function () {
    return $.ajax({
        url: 'classes/class.patient_read.php',
        type: 'GET',
    })
        .then(function (response) {
            this.patients(response.objects);
        }.bind(this))
        .fail(function (xhr) {
            console.warn(xhr, arguments);
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
        url: ((id == '0') ? 'classes/class.patient_create.php' : 'classes/class.patient_update.php'),
        type: 'POST',
        data: {form: form.find('form').serializeObject(), patientID : id},
        success: function () {
            this.fetchPatients();
            form.modal('hide');
        }.bind(this),
        error: function (xhr) {
            var frm = $('#editPatient');
            this.forms.patient.set_errors(xhr.responseJSON);
            var pane = frm.find('.has-error').first().closest('.step-pane');
            frm.wizard('selectedItem', {
                step: frm.find('.step-pane').index(pane) + 1
            });
        }.bind(this)
    });
};

User.prototype.fetchBookings = function ( callback ) {
    $.ajax({
        url: 'classes/class.booking_read.php',
        type: 'GET',
        success: function (response) {
            var bookings = _(response.objects).map(function (b) {
                // prevent display of bookings other than booked (eg Pending)
                b.isValidBooking = ko.observable( b.action_type === 'booked' );

                b.clinicName = root.clinic_map()[b.clinic].name;

                // does THIS booking require selfArrive?
                var activateSelfArrive = root.clinic_map()[b.clinic].hasLocation;
                if( activateSelfArrive ) {

                    // b.arrived is received as a bool from the server
                    b.arrivalError = ko.observable(false);

                    b.distance = ko.computed(function () {
                        if(root.user.position()) {
                            return haversine(root.user.position(), root.clinic_map()[this.clinic]);
                        } else {
                            return 1000;
                        }
                    }, b);
                    b.inRange = ko.computed(function () {
                        return this.distance() < MINIMUM_RANGE;
                    }, b);
                    b.timeUntil = ko.observable(timeUntilAppointment(b));
                    b.isWithinCheckinWindow = ko.computed(function () {

                        var isWithinCheckinWindow = (
                            this.timeUntil() >= -10
                            && this.timeUntil() <= CHECKIN_WINDOW
                        );

                        // flag that at least one of the appointments needs to get location
                        // note: this witll never be unset! this is an acceptable compromise for now
                        if( isWithinCheckinWindow ) {
                            root.screens.appointments.needLocation( true );
                        }
                        return isWithinCheckinWindow;
                    }, b);
                    b.canArrive = ko.computed(function () {
                        return ( this.isWithinCheckinWindow() && this.inRange() );
                    }, b);

                    b.timeUntilBookingText = ko.computed(function(){
                        if(b.timeUntil() < 1 && b.timeUntil() > -2) {
                            return 'Your appointment is now.';
                        }
                        if(b.timeUntil() < -1) {
                            return 'Your booking was scheduled for ' + moment(b.date, 'YYYY-MM-DD HH:mm:ss').format('HH:mma')
                                    + '. Please call the clinic.';//on ' + b.id;
                        }
                        else {
                            var plural = (b.timeUntil() > 1) ? 's' : '';
                            return 'Your booking is in ' + b.timeUntil() + ' minute' + plural + '.';
                        }
                    });
                }
                else {
                    // set some defaults if config.selfArrive is false
                    b.inRange = false;
                    b.canArrive = false;
                    b.isValidBooking = ko.observable(false);
                    b.isWithinCheckinWindow = ko.observable(false);
                }
                return b;
            }, this);
            this.bookings(bookings);
            if(callback !== undefined){
                callback();
            }
        }.bind(this),
        error: function (xhr) { console.error(xhr, arguments); }
    });
};


User.prototype.arrive = function () {
    $.ajax({
        url: 'api/v1/booking/object/' + this.id + '/arrive/',
        type: 'POST',
        data: this.id,
        success: function () {
            root.user.fetchBookings();
        },
        error: function (xhr) {
            console.error( 'Problem, captain...', this );
            this.arrivalError(true);
        }.bind(this)
    });
};

function editPatientHacks(self, patient){
    var $form = $('#patient-form');

    // on load, set the open state appropriately
    setFieldState('pension_no', patient.pension_type, '');
    setFieldState('pension_exp', patient.pension_type, 'future_date');
    setFieldState('dva_no', patient.dva_type, 'dva');

    // watch for changes:
    $form.find('[name=pension_type]').on('change', function(){
        setFieldState('pension_no', $(this).val(), '');
        setFieldState('pension_exp', $(this).val(), 'future_date');
    });

    // watch for changes:
    $form.find('[name=medicare_no]').on('change', function(){
        setMedicareRequired('medicare_ref', $(this).val(), '');
        setMedicareRequired('medicare_exp', $(this).val(), 'future_date');
    });

    $form.find('[name=dva_type]').on('change', function(){
        setFieldState('dva_no', $(this).val(), 'dva');
    });

    function setFieldState( name, type, validators ){
        var show = type+'' !== '0';
        var $field = $form.find('[name='+name+']');

        $field.closest('[class^=col]').toggle(show);

        var conditionalValidators = (show) ? validators : '';
        // dva validation is not being applied/removed in here, i think
        $('#patient-form').find('[name='+name+']').data('validators', conditionalValidators);

        // if it's visible, it's required
        $field.attr('required', show);

        // if not shown, nuke the value
        if(!show) {
            $field.val('');
        }
    }

    function setMedicareRequired( name, set, validators ){
        var require = set !== '';
        var $field = $form.find('[name='+name+']');

        // if it's visible, it's required
        $field.attr('required', require);

        // if not shown, nuke the value
        if(!require) {
            $field.val('');
        }
    }
}

function displayRequireLongApptMessage() {
    scroll_to_top();
    GlobalMessages.warn('The clinic requires that new patients start with a long appointment.');
    if(root.user.isLongAppt() === false) {
        var $apptDuration = $('.appt-length-select');
        throb( $apptDuration );
        $apptDuration.find('.appt-length-select__long').focus();
        preventThrob = true;
    }
}

function confirmNewOrExistingPatientMessage() {
    scroll_to_top();
    GlobalMessages.warn('Are you booking for a new or existing patient?');
    throb($('.new-user-prelude'));
}
