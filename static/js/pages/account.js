
var Account = function () {
    Page.apply(this, arguments);
    this.tmpl = 'accountTmpl';

};
Account.prototype = Object.create(Page.prototype);
Account.prototype.constructor = Account;
