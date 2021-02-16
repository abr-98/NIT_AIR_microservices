# Deployment Go to reactApp directory

# RUN THIS FIRST....
* "npm run build" creates a build directory with a production build of your app. Set up your favorite HTTP server so that a visitor to your site is served index.html, and requests to static paths like /static/js/main.hash.js are served with the contents of the /static/js/main.hash.js file. For more information see the production build section.

# Static Server#
For environments using Node, the easiest way to handle this would be to install serve and let it handle the rest:

# STEP1
 * npm install -g serve
# STEP2
 * serve -s build #with out port it will run on 5000
The last command shown above will serve your static site on the port 5000. Like many of serve’s internal settings, the port can be adjusted using the -l or --listen flags:

# STEP !2 3
 * serve -s build -l 3000