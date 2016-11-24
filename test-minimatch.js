var cloudfn = require('./lib.cloudfn.js');

var r = "xxhttps://cloudfn.github.io/website/";

console.log(
    //"1. " + matchRuleShort(r, "https://cloudfn.github.io/website") + "\n"
    //+"2. " + matchRuleShort(r, "*cloudfn.github.io/website") + "\n"
    //"3. " + matchRuleShort(r, "*cloudfn.github.io/*") + "\n"
    "3. " + cloudfn.utils.is_match(r, "*cloudfn.github.io/*") + "\n"
    //+"4. " + matchRuleShort(r, "*cloudfn.github.io*") + "\n"
    //+"5. " + matchRuleShort(r, "*.github.io*") + "\n"
);


// http://stackoverflow.com/a/32402438
function matchRuleShort(str, rule) {
  return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
}
