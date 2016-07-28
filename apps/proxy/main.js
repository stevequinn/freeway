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
                let doc = parseHTML(response.data);
                let twit_doc = parseHTML(twit_res.data);
                let body = detach_element(doc, '//body');
                let head = detach_element(doc, '//head');
                body.appendChild(detach_element(twit_doc, "//div[@id='timeline']"));
                head.appendChild(detach_element(twit_doc, "//link[@rel='stylesheet']"));

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

detach_element = function(doc, xpath){
    print(`Extracting ${xpath} from ${doc}`);
    let e = doc.evaluate(xpath);
    if(e){
        e = e[0].detach();
        print(`Found ${e.str()}`);
        return e;
    }
    else{
        return null;
    }
};
