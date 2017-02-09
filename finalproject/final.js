var express = require('express');
var mysql=require('mysql');
var pool = mysql.createPool({
      host  : 'localhost',
	  user  : 'student',
	  password: 'default',
	  database: 'student',
    dateStrings: 'date'
});
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3001);
app.use(express.static('public'));

app.get('/',function(req,res,next){
  var context = {};
  
  pool.query('SELECT * FROM `workouts`', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;

    
    res.render('home', context);
    
    
  });
 
});

app.post('/', function(req,res,next){
  var context = {};
  
  pool.query('SELECT * FROM `workouts`', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.render('home', context);
  });
  
});

app.post('/insert', function(req, res, next){
	var context = {};
	pool.query("INSERT INTO `workouts` (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", [req.body.name , req.body.reps, req.body.weight, req.body.date, req.body.lbs], function(err, results){
		if(err){
      		next(err);
      		return;
    	}
    	pool.query('SELECT * FROM workouts', function(err, rows, fields){
		    if(err){
		      next(err);
		      return;
		    }
		    context.results = rows;
        res.send(context);
			});
  });
});

app.post('/remove', function(req, res, next){
  var context = {};
  
  
  pool.query("DELETE FROM `workouts` WHERE id=?", [req.body.id], function(err, results){
    if(err){
          next(err);
          return;
      }
      pool.query('SELECT * FROM workouts', function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        context.results = rows;
        res.send(context);
      });
  });
});

app.post('/update',function(req,res,next){
  var context = {};
  pool.query("SELECT * FROM workouts WHERE id=?", [req.body.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    var context = result[0];
    res.render('update', context);
  });
});


app.post('/pushupdate',function(req,res,next){
  var context={};
  pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?",[req.body.name, 
  req.body.reps, req.body.weight, req.body.date, req.body.lbs, req.body.id],function(err, result){
      if(err){
        next(err);
        return;
      }
      res.render('home');
  });
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});