1. React Native for frontend dev.
using react native, react & javascript components

2. Realm for local database.
persistence database to run the apps 
in the abscence of internet connection
import Realm from "realm";

3. axios to established connection
to the backend server of the apps

4. react-router-dom is when using browser
react-router-native when developing native app

5. picker in add new order modal page
react-native-picker.picker

6. Formik & Yup
- Formik is the package to create a form
- Yup is for validation
- See Review App project for examples 


AUTOMATIC BEAUTIFY VISUAL CODE
Shift - Alt - F

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