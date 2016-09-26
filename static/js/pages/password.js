var PasswordReset = function()
{
	var self = this;

	Page.apply(this, arguments);
	this.tmpl = 'resetPasswordTmpl';
	this.$modal = $('#forgot-password');

	this.form = new Form('#forgot-password');

	this.onRender = function()
	{
		self.setContent('show-form');

		// Because ie9
		placeholder_ie9();
	};
};

PasswordReset.prototype = Object
		.create(Page.prototype);
PasswordReset.prototype.constructor = PasswordReset;

PasswordReset.prototype.setContent = function(
		mode)
{
	var view = $('#reset-password'); // dynamically rendered
	view.find('.show-form')[mode == 'show-form' ? 'show'
			: 'hide']();
	view.find('.success')[mode == 'success' ? 'show'
			: 'hide']();
	view.find('.bad-token')[mode == 'bad-token' ? 'show'
			: 'hide']();
};

PasswordReset.prototype.setToken = function(uid,
		token)
{
	this.uid = uid;
	this.token = token;
	$.ajax(
	{
		url : 'accounts/reset/' + uid + '/'
				+ token + '/',
		type : 'GET',
		complete : $.proxy(function(xhr)
		{
			if (xhr.status == 200)
			{
				return;
			}
			// Tell them the token is invalid
			this.setContent('bad-token');
		}, this)
	});
};

PasswordReset.prototype.resetPassword = function()
{
	var reset_form = new Form('#reset_password');
	var results = reset_form.validate();
	if (!results.valid)
	{
		reset_form.set_errors(results.errors);
		return;
	}

	$
			.ajax(
			{
				url : 'accounts/reset/'
						+ this.uid + '/'
						+ this.token + '/',
				type : 'POST',
				data : $('#reset_password')
						.serialize(),
				success : $.proxy(function()
				{
					this.setContent('success');

					this.uid = undefined;
					this.token = undefined;
				}, this),
				error : $
						.proxy(
								function(xhr)
								{
									reset_form
											.set_errors(xhr.responseJSON);
								}, this)
			});
};

// Request password reset modal
PasswordReset.prototype.forgotPassword = function()
{
	var result = this.form.validate();
	if (!result.valid)
	{
		this.form.set_errors(result.errors);
		return;
	}
	
	var reset_pwd=""; 
    for(var i=0;i<6;i++) 
    { 
      reset_pwd+=Math.floor(Math.random()*10); 
    } 

	$
			.ajax(
			{
				url : 'classes/PHPMailer/gmail.php',
				type : 'POST',
				data :
				{
				    email : result.values.email,
					pwd: reset_pwd,
					name:'guest'
				},
				success : $.proxy(function()
				{
					this.$modal.find('.before')
							.hide();
					this.$modal.find('.after')
							.show();
				}, this),
				error : $
						.proxy(
								function(xhr)
								{
									this.form
											.set_errors(xhr.responseJSON);
								}, this)
			});
};

PasswordReset.prototype.showForgotPassword = function()
{
	this.form.clear();
	this.$modal.find('.before').show();
	this.$modal.find('.after').hide();
};
