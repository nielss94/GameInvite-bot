const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var gameinviteRoutes = require('./api/gameinvite.routes');


//configure app
app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.json());

app.use('/api', gameinviteRoutes);

app.listen(app.get('port'), () => {
    console.log(`listening on port ${app.get('port')}`);    
});