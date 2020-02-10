<p align="center"><img src="https://laravel.com/assets/img/components/logo-echo.svg"></p>

## Usage

This package requires the latest laravel-echo package to function.

    import Echo from "laravel-echo";
    import SocketClusterConnector from "laravel-echo-connector-socketcluster";
    
    let echo = new Echo({
          broadcaster: SocketClusterConnector,
          //key: 'your-pusher-key',
          auth: {
            headers: {
            },
            hostname: 'localhost:8001', //optional
          },
          socketcluster: {
                hostname: 'localhost',
                port: 8001
            }
        });

## Introduction


In many modern web applications, WebSockets are used to implement realtime, live-updating user interfaces. When some data is updated on the server, a message is typically sent over a WebSocket connection to be handled by the client. This provides a more robust, efficient alternative to continually polling your application for changes.

To assist you in building these types of applications, Laravel makes it easy to "broadcast" your events over a WebSocket connection. Broadcasting your Laravel events allows you to share the same event names between your server-side code and your client-side JavaScript application.

Laravel Echo is a JavaScript library that makes it painless to subscribe to channels and listen for events broadcast by Laravel. You may install Echo via the NPM package manager.

## Documentation

Official documentation [is located here](https://laravel.com/docs/broadcasting).

