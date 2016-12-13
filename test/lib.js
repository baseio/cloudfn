process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

const cloudfn = require('../lib.cloudfn.js');

var remote  	= 'http://localhost:3033';
//var remote  	= 'https://cloudfn.stream';


var random_number = parseInt( Math.random() * 1000);
console.log("Using random number:", random_number);


describe('lib.cloundfn.js Library', () => {

	cloudfn.plugins.load();
	
	describe('Plugins API', () => {
		it('should be an object', (done) => {
			cloudfn.plugins.should.be.an('object');
			done();
		});
		it('should contain "Core"', (done) => {
			cloudfn.plugins.should.have.property('core');
			done();
		});
		it('should contain "Default"', (done) => {
			cloudfn.plugins.should.have.property('default');
			done();
		});
		it('should contain "Premium"', (done) => {
			cloudfn.plugins.should.have.property('premium');
			done();
		});
	});

});

/*
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
	
		it('GET /examples/auth-keys?key=AABBCC should return: "{ok:true, msg:...}"', (done) => {
			chai.request(remote).get('/examples/auth-keys?key=AABBCC').end((err,res) => {
				//console.log(res.body);
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('ok').eql(true);
				done();
			});
		});

		it('GET /examples/auth-keys?key=CCEEFF should return: "{ok:false, msg:...}"', (done) => {
			chai.request(remote).get('/examples/auth-keys?key=CCEEFF').end((err,res) => {
				//console.log(res.body);
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('ok').eql(false);
				done();
			});
		});
	
	});
	

	/// Auth
	describe('Auth (origins)', () => {
	
		it('GET /examples/auth-origin (from localhost) should return: "{ok:true, ...}"', (done) => {
			chai.request(remote)
				.get('/examples/auth-origin')
				.set('referer', 'localhost')
				.end((err,res) => {
				//console.log(res.body);
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('ok').eql(true);
				done();
			});
		});
		
		it('GET /examples/auth-origin (from **fake** github.com) should return: "{ok:false, ...}"', (done) => {
			chai.request(remote)
				.get('/examples/auth-origin')
				.set('referer', 'github.com')
				.end((err,res) => {
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

		it('POST /examples/store?user=test&score='+ random_number +' should return: "{ok:true, msg:SET_RECORD, record:{test:'+ random_number +'}}"', (done) => {
			chai.request(remote).post('/examples/store?user=test&score='+ random_number).end((err,res) => {
				//console.log(res.body);
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('ok').eql(true);
				res.body.should.have.property('msg').eql('SET_RECORD');
				res.body.should.have.property('record');
				res.body.record.should.have.property('test').eql(random_number);
				done();
			});
		});

		it('GET /examples/store?user=test should return: "{ok:true, msg:GET_RECORD, record:{test:'+ random_number +'}}"', (done) => {
			chai.request(remote).get('/examples/store?user=test').end((err,res) => {
				//console.log(res.body);
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('ok').eql(true);
				res.body.should.have.property('msg').eql('GET_RECORD');
				res.body.should.have.property('record');
				res.body.record.should.have.property('test').eql(random_number);
				done();
			});
		});

	});
});
*/

describe('Default plugin scripts', () => {
	
	describe('Request' () => {
		var plugs = cloudfn.api.plugins;

		it('POST /examples/fs should return: "{ok:true, msg:WRITE_FILE_SUCCESS}"', (done) => {
			chai.request(remote)
				.post('/examples/fs')
				.field('file', 'data.json')
				.field('data', JSON.stringify({'random_number':random_number}))
				.end((err,res) => {
					//console.log(res.body);
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('ok').eql(true);
					res.body.should.have.property('msg').eql('WRITE_FILE_SUCCESS');
					done();
				});
		});
	});
});

describe('Premium scripts', () => {
	
	/*
	describe('FS', () => {
		var plugs = cloudfn.api.plugins;

		it('POST /examples/fs should return: "{ok:true, msg:WRITE_FILE_SUCCESS}"', (done) => {
			chai.request(remote)
				.post('/examples/fs')
				.field('file', 'data.json')
				.field('data', JSON.stringify({'random_number':random_number}))
				.end((err,res) => {
					//console.log(res.body);
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('ok').eql(true);
					res.body.should.have.property('msg').eql('WRITE_FILE_SUCCESS');
					done();
				});
		});
		
		
		it('GET /examples/fs?file=data.json should return: "{ok:true, msg:{random_number:'+ random_number +'}}"', (done) => {
			chai.request(remote)
				.get('/examples/fs?file=data.json')
				.end((err,res) => {
					//console.log(res.body);
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('ok').eql(true);
					res.body.should.have.property('msg').eql({"random_number":random_number});
					done();
				});
		});

		
		it('GET /examples/fs should return: "{ok:true, msg:[data.json]}"', (done) => {
			chai.request(remote)
				.get('/examples/fs')
				.end((err,res) => {
					//console.log(res.body);
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('ok').eql(true);
					res.body.should.have.property('msg').eql(['data.json']);
					done();
				});
		});
		
		
	});
	*/

	/*
	describe('Webhook (Premium)', () => {
	});

	describe('Websocket (Premium)', () => {
	});

	describe('PubSub (Premium)', () => {
	});

	*/	
});
