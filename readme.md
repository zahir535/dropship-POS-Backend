install
- express
- npm add mongoose dotenv
- npm add express nodemon

run
- nodemon server.js/index.js



1. Javascript for backend
2. Routes and DOM 
3. SQL for db, cloudinary for image db, 
4. Firebase auth for sign in & register ? 
choose between firebase auth @ normal new register
5. node, express, cors
6. bycript for hash


DEPLOY TO HEROKU
1. have heroku account
2. install heroku cli (enable heroku in cmd)
3. cmd: heroku login
4. sync local project to git repository
5. create .gitignore file {
    node_modules
    .env
}
6. create Procfile file{
    web: node index.js
}
7. change port in index.js {
    const port = process.env.PORT || 3001 ;
}
8. cmd: heroku create
9. setup mongoDB connection as environment variable
that we made in the project file in the heroku as well.
cmd: heroku config:set MONGODB_URI={link} as in .env file
10. cmd: {
    git add .
    git commit -m "commit before push heroku"
    git push heroku master
}.then( the project is deployed!)
11. heroku requires we scale the application
cmd: heroku ps:scale web=1
12. open our application
cmd: heroku open
13. when the browser is opened, and ig there are any error,
check where the error is by checking the log of the application
cmd: heroku logs --tail
{
    eg. if a package is not installed, reinstall the package using cmd
}
.then( commit the changes again)
cmd: {
    git add .
    git commit -m "Fix: fix any error if any"
    git push heroku master
}
.then(after redeployment, scale the application once again)
cmd: {
    heroku ps:scale web=1
}
.then(open again application)
cmd: heroku open
14. After the open application is successfull,
we will get text "Cannot GET /"
.then(
    the link in the browser will be copied.
    and paired with the api to be tested in postman
    <heroku application link>/user/signin @ 
    <heroku application link>/user/signup
)


SYNC TO GITHUB
// initialize repo in local desktop
1. git init
2. git add .
3. git commit -m "First Commit"

// syncing to github repo
4. create a new repo in github
//PUSH AN EXISTING REPO FROM THE COMMAND LINE
5. git remote add origin http://github.com... (github repo http address)
https://github.com/zahir535/dropship-POS
6. git push -u origin main

// TO UPDATE THE LOCAL REPO TO GITHUB REPO
1. git add .
2. git commit -m "second commit/any message"
3. git push

//TO CHECK WHETHER THE LOCAL REPO IS UP TO DATE WITH THE GITHUB REPO
git push --set-upstream origin main

//…or create a new repository on the command line
echo "# dropship-POS" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/zahir535/dropship-POS.git
git push -u origin main

//…or push an existing repository from the command line
git remote add origin https://github.com/zahir535/dropship-POS.git
git branch -M main
git push -u origin main