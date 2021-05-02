let config = {
	https: 'https://api.zarinpal.com/pg/',
	sandbox: 'https://sandbox.zarinpal.com/pg/',
	merchant:"40217f0a-3a26-4529-8b08-d1c395953298",
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
