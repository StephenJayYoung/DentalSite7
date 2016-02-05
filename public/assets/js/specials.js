// scope our template data to the "data" variable.
_.templateSettings.variable = "data";

// setup our initial object literal to pass to the templates.
var specials = {
    today:      new Date(),
    template:   _.template($("#specials-template").html())
};

var month   = ("0" + (specials.today.getMonth() + 1)).slice(-2);
var day     = ("0" + specials.today.getDate()).slice(-2);

specials.comparator = parseInt(month + day);

if (specials.comparator >= 321 && specials.comparator < 621) {
    // special is for spring of this year
    specials.season     = "Spring";
    specials.endMonth   = "June";
    specials.endDay     = "20";
    specials.endYear    = parseInt(specials.today.getFullYear());
}
else if (specials.comparator >= 621 && specials.comparator < 921) {
    // special is for summer of this year
    specials.season     = "Summer";
    specials.endMonth   = "September";
    specials.endDay     = "20";
    specials.endYear    = parseInt(specials.today.getFullYear());
}
else if (specials.comparator >= 921 && specials.comparator < 1221) {
    // special is for fall of this year
    specials.season     = "Fall";
    specials.endMonth   = "December";
    specials.endDay     = "20";
    specials.endYear    = parseInt(specials.today.getFullYear());
}
else if (specials.comparator >= 1221 || specials.comparator < 321) {
    // special is for winter - we need to bump the expiration year to this year + 1
    specials.season     = "Winter";
    specials.endMonth   = "March";
    specials.endDay     = "20";
    if (specials.comparator >= 1221) {
        specials.endYear    = parseInt(specials.today.getFullYear()) + 1;
    } else {
        specials.endYear = parseInt(specials.today.getFullYear());
    }
}

$('#specials .heading-block').html(
    _.template(specials.template(specials))
);