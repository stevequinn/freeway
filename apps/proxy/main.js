getResponse = function(request) {
    request.host = 'www.sq.net.au';
    request.headers.host = request.host;

    // Setup the response promise from the fetch promise.
    let response_p = fetch_p(request);

    return response_p.then(response => {
        // Any changes to response.data can be made here.
        if(response.headers['content-type'].contains('text/html')){
            response.data = response.data.replace(/steve/gi, 'quinn');
        }
        //response = setcache(request, response, 600, 3600*24);
        return response;
    });
};
