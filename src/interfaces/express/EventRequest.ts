import UserRequest from './UserRequest';

export default interface EventRequest extends UserRequest {
    event: Event;
}