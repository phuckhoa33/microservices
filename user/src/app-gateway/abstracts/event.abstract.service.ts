import {EventCallback, IEventService, IEventSubject} from '../interfaces/event.interface.service';
import {Observable, Subject} from 'rxjs';

/**
 * EventAbstractService abstract class
 *
 * This abstract class provides a base for event services in the application.
 * It implements the {@link IEventService} interface and provides a basic implementation for event handling.
 *
 * Properties:
 *
 * - eventSubject$: {@link IEventSubject}
 *   A RxJS Subject that emits events of type IEventSubject.
 */
export abstract class EventAbstractService implements IEventService {
    private eventSubject$ = new Subject<IEventSubject>();

    /**
     * addEvent method
     *
     * This method is used to add a new event to the service. It takes a callback function as a parameter,
     * which is called when the event is emitted. The callback function is wrapped in an {@link IEventSubject} object
     * and emitted through the eventSubject$ Subject.
     *
     * @param callback - A callback function of type {@link EventCallback} that is called when the event is emitted.
     */
    addEvent(callback: EventCallback): void {
        this.eventSubject$.next({callback: callback});
    }

    /**
     * getEventSubject$ method
     *
     * This method is used to get an Observable of the event subject. It returns an Observable that emits
     * objects of type {@link IEventSubject}. The IEventSubject object has a single property:
     * - callback: A function that is called when the event is emitted.
     *
     * @returns An Observable of type {@link Observable}<{@link IEventSubject}> that emits objects of type IEventSubject.
     */
    getEventSubject$(): Observable<IEventSubject> {
        return this.eventSubject$.asObservable();
    }
}