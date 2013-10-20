
/*
 * GET index file
 */

exports.indexfunction = function(req, res){
	res.render('index',{sitename: 'Isola'});
};
