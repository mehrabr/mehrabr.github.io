---
layout: post
title: "what if we could cd into another computer"
date: 2026-06-06 09:00:00 -0700
categories: [Teaching]
tags: [teaching, bootcamp, training, networking, http, bash, curl, unix]
---

Every cohort, when I introduced networking, someone would ask that question. Half curiosity, half joke. They'd just learned `cd` and were wondering how far the logic extended.

Further than the curriculum lets on.

---

I.

Unix was designed at Bell Labs around one idea: everything is a file. Your keyboard is a file. Your screen is a file. Processes communicate through files. If you could read and write a file, you could operate on anything the system exposed, using the same handful of tools — `cat`, `cp`, `echo`, redirection.

When Tim Berners-Lee designed URLs in 1989, he borrowed the `/` separator from Unix paths. `http://example.com/users/1` looks the way it does because the people designing it thought in terms of navigating a directory tree. A server is a filesystem you reach over a wire. The path after the host is the path to the resource.

That assumption is baked into the syntax. Nobody teaches it anymore.

---

II.

Bash has had the answer since the mid-90s.

```bash
exec 3<>/dev/tcp/www.google.com/80
echo -e "GET / HTTP/1.1\r\nHost: www.google.com\r\nConnection: close\r\n\r\n" >&3
cat <&3
```

`/dev/tcp/www.google.com/80` is a path. Everything else is redirection.

The students who asked "what if we could `cd` into another computer" were asking about `/dev/tcp`.

---

III.

What's going over that connection is text:

```
GET / HTTP/1.1
Host: www.google.com
Connection: close

```

A request line, headers as `key: value` pairs, a blank line. The server responds in the same format. You can write the request to a file and pipe it through `nc`:

```bash
echo -en 'GET /index.html HTTP/1.1\r\nHost: revature.com\r\n\r\n' > request
cat request | nc -w 1 revature.com 80 > response
```

The same tool runs a server.

```bash
while true; do
  echo -e "HTTP/1.1 200 OK\n\n$(cat index.html)" | nc -l -w1 -p 8080
done
```

"But that's not a real server." It's serving HTTP over TCP. Whatever distinction you're drawing is about scale.

---

IV.

```bash
_get ()
{
  IFS=/ read proto z host query <<< "$1"
  exec 3<>/dev/tcp/$host/80
  {
    echo GET /$query HTTP/1.1
    echo connection: close
    echo host: $host
    echo
  } >&3
  sed '1,/^$/d' <&3
}
```

Call it: `_get http://example.com/`. This is curl. The real one handles TLS, redirects, a hundred protocols. The operation is the same.

---

The typical HTTP curriculum skips this because the people who wrote it had internalized it completely. By Spring or Express, the "everything is a file" assumption was infrastructure nobody thought to mention.

The answer to the `cd` question was already in the tools. The students had the right model. Nobody told them.
