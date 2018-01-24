# Kubernetes deployment

You can deploy the voting app using the following commands:

```
kubectl create -f database-pod.yml -f database-service.yml -f queue-pod.yml -f queue-service.yml -f vote-pod.yml -f vote-service.yml -f worker-pod.yml

```

Make sure the application is up and running by running the following command:
```
$ kubectl get all
NAME              READY     STATUS    RESTARTS   AGE
po/database-pod   1/1       Running   0          18m
po/queue-pod      1/1       Running   0          18m
po/vote-pod       1/1       Running   0          18m
po/worker-pod     1/1       Running   0          18m

NAME             TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)     AGE
svc/database     ClusterIP   10.104.253.109   <none>        27017/TCP   18m
svc/kubernetes   ClusterIP   10.96.0.1        <none>        443/TCP     5h
svc/queue        ClusterIP   10.102.1.53      <none>        6379/TCP    18m
svc/vote         ClusterIP   10.97.32.80      <none>        3000/TCP    18m
```

You can now vote:

```
$ kubectl run voter --rm -i --tty --image voter --image-pull-policy=IfNotPresent -- vote
If you don't see a command prompt, try pressing enter.
? What do you like better?
❯ (quit)
  cats
  dogs

```

You can check the vote results:
```
$ kubectl run voter --rm -i --tty --image voter --image-pull-policy=IfNotPresent -- results
If you don't see a command prompt, try pressing enter.
Total votes -> cats: 0, dogs: 1 ... DOGS WIN!
```

When you're done, remove the application using the following command:
```
$ kubectl delete po/database-pod po/queue-pod po/vote-pod po/worker-pod svc/database svc/queue svc/vote
```
