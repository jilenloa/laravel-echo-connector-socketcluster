import { Connector } from './connector';
import {
    SocketClusterChannel,
    SocketClusterPrivateChannel, SocketClusterPresenceChannel
} from './../channel';
import {SCClientSocket} from "socketcluster-client";


/**
 * This class creates a connnector to a SocketCluster server.
 */
export class SocketClusterConnector {
    /**
     * The SocketCluster connection instance.
     */
    socket: SCClientSocket;

    /**
     * All of the subscribed channel names.
     */
    channels: {[id: string]: any} = {};

    /**
     * Default connector options.
     */
    private _defaultOptions: any = {
        auth: {
            headers: {},
        },
        authEndpoint: '/broadcasting/auth',
        broadcaster: 'pusher',
        csrfToken: null,
        host: null,
        key: null,
        namespace: 'App.Events',
    };

    /**
     * Connector options.
     */
    options: any;

    /**
     * Create a new class instance.
     */
    constructor(options: any) {
        // when options is empty, constructor is being tested using isConstructor in Echo
        if(options){
            this.setOptions(options);
            this.connect();
        }
    }

    /**
     * Merge the custom options with the defaults.
     */
    protected setOptions(options: any): any {
        this.options = Object.assign(this._defaultOptions, options);

        if (this.csrfToken()) {
            if(typeof this.options.auth === typeof undefined){
                this.options["auth"] = {
                    headers: {
                        'X-CSRF-TOKEN':''
                    }
                }
            }else if(typeof this.options.auth.headers === typeof undefined){
                this.options.auth["headers"] = {
                    'X-CSRF-TOKEN':''
                }
            }
            this.options.auth.headers['X-CSRF-TOKEN'] = this.csrfToken();
        }

        return options;
    }

    /**
     * Extract the CSRF token from the page.
     */
    protected csrfToken(): string {
        let selector;

        if (typeof window !== 'undefined' && window['Laravel'] && window['Laravel'].csrfToken) {
            return window['Laravel'].csrfToken;
        } else if (this.options.csrfToken) {
            return this.options.csrfToken;
        } else if (typeof document !== 'undefined' && (selector = document.querySelector('meta[name="csrf-token"]'))) {
            return selector.getAttribute('content');
        }

        return null;
    }

    /**
     * Create a fresh SocketCluster connection.
     */
    connect(): void {
        let socketCluster = this.getSocketCluster();
        this.socket = socketCluster.create(this.options.socketcluster || {});
    }

    /**
     * Get socket.io module from global scope or options.
     */
    getSocketCluster(): any {
        if (typeof socketClusterClient !== 'undefined') {
            return socketClusterClient;
        }

        if (typeof this.options.client !== 'undefined') {
            return this.options.client;
        }

        throw new Error('SocketCluster client not found. Should be globally available or passed via options.client');
    }

    /**
     * Listen for an event on a channel instance.
     */
    listen(name: string, event: string, callback: Function): SocketClusterChannel {
        console.log('connector about to listen on event: '+event);
        console.log('channel '+name);
        return this.channel(name).listen(event, callback);
    }

    /**
     * Get a channel instance by name.
     */
    channel(name: string): SocketClusterChannel {
        if (!this.channels[name]) {
            this.channels[name] = new SocketClusterChannel(
                this.socket,
                name,
                this.options
            );
        }

        return this.channels[name];
    }

    /**
     * Get a private channel instance by name.
     */
    privateChannel(name: string): SocketClusterPrivateChannel {
        if (!this.channels['private-' + name]) {
            this.channels['private-' + name] = new SocketClusterPrivateChannel(
                this.socket,
                'private-' + name,
                this.options
            );
        }

        return this.channels['private-' + name];
    }

    /**
     * Get a presence channel instance by name.
     */
    presenceChannel(name: string): SocketClusterPresenceChannel {
        if (!this.channels['presence-' + name]) {
            this.channels['presence-' + name] = new SocketClusterPresenceChannel(
                this.socket,
                'presence-' + name,
                this.options
            );
        }

        return this.channels['presence-' + name];
    }

    /**
     * Leave the given channel, as well as its private and presence variants.
     */
    leave(name: string): void {
        let channels = [name, 'private-' + name, 'presence-' + name];

        channels.forEach(name => {
            this.leaveChannel(name);
        });
    }

    /**
     * Leave the given channel.
     */
    leaveChannel(name: string): void {
        if (this.channels[name]) {
            this.channels[name].unsubscribe();

            delete this.channels[name];
        }
    }

    /**
     * Get the socket ID for the connection.
     */
    socketId(): string {
        return this.socket.id;
    }

    /**
     * Disconnect SocketCluster connection.
     */
    disconnect(): void {
        this.socket.disconnect();
    }
}
