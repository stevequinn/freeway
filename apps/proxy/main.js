getResponse = function(request) {
    request.host = 'www.sq.net.au';
    request.headers.host = request.host;

    // Setup the response promise from the fetch promise.
    let response_p = fetch_p(request);

    return response_p.then(response => {
        // Any changes to response.data can be made here.
        let ct = response.headers['content-type'];
        if(ct && ct.indexOf('text/html') === 0){
            // Add the twitter feed to this site.
            let twit_fetch = fetch('https://twitter.com/').then(twit_res => {
                let twit_doc = parseHTML(twit_res.data);
                let feed = twit_doc.evaluate("//div[@id='timeline']").detach();

                let doc = parseHTML(response.data);
                doc.evaluate('//body')[0].appendChild(feed);
                response.data = doc.str();
            });
        }
        //response = setcache(request, response, 600, 3600*24);
        return response;
    });
};
