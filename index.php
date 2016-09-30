<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title></title>

    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
    <link rel="shortcut icon" href="static/images/favicon.ico" />
    <link rel="stylesheet" type="text/css" href="static/css/styles.css" />
    <script src="static/js/vendor/modernizr.js@12-06-2016"></script>

    <!--[if lt IE 9]>
        <script src="/static/js/vendor/respond.min.js?12-06-2016"></script>
    <![endif]-->
    <script src="static/js/polyfills.min.js@12-06-2016"></script>
    

</head>

<body class="theme-default eastbound loading" data-bind="css: {loading: loading()}">

    <header role="banner" class="container" id="mobileapp_header">
        <nav>
            <a href="https://healthsite-eastbound.commoncode.com.au/mobileapphomelink" class="btn btn-sm btn-primary">
                <div class="linkText">Home</div>
            </a>
            <h1 id="logotype" data-bind="text: currentClinic() ? currentClinic().display_name : ''">Eastbound Medical Clinic</h1>
        </nav>
    </header>

    <nav class="navbar navbar-default" role="navigation" data-bind="css: {'logged-in': user.isAuthenticated()}">
        <div class="container">

            <div class="navbar-header">
                <!-- ko if: user.isAuthenticated() -->
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar__auth--logged-in">
                    <span class="sr-only">Toggle navigation</span>
                    My Account
                </button>
                <!-- /ko -->

                <a href="#booking" class="navbar-brand" data-bind="css: { 'current-view': currentView() == 'calendar' }">
                    Book <span class="hidden-smallish">Appointments</span>
                </a>
            </div>

            <!-- ko ifnot: user.isAuthenticated() -->
            <nav class="navbar-right navbar__auth--logged-out">
                <ul class="nav navbar-nav" role="menu">
                    <li><a data-bind="click: $root.user.showRegister">Register</a></li>
                    <li><a data-bind="click: $root.user.showLogin">Log In</a></li>
                </ul>
            </nav>
            <!-- /ko -->

            <!-- ko if: user.isAuthenticated() -->
            <nav class="collapse navbar-collapse navbar-right navbar__auth--logged-in">
                <ul class="nav navbar-nav" role="menu">
                    <li><a href="#appointments" data-bind="css: { 'current-view': currentView() == 'appointments' }">My Appointments</a></li>
                    <li><a href="#account" data-bind="css: { 'current-view': currentView() == 'account' }">My Account</a></li>
                    <li><a data-bind="click: user.logout">Log out</a></li>
                </ul>
            </nav>
            <!-- /ko -->

        </div><!-- /.container -->
    </nav>

    <div class="container content__main">
        <!--[if lt IE 9]>
        <div class="alert alert-danger alert-dismissible">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
            <div>This site is optimised for modern browsers; please <a href="http://browsehappy.com/">upgrade your browser</a>.</div>
        </div>
        <![endif]-->

        <div class="global-messages"></div>

        <!-- ko with: currentViewScreen -->
        <div data-bind="template: { name: tmpl, afterRender: onRender }"></div>
        <!-- /ko -->

    </div><!-- /.container -->

    <div id="loading"><img src="static/images/loading.gif" alt="loading..." /></div>
    <script id="loadingTmpl" type="text/html">
        <div id="loading--portable"><img src="static/images/loading.gif" alt="loading..." /></div>
    </script>

    <footer id="footer">
        <div class="container">
            <a href="#" class="powered-by" target="_blank">
                <span class="tagline"><span class="healthsite-logo">Health Site</span></span>
            </a>
        </div>
    </footer>

    
<div class="modal fade" id="loginregister" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">

            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-action="cancel">&times;</button>

            <div class="modal-body">

                <!-- Nav tabs -->
                <ul class="nav nav-tabs" role="tablist">
                    <li class="active">
                        <span>Already have an account?</span>
                        <a href="#login" role="tab" data-bind="click: user.showLogin">Login</a>
                    </li>
                    <li>
                        <span>Don't have an account?</span>
                        <a href="#register" role="tab" data-bind="click: user.showRegister">Register</a>
                    </li>
                </ul>

                <!-- Tab panes -->
                <div class="tab-content">

                    <div class="tab-pane active" id="login">
                        <h2> Login </h2>

                        <div class="login-alert alert alert-danger hide"></div>

                        <form id="loginForm" class="form-horizontal" role="form">
                            <div class="form-group">
                                <label for="email" class="control-label sr-only">Email</label>
                                <div class="col-sm-16">
                                    <input name="email" data-bind="value: user.email" type="email" class="form-control" id="email" placeholder="Email"
                                        data-validators="email"
                                        required>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="password" class="control-label sr-only">Password</label>
                                <div class="col-sm-16">
                                    <input name="password" type="password" class="form-control" id="password" placeholder="Password" required>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-xs-16">
                                    <button type="button" class="btn btn-primary" data-bind="event: {click: user.login.bind(user), touchend: user.login.bind(user)}" data-action="submit">Sign in</button>
                                    <p class="forgot-password__container"><a href="#forgot-password">Forgot Password?</a></p>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="tab-pane" id="register">
                        <h2> Register </h2>

                        <div class="register-alert alert alert-danger hide"></div>
                        <form id="registerForm" class="form-horizontal form-horizontal--left" role="form">
                            <div data-bind="template: { name: getFeatureTemplate('has_extended_registration', 'registerFormExtendedRego', 'registerFormDefault') }"></div>
                        </form>

                    </div>
                </div>

            </div><!-- /.modal-body -->
        </div>
    </div>
</div>

    <div class="modal" id="confirm" data-bind="with: $root.screens.calendar">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">

            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-action="cancel">&times;</button>
                <h3 class="modal-title"> Appointment Details </h3>
            </div>

            <div class="modal-body">
                <div class="row">

                    <div class="doctor col-xs-16 col-md-8 col-lg-7 col-lg-offset-1">
                        <div class="info">
                            <img class="pull-left" data-bind="attr: { src: selectedDoctor() && selectedDoctor().picture }" alt="">

                            <h4 data-bind="text: selectedDoctor() && selectedDoctor().name"></h4>
                            
                        </div>

                        <!-- ko if: selectedDoctor() && selectedDoctor().notice -->
                        <p>

                            <!-- ko text: selectedDoctor() && selectedDoctor().notice -->
                            <!-- /ko -->
                        </p>
                        <!-- /ko -->

                        <hr>

                        <div class="info">
                            <span data-bind="text: $root.currentClinic() && $root.currentClinic().display_name"></span><br>
                            <span data-bind="text: $root.currentClinic() && $root.currentClinic().address"></span><br>
                            <span data-bind="text: $root.currentClinic() && $root.currentClinic().suburb"></span><br>
                            <span><i class="fa fa-phone"></i><span data-bind="text: $root.currentClinic() && $root.currentClinic().phone"></span></span>
                        </div>

                    </div>

                    <div class="details col-xs-16 col-md-8 col-lg-7">
                        <div class="well popover--parent">

                            <p class="date">
                                Date:
                                <strong data-bind="text: selectedDate"></strong>
                            </p>

                            <p class="time">
                                Time:
                                <strong data-bind="text: selectedTime"></strong>
                            </p>

                            <label for="patient" class="control-label">
                                Booking for:
                            </label>
                            <select disabled class="form-control" name="patient" id="patient" data-bind="foreach:$root.user.patients">
                                <option data-bind="value: id, text: first_name + ' ' + last_name"></option>
                            </select>
                            <span class="help-block">Select the patient who will attend this appointment</span>
                        </div>
                    </div>

                    <div class="call-to-action col-md-16 col-lg-14 col-lg-offset-1" data-bind="visible: !bookingConfirmed()">
                        <div class="row">
                            <div class="col-xs-16 col-sm-12 col-sm-push-4">
                                <a class="btn btn-confirm" data-bind="click: makeBooking" data-action="submit">Confirm Appointment</a>
                            </div>
                            <div class="col-xs-16 col-sm-4 col-sm-pull-12">
                                <a class="btn btn-back" data-bind="click: cancelConfirm" data-action="cancel">Back</a>
                            </div>
                        </div>
                    </div>

                    <div class="booking-confirmation col-md-16 col-lg-14 col-lg-offset-1" data-bind="visible: bookingConfirmed()">

                        <div class="row">
                            <div class="col-xs-16">
                                <p class="alert alert-success">Your appointment has been submitted</p>
                                <p>You will receive an email shortly with your appointment confirmation.</p>
                            </div>

                            <div class="col-xs-16 col-md-8 my-appointments-link">
                                <a class="btn btn-info" href="#appointments">My Appointments</a>
                            </div>

                            <div class="col-xs-16 col-md-8 my-account-link">
                                <a class="btn btn-info" href="#account">My Account</a>
                            </div>

                            <div class="col-xs-16 book-another-link">
                                <a data-bind="click: clearBooking">Book another appointment</a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>

    <div class="modal" id="user-form" data-bind="with: $root.user">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-action="cancel">&times;</button>
                <h2 class="modal-title">Edit My Details</h2>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" role="form" id="user_form">

                    <div class="form-group">
                        <label for="name" class="col-xs-16 col-sm-7 col-md-4 control-label">Your Name</label>
                        <div class="col-sm-9 col-md-6">
                            <input type="text" class="form-control" name="name" id="name" placeholder="Your Name" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="phone" class="col-xs-16 col-sm-7 col-md-4 control-label">Mobile</label>
                        <div class="col-sm-9 col-md-6">
                            <input type="phone" class="form-control" name="phone" id="phone" placeholder="Phone" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="email" class="col-xs-16 col-sm-7 col-md-4 control-label">E-mail</label>
                        <div class="col-sm-9 col-md-6">
                            <input type="email" class="form-control" name="email" id="email" placeholder="E-mail" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-sm-9 col-sm-push-7 col-md-push-4 col-md-6">
                            <button type="button" class="btn btn-primary pull-right" data-bind="click: saveUser" data-action="submit">Save</button>
                        </div>
                        <div class="spacer-xs"></div>
                        <div class="col-sm-4 col-sm-pull-6 col-md-pull-6 col-md-4">
                            <button type="button" class="btn btn-cancel pull-left" data-bind="click: editUserCancel" data-action="cancel">Cancel</button>
                    </div>
                </div>
                </form>
            </div>
        </div>
    </div>
