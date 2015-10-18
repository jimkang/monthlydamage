var pickBackground = require('./pick-background');
var d3 = require('d3-selection');
var debounce = require('lodash.debounce');
var monthlyDamage = require('monthly-damage');

var formElementsById = {};
var monthlyCostEl = d3.select('#monthly-cost-value');
var totalLoanCostEl = d3.select('#total-loan-cost-value');
var mailRow = d3.select('#mail-results');
var mailLink = d3.select('#mail-results-link');

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

    mailRow.class('revealed', true).class('hidden', false);
    mailLink.attr('href', getMailToLink(opts, damage));
  }
  else {
    monthlyCostEl.text('Unknown');
    totalLoanCostEl.text('Unknown');

    mailRow.class('revealed', false).class('hidden', true);
    mailLink.attr('href', '');
  }
}

function getMailToLink(formOpts, damage) {
  var body = 'Total monthly cost: ' +
    damage.monthlyCost.toLocaleString(formatOpts) + '\n' +
    'Total cost of loan: ' +
    damage.totalCostOfLoan.toLocaleString(formatOpts) + '\n' +
    '\n' +
    'House price: ' + formOpts.price + '\n' +
    'Down payent: ' + formOpts.downPayment + '\n' +
    'Interest rate: ' + formOpts.interestRatePercent + '\n' +
    'Term (in years): ' + formOpts.termInYears + '\n' +
    'Monthly assessment (condo fees): ' + formOpts.monthlyCondoFee +  '\n' +
    'Yearly taxes: ' + formOpts.yearlyTaxes + '\n';

  return 'mailto:?subject=' + encodeURIComponent('Monthly house cost') + '&' +
    'body=' + encodeURIComponent(body);
}
