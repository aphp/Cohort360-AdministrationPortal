#!/usr/bin/bash

# source env var
export $(cat .gitlab/ci/env/${CI_COMMIT_BRANCH}.env | xargs)

# replace placeholders by env var

sed -i "s/{{ENVIR}}/$ENVIR/g" nginx.conf
sed -i "s/{{ENVIRONMENT}}/$ENVIRONMENT/g" nginx.conf
sed -i "s/{{ENVIR}}/$ENVIR/g" Dockerfile

# exit if all variables are not replaced
if find ./ -type f \( -name "nginx.conf" -o -name "Dockerfile" \) -print0 | xargs -0  grep -Fq {{
then
    echo "some variables are not replaced"
    find ./ -type f \( -name "nginx.conf" -o -name "Dockerfile" \) -print0 | xargs -0  grep -FH {{
    exit 1
else
    echo "All variables have been well replaced"
fi

echo "{\"auths\":{\"$HARBOR_REGISTRY\":{\"username\":\"$BOT_NAME\",\"password\":\"$BOT_TOKEN\"}}}" > /kaniko/.docker/config.json
/kaniko/executor --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/Dockerfile --destination $HARBOR_REPOSITORY_URL/portail:$ENVIR