</div>

    
<div class="modal" id="patient-form">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-action="cancel">&times;</button>
                <h2 class="modal-title">Edit Patient</h2>
            </div>

            <div class="modal-body">
                <form class="form-horizontal" role="form" id="patient_form">
                    <div data-bind="template: { name: getFeatureTemplate('has_extended_registration', 'editPatientFormExtendedRego', 'editPatientFormDefault'), data: root.user }"></div>
                </form>
            </div>
        </div>
    </div>
</div>

    <div class="modal fade" id="forgot-password" data-bind="with: $root.screens.reset_password">
    <div class="modal-dialog">
        <div class="modal-content">

            <!-- <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> -->

            <div class="modal-body">

                <h4 class="forgot-password__header">Password Reset</h4>

                <form class="form-horizontal" role="form" id="forgot-password-form">

                    <div class="form-group">
                        <label for="email" class="col-xs-16 col-sm-7 col-md-4 control-label sr-only">Email</label>
                        <div class="col-sm-16">
                            <input type="email" name="email" id="forgot-email" class="form-control" placeholder="Your email" required>
                        </div>
                    </div>

                    <div class="before">
                        <div class="form-group">
                            <div class="col-sm-12 col-sm-push-4">
                                <button type="button" class="btn btn-primary" data-bind="click: forgotPassword">Send password reset link</button>
                            </div>
                            <div class="spacer-xs"></div>
                            <div class="col-sm-4 col-sm-pull-12">
                                <a href="#booking" class="btn btn-cancel">Cancel</a>
                            </div>
                        </div>
                    </div>

                    <div class="after" style="display: none;">
                        <p> Thank You.  An email has been sent with instructions on how to reset your password. </p>
                    </div>
                </form>
            </div>

        </div>
    </div>
</div>


   <script id="calendarTmpl" type="text/html">
        

