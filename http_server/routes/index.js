var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Clap Demo' });
});

router.get('/img/:id', (req, res, next)=>{
  try{
    res.download('./img/render/'+req.params.id+'.jpg');
  }catch (e){
    res.send('Sorry no such file').status(404);
  }
});

router.get('*', (req, res, next) => {
  res.redirect('/');
});

module.exports = router;
