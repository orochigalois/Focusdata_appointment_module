function scroll_to(a) {
    var b = $(a),
        c = b.position().top,
        d = b.closest(".modal") || !1;
    $(d || "html,body").animate({
        scrollTop: c
    }, 1e3)
}

function scroll_to_from_booking(a) {
    var b = $(".booking-info").parent().height(),
        c = $(a).offset().top - b;
    $("html,body").animate({
        scrollTop: c
    }, 1e3)
}

function scroll_to_top() {
    $("html,body").animate({
        scrollTop: 0
    }, 1e3)
}

function throb(a) {
    a.animate({
        opacity: .4
    }, 100).animate({
        opacity: 1
    }, 100).animate({
        opacity: .4
    }, 100).animate({
        opacity: 1
    }, 100).animate({
        opacity: .4
    }, 100).animate({
        opacity: 1
    }, 100)
}

function validate_form(a) {
    var b = $(a),
        c = {},
        d = {};
    return b.find("[data-validators], [required]").each(function() {
        var a = $(this),
            b = a.attr("name"),
            e = a.val(),
            f = a.data("validators") || "";
        f = _.chain(f.split(",")).map($.trim).compact(), a.attr("required") && f.push("required"), d[b] = e;
        var g = f.map(function(b) {
            var c = validate_form.validators[b](e, a);
            return c ? a.data("message-" + b) || c : void 0
        }).compact().value();
        g.length && (c[b] = g)
    }, this), {
        valid: _.isEmpty(c),
        values: d,
        errors: c
    }
}

function Form(a, b) {
    this.$el = $(a), $.extend(this, b || {}), this.$form = "FORM" !== this.$el[0].nodeName ? this.$el.find("form").first() : this.$el, this.mark_required_fields()
}

function form_keys(a) {
    13 == a.which ? $(a.target).closest("form").find("[data-action=submit]").click() : 27 == a.which && $(a.target).closest("form").find("[data-action=cancel]").click()
}

function show_first_error(a) {
    $target = $(a);
    var b = $target.find(".has-error").first().closest(".step-pane");
    $target.wizard("selectedItem", {
        step: $target.find(".step-pane").index(b) + 1
    })
}

function timeUntilAppointment(a) {
    var b = moment(),
        c = moment(a.date).diff(b, "minutes");
    return c
}

function haversine(a, b) {
    function c(a) {
        return Math.PI * a / 180
    }
    var d = 6371,
        e = c(b.latitude - a.latitude),
        f = c(b.longitude - a.longitude),
        g = Math.sin(e / 2) * Math.sin(e / 2) + Math.cos(c(a.latitude)) * Math.cos(c(b.latitude)) * Math.sin(f / 2) * Math.sin(f / 2),
        h = 2 * Math.atan2(Math.sqrt(g), Math.sqrt(1 - g)),
        i = d * h;
    return i.toFixed(2)
}

function filterValidLongAppts(a) {
    if (root) {
        if (!root.user.isLongAppt()) return a;
        var b = _.chain(a).groupBy("doctor").map(function(a) {
            return _.chain(a).sortBy("when").filter(function(a, b, c) {
                return isValidLongAppt(a, b, c)
            }).value()
        }).flatten().value();
        return b
    }
}

function isValidLongAppt(a, b, c) {
    if (c.length < 2) return !1;
    if (c.length <= b + 1) return !1;
    var d = c[b + 1],
        e = moment(a.m).add(a.duration, "minutes").isSame(d.m);
    return e ? !0 : !1
}

function editPatientHacks(a, b) {
    function c(a, b, c) {
        var d = b + "" != "0",
            f = e.find("[name=" + a + "]");
        f.closest("[class^=col]").toggle(d);
        var g = d ? c : "";
        $("#patient-form").find("[name=" + a + "]").data("validators", g), f.attr("required", d), d || f.val("")
    }

    function d(a, b) {
        var c = "" !== b,
            d = e.find("[name=" + a + "]");
        d.attr("required", c), c || d.val("")
    }
    var e = $("#patient-form");
    c("pension_no", b.pension_type, ""), c("pension_exp", b.pension_type, "future_date"), c("dva_no", b.dva_type, "dva"), e.find("[name=pension_type]").on("change", function() {
        c("pension_no", $(this).val(), ""), c("pension_exp", $(this).val(), "future_date")
    }), e.find("[name=medicare_no]").on("change", function() {
        d("medicare_ref", $(this).val(), ""), d("medicare_exp", $(this).val(), "future_date")
    }), e.find("[name=dva_type]").on("change", function() {
        c("dva_no", $(this).val(), "dva")
    })
}

function displayRequireLongApptMessage() {
    if (scroll_to_top(), GlobalMessages.warn("The clinic requires that new patients start with a long appointment."), root.user.isLongAppt() === !1) {
        var a = $(".appt-length-select");
        throb(a), a.find(".appt-length-select__long").focus(), preventThrob = !0
    }
}

function confirmNewOrExistingPatientMessage() {
    scroll_to_top(), GlobalMessages.warn("Are you booking for a new or existing patient?"), throb($(".new-user-prelude"))
}

function sameOrigin(a) {
    var b = document.location.host,
        c = document.location.protocol,
        d = "//" + b,
        e = c + d;
    return a == e || a.slice(0, e.length + 1) == e + "/" || a == d || a.slice(0, d.length + 1) == d + "/" || !/^(\/\/|http:|https:).*/.test(a)
}

function safeMethod(a) {
    return /^(GET|HEAD|OPTIONS|TRACE)$/.test(a)
}

function setFeatureToggles(a) {
    var b = _.reduce(_.keys(a), function(b, c) {
        return /^has_/.test(c) && (b[c] = a[c]), b
    }, {});
    b.has_appointment_types && 0 === a.appointment_type.length && (b.has_appointment_types = !1), (b.has_long_appointments_new || b.has_appointment_types) && (b.has_long_appointments = !0), toggles(b)
}

