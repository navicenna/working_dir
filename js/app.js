var ViewModel = function () {
    this.clickCount = ko.observable(0);
    this.name = ko.observable('Tab');
    this.imgSrc = ko.observable('img/1413379559_412a540d29_z.jpg');
    this.imgAttribution = ko.observable('foo');

    this.incrementCounter = function() {
        this.clickCount(this.clickCount() + 1);
    };
    console.log('foobar');
}

ko.applyBindings(new ViewModel());
console.log('foo initialized');