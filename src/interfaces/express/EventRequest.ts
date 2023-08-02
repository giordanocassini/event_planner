import UserRequest from './UserRequest';
import { Event } from '../../entities/Event'

export default interface EventRequest extends UserRequest {
    myEvent: Event;
}