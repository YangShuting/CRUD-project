const express = require('express');
const bodyparser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
app.set('view engine', 'ejs');
var db;

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(bodyparser.json());

//Create
app.post('/quote', (req, res)=>{
	db.collection('quote').save(req.body, (err, result)=>{
		if(err) return console.log(err);
		console.log('save to database!');
		res.redirect('/');
	});
});

//get the collection message from database:
app.get('/', (req, res)=>{
	db.collection('quote').find().toArray(function(err, result){
		if(err) return console.log(err);
		res.render('messageboard.ejs', {quote: result});
	});
});
//modify the data using method put.
app.put('/quote', (req, res)=>{
	db.collection('quote').findOneAndUpdate({ name: 'Mary'},
		{
			$set: {
				name: req.body.name,
				quote: req.body.quote
			}
		},
		{
			sort: {_id: -1},
			upsert: true
		},
		(err, result)=>{
			if(err) return res.send(err);
			res.send(result)
		})
});

//delete the info
app.delete('/quote', (req, res)=>{
	db.collection('quote').findOneAndDelete({ name: req.body.name},
		(err, result)=>{
			if(err) return res.send(500, err);
			res.send("Mary's quote is deleted");
		})
});

MongoClient.connect('mongodb://test:test@ds131900.mlab.com:31900/yangshuting-node-database', (err, database)=>{
	if(err) return console.log(err);
	db = database;
	app.listen(5000, ()=>{
		console.log('listening on 5000!');
	});
});