<main role="main" class="row" id="main_content">

    <section class="booking-info col-sm-16">
        <div class="wrap">
            <h3>My Appointment - select:</h3>

            <div class="new-user-prelude">
                <!-- ko if: toggles().has_long_appointment_new -->
                <!-- ko ifnot: root.user.declaredNewPatient() -->
                <p class="alert alert-info text-left">
                    <!-- If patient is not logged in (otherwise we know they're not new) -->
                    I am booking for a patient who is <strong>new</strong> at this clinic:

                    <a class="btn btn-default" data-bind="click: root.user.setNewPatientTrue">Yes</a>
                    <a class="btn btn-default" data-bind="click: root.user.setNewPatientFalse">No</a>
                </p>
                <!-- /ko -->
                <!-- /ko -->

                <!-- ko if: root.user.declaredNewPatient() -->
                <p class="new-patient-status text-left">
                    <!-- ko if: root.user.isNewPatient() -->I'm booking an appointment for a <strong>new</strong> patient. <!-- /ko -->
                    <!-- ko ifnot: root.user.isNewPatient() -->I'm booking an appointment for an <strong>existing</strong> patient. <!-- /ko -->
                    <a class="new-patient-status__change" data-bind="click: root.user.toggleNewPatient">Change</a>
                </p>
                <!-- /ko -->
            </div>

            <div class="appt-select-grid">
                <div class="date col-xs-5">
                    <button type="button" name="date" class="btn" data-bind="
                        text: selectedDate() ? displayDate() : 'Date',
                        css: selectedDate() ? 'btn-success' : 'btn-primary',
                        click: scroll_to_from_booking.bind(this, '#date')
                    "></button>
                </div>

                <div class="time col-xs-5">
                    <button type="button" name="time" class="btn" data-bind="
                        text: selectedTime() ? selectedTime() : 'Time',
                        css: selectedTime() ? 'btn-success' : 'btn-primary',
                        click: scroll_to_from_booking.bind(this, '.times')
                    "></button>
                </div>

                <div class="doctor col-xs-6">
                    <button type="button" name="doctor" class="btn btn-primary" data-bind="
                        text: selectedPractitionerTitle() ? selectedPractitionerTitle() : 'Practitioner',
                        css: selectedDoctor() ? 'btn-success' : 'btn-primary',
                        click: scroll_to_from_booking.bind(this, '#doctor')
                    "></button>
                </div>

                <div class="first-available col-xs-8 col-sm-5">
                    <button type="button" class="btn btn-primary select-first" data-bind="click: selectFirstAvailable">First available</button>
                </div>

                <div class="submit col-xs-8 col-sm-6 col-sm-offset-5">
                    <button  class="btn btn-primary" name="confirm" data-bind="
                        click: confirmBooking,
                        disable: !bookingComplete()
                    ">Next &rarr;</button>
                </div>

                <div class="first-available-callout">
                    <span>Get the first available appointment now!</span>
                </div>
            </div>

            <!-- ko if: toggles().has_appointment_types -->
            <div class="alert alert-info appt-types">
                Appointment type:
                <select name="appointment_type" class="form-control appt-types-select"  id="gender"
                    data-bind="
                        value: $root.user.appointmentType,
                        disable: $root.user.disableApptSelect
                    "
                >
                    <!-- ko foreach: $root.currentClinic().appointment_type -->
                    <option data-bind="text: name, value: id"></option>
                    <!-- /ko -->
                </select>
            </div>
            <!-- /ko -->

            <!-- ko if: !toggles().has_appointment_types -->
            <!-- ko if: toggles().has_long_appointment -->
            <div class="col-xs-16 alert alert-info appt-length-select text-right">
                Appointment duration:
                <div class="btn-group" role="group" aria-label="...">
                    <button type="button" class="btn btn-default appt-length-select__short" data-bind="css: {active: !root.user.isLongAppt()}, click: root.user.setShortAppt">Standard</button>
                    <button type="button" class="btn btn-default appt-length-select__long" data-bind="css: {active: root.user.isLongAppt()}, click: root.user.setLongAppt">Long</button>
                </div>
            </div>
            <!-- /ko -->
            <!-- /ko -->

            <a class="clear-appointments" name="confirm" data-bind="
                click: clearBooking
            "><i class="fa fa-times-circle-o"></i> Clear</a>
        </div>
    </section>

    <div class="left-column col-md-10 col-lg-11">
        <div id="date" class="panel panel-default calendar">
            <div class="panel-heading">
                <h3 class="panel-title">Select date</h3>
            </div>

            <div class="panel-body">
                <div class="booking-calendar"><table>
    <caption>
         <span class="month-1">September</span> / <span class="month-2">October</span> 
    </caption>

    <thead>
        <tr>
            
            <th> Mon </th>
            
            <th> Tue </th>
            
            <th> Wed </th>
            
            <th> Thu </th>
            
            <th> Fri </th>
            
            <th> Sat </th>
            
            <th> Sun </th>
            
        </tr>
    </thead>

    <tbody>
        
            
            <tr>
            
                <td class="padday month-1" data-date="26-09-2016" data-bind="
                    click: setSelectedDate,
                    css: {
                        available: _.contains(filteredDates(), '26-09-2016'),
                        selected: selectedDate() == '26-09-2016'
                    }
                ">26</td>
            
        
            
                <td class="padday month-1" data-date="27-09-2016" data-bind="
                    click: setSelectedDate,
                    css: {
                        available: _.contains(filteredDates(), '27-09-2016'),
                        selected: selectedDate() == '27-09-2016'
                    }
                ">27</td>
            
        
            
                <td class="padday month-1" data-date="28-09-2016" data-bind="
                    click: setSelectedDate,
                    css: {
                        available: _.contains(filteredDates(), '28-09-2016'),
                        selected: selectedDate() == '28-09-2016'
                    }
                ">28</td>
            
        
            
                <td class="bookday month-1" data-date="29-09-2016" data-bind="
                    click: setSelectedDate,
                    css: {
                        available: _.contains(filteredDates(), '29-09-2016'),
                        selected: selectedDate() == '29-09-2016'
                    }
                ">29</td>
            
        
            
                <td class="bookday month-1" data-date="30-09-2016" data-bind="
                    click: setSelectedDate,
                    css: {
                        available: _.contains(filteredDates(), '30-09-2016'),
                        selected: selectedDate() == '30-09-2016'
                    }
                ">30</td>
            
        
    
        
            
                <td class="bookday month-2" data-date="01-10-2016" data-bind="
                    click: setSelectedDate,
                    css: {
                        available: _.contains(filteredDates(), '01-10-2016'),
                        selected: selectedDate() == '01-10-2016'
                    }
                ">1</td>
            
        
            
                <td class="bookday month-2" data-date="02-10-2016" data-bind="
                    click: setSelectedDate,
                    css: {
                        available: _.contains(filteredDates(), '02-10-2016'),
                        selected: selectedDate() == '02-10-2016'
                    }
                ">2</td>
            
            </tr>
            
        
            
            <tr>
            
                <td class="bookday month-2" data-date="03-10-2016" data-bind="
                    click: setSelectedDate,
                    css: {
                        available: _.contains(filteredDates(), '03-10-2016'),
                        selected: selectedDate() == '03-10-2016'
                    }
                ">3</td>
            
        
            
                <td class="bookday month-2" data-date="04-10-2016" data-bind="
                    click: setSelectedDate,
                    css: {
                        available: _.contains(filteredDates(), '04-10-2016'),
                        selected: selectedDate() == '04-10-2016'
                    }
                ">4</td>
            
        
            
                <td class="bookday month-2" data-date="05-10-2016" data-bind="
                    click: setSelectedDate,
                    css: {
                        available: _.contains(filteredDates(), '05-10-2016'),
                        selected: selectedDate() == '05-10-2016'
                    }
                ">5</td>
            
        
            
                <td class="bookday month-2" data-date="06-10-2016" data-bind="
                    click: setSelectedDate,
                    css: {
                        available: _.contains(filteredDates(), '06-10-2016'),
                        selected: selectedDate() == '06-10-2016'
                    }
                ">6</td>
            
        
            
                <td class="bookday month-2" data-date="07-10-2016" data-bind="
                    click: setSelectedDate,
                    css: {
                        available: _.contains(filteredDates(), '07-10-2016'),
                        selected: selectedDate() == '07-10-2016'
                    }
                ">7</td>
            
        
            
                <td class="bookday month-2" data-date="08-10-2016" data-bind="
                    click: setSelectedDate,
                    css: {
                        available: _.contains(filteredDates(), '08-10-2016'),
                        selected: selectedDate() == '08-10-2016'
                    }
                ">8</td>
            
        
            
                <td class="bookday month-2" data-date="09-10-2016" data-bind="
                    click: setSelectedDate,
                    css: {
                        available: _.contains(filteredDates(), '09-10-2016'),
                        selected: selectedDate() == '09-10-2016'
                    }
                ">9</td>
            
            </tr>
            
        
            
            <tr>
            
                <td class="bookday month-2" data-date="10-10-2016" data-bind="
                    click: setSelectedDate,
                    css: {
                        available: _.contains(filteredDates(), '10-10-2016'),
                        selected: selectedDate() == '10-10-2016'
                    }
                ">10</td>
            
        
            
                <td class="bookday month-2" data-date="11-10-2016" data-bind="
                    click: setSelectedDate,
                    css: {
                        available: _.contains(filteredDates(), '11-10-2016'),
                        selected: selectedDate() == '11-10-2016'
                    }
                ">11</td>
            
        
            
                <td class="bookday month-2" data-date="12-10-2016" data-bind="
                    click: setSelectedDate,
                    css: {
                        available: _.contains(filteredDates(), '12-10-2016'),
                        selected: selectedDate() == '12-10-2016'
                    }
                ">12</td>
            
        
            
                <td class="bookday month-2" data-date="13-10-2016" data-bind="
                    click: setSelectedDate,
                    css: {
                        available: _.contains(filteredDates(), '13-10-2016'),
                        selected: selectedDate() == '13-10-2016'
                    }
                ">13</td>
            
        
            
                <td class="bookday month-2" data-date="14-10-2016" data-bind="
                    click: setSelectedDate,
                    css: {
                        available: _.contains(filteredDates(), '14-10-2016'),
                        selected: selectedDate() == '14-10-2016'
                    }
                ">14</td>
            
        
            
                <td class="bookday month-2" data-date="15-10-2016" data-bind="
                    click: setSelectedDate,
                    css: {
                        available: _.contains(filteredDates(), '15-10-2016'),
                        selected: selectedDate() == '15-10-2016'
                    }
                ">15</td>
            
        
            
                <td class="bookday month-2" data-date="16-10-2016" data-bind="
                    click: setSelectedDate,
                    css: {
                        available: _.contains(filteredDates(), '16-10-2016'),
                        selected: selectedDate() == '16-10-2016'
                    }
                ">16</td>
            
            </tr>
            
        
    
    </tbody>
</table>
</div>

                <div class="row times" data-bind="visible: selectedDate">
                    <h4 class="times__header">Select time</h4>

                    <div id="time" class="times__grid" data-bind="foreach: filteredTimes">
                        <div><a data-bind="text: $data,
                            click: $parent.setSelectedTime,
                            css: { selected: $parent.selectedTime() == $data }
                            "></a></div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <div class="right-column col-md-6 col-lg-5">
        <div id="doctor" class="doctor-list panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title" data-bind="text: $root.screens.calendar.practitionerHeadingText()"></h3>
            </div>

            <ul data-bind="foreach: $root.doctors" class="list-group">
                <li class="list-group-item" data-bind="
                    click: $root.screens.calendar.setSelectedDoctor,
                    css: {
                        selected: $root.screens.calendar.selectedDoctorCode() == doctor_code,
                        available: _.contains($root.screens.calendar.filteredDoctors(), doctor_code),
                    }
                ">
                    <img alt="" data-bind="attr: { src: picture }">
                    <p data-bind="text: name, attr: { title: notice }"></p>
                </li>
            </ul>
        </div>
    </div>

</main>

    </script>
    <script id="accountTmpl" type="text/html">
        <div class="row account-view" data-bind="with: $root.user">
    <div class="col-sm-16">

        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="fa fa-user"></i> My Account</h3>
            </div>
            <div class="panel-body display-account">

                <div class="row">
                    <div class="col-sm-14 col-md-12 col-lg-10">

                        <h4 data-bind="text: name"></h4>

                        <div class="grouped__data-point">
                            <div class="col-sm-6 grouped__data-point__key">
                                <p>Mobile: </p>
                            </div>
                            <div class="col-sm-10 grouped__data-point__value">
                                <p data-bind="text: phone"></p>
                            </div>
                        </div>

                        <div class="grouped__data-point">
                            <div class="col-sm-6 grouped__data-point__key">
                                <p>Email: </p>
                            </div>
                            <div class="col-sm-10 grouped__data-point__value">
                                <p data-bind="text: email"></p>
                            </div>
                        </div>

                        <button type="button" class="btn btn-edit pull-right" data-bind="click: editUser">Edit</button>

                    </div>
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="fa fa-users"></i> My Patients</h3>
            </div>

            <div class="panel-body">
                <!-- ko foreach: patients -->
                <div class="row display-patient">
                    <div class="col-sm-14 col-md-12 col-lg-10">

                        <h4 data-bind="text: title + ' ' + first_name + ' ' + last_name"></h4>

                        <div class="grouped__data-point">
                            <div class="col-sm-6 grouped__data-point__key">
                                <p>Gender: </p>
                            </div>
                            <div class="col-sm-10 grouped__data-point__value">
                                <p data-bind="text: gender"></p>
                            </div>
                        </div>

                        <div class="grouped__data-point">
                            <div class="col-sm-6 grouped__data-point__key">
                                <p>Date of birth: </p>
                            </div>
                            <div class="col-sm-10 grouped__data-point__value">
                                <p data-bind="text: moment(dob).format('DD-MM-YYYY')"></p>
                            </div>
                        </div>

                        <div class="grouped__data-point">
                            <div class="col-sm-6 grouped__data-point__key">
                                <p>Email</p>
                            </div>
                            <div class="col-sm-10 grouped__data-point__value">
                                <p data-bind="text: email"></p>
                            </div>
                        </div>

                        <div class="grouped__data-point">
                            <div class="col-sm-6 grouped__data-point__key">
                                <p>Mobile</p>
                            </div>
                            <div class="col-sm-10 grouped__data-point__value">
                                <p data-bind="text: phone_mobile"></p>
                            </div>
                        </div>

                        <button type="button" class="btn btn-edit pull-right" data-bind="click: $parent.editPatient">Edit</button>

                    </div>
                </div>
                <!-- /ko -->

                <div class="row">
                    <div class="col-xs-16">
                        <hr>
                        <button type="button" class="btn btn-add" data-bind="click: addPatient">Add family member</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>

    </script>

    <script id="appointmentsTmpl" type="text/html">
        
<div class="appointments-view panel panel-default" data-bind="with: $root.user">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fa fa-user"/> My Appointments</h3>
    </div>

    <div class="panel-body">
        <div id="appointments" class="panel-group">

            <!-- ko if: !bookings().length -->
            <div class="no-bookings alert alert-warning">
                <p>You don't have any appointments booked yet</p>
                <a href="#booking" class="btn btn-primary">Book an appointment</a>
            </div>
            <!-- /ko -->

            <!-- ko if: bookings().length -->
            <!-- ko foreach: bookings -->
            <div class="appointment panel panel-info" data-bind="css: {'in-range': inRange, 'can-arrive': canArrive }">
                <div class="panel-heading">
                    <h4 class="panel-title">
                        <a class="collapsed"
                            data-toggle="collapse"
                            data-parent="#appointments"
                            data-bind="attr: {href: '#appointment-' + $index() }"
                            >
                            <strong data-bind="text: moment(date).format(DATE_FORMAT)"></strong> /
                            <!-- ko text: full_name --><!-- /ko -->
                            to see
                            <!-- ko text: $root.doctor_map()[doctor_code] && $root.doctor_map()[doctor_code].name --><!-- /ko -->
                            <span class="label label-info" data-bind="text: action"></span>
                        </a>
                    </h4>
                </div>

                <div class="panel-collapse collapse"
                    data-bind="
                        attr: { id: 'appointment-' + $index() },
                        css: {in: isWithinCheckinWindow() && isValidBooking() }"
                    >
                    <!-- ko if: isValidBooking() && isWithinCheckinWindow() -->
                    <div class="arrive">
                        <!-- ko if: !arrived -->
                        <h4>
                            <span data-bind="text: timeUntilBookingText"></span>

                            <!-- ko if: inRange() -->
                            <button class="btn btn-primary" data-bind="click:root.user.arrive">Check-in now</button>
                            <!-- /ko -->
                        </h4>
                        <!-- /ko -->

                        <!-- ko if: !inRange() && !arrived -->
                        <p class="text-center">
                            <em>When you are within <span data-bind="text: root.screens.appointments.minimumRange"></span> of the clinic, you'll be able to check-in from this screen.</em>
                            <span
                                class="geolocation-indicator label label-default"
                                data-bind="css: {'geolocation-indicator--underway': root.user.geolocating }"
                                >
                                updating location&tdot;
                            </span>
                        </p>
                        <!-- /ko -->

                        <!-- ko if: arrived -->
                        <p class="alert alert-success text-center">
                            Thanks, We've noted your arrival, please proceed to the waiting area.
                        </p>
                        <!-- /ko -->

                        <!-- ko if: arrivalError() -->
                        <p class="alert alert-danger text-center">
                            Sorry, there was a problem checking in, please try again or report to reception.
                        </p>
                        <!-- /ko -->

                        <!-- ko if: !arrived && root.screens.appointments.locationError() == 1 -->
                        <p class="alert alert-danger text-center">
                            Sorry, we need your permission to locate you. <br>
                            <strong>Please allow Healthsite to use your location, then refresh the page.  </strong> <br>
                            Help for <a href="https://support.google.com/chrome/answer/142065?hl=en" target="_blank" alt="Geolocation Help">Chrome</a> (other browsers are similar).
                        </p>
                        <!-- /ko -->

                        <!-- ko if: !arrived && root.screens.appointments.locationError() == 2 -->
                        <p class="alert alert-danger text-center">
                            There was a problem locating you. Please refer to help for your browser or device.<br>
                            Here is an example for <a href="https://support.google.com/chrome/answer/142065?hl=en" target="_blank" alt="Geolocation Help">Chrome</a>.
                        </p>
                        <!-- /ko -->

                        <!-- ko if: !arrived && root.screens.appointments.locationError() == 3 -->
                        <p class="alert alert-danger text-center">
                            The location update timed out. We'll keep trying to locate you. <br>
                            <strong>Are you still connected to the internet? Please try to refresh the page.</strong>
                        </p>
                        <!-- /ko -->

                        <!-- ko if: !arrived && root.screens.appointments.locationError() == 4 -->
                        <p class="alert alert-danger text-center">
                            You need to allow Healthsite to access your location to be able to checkin. <br>
                            <strong>Please select 'Allow' in the dialog at the top of this window. </strong> <br>
                            Here is an example for <a href="https://support.google.com/chrome/answer/142065?hl=en" target="_blank" alt="Geolocation Help">Chrome</a>.
                        </p>
                        <!-- /ko -->

                    </div>
                    <!-- /ko -->

                    <div class="appointment-details">

                        <div class="doctor col-md-8 col-lg-7 col-lg-push-1">
                            <div class="info">
                                <img class="pull-left"
                                    src="static/images/doctor-avatar.png"
                                    data-bind="attr: { src: $root.doctor_map()[doctor_code] && $root.doctor_map()[doctor_code].picture }" alt=""
                                    >
                                <h4 data-bind="text: $root.doctor_map()[doctor_code] && $root.doctor_map()[doctor_code].name"></h4>
                            </div>
                        </div>

                        <div class="details col-md-8 col-lg-7 col-lg-push-1">
                            <div class="well">

                                <p class="booking__date">
                                    Date:
                                    <strong data-bind="text: moment(date).format(DATE_FORMAT)"></strong>
                                </p>

                                <p class="booking__time">
                                    Time:
                                    <strong data-bind="text: moment(date).format(TIME_FORMAT)"></strong>
                                </p>

                                <p class="booking__clinic">
                                    Clinic:
                                    <strong data-bind="text: clinicName"></strong>
                                </p>

                                <p class="booking__patient">
                                    Booking for:
                                    <strong data-bind="text: full_name"></strong>
                                </p>

                                <p class="booking__status">
                                    Status: <strong data-bind="text: action"></strong>
                                </p>
                                <!-- ko if: action_type == 'create' || action_type == 'booked' -->
                                <p class="booking__action">
                                    <button type="button" class="btn btn-cancel" data-bind="click: $parent.cancelBooking">Cancel Appointment</button>
                                </p>
                                <!-- /ko -->
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <!-- /ko -->
            <!-- /ko -->

        </div>
    </div>
</div>

    </script>

    <script id="resetPasswordTmpl" type="text/html">
        <div id="reset-password" class="row">

    <div class="before col-sm-14 col-sm-offset-1 col-md-12 col-md-offset-2 col-lg-10 col-lg-offset-3">

        <h2>Password Reset</h2>

        <div class="show-form">

            <form class="form-horizontal" role="form" id="reset_password">

                <div class="form-group">
                    <label for="password" class="control-label sr-only">New Password</label>
                    <div class="col-sm-16">
                        <input type="password" class="form-control" name="new_password1" id="password" placeholder="New Password" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="password2" class="control-label sr-only">New Password Again</label>
                    <div class="col-sm-16">
                        <input type="password" class="form-control" name="new_password2" id="password2" placeholder="New Password Again" required>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-12 col-sm-push-4">
                        <button type="button" class="btn btn-primary" data-bind="click: resetPassword">Reset Password</button>
                    </div>
                    <div class="spacer-xs"></div>
                    <div class="col-sm-4 col-sm-pull-12">
                        <a href="#booking" class="btn btn-cancel">Cancel</a>
                    </div>
                </div>

            </form>
        </div>

        <div class="well light success">
            <div class="alert alert-success" role="alert">
                Your Password has been reset.
            </div>
            <a class="btn btn-primary" data-bind="click: $root.user.showLogin">Log In</a>
        </div>

        <div class="well light bad-token">
            <div class="alert alert-danger" role="alert">
                This token is invalid, or has expired.
            </div>
            <div>
                Please <a href="#forgot-password">request a new password reset token</a>.
            </div>
        </div>

    </div>

</div>

    </script>

    <script id="registerFormDefault" type="text/html">
        

<div class="form-group">
    <div class="col-sm-6 col-md-4">
        <label for="title" class="control-label sr-only">Title</label>
        <select name="title" class="form-control" id="title" data-bind="value: root.user.title">
            <option value="">Title</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Ms">Ms</option>
            <option value="Miss">Miss</option>
            <option value="Ma">Master</option>
            <option value="Dr">Dr</option>
        </select>
    </div>
    <div class="spacer-xs"></div>

    <label for="first_name" class="control-label sr-only">First name</label>
    <div class="col-sm-10 col-md-6">
        <input name="first_name" type="text" class="form-control" id="first_name" placeholder="First name" required>
    </div>
    <div class="spacer-sm"></div>

    <label for="last_name" class="control-label sr-only">Last name</label>
    <div class="col-sm-16 col-md-6">
        <input name="last_name" type="text" class="form-control" id="last_name" placeholder="Last name" required>
    </div>
</div>

<div class="form-group">

    <div class="col-sm-8">
        <label for="gender" class="control-label sr-only">Gender</label>
        <select name="gender" class="form-control"  id="gender" data-bind="value: root.user.gender">
            <option value="">Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
        </select>
    </div>
    <div class="spacer-xs"></div>

    <div class="col-sm-8">
        <label for="dob" class="control-label sr-only">Date of birth</label>
        <input name="dob" type="text" class="form-control" id="dob" placeholder="Birthdate (dd/mm/yyyy)"
            data-datefmt="DD/MM/YYYY"
            data-validators="past_date, earliest_date_of_birth"
            required>
    </div>
</div>

<div class="form-group">
    <label for="phone" class="control-label sr-only">Mobile Phone</label>
    <div class="col-sm-16">
        <input name="phone_mobile" type="text" class="form-control" id="phone" placeholder="Mobile Phone"
            data-validators="mobile_number"
            required>
    </div>
</div>

<div class="form-group">
    <label for="medicare_no" class="control-label sr-only">Medicare Number</label>
    <div class="col-sm-8 popover__parent">
        <input name="medicare_no" type="text" class="form-control" id="medicare_no" placeholder="Medicare Number"
            data-validators="medicare">

        <a class="popover__button"
            rel="popover"
            data-toggle="popover"
            data-trigger="focus"
            title="Medicare Number"
            data-content="
                1: The main 10 digit number
                <img src='/static/images/healthsite-medicare-explanation.jpg'>"
            data-placement="bottom"
            tabindex="-1">
            <i class="fa fa-question-circle"></i>
        </a>
    </div>
    <div class="spacer-xs"></div>

    <label for="medicare_ref" class="control-label sr-only">Medicare Reference #</label>
    <div class="col-sm-8 popover__parent">
        <input name="medicare_ref" type="text" class="form-control" id="medicare_ref" placeholder="Medicare Reference #"
            data-validators="regex"
            data-validator-regex="^\d$"
            data-message-regex="Must be a single digit.">

        <a class="popover__button"
            rel="popover"
            data-toggle="popover"
            data-trigger="focus"
            title="Medicare Reference Number"
            data-content="
                2: Found to the left of the name(s)
                <img src='/static/images/healthsite-medicare-explanation.jpg'>"
            data-placement="auto right"
            tabindex="-1">
            <i class="fa fa-question-circle"></i>
        </a>
    </div>
</div>

<div class="form-group">
    <label for="email" class="control-label sr-only">Email</label>
    <div class="col-sm-16">
        <input name="email" type="email" class="form-control" id="email" placeholder="Email"
            data-validators="email"
            required>
    </div>
</div>

<div class="form-group">
    <label for="email1" class="control-label sr-only">Email (Verify)</label>
    <div class="col-sm-16">
        <input name="email1" type="email" class="form-control" id="email1" placeholder="Confirm Email"
            data-validators="match"
            data-validator-match="email"
            required>
    </div>
</div>

<div class="form-group">
    <label for="password" class="control-label sr-only">Password</label>
    <div class="col-sm-16">
        <input name="password" type="password" class="form-control" id="password" placeholder="Password"
            required>
    </div>
</div>
<div class="row">
    <div class="col-xs-16">
        
        <button data-bind="click: root.user.register.bind(root.user)" type="submit" class="btn btn-primary" data-action="submit">Create account</button>
    </div>
</div>

    </script>

    <script id="registerFormExtendedRego" type="text/html">
        

<div class="wizard" id="registerWizard" data-initialize="wizard">
    <div class="steps-wrapper">
        <ul class="steps">
            <li data-step="1"><span class="badge">1</span><span class="title">About you</span></li>
            <li data-step="2"><span class="badge">2</span><span class="title">Your Details</span></li>
            <li data-step="3"><span class="badge">3</span><span class="title">Concession Cards</span></li>
            <li data-step="4"><span class="badge">4</span><span class="title">Account</span></li>
            <li data-step="5"><span class="badge">5</span><span class="title">Confirm</span></li>
        </ul>
    </div>

    <div class="panel panel-default">
        <div class="step-content col-sm-12">

            
            <div class="step-pane active" data-step="1">

                <h4>Tell us about yourself</h4>

                <div class="form-group">
                    <div class="col-sm-16">
                        <p>My Name:</p>
                    </div>

                    <div class="col-sm-6 col-md-4">
                        <label for="title" class="control-label sr-only">Title</label>
                        <select class="form-control" name="title" id="title" data-bind="value: user.title">
                            <option value="">Title</option>
                            <option value="Mr">Mr</option>
                            <option value="Mrs">Mrs</option>
                            <option value="Ms">Ms</option>
                            <option value="Miss">Miss</option>
                            <option value="Ma">Master</option>
                            <option value="Dr">Dr</option>
                        </select>
                    </div>

                    <div class="col-sm-10 col-md-6">
                        <label for="first_name" class="control-label sr-only">First name</label>
                        <input type="text" class="form-control" id="firstname" placeholder="First name" name="first_name" required>
                    </div>

                    <div class="col-sm-16 col-md-6">
                        <label for="last_name" class="control-label sr-only">Last name</label>
                        <input type="text" class="form-control" id="last_name" placeholder="Last name" name="last_name" required>
                    </div>

                    <div class="col-sm-8">
                        <label for="gender" class="control-label sr-only">Gender</label>
                        <select class="form-control" name="gender" id="gender" data-bind="value: user.gender">
                            <option value="">Gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>

                    <div class="col-sm-8">
                        <label for="dob" class="control-label sr-only">Date of birth</label>
                        <input name="dob" type="text" class="form-control" id="dob"
                            data-datefmt="DD/MM/YYYY"
                            data-validators="past_date, earliest_date_of_birth"
                            placeholder="Birthdate (DD/MM/YYYY)"
                            required>
                        <p class="help-block" style="display: none;">Please enter the date in Australian standard format</p>
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-sm-8 col-md-6">
                        <label for="medicare_no" class="control-label">Medicare Number</label>

                        
                        <a class="popover__button"
                            rel="popover"
                            data-toggle="popover"
                            data-trigger="focus"
                            title="Medicare Number"
                            data-content="
                                1: Main 10 digit number
                                <img src='/static/images/healthsite-medicare-explanation.jpg'>"
                            data-placement="bottom"
                            tabindex="-1">
                            <i class="fa fa-question-circle"></i>
                        </a>

                        <input name="medicare_no" type="text" class="form-control" id="medicare_no" placeholder="(10 digits)"
                            data-validators="medicare"
                            data-bind="event: { change: function(data, event){user.setHasMedicare(data, event)} }"
                            >
                    </div>

                    <div class="col-sm-8 col-md-5">
                        <label for="medicare_ref" class="control-label">Reference <span class="hidden-md hidden-sm">Number</span><span class="hidden-xs hidden-lg">#</span></label>

                        <a class="popover__button"
                            rel="popover"
                            data-toggle="popover"
                            data-trigger="focus"
                            title="Medicare Reference Number"
                            data-content="
                                2: One digit (also known as PRN)
                                <img src='/static/images/healthsite-medicare-explanation.jpg'>"
                            data-placement="bottom"
                            tabindex="-1">
                            <i class="fa fa-question-circle"></i>
                        </a>

                        <input name="medicare_ref" type="text" class="form-control" id="medicare_ref" placeholder="(one digit)"
                            data-validators="regex"
                            data-validator-regex="^\d$"
                            data-message-regex="Must be a single digit."
                            data-bind="attr: {
                                required: user.hasMedicare()
                            }"
                            >
                    </div>

                    <div class="col-sm-16 col-md-5">
                        <label for="medicare_exp" class="control-label">Medicare Expiry</label>
                        <input name="medicare_exp" type="text" class="form-control" id="medicare_exp"
                            data-datefmt="MM/YYYY"
                            data-validators="future_date"
                            placeholder="MM/YYYY"
                            data-bind="attr: {
                                required: user.hasMedicare()
                            }"
                            >
                        <p class="help-block" style="display: none;">Please enter the date as MM/YYYY</p>
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-sm-16">
                        <p>Phone numbers:</p>
                    </div>

                    <div class="col-sm-16 col-md-6">
                        <label for="phone_mobile" class="col-xs-16 col-sm-7 col-md-4 control-label sr-only">Mobile</label>
                        <input type="text" name="phone_mobile" class="form-control" id="phone" data-validators="mobile_number" placeholder="mobile" required>
                    </div>

                    <div class="col-sm-16 col-md-5">
                        <label for="phone_work" class="col-xs-16 col-sm-7 col-md-4 control-label sr-only">Work</label>
                        <input type="text" name="phone_work" class="form-control" id="phone_work" data-validators="phone_number" placeholder="work">
                    </div>

                    <div class="col-sm-16 col-md-5">
                        <label for="phone_home" class="col-xs-16 col-sm-7 col-md-4 control-label sr-only">Home</label>
                        <input type="text" name="phone_home" class="form-control" id="phone_home" data-validators="phone_number" placeholder="home">
                    </div>
                </div>

                <div class="form-group set-existing-patient">
                    <div class="col-sm-16">
                        <p>Are you an existing patient of this clinic?</p>
                    </div>
                    <div class="col-xs-8">
                        <button type="button" class="btn btn-primary" data-bind="
                            click: user.removeNewPatientFields,
                            css: {'btn-success': user.isNewPatient() !== null && !user.isNewPatient()}"
                            >
                            <i data-bind="visible: user.isNewPatient() !== null && !user.isNewPatient()" class="fa fa-check-circle"></i>
                            Yes
                        </button>
                    </div>
                    <div class="col-xs-8">
                        <button type="button" class="btn btn-primary" data-bind="
                            click: user.resetNewPatientFields,
                            css: {'btn-success': user.isNewPatient()}"
                            >
                            <i data-bind="visible: user.isNewPatient()" class="fa fa-check-circle"></i>
                            No
                        </button>
                    </div>
                    <div class="col-sm-16" data-bind="visible: user.extRegoFeedback()">
                        <p class="help-block" data-bind="text: user.extRegoFeedback()"></p>
                    </div>
                </div>
            </div>

            
            <div class="step-pane" data-step="2">

                <h4>Your Details</h4>

                <div class="form-group popover__parent">
                    <div class="col-sm-16">
                        <p>Address:</p>
                    </div>

                    <div class="col-sm-5">
                        <label for="patient-building" class="control-label sr-only">Building (optional)</label>
                        <input type="text" name="address_building" class="form-control" id="patient-building" placeholder="Building (optional)">
                    </div>

                    <div class="col-sm-11">
                        <label for="patient-address" class="control-label sr-only">Address</label>
                        <input type="text" name="address_street" class="form-control" id="patient-address" placeholder="Address">
                    </div>

                    <div class="col-sm-11">
                        <label for="patient-suburb" class="control-label sr-only">Suburb</label>
                        <input type="text" name="address_suburb" class="form-control" id="patient-suburb" placeholder="Suburb">
                    </div>

                    <div class="col-sm-5">
                        <label for="patient-postcode" class="control-label sr-only">Postcode</label>
                        <input type="text" name="address_postcode" class="form-control" id="patient-postcode" placeholder="Postcode" data-validators="postcode">
                    </div>

                    <a class="popover__button"
                        rel="popover"
                        data-toggle="popover"
                        data-trigger="focus"
                        title="Address example"
                        data-content="
                            <strong>Building:    </strong> Building 1b <em>(rarely needed)</em><br>
                            <strong>Address:     </strong> 145 Smith St,<br>
                            <strong>Suburb:      </strong> Collingwood<br>
                            <strong>Postcode:    </strong> 3065"
                        data-placement="bottom"
                        tabindex="-1">
                        <i class="fa fa-question-circle"></i>
                    </a>
                </div>

                <div class="form-group">
                    <div class="col-sm-16">
                        <p>Next of Kin:</p>
                    </div>

                    <div class="col-sm-8">
                        <label for="patient-nok-first_name" class="control-label sr-only">Next of Kin First Name</label>
                        <input type="text" name="nok_first_name" class="form-control" id="patient-nok-first_name" placeholder="Next of Kin: First name">
                    </div>

                    <div class="col-sm-8">
                        <label for="patient-nok-last_name" class="control-label sr-only">Next of Kin Last Name</label>
                        <input type="text" name="nok_last_name" class="form-control" id="patient-nok-last_name" placeholder="Next of Kin: Last name">
                    </div>

                    <div class="col-sm-8">
                        <label for="patient-nok-relationship" class="control-label sr-only">Relationship</label>
                        <input type="text" name="nok_rel" class="form-control" id="patient-nok-relationship" placeholder="Relationship">
                    </div>

                    <div class="col-sm-8">
                        <label for="patient-nok-mobile" class="control-label sr-only">Mobile #</label>
                        <input type="text" name="nok_phone" class="form-control" id="patient-nok-mobile" placeholder="Mobile #" data-validators="mobile_number">
                    </div>

                </div>

            </div>

            
            <div class="step-pane" data-step="3">

                <h4>Concession card information</h4>

                <div class="form-group">
                    <div class="col-sm-16">
                        <label for="pension_type" class="control-label">Pension Card Type</label>
                        <select name="pension_type" id="pension_type" class="form-control"
                            data-bind="event: { change: function(data, event){user.setPensionType(data, event)} }"
                            >
                            <option value="0">None</option>
                            <option value="1">Pensioner Concession Card</option>
                            <option value="3">Health Care Card</option>
                            <option value="4">Commonwealth Seniors Health Card</option>
                        </select>
                    </div>

                    <div class="col-md-8" data-bind="visible: user.hasPension()">
                        <label for="pension_no" class="control-label">Pension Number</label>
                        <input name="pension_no" type="text" class="form-control" id="pension_no" placeholder="#### #### ##"
                            data-bind="attr: {required: user.hasPension()}">
                    </div>

                    <div class="col-md-8" data-bind="visible: user.hasPension()">
                        <label for="pension_exp" class="control-label">Pension Expiry</label>
                        <input name="pension_exp" type="text" class="form-control" id="pension_exp"
                            data-datefmt="MM/YYYY"
                            data-validators="future_date"
                            placeholder="MM/YYYY"
                            data-bind="attr: {
                                required: user.hasPension(),
                                'data-validators': user.hasPension() ? 'future_date' : ''
                                }">
                        <p class="help-block" style="display: none;">Please enter the date as MM/YYYY</p>
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-md-16">
                        <label for="dva_type" class="control-label">Department of Veteren Affairs Card Type</label>
                        <select name="dva_type" id="dva_type" class="form-control"
                            data-bind="event: { change: function(data, event){user.setDVAType(data, event)} }"
                            >
                            <option value="0">None</option>
                            <option value="1">Gold</option>
                            <option value="2">White</option>
                        </select>
                    </div>

                    <div class="col-md-16" data-bind="visible: user.hasDVA()">
                        <label for="dva_no" class="control-label">Department of Veteren Affairs Card Number</label>
                        <input type="text" class="form-control" id="dva_no" placeholder="# ### #### (#)" name="dva_no"
                            data-bind="attr: {
                                required: user.hasDVA(),
                                'data-validators': user.hasDVA() ? 'dva ' : ''
                                }"
                            data-validators="dva"
                            >
                    </div>
                </div>
            </div>

            
            <div class="step-pane" data-step="4">

                <h4>Account Information</h4>

                <div class="form-group">
                    <div class="col-sm-16">
                        <label for="email" class="control-label">Email address</label>
                        <input name="email" type="email" class="form-control" id="email" placeholder="you@domain.com"
                            data-validators="email"
                            required>
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-sm-16">
                        <label for="email1" class="control-label">Verify your email address</label>
                        <input name="email1" type="email" class="form-control" id="email1" placeholder="Confirm Email"
                            data-validators="email, match"
                            data-validator-match="email"
                            required>
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-sm-8">
                        <label for="password" class="control-label">Password</label>
                        <input name="password" type="password" class="form-control" id="password" placeholder="Your Password" required>
                    </div>

                    <div class="col-sm-8">
                        <label for="password1" class="control-label">Repeat your password</label>
                        <input name="password1" type="password" class="form-control" id="password1" placeholder="Repeat your password"
                            data-validators="match"
                            data-validator-match="password"
                            required>
                    </div>
                </div>
            </div>

            
            <div class="step-pane" data-step="5">

                <div class="form-group">
                    <div class="col-sm-16">
                        <h4>Privacy Policy</h4>
                        <!-- name blank to avoid sending? -->
                        <blockquote class="blockquote--scrollable" data-bind="html: root.currentClinic().privacy_policy"></blockquote>

                        <label class="checkbox-inline">
                            <input type="checkbox" name="privacy_agreement" id="privacy_agreement"
                                data-validators="requires_checked"
                                data-bind="attr: { 'data-message-requires_checked': root.currentClinic().privacy_policy_validation_message }"
                                >
                            <span data-bind="text: root.currentClinic().privacy_policy_confirmation_message"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>


        <div class="actions col-sm-12">
            <button type="button" class="btn btn-default btn-prev"><span class="glyphicon glyphicon-arrow-left"></span>Prev</button>
            <button type="button" class="btn btn-default btn-next" data-bind="attr: {enabled: user.registerStepValid}" data-last="Register" data-action="submit">Next<span class="glyphicon glyphicon-arrow-right"></span></button>
        </div>
    </div>

