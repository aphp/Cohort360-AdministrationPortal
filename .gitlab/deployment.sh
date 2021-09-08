#!/usr/bin/bash

ENVIRONMENT=${CI_COMMIT_BRANCH/_/-}
IMAGE_REPOSITORY_URL=$(echo $IMAGE_REPOSITORY_URL | sed "s/[^a-zA-Z0-9]/\\\\&/g");

# @todo: rm after cache is enabled + CHANGE Dockerfile_tmp FOR Dockerfile
sed -i "s/{{ENVIR}}/$CI_COMMIT_BRANCH/g" Dockerfile_tmp
sed -i "s/{{IMAGE_REPOSITORY_URL}}/$IMAGE_REPOSITORY_URL/g" Dockerfile_tmp
echo "{\"auths\":{\"$IMAGE_REGISTRY\":{\"username\":\"$BOT_NAME\",\"password\":\"$BOT_TOKEN\"}}}" > /kaniko/.docker/config.json
/kaniko/executor --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/Dockerfile_tmp --destination $IMAGE_REPOSITORY_URL/portail:$CI_COMMIT_BRANCH

#sed -i "s/{{ENVIR}}/$CI_COMMIT_BRANCH/g" Dockerfile
#sed -i "s/{{IMAGE_REPOSITORY_URL}}/$IMAGE_REPOSITORY_URL/g" Dockerfile
#echo "{\"auths\":{\"$IMAGE_REGISTRY\":{\"username\":\"$BOT_NAME\",\"password\":\"$BOT_TOKEN\"}}}" > /kaniko/.docker/config.json
#/kaniko/executor --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/Dockerfile --destination $IMAGE_REPOSITORY_URL/portail:$CI_COMMIT_BRANCH
