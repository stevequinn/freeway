getResponse = function(request) {
    request.host = 'www.sq.net.au';
    request.headers.host = request.host;

    // Setup the response promise from the fetch promise.
    let response_p = fetch(request);

    return response_p.then(response => {
        // Any changes to response.data can be made here.
        let ct = response.headers['content-type'];

        if(ct && ct.indexOf('text/html') === 0){
            // Add the twitter feed to this site.
            let twit_fetch = fetch('https://twitter.com/').then(twit_res => {
                let twit_doc = parseHTML(twit_res.data);
                let feed = twit_doc.evaluate("//div[@id='timeline']")[0].detach();
                let style = twit_doc.evaluate("//link[@rel='stylesheet']")[0].detach();

                let doc = parseHTML(response.data);
                let body = doc.evaluate('//body')[0];
                let head = doc.evaluate('//head')[0];
                head.appendChild(style);
                body.appendChild(feed);
                response.data = doc.str();
                return response;
            });

            return twit_fetch;
        }
        else {
            return response;
        }

    });
};
