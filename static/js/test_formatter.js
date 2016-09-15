this.filteredDates = ko
		.computed(
				function()
				{
					var a = this
							.appointmentList();
					return
					

							(root
									&& root.user
									&& root.user
											.isLongAppt() || toggles().has_long_appointment)
									&& (a = filterValidLongAppts(a)),
							a = _
									.chain(a)
									.map(
											function(
													a)
											{
												return root
														.selectedClinic() != a.clinic_id
														|| this
																.selectedTime()
														&& this
																.selectedTime() != a.time
														|| this
																.selectedDoctorCode()
														&& this
																.selectedDoctorCode() != a.doctor ? void 0
														: a
											},
											this)
									.compact()
									.sortBy(
											"date")
									.pluck("date")
									.uniq(!0)
									.value()
				}, this),