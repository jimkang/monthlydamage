var pickBackground = require('./pick-background');
var d3 = require('d3-selection');
var debounce = require('lodash.debounce');
var monthlyDamage = require('monthly-damage');

var formElementsById = {};
var monthlyCostEl = d3.select('#monthly-cost-value');
var totalLoanCostEl = d3.select('#total-loan-cost-value');

((function setUp() {
  document.body.style.backgroundImage = 'url(' + pickBackground() + ')';

  var debouncedRecalculate = debounce(recalculate);

  d3.selectAll('#entry-form input')
    .on('keyup', debouncedRecalculate)
    .on('change', debouncedRecalculate)
    .each(addFormElementToDict);

  recalculate();
})());

function addFormElementToDict() {
  formElementsById[this.id] = this;
}

function getDamageOptsFromFormElements() {
  var opts = {};
  for (var id in formElementsById) {
    opts[id] = +formElementsById[id].value;
  }
  return opts;
}

var formatOpts = {
  style: 'currency'
};

function recalculate() {
  var opts = getDamageOptsFromFormElements();

  if (opts.price && opts.interestRatePercent && opts.termInYears &&
    opts.price > opts.downPayment) {

    var damage = monthlyDamage(opts);
    monthlyCostEl.text(damage.monthlyCost.toLocaleString(formatOpts));
    totalLoanCostEl.text(damage.totalCostOfLoan.toLocaleString(formatOpts));
  }
  else {
    monthlyCostEl.text('Unknown');
    totalLoanCostEl.text('Unknown');
  }
}