function getFeatureTemplate(a, b, c) {
    return root && root.currentClinic() ? root.currentClinic()[a] ? b : c : "loadingTmpl"
}
DATE_FORMAT = "DD-MM-YYYY", EXPDATE_FORMAT = "MM-YYYY", TIME_FORMAT = "HH:mm", DAYTIME_FORMAT = "hh:mm a", DATE_MASK = "99/99/9999", EXPDATE_MASK = "99/9999", DATE_PLACEHOLDER = "dd/mm/yyyy", EXPDATE_PLACEHOLDER = "mm/yyyy", API_ROOT = "/api/v1/", MINIMUM_RANGE = .05, CHECKIN_WINDOW = 30;
var config = {
    selfArrive: !0
};
String.prototype.format = function(a) {
    return this.replace(/\{(\w+)\}/, function(b, c) {
        return a[c] || ""
    })
};
var preventThrob = !1;
validate_form.validators = {
    required: function(a, b) {
        var c = a.replace(/[\s]+/g, "");
        return c ? void 0 : (b.val(""), "This value is required.")
    },
    requires_checked: function(a, b) {
        return b.prop("checked") ? void 0 : "This value is required."
    },
    email: function(a) {
        return a ? /^.+@.+\..+$/.test(a) ? void 0 : "Must be a valid email address." : void 0
    },
    match: function(a, b) {
        if (a) {
            var c = b.attr("data-validator-match"),
                d = b.closest("form").find("[name=" + c + "]"),
                e = d.closest("[class^=col]").find("label").text(),
                f = d.val(),
                g = a === f;
            return g ? void 0 : "Must match " + e + "."
        }
    },
    past_date: function(a, b) {
        if (a) {
            var c = b.data("datefmt");
            if ("undefined" == typeof c) return "Date format is not defined.";
            var d = moment(a, c, !0);
            return d.isValid() ? d.isAfter(moment()) ? "Date must be in the past" : void 0 : "Date is invalid"
        }
    },
    future_date: function(a, b) {
        if (a) {
            var c = b.data("datefmt");
            if ("undefined" == typeof c) return "Date format is not defined";
            var d = moment(a, c, !0);
            return d.isValid() ? d.isBefore(moment()) ? "Date must be in the future" : void 0 : "Date is invalid"
        }
    },
    earliest_date_of_birth: function(a, b) {
        if (a) {
            var c = b.data("datefmt"),
                d = moment(a, c, !0),
                e = moment().subtract(150, "year");
            return d.isBefore(e) ? "Date of Birth is incorrect" : void 0
        }
    },
    medicare: function(a, b) {
        var a = a.replace(/\D/g, "");
        if (b.val(a), a) {
            var c = ["0000000000", "1231231231", "3146040468", "3449899112", "4249088814", "3168284042", "3288416428", "2064564387", "3183511221", "3146040468", "3449899112", "4249088814", "3168284042", "3288416428", "2064564387", "3183511221", "3365889132", "3286626587", "3269988016", "3387101368", "3123113849", "2693167712", "3110608699", "343318354", "4224270309", "3327298775", "3403611173", "3329590812", "3382103539", "3374120958", "3361107496", "3212313746", "3272919477", "4283364489", "3340554175", "3376211525", "3327298775", "3403611171", "3301061067", "3331712975", "3116864383", "3384854146", "3368049388", "3321009717", "3418963485", "3265045121", "3158552899", "3321009717", "3326121595", "3346437979", "3331595188", "3212313748", "3460168022", "3411083974", "3376809791", "3361107497", "2517710435", "3221094702", "6006341112", "3421604484", "3260809113", "3382236456", "3274340453", "3388686025", "4224270309", "3286614247", "3444046943", "3223722528", "3174669714", "3260984397", "3374120958", "3184390446", "3372789764", "2504626987", "3370474597", "3408167875", "3275308026", "3334197336", "2504626987", "3461147264", "3415326714", "3269901994", "3273337516", "3388686022", "3329590814", "3314884323", "3274340453", "3384854147", "3433097906", "3111420664", "3388686022", "3376809791", "3139650728", "3212313746", "3403611172", "3380219887", "6007701675", "3315239627", "3299094533", "3077215787", "3207114042", "3382520521", "3185518658", "3282551371", "3295278516", "3029060791", "3340515036", "3103541167", "3435627844", "3191542631", "3373017286", "3409009274", "3322776314", "3348024332", "3278458412", "3218580437", "3278458412", "3341395316", "3358007175", "3298068808", "3425005544", "3173087507", "3900265962", "3012607589", "3356303233", "3025362347", "3447340012", "3171063588", "3468048702", "3112984022", "3287663859", "3287663859", "3287663859", "3287663859", "3275814668", "2573709123", "3239009593", "3178127671", "3214915181", "3132931911", "3432187803", "3364470784", "3424978384", "3017408679", "3311095555", "3181387704", "3147835457", "3138429208", "3225628067", "3265605252", "3210816364", "2463896006", "3149117177", "3165158967", "3165452243", "3349960626", "3009634618", "3196115571", "3352287644", "3171008739", "3334750748", "4199048636", "3460767291", "3221884843", "3278008155", "3006452468", "3296137698", "3262184486", "3205648538", "2460755766", "3370474591", "3456574532", "3901194326", "3323906134", "3452078232", "2537202987", "3409950373", "3316611188"];
            if (_.contains(c, a)) return "Not a valid medicare number.";
            var d = [1, 3, 7, 9, 1, 3, 7, 9];
            if (10 != a.length) return "Must be 10 digits long.";
            for (var e = 0, f = parseInt(a[8], 10), g = 0; 8 > g; g++) e += d[g] * parseInt(a[g], 10);
            return e % 10 !== f ? "Not a valid medicare number." : void 0
        }
    },
    postcode: function(a) {
        if (a) {
            var b = /^\d{3,4}$/;
            return b.test(a) ? void 0 : "Must be a valid postcode."
        }
    },
    dva: function(a) {
        var b = a.replace(/[\s\(\)]+/g, "");
        if (b) return b.match(/^[NVQWST]/i) ? b.match(/^([NVQWST])([a-z]\d{2}|[a-z]{2}\d|[a-z]{3})(\d{4})([a-z]?)$/i) ? void 0 : "Please check the card number." : "The first character must be the state code (a letter)."
    },
    phone_number: function(a) {
        var b = a.replace(/[\s\(\)]+/g, "");
        if (b) return b.match(/^\+/) ? "Please enter the area code without the internation prefix (eg 03 xxxx xxxx)." : b.match(/^\d{8}$/) ? "Please include your area code." : b.match(/^\d{10}$/) ? void 0 : "Must be a valid phone number."
    },
    mobile_number: function(a) {
        var b = a.replace(/\s+/g, "");
        if (b) return b.match(/^\+/) ? "Please enter the number in local format (eg 04xx xxx xxx)." : b.match(/^04\d{8}$/) ? void 0 : "Must be a valid mobile phone number."
    },
    regex: function(a, b) {
        var c = a.replace(/\s+/g, "");
        if (c) {
            var d = new RegExp(b.attr("data-validator-regex"), "");
            return c.match(d) ? void 0 : "There was a problem with this field."
        }
    }
}, Form.prototype = {
    clear: function() {
        $.isFunction(this.beforeClear) && this.beforeClear.call(this), this.$form[0].reset(), this.clear_errors(), $.isFunction(this.afterClear) && this.afterClear.call(this), placeholder_freshen()
    },
    load_record: function(a) {
        var b = this.$el.find("[name]");
        $.isFunction(this.beforeLoadRecord) && this.beforeLoadRecord.call(this, a, b), b.each(function() {
            var b = _.result(a, this.name),
                c = $(this).data("datefmt");
            void 0 !== c && (b = moment(b).format(c)), $(this).val(void 0 === b ? "" : b)
        }), $.isFunction(this.afterLoadRecord) && this.afterLoadRecord.call(this, a, b), placeholder_freshen()
    },
    clear_errors: function() {
        $.isFunction(this.beforeClearErrors) && this.beforeClearErrors.call(this), this.$el.find(".has-error .help-block").remove(), this.$el.find(".has-error").removeClass("has-error"), $.isFunction(this.afterClearErrors) && this.afterClearErrors.call(this)
    },
    set_errors: function(a) {
        this.clear_errors(), $.isFunction(this.beforeSetErrors) && this.beforeSetErrors.call(this, a), _.each(a, function(a, b) {
            var c = this.$el.find("[name=" + b + "]");
            c.closest("[class^=col-]").addClass("has-error"), _.each(a, function(a) {
                var b = c.closest(".placeholder__wrapper");
                b.length > 0 ? b.after('<div class="help-block">' + a + "</div>") : c.after('<div class="help-block">' + a + "</div>")
            })
        }, this), $.isFunction(this.afterSetErrors) && this.afterSetErrors.call(this, a)
    },
    validate: function() {
        this.clear_errors(), $.isFunction(this.beforeValidate) && this.beforeValidate.call(this);
        var a = validate_form(this.$el);
        return $.isFunction(this.afterValidate) && this.afterValidate.call(this, a), a
    },
    focus: function() {
        this.$el.find("[name]").first().focus()
    },
    mark_required_fields: function() {
        this.$el.find("[required]").each(function() {
            var a = $(this);
            if ("select-one" === a[0].type) {
                var b = a.children().first(),
                    c = b.text();
                b.text(c + " *")
            } else {
                var d = a.attr("placeholder");
                a.attr("placeholder", d + " *")
            }
        })
    }
};
var Messages = function(a) {
    this.$container = $(a), this.dismissButton = '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
};
Messages.prototype.addMessage = function(a, b) {
    if (this.clear(), a) {
        var c = $("<div></div>").html(a),
            d = $("<div></div>").addClass("alert alert-" + b + " alert-dismissable").append($(this.dismissButton)).append(c);
        d.appendTo(this.$container)
    }
    return this
}, Messages.prototype.success = function(a) {
    return this.addMessage(a, "success")
}, Messages.prototype.failure = function(a) {
    return this.addMessage(a, "danger")
}, Messages.prototype.info = function(a) {
    return this.addMessage(a, "info")
}, Messages.prototype.warn = function(a) {
    return this.addMessage(a, "warning")
}, Messages.prototype.clear = function() {
    return this.$container.html(""), this
};
var Page = function(a) {
    this.root = a
};
Page.prototype = {
    onSelect: function() {},
    onRender: function() {}
};
var Account = function() {
    Page.apply(this, arguments), this.tmpl = "accountTmpl"
};
Account.prototype = Object.create(Page.prototype), Account.prototype.constructor = Account, Appointments = function() {
    Page.apply(this, arguments), this.tmpl = "appointmentsTmpl", this.needLocation = ko.observable(!1), this.locationError = ko.observable(0), this.locationTimer = 0, this.minimumRange = 1e3 * MINIMUM_RANGE + "m"
}, Appointments.prototype = Object.create(Page.prototype), Appointments.prototype.constructor = Appointments, Appointments.prototype.onSelect = function() {
    root.loading(!0), root.activateSelfArrive() && (this.timer = window.setInterval(this.updateTime.bind(this), 2e3), this.updateTime()), this.root.user.fetchBookings(function() {
        root.activateSelfArrive() && this.getLocation(), root.loading(!1)
    }.bind(this))
}, Appointments.prototype.onExit = function() {
    this.geo_task && (navigator.geolocation.clearWatch(this.geo_task), this.geo_task = void 0, this.timer = window.clearInterval(this.timer))
}, Appointments.prototype.updateTime = function() {
    _.each(root.user.bookings(), function(a) {
        a.timeUntil(timeUntilAppointment(a))
    })
}, Appointments.prototype.getLocation = function() {
    if (navigator.geolocation && this.needLocation()) {
        var a = {
            enableHighAccuracy: !0,
            timeout: 5e3,
            maximumAge: 9e3
        };
        this.geo_task = navigator.geolocation.watchPosition(this.locationUpdate.bind(this), this.locationFailed.bind(this), a)
    }
    var b = 5e3;
    this.locationTimerId = window.setInterval(function() {
        this.needLocation() && null === root.user.position() ? (this.locationTimer += b, this.locationTimer >= b && 0 === this.locationError() && (root.user.geolocating(!1), this.locationError(4))) : clearTimeout(this.locationTimerId)
    }.bind(this), b)
}, Appointments.prototype.locationUpdate = function(a) {
    root.user.position(a.coords), this.locationError(0), root.user.geolocating(!1)
}, Appointments.prototype.locationFailed = function(a) {
    root.user.position(null), root.user.geolocating(!1), 1 == a.code ? (console.warn("The user didn't permit us to get location", a), this.locationError(1)) : 3 == a.code ? (console.warn("Geolocation timed out", a), this.locationError(3)) : (console.warn("There was an error getting the user's location", a), this.locationError(2))
};
var Appt = function(a) {
        $.extend(this, a), this.when = this.date, this.m = moment(this.date), this.date = this.m.format(DATE_FORMAT), this.time = this.m.format(DAYTIME_FORMAT)
    },
    Calendar = function() {
        var a = this;
        this.$confirm = $("#confirm"), Page.apply(this, arguments), this.tmpl = "calendarTmpl", this.selectedDoctorCode = ko.observable(), this.selectedDate = ko.observable(), this.displayDate = ko.computed(function() {
            return moment(this.selectedDate(), DATE_FORMAT).format("D MMM")
        }, this), this.selectedTime = ko.observable(), this.selectedDoctorCode = ko.observable(), this.selectedDoctor = ko.computed(function() {
            return this.root.doctor_map()[this.selectedDoctorCode()]
        }, this), this.doctorShortName = ko.computed(function() {
            if (void 0 === this.selectedDoctor()) return void 0;
            var a = "Dr ",
                b = this.selectedDoctor().name.split(" ").slice(1).join(" ");
            return "Doctor" != this.practitionerTitle() && (a = "", b.length < 20 && (b = this.selectedDoctor().name)), a + b
        }, this), this.practitionerTitle = ko.computed(function() {
            return this.root.currentClinic() && this.root.currentClinic().practitioner_title.length > 0 ? this.root.currentClinic().practitioner_title : void 0
        }, this), this.selectedPractitionerTitle = ko.computed(function() {
            return this.selectedDoctor() ? this.doctorShortName() : this.practitionerTitle()
        }, this), this.practitionerHeadingText = ko.computed(function() {
            var a = this.practitionerTitle();
            return "undefined" == typeof a && (a = "Practitioner"), "Select " + a
        }, this), this.bookingComplete = ko.computed(function() {
            var a = void 0 !== this.selectedDoctorCode() && void 0 !== this.selectedDate() && void 0 !== this.selectedTime();
            return a
        }, this), this.bookingConfirmed = ko.observable(!1), this.setSelectedDoctor = function(b) {
            if (_.contains(a.filteredDoctors(), b.doctor_code))
                if (a.selectedDoctorCode() == b.doctor_code) a.selectedDoctorCode(void 0);
                else {
                    a.selectedDoctorCode(b.doctor_code);
                    var c = a.filteredAppts().length,
                        d = a.filteredAppts().length;
                    _.each(a.filteredAppts(), function(b) {
                        _.contains(b, a.selectedTime()) || d--, _.contains(b, a.selectedDate()) || c--
                    }), c || a.selectedDate(void 0), d || a.selectedTime(void 0)
                }
        }, this.setSelectedDate = function(b, c) {
            var d = $(c.target).data("date");
            if ($(c.target).hasClass("available"))
                if (a.selectedDate() == d) a.selectedDate(void 0), a.selectedTime(void 0);
                else {
                    a.selectedDate(d);
                    var e = a.filteredAppts().length,
                        f = a.filteredAppts().length;
                    _.each(a.filteredAppts(), function(b) {
                        _.contains(b, a.selectedTime()) || f--, _.contains(b, a.selectedDoctorCode()) || e--
                    }), e || a.selectedDoctorCode(void 0), f || a.selectedTime(void 0)
                }
        }, this.setSelectedTime = function(b) {
            if (toggles().has_long_appointment_new) {
                if (root.user.declaredNewPatient() === !1) return confirmNewOrExistingPatientMessage(), void a.selectedTime(void 0);
                if (root.user.isNewPatient() === !0 && root.user.isLongAppt() === !1) return displayRequireLongApptMessage(), void a.selectedTime(void 0)
            }
            _.contains(a.filteredTimes(), b) && a.selectedTime(a.selectedTime() == b ? void 0 : b)
        }, this.appointmentList = ko.observableArray([]), this.filteredDoctors = ko.computed(function() {
            var a = this.appointmentList();
            return (root && root.user && root.user.isLongAppt() || toggles().has_long_appointment) && (a = filterValidLongAppts(a)), a = _.chain(a).map(function(a) {
                return root.selectedClinic() != a.clinic_id || this.selectedDate() && this.selectedDate() != a.date || this.selectedTime() && this.selectedTime() != a.time ? void 0 : a
            }, this).compact().sortBy("doctor").pluck("doctor").uniq(!0).value()
        }, this), this.filteredDates = ko.computed(function() {
            var a = this.appointmentList();
            return (root && root.user && root.user.isLongAppt() || toggles().has_long_appointment) && (a = filterValidLongAppts(a)), a = _.chain(a).map(function(a) {
                return root.selectedClinic() != a.clinic_id || this.selectedTime() && this.selectedTime() != a.time || this.selectedDoctorCode() && this.selectedDoctorCode() != a.doctor ? void 0 : a
            }, this).compact().sortBy("date").pluck("date").uniq(!0).value()
        }, this), this.filteredTimes = ko.computed(function() {
            var a = this.appointmentList();
            return (root && root.user && root.user.isLongAppt() || toggles().has_long_appointment) && (a = filterValidLongAppts(a)), a = _.chain(a).map(function(a) {
                return root.selectedClinic() != a.clinic_id || this.selectedDate() && this.selectedDate() != a.date || this.selectedDoctorCode() && this.selectedDoctorCode() != a.doctor ? void 0 : a
            }, this).compact().sortBy("when").pluck("time").uniq(!0).value()
        }, this), this.filteredAppts = ko.computed(function() {
            var a = this.appointmentList();
            return (root && root.user && root.user.isLongAppt() || toggles().has_long_appointment) && (a = filterValidLongAppts(a)), a = _.chain(a).map(function(a) {
                return root.selectedClinic() != a.clinic_id || this.selectedDoctorCode() && this.selectedDoctorCode() != a.doctor || this.selectedDate() && this.selectedDate() != a.date || this.selectedTime() && this.selectedTime() != a.time ? void 0 : a
            }, this).compact().sortBy("when").uniq(!0).value()
        }, this), this.filteredAppts.subscribe(function() {
            if (preventThrob) return void(preventThrob = !1);
            var a;
            a = $(void 0 === this.selectedDate() ? ".booking-info button[name=date]" : void 0 === this.selectedTime() ? ".booking-info button[name=time]" : void 0 === this.selectedDoctorCode() ? ".booking-info button[name=doctor]" : ".booking-info button[name=confirm]"), throb(a)
        }, this), this.selectFirstAvailable = function() {
            if (toggles().has_long_appointment_new && !root.user.declaredNewPatient()) return void confirmNewOrExistingPatientMessage();
            var b = a.filteredAppts()[0];
            return void 0 === b ? void GlobalMessages.warn("Sorry, there were no appointments available with your current filters, please try clearing filters.") : (a.selectedDoctorCode(b.doctor), a.selectedDate(b.date), void a.selectedTime(b.time))
        }, this.clearBooking = function() {
            a.resetBooking(), a.$confirm.modal("hide")
        }
    };
