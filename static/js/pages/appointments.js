
Appointments = function () {
    Page.apply(this, arguments);
    this.tmpl = 'appointmentsTmpl';
    this.needLocation = ko.observable(false);
    this.locationError = ko.observable(0);
    this.locationTimer = 0;
    this.minimumRange = MINIMUM_RANGE * 1000 + 'm';
};

Appointments.prototype = Object.create(Page.prototype);
Appointments.prototype.constructor = Appointments;


Appointments.prototype.onSelect = function () {
    root.loading(true);

    if( root.activateSelfArrive()) {
        this.timer = window.setInterval(this.updateTime.bind(this), 2000);
        this.updateTime();
    }
    this.root.user.fetchBookings( function(){

        if( root.activateSelfArrive()) {
            this.getLocation();
        }
        root.loading(false);
    }.bind(this));
};


Appointments.prototype.onExit = function () {
    if(this.geo_task) {
        navigator.geolocation.clearWatch(this.geo_task);
        this.geo_task = undefined;
        this.timer = window.clearInterval(this.timer);
    }
};


Appointments.prototype.updateTime = function () {
    _.each(root.user.bookings(), function(booking){
        booking.timeUntil(timeUntilAppointment(booking));
    });
};


function timeUntilAppointment(booking){
    var now = moment();
    var diff = moment(booking.date).diff(now, 'minutes');
    return diff;
};


Appointments.prototype.getLocation = function (){
    if(navigator.geolocation && this.needLocation()) {

        var options = {
            "enableHighAccuracy": true,
            "timeout": 5000, // milliseconds
            "maximumAge": 9000 // cache location for 9secs
        }

        this.geo_task = navigator.geolocation.watchPosition(
            this.locationUpdate.bind(this),
            this.locationFailed.bind(this),
            options
        );
    }

    // every 5 secs, check to see if the user has answered the location permissions dialog
    var locationTimeout = 5000;
    this.locationTimerId = window.setInterval(function(){
        if( this.needLocation() && root.user.position() === null ){
            this.locationTimer += locationTimeout;
            // prevent overlapping errors by checking that the location error is not otherwise set
            if(this.locationTimer >= locationTimeout && this.locationError() === 0 ){
                root.user.geolocating(false);
                this.locationError(4);
            }
        }
        else {
            clearTimeout(this.locationTimerId);
        }
    }.bind(this), locationTimeout);
}


Appointments.prototype.locationUpdate = function (position) {
    root.user.position(position.coords);
    this.locationError(0);
    root.user.geolocating(false);
};


Appointments.prototype.locationFailed = function ( error ) {

    // computeds will take care of inRange()
    root.user.position(null);
    root.user.geolocating(false);

    // eg error = PositionError {message: "Timeout expired", code: 3, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3}

    if ( error.code == 1) {
        // https://support.google.com/chrome/answer/142065?hl=en
        console.warn( 'The user didn\'t permit us to get location', error );
        this.locationError(1);
        // clearTimeout(user.locationTimerId);
    }
    else if ( error.code == 3) {
        // https://support.google.com/chrome/answer/142065?hl=en
        console.warn( 'Geolocation timed out', error );
        this.locationError(3);
    }
    else {
        console.warn( 'There was an error getting the user\'s location', error );
        this.locationError(2);
    }
};


function haversine (p1, p2) {
    function rad(val) { return Math.PI * val / 180; };
    var R = 6371;
    var dLat  = rad(p2.latitude - p1.latitude);
    var dLong = rad(p2.longitude - p1.longitude);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.latitude)) * Math.sin(dLong/2) * Math.sin(dLong/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;

    // console.info( 'Distance between clinic & user: ', d.toFixed(2), 'km' );
    return d.toFixed(2); // 2 decimal places
};


