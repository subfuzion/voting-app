#/bin/sh
set -e

pkgs="database queue"

cd src
for p in $pkgs; do
    echo "test: $p"
    cd $p
    docker-compose -f docker-compose.test.yml up
    cd ..
done

