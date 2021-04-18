# MaMed Server

## Steps to run locally
- Turn on mongodb server
- create .env on root of the project

```
DB_DEVELOPMENT="mamed-dev"
DB_TEST="mamed-test"
DB_PRODUCTION="mamed"
JWT_SECRET="muhammad-mamed"
```

- `node seeders/seed-admin.js`
- `npm run dev` 

notes: this works when mongodb active on PORT 27017

## Linux notes
### For checking is mongodb server active or not
- `sudo service mongod start`
- `sudo service mongod status`
- `ctrl+c`