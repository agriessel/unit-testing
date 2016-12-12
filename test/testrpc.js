var chai = require("chai");
var assert = chai.assert;
var TestRPC = require("ethereumjs-testrpc");
var Web3 = require("Web3");

var tests = function(web3, config) {
  describe("Initializing TestRPC", function() {
 //this.timeout(60000);

  it("Check if all our accounts have been created", function( done ) {
    web3.eth.getAccounts(function(err, response) {
      if (err) return done(err);
      assert.equal(config.accounts.length, response.length, "Ensure all our accounts have been created");
      done();
    });
  });

  it("Check all our account balances are 1000000000000000000000 wei", function( done ) {
    web3.eth.getAccounts(function(err, response) {
      if (err) return done(err);
      for ( var i = 0; i < response.length; i++ ) {
        web3.eth.getBalance(response[i], function(err, response2) {
          assert.equal(new web3.BigNumber(1000000000000000000000).toString(10), response2.toString(10), "Account balance should be 1000000000000000000000 wei");
        });
      }
      done();
    });
  });

  });
};

var logger = {
  log: function(message) {
    //console.log(message);
  }
};


/*
describe("Provider:", function() {
  var web3 = new Web3();
  var config = {};
  config.accounts = require('./accounts.json');
  web3.setProvider(TestRPC.provider({
    logger: logger,
    seed: "1337",
    accounts : config.accounts
  }));
  tests(web3, config);
});
*/

describe("Server:", function(done) {
  var web3 = new Web3();
  var port = 8545;
  var server;
  var config = {};

  /**
    * Accounts used for testing purposes 
  **/
  config.accounts = require('./accounts.json');

  before("Initialize TestRPC server", function(done) {
    server = TestRPC.server({
      logger: logger,
      accounts : config.accounts
    });
    server.listen(port, function() {
      web3.setProvider(new Web3.providers.HttpProvider("http://localhost:" + port));
      done();
    });
  });

  after("Shutdown server", function(done) {
    server.close(done);
  });

  tests(web3, config);
});
