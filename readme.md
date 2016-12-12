# cloudfn

Short for "cloud function", cloudfn is a Function-as-a-Service (FaaS) that takes the 
infrastructure burden out of server-side code.

Cloudfn is suitable for projects that needs some* server-based functionality,
but cant afford (or bother) to setup the team, tech and infrastructure required.

With cloudfn, you simply express your functionality in a javascript function,
use the `cfn` command-line tool to upload it,
and call the resulting URL to get/set your data.

All User-interaction is via the [commandline tool](https://github.com/cloudfn/cli), please refer to its wiki for the [user-documentation](https://github.com/cloudfn/cli/wiki)

For techical documentation about the service, please visit the [docs](https://github.com/cloudfn/system/docs) subdir.

