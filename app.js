var pickBackground = require('./pick-background');
var d3 = require('d3-selection');
var debounce = require('lodash.debounce');
var monthlyDamage = require('monthly-damage');
var Clipboard = require('clipboard');

var formElementsById = {};
var monthlyCostEl = d3.select('#monthly-cost-value');
var totalLoanCostEl = d3.select('#total-loan-cost-value');

var mailRow = d3.select('#mail-results');
var mailLink = d3.select('#mail-results-link');
var copyRow = d3.select('#copy-results');
var copyLink = d3.select('#copy-results-link');
var copyField = d3.select('#copy-results-field');
var notificationRow = d3.select('#notification-row');

new Clipboard('#copy-results-link');

((function setUp() {
  document.body.style.backgroundImage = 'url(' + pickBackground() + ')';

  var debouncedRecalculate = debounce(recalculate);

  d3.selectAll('#entry-form input')
    .on('keyup', debouncedRecalculate)
    .on('change', debouncedRecalculate)
    .each(addFormElementToDict);

  copyLink.on('click', notifyOfCopy);

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

    copyRow.class('revealed', true).class('hidden', false);

    // Update the copy field, but hide it. It's just there to be copied to 
    // the clipboard.
    copyField.html(getSummaryText(opts, damage, '<br />'));
  }
  else {
    monthlyCostEl.text('Unknown');
    totalLoanCostEl.text('Unknown');

    mailRow.class('revealed', false).class('hidden', true);
    mailLink.attr('href', '');

    copyRow.class('revealed', false).class('hidden', true);
    copyField.html('');
  }
}

function getMailToLink(formOpts, damage) {
  var body = getSummaryText(formOpts, damage);

  return 'mailto:?subject=' + encodeURIComponent('Monthly house cost') + '&' +
    'body=' + encodeURIComponent(body);
}

function getSummaryText(formOpts, damage, lineBreak) {
  if (!lineBreak) {
    lineBreak = '\n';
  }

  return 'Total monthly cost: ' +
    damage.monthlyCost.toLocaleString(formatOpts) + lineBreak +
    'Total interest: ' +
    damage.totalCostOfLoan.toLocaleString(formatOpts) + lineBreak +
    lineBreak +
    'House price: ' + formOpts.price + lineBreak +
    'Down payent: ' + formOpts.downPayment + lineBreak +
    'Interest rate: ' + formOpts.interestRatePercent + lineBreak +
    'Term (in years): ' + formOpts.termInYears + lineBreak +
    'Monthly assessment (condo fees): ' + formOpts.monthlyCondoFee +  lineBreak +
    'Yearly taxes: ' + formOpts.yearlyTaxes + lineBreak;  
}

function notifyOfCopy() {
  notificationRow.text('Results copied to clipboard.');
  notificationRow.class('revealed', true).class('hidden', false);
  setTimeout(fadeNotification, 2000);
}

function fadeNotification() {
  notificationRow.class('revealed', false).class('fade', true);
  setTimeout(hideNotification, 1000);
}

function hideNotification() {
  notificationRow.class('fade', false).class('hidden', true);
  notificationRow.text('');
}
