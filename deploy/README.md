# Deploy to ...

Deploy options for `main` and `dev` environments.

### Servers

- `main` deployed in Hetzner `falkesi`, account `socialcap-main`.
- `dev` deployed in Htezner `helsina`, account `socialcap-dev`.

### Nginx configurations

- `main`: use `services.socialcap-main.conf` 
- `dev`: use `services.socialcap-dev.conf` 

### Build and start Docker containers

1. Login to the corresponding account, for example `socialcap-main`.

2. Set the branch ENV
~~~
export BRANCH=main
~~~

3. Cd to the `~/services` folder 

4. Update the branch
~~~
git pull origin $BRANCH
~~~

5. Build (or rebuild) the images
~~~
sudo sh deploy/rebuild-images.sh $BRANCH
~~~

6. Restart the containers 
~~~
sudo sh deploy/restart-containers.sh $BRANCH
~~~





