let config = {
	https: 'https://api.zarinpal.com/pg/',
	sandbox: 'https://sandbox.zarinpal.com/pg/',
	merchant:"1344b5d4-0048-11e8-94db-005056a205be",
	merchantIDLength: 36,
	API: {
		PR: 'v4/payment/request.json',
		PV: 'v4/payment/verify.json',
		
	},
	PG: function(sandbox) {
		if (sandbox) {
			return 'https://sandbox.zarinpal.com/pg/StartPay/';
		}
		return 'https://www.zarinpal.com/pg/StartPay/';
	}
};

module.exports= config;
