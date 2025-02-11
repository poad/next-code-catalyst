#!/bin/sh

CUR=$(pwd)

CURRENT=$(cd $(dirname $0);pwd)
echo "${CURRENT}"

cd "${CURRENT}"
git pull --prune
result=$?
if [ $result -ne 0 ]; then
  cd "${CUR}"
  exit $result
fi
pwd
corepack use pnpm@latest && pnpm install && pnpm up -r && pnpm build && pnpm lint
result=$?
if [ $result -ne 0 ]; then
  cd "${CUR}"
  exit $result
fi

git commit -am "Bumps node modules" && git push
result=$?
if [ $result -ne 0 ]; then
  cd "${CUR}"
  exit $result
fi

cd "${CUR}"
