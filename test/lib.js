process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

const cloudfn = require('../lib.cloudfn.js');

var remote  	= 'http://localhost:3033';
var remote  	= 'https://cloudfn.stream';


var random_number = parseInt( Math.random() * 1000);
console.log("Using random number:", random_number);


/// Suites

var RUN_SCRIPTDATA_TESTS	= true;
var RUN_ARGS_TESTS			= true;
var RUN_ECHO_TESTS			= true;
var RUN_AUTH_KEYS_TESTS		= true;
var RUN_AUTH_ORIGIN_TESTS	= true;
var RUN_STORE_TESTS			= true;
var RUN_WAIT_TESTS			= false;
var RUN_REQUEST_TESTS		= false;
var RUN_REQUEST_FAST_TESTS	= true;
var RUN_FS_TESTS			= true;



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

describe('Example scripts', () => {

	/// ScriptData
	describe('ScriptData', () => {

		if( !RUN_SCRIPTDATA_TESTS ) return;
		
		it('GET /examples/scriptdata/pkey/pvalue123?qkey=qvalue456"', (done) => {
			chai.request(remote)
				.get('/examples/scriptdata/pkey/pvalue123?qkey=qvalue456').end((err,res) => {
				console.log(res.body);
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('ok').eql(true);
				res.body.data.should.have.property('qkey').eql('qvalue456');
				res.body.data.should.have.property('pkey').eql('pvalue123');
				done();
			});
		});
		
		it('POST /examples/scriptdata/pkey/pvalue123?qkey=qvalue456 + form-data"', (done) => {
			chai.request(remote)
				.post('/examples/scriptdata/pkey/pvalue123?qkey=qvalue456')
				.field('fkey', 'fvalue789')
				.end((err,res) => {
				//console.log(res.body);
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('ok').eql(true);
				res.body.data.should.have.property('qkey').eql('qvalue456');
				res.body.data.should.have.property('pkey').eql('pvalue123');
				res.body.data.should.have.property('fkey').eql('fvalue789');
				done();
			});
		});

	});

	
	/// Echo
	describe('Echo', () => {
		
		if( !RUN_ECHO_TESTS ) return;

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
	

	/// Auth Keys
	describe('Auth (keys)', () => {

		if( !RUN_AUTH_KEYS_TESTS ) return;
	
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
	

	/// Auth Origins
	describe('Auth (origins)', () => {

		if( !RUN_AUTH_ORIGIN_TESTS ) return;
	
		it('GET /examples/auth-origin (from localhost) should return: "{ok:true, ...}"', (done) => {
			chai.request(remote)
				.get('/examples/auth-origin')
				.set('referer', 'localhost')
				.end((err,res) => {
				console.log(res.body);
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('ok').eql(true);
				done();
			});
		});
		
		/*
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
		*/
	
	});
	
	/// Store
	describe('Store', () => {

		if( !RUN_STORE_TESTS ) return;

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


	/// Wait
	describe('Wait', () => {

		if( !RUN_WAIT_TESTS ) return;

		var wait_time_1 = 4000 + parseInt( Math.random() * 4000);
		var wait_time_2 = 4000 + parseInt( Math.random() * 8000);

		it('GET /examples/wait?time='+ wait_time_1 +' should return after '+ wait_time_1 +'ms.}', function(done){
			this.timeout(1000 + wait_time_1);
			chai.request(remote).post('/examples/wait?time='+ wait_time_1).end((err,res) => {
				//console.log(res.body);
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('ok').eql(true);
				res.body.should.have.property('time').eql(wait_time_1);
				done();
			});
		});

		it('GET /examples/wait?time='+ wait_time_2 +' should return after '+ wait_time_2 +'ms.}', function(done){
			this.timeout(1000 + wait_time_2);
			chai.request(remote).post('/examples/wait?time='+ wait_time_2).end((err,res) => {
				//console.log(res.body);
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('ok').eql(true);
				res.body.should.have.property('time').eql(wait_time_2);
				done();
			});
		});

	});

});


describe('Request plugin', () => {
		
	if( !RUN_REQUEST_TESTS ) return;
	
	it('GET /examples/request?mode=FORCE_FAIL should return "SOCKET RESPONSE TIMEOUT"', function(done) {
		this.timeout(15000);
		chai.request(remote)
			.get('/examples/request?mode=FORCE_FAIL')
			.end((err,res) => {
				//console.log("res.body", res.body);
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('msg').eql('SOCKET RESPONSE TIMEOUT');
				done();
			});
	});

	it('GET  Request to httpbin.org should work', function(done) {
		this.timeout(15000);
		chai.request(remote)
			.get('/examples/request')
			.end((err,res) => {
				//console.log("res.body", res.body);
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('url').eql('https://httpbin.org/get');
				done();
			});
	});

	it('POST Request to httpbin.org should work', function(done) {
		this.timeout(15000);
		chai.request(remote)
			.post('/examples/request')
			.end((err,res) => {
				//console.log("res.body", res.body);
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('url').eql('https://httpbin.org/post');
				done();
			});
	});
	
});


describe('Args', () => {
		
	if( !RUN_ARGS_TESTS ) return;
	
	it('GET /examples/args', function(done) {
		chai.request(remote)
			.get('/examples/args')
			.end((err,res) => {
				//console.log("res.body", res.body);
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('ok').eql(true);
				done();
			});
	});

});


describe('Request plugin (Fast)', () => {
		
	if( !RUN_REQUEST_FAST_TESTS ) return;
	
	it('GET /examples/request?mode=LOCAL should work', function(done) {
		chai.request(remote)
			.get('/examples/request?mode=LOCAL')
			.end((err,res) => {
				//console.log("res.body", res.body);
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('name');
				res.body.should.have.property('version');
				done();
			});
	});

});


describe('Premium scripts', () => {
	
	describe('FS', () => {

		if( !RUN_FS_TESTS ) return;

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
	

	/*

	describe('Websocket (Premium)', () => {
	});

	describe('PubSub (Premium)', () => {
	});

	*/	
});
