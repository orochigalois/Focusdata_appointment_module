
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
	this.displayDate = ko.computed(function () {
		return moment(this.selectedDate(),
			DATE_FORMAT).format('D MMM');
	}, this);
	this.selectedTime = ko.observable();

	this.selectedDoctorCode = ko.observable();
	this.selectedDoctor = ko.computed(function () {
		return this.root.doctor_map()[this
			.selectedDoctorCode()];
	}, this);

	this.doctorShortName = ko
		.computed(
		function () {
			if (this.selectedDoctor() === undefined) {
				return undefined;
			}
			var salutation = 'Dr ';
			var name = this
				.selectedDoctor().name
				.split(' ')
				.slice(1).join(
				' ');
			if (this
				.practitionerTitle() != 'Doctor') {
				salutation = '';
				if (name.length < 20) {
					name = this
						.selectedDoctor().name;
				}
			}
			return salutation + name;
		}, this);

	this.practitionerTitle = ko
		.computed(
		function () {
			if (this.root
				.currentClinic()
				&& this.root
					.currentClinic().practitioner_title.length > 0) {
				return this.root
					.currentClinic().practitioner_title;
			}
			else {
				return undefined;
			}
		}, this);

	this.selectedPractitionerTitle = ko
		.computed(
		function () {
			if (this.selectedDoctor()) {
				return this
					.doctorShortName();
			}
			else {
				return this
					.practitionerTitle();
			}
		}, this);

	this.practitionerHeadingText = ko
		.computed(
		function () {
			var currentTitle = this
				.practitionerTitle();
			if (typeof currentTitle === 'undefined') {
				currentTitle = 'Practitioner';
			}
			return 'Select '
				+ currentTitle;
		}, this);

	this.bookingComplete = ko
		.computed(
		function () {
			var allSet = this
				.selectedDoctorCode() !== undefined
				&& this
					.selectedDate() !== undefined
				&& this
					.selectedTime() !== undefined;

			// if(allSet) {
			// console.info('Selected appointment: %s %s with Dr:
			// %s',
			// self.selectedDate(),
			// self.selectedTime(),
			// self.selectedDoctorCode(),
			// self.filteredAppts()
			// );
			// }
			return allSet;
		}, this);

	this.bookingConfirmed = ko.observable(false);

	this.setSelectedDoctor = function (appt) {
		if (!_.contains(self.filteredDoctors(),
			appt.doctor_code)) {
			return;
		}

		// if doctor is already set, unset it
		if (self.selectedDoctorCode() == appt.doctor_code) {
			self.selectedDoctorCode(undefined);
		}
		else {
			self
				.selectedDoctorCode(appt.doctor_code);

			// if the selected date or time is not compatible, unset that
			// dimension

			var matchingDatesCount = self
				.filteredAppts().length;
			var matchingTimesCount = self
				.filteredAppts().length;

			_
				.each(
				self.filteredAppts(),
				function (appt) {
					if (!_
						.contains(
						appt,
						self
							.selectedTime())) {
						matchingTimesCount--;
					}
					if (!_
						.contains(
						appt,
						self
							.selectedDate())) {
						matchingDatesCount--;
					}
				});
			if (!matchingDatesCount)
				self.selectedDate(undefined);
			if (!matchingTimesCount)
				self.selectedTime(undefined);
		}
	};
	this.setSelectedDate = function (ctx, ev) {
		var date = $(ev.target).data('date');
		if (!$(ev.target).hasClass('available')) {
			return;
		}
		if (self.selectedDate() == date) {
			self.selectedDate(undefined);
			self.selectedTime(undefined);
		}
		else {
			self.selectedDate(date);

			// if the selected doctor or time is not compatible, unset that
			// dimension

			var matchingDoctorsCount = self
				.filteredAppts().length;
			var matchingTimesCount = self
				.filteredAppts().length;

			_
				.each(
				self.filteredAppts(),
				function (appt) {
					if (!_
						.contains(
						appt,
						self
							.selectedTime())) {
						matchingTimesCount--;
					}
					if (!_
						.contains(
						appt,
						self
							.selectedDoctorCode())) {
						matchingDoctorsCount--;
					}
				});
			if (!matchingDoctorsCount)
				self
					.selectedDoctorCode(undefined);
			if (!matchingTimesCount)
				self.selectedTime(undefined);

		}
	};
	this.setSelectedTime = function (time) {
		if (toggles().has_long_appointment_new) {
			// show a message if undeclared
			if (root.user.declaredNewPatient() === false) {
				confirmNewOrExistingPatientMessage();
				self.selectedTime(undefined);
				return;
			}
			if (root.user.isNewPatient() === true
				&& root.user.isLongAppt() === false) {
				displayRequireLongApptMessage();
				self.selectedTime(undefined);
				return;
			}
		}
		if (!_.contains(self.filteredTimes(),
			time)) {
			return;
		}
		self
			.selectedTime(self.selectedTime() == time ? undefined
				: time);
	};

	this.appointmentList = ko.observableArray(
		[]);

	// returns a list of doctorCodes of the form '01' from a list of matching
	// appointments
	this.filteredDoctors = ko
		.computed(
		function () {
			var filteredDoctors = this
				.appointmentList();

			if (
				// we need to watch isLongAppt() to ensure that filtered
				// appts
				// are updated whenever appt length changes
				root
				&& root.user
				&& root.user
					.isLongAppt()
				|| toggles().has_long_appointment) {
				filteredDoctors = filterValidLongAppts(filteredDoctors);
			}
			;

			filteredDoctors = _
				.chain(
				filteredDoctors)
				.map(
				function (
					appt) {
					if (root
						.selectedClinic() != appt.clinic_id) {
						return;
					}
					if (this
						.selectedDate()
						&& this
							.selectedDate() != appt.date) {
						return;
					}
					if (this
						.selectedTime()
						&& this
							.selectedTime() != appt.time) {
						return;
					}
					return appt;
				}, this)
				.compact()
				.sortBy('doctor')
				.pluck('doctor')
				.uniq(true)
				.value();

			// console.log('filteredDoctors', filteredDoctors);
			return filteredDoctors;
		}, this);

	// returns a list of dates of the form '27-09-2015' from a list of matching
	// appointments
	this.filteredDates = ko
		.computed(
		function () {
			var filteredDates = this
				.appointmentList();

			if (
				// we need to watch isLongAppt() to ensure that filtered
				// appts
				// are updated whenever appt length changes
				root
				&& root.user
				&& root.user
					.isLongAppt()
				|| toggles().has_long_appointment) {
				filteredDates = filterValidLongAppts(filteredDates);
			}
			;

			filteredDates = _
				.chain(
				filteredDates)
				.map(
				function (
					appt) {
					if (root
						.selectedClinic() != appt.clinic_id) {
						return;
					}
					if (this
						.selectedTime()
						&& this
							.selectedTime() != appt.time) {
						return;
					}
					if (this
						.selectedDoctorCode()
						&& this
							.selectedDoctorCode() != appt.doctor) {
						return;
					}
					return appt;
				}, this)
				.compact()
				.sortBy('date')
				.pluck('date')
				.uniq(true)
				.value();

			// console.log('filteredDates', filteredDates);
			return filteredDates;
		}, this);

	// returns a list of times of the form '01:45 pm' from a list of matching
	// appointments
	this.filteredTimes = ko
		.computed(
		function () {
			var filteredTimes = this
				.appointmentList();

			if (
				// we need to watch isLongAppt() to ensure that filtered
				// appts
				// are updated whenever appt length changes
				root
				&& root.user
				&& root.user
					.isLongAppt()
				|| toggles().has_long_appointment) {
				filteredTimes = filterValidLongAppts(filteredTimes);
			}
			;

			filteredTimes = _
				.chain(
				filteredTimes)
				.map(
				function (
					appt) {
					if (root
						.selectedClinic() != appt.clinic_id) {
						return;
					}
					if (this
						.selectedDate()
						&& this
							.selectedDate() != appt.date) {
						return;
					}
					if (this
						.selectedDoctorCode()
						&& this
							.selectedDoctorCode() != appt.doctor) {
						return;
					}
					return appt;
				}, this)
				.compact()
				.sortBy('when')
				.pluck('time')
				.uniq(true)
				.value();

			// console.log('filteredTimes', filteredTimes);
			return filteredTimes;
		}, this);

	// returns a list of Appt objects from a list of matching appointments
	this.filteredAppts = ko
		.computed(
		function () {
			var filteredAppts = this
				.appointmentList();

			if (
				// we need to watch isLongAppt() to ensure that filtered
				// appts
				// are updated whenever appt length changes
				root
				&& root.user
				&& root.user
					.isLongAppt()
				|| toggles().has_long_appointment) {
				filteredAppts = filterValidLongAppts(filteredAppts);
			}
			;

			filteredAppts = _
				.chain(
				filteredAppts)
				.map(
				function (
					appt) {
					if (root
						.selectedClinic() != appt.clinic_id) {
						return;
					}
					if (this
						.selectedDoctorCode()
						&& this
							.selectedDoctorCode() != appt.doctor) {
						return;
					}
					if (this
						.selectedDate()
						&& this
							.selectedDate() != appt.date) {
						return;
					}
					if (this
						.selectedTime()
						&& this
							.selectedTime() != appt.time) {
						return;
					}
					return appt;
				}, this)
				.compact()
				.sortBy('when')
				.uniq(true)
				.value();

			// console.info('filteredAppts', filteredAppts);
			return filteredAppts;
		}, this);

	// watch for user selection changes, and throb the next button in the UI
	// flow
	this.filteredAppts
		.subscribe(
		function () {
			if (preventThrob) {
				preventThrob = false;
				return;
			}

			// Find the first un-selected button and throb it
			var el;
			if (this.selectedDate() === undefined) {
				el = $('.booking-info button[name=date]');
			}
			else if (this
				.selectedTime() === undefined) {
				el = $('.booking-info button[name=time]');
			}
			else if (this
				.selectedDoctorCode() === undefined) {
				el = $('.booking-info button[name=doctor]');
			}
			else {
				el = $('.booking-info button[name=confirm]');
			}

			throb(el);

			// Work around display issue with buttons not reverting,
			// which we can no longer replicate
			// this attempted fix for an issue which can't be
			// replicated causes stickyjs to rewrap itself
			// recursively with the <div
			// id="undefined-sticky-wrapper"> each time a date,
			// doctor, time is clicked
			// $('.booking-info').sticky('update');
		}, this);

	this.selectFirstAvailable = function () {
		if (toggles().has_long_appointment_new) {
			if (!root.user.declaredNewPatient()) {
				confirmNewOrExistingPatientMessage();
				return;
			}
		}
		var rec = self.filteredAppts()[0];
		if (rec === undefined) {
			GlobalMessages
				.warn('Sorry, there were no appointments available with your current filters, please try clearing filters.');
			return;
		}
		self.selectedDoctorCode(rec.doctor);
		self.selectedDate(rec.date);
		self.selectedTime(rec.time);
	};

	this.clearBooking = function () {
		self.resetBooking();
		self.$confirm.modal('hide');
	};
};

