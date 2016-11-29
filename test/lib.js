process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

const cloudfn = require('../lib.cloudfn.js');

var remote  	= 'http://localhost:3033';
//var remote  	= 'https://cloudfn.stream';

describe('lib.cloundfn.js Library', () => {

	cloudfn.api.init();
	
	describe('Plugins API', () => {
		var plugs = cloudfn.api.plugins;
		it('should be an object', (done) => {
			plugs.should.be.an('object');
			done();
		});
		it('should contain "Core"', (done) => {
			plugs.should.have.property('core');
			done();
		});
		it('should contain "Default"', (done) => {
			plugs.should.have.property('default');
			done();
		});
		it('should contain "Premium"', (done) => {
			plugs.should.have.property('premium');
			done();
		});
	});

	describe('Example scripts', () => {

		/// Echo
		describe('Echo', () => {
			
			it('GET /examples/echo/msg/123 should return: "{ok:true, msg:123}"', (done) => {
				chai.request(remote).get('/examples/echo/msg/123').end((err,res) => {
					//console.log(res.body);
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('ok').eql(true);
					res.body.should.have.property('msg').eql(123);
					done();
				});
			});

			it('GET /examples/echo?msg=456 should return: "{ok:true, msg:456}"', (done) => {
				chai.request(remote).get('/examples/echo?msg=456').end((err,res) => {
					//console.log(res.body);
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('ok').eql(true);
					res.body.should.have.property('msg').eql(456);
					done();
				});
			});
		
		});
		

		/// Auth
		describe('Auth (keys)', () => {
		
			it('GET /examples/auth-token?token=AABBCC should return: "{ok:true, msg:...}"', (done) => {
				chai.request(remote).get('/examples/auth-token?token=AABBCC').end((err,res) => {
					//console.log(res.body);
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('ok').eql(true);
					done();
				});
			});

			it('GET /examples/auth-token?token=CCEEFF should return: "{ok:false, msg:...}"', (done) => {
				chai.request(remote).get('/examples/auth-token?token=CCEEFF').end((err,res) => {
					//console.log(res.body);
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('ok').eql(false);
					done();
				});
			});
		
		});

		/// Store
		describe('Store', () => {
	
			it('POST /examples/store?user=test&score=123 should return: "{ok:true, msg:SET_RECORD, record:{test:123}}"', (done) => {
				chai.request(remote).post('/examples/store?user=test&score=123').end((err,res) => {
					//console.log(res.body);
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('ok').eql(true);
					res.body.should.have.property('msg').eql('SET_RECORD');
					res.body.should.have.property('record');
					res.body.record.should.have.property('test').eql(123);
					done();
				});
			});

			it('GET /examples/store?user=test should return: "{ok:true, msg:GET_RECORD, record:{test:123}}"', (done) => {
				chai.request(remote).get('/examples/store?user=test').end((err,res) => {
					//console.log(res.body);
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('ok').eql(true);
					res.body.should.have.property('msg').eql('GET_RECORD');
					res.body.should.have.property('record');
					res.body.record.should.have.property('test').eql(123);
					done();
				});
			});

		});

		/// Premium
		describe('FS (Premium)', () => {
		});

		describe('Webhook (Premium)', () => {
		});
	
		describe('Websocket (Premium)', () => {
		});

		describe('PubSub (Premium)', () => {
		});
	});



});