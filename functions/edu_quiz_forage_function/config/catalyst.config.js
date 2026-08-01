// Zoho Catalyst SDK initialization
// Fill this in after running `catalyst init` and getting your project credentials
// from https://catalyst.zoho.com

const catalyst = require('zcatalyst-sdk-node');

function initCatalyst(req) {
  return catalyst.initialize(req);
}

module.exports = { initCatalyst };
