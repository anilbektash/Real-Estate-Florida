
/*
 * GET index file
 */

exports.indexFunction = function(req, res){
	res.render('index',{sitename: 'Isola'});
};