</div>

    </script>

    <script id="editPatientFormDefault" type="text/html">
        

<div class="form-group single-row">

    <label for="patient-title" class="col-sm-7 control-label hidden-md hidden-lg">Title</label>
    <div class="col-sm-9 col-md-3 col-md-offset-1">
        <select name="title" class="form-control" id="patient-title" data-bind="value: patient.title">
            <option value="">Title</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Ms">Ms</option>
            <option value="Miss">Miss</option>
            <option value="Ma">Master</option>
            <option value="Dr">Dr</option>
        </select>
    </div>
    <div class="spacer-sm"></div>

    <label for="patient-first_name" class="col-sm-7 control-label hidden-md hidden-lg">First name</label>
    <div class="col-sm-9 col-md-6">
        <input type="text" name="first_name" class="form-control" id="patient-first_name" placeholder="First Name" required>
    </div>
    <div class="spacer-sm"></div>

    <label for="patient-last_name" class="col-sm-7 control-label hidden-md hidden-lg">Last Name</label>
    <div class="col-sm-9 col-md-6">
        <input type="text" name="last_name" class="form-control" id="patient-last_name" placeholder="Family Name" required>
    </div>
</div>

<div class="form-group">
    <label for="patient-gender" class="col-xs-16 col-sm-7 col-md-4 control-label">Gender</label>
    <div class="col-sm-9 col-md-12">
        <select name="gender" data-bind="options: $root.genderChoices, optionsText: 'display', optionsValue: 'value'" class="form-control" id="patient-gender"></select>
    </div>
