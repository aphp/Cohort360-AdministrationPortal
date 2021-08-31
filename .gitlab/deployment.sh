#!/usr/bin/bash

# replace placeholders by env var
ENVIRONMENT=${CI_COMMIT_BRANCH/_/-}
sed -i "s/{{ENVIR}}/$CI_COMMIT_BRANCH/g" nginx.conf
sed -i "s/{{ENVIRONMENT}}/$ENVIRONMENT/g" nginx.conf
sed -i "s/{{ENVIR}}/$CI_COMMIT_BRANCH/g" Dockerfile

# exit if all variables are not replaced
if find ./ -type f \( -name "nginx.conf" -o -name "Dockerfile" \) -print0 | xargs -0  grep -Fq {{
then
    echo "some variables are not replaced"
    find ./ -type f \( -name "nginx.conf" -o -name "Dockerfile" \) -print0 | xargs -0  grep -FH {{
    exit 1
else
    echo "All variables have been well replaced"
fi

# @todo: rm after cache is enabled
sed -i "s/{{ENVIR}}/$CI_COMMIT_BRANCH/g" Dockerfile_tmp

echo "{\"auths\":{\"$HARBOR_REGISTRY\":{\"username\":\"$BOT_NAME\",\"password\":\"$BOT_TOKEN\"}}}" > /kaniko/.docker/config.json
/kaniko/executor --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/Dockerfile_tmp --destination $HARBOR_REPOSITORY_URL/portail:$CI_COMMIT_BRANCH