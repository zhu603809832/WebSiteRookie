var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register', { });
});

function DBConnectionExe(){
	var connection = mysql.createConnection({
		host : '127.0.0.1',
		user : 'root',
		password : '123456',
	})
	
	connection.connect();
	
	connection.query('select * from user', function(err, rows, fields){
			if(err) throw err;
			console.log('the solution is:', rows[0].solution);
		})
}
module.exports = router;
