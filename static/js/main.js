
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
        xhr.setRequestHeader('X-CSRFToken', token);
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
	
	$.fn.serializeObject = function()    
	{    
	   var o = {};    
	   var a = this.serializeArray();    
	   $.each(a, function() {    
	       if (o[this.name]) {    
	           if (!o[this.name].push) {    
	               o[this.name] = [o[this.name]];    
	           }    
	           o[this.name].push(this.value || '');    
	       } else {    
	           o[this.name] = this.value || '';    
	       }    
	   });    
	   return o;    
	};
	
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
    // note: clinic_map is set twice, because clinics() is initially and empty array, then is updated with clinics
    // Todo: implement promises.
    this.clinic_map = ko.computed(function () {
        var map = {};
        _.each(this.clinics(), function (clinic) {
            map[clinic.id] = clinic;
            // set hasLocation to false if the clinic's location is default 0,0
            // this is used to determine whether bookings at this clinic should trigger selfArrive functionality
            map[clinic.id].hasLocation = (clinic.latitude != 0 && clinic.longitude != 0) && config.selfArrive;
        });
        return map;
    }, this);

    this.activateSelfArrive = ko.computed(function(){
        // go through bookings and return true if we find any with hasLocation
        return (_.find(self.user.bookings(), function(booking){
            return (this.clinic_map()[booking.clinic].hasLocation === true);
        }, self));
    });

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
            url: 'api/v1/doctor/',
            type: 'GET',
            data: {'clinic': self.selectedClinic()}
        })
            .then(function (response) {
                self.doctors(response.objects);
            })
            .fail(function (jqXHR) {
                console.error('Doctor requeset failed', jqXHR);
            });
    };
    this.selectedClinic.subscribe(function (newValue) {
        this.fetchDoctorData();
    }, this);

    this.currentClinic.subscribe(function (newValue) {
        var clinic = newValue;
        $(document).attr('title', clinic.display_name);

        // set the feature toggles here because this subscription updates before selectedClinic.subscribe.. wtf
        setFeatureToggles(_.findWhere(self.clinics(), { id: clinic.id }));

        // set the default appointment type
        // console.warn('newValue', newValue);
        if (toggles().has_appointment_types) {
            var defaultApptType = _.findWhere(clinic.appointment_type, { is_preselected: true });
            self.user.appointmentType(defaultApptType.id);
        }
    }, this);

    this.fetchClinicData = function () {
        return $.ajax({
            url: 'api/v1/clinic/',
            type: 'GET'
        })
        .then(function(response) {
            self.clinics(_.sortBy(response.objects, 'order'));
            if(self.selectedClinic() === undefined) { self.selectedClinic(self.clinics()[0].id); }
        })
        .fail(function(jqXHR) {
            console.error('Clinic request failed', jqXHR);
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
                    temporarySubscriptions.selfArriveAuth = root.user.isAuthenticated.subscribe( function (newValue) {
                        if(newValue === true){
                            self.setCurrentView('appointments');
                        }
                    });
                }
            }]
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

    // Collapse the drop-down menu everytime the currentView changes
    this.currentView.subscribe(function () {
        $('.navbar-collapse.in').collapse('hide');
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
        container: 'body',
        html: true,
        animated: 'fade',
        show: true
    });

    $('[data-toggle="tooltip"]').tooltip();

    // Because ie9
    placeholder_ie9();

    this.fetchClinicData();

    this.user.fetchDetails()
        .then(function () {
            self.sam.run();
        });
};




//============================================================
// Feature Toggle helpers
//============================================================

var toggles = ko.observable({});

// Populate a simple lookup array for use in ko-templates,
// because KO doesn't seem to permit function parameters in if statements
// eg: featureEnabled('has_long_appointment') throws an error
function setFeatureToggles(clinic) {
    var clinicToggles = _.reduce(_.keys(clinic), function(memo, toggle) {;
        if (/^has_/.test(toggle)) {
            memo[toggle] = clinic[toggle];
        }
        return memo;
    }, {});

    // if we don't have any appt types, then disable this flag
    if (clinicToggles.has_appointment_types && clinic.appointment_type.length === 0) {
        clinicToggles.has_appointment_types = false;
    }

    // long_appointments_new and appointment_types rely upon has_long_appointments_new,
    // coerce has_long_appointments if either is on
    if (clinicToggles.has_long_appointments_new || clinicToggles.has_appointment_types) {
        clinicToggles['has_long_appointments'] = true;
    }

    toggles(clinicToggles);
}

// we set templates when they're required so we can
// fallback to a loading template if data is not ready
function getFeatureTemplate(feature, templateOn, templateOff) {
    if (!root || !root.currentClinic()) return 'loadingTmpl';

    return (root.currentClinic()[feature])
        ? templateOn
        : templateOff;
}


// Go!
var root = new ViewModel();
ko.applyBindings(root);