</div>

<div class="form-group">
    <label for="patient-dob" class="col-xs-16 col-sm-7 col-md-4 control-label">Date of Birth</label>
    <div class="col-sm-9 col-md-12">
        <input type="text" name="dob" class="form-control" id="patient-dob" data-validators="past_date, earliest_date_of_birth" placeholder="Date of Birth" data-datefmt="DD/MM/YYYY" required>
    </div>
</div>

<div class="form-group">
    <label for="patient-email" class="col-xs-16 col-sm-7 col-md-4 control-label">Email</label>
    <div class="col-sm-9 col-md-12">
        <input type="text" name="email" class="form-control" id="patient-email" data-validators="email" placeholder="Email">
    </div>
</div>

<div class="form-group">
    <label for="patient-phone_mobile" class="col-xs-16 col-sm-7 col-md-4 control-label">Mobile</label>
    <div class="col-sm-9 col-md-12">
        <input type="text" name="phone_mobile" class="form-control" id="patient-phone_mobile" data-validators="mobile_number" placeholder="Mobile phone">
    </div>
</div>

<div class="form-group single-row">
    <label for="patient-medicare_no" class="col-xs-16 col-sm-7 col-md-4 control-label">Medicare</label>
    <div class="col-sm-9 col-md-8 popover__parent">
        <input type="text" name="medicare_no" class="form-control" id="patient-medicare_no" data-validators="medicare" placeholder="Medicare">

        <a class="popover__button"
            rel="popover"
            data-toggle="popover"
            data-trigger="focus"
            title="Medicare Number"
            data-content="
                1: The main 10 digit number
                <img src='/static/images/healthsite-medicare-explanation.jpg'>"
            data-placement="bottom"
            tabindex="-1">
            <i class="fa fa-question-circle"></i>
        </a>

    </div>
    <div class="spacer-sm"></div>

    <label for="patient-medicare_ref" class="col-xs-16 col-sm-7 col-md-4 control-label hidden-md hidden-lg">Medicare Reference</label>
    <div class="col-sm-9 col-md-4 popover__parent">
        <input type="text" name="medicare_ref" class="form-control" id="patient-medicare_ref" placeholder="Ref">

        <a class="popover__button"
            rel="popover"
            data-toggle="popover"
            data-trigger="focus"
            title="Medicare Reference Number"
            data-content="
                2: Found to the left of the name(s)
                <img src='/static/images/healthsite-medicare-explanation.jpg'>"
            data-placement="auto right"
            tabindex="-1">
            <i class="fa fa-question-circle"></i>
        </a>

    </div>
