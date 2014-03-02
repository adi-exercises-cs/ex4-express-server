InternetTechnologies
====================

```
          _
         /-\
    _____|#|_____
   |_____________|
  |_______________|
|||_POLICE_##_BOX_|||
 | |¯|¯|¯|||¯|¯|¯| |
 | |-|-|-|||-|-|-| |
 | |_|_|_|||_|_|_| |
 | ||~~~| | |¯¯¯|| |
 | ||~~~|!|!| O || |
 | ||~~~| |.|___|| |
 | ||¯¯¯| | |¯¯¯|| |
 | ||   | | |   || |
 | ||___| | |___|| |
 | ||¯¯¯| | |¯¯¯|| |
 | ||   | | |   || |
 | ||___| | |___|| |
|¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯|
 ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯
 ```

README

what was hard in this ex?
    I think the most difficult thing was to write the middleware router.. make sure the next follows the specifications
    and finally make it work nicely and the code pretty and neat. (though the most difficult thing was undoubtedly
    finding time to work on the exercise together and balance everything we had to do)

what was fun about this ex?
    seeing everything work, knowing we just wrote an awesome framework api. and writing the middlewares.. the entire
    concept of middlewares, although not invented by node, is just brilliant.

if you were a hacker and you could add a dynamic function that answers the URL /hello/hacker,
write 2 different ‘bad’ dynamic functions that will cause DOS
    we will add these two, in front of all the other use/get/etc. that way it will be the first thing to be called.
    by not adding a resource we ensure it will be called for every request

    app.use(function(req, res, next) {
        while(true) {
            console.log('DOS!');
        }
    });

    app.use(function(req, res, next) {
        var process = require("process");
        process.exit();
    });



