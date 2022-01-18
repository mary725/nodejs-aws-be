# nodejs-aws-be

## Deployment order (based on outputs references)

1. authorization-service
1. product-service
1. import-service

## Docker

### Docker commands

1. "docker images" - show all images
1. "docker image rm myimage" - remove image
1. "docker image inspect myimage" - detailed image information
1. "docker container ls" - show all containers
1. "docker run -i -t --rm -v ubuntu_tmp:/tmp --name test-container myimage bash" - run a container based on a created image and open bash
Notes:
--rm - a container will be removed automatically after stopping
-v ubuntu_tmp:/tmp - use volume to save data changes of container even after deleting the container to use on next startup
1. "docker build -t myimage ." - create an image
1. "docker build --target dependencies -t myPartialImage ." - create an image with the target stage

### Dockerfile linting

1. https://github.com/hadolint/hadolint
1. https://github.com/projectatomic/dockerfile_lint
