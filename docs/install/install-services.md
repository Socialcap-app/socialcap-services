
# Install Socialcap services 

## Using Docker

Create `socialcap` folder:
~~~
sudo mkdir /home/socialcap
~~~

The `/home/socialcap` folder must contain:
- `~/dbs`: database hourly backups 
- `~/run`: utility run scripts
- `~/ui`: the App UI repo
- `~/services`: the services repo: `github.com:Socialcap-app/socialcap-services.git`. MUST create/edit the `.env.devnet` and/or `.env.mainnet` environment files (these files are not in the repo).
- `~/var`: the /var folder used (inside docker) to store the KVStore and other files. MUST chown to `www-data:www-data` as the docker container runs with those permissions.

### Running services for `mainnet`

Update the repo using the `main` branch:
~~~
cd ~/services
git pull origin main
~~~

Update the DB schema:
~~~
npx prisma migrate dev
~~~

Rebuild and restart docker containers, using the `.env.mainnet` file:
~~~
sudo sh docker/rebuild-all.sh mainnet
sudo sh docker/restart-all.sh
~~~

### Running services for `devnet`

Update the repo using the `dev` branch.
Update the DB schema.
Rebuild and restart docker containers, using the `.env.devnet` file:
~~~
cd ~/services
git pull origin dev
npx prisma migrate dev
sudo sh docker/rebuild-all.sh devnet
sudo sh docker/restart-all.sh
~~~