Calendar.prototype = Object
	.create(Page.prototype);
Calendar.prototype.constructor = Calendar;

Calendar.prototype.onSelect = function () {
	this.fetchData();
	this.resetBooking();
};
Calendar.prototype.onRender = function () {
	$('.booking-info').sticky(
		{
			topSpacing: 10
		});
};

Calendar.prototype.fetchData = function () {
	$.ajax(
		{
			url: 'classes/class.appointment_read.php',
			type: 'GET',
			cache: false,
			success: $.proxy(function (response) {
				this.appointmentList(_.map(
					response.objects, function (
						rec) {
						return new Appt(rec);
					}));
			}, this),
			error: function (jqXHR) {
				console.warn(
					'Calendar update failed',
					jqXHR);
			}
		});
};

Calendar.prototype.confirmBooking = function () {
	if (!this.root.user.isAuthenticated()) {
		root.user.showLogin();
		root.user.$login.one('hide.bs.modal',
			function () {
				if (this.root.user
					.isAuthenticated()) {
					this.confirmBooking();
				}
			}.bind(this));
		return;
	}
	this.$confirm.modal('show');
	this.$confirm.one('hide.bs.modal', $.proxy(
		function () {
			if (this.bookingConfirmed()) {
				this.fetchData();
				this.resetBooking();
			}
		}, this));
};


