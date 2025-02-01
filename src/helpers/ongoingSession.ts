import { Session } from "@/constants/schools";

export const getOngoingSession = (sessions: Session[]): { session: string; ongoingTerm: number } | undefined => {
    for (const session of sessions) {
        if (session.firstTerm.sessionState === 'ongoing') {
          return { session: session.session, ongoingTerm: 1 };
        }
        if (session.secondTerm.sessionState === 'ongoing') {
          return { session: session.session, ongoingTerm: 2 };
        }
        if (session.thirdTerm.sessionState === 'ongoing') {
          return { session: session.session, ongoingTerm: 3 };
        }
      }
      return undefined;
  }