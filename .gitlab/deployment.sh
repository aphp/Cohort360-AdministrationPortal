#!/usr/bin/bash

ENVIRONMENT=${CI_COMMIT_BRANCH/_/-}
IMAGE_REPOSITORY_URL_SED=$(echo $IMAGE_REPOSITORY_URL | sed "s/[^a-zA-Z0-9]/\\\\&/g");

sed -i "s/{{ENVIR}}/$CI_COMMIT_BRANCH/g" Dockerfile
sed -i "s/{{IMAGE_REPOSITORY_URL}}/$IMAGE_REPOSITORY_URL_SED/g" Dockerfile
echo "{\"auths\":{\"$IMAGE_REGISTRY\":{\"username\":\"$BOT_NAME\",\"password\":\"$BOT_TOKEN\"}}}" > /kaniko/.docker/config.json
/kaniko/executor --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/Dockerfile --destination $IMAGE_REPOSITORY_URL/portail:$CI_COMMIT_BRANCH
