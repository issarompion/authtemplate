# authtemplate

Full stack project template with authentification using angular for frontend, express, jwt and mongoose for backend and cypress for testing

## get started 

```bash
$ git clone https://github.com/issarompion/authtemplate.git
$ cd authtemplate
```

### create a .env file in project folder

```
PROJECT_NAME=authtemplate
API_URI=http://localhost:3000
API_PORT=3000
DB_URI=mongodb://localhost:27027
FRONT_URI=http://localhost:4200
JWT_KET=authtemplate
SALT_FACTOR=10
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=*********
```

### install

```bash
$ npm install
$ npm run build:back
$ npm run build:front
```

### DEV : start in 2 consoles

```bash
$ npm run start:back
```

(dev mode) `$ npm run start:front` or (prod mode) `$ npm run prod:front`

### test

```bash
$ npm run test
```