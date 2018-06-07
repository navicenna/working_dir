var initialCats = [{
        clickCount: 0,
        name: 'Tabby',
        imgSrc: 'img/22252709_010df3379e_z.jpg',
        imgAttribution: 'foo',
        nicknames: ['abc', 'fo']
    },
    {
        clickCount: 0,
        name: 'Tiger',
        imgSrc: 'img/434164568_fea0ad4013_z.jpg',
        imgAttribution: 'foo',
        nicknames: ['bar', 'foo']
    }
];

var Cat = function (data) {
    this.clickCount = ko.observable(data.clickCount);
    this.name = ko.observable(data.name);
    this.imgSrc = ko.observable(data.imgSrc);
    this.imgAttribution = ko.observable(data.imgAttribution);
    this.nicknames = ko.observableArray(data.nicknames);
    this.level = ko.computed(function () {
        var level = 'n/a';
        if (this.clickCount() < 10) {
            level = 'Infant';
        } else if (this.clickCount() < 20) {
            level = 'Child';
        } else if (this.clickCount() < 30) {
            level = 'Teen';
        } else {
            level = 'Adult';
        }
        return level;
    }, this);
}

// Define the view model
var ViewModel = function () {
    var self = this;

    this.catList = ko.observableArray([])

    initialCats.forEach(function (catItem) {
        self.catList.push(new Cat(catItem));
    });

    this.currentCat = ko.observable(this.catList()[0])
    this.incrementCounter = function () {
        self.currentCat().clickCount(self.currentCat().clickCount() + 1);
    };
    this.setCat = function (clickedCat) {
        self.currentCat(clickedCat);
    }
}


ko.applyBindings(new ViewModel());