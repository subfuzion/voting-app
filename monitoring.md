# Docker monitoring

Monitoring a containerized environment requires to:
 - gather metrics from the monitored components
 - store them in a database
 - display them as dashboards
 - define what is considered an alarm and when and where an alert should be sent

We'll show here how to implement it around [Prometheus](https://prometheus.io/).

## Architecture

![Prometheus architecture](https://prometheus.io/assets/architecture.svg)

## Gather metrics

[cadvisor](https://github.com/google/cadvisor) provides Prometheus metrics about the Docker engine and Docker containers on the host.

    docker run \
        --volume=/:/rootfs:ro \
        --volume=/var/run:/var/run:rw \
        --volume=/sys:/sys:ro \
        --volume=/var/lib/docker/:/var/lib/docker:ro \
        --volume=/dev/disk/:/dev/disk:ro \
        --detach=true \
        --network bridgenet \
        --publish 8080:8080 \
        --name=cadvisor google/cadvisor:v0.28.3 

Check that metrics are served:

    curl localhost:8080/metrics

Metrics from the host can also be useful, they can be provided by node-exporter:

    docker run --network bridgenet \
        --name=system \
        --detach=true \
        --volume=/proc:/host/proc:ro \
        --volume=/sys:/host/sys:ro \
        --volume=/:/rootfs \
        --volume=/var/run/docker.sock:/var/run/docker.sock:ro \
        --publish 9100:9100 \
        prom/node-exporter:v0.15.2 \
        --path.procfs /host/proc --path.sysfs /host/sys --collector.filesystem.ignored-mount-points '^/(sys|proc|dev|host|etc|var|rootfs/var/lib/docker|rootfs/run/docker/netns|rootfs/sys/kernel/debug)($$|/)'

Check that metrics are served:

    curl localhost:9100/metrics

## Store the data

    docker run \
        --detach=true \
        -v $PWD/prometheus.yml:/etc/prometheus/prometheus.yml \
        --name metrics \
        --network bridgenet \
        --publish 9090:9090 \
        prom/prometheus:v2.0.0

Open Prometheus in your browser: [localhost:9090](http://localhost:9090/).

## Display the data

    docker run \
        --detach=true \
        --publish 80:3000 \
        --network bridgenet \
        --name dashboard \
        grafana/grafana:4.6.3

Open Grafana in your browser: [localhost:80](http://localhost/).

## Next: instrumenting the application

Adding metrics to your application will help building an efficient alerting. Have a look at the [official documentation](https://prometheus.io/docs/introduction/overview/).
