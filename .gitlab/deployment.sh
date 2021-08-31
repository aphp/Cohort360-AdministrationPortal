#!/usr/bin/bash

ENVIRONMENT=${CI_COMMIT_BRANCH/_/-}

# @todo: rm after cache is enabled + CHANGE Dockerfile_tmp FOR Dockerfile
sed -i "s/{{ENVIR}}/$CI_COMMIT_BRANCH/g" Dockerfile_tmp
echo "{\"auths\":{\"$HARBOR_REGISTRY\":{\"username\":\"$BOT_NAME\",\"password\":\"$BOT_TOKEN\"}}}" > /kaniko/.docker/config.json
/kaniko/executor --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/Dockerfile_tmp --destination $HARBOR_REPOSITORY_URL/portail:$CI_COMMIT_BRANCH

#sed -i "s/{{ENVIR}}/$CI_COMMIT_BRANCH/g" Dockerfile
#echo "{\"auths\":{\"$HARBOR_REGISTRY\":{\"username\":\"$BOT_NAME\",\"password\":\"$BOT_TOKEN\"}}}" > /kaniko/.docker/config.json
#/kaniko/executor --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/Dockerfile --destination $HARBOR_REPOSITORY_URL/portail:$CI_COMMIT_BRANCH
