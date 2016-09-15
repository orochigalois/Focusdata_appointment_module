
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

Messages.prototype.info = function (message) {
    return this.addMessage(message, 'info');
};

Messages.prototype.warn = function (message) {
    return this.addMessage(message, 'warning');
};

Messages.prototype.clear = function () {
    this.$container.html('');
    return this;
};
