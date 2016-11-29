
const dir  = './plugins';

module.exports = (context) => {
	return {
		send: 	require( dir +'/send.js').bind(context),
		hello:  require( dir +'/hello.js').bind(context),
	}
}