// _______________________________________________________________________________________ "Waiting for..." dialog
var waitingDialog = waitingDialog || (function ($) {
	'use strict';

	// Creating modal dialog's DOM
	var $dialog = $(
		'<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
		'<div class="modal-dialog modal-m">' +
		'<div class="modal-content">' +
		'<div class="modal-header"><h3 style="margin:0;color:red;"></h3></div>' +
		'<div class="modal-body">' +
		'<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
		'</div>' +
		'</div></div></div>');

	return {
		/**
		 * Opens our dialog
		 * @param message Custom message
		 * @param options Custom options:
		 * 				  options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
		 * 				  options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
		 */
		show: function (message, options) {
			// Assigning defaults
			if (typeof options === 'undefined') {
				options = {};
			}
			if (typeof message === 'undefined') {
				message = 'Loading';
			}
			var settings = $.extend({
				dialogSize: 'm',
				progressType: '',
				onHide: null // This callback runs after the dialog was hidden
			}, options);

			// Configuring dialog
			$dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
			$dialog.find('.progress-bar').attr('class', 'progress-bar');
			if (settings.progressType) {
				$dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
			}
			$dialog.find('h3').text(message);
			// Adding callbacks
			if (typeof settings.onHide === 'function') {
				$dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
					settings.onHide.call($dialog);
				});
			}
			// Opening dialog
			$dialog.modal();
		},
		/**
		 * Closes dialog
		 */
		hide: function () {
			$dialog.modal('hide');
		}
	};

})(jQuery);



