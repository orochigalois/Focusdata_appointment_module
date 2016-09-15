
/*
* Container for a SPA Page view
*/

var Page = function (root) {
    this.root = root;
};

Page.prototype = {
    // Called when this page is activated
    onSelect: function () {},
    // Called after template has rendered
    onRender: function () {},
};

