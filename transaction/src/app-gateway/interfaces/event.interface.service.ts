import {Observable} from 'rxjs';
import {Server, Socket} from 'socket.io';

/**
 * EventCallback type
 *
 * This type is a function that takes a Server and a Map of clients as parameters.
 * It does not return a value.
 *
 * @param server - The Server instance.
 * @param clients - A Map of client Sockets.
 */
export declare type EventCallback = (server: Server, clients: Map<string, Socket>) => void;

/**
 * IEventSubject interface
 *
 * This interface represents an event subject. It has a single property, `callback`,
 * which is a function of type EventCallback.
 *
 * @property callback - A function of type {@link EventCallback} that is called when the event is emitted.
 */
export interface IEventSubject {
    callback: EventCallback;
}

/**
 * IEventService interface
 *
 * This interface represents an event service. It has two methods:
 *
 * - `addEvent(callback: EventCallback)`: This method takes a callback function of type EventCallback as a parameter.
 *   It does not return a value.
 *
 * - `getEventSubject$()`: This method does not take any parameters. It returns an Observable that emits objects of type IEventSubject.
 *
 * @method addEvent - A method that takes a callback function of type {@link EventCallback} as a parameter. It does not return a value.
 * @method getEventSubject$ - A method that does not take any parameters. It returns an Observable of type {@link Observable}<{@link IEventSubject}> that emits objects of type IEventSubject.
 */
export interface IEventService {
    addEvent(callback: EventCallback): void;

    getEventSubject$(): Observable<IEventSubject>;
}