Calendar.prototype.makeBooking = function () {

	var appt = this.filteredAppts()[0];


	waitingDialog.show('Please wait for 10s...');


	var ajax_step1_set_REQUESTING_FLAG = $.ajax({
		type: "POST",
		url: "classes/class.REQUESTING_FLAG.php",
		dataType: "json",
		data: {
			appointmentID: appt.id
		}
	});

	ajax_step1_set_REQUESTING_FLAG.fail(function (jqXHR, textStatus, errorThrown) {
		console.log(textStatus + ': ' + errorThrown);
	});

	function delay(t) {
		return new Promise(function (resolve) {
			setTimeout(resolve, t);
		});
	}

	var ajax_step2_WAITING_10s = ajax_step1_set_REQUESTING_FLAG.then(function (data) {

		return delay(10000).then(function () {
			waitingDialog.hide();

			return $.ajax({
				type: "POST",
				url: "classes/class.SUCCESSFUL_FLAG.php",
				dataType: "json",
				data: {
					appointmentID: appt.id
				}
			});
		}.bind(this)).then(function (succeed) {
			console.log(succeed);
			if (succeed) {
				var data =
					{
						patient_id: $('#patient').val()
					};
				if (toggles().has_long_appointment) {
					data.long_appt = root.user.isLongAppt();
				}
				if (toggles().has_appointment_type) {
					data.appt_type = root.user.apptType();
				}

				$.ajax(
					{
						url: 'classes/class.appointment_create.php',
						type: 'POST',
						data: { DATA: data, appointmentID: appt.id }
					})
					.done(function () {
						this.bookingConfirmed(true);
					}.bind(this))
					.fail(
					function (xhr) {
						var success = xhr.status >= 200
							&& !xhr.status <= 300;
						if (!success) {
							// console.info('xhr.status, xhr.error, xhr',
							// xhr.status, xhr.error || undefined, xhr);
							if (xhr.error) {
								GlobalMessages
									.addMessage(
									error,
									'danger');
							}
							else {
								GlobalMessages
									.addMessage(
									'Sorry, there was a problem with your booking, please try to book the appointment again.',
									'danger');
							}
							this.$confirm
								.modal('hide');
							this.fetchData();
							this.resetBooking();
						}
					}.bind(this));
			}

		}.bind(this));


	}.bind(this));











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

// wrapper for isValidLongAppt() which ensures that
// the list of appointments is in the correct order
function filterValidLongAppts(list) {
	// Fixme: root is not ready by the time this runs the first time
	if (!root)
		return;

	// return early if we're seeking standard appointments
	if (!root.user.isLongAppt())
		return list;

	var filteredAppts = _
		.chain(list)
		// group our appts by doctor,
		.groupBy('doctor')
		.map(
		function (doctorGroup) {
			// then sort by 'when' and check for valid long appts
			return _
				.chain(
				doctorGroup)
				.sortBy('when')
				.filter(
				function (
					appt,
					index,
					list) {
					return isValidLongAppt(
						appt,
						index,
						list);
				})
				.value();
		}).flatten().value();

	return filteredAppts;
}

// Takes a list of appointments for a single doctor, ordered by time
// Returns true if the appt could be a long appt
// ie: there is an available timeslot for the correct Dr directly after the
// first
function isValidLongAppt(appt, index, list) {
	if (list.length < 2)
		return false;
	if (list.length <= index + 1)
		return false;

	var nextAppt = list[index + 1];

	// endTimeEqualsStartTime is a clone of appt.m because adding on a moment
	// mutates it,
	// Docs: "all moments are mutable", "calling moment on a moment will clone
	// it"
	var endTimeEqualsStartTime = moment(appt.m)
		.add(appt.duration, 'minutes')
		.isSame(nextAppt.m);
	// console.log('isValidLongAppt ?', endTimeEqualsStartTime, appt.m._i,
	// appt.doctor, nextAppt.doctor, appt.id);

	if (endTimeEqualsStartTime) {
		return true;
	}
	return false;
}
