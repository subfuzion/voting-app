#/bin/sh
set -e

pkgs="database queue"

cd src
for p in $pkgs; do
    echo "test: $p"
    cd $p
    yarn
    npm test
    cd ..
done

