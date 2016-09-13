/// minimal low-performance db

const persist = false;
const persist_filename = '';

var db = {};

module.exports.addCollection = (collection) => {
    db[collection] = db[collection] || [];
}

module.exports.insert = (collection, doc) => {
    db[collection] = db[collection] || [];
    db[collection].push( doc );   
}

module.exports.list = (collection) => db[collection];

module.exports.select = (collection, terms) => {
   let results = [];
   db[collection].filter( (itm, index) => {
        Object.keys(terms).map( (term) => {
            var type = typeof itm[term];
            if( typeof terms[term] === type){
                type = 'whatever';
            }
            console.log('comparing', type, itm[term], terms[term] );

            switch(type){
                case 'number':
                    let operator = terms[term].replace(/\d/g,'');
                    let num   = terms[term].replace(/\D/g,'')*1.0;
                    if( operator === '>'){
                        if(itm[term] > num){
                            results.push(itm);
                        }
                    }else if( operator === '<'){
                        if(itm[term] < num){
                            results.push(itm);
                        }
                    }

                case 'string':
                default:
                    if(itm[term] === terms[term]){
                        results.push(itm);
                    }
            }
        });
    });
    return results;
}