Calendar.prototype = Object.create(Page.prototype), Calendar.prototype.constructor = Calendar, Calendar.prototype.onSelect = function() {
    this.fetchData(), this.resetBooking()
}, Calendar.prototype.onRender = function() {
    $(".booking-info").sticky({
        topSpacing: 10
    })
}, Calendar.prototype.fetchData = function() {
    $.ajax({
        url: "/api/v1/appointment/",
        type: "GET",
        cache: !1,
        success: $.proxy(function(a) {
            this.appointmentList(_.map(a.objects, function(a) {
                return new Appt(a)
            }))
        }, this),
        error: function(a) {
            console.warn("Calendar update failed", a)
        }
    })
}, Calendar.prototype.confirmBooking = function() {
    return this.root.user.isAuthenticated() ? (this.$confirm.modal("show"), void this.$confirm.one("hide.bs.modal", $.proxy(function() {
        this.bookingConfirmed() && (this.fetchData(), this.resetBooking())
    }, this))) : (root.user.showLogin(), void root.user.$login.one("hide.bs.modal", function() {
        this.root.user.isAuthenticated() && this.confirmBooking()
    }.bind(this)))
}, Calendar.prototype.makeBooking = function() {
    var a = this.filteredAppts()[0],
        b = {
            patient_id: $("#patient").val()
        };
    toggles().has_long_appointment && (b.long_appt = root.user.isLongAppt()), toggles().has_appointment_type && (b.appt_type = root.user.apptType()), $.ajax({
        url: "/api/v2/timeslot/" + a.id + "/",
        type: "POST",
        data: b
    }).done(function() {
        this.bookingConfirmed(!0)
    }.bind(this)).fail(function(a) {
        var b = a.status >= 200 && !a.status <= 300;
        b || (a.error ? GlobalMessages.addMessage(error, "danger") : GlobalMessages.addMessage("Sorry, there was a problem with your booking, please try to book the appointment again.", "danger"), this.$confirm.modal("hide"), this.fetchData(), this.resetBooking())
    }.bind(this))
}, Calendar.prototype.cancelConfirm = function() {
    this.$confirm.modal("hide")
}, Calendar.prototype.resetBooking = function() {
    this.selectedDoctorCode(void 0), this.selectedDate(void 0), this.selectedTime(void 0), this.bookingConfirmed(!1)
};
var PasswordReset = function() {
    var a = this;
    Page.apply(this, arguments), this.tmpl = "resetPasswordTmpl", this.$modal = $("#forgot-password"), this.form = new Form("#forgot-password"), this.onRender = function() {
        a.setContent("show-form"), placeholder_ie9()
    }
};
PasswordReset.prototype = Object.create(Page.prototype), PasswordReset.prototype.constructor = PasswordReset, PasswordReset.prototype.setContent = function(a) {
    var b = $("#reset-password");
    b.find(".show-form")["show-form" == a ? "show" : "hide"](), b.find(".success")["success" == a ? "show" : "hide"](), b.find(".bad-token")["bad-token" == a ? "show" : "hide"]()
}, PasswordReset.prototype.setToken = function(a, b) {
    this.uid = a, this.token = b, $.ajax({
        url: "/accounts/reset/" + a + "/" + b + "/",
        type: "GET",
        complete: $.proxy(function(a) {
            200 != a.status && this.setContent("bad-token")
        }, this)
    })
}, PasswordReset.prototype.resetPassword = function() {
    var a = new Form("#reset_password"),
        b = a.validate();
    return b.valid ? void $.ajax({
        url: "/accounts/reset/" + this.uid + "/" + this.token + "/",
        type: "POST",
        data: $("#reset_password").serialize(),
        success: $.proxy(function() {
            this.setContent("success"), this.uid = void 0, this.token = void 0
        }, this),
        error: $.proxy(function(b) {
            a.set_errors(b.responseJSON)
        }, this)
    }) : void a.set_errors(b.errors)
}, PasswordReset.prototype.forgotPassword = function() {
    var a = this.form.validate();
    return a.valid ? void $.ajax({
        url: "/accounts/forgot/",
        type: "POST",
        data: {
            email: a.values.email
        },
        success: $.proxy(function() {
            this.$modal.find(".before").hide(), this.$modal.find(".after").show()
        }, this),
        error: $.proxy(function(a) {
            this.form.set_errors(a.responseJSON)
        }, this)
    }) : void this.form.set_errors(a.errors)
}, PasswordReset.prototype.showForgotPassword = function() {
    this.form.clear(), this.$modal.find(".before").show(), this.$modal.find(".after").hide()
};
var User = function() {
    function a() {
        i.$patient_form.data("patient", "0"), i.forms.patient.clear(), i.$patient_form.find("h2").text("Add family member"), i.$patient_form.one("shown.bs.modal", function() {
            i.forms.patient.focus(), $("#patient_form [name=dob]").mask(DATE_MASK, {
                placeholder: DATE_PLACEHOLDER
            }), $("#patient_form [name=medicare_exp], #editPatient [name=pension_exp]").mask(DATE_MASK, {
                placeholder: EXPDATE_PLACEHOLDER
            })
        }).modal("show")
    }

    function b() {
        i.$patient_form.data("patient", "0"), i.forms.patient.clear(), i.$patient_form.find("h2").text("Add family member"), $("#editPatient").wizard("selectedItem", {
            step: 1
        }), i.$patient_form.one("shown.bs.modal", function() {
            i.forms.patient.focus(), $("#editPatient [name=dob]").mask(DATE_MASK, {
                placeholder: DATE_PLACEHOLDER
            }), $("#editPatient [name=medicare_exp], #editPatient [name=pension_exp]").mask(EXPDATE_MASK, {
                placeholder: EXPDATE_PLACEHOLDER
            })
        }).on("actionclicked.fu.wizard", $.proxy(function(a, b) {
            if ("previous" !== b.direction) {
                var c = $(a.target).find('.step-content [data-step="' + b.step + '"]'),
                    d = validate_form(c);
                if (!d.valid) return a.preventDefault(), i.forms.patient.set_errors(d.errors), show_first_error(i.forms.patient), void c.find(".has-error [name]").first().focus();
                i.forms.patient.clear_errors()
            }
        }, i)).modal("show"), $("#editPatient").on("finished.fu.wizard", i.savePatient.bind(i))
    }

    function c() {
        var a = i.$patient_form;
        a.data("patient", this.id), i.forms.patient.load_record(this), a.find("h2").text("Edit family member"), a.one("shown.bs.modal", function() {
            i.forms.patient.focus(), $("#patient_form [name=dob]").mask(DATE_MASK, {
                placeholder: DATE_PLACEHOLDER
            }), $("#patient_form [name=medicare_exp], #editPatient [name=pension_exp]").mask(DATE_MASK, {
                placeholder: EXPDATE_PLACEHOLDER
            })
        }).modal("show")
    }

    function d() {
        var a = i.$patient_form,
            b = this;
        a.data("patient", b.id), i.forms.patient.load_record(b), a.find("h2").text("Edit family member"), $("#editPatient").wizard("selectedItem", {
            step: 1
        }), a.one("shown.bs.modal", function() {
            i.forms.patient.focus(), $("#editPatient [name=dob]").mask(DATE_MASK, {
                placeholder: DATE_PLACEHOLDER
            }), $("#editPatient [name=medicare_exp], #editPatient [name=pension_exp]").mask(EXPDATE_MASK, {
                placeholder: EXPDATE_PLACEHOLDER
            }), editPatientHacks(i, b)
        }).on("actionclicked.fu.wizard", $.proxy(function(a, b) {
            if ("previous" !== b.direction) {
                var c = $(a.target).find('.step-content [data-step="' + b.step + '"]'),
                    d = validate_form(c);
                if (!d.valid) return a.preventDefault(), i.forms.patient.set_errors(d.errors), show_first_error(i.forms.patient), void c.find(".has-error [name]").first().focus();
                i.forms.patient.clear_errors()
            }
        }, i)).modal("show"), $("#editPatient").on("finished.fu.wizard", i.savePatient.bind(i))
    }

    function e() {
        i.forms.user.load_record(this), i.$user_form.one("shown.bs.modal", function() {
            i.forms.user.focus()
        }).modal({})
    }

    function f() {
        i.forms.user.load_record(this), i.$user_form.one("shown.bs.modal", function() {
            i.forms.user.focus()
        }).modal({})
    }

    function g() {
        i.forms.register.clear(), $("#loginregister").one({
            "show.bs.modal": function() {
                $('.nav-tabs [href="#register"]').tab("show")
            },
            "shown.bs.modal": function() {
                i.forms.register.focus()
            },
            "shown.bs.tab": function() {
                i.forms.register.focus(), $("#registerForm [name=dob]").mask(DATE_MASK, {
                    placeholder: DATE_PLACEHOLDER
                }), $("#registerForm [name=medicare_exp], #registerWizard [name=pension_exp]").mask(EXPDATE_MASK, {
                    placeholder: EXPDATE_PLACEHOLDER
                })
            }
        }).modal("show")
    }

    function h() {
        i.forms.register.clear(), i.hasPension(!1), i.hasDVA(!1), i.hasInsurance(!1), i.extRegoStep2Label || (i.extRegoStep2Label = i.$login.find('.steps [data-step="2"] .title').html(), i.extRegoStep2 = i.$login.find('.step-content [data-step="2"]').html(), i.extRegoStep3Label = i.$login.find('.steps [data-step="3"] .title').html(), i.extRegoStep3 = i.$login.find('.step-content [data-step="3"]').html()), $("#loginregister").one({
            "show.bs.modal": function() {
                $('.nav-tabs [href="#register"]').tab("show"), $("#registerWizard").wizard("selectedItem", {
                    step: 1
                })
            },
            "shown.bs.modal": function() {
                i.forms.register.focus()
            },
            "shown.bs.tab": function() {
                i.forms.register.focus(), $("#registerForm [name=dob]").mask(DATE_MASK, {
                    placeholder: DATE_PLACEHOLDER
                }), $("#registerForm [name=medicare_exp], #registerWizard [name=pension_exp]").mask(EXPDATE_MASK, {
                    placeholder: EXPDATE_PLACEHOLDER
                })
            }
        }).on({
            "actionclicked.fu.wizard": function(a, b) {
                if ("previous" !== b.direction) {
                    var c = $(a.target).find('.step-content [data-step="' + b.step + '"]'),
                        d = validate_form(c);
                    if (!d.valid) return a.preventDefault(), i.forms.register.set_errors(d.errors), show_first_error(i.forms.register), void c.find(".has-error [name]").first().focus();
                    i.forms.register.clear_errors()
                }
            }.bind(i)
        }).modal("show"), $("#registerWizard").on("finished.fu.wizard", i.register.bind(i)), $("#editPatient").on("finished.fu.wizard", i.savePatient.bind(i))
    }
    var i = this;
    this.$login = $("#loginregister"), this.$user_form = $("#user-form"), this.$patient_form = $("#patient-form"), this.forms = {
        login: new Form("#loginForm"),
        register: new Form("#register"),
        user: new Form(this.$user_form),
        patient: new Form(this.$patient_form)
    }, this.formSubmitted = ko.observable(!1), this.name = ko.observable(), this.email = ko.observable(), this.phone = ko.observable(), this.phone_home = ko.observable(), this.phone_work = ko.observable(), this.address_building = ko.observable(), this.address_street = ko.observable(), this.address_suburb = ko.observable(), this.address_postcode = ko.observable(), this.hasPension = ko.observable(!1), this.setPensionType = function() {
        var a = this.$login.find("#pension_type").val();
        this.hasPension("0" !== a)
    }, this.hasDVA = ko.observable(!1), this.setDVAType = function() {
        var a = this.$login.find("#dva_type").val();
        this.hasDVA("0" !== a)
    }, this.hasMedicare = ko.observable(!1), this.setHasMedicare = function() {
        var a = this.$login.find("#medicare_no").val();
        this.hasMedicare("" !== a)
    }, this.hasInsurance = ko.observable(!1), this.position = ko.observable(null), this.geolocating = ko.observable(!0), this.patients = ko.observableArray([]), this.bookings = ko.observableArray([]), this.isNewPatient = ko.observable(null), this.isNewPatient.subscribe(function(a) {
        if (toggles().has_long_appointment_new)
            if (a === !0) displayRequireLongApptMessage(), i.isLongAppt() === !1 && i.isLongAppt(!0);
            else if (toggles().has_appointment_types) {
            var b = root.currentClinic(),
                c = _.findWhere(b.appointment_type, {
                    is_preselected: !0
                });
            i.appointmentType(c.id)
        }
    }), this.declaredNewPatient = ko.observable(!1), this.isLongAppt = ko.observable(!1), this.isLongAppt.subscribe(function(a) {
        if (a === !0) {
            var b = root.screens.calendar;
            _.contains(filterValidLongAppts(b.appointmentList()), b.filteredAppts()[0]) || b.resetBooking()
        }
        if (toggles().has_long_appointment_new && i.declaredNewPatient() === !0 && i.isNewPatient() === !0 && (i.isLongAppt() === !1 && (displayRequireLongApptMessage(), i.isLongAppt(!0)), toggles().has_appointment_types)) {
            var c = root.currentClinic().new_patient_default_appointment_type;
            if (!c) throw new Error("No new_patient_default_appointment_type is set");
            i.appointmentType(c)
        }
    }), this.appointmentType = ko.observable(null), this.appointmentType.subscribe(function(a) {
        var b = _.findWhere(root.currentClinic().appointment_type, {
            id: a
        });
        b && i.isLongAppt(2 == b.length)
    }), this.disableApptSelect = ko.computed(function() {
        return toggles().has_long_appointment_new ? root && root.currentClinic() && !root.currentClinic().new_patient_default_appointment_type ? !1 : i.declaredNewPatient() && i.isNewPatient() ? !0 : !1 : !1
    }), this.extRegoFeedback = ko.observable(""), this.isAuthenticated = ko.observable(!1), this.isAuthenticated.subscribe(function(a) {
        a && GlobalMessages.success("Please make sure your details are kept up to date!")
    }), ko.computed(function() {
        i.addPatient = toggles().has_extended_registration ? b : a, i.editPatient = toggles().has_extended_registration ? d : c, i.editUser = toggles().has_extended_registration ? f : e, i.showRegister = toggles().has_extended_registration ? h : g
    }), this.editPatientCancel = function() {
        i.$patient_form.modal("hide")
    }, this.editUserCancel = function() {
        i.$user_form.modal("hide")
    }, this.setNewPatientTrue = function() {
        i.declaredNewPatient(!0), i.isNewPatient(!0)
    }, this.setNewPatientFalse = function() {
        i.declaredNewPatient(!0), i.isNewPatient(!1), GlobalMessages.clear()
    }, this.toggleNewPatient = function() {
        var a = !i.isNewPatient();
        a === !1 && GlobalMessages.clear(), i.isNewPatient(a)
    }, this.setShortAppt = function() {
        i.isLongAppt(!1)
    }, this.setLongAppt = function() {
        i.isLongAppt(!0)
    }, this.logout = function() {
        $.ajax({
            url: "/accounts/logout/",
            type: "GET",
            success: function() {
                i.isAuthenticated(!1), GlobalMessages.clear().success("You have successfully logged out.")
            },
            error: function() {
                GlobalMessages.clear().failure("There was a problem logging you out, please try again.")
            }
        })
    }, this.cancelBooking = function() {
        $.ajax({
            url: "/api/v1/booking/object/" + this.id + "/cancel/",
            type: "POST",
            success: i.fetchBookings.bind(i),
            error: i.fetchBookings.bind(i)
        })
    }, this.showLogin = function() {
        i.forms.login.clear(), $(".login-alert").addClass("hide"), $("#loginregister").one({
            "show.bs.modal": function() {
                $('.nav-tabs [href="#login"]').tab("show")
            },
            "shown.bs.modal": function() {
                i.forms.login.focus()
            },
            "shown.bs.tab": function() {
                i.forms.login.focus()
            }
        }).modal("show")
    }
};
if (User.prototype.removeNewPatientFields = function() {
        var a = this.user;
        a.isNewPatient() !== !1 && (a.isNewPatient(!1), a.extRegoFeedback("Thanks, that simplifies things!"), a.$login.toggleClass("existing-patient", !0).wizard("removeSteps", 2, 2), scroll_to("#registerForm .actions"))
    }, User.prototype.resetNewPatientFields = function() {
        var a = this.user;
        return a.extRegoFeedback("Thanks, please continue through the form"), scroll_to("#registerForm .actions"), null === a.isNewPatient() ? void a.isNewPatient(!0) : void(a.isNewPatient() !== !0 && (a.isNewPatient(!0), a.$login.toggleClass("existing-patient", !1).wizard("addSteps", 2, [{
            badge: "",
            label: a.extRegoStep2Label,
            pane: a.extRegoStep2
        }, {
            badge: "",
            label: a.extRegoStep3Label,
            pane: a.extRegoStep3
        }])))
    }, User.prototype.login = function() {
        if ($(".login-alert").addClass("hide"), !this.isAuthenticated()) {
            var a = this.forms.login.validate();
            return a.valid ? void $.ajax({
                url: "/accounts/login/",
                type: "POST",
                data: {
                    username: this.email(),
                    password: $("#password").val()
                },
                success: function(a) {
                    GlobalMessages.success("You have successfully logged in."), this.loginSuccessHandler(a), this.fetchPatients()
                }.bind(this),
                error: this.loginFailureHandler.bind(this)
            }) : void this.forms.login.set_errors(a.errors)
        }
    }, User.prototype.register = function() {
        if (!this.isAuthenticated()) {
            var a = this.forms.register.validate();
            if (!a.valid) return this.forms.register.set_errors(a.errors), void show_first_error("#registerWizard");
            var b = {
                new_patient: this.isNewPatient
            };
            $.ajax({
                url: "/accounts/register/",
                type: "POST",
                data: $("#registerForm").serialize() + "&" + $.param(b),
                success: function() {
                    GlobalMessages.success("You have successfully registered."), this.isAuthenticated(!0), $("#loginregister").modal("hide"), this.fetchDetails(), this.fetchPatients()
                }.bind(this),
                error: function(a) {
                    this.forms.register.set_errors(a.responseJSON), show_first_error("#registerWizard")
                }.bind(this)
            })
        }
    }, User.prototype.fetchDetails = function() {
        return $.ajax({
            url: "/accounts/login/",
            type: "GET"
        }).then(function(a) {
            return this.fetchPatients(), this.fetchBookings(), a ? $.when([this.loginSuccessHandler(a)]) : void console.warn("Not logged in")
        }.bind(this)).fail(this.loginFailureHandler.bind(this)).always(function() {
            root.loading(!1)
        })
    }, User.prototype.loginSuccessHandler = function(a) {
        _(a).each(function(a, b) {
            try {
                this[b](a)
            } catch (c) {}
        }, this), this.isAuthenticated(!0), $("#loginregister").modal("hide")
    }, User.prototype.loginFailureHandler = function(a) {
        var b = "Login attempt failed. Please try again.";
        a && a.responseJSON && a.responseJSON.__all__ && (b = a.responseJSON.__all__[0]), $(".login-alert").html(b).removeClass("hide")
    }, User.prototype.saveUser = function() {
        if (this.isAuthenticated()) {
            var a = this.forms.user.validate();
            return a.valid ? $.ajax({
                url: "/accounts/update/",
                type: "POST",
                data: this.$user_form.find("form").serialize()
            }).then(function(a) {
                this.loginSuccessHandler(a), this.$user_form.modal("hide")
            }.bind(this)).fail(function(a) {
                this.forms.user.set_errors(a.responseJSON)
            }) : void this.forms.user.set_errors(a.errors)
        }
    }, User.prototype.fetchPatients = function() {
        return $.ajax({
            url: "/api/v1/patient/",
            type: "GET"
        }).then(function(a) {
            this.patients(a.objects)
        }.bind(this)).fail(function(a) {
            console.warn(a, arguments)
        })
    }, User.prototype.savePatient = function() {
        if (!this.formSubmitted()) {
            this.formSubmitted(!0);
            var a = this.$patient_form,
                b = this.forms.patient.validate();
            if (!b.valid) return void this.forms.patient.set_errors(b.errors);
            var c = a.data("patient");
            $.ajax({
                url: "/api/v1/patient/" + ("0" == c ? "" : "object/" + c + "/"),
                type: "POST",
                data: a.find("form").serialize(),
                success: function() {
                    this.fetchPatients(), a.modal("hide"), this.formSubmitted(!1)
                }.bind(this),
                error: function(a) {
                    var b = $("#editPatient");
                    this.forms.patient.set_errors(a.responseJSON);
                    var c = b.find(".has-error").first().closest(".step-pane");
                    b.wizard("selectedItem", {
                        step: b.find(".step-pane").index(c) + 1
                    }), this.formSubmitted(!1)
                }.bind(this)
            })
        }
    }, User.prototype.fetchBookings = function(a) {
        $.ajax({
            url: "/api/v1/booking/",
            type: "GET",
            success: function(b) {
                var c = _(b.objects).map(function(a) {
                    a.isValidBooking = ko.observable("booked" === a.action_type), a.clinicName = root.clinic_map()[a.clinic].name;
                    var b = root.clinic_map()[a.clinic].hasLocation;
                    return b ? (a.arrivalError = ko.observable(!1), a.distance = ko.computed(function() {
                        return root.user.position() ? haversine(root.user.position(), root.clinic_map()[this.clinic]) : 1e3
                    }, a), a.inRange = ko.computed(function() {
                        return this.distance() < MINIMUM_RANGE
                    }, a), a.timeUntil = ko.observable(timeUntilAppointment(a)), a.isWithinCheckinWindow = ko.computed(function() {
                        var a = this.timeUntil() >= -10 && this.timeUntil() <= CHECKIN_WINDOW;
                        return a && root.screens.appointments.needLocation(!0), a
                    }, a), a.canArrive = ko.computed(function() {
                        return this.isWithinCheckinWindow() && this.inRange()
                    }, a), a.timeUntilBookingText = ko.computed(function() {
                        if (a.timeUntil() < 1 && a.timeUntil() > -2) return "Your appointment is now.";
                        if (a.timeUntil() < -1) return "Your booking was scheduled for " + moment(a.date, "YYYY-MM-DD HH:mm:ss").format("HH:mma") + ". Please call the clinic.";
                        var b = a.timeUntil() > 1 ? "s" : "";
                        return "Your booking is in " + a.timeUntil() + " minute" + b + "."
                    })) : (a.inRange = !1, a.canArrive = !1, a.isValidBooking = ko.observable(!1), a.isWithinCheckinWindow = ko.observable(!1)), a
                }, this);
                this.bookings(c), void 0 !== a && a()
            }.bind(this),
            error: function(a) {
                console.error(a, arguments)
            }
        })
    }, User.prototype.arrive = function() {
        $.ajax({
            url: "/api/v1/booking/object/" + this.id + "/arrive/",
            type: "POST",
            data: this.id,
            success: function() {
                root.user.fetchBookings()
            },
            error: function() {
                console.error("Problem, captain...", this), this.arrivalError(!0)
            }.bind(this)
        })
    }, -1 != navigator.userAgent.indexOf("Safari") && -1 == navigator.userAgent.indexOf("Chrome")) {
    var cookies = document.cookie;
    top.location != document.location ? cookies || (href = document.location.href, href = -1 == href.indexOf("?") ? href + "?" : href + "&", top.location.href = href + "reref=" + encodeURIComponent(document.referrer)) : (ts = (new Date).getTime(), document.cookie = "ts=" + ts, rerefidx = document.location.href.indexOf("reref="), -1 != rerefidx && (href = decodeURIComponent(document.location.href.substr(rerefidx + 6)), window.location.replace(href)))
}
$(document).ajaxSend(function(a, b, c) {
    if (!safeMethod(c.type) && sameOrigin(c.url)) {
        var d = $.cookie("csrftoken");
        b.setRequestHeader("X-CSRFToken", d)
    }
});
var GlobalMessages = new Messages(".global-messages");
try {
    console.log()
} catch (err) {
    console = {}, console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {}
}
var ViewModel = function() {
        var a = this;
        this.user = new User, this.loading = ko.observable(!0), this.genderChoices = [{
            value: "",
            display: "Unknown"
        }, {
            value: "M",
            display: "Male"
        }, {
            value: "F",
            display: "Female"
        }], this.clinics = ko.observableArray([]), this.clinic_map = ko.computed(function() {
            var a = {};
            return _.each(this.clinics(), function(b) {
                a[b.id] = b, a[b.id].hasLocation = 0 != b.latitude && 0 != b.longitude && config.selfArrive
            }), a
        }, this), this.activateSelfArrive = ko.computed(function() {
            return _.find(a.user.bookings(), function(a) {
                return this.clinic_map()[a.clinic].hasLocation === !0
            }, a)
        }), this.selectedClinic = ko.observable(), this.currentClinic = ko.computed(function() {
            return this.clinic_map()[this.selectedClinic()]
        }, this), this.doctors = ko.observableArray([]), this.doctor_map = ko.computed(function() {
            var a = {};
            return _.each(this.doctors(), function(b) {
                a[b.doctor_code] = b
            }), a
        }, this), this.fetchDoctorData = function() {
            $.ajax({
                url: "/api/v1/doctor/",
                type: "GET",
                data: {
                    clinic: a.selectedClinic()
                }
            }).then(function(b) {
                a.doctors(b.objects)
            }).fail(function(a) {
                console.error("Doctor requeset failed", a)
            })
        }, this.selectedClinic.subscribe(function() {
            this.fetchDoctorData()
        }, this), this.currentClinic.subscribe(function(b) {
            var c = b;
            if ($(document).attr("title", c.display_name), setFeatureToggles(_.findWhere(a.clinics(), {
                    id: c.id
                })), toggles().has_appointment_types) {
                var d = _.findWhere(c.appointment_type, {
                    is_preselected: !0
                });
                a.user.appointmentType(d.id)
            }
        }, this), this.fetchClinicData = function() {
            return $.ajax({
                url: "/api/v1/clinic/",
                type: "GET"
            }).then(function(b) {
                a.clinics(_.sortBy(b.objects, "order")), void 0 === a.selectedClinic() && a.selectedClinic(a.clinics()[0].id)
            }).fail(function(a) {
                console.error("Clinic request failed", a)
            })
        }, this.sam = Sammy(function() {
            var b = {};
            this.mapRoutes([
                ["get", "/", function() {
                    this.app.setLocation("#booking"), GlobalMessages.failure('<i class="fa fa-exclamation-triangle"></i> Do not use this service in emergencies.  Call 000!')
                }],
                ["get", "#clinic/:id", function() {
                    var b = parseInt(this.params.id);
                    a.selectedClinic(b || 1), this.app.setLocation("#booking")
                }],
                ["get", "#forgot-password", function() {
                    $("#forgot-password .before").show(), $("#forgot-password .after").hide(), $("#forgot-password").modal("show")
                }],
                ["get", "#reset-password/:uid/:token", function() {
                    return a.user.isAuthenticated() ? void this.app.setLocation("#booking") : (a.setCurrentView("reset_password"), void a.screens.reset_password.setToken(this.params.uid, this.params.token))
                }],
                ["get", "#booking", function() {
                    a.setCurrentView("calendar")
                }],
                ["get", "#appointments", function() {
                    return a.user.isAuthenticated() ? void a.setCurrentView("appointments") : void this.app.setLocation("#booking")
                }],
                ["get", "#account", function() {
                    return a.user.isAuthenticated() ? void a.setCurrentView("account") : void this.app.setLocation("#booking")
                }],
                ["get", "#selfarrive", function() {
                    a.setCurrentView("appointments"), root.user.isAuthenticated() || (root.user.showLogin(), b.selfArriveAuth = root.user.isAuthenticated.subscribe(function(b) {
                        b === !0 && a.setCurrentView("appointments")
                    }))
                }]
            ]), this.raise_errors = !0, this.notFound = function(a, b) {
                console.error("Invalid route:", a, b), this.setLocation("#booking")
            }, this.before(/.*/, function() {
                $(".modal").modal("hide")
            }), this.before({
                except: {
                    path: "#/selfarrive"
                }
            }, function() {
                b.selfArriveAuth && b.selfArriveAuth.dispose()
            })
        }), this.screens = {
            calendar: new Calendar(this),
            appointments: new Appointments(this),
            account: new Account(this),
            reset_password: new PasswordReset(this)
        }, this.currentView = ko.observable("calendar"), this.currentViewScreen = ko.computed(function() {
            return this.screens[this.currentView()]
        }, this), this.currentView.subscribe(function() {
            $(".navbar-collapse.in").collapse("hide")
        }), this.setCurrentView = function(a) {
            GlobalMessages.clear(), this.currentView(a), this.currentViewScreen().onSelect()
        }, this.user.isAuthenticated.subscribe(function(a) {
            a === !1 && this.sam.setLocation("#booking")
        }, this), $(".modal").on("keyup", "input", form_keys), $('[data-toggle="popover"]').popover({
            container: "body",
            html: !0,
            animated: "fade",
            show: !0
        }), $('[data-toggle="tooltip"]').tooltip(), placeholder_ie9(), this.fetchClinicData(), this.user.fetchDetails().then(function() {
            a.sam.run()
        })
    },
    toggles = ko.observable({}),
    root = new ViewModel;
ko.applyBindings(root);
//# sourceMappingURL=main.min.map