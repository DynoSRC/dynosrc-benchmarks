var colors = require('colors'),
    express = require('express'),
    swig = require('swig'),

    app = express();

function getController (controller) {
  return require('./controllers/' + controller);
}

// Swig.

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/src/html/');
app.set('view cache', false); // Tell express not to cache HTML.

swig.setDefaults({
  allowErrors: true, // Bubble errors to express.
  cache: false // Tell swig not to cache HTML.
});

// Static stuff.

app.use('/css', express.static(__dirname + '/src/css'));
app.use('/js', express.static(__dirname + '/src/js'));
app.use('/img', express.static(__dirname + '/src/img'));

app.use(express.favicon(__dirname + '/src/img/favicon.png'));

// Routes.

app.get('/', getController('index'));
app.get('/localstorage', getController('localstorage'));

// Run.

app.listen(3000);

console.log('Running benchmarks server on port 3000.'.green);
