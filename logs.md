# Logs

Logs are key to understanding what is happening inside your application.
The logs are particularly useful for debugging problems and monitoring activity.
The easiest and most embraced logging method for containerized applications is to write to the standard output and standard error streams.

UNIX and Linux commands typically open three I/O streams when they run:

 * standard input: the command’s input stream, which may include input from the keyboard or input from another command,
 * standard output: Usually a command’s normal output,
 * standard error: Typically used to output error messages.
  
By default, `docker logs` shows the command’s standard output and standard error.

You need to make sure that your application is actually logging to the standard streams if you want to rely on docker logging feature.
If your application is logging to something else, e.g. a log file or `syslog`, you won't be able to access the logs of your container using the `docker logs` command.

## `docker logs`

The `docker logs` command is a simple command taking a unique mandatory parameter which is the name or ID of the container you want to get the logs from.

After running the application following the [README](README.md), you should have the following containers running:
```
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                    PORTS               NAMES
ae4e2802f68a        vote                "npm start"              9 minutes ago       Up 9 minutes              3000/tcp            vote
2ea0038b0e92        worker              "npm start"              10 minutes ago      Up 10 minutes                                 worker
df9a4ca3b2b8        redis               "docker-entrypoint.s…"   11 minutes ago      Up 11 minutes (healthy)   6379/tcp            queue
9fc492b570d6        mongo               "docker-entrypoint.s…"   11 minutes ago      Up 11 minutes             27017/tcp           database
``` 

You can display logs from any of these containers using their name or ID, for instance:
`docker logs database` (by name) or `docker logs 9fc492b570d6` (by ID) should give you the same output:

```
$ docker logs database
2018-01-17T21:41:38.702+0000 I CONTROL  [initandlisten] MongoDB starting : pid=1 port=27017 dbpath=/data/db 64-bit host=9fc492b570d6
2018-01-17T21:41:38.702+0000 I CONTROL  [initandlisten] db version v3.6.2
2018-01-17T21:41:38.702+0000 I CONTROL  [initandlisten] git version: 489d177dbd0f0420a8ca04d39fd78d0a2c539420
2018-01-17T21:41:38.702+0000 I CONTROL  [initandlisten] OpenSSL version: OpenSSL 1.0.1t  3 May 2016
2018-01-17T21:41:38.702+0000 I CONTROL  [initandlisten] allocator: tcmalloc
2018-01-17T21:41:38.702+0000 I CONTROL  [initandlisten] modules: none
2018-01-17T21:41:38.702+0000 I CONTROL  [initandlisten] build environment:
2018-01-17T21:41:38.702+0000 I CONTROL  [initandlisten]     distmod: debian81
2018-01-17T21:41:38.702+0000 I CONTROL  [initandlisten]     distarch: x86_64
2018-01-17T21:41:38.702+0000 I CONTROL  [initandlisten]     target_arch: x86_64
2018-01-17T21:41:38.702+0000 I CONTROL  [initandlisten] options: { net: { bindIpAll: true } }
2018-01-17T21:41:38.702+0000 I STORAGE  [initandlisten]
2018-01-17T21:41:38.702+0000 I STORAGE  [initandlisten] ** WARNING: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine
2018-01-17T21:41:38.702+0000 I STORAGE  [initandlisten] **          See http://dochub.mongodb.org/core/prodnotes-filesystem
2018-01-17T21:41:38.702+0000 I STORAGE  [initandlisten] wiredtiger_open config: create,cache_size=3474M,session_max=20000,eviction=(threads_min=4,threads_max=4),config_base=false,statistics=(fast),log=(enabled=true,archive=true,path=journal,compressor=snappy),file_manager=(close_idle_time=100000),statistics_log=(wait=0),verbose=(recovery_progress),
2018-01-17T21:41:38.734+0000 I CONTROL  [initandlisten]
2018-01-17T21:41:38.734+0000 I CONTROL  [initandlisten] ** WARNING: Access control is not enabled for the database.
2018-01-17T21:41:38.734+0000 I CONTROL  [initandlisten] **          Read and write access to data and configuration is unrestricted.
2018-01-17T21:41:38.734+0000 I CONTROL  [initandlisten]
2018-01-17T21:41:38.735+0000 I STORAGE  [initandlisten] createCollection: admin.system.version with provided UUID: 9623f2b3-6def-4c3d-b41d-0ee019416c12
2018-01-17T21:41:38.741+0000 I COMMAND  [initandlisten] setting featureCompatibilityVersion to 3.6
2018-01-17T21:41:38.743+0000 I STORAGE  [initandlisten] createCollection: local.startup_log with generated UUID: 602d1a2b-bac8-4aa3-809a-5d69f4f766b7
2018-01-17T21:41:38.753+0000 I FTDC     [initandlisten] Initializing full-time diagnostic data capture with directory '/data/db/diagnostic.data'
2018-01-17T21:41:38.753+0000 I NETWORK  [initandlisten] waiting for connections on port 27017
2018-01-17T21:43:03.319+0000 I NETWORK  [listener] connection accepted from 172.18.0.4:50712 #1 (1 connection now open)
2018-01-17T21:43:03.325+0000 I NETWORK  [conn1] received client metadata from 172.18.0.4:50712 conn: { driver: { name: "nodejs", version: "2.2.34" }, os: { type: "Linux", name: "linux", architecture: "x64", version: "4.9.60-linuxkit-aufs" }, platform: "Node.js v9.4.0, LE, mongodb-core: 2.1.18" }
2018-01-17T21:44:05.617+0000 I NETWORK  [listener] connection accepted from 172.18.0.5:55584 #2 (2 connections now open)
2018-01-17T21:44:05.636+0000 I NETWORK  [conn2] received client metadata from 172.18.0.5:55584 conn: { driver: { name: "nodejs", version: "2.2.34" }, os: { type: "Linux", name: "linux", architecture: "x64", version: "4.9.60-linuxkit-aufs" }, platform: "Node.js v9.4.0, LE, mongodb-core: 2.1.18" }
2018-01-17T21:44:41.252+0000 I STORAGE  [conn1] createCollection: voting.votes with generated UUID: 6b1bb7cd-b2f5-4bf1-82a9-b7905ca8d0a5
2018-01-17T21:46:38.754+0000 I STORAGE  [thread3] createCollection: config.system.sessions with generated UUID: c224cb04-dbaa-43b8-be10-955a8af15f3a
2018-01-17T21:46:38.769+0000 I INDEX    [thread3] build index on: config.system.sessions properties: { v: 2, key: { lastUse: 1 }, name: "lsidTTLIndex", ns: "config.system.sessions", expireAfterSeconds: 1800 }
2018-01-17T21:46:38.769+0000 I INDEX    [thread3] 	 building index using bulk method; build may temporarily use up to 500 megabytes of RAM
2018-01-17T21:46:38.769+0000 W STORAGE  [thread3] failed to create WiredTiger bulk cursor: Device or resource busy
2018-01-17T21:46:38.769+0000 W STORAGE  [thread3] falling back to non-bulk cursor for index table:index-8--3698908704629436226
2018-01-17T21:46:38.769+0000 I INDEX    [thread3] build index done.  scanned 0 total records. 0 secs
$ 
```

