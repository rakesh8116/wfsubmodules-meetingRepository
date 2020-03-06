import { getProfileById, getUserProfileId } from '@modules/profile/selectors';
import { MeetingModel } from '@models/Meetings';
import { ObjectMapper } from 'json-object-mapper';
import { MeetingConstantsConfig } from '@constants/config';

export const getMeetingRequests = (state: any): MeetingModel[] => {
  const profileId = getUserProfileId(state);
  const requestedMeetings: MeetingModel[] = [];
  if ( state.meetings === undefined || state.meetings.pending === undefined ) {
    return [];
  }
  const pendingMeetings = state.meetings.pending;

  pendingMeetings.forEach((pendingMeeting: MeetingModel): void => {
    if ( pendingMeeting.getRequestedBy() !== profileId ) {
      const requestedMeeting = ObjectMapper.deserialize(MeetingModel, pendingMeeting);
      requestedMeeting.setProfile(getProfileById(state, pendingMeeting.getRequestedBy()));
      requestedMeetings.push(requestedMeeting);
    }
  });
  return requestedMeetings;
};

export const getUpcomingMeetingsSelector = (state: any): MeetingModel[] | [] => {
  const profileId = getUserProfileId(state);
  const Meetings: MeetingModel[] = [];
  if ( state.meetings === undefined || state.meetings.upcomingMeetings === undefined ) {
    return [];
  }
  const getUpcomingMeetingsSelectors: MeetingModel[] = state.meetings.upcomingMeetings;
  getUpcomingMeetingsSelectors.forEach((upcomingMeeting: MeetingModel): void => {
    if ( upcomingMeeting.getRequestedBy() !== profileId ) {
      const requestedMeeting = ObjectMapper.deserialize(MeetingModel, upcomingMeeting);
      requestedMeeting.setProfile(getProfileById(state, upcomingMeeting.getRequestedBy()));
      Meetings.push(requestedMeeting);
    } else if ( upcomingMeeting.getRequestedTo() !== profileId ) {
      const requestedMeeting = ObjectMapper.deserialize(MeetingModel, upcomingMeeting);
      requestedMeeting.setProfile(getProfileById(state, upcomingMeeting.getRequestedTo()));
      Meetings.push(requestedMeeting);
    }
  });
  return Meetings.slice(0, MeetingConstantsConfig.UPCOMING_MEETINGS_LIMIT);
};

export const getMeetingsDetails = (state: any): MeetingModel => {
  if ( state.meetingDetails === undefined || state.meetingDetails.meetingDetails === undefined ) {
    return {} as MeetingModel;
  }
  const meeting = state.meetingDetails.meetingDetails;
  if ( meeting !== null && !meeting.getProfile() ) {
    const profileId = getUserProfileId(state);
    if ( meeting.getRequestedBy() !== profileId ) {
      meeting.setProfile(getProfileById(state, meeting.getRequestedBy()));
    } else if ( meeting.getRequestedTo() !== profileId ) {
      meeting.setProfile(getProfileById(state, meeting.getRequestedTo()));
    }
  }
  return meeting;
};

export const getUpcomingMeetingsError = (state: any): string => {
  if ( !state.meetings || !state.meetings.error || !state.meetings.error.upcomingMeetings ) {
    return '';
  }
  return state.meetings.error.upcomingMeetings;
};

export const getLoading = (state: any): boolean => {
  if ( state.meetings === undefined || state.meetings.loaders === undefined ||
    state.meetings.loaders.upcomingMeetings === undefined ) {
    return false;
  }
  return state.meetings.loaders.upcomingMeetings;
};

export const getPendingMeetingsError = (state: any): string => {
  if ( !state.meetings || !state.meetings.error || !state.meetings.error.pending ) {
    return '';
  }
  return state.meetings.error.pending;
};

export const getPendingMeetingsLoading = (state: any): boolean => {
  if ( !state.meetings || !state.meetings.loaders || !state.meetings.loaders.pending ) {
    return false;
  }
  return state.meetings.loaders.pending;
};

export const getUpdateMeetingStatusError = (state: any): string => {
  if ( !state.meetings || !state.meetings.error || !state.meetings.error.updateStatus ) {
    return '';
  }
  return state.meetings.error.updateStatus;
};

export const getUpdateMeetingStatusLoading = (state: any): boolean => {
  if ( !state.meetings || !state.meetings.loaders || !state.meetings.loaders.updateStatus ) {
    return false;
  }
  return state.meetings.loaders.updateStatus;
};

export const getIsLastPageReached = (state: any): boolean => {
  if ( state.meetings === undefined || state.meetings.isLastMeetingRequestPage === undefined ) {
    return true;
  }
  return state.meetings.isLastMeetingRequestPage;
};

export const getSeeAllDataLoading = (state: any): boolean => {
  if ( state.meetings === undefined || state.meetings.loaders === undefined ||
    state.meetings.loaders.seeAllData === undefined ) {
    return false;
  }
  return state.meetings.loaders.seeAllData;
};
// tslint:disable-next-line:no-shadowed-variable
export const getMeetingDetailsLoading = (state: any): boolean => {
  if ( state.meetingDetails === undefined || state.meetingDetails.loaders === undefined ||
    state.meetingDetails.loaders.meetingDetails === undefined ) {
    return false;
  }
  return state.meetingDetails.loaders.meetingDetails;
};

export const getMeetingsDetailByDate = (state: any): MeetingModel[] => {
  const profileId = getUserProfileId(state);
  const meetingDetail: MeetingModel[] = state.calendar.meetingDetailsByDate || [];
  meetingDetail.forEach((details) => {
    if ( details ) {
      if ( details.getRequestedBy() !== profileId ) {
        details.setProfile(getProfileById(state, details.getRequestedBy()));
      } else if ( details.getRequestedTo() !== profileId ) {
        details.setProfile(getProfileById(state, details.getRequestedTo()));
      }
      details.setMeetingValues();
    }
  });
  return meetingDetail;
};

export const getIsMeetingCreated = (state: any): { status: string, message: string } => {
  if ( state.meetings === undefined || state.meetings.isMeetingCreated === undefined ||
    state.meetings.isMeetingCreated.status === undefined ) {
    return {status: '', message: ''};
  }
  return state.meetings.isMeetingCreated;
};

export const getMeetingCreatedLoading = (state: any): boolean => {
  if ( state.meetings === undefined || state.meetings.loaders === undefined ||
    state.meetings.loaders.createMeeting === undefined ) {
    return false;
  }
  return state.meetings.loaders.createMeeting;
};
