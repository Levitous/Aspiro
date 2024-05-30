# Application Folder

## Purpose
The purpose of this folder is to store all the source code and related files for your team's application. Source code MUST NOT be in any other folder. <strong>YOU HAVE BEEN WARNED</strong>

You are free to organize the contents of the folder as you see fit. But remember your team is graded on how you use Git. This does include the structure of your application. Points will be deducted from poorly structured application folders.

## Please use the rest of the README.md to store important information for your team's application.

Setting up the Server:
  Using an Ubuntu server, install the following:
      - Node Version Manager
      - Node
      - Express
      - mysql
  Then setup mySQL with a user and password which the server can access. This must match the environment variables.
  Then clone this repo onto the server with "git clone", navigate to the application folder. Create a ".env" file
  and populate it with the following environmental variables:
      - DB_HOST = "localhost"
      - DB_NAME = "team6db" 
      - DB_USER = [your mysql db name]
      - DB_PASS = [your mysql db pass]
      - DB_PORT = "3306"
      - PORT = [your server port]
  After that, run the following commands and debug as necessary:
      > npm install --save
      > npm run builddb
      > npm start