</div>

<div class="form-group">
    <div class="col-sm-9 col-sm-push-7 col-md-push-4 col-md-12">
        <button type="button" class="btn btn-primary pull-right" data-bind="click: savePatient" data-action="submit">Save</button>
    </div>
    <div class="spacer-xs"></div>
    <div class="col-xs-16 col-sm-5 col-sm-pull-7 col-md-pull-12 col-md-4">
    <button type="button" class="btn btn-cancel pull-left" data-bind="click: editPatientCancel" data-action="cancel">Cancel</button>
    </div>
</div>

    </script>

    <script id="editPatientFormExtendedRego" type="text/html">
        
<div class="wizard" id="editPatient" data-initialize="wizard">
    <ul class="steps three-step">
        <li data-step="1"><span class="badge">1</span><span class="title">About you</span></li>
        <li data-step="2"><span class="badge">2</span><span class="title">Your Details</span></li>
        <li data-step="3"><span class="badge">3</span><span class="title">Concession Cards</span></li>
    </ul>

    <div class="panel panel-default">
        <div class="step-content col-sm-12">

            
            <div class="step-pane active" data-step="1">

                <h4>Tell us about yourself</h4>

                <div class="form-group">
                    <div class="col-sm-16 label--for-group">
                        <p>Patient Name:</p>
                    </div>

                    <div class="col-sm-6 col-md-4">
                        <label for="title" class="control-label sr-only">Title</label>
                        <select class="form-control" name="title" id="title" data-bind="value: title">
                            <option value="">Title</option>
                            <option value="Mr">Mr</option>
                            <option value="Mrs">Mrs</option>
                            <option value="Ms">Ms</option>
                            <option value="Miss">Miss</option>
                            <option value="Ma">Master</option>
                            <option value="Dr">Dr</option>
                        </select>
                    </div>

                    <div class="col-sm-10 col-md-6">
                        <label for="first_name" class="control-label sr-only">First name</label>
                        <input type="text" class="form-control" id="firstname" placeholder="First name" name="first_name" required>
                    </div>

                    <div class="col-sm-16 col-md-6">
                        <label for="last_name" class="control-label sr-only">Last name</label>
                        <input type="text" class="form-control" id="last_name" placeholder="Last name" name="last_name" required>
                    </div>

                    <div class="col-sm-8">
                        <label for="gender" class="control-label sr-only">Gender</label>
                        <select class="form-control" name="gender" id="gender" data-bind="value: gender">
                            <option value="">Gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>

                    <div class="col-sm-8">
                        <label for="dob" class="control-label sr-only">Date of birth</label>
                        <input name="dob" type="text" class="form-control" id="dob"
                            data-datefmt="DD/MM/YYYY"
                            data-validators="past_date, earliest_date_of_birth"
                            placeholder="Birthdate (DD/MM/YYYY)"
                            required>
                        <p class="help-block" style="display: none;">Please enter the date in Australian standard format</p>
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-sm-8 col-md-6">
                        <label for="medicare_no" class="control-label">Medicare Number</label>

                        
                        <a class="popover__button"
                            rel="popover"
                            data-toggle="popover"
                            data-trigger="focus"
                            title="Medicare Number"
                            data-content="
                                1: Main 10 digit number
                                <img src='/static/images/healthsite-medicare-explanation.jpg'>"
                            data-placement="bottom"
                            tabindex="-1">
                            <i class="fa fa-question-circle"></i>
                        </a>

                        <input name="medicare_no" type="text" class="form-control" id="medicare_no" placeholder="(10 digits)" data-validators="medicare">
                    </div>

                    <div class="col-sm-8 col-md-5">
                        <label for="medicare_ref" class="control-label">Reference <span class="hidden-md hidden-sm">Number</span><span class="hidden-xs hidden-lg">#</span></label>

                        <a class="popover__button"
                            rel="popover"
                            data-toggle="popover"
                            data-trigger="focus"
                            title="Medicare Reference Number"
                            data-content="
                                2: One digit (also known as PRN)
                                <img src='/static/images/healthsite-medicare-explanation.jpg'>"
                            data-placement="bottom"
                            tabindex="-1">
                            <i class="fa fa-question-circle"></i>
                        </a>

                        <input name="medicare_ref" type="text" class="form-control" id="medicare_ref" placeholder="(one digit)"
                            data-validators="regex"
                            data-validator-regex="^\d$"
                            data-message-regex="Must be a single digit."
                            required>
                    </div>

                    <div class="col-sm-16 col-md-5">
                        <label for="medicare_exp" class="control-label">Medicare Expiry</label>
                        <input name="medicare_exp" type="text" class="form-control" id="medicare_exp"
                            data-datefmt="MM/YYYY"
                            data-validators="future_date"
                            placeholder="MM/YYYY"
                            required>
                        <p class="help-block" style="display: none;">Please enter the date as MM/YYYY</p>
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-sm-16 label--for-group">
                        <p>Phone numbers:</p>
                    </div>

                    <div class="col-sm-16 col-md-6">
                        <label for="phone_mobile" class="col-xs-16 col-sm-7 col-md-4 control-label sr-only">Mobile</label>
                        <input type="text" name="phone_mobile" class="form-control" id="phone" data-validators="mobile_number" placeholder="mobile" required>
                    </div>

                    <div class="col-sm-16 col-md-5">
                        <label for="phone_work" class="col-xs-16 col-sm-7 col-md-4 control-label sr-only">Work</label>
                        <input type="text" name="phone_work" class="form-control" id="phone_work" data-validators="phone_number" placeholder="work">
                    </div>

                    <div class="col-sm-16 col-md-5">
                        <label for="phone_home" class="col-xs-16 col-sm-7 col-md-4 control-label sr-only">Home</label>
                        <input type="text" name="phone_home" class="form-control" id="phone_home" data-validators="phone_number" placeholder="home">
                    </div>
                </div>
            </div>

            
            <div class="step-pane" data-step="2">

                <h4>Your Details</h4>

                <div class="form-group">
                    <div class="col-sm-16 label--for-group">
                        <p>Email address:</p>
                    </div>

                    <div class="col-sm-16">
                        <label for="email" class="control-label sr-only">Email address</label>
                        <input name="email" type="email" class="form-control" id="email" placeholder="you@domain.com"
                            data-validators="email"
                            required>
                    </div>
                </div>

                <div class="form-group popover__parent">
                    <div class="col-sm-16 label--for-group">
                        <p>Address:</p>
                    </div>

                    <div class="col-sm-5">
                        <label for="patient-building" class="control-label sr-only">Building (optional)</label>
                        <input type="text" name="address_building" class="form-control" id="patient-building" placeholder="Building (optional)">
                    </div>

                    <div class="col-sm-11">
                        <label for="patient-address" class="control-label sr-only">Address</label>
                        <input type="text" name="address_street" class="form-control" id="patient-address" placeholder="Address">
                    </div>

                    <div class="col-sm-11">
                        <label for="patient-suburb" class="control-label sr-only">Suburb</label>
                        <input type="text" name="address_suburb" class="form-control" id="patient-suburb" placeholder="Suburb">
                    </div>

                    <div class="col-sm-5">
                        <label for="patient-postcode" class="control-label sr-only">Postcode</label>
                        <input type="text" name="address_postcode" class="form-control" id="patient-postcode" placeholder="Postcode" data-validators="postcode">
                    </div>

                    <a class="popover__button"
                        rel="popover"
                        data-toggle="popover"
                        data-trigger="focus"
                        title="Address example"
                        data-content="
                            <strong>Building:    </strong> Building 1b <em>(rarely needed)</em><br>
                            <strong>Address:     </strong> 145 Smith St,<br>
                            <strong>Suburb:      </strong> Collingwood<br>
                            <strong>Postcode:    </strong> 3065"
                        data-placement="bottom"
                        tabindex="-1">
                        <i class="fa fa-question-circle"></i>
                    </a>
                </div>

                <div class="form-group">
                    <div class="col-sm-16 label--for-group">
                        <p>Next of Kin:</p>
                    </div>

                    <div class="col-sm-8">
                        <label for="patient-nok-first_name" class="control-label sr-only">Next of Kin First Name</label>
                        <input type="text" name="nok_first_name" class="form-control" id="patient-nok-first_name" placeholder="Next of Kin: First name">
                    </div>

                    <div class="col-sm-8">
                        <label for="patient-nok-last_name" class="control-label sr-only">Next of Kin Last Name</label>
                        <input type="text" name="nok_last_name" class="form-control" id="patient-nok-last_name" placeholder="Next of Kin: Last name">
                    </div>

                    <div class="col-sm-8">
                        <label for="patient-nok-relationship" class="control-label sr-only">Relationship</label>
                        <input type="text" name="nok_rel" class="form-control" id="patient-nok-relationship" placeholder="Relationship">
                    </div>

                    <div class="col-sm-8">
                        <label for="patient-nok-mobile" class="control-label sr-only">Mobile #</label>
                        <input type="text" name="nok_phone" class="form-control" id="patient-nok-mobile" placeholder="Mobile #" data-validators="mobile_number">
                    </div>

                </div>

            </div>

            
            <div class="step-pane" data-step="3">

                <h4>Concession card information</h4>

                <div class="form-group">
                    <div class="col-sm-16">
                        <label for="pension_type" class="control-label">Pension Card Type</label>
                        <select name="pension_type" id="pension_type" class="form-control"
                            data-bind="event: { change: function(data, event){setPensionType(data, event)} }"
                            >
                            <option value="0">None</option>
                            <option value="1">Pensioner Concession Card</option>
                            <option value="3">Health Care Card</option>
                            <option value="4">Commonwealth Seniors Health Card</option>
                        </select>
                    </div>

                    <div class="col-md-8" data-bind="visible: hasPension()">
                        <label for="pension_no" class="control-label">Pension Number</label>
                        <input name="pension_no" type="text" class="form-control" id="pension_no" placeholder="#### #### ##"
                            data-bind="attr: {required: hasPension()}">
                    </div>

                    <div class="col-md-8" data-bind="visible: hasPension()">
                        <label for="pension_exp" class="control-label">Pension Expiry</label>
                        <input name="pension_exp" type="text" class="form-control" id="pension_exp"
                            data-datefmt="MM/YYYY"
                            data-validators="future_date"
                            placeholder="MM/YYYY"
                            data-bind="attr: {
                                required: hasPension(),
                                'data-validators': hasPension() ? 'future_date' : ''
                                }">
                        <p class="help-block" style="display: none;">Please enter the date as MM/YYYY</p>
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-md-16">
                        <label for="dva_type" class="control-label">Department of Veteren Affairs Card Type</label>
                        <select name="dva_type" id="dva_type" class="form-control"
                            data-bind="event: { change: function(data, event){setDVAType(data, event)} }"
                            >
                            <option value="0">None</option>
                            <option value="1">Gold</option>
                            <option value="2">White</option>
                        </select>
                    </div>

                    <div class="col-md-16" data-bind="visible: hasDVA()">
                        <label for="dva_no" class="control-label">Department of Veteren Affairs Card Number</label>
                        <input type="text" class="form-control" id="dva_no" placeholder="# ### #### (#)" name="dva_no"
                            data-bind="attr: {
                                required: hasDVA(),
                                'data-validators': hasDVA() ? 'dva ' : ''
                                }"
                            data-validators="dva"
                            >
                    </div>
                </div>
            </div>
        </div>

        <div class="actions col-sm-12">
            <button type="button" class="btn btn-cancel pull-left" data-bind="click: editPatientCancel" data-action="cancel">Cancel</button>
            <button type="button" class="btn btn-default pull-right btn-next" data-last="Save" data-action="submit">Next<span class="glyphicon glyphicon-arrow-right"></span></button>
        </div>
    </div>

</div>

    </script>

    <script src="static/js/vendor/jquery.min.js@12-06-2016"></script>
    <script src="static/js/vendor/knockout.js@12-06-2016"></script>
    <script src="static/js/vendor/jquery.cookie.min.js@12-06-2016"></script>
    <script src="static/js/vendor/underscore.min.js@12-06-2016"></script>
    <script src="static/js/vendor/moment.min.js@12-06-2016"></script>
    <script src="static/js/vendor/bootstrap.min.js@12-06-2016"></script>
    <script src="static/js/vendor/bootstrap-dialog.min.js"></script>
    <script src="static/js/vendor/sticky.min.js@12-06-2016"></script>
    <script src="static/js/vendor/sammy.min.js@12-06-2016"></script>
    <script src="static/js/vendor/jquery.maskedinput.min.js@12-06-2016"></script>
    <script src="static/js/vendor/fuelux-wizard.js@12-06-2016"></script>

    
    <script src="static/js/defines.js"></script>  
    <script src="static/js/utils.js"></script>
      
      <script src="static/js/forms.js"></script>
      <script src="static/js/messages.js"></script>
      <script src="static/js/page.js"></script>  
     <script src="static/js/pages/account.js"></script>
     <script src="static/js/pages/appointments.js"></script> 
     <script src="static/js/pages/calendar.js"></script> 
     <script src="static/js/pages/password.js"></script> 
   <script src="static/js/user.js"></script>  
   <script src="static/js/main.js"></script>
      
      
    

</body>
</html>
