// TEST MINIMAL - tidak import apapun
// Upload file ini dulu untuk memastikan Vercel config benar
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ 
    status: 'ok', 
    message: 'Vercel is working!',
    url: req.url,
    method: req.method
  }));
};