## Options

### Following log stream

If you provide the `-f` or `--follow` parameter to the command, you will get the log stream itself, i.e. the command will continue streaming the new output from the container, for instance:

```
$ docker logs -f queue
1:C 17 Jan 21:41:42.910 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
1:C 17 Jan 21:41:42.911 # Redis version=4.0.6, bits=64, commit=00000000, modified=0, pid=1, just started
1:C 17 Jan 21:41:42.911 # Warning: no config file specified, using the default config. In order to specify a config file use redis-server /path/to/redis.conf
1:M 17 Jan 21:41:42.911 * Running mode=standalone, port=6379.
1:M 17 Jan 21:41:42.912 # WARNING: The TCP backlog setting of 511 cannot be enforced because /proc/sys/net/core/somaxconn is set to the lower value of 128.
1:M 17 Jan 21:41:42.912 # Server initialized
1:M 17 Jan 21:41:42.912 # WARNING you have Transparent Huge Pages (THP) support enabled in your kernel. This will create latency and memory usage issues with Redis. To fix this issue run the command 'echo never > /sys/kernel/mm/transparent_hugepage/enabled' as root, and add it to your /etc/rc.local in order to retain the setting after a reboot. Redis must be restarted after THP is disabled.
1:M 17 Jan 21:41:42.912 * Ready to accept connections
```

Not that this command is interactive, you will need to enter `Ctrl+C` to exit.

### Displaying timestamps

You can request `docker logs` to display timestamps using the `-t` or `--timestamps`, for instance:

```
$ docker logs vote -t
2018-01-17T21:44:05.282668586Z
2018-01-17T21:44:05.282791286Z > @subfuzion/vote@1.0.0 start /usr/src/app
2018-01-17T21:44:05.282802086Z > node app.js
2018-01-17T21:44:05.282811886Z
2018-01-17T21:44:05.643475886Z connected to database (database:27017)
2018-01-17T21:44:05.655662986Z listening on port 3000
2018-01-17T21:44:05.658581486Z connected to queue (queue:6379)
2018-01-17T21:44:05.663086986Z queue connection ready (queue:6379)
2018-01-17T21:44:41.244177686Z POST /vote: {"vote":"b"}
2018-01-17T21:44:41.252893786Z queued : {"vote":"b"}
2018-01-17T21:44:41.257827186Z POST /vote/ 200 19.929 ms - 38
2018-01-17T21:44:50.348605086Z GET /results
2018-01-17T21:44:50.353036286Z results: {"a":0,"b":1}
2018-01-17T21:44:50.353911986Z GET /results/ 200 5.273 ms - 39
2018-01-17T21:45:37.113044100Z GET /results
2018-01-17T21:45:37.114496374Z results: {"a":0,"b":1}
2018-01-17T21:45:37.114993325Z GET /results/ 200 1.893 ms - 39
2018-01-17T21:53:11.401609270Z GET /results
2018-01-17T21:53:11.402980284Z results: {"a":0,"b":1}
2018-01-17T21:53:11.403471139Z GET /results/ 200 1.775 ms - 39
2018-01-17T23:02:48.277271334Z POST /vote: {"vote":"b"}
2018-01-17T23:02:48.277748795Z queued : {"vote":"b"}
2018-01-17T23:02:48.278200169Z POST /vote/ 200 1.158 ms - 38
$ 
```

### Since, Until

You can also ask for the logs since or until a specific timestamp or duration. It helps narrowing logs to something more specific, for instance:

```
$ docker logs vote --since=5m
POST /vote: {"vote":"b"}
queued : {"vote":"b"}
POST /vote/ 200 1.158 ms - 38
$ 
```

### Reference

For more details on the `docker logs` command, you can check the reference documentation [here](https://docs.docker.com/engine/reference/commandline/logs/)
