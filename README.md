# User account CRUD project
Test project, which implements auth and CRUD operations for user entity.

## Installation
1. Clone this repo.
2. Create PostgreSQL database and make "User" table using ```./prisma/schema.prisma``` file.
3. Change ```.env``` file with corresponding values.
4. Run ```npm i```. Then choose how you want to execute this project: using TypeScript or recompile it in JavaScript and then run. You can use any programm like Postman or if you have installed extension in your VS Code named "REST Client", you can make requests through ```./rest/auth.rest``` and ```./rest/crud.rest``` files.
####                _If you want to execute TypeScript code._
1. Run ```npm run dev```. Then make requests to http://localhost:````PORT```/```route_name```.
####                _If you want to execute JavaScript code._
1. Run ```npm run build```.
2. Run ```npm run start```.  Then make requests to http://localhost:````PORT```/```route_name```/.

## Functionality

#### Authentication
First, register your user by making request to '/register' and passing ```firstName```, ```lasstName```, ```email``` and ```password``` fields, or make request to '/registerAdmin' and providing additional ```rootPassword``` field to create user with admin rights. Your ```rootPassword``` field must match corresponding field in ```.env``` file to successfull admin registration.
After that make request to '/login' route to authenticate and recive JWT access and refresh tokens in your cookies. It is necessary for further work with CRUD operations.
You can make request to '/logout' route to logout and clear your access token and refresh token cookies.

#### CRUD operations
1. Update user.
   There are 2 variants of updating user: common by making request to '/update' route and for admins by making request to '/updateAny'. Common variant let you update only your own account, while admin variant can update any account and give them admin rights. In both variants you can update your first name, last name, email and password, however, if you provide empty field or already existing email, it will not change.
2. Delete user.
   As in example above, here is same logic for deleting: common variant for your own account ('/delete') and admin variant for any account ('/deleteAny').
3. Get all users.
   Available only for admins. Making request on '/getAll' with admin rights will return you list of all registred users.
4. Get one user.
   Available only for admins. Making request on '/getOne/```id_number```' with admin rights will return you user with provided id or message, which informs you, that there is no user with this id.

Making requests to admin routes without such rights, you will recieve with ```Unauthorized``` message.

Making requests with expired/invalid refresh token or without tokens at all in your cookies, you will recieve you with message, that ask you to login.
