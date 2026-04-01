var express = require('express');
var router = express.Router();
router.get('/', (req, res) => {
   res.render('landing', { title: 'Vídeos Curtos e Engajadores' });
});

module.exports